
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using System.Security.Claims;
using MediCare.Data.UnitOfWork;
using MediCare.Data.Models;
using MediCare.Services.DTOs.Doctors;

namespace MediCare.Web.Controllers;

[ApiController]
[Route("api/doctors")]
public class DoctorsController : ControllerBase
{
    private readonly IUnitOfWork _unitOfWork;

    public DoctorsController(IUnitOfWork unitOfWork)
    {
        _unitOfWork = unitOfWork;
    }

    [Authorize(Roles = "Doctor")]
    [HttpPost("profile")]
    public async Task<IActionResult> CreateProfile(
        CreateDoctorProfileDto dto)
    {
        var userId = User.FindFirstValue(
            ClaimTypes.NameIdentifier);

        if (string.IsNullOrEmpty(userId))
            return Unauthorized();

        var existingProfile = await _unitOfWork.Doctors
            .FindAsync(d => d.UserId == userId);

        if (existingProfile.Any())
        {
            return BadRequest(new
            {
                message = "Doctor profile already exists."
            });
        }

        var doctorProfile = new DoctorProfile
        {
            UserId = userId,
            Specialization = dto.Specialization,
            ConsultationFee = dto.ConsultationFee,
            IsApproved = false
        };

        await _unitOfWork.Doctors.AddAsync(doctorProfile);

        await _unitOfWork.SaveAsync();

        return Ok(new
        {
            message = "Doctor profile created successfully.",
            doctorProfileId = doctorProfile.Id,
            userId = doctorProfile.UserId
        });
    }
}
