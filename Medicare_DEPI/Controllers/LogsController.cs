using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Medicare_DEPI.Data;

namespace Medicare_DEPI.Controllers
{
    [ApiController]
    [Route("api/logs")]
    public class LogsController : ControllerBase
    {
        private readonly AppDbContext _context;

        public LogsController(AppDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<IActionResult> GetLogs()
        {
            var logs = await _context.ErrorLogs
                .OrderByDescending(l => l.CreatedAt)
                .Take(50)
                .ToListAsync();

            return Ok(logs);
        }
    }
}