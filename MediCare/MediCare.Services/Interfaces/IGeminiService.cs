namespace MediCare.Services.Interfaces;

public interface IGeminiService
{
    Task<string> GenerateTextAsync(string systemPrompt, string userPrompt);
}
