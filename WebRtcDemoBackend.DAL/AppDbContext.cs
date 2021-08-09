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
        public DbSet<ChatMessage> ChatMessages { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<User>();
            modelBuilder.Entity<Room>()
            .HasOne(u => u.User)
            .WithMany(r => r.Rooms);

            modelBuilder.Entity<ChatMessage>()
                .HasOne(r => r.Room)
                .WithMany(c => c.ChatMessages)
                .HasForeignKey(x => x.RoomId)
                .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<ChatMessage>()
                .HasOne(u => u.User)
                .WithMany(c => c.ChatMessages)
                .HasForeignKey(x => x.UserId)
                .OnDelete(DeleteBehavior.Restrict);
        }
    }
}
