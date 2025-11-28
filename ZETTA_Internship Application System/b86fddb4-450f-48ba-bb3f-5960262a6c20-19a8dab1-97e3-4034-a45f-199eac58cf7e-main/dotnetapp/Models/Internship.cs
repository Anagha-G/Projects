using System;
using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;

namespace dotnetapp.Models
{
    public class Internship
    {
        [Key]
        public int InternshipId { get; set; }

        [Required(ErrorMessage = "Title is required.")]
        [StringLength(100, ErrorMessage = "Title cannot exceed 100 characters.")]
        public string Title { get; set; }

        [Required(ErrorMessage = "Company name is required.")]
        [StringLength(100, ErrorMessage = "Company name cannot exceed 100 characters.")]
        public string CompanyName { get; set; }

        [Required(ErrorMessage = "Location is required.")]
        [StringLength(100, ErrorMessage = "Location cannot exceed 100 characters.")]
        public string Location { get; set; }

        [Required(ErrorMessage = "Duration is required.")]
        [Range(1, 24, ErrorMessage = "Duration must be between 1 and 24 months.")]
        public int DurationInMonths { get; set; }

        [Required(ErrorMessage = "Stipend is required.")]
        [Range(0, 100000, ErrorMessage = "Stipend must be between 0 and 100000.")]
        public decimal Stipend { get; set; }

        [Required(ErrorMessage = "Description is required.")]
        [StringLength(2000, ErrorMessage = "Description cannot exceed 2000 characters.")]
        public string Description { get; set; }

        [Required(ErrorMessage = "Skills required field is mandatory.")]
        [StringLength(500, ErrorMessage = "SkillsRequired cannot exceed 500 characters.")]
        public string SkillsRequired { get; set; }

        [Required(ErrorMessage = "Application deadline is required.")]
        [DataType(DataType.Date)]
        public string ApplicationDeadline { get; set; }
    }
}
