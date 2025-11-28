using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;

namespace dotnetapp.Models
{
    public class Feedback
    {
    [Key]
    public int FeedbackId { get; set; }

    [Required]
    public int UserId { get; set; }

    [Required]
    [MaxLength(1000, ErrorMessage = "Comments cannot exceed 1000 characters.")]
    public string Comments { get; set; }

    [Required]
    public DateTime DateProvided { get; set; }

    [JsonIgnore]
    public  User? User { get; set; }
        
    }
}

