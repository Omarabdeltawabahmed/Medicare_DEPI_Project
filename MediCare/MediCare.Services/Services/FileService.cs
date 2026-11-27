using Microsoft.AspNetCore.Http;
using MediCare.Services.Interfaces;

namespace MediCare.Services.Services;

public class FileService : IFileService
{
    private readonly string _uploadFolder = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", "uploads");

    public async Task<string?> SaveFileAsync(IFormFile file)
    {
        if (file == null || file.Length == 0) return null;

        if (!Directory.Exists(_uploadFolder))
        {
            Directory.CreateDirectory(_uploadFolder);
        }

        var fileName = Guid.NewGuid().ToString() + Path.GetExtension(file.FileName);
        var filePath = Path.Combine(_uploadFolder, fileName);

        using (var stream = new FileStream(filePath, FileMode.Create))
        {
            await file.CopyToAsync(stream);
        }

        return "/uploads/" + fileName;
    }
}
