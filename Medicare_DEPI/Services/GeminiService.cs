using System.Text;
using System.Text.Json;
using System.Text.Json.Nodes;

namespace Medicare_DEPI.Services
{
    public class GeminiService : IGeminiService
    {
        private readonly HttpClient _httpClient;
        private readonly IConfiguration _configuration;

        public GeminiService(HttpClient httpClient, IConfiguration configuration)
        {
            _httpClient = httpClient;
            _configuration = configuration;
        }

        public async Task<string> GenerateTextAsync(string systemPrompt, string userPrompt)
        {
            var apiKey = _configuration["GeminiSettings:ApiKey"];
            var model = _configuration["GeminiSettings:Model"] ?? "gemini-1.5-flash";

            if (string.IsNullOrWhiteSpace(apiKey) || apiKey == "YOUR_GEMINI_API_KEY")
            {
                return "Gemini API Key is missing. Please configure it in appsettings.json.";
            }

            var endpoint = $"https://generativelanguage.googleapis.com/v1beta/models/{model}:generateContent?key={apiKey}";

            var requestBody = new
            {
                system_instruction = new
                {
                    parts = new[]
                    {
                        new { text = systemPrompt }
                    }
                },
                contents = new[]
                {
                    new
                    {
                        parts = new[]
                        {
                            new { text = userPrompt }
                        }
                    }
                }
            };

            var jsonContent = new StringContent(
                JsonSerializer.Serialize(requestBody),
                Encoding.UTF8,
                "application/json"
            );

            var response = await _httpClient.PostAsync(endpoint, jsonContent);

            if (!response.IsSuccessStatusCode)
            {
                var errorContent = await response.Content.ReadAsStringAsync();
                return $"Error communicating with Gemini: {response.StatusCode} - {errorContent}";
            }

            var responseJson = await response.Content.ReadAsStringAsync();
            var parsed = JsonNode.Parse(responseJson);

            var generatedText = parsed?["candidates"]?[0]?["content"]?["parts"]?[0]?["text"]?.ToString();

            return generatedText ?? "No response generated from AI.";
        }
    }
}