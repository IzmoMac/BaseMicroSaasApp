using Microsoft.AspNetCore.Identity;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace BaseMicroSaasApp.Server.Models;

public class Fillup
{
    [Key]
    public long Id { get; set; }
    public decimal OdometerReading { get; set; }
    public decimal FuelAmount { get; set; }
    public decimal PricePerLiter { get; set; }
    public bool IsFullTank { get; set; }
    public bool SkippedAFillUp { get; set; }
    public decimal TotalCost { get; set; }
    public DateTime Date { get; set; }

    // Foreign key to Identity user
    public string UserId { get; set; }

    // Navigation property
    public ApplicationUser User { get; set; }
}
