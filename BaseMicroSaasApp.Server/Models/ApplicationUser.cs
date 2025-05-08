using Microsoft.AspNetCore.Identity;

namespace BaseMicroSaasApp.Server.Models;

public class ApplicationUser : IdentityUser
{
    public ICollection<RefreshToken> RefreshTokens { get; set; } = [];

    //public string RefreshToken { get; set; } = string.Empty;
    //public DateTime RefreshTokenExpiryTime { get; set; }

    //IEnumerable<tbl_trip> tbl_trips { get; set; } = [];
    //IEnumerable<tbl_fillup> tbl_fillups { get; set; } = [];
}