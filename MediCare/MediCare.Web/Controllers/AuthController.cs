
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Identity;
using MediCare.Data.Models;
using MediCare.Services.DTOs.Auth;
using MediCare.Services.Interfaces;

namespace MediCare.Web.Controllers;

[ApiController]
[Route("api/auth")]
public class AuthController : ControllerBase
{
    private readonly UserManager<ApplicationUser> _userManager;
    private readonly ITokenService _tokenService;

    public AuthController(
        UserManager<ApplicationUser> userManager,
        ITokenService tokenService)
    {
        _userManager = userManager;
        _tokenService = tokenService;
    }

    [HttpPost("register")]
    public async Task<IActionResult> Register(RegisterDto dto)
    {
        var allowedRoles = new[] { "Patient", "Doctor" };

        if (!allowedRoles.Contains(dto.Role))
            return BadRequest(new { message = "Invalid role." });

        var existingUser = await _userManager.FindByEmailAsync(dto.Email);

        if (existingUser != null)
            return BadRequest(new { message = "Email already exists." });

        var user = new ApplicationUser
        {
            UserName = dto.Email,
            Email = dto.Email,
            FullName = dto.FullName,
            PhoneNumber = dto.PhoneNumber
        };

        var result = await _userManager.CreateAsync(
            user,
            dto.Password
        );

        if (!result.Succeeded)
        {
            return BadRequest(new
            {
                errors = result.Errors.Select(e => e.Description)
            });
        }

        await _userManager.AddToRoleAsync(user, dto.Role);

        return Ok(new
        {
            message = "Registration successful",
            userId = user.Id,
            role = dto.Role
        });
    }

    [HttpPost("login")]
    public async Task<IActionResult> Login(LoginDto dto)
    {
        var user = await _userManager.FindByEmailAsync(dto.Email);

        if (user == null)
            return Unauthorized(new { message = "Invalid email or password." });

        var validPassword = await _userManager.CheckPasswordAsync(
            user,
            dto.Password
        );

        if (!validPassword)
            return Unauthorized(new { message = "Invalid email or password." });

        var token = await _tokenService.CreateTokenAsync(user);

        return Ok(new
        {
            message = "Login successful",
            token,
            userId = user.Id,
            fullName = user.FullName,
            email = user.Email,
            roles = await _userManager.GetRolesAsync(user)
        });
    }
}
