using System;
using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;

namespace dotnetapp.Models
{
    public class Feedback
    {
        [Key]
        public int FeedbackId { get; set; }

        [Required(ErrorMessage = "User ID is required.")]
        public int UserId { get; set; }

        public User? User { get; set; }

        [Required(ErrorMessage = "Feedback text is required.")]
        [StringLength(1000, ErrorMessage = "Feedback cannot exceed 1000 characters.")]
        public string FeedbackText { get; set; }

        [Required(ErrorMessage = "Date is required.")]
        [DataType(DataType.DateTime)]
        public DateTime Date { get; set; }
    }
}
