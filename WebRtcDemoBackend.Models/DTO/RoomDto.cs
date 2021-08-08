using System;

namespace WebRtcDemoBackend.Models.DTO
{
    public class RoomDto
    {
        public int Id { get; set; }

        public string Description { get; set; }

        public DateTime CreatedAt { get; set; }

        public int UserId { get; set; }

        public string CreatedBy { get; set; }
    }
}
