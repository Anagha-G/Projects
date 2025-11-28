using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System.ComponentModel.DataAnnotations;

namespace dotnetapp.Models
{
    public class SavingsPlan
    {
       
    [Key]
    public int SavingsPlanId { get; set; }

    [Required]
    [MaxLength(100)]
    public string Name { get; set; }

    [Required]
    [Range(1000, 10000000)]
    public decimal GoalAmount { get; set; }

    [Required]
    [Range(1, 50)]
    public int TimeFrame { get; set; }

    [Required]
    [RegularExpression("Low|Medium|High", ErrorMessage = "RiskLevel must be Low, Medium, or High.")]
    public string RiskLevel { get; set; }

    [Required]
    [MaxLength(500)]
    public string Description { get; set; }

    [Required]
    [RegularExpression("Active|Inactive", ErrorMessage = "Status must be Active or Inactive.")]
    public string Status { get; set; }
}
        
    }

