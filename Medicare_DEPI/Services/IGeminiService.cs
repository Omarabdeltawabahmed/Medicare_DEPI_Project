namespace Medicare_DEPI.Services
{
    public interface IGeminiService
    {
        Task<string> GenerateTextAsync(string systemPrompt, string userPrompt);
    }
}