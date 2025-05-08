using BaseMicroSaasApp.Server.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace BaseMicroSaasApp.Server.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AuthController : ControllerBase
{
    private readonly UserManager<ApplicationUser> _userManager;
    private readonly SignInManager<ApplicationUser> _signInManager;
    private readonly IConfiguration _configuration;
    private readonly TokenService _tokenService;

    public AuthController(UserManager<ApplicationUser> userManager, SignInManager<ApplicationUser> signInManager, IConfiguration configuration, TokenService tokenService)
    {
        _userManager = userManager;
        _signInManager = signInManager;
        _configuration = configuration;
        _tokenService = tokenService;
    }

    [HttpPost("login")]
    public async Task<IActionResult> Login([FromBody] LoginRequest model)
    {
        var user = await _userManager.FindByNameAsync(model.Username);

        if (user != null && await _userManager.CheckPasswordAsync(user, model.Password))
        {
            var refreshToken = await _tokenService.GenerateRefreshTokenAsync(user.Id); // Generate and store

            return Ok(new AuthResponse
            {
                Token = _tokenService.CreateToken(user),
                RefreshToken = refreshToken.Token
            });
        }

        return Unauthorized();
    }

    [HttpPost("register")]
    public async Task<IActionResult> Register([FromBody] RegisterRequest model)
    {
        var user = new ApplicationUser { UserName = model.Username, Email = model.Email };
        var result = await _userManager.CreateAsync(user, model.Password);
        if (result.Succeeded)
        {
            var refreshToken = await _tokenService.GenerateRefreshTokenAsync(user.Id)!;
            return Ok(new AuthResponse
            {
                Token = _tokenService.CreateToken(user),
                RefreshToken = refreshToken.Token
            });
        }

        return BadRequest(result.Errors);
    }

    //TODO ISMO, CHECK FOR SECURITYT
    //The current accessToken needs to be valid??
    //[Authorize]
    //[HttpPost("refresh")]
    //public async Task<IActionResult> Refresh([FromBody] RefreshRequest request)
    //{
    //    // 1. Get the refresh token from the request
    //    var refreshTokenString = request.RefreshToken;
    //    if (string.IsNullOrEmpty(refreshTokenString))
    //    {
    //        return BadRequest("Refresh token is required.");
    //    }

    //    // 2. Find the refresh token in the database
    //    var refreshToken = await _tokenService.GetRefreshTokenAsync(refreshTokenString);

    //    // 3. Validate the refresh token
    //    if (refreshToken == null || !refreshToken.IsActive)
    //    {
    //        // TODO ISMO Optional: If token exists but isn't active, could indicate potential attack.
    //        // You might want to log this or even revoke all tokens for this user if possible.
    //        if (refreshToken != null && !refreshToken.IsActive)
    //        {
    //            // Example: Revoke all tokens for this user (requires userId on token or lookup)
    //            // var userTokens = await _context.RefreshTokens.Where(rt => rt.ApplicationUserId == refreshToken.ApplicationUserId && rt.IsActive).ToListAsync();
    //            // userTokens.ForEach(t => t.Revoked = DateTime.UtcNow);
    //            // await _context.SaveChangesAsync();
    //            // Log potential suspicious activity
    //        }

    //        return Unauthorized("Invalid or expired refresh token.");
    //    }
        

    //    // 4. Get the associated user
    //    var user = refreshToken.User;
    //    if (user == null)
    //    {
    //        return Unauthorized("User not found for the refresh token.");
    //    }

    //    // 5. Generate a new access token
    //    var newAccessToken = _tokenService.CreateToken(user);

    //    // 6. (Optional but Recommended) Generate a *new* refresh token and revoke the old one
    //    await _tokenService.RevokeRefreshTokenAsync(refreshTokenString); // Mark old one as used/revoked
    //    var newRefreshToken = await _tokenService.GenerateRefreshTokenAsync(user.Id); // Generate and store a new one

    //    // 7. Return the new tokens
    //    return Ok(new AuthResponse
    //    {
    //        Token = newAccessToken,
    //        RefreshToken = newRefreshToken.Token
    //    });
    //}

    ////TODO ALSO CHECK FOR POTENTIAL SECURITY FLAWS BEFORE IMPLMEITNG
    //// --- Optional: Revoke Endpoint ---
    //// This endpoint allows a user to revoke a specific refresh token (e.g., "logout from this device")
    //// or revoke all their refresh tokens (e.g., "logout from all devices").
    //[Authorize] // Requires a valid access token to call this
    //[HttpPost("revoke")]
    //public async Task<IActionResult> Revoke([FromBody] RefreshRequest request)
    //{
    //    // Get the user ID from the valid access token claim
    //    var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
    //    if (userId == null)
    //    {
    //        return Unauthorized(); // Should not happen if [Authorize] works
    //    }

    //    var refreshTokenString = request.RefreshToken;

    //    // Find the token *and* ensure it belongs to the current user
    //    var refreshToken = await _context.RefreshTokens
    //        .FirstOrDefaultAsync(rt => rt.Token == refreshTokenString && rt.ApplicationUserId == userId);

    //    if (refreshToken == null || !refreshToken.IsActive)
    //    {
    //        // Token not found, doesn't belong to user, or already revoked
    //        return BadRequest("Invalid or inactive refresh token.");
    //    }

    //    await _tokenService.RevokeRefreshToken(refreshTokenString);

    //    return Ok(new { Status = "Success", Message = "Refresh token revoked." });
    //}

    //// --- Optional: Revoke All Tokens Endpoint ---
    //[Authorize]
    //[HttpPost("revoke-all")]
    //public async Task<IActionResult> RevokeAll()
    //{
    //    var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
    //    if (userId == null) return Unauthorized();

    //    var activeTokens = await _context.RefreshTokens
    //        .Where(rt => rt.ApplicationUserId == userId && rt.IsActive)
    //        .ToListAsync();

    //    if (!activeTokens.Any())
    //    {
    //        return Ok(new { Status = "Success", Message = "No active tokens found to revoke." });
    //    }

    //    foreach (var token in activeTokens)
    //    {
    //        token.Revoked = DateTime.UtcNow;
    //    }
    //    await _context.SaveChangesAsync();

    //    return Ok(new { Status = "Success", Message = "All refresh tokens revoked." });
    //}
}

public class RegisterRequest
{
    public string Username { get; set; } = string.Empty;
    public string Password { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
}
public class LoginRequest
{
    public string Username { get; set; } = string.Empty;
    public string Password { get; set; } = string.Empty;
}
public class RefreshRequest
{
    public string RefreshToken { get; set; } = string.Empty;
}