using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Filters;
using Medicare_DEPI.Data;

namespace Medicare_DEPI.Filters
{
    public class CheckDoctorApprovalFilter// : IAsyncActionFilter
    {
        private readonly AppDbContext _context;

        public CheckDoctorApprovalFilter(AppDbContext context)
        {
            _context = context;
        }

        //public async Task OnActionExecutionAsync(ActionExecutingContext context, ActionExecutionDelegate next)
        //{
        //    var doctorIdObj = context.RouteData.Values["doctorId"]?? context.HttpContext.Request.Query["doctorId"].FirstOrDefault();

        //    if (doctorIdObj != null && int.TryParse(doctorIdObj.ToString(), out int doctorId))
        //    {
        //        // فحص حالة الطبيب في جدول DoctorProfiles
        //        var doctorProfile = await _context.DoctorProfiles.FindAsync(doctorId);

        //        if (doctorProfile == null || !doctorProfile.IsApproved)
        //        {
        //            context.Result = new ObjectResult(new
        //            {
        //                message = "Access denied. Your doctor account is pending administrator approval."
        //            })
        //            {
        //                StatusCode = StatusCodes.Status403Forbidden
        //            };
        //            return;
        //        }
        //    }

        //    await next();
        //}
    }
}