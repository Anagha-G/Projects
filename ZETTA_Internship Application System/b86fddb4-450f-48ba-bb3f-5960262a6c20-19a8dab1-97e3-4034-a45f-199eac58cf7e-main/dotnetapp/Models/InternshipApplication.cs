using System;
using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;
 
namespace dotnetapp.Models
{
    public class InternshipApplication
    {
        [Key]
        public int InternshipApplicationId { get; set; }
 
        [Required(ErrorMessage = "User ID is required.")]
        public int UserId { get; set; }
 
        public User? User { get; set; }
 
        [Required(ErrorMessage = "Internship ID is required.")]
        public int InternshipId { get; set; }
 
        public Internship? Internship { get; set; }
 
        [Required(ErrorMessage = "University name is required.")]
        [StringLength(200, ErrorMessage = "University name cannot exceed 200 characters.")]
        public string UniversityName { get; set; }
 
        [Required(ErrorMessage = "Degree program is required.")]
        [StringLength(100, ErrorMessage = "Degree program cannot exceed 100 characters.")]
        public string DegreeProgram { get; set; }
 
        [Required(ErrorMessage = "Resume is required.")]
        [StringLength(500, ErrorMessage = "Resume path/URL cannot exceed 500 characters.")]
        public string Resume { get; set; }
 
        [StringLength(300, ErrorMessage = "LinkedIn profile link cannot exceed 300 characters.")]
        public string? LinkedInProfile { get; set; }
 
        [Required(ErrorMessage = "Application status is required.")]
        [StringLength(50, ErrorMessage = "Status cannot exceed 50 characters.")]
        public string ApplicationStatus { get; set; }
 
        [Required(ErrorMessage = "Application date is required.")]
        [DataType(DataType.DateTime)]
        public DateTime ApplicationDate { get; set; }
    }
}
 