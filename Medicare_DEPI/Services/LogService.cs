using Medicare_DEPI.Data;
using Medicare_DEPI.Models;

namespace Medicare_DEPI.Services
{
    public class LogService : ILogService
    {
        private readonly AppDbContext _context;

        public LogService(AppDbContext context)
        {
            _context = context;
        }

        public async Task LogErrorAsync(Exception ex, string endpoint)
        {
            var errorLog = new ErrorLog
            {
                Message = ex.Message,
                StackTrace = ex.StackTrace,
                Endpoint = endpoint,
                CreatedAt = DateTime.UtcNow
            };

            await _context.ErrorLogs.AddAsync(errorLog);
            await _context.SaveChangesAsync();
        }
    }
}