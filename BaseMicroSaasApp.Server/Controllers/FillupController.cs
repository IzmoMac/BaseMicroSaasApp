using BaseMicroSaasApp.Server.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace BaseMicroSaasApp.Server.Controllers;

[ApiController]
[Authorize]
[Route("api/[controller]")]
public class FillupController : Controller
{
    private readonly ApplicationDbContext _dbContext;
    private readonly UserManager<ApplicationUser> _userManager;
    public FillupController(ApplicationDbContext dbContext, UserManager<ApplicationUser> userManager)
    {
        _dbContext = dbContext;
        _userManager = userManager;
    }

    [HttpGet]
    public async Task<IActionResult> Get()
    {
        // GET USER;
        var userId = User?.Claims.FirstOrDefault(c => c.Type == "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier")?.Value;
        if (string.IsNullOrEmpty(userId)) { userId = User?.Claims.FirstOrDefault(c => c.Type == "sub")?.Value; }
        if (string.IsNullOrEmpty(userId)) { return Unauthorized(); }
        var user = await _userManager.FindByIdAsync(userId);
        if (user == null) { return NotFound(new { message = "User not found in the database" }); }

        var fillups = await _dbContext.Fillups
            .Where(f => f.UserId == userId)
            .Select(f => new
            {
                id = f.Id,
                odometerReading = f.OdometerReading,
                fuelAmount = f.FuelAmount,
                pricePerLiter = f.PricePerLiter,
                isFullTank = f.IsFullTank,
                skippedAFillUp = f.SkippedAFillUp,
                totalCost = f.TotalCost,
                date = f.Date.ToString("o") // ISO 8601 format
            }).ToListAsync();

        return Ok(fillups);
    }

    [HttpPost("record")]
    public async Task<IActionResult> Record([FromBody] FillupForm form)
    {
        // GET USER;
        var userId = User?.Claims.FirstOrDefault(c => c.Type == "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier")?.Value;
        if (string.IsNullOrEmpty(userId)) { userId = User?.Claims.FirstOrDefault(c => c.Type == "sub")?.Value; }
        if (string.IsNullOrEmpty(userId)) { return Unauthorized(); }
        var user = await _userManager.FindByIdAsync(userId);
        if (user == null) { return NotFound(new { message = "User not found in the database" }); }


        var newFU = new Fillup
        {
            OdometerReading = form.OdometerReading,
            FuelAmount = form.FuelAmount,
            PricePerLiter = form.PricePerLiter,
            IsFullTank = form.IsFullTank,
            TotalCost = form.TotalCost,
            Date = form.Date,
            UserId = userId,
            User = user,
        };

        _dbContext.Fillups.Add(newFU);
        await _dbContext.SaveChangesAsync();
        //TODO Add validation and save to database
        return Json(new { message = "success" });
    }
}
