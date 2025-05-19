using Microsoft.AspNetCore.Identity;

namespace BaseMicroSaasApp.Server.Models;

public class ApplicationUser : IdentityUser
{
    public ICollection<RefreshToken> RefreshTokens { get; set; } = [];
}