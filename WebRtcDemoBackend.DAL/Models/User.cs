using System.Collections.Generic;

namespace WebRtcDemoBackend.DAL.Models
{
    public class User
    {
        public int Id { get; set; }

        public string GoogleId { get; set; }

        public string FullName { get; set; }

        public string Email { get; set; }

        public string AvatarUrl { get; set; }

        public List<Room> Rooms { get; set; }
    }
}
