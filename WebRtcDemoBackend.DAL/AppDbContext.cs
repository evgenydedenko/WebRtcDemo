using Microsoft.EntityFrameworkCore;
using WebRtcDemoBackend.DAL.Models;

namespace WebRtcDemoBackend.DAL
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options)
        {

        }

        public DbSet<User> Users { get; set; }
        public DbSet<Room> Rooms { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<User>().ToTable("Users");
            modelBuilder.Entity<Room>()
            .HasOne(u => u.User)
            .WithMany(r => r.Rooms);
        }
    }
}
