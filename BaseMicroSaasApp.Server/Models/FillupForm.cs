namespace BaseMicroSaasApp.Server.Models;

public class FillupForm
{
    public decimal OdometerReading { get; set; }
    public decimal FuelAmount { get; set; }
    public decimal PricePerLiter { get; set; }
    public bool IsFullTank { get; set; }
    public decimal TotalCost { get; set; }
    public DateTime Date { get; set; }
}
