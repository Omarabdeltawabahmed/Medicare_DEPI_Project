using Microsoft.AspNetCore.Http;

namespace MediCare.Services.Interfaces;

public interface IFileService
{
    Task<string?> SaveFileAsync(IFormFile file);
}
