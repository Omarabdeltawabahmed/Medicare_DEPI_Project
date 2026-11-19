namespace Medicare_DEPI.Services
{
    public interface ILogService
    {
        Task LogErrorAsync(Exception ex, string endpoint);
    }
}