namespace BaseMicroSaasApp.Server.Models;

public class TripForm
{
    public string TripType { get; set; }
    public decimal TripDistance { get; set; }
    public decimal? OdometerReading { get; set; }
    public DateTime Date { get; set; }
    public string Notes { get; set; }
}