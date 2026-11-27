
using MediCare.Data.Models;

namespace MediCare.Services.Interfaces;

public interface ITokenService
{
    Task<string> CreateTokenAsync(ApplicationUser user);
}
