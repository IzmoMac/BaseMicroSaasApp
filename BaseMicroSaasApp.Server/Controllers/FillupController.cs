using BaseMicroSaasApp.Server.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;

namespace BaseMicroSaasApp.Server.Controllers;

[ApiController]
[Authorize]
[Route("api/[controller]")]
public class FillupController : Controller
{
    private readonly ApplicationDbContext _context;
    private readonly UserManager<ApplicationUser> _userManager;
    public FillupController(ApplicationDbContext dbContext, UserManager<ApplicationUser> userManager)
    {
        _context = dbContext;
        _userManager = userManager;
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

        _context.Fillups.Add(newFU);
        await _context.SaveChangesAsync();
        //TODO Add validation and save to database
        return Json(new { message = "success" });
    }
}
