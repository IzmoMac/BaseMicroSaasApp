using BaseMicroSaasApp.Server.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Security.Cryptography;
using System.Text;

namespace BaseMicroSaasApp.Server.Helpers;

public class TokenService
{
    private readonly IConfiguration _configuration;
    private readonly ApplicationDbContext _context;
    public TokenService(IConfiguration config, ApplicationDbContext context)
    {
        _configuration = config;
        _context = context;
    }
    public string CreateToken(ApplicationUser user)
    {
        var claims = new[]
        {
            new Claim(JwtRegisteredClaimNames.Sub, user.Id),
            new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString()),
        };
        var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_configuration["JWT:Key"]!));
        var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);
        var token = new JwtSecurityToken(
            issuer: _configuration["JWT:ValidIssuer"],
            audience: _configuration["JWT:ValidAudience"],
            claims: claims,
            expires: DateTime.Now.AddMinutes(15),
            signingCredentials: creds);
        return new JwtSecurityTokenHandler().WriteToken(token);
    }
    public async Task<RefreshToken> GenerateRefreshTokenAsync(string userId)
    {
        //TODO Make this longer
        var randomNumber = new byte[256];
        using var rng = RandomNumberGenerator.Create();
        rng.GetBytes(randomNumber);
        var tokenString = Convert.ToBase64String(randomNumber);

        // Set refresh token expiry (e.g., 7 days or more)
        var refreshTokenExpiryInDays = 7;

        var refreshToken = new RefreshToken
        {
            Token = tokenString,
            Expires = DateTime.UtcNow.AddDays(refreshTokenExpiryInDays),
            Created = DateTime.UtcNow,
            ApplicationUserId = userId
        };

        await _context.RefreshTokens.AddAsync(refreshToken);
        await _context.SaveChangesAsync();

        return refreshToken;
    }

    public async Task<RefreshToken?> GetRefreshTokenAsync(string refreshToken)
    {
        return await _context.RefreshTokens
            .Include(rt => rt.User)
            .FirstOrDefaultAsync(rt => rt.Token == refreshToken);
    }

    public async Task RevokeRefreshTokenAsync(string refreshToken)
    {
        var rToken = await _context.RefreshTokens.FirstOrDefaultAsync(rt => rt.Token == refreshToken);
        if (rToken != null && rToken.IsActive)
        {
            rToken.Revoked = DateTime.UtcNow;
            await _context.SaveChangesAsync();
        }
    }

    // Method to clean up expired refresh tokens 
    //public async Task RemoveExpiredRefreshTokensAsync(string userId)
    //{
    //    var expiredTokens = await _context.RefreshTokens
    //        .Where(rt => rt.ApplicationUserId == userId && rt.IsExpired)
    //    .ToListAsync();

    //    if (expiredTokens.Any())
    //    {
    //        _context.RefreshTokens.RemoveRange(expiredTokens);
    //        await _context.SaveChangesAsync();
    //    }
    //}
}
