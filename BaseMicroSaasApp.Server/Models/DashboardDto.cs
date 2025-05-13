namespace BaseMicroSaasApp.Server.Models;

public class DashBoard
{
    public Dictionary<(int, int), StatsMonth> Stats { get; set; } = new();
}
public class StatsMonth
{
    public int TotalDistance { get; set; }
    public decimal TotalFuelCost { get; set; }
    public decimal AverageFuelEconomy { get; set; }
    public decimal AveragePricePerLitre { get; set; }
    
    public decimal WorkDistance { get; set; }
    public decimal PersonalDistance { get; set; }
}