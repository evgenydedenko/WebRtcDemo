using System;
using System.Collections.Generic;

namespace WebRtcDemoBackend.DAL.Models
{
    public class Room
    {
        public int Id { get; set; }

        public string Description { get; set; }

        public DateTime CreatedAt { get; set; }

        public int UserId { get; set; }

        public User User { get; set; }

        public List<ChatMessage> ChatMessages { get; set; }
    }
}
