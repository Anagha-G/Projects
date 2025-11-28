using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;

namespace dotnetapp.Models
{
    public class PlanApplication
    {
        
    [Key]
    public int PlanApplicationId { get; set; }

    [Required]
    public int UserId { get; set; }

    [Required]
    public int SavingsPlanId { get; set; }

    [Required]
    [Range(0.01, double.MaxValue, ErrorMessage = "AppliedAmount must be greater than 0.")]
    public decimal AppliedAmount { get; set; }

    [Required]
    [RegularExpression("Pending|Approved|Rejected", ErrorMessage = "Status must be Pending, Approved, or Rejected.")]
    public string Status { get; set; }

    [Required]
    public DateTime ApplicationDate { get; set; }

    [MaxLength(500)]
    public string? Remarks { get; set; }

    public string? ProofDocument { get; set; }
    
    [JsonIgnore]
    public  User? User { get; set; }
    [JsonIgnore]
    public  SavingsPlan? SavingsPlan { get; set; }
        
    }
}
