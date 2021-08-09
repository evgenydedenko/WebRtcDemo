using System;

namespace WebRtcDemoBackend.DAL.Models
{
    public class ChatMessage
    {
        public int Id { get; set; }

        public int UserId { get; set; }

        public int RoomId { get; set; }

        public string Message { get; set; }

        public DateTime CreatedAt { get; set; }

        public User User { get; set; }

        public Room Room { get; set; }
    }
}
