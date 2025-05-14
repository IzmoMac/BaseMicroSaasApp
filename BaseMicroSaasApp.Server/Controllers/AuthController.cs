using BaseMicroSaasApp.Server.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SQLitePCL;

namespace BaseMicroSaasApp.Server.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AuthController : ControllerBase
{
    private readonly UserManager<ApplicationUser> _userManager;
    private readonly TokenService _tokenService;
    private readonly ApplicationDbContext _dbContext;
    private readonly IConfiguration _configuration
    private readonly string _refreshTokenCookieName = "refreshToken";
    private readonly string _userIdTokenCookieName = "userId";
    private readonly string _regTokenName = "RegisterToken";
    public AuthController(UserManager<ApplicationUser> userManager, TokenService tokenService, ApplicationDbContext dbContext, IConfiguration configuration)
    {
        _userManager = userManager;
        _tokenService = tokenService;
        _dbContext = dbContext;
        _configuration = configuration;
    }

    [HttpPost("login")]
    public async Task<IActionResult> Login([FromBody] LoginRequest model)
    {
        var user = await _userManager.FindByNameAsync(model.Username);

        if (user != null && await _userManager.CheckPasswordAsync(user, model.Password))
        {
            var refreshToken = await _tokenService.GenerateRefreshTokenAsync(user.Id); // Generate and store

            Response.Cookies.Append(_refreshTokenCookieName, refreshToken.Token, GetCookieOptions());
            Response.Cookies.Append(_userIdTokenCookieName, user.Id, GetCookieOptions());

            return Ok(new AuthResponse
            {
                Token = _tokenService.CreateToken(user),
            });
        }

        return Unauthorized();
    }

    //TODO ISMO: This is a temporary solution, we should implement a proper registration process.
    //For now we do not allow users to register themselves, basically this allows other users to register new users, but that is no con
    //[Authorize]
    [HttpPost("register")]
    public async Task<IActionResult> Register([FromBody] RegisterRequest model)
    {
        if (string.IsNullOrEmpty(model.Username) || string.IsNullOrEmpty(model.Password))
        {
            return BadRequest(new { message = "Username and password are required." });
        }
        if (_configuration[_regTokenName] == null)
        {
            return Unauthorized(new { mesage = "Error happened, try again later" });
        }
        if (model.RegistrationToken != _configuration[_regTokenName])
        {
            return Unauthorized(new { mesage = "Registarion token needed" });
        }
        var user = new ApplicationUser { UserName = model.Username, Email = model.Username };
        var result = await _userManager.CreateAsync(user, model.Password);
        if (result.Succeeded)
        {
            return Ok(new { message = "User registered successfully." });
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
        Response.Cookies.Delete(_userIdTokenCookieName);
        return Ok(new { message = "Logged out successfully." });
    }

    [HttpPost("refresh")]
    public async Task<IActionResult> Refresh()
    {
        if (Request.Cookies.TryGetValue(_refreshTokenCookieName, out string? refreshTokenString) && !string.IsNullOrEmpty(refreshTokenString))
        {
            if (Request.Cookies.TryGetValue(_userIdTokenCookieName, out string? userIdTokenString) && !string.IsNullOrEmpty(userIdTokenString))
            {
                if (string.IsNullOrEmpty(refreshTokenString) || string.IsNullOrEmpty(userIdTokenString))
                {
                    return Unauthorized();
                }

                // Find the refresh token in the database
                var refreshToken = await _tokenService.GetRefreshTokenAsync(refreshTokenString);

                if (refreshToken == null)
                {
                    return Unauthorized();
                }
                // Ensure the token belongs to the user
                if (refreshToken.ApplicationUserId != userIdTokenString)
                {
                    return Unauthorized();
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
                    return Unauthorized();
                }


                // Get the associated user
                var user = refreshToken.User;
                if (user == null)
                {
                    //return Unauthorized("User not found for the refresh token.");
                    return Unauthorized();
                }

                // Generate a new refresh token and revoke the old one
                await _tokenService.RevokeRefreshTokenAsync(refreshTokenString); // Mark old one as used/revoked
                var newRefreshToken = await _tokenService.GenerateRefreshTokenAsync(user.Id); // Generate and store a new one

                Response.Cookies.Append(_refreshTokenCookieName, newRefreshToken.Token, GetCookieOptions());
                Response.Cookies.Append(_userIdTokenCookieName, user.Id, GetCookieOptions());

                return Ok(new AuthResponse
                {
                    // Generate a new access token
                    Token = _tokenService.CreateToken(user)
                });
            }
        }

        Response.Cookies.Delete(_refreshTokenCookieName);
        Response.Cookies.Delete(_userIdTokenCookieName);
        return Unauthorized(new { message = "Invalid refresh token." });
    }
    [HttpDelete]
    [Authorize]
    public async Task<IActionResult> Delete()
    {
        var userId = User?.Claims.FirstOrDefault(c => c.Type == "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier")?.Value;
        if (string.IsNullOrEmpty(userId)) { userId = User?.Claims.FirstOrDefault(c => c.Type == "sub")?.Value; }
        if (string.IsNullOrEmpty(userId)) { return Unauthorized(); }
        // Fetch the user from the database
        var user = await _userManager.FindByIdAsync(userId);
        if (user == null) { return NotFound(new { message = "User not found in the database" }); }

        var result = await _userManager.DeleteAsync(user);
        if (result.Succeeded)
        {
            Response.Cookies.Delete(_refreshTokenCookieName);
            Response.Cookies.Delete(_userIdTokenCookieName);

            var activeTokens = await _dbContext.RefreshTokens
                                .Where(rt => rt.ApplicationUserId == user.Id).ToListAsync();
            activeTokens = activeTokens.Where(rt => rt.IsActive).ToList();

            if (activeTokens.Count == 0)
            {
                return Ok(new { Status = "Success", Message = "Account deleted succesfully" });
            }

            foreach (var token in activeTokens)
            {
                token.Revoked = DateTime.UtcNow;
            }
            await _dbContext.SaveChangesAsync();

            return Ok(new { message = "Account deleted succesfully." });
        } else
        {
            return BadRequest(new { message = "Failed to delete account." });
        }
    }

    [HttpPost("update-password")]
    [Authorize]
    public async Task<IActionResult> UpdatePassword([FromBody] UpdatePasswordRequest model)
    {
        if (model.NewPassword != model.ReNewPassword)
        {
            return BadRequest(new { message = "New password and confirmation do not match." });
        }
        var userId = User?.Claims.FirstOrDefault(c => c.Type == "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier")?.Value;
        if (string.IsNullOrEmpty(userId)) { userId = User?.Claims.FirstOrDefault(c => c.Type == "sub")?.Value; }
        if (string.IsNullOrEmpty(userId)) { return Unauthorized(); }
        // Fetch the user from the database
        var user = await _userManager.FindByIdAsync(userId);
        if (user == null) { return NotFound(new { message = "User not found in the database" }); }


        var result = _userManager.ChangePasswordAsync(user, model.OldPassword, model.NewPassword);
        if (result.IsCompletedSuccessfully)
        {
            Response.Cookies.Delete(_refreshTokenCookieName);
            Response.Cookies.Delete(_userIdTokenCookieName);

            var activeTokens = await _dbContext.RefreshTokens
                                .Where(rt => rt.ApplicationUserId == user.Id).ToListAsync();
            activeTokens = activeTokens.Where(rt => rt.IsActive).ToList();

            if (activeTokens.Count == 0)
            {
                return Ok(new { Status = "Success", Message = "Password updated successfully. No active tokens found to revoke." });
            }

            foreach (var token in activeTokens)
            {
                token.Revoked = DateTime.UtcNow;
            }
            await _dbContext.SaveChangesAsync();
            return Ok(new { Status = "Success", Message = "Password updated successfully. All refresh tokens revoked." });
        }
        else
        {
            return BadRequest(new { Status = "Failed", message = "Failed to update password." });
        }
    }

    private static CookieOptions GetCookieOptions()
    {
        return new CookieOptions
        {
            HttpOnly = true,
            Secure = true, // Set to true if using HTTPS
            SameSite = SameSiteMode.Strict, // Or Lax
            Expires = DateTimeOffset.UtcNow.AddDays(7), // Set appropriate expiry
        };
    }
}

public class RegisterRequest
{
    public string Username { get; set; } = string.Empty;
    public string Password { get; set; } = string.Empty;
    public string RegistrationToken { get; set; } = string.Empty;
}
public class LoginRequest
{
    public string Username { get; set; } = string.Empty;
    public string Password { get; set; } = string.Empty;
}

public class UpdatePasswordRequest
{
    public string OldPassword { get; set; } = string.Empty;
    public string NewPassword { get; set; } = string.Empty;
    public string ReNewPassword { get; set; } = string.Empty;
}