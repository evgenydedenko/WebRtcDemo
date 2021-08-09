using System;

namespace WebRtcDemoBackend.Models.DTO
{
    public class ChatMessageDto
    {
        public int Id { get; set; }

        public int UserId { get; set; }

        public int RoomId { get; set; }

        public string Message { get; set; }

        public string CreatedBy { get; set; }

        public DateTime CreatedAt { get; set; }

        public string AvatarUrl { get; set; }
    }
}
