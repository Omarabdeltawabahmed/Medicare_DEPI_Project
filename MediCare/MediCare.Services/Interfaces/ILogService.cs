namespace MediCare.Services.Interfaces;

public interface ILogService
{
    Task LogErrorAsync(Exception ex, string endpoint);
}
