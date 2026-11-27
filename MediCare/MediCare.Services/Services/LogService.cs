using Microsoft.AspNetCore.Hosting;
using MediCare.Data.Context;
using MediCare.Data.Models;
using MediCare.Services.Interfaces;

namespace MediCare.Services.Services;

public class LogService : ILogService
{
    private readonly ApplicationDbContext _context;
    private readonly IWebHostEnvironment _env;

    public LogService(ApplicationDbContext context, IWebHostEnvironment env)
    {
        _context = context;
        _env = env;
    }

    public async Task LogErrorAsync(Exception ex, string endpoint)
    {
        try
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
        catch (Exception dbEx)
        {
            await LogToLocalFileAsync(ex, dbEx, endpoint);
        }
    }

    private async Task LogToLocalFileAsync(Exception originalEx, Exception dbEx, string endpoint)
    {
        try
        {
            var logsFolder = Path.Combine(_env.ContentRootPath, "Logs");
            if (!Directory.Exists(logsFolder))
            {
                Directory.CreateDirectory(logsFolder);
            }

            var fileName = $"error_log_{DateTime.UtcNow:yyyy-MM-dd}.txt";
            var filePath = Path.Combine(logsFolder, fileName);

            var logContent = $"""
            ==================================================
            Timestamp (UTC): {DateTime.UtcNow:yyyy-MM-dd HH:mm:ss}
            Endpoint       : {endpoint}
            Original Error : {originalEx.Message}
            StackTrace     : {originalEx.StackTrace}
            --------------------------------------------------
            Fallback Reason (DB Error): {dbEx.Message}
            ==================================================

            """;

            await File.AppendAllTextAsync(filePath, logContent);
        }
        catch (Exception fileEx)
        {
            Console.WriteLine($"Critical: Failed to write fallback log to disk: {fileEx.Message}");
        }
    }
}
