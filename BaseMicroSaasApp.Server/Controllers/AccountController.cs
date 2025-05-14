using BaseMicroSaasApp.Server.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;

namespace BaseMicroSaasApp.Server.Controllers;

[Authorize]
[ApiController]
[Route("api/[controller]")]
public class AccountController : Controller
{
    private readonly UserManager<ApplicationUser> _userManager;
    private readonly ApplicationDbContext _dbContext;

    public AccountController(ApplicationDbContext dbContext, UserManager<ApplicationUser> userManager)
    {
        _dbContext = dbContext;
        _userManager = userManager;
    }

    [HttpGet("me")]
    public async Task<IActionResult> Me()
    {
        // Retrieve the user ID from the JWT claims
        var userId = User?.Claims.FirstOrDefault(c => c.Type == "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier")?.Value;
        if (string.IsNullOrEmpty(userId)) { userId = User?.Claims.FirstOrDefault(c => c.Type == "sub")?.Value; }
        if (string.IsNullOrEmpty(userId)) { return Unauthorized(); }

        // Fetch the user from the database
        var user = await _userManager.FindByIdAsync(userId);

        if (user == null) { return NotFound(new { message = "User not found in the database" }); }

        // Return user information
        return Ok(new
        {
            username = user.UserName,
            email = user.Email
        });
    }
    private static decimal GetTotalDistance(List<Fillup> fillups, List<Trip> trips)
    {
        decimal? minFu = fillups.Min(f => f.OdometerReading);
        decimal? maxFu = fillups.Max(f => f.OdometerReading);
        decimal? minTrip = trips.Min(t => t.OdometerReading);
        decimal? maxTrip = trips.Max(t => t.OdometerReading);

        var min = minFu < minTrip ? minFu : minTrip;
        var max = maxFu > maxTrip ? maxFu : maxTrip;

        decimal totalDistance = 0;
        if (min == null || max == null) { }
        else
        {
            totalDistance = (decimal)(max - min);
        }

        return totalDistance;
    }
    [HttpGet("dashboard")]
    public async Task<IActionResult> Dashboard()
    {
        var userId = User?.Claims.FirstOrDefault(c => c.Type == "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier")?.Value;
        if (string.IsNullOrEmpty(userId)) { userId = User?.Claims.FirstOrDefault(c => c.Type == "sub")?.Value; }
        if (string.IsNullOrEmpty(userId)) { return Unauthorized(); }
        // Fetch the user from the database
        var user = await _userManager.FindByIdAsync(userId);
        if (user == null) { return NotFound(new { message = "User not found in the database" }); }


        //TODO ISMO Add logic to make the dashboard, 
        var fs = _dbContext.Fillups.Where(f => f.UserId == userId).ToList();
        var ts = _dbContext.Trips.Where(t => t.UserId == userId).ToList();

        if(fs.Count == 0 || ts.Count == 0)
        {
            return NotFound(new { message = "No data found" });
        }
        var totalDistance = GetTotalDistance(fs, ts);
        var totalWork = ts.Where(t => t.TripType == "home").Sum(t => t.TripDistance);
        var totalPersonal = ts.Where(t => t.TripType == "personal").Sum(t => t.TripDistance);


        var orderedFillups = fs.OrderBy(fs => fs.Date).ToList();
        List<decimal> listFE = [];
        Fillup? firstFillup = null;
        decimal PartialFuelAmount = 0;
        for (int i = 0; i < orderedFillups.Count; i++)
        {
            if (firstFillup is null)
            {
                if (orderedFillups[i].IsFullTank)
                {
                    firstFillup = orderedFillups[i];
                }
                continue;
            }
            else if (orderedFillups[i].SkippedAFillUp)
            {
                if (orderedFillups[i].IsFullTank)
                {
                    firstFillup = orderedFillups[i];
                }
                else
                {
                    firstFillup = null;
                }
                PartialFuelAmount = 0;
                continue;
            }
            else if (orderedFillups[i].IsFullTank)
            {
                //We have 2 full tank fillups, we can calculate the average fuel economy
                var lastFillup = orderedFillups[i];
                var distance = lastFillup.OdometerReading - firstFillup.OdometerReading;
                var fuelAmount = lastFillup.FuelAmount + PartialFuelAmount;
                var averageFuelEconomy = distance / fuelAmount;
                //TODO ISMO Add logic to make the dashboard
                listFE.Add(averageFuelEconomy);

                firstFillup = null;
                PartialFuelAmount = 0;
                continue;
            }
            else
            {
                //We store the fuel amount of the fillup anyway, even if it is not a full tank fillup
                PartialFuelAmount += orderedFillups[i].FuelAmount;
                continue;
            }
        }
        decimal averageTotalFuelEconomy = 0;
        if (listFE.Count == 0)
        {
            //No full tank fillup found
            //Not enough data to make the dashboard, 2 full tank fillups are needed to calculate the average fuel economy 
        }
        else
        {
            averageTotalFuelEconomy = listFE.Average();
        }

        decimal totalFuelCost = fs.Sum(f => f.TotalCost);
        decimal averagePricePerLitre = totalFuelCost / fs.Sum(f => f.FuelAmount);

        var statsMonth = new StatsMonth()
        {
            AverageFuelEconomy = averageTotalFuelEconomy,
            TotalDistance = (int)totalDistance,
            TotalFuelCost = totalFuelCost,
            AveragePricePerLitre = averagePricePerLitre,
            PersonalDistance = totalPersonal,
            WorkDistance = totalWork,
        };
        var dashBoard = new DashBoard();
        dashBoard.Stats.Add((0, 0), statsMonth);

        return Json(dashBoard);
    }
}
