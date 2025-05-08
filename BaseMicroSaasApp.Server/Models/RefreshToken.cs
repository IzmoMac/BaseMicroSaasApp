namespace BaseMicroSaasApp.Server.Models;

public class RefreshToken
{
    public long Id { get; set; } // Primary Key
    public string Token { get; set; } // The refresh token string
    public DateTime Expires { get; set; } // Expiration date
    public bool IsExpired => DateTime.UtcNow >= Expires;
    public DateTime Created { get; set; } // Creation date
    public DateTime? Revoked { get; set; } // Date it was revoked (if applicable)
    public bool IsActive => Revoked == null && !IsExpired;

    public string ApplicationUserId { get; set; }
    
    // Navigation property
    public ApplicationUser User { get; set; }
}
