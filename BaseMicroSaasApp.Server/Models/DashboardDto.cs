namespace BaseMicroSaasApp.Server.Models;

public class DashBoard
{
    public Dictionary<(int, int), StatsMonth> stats { get; set; } = new();
}
public class StatsMonth
{

    public int TotalDistance { get; set; }
    public decimal AverageFuelEconomy { get; set; }
    public decimal TotalFuelCost { get; set; }
    public decimal AveragePricePerLitre { get; set; }
    
    public StatsShort WorkStats { get; set; } = new();
    public StatsShort PersonalStats { get; set; } = new();
}
public class StatsShort
{
    public int TotalDistance { get; set; }
    public decimal TotalFuelCost { get; set; }
    public Dictionary<int,decimal>? Carousel { get; set; }
}