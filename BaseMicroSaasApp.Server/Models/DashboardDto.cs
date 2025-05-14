namespace BaseMicroSaasApp.Server.Models;

public class DashBoard
{
    public Dictionary<int, StatsY> StatsY { get; set; } = new();
}
public class StatsY
{
    public Dictionary<int, StatsM> StatsM { get; set; } = new();
}
public class StatsM
{
    public int TotalDistance { get; set; }
    public decimal TotalFuelCost { get; set; }
    public decimal AverageFuelEconomy { get; set; }
    public decimal AveragePricePerLitre { get; set; }
    
    public decimal WorkDistance { get; set; }
    public decimal PersonalDistance { get; set; }
}