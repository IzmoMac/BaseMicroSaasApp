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
    [HttpGet("dashboard")]
    public async Task<IActionResult> Dashboard()
    {
        var userId = User?.Claims.FirstOrDefault(c => c.Type == "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier")?.Value;
        if (string.IsNullOrEmpty(userId)) { userId = User?.Claims.FirstOrDefault(c => c.Type == "sub")?.Value; }
        if (string.IsNullOrEmpty(userId)) { return Unauthorized(); }
        // Fetch the user from the database
        var user = await _userManager.FindByIdAsync(userId);
        if (user == null) { return NotFound(new { message = "User not found in the database" }); }


        //TODO ISMO Add logic to make the dashboard, like 

        return Ok();
    }
}
