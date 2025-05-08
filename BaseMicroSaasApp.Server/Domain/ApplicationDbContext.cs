using BaseMicroSaasApp.Server.Domain;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
   using Microsoft.EntityFrameworkCore;

public class ApplicationDbContext : IdentityDbContext
{
    public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
        : base(options)
    {
    }

    public virtual DbSet<tbl_trip> tbl_trips { get; set; }
    public virtual DbSet<tbl_fillup> tbl_fillups { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        // Configure one-to-many relationship
        modelBuilder.Entity<tbl_fillup>()
            .HasOne(f => f.User)
            .WithMany() // No navigation property in IdentityUser
            .HasForeignKey(f => f.UserId)
            .OnDelete(DeleteBehavior.Cascade);

        // Configure one-to-many relationship for tbl_trip (optional)
        modelBuilder.Entity<tbl_trip>()
            .HasOne(t => t.User)
            .WithMany()
            .HasForeignKey(t => t.UserId)
            .OnDelete(DeleteBehavior.Cascade);
    }
}
   
