using Microsoft.AspNetCore.Identity;
using System.ComponentModel.DataAnnotations;

namespace BaseMicroSaasApp.Server.Domain;

public class tbl_fillup
{
    [Key]
    public long Id { get; set; }
    public decimal OdometerReading { get; set; }
    public decimal FuelAmount { get; set; }
    public decimal PricePerLiter { get; set; }
    public bool IsFullTank { get; set; }
    public decimal TotalCost { get; set; }
    public DateTime Date { get; set; }

    // Foreign key to Identity user
    public string UserId { get; set; }

    // Navigation property
    public IdentityUser User { get; set; }
}
