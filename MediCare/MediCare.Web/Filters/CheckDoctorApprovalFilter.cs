using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Filters;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;
using MediCare.Data.Context;

namespace MediCare.Web.Filters;

public class CheckDoctorApprovalFilter : IAsyncActionFilter
{
    private readonly ApplicationDbContext _context;

    public CheckDoctorApprovalFilter(ApplicationDbContext context)
    {
        _context = context;
    }

    public async Task OnActionExecutionAsync(ActionExecutingContext context, ActionExecutionDelegate next)
    {
        // Administrators have full access across all operations
        if (context.HttpContext.User.IsInRole("Admin"))
        {
            await next();
            return;
        }

        var doctorIdObj = context.RouteData.Values["doctorId"] ?? context.HttpContext.Request.Query["doctorId"].FirstOrDefault();

        if (doctorIdObj != null && int.TryParse(doctorIdObj.ToString(), out int doctorId))
        {
            var doctorProfile = await _context.DoctorProfiles.FindAsync(doctorId);

            if (doctorProfile == null || !doctorProfile.IsApproved)
            {
                context.Result = new ObjectResult(new
                {
                    message = "Access denied. Your doctor account is pending administrator approval."
                })
                {
                    StatusCode = StatusCodes.Status403Forbidden
                };
                return;
            }
        }
        else
        {
            var userId = context.HttpContext.User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (!string.IsNullOrEmpty(userId))
            {
                var doctorProfile = await _context.DoctorProfiles.FirstOrDefaultAsync(d => d.UserId == userId);
                if (doctorProfile != null && !doctorProfile.IsApproved)
                {
                    context.Result = new ObjectResult(new
                    {
                        message = "Access denied. Your doctor account is pending administrator approval."
                    })
                    {
                        StatusCode = StatusCodes.Status403Forbidden
                    };
                    return;
                }
            }
        }

        await next();
    }
}
