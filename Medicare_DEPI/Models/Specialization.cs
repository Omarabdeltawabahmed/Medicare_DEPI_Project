using System.ComponentModel.DataAnnotations;

namespace Medicare_DEPI.Models
{
    public class Specialization
    {
        public int Id { get; set; }

        [Required(ErrorMessage = "Specialization name in English is required.")]
        [StringLength(100, MinimumLength = 2, ErrorMessage = "Name must be between 2 and 100 characters.")]
        public string Name { get; set; } = string.Empty;

        [Required(ErrorMessage = "Specialization name in Arabic is required.")]
        [StringLength(100, MinimumLength = 2, ErrorMessage = "Arabic name must be between 2 and 100 characters.")]
        public string NameAr { get; set; } = string.Empty;
    }
}