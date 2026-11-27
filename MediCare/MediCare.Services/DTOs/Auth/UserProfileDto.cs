namespace MediCare.Services.DTOs.Auth;

public class UserProfileDto
{
    public string Id { get; set; } = string.Empty;
    public string FullName { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string PhoneNumber { get; set; } = string.Empty;
    public DateTime? DateOfBirth { get; set; }
    public string? BloodGroup { get; set; }
    public string? Allergies { get; set; }
    public string? MedicalNotes { get; set; }
    public IList<string> Roles { get; set; } = new List<string>();
}

public class UpdateUserProfileDto
{
    public string FullName { get; set; } = string.Empty;
    public string? PhoneNumber { get; set; }
    public DateTime? DateOfBirth { get; set; }
    public string? BloodGroup { get; set; }
    public string? Allergies { get; set; }
    public string? MedicalNotes { get; set; }
}
