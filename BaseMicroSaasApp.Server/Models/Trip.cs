using Microsoft.AspNetCore.Identity;
using System.ComponentModel.DataAnnotations;

namespace BaseMicroSaasApp.Server.Models;

public class Trip
{
    [Key]
    public long Id { get; set; }
    public string TripType { get; set; }
    public decimal TripDistance { get; set; }
    public decimal OdometerReading { get; set; }
    public DateTime Date { get; set; }
    public string Notes { get; set; }

    // Foreign key to Identity user
    public string UserId { get; set; }

    // Navigation property
    public ApplicationUser User { get; set; }
}
