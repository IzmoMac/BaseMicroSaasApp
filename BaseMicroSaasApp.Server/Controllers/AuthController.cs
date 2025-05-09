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
    //private readonly SignInManager<ApplicationUser> _signInManager;
    //private readonly IConfiguration _configuration;
    private readonly TokenService _tokenService;
    private readonly string _refreshTokenCookieName = "refreshToken";
    public AuthController(UserManager<ApplicationUser> userManager, 
        //SignInManager<ApplicationUser> signInManager, 
        //IConfiguration configuration, 
        TokenService tokenService)
    {
        _userManager = userManager;
        //_signInManager = signInManager;
        //_configuration = configuration;
        _tokenService = tokenService;
    }

    [Authorize]
    [HttpGet("test")]
    public IActionResult Index()
    {
        return Ok("AuthController is working");
    }

    [HttpPost("login")]
    public async Task<IActionResult> Login([FromBody] LoginRequest model)
    {
        var user = await _userManager.FindByNameAsync(model.Username);

        if (user != null && await _userManager.CheckPasswordAsync(user, model.Password))
        {
            var refreshToken = await _tokenService.GenerateRefreshTokenAsync(user.Id); // Generate and store

            Response.Cookies.Append(_refreshTokenCookieName, refreshToken.Token, GetHttpOnlyCookieOptions());

            return Ok(new AuthResponse
            {
                Token = _tokenService.CreateToken(user)
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

            Response.Cookies.Append(_refreshTokenCookieName, refreshToken.Token, GetHttpOnlyCookieOptions());

            return Ok(new AuthResponse
            {
                Token = _tokenService.CreateToken(user)
            });
        }

        return BadRequest(result.Errors);
    }
    [HttpPost("logout")]
    public async Task<IActionResult> Logout()
    {
        if (Request.Cookies.TryGetValue(_refreshTokenCookieName, out string? refreshTokenString) && !string.IsNullOrEmpty(refreshTokenString))
        {
            await _tokenService.RevokeRefreshTokenAsync(refreshTokenString);
        }

        Response.Cookies.Delete(_refreshTokenCookieName);
        return Ok(new { message = "Logged out successfully." });
    }

    [HttpPost("refresh")]
    public async Task<IActionResult> Refresh([FromBody] RefreshRequest request)
    {
        if (Request.Cookies.TryGetValue(_refreshTokenCookieName, out string? refreshTokenString) && !string.IsNullOrEmpty(refreshTokenString))
        {
            var userId = request.UserId;
            if (string.IsNullOrEmpty(refreshTokenString) || string.IsNullOrEmpty(userId))
            {
                return Unauthorized(new { message = "Invalid refresh token." });
            }

            // Find the refresh token in the database
            var refreshToken = await _tokenService.GetRefreshTokenAsync(refreshTokenString);

            if (refreshToken == null)
            {
                return Unauthorized(new { message = "Invalid refresh token." });
            }
            // Ensure the token belongs to the user
            if (refreshToken.ApplicationUserId != userId)
            {
                return Unauthorized(new { message = "Invalid refresh token." });
            }

            // Validate the refresh token
            if (!refreshToken.IsActive)
            {
                // TODO ISMO Optional: If token exists but isn't active, could indicate potential attack.
                // You might want to log this or even revoke all tokens for this user if possible.
                if (refreshToken != null && !refreshToken.IsActive)
                {
                    // Example: Revoke all tokens for this user (requires userId on token or lookup)
                    // var userTokens = await _context.RefreshTokens.Where(rt => rt.ApplicationUserId == refreshToken.ApplicationUserId && rt.IsActive).ToListAsync();
                    // userTokens.ForEach(t => t.Revoked = DateTime.UtcNow);
                    // await _context.SaveChangesAsync();
                    // Log potential suspicious activity
                }
                return Unauthorized(new { message = "Invalid refresh token." });
            }


            // Get the associated user
            var user = refreshToken.User;
            if (user == null)
            {
                //return Unauthorized("User not found for the refresh token.");
                return Unauthorized(new { message = "Invalid refresh token." });
            }

            // Generate a new refresh token and revoke the old one
            await _tokenService.RevokeRefreshTokenAsync(refreshTokenString); // Mark old one as used/revoked
            var newRefreshToken = await _tokenService.GenerateRefreshTokenAsync(user.Id); // Generate and store a new one

            Response.Cookies.Append(_refreshTokenCookieName, newRefreshToken.Token, GetHttpOnlyCookieOptions());

            return Ok(new AuthResponse
            {
                // Generate a new access token
                Token = _tokenService.CreateToken(user)
            });
        }

        Response.Cookies.Delete(_refreshTokenCookieName);
        return Unauthorized(new { message = "Invalid refresh token." });
    }
    private static CookieOptions GetHttpOnlyCookieOptions()
    {
        return new CookieOptions
        {
            HttpOnly = true,
            Secure = true, // Set to true if using HTTPS
            SameSite = SameSiteMode.Strict, // Or Lax
            Expires = DateTimeOffset.UtcNow.AddDays(7), // Set appropriate expiry
            Path = "/api/auth/refresh" // Restrict cookie path if needed
        };
    }
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
    public string UserId { get; set; } = string.Empty;
}