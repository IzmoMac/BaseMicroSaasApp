using BaseMicroSaasApp.Server.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace BaseMicroSaasApp.Server.Controllers;


[ApiController]
[Route("api/[controller]")]
[Authorize]
public class TripController : Controller
{
    private readonly ApplicationDbContext _dbContext;
    private readonly UserManager<ApplicationUser> _userManager;
    public TripController(ApplicationDbContext dbContext, UserManager<ApplicationUser> userManager)
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

        var trips = await _dbContext.Trips
            .Where(f => f.UserId == userId)
            .Select(t => new
            {
                id = t.Id,
                tripType = t.TripType,
                tripDistance = t.TripDistance,
                odometerReading = t.OdometerReading,
                date = t.Date.ToString("o"), // ISO 8601 format
                notes = t.Notes
            })
            .ToListAsync();

        return Ok(trips);
    }

    [HttpPost("record")]
    public async Task<IActionResult> Record([FromBody] TripForm form)
    {
        // GET USER;
        var userId = User?.Claims.FirstOrDefault(c => c.Type == "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier")?.Value;
        if (string.IsNullOrEmpty(userId)) { userId = User?.Claims.FirstOrDefault(c => c.Type == "sub")?.Value; }
        if (string.IsNullOrEmpty(userId)) { return Unauthorized(); }
        var user = await _userManager.FindByIdAsync(userId);
        if (user == null) { return NotFound(new { message = "User not found in the database" }); }

        var newTrip = new Trip
        {
            TripType = form.TripType,
            TripDistance = form.TripDistance,
            OdometerReading = form.OdometerReading,
            Notes = form.Notes,
            Date = form.Date,
            UserId = userId,
            User = user,
        };

        //TODO Add validation
        _dbContext.Trips.Add(newTrip);
        await _dbContext.SaveChangesAsync();
        return Json(new { message = "success" });
    }
}
