using System.Collections.Generic;
using System.Linq;
using WebRtcDemoBackend.DAL.Models;
using WebRtcDemoBackend.DAL.Repositories.Interfaces;
using WebRtcDemoBackend.Models.DTO;

namespace WebRtcDemoBackend.DAL.Repositories.Implementations
{
    public class ChatRepository : BaseRepository, IChatRepository
    {
        public ChatRepository(AppDbContext context) : base(context)
        {

        }

        public IReadOnlyCollection<ChatMessageDto> GetAllMessages(int roomId)
        {
            return _context.ChatMessages
                .Where(x => x.RoomId == roomId)
                .Select(x => new ChatMessageDto
                {
                    Id = x.Id,
                    RoomId = x.RoomId,
                    UserId = x.UserId,
                    Message = x.Message,
                    CreatedAt = x.CreatedAt,
                    CreatedBy = x.User.FullName,
                    AvatarUrl = x.User.AvatarUrl
                }).ToArray();
        }

        public ChatMessageDto Create(ChatMessageDto messageDto)
        {
            var messageEnity = new ChatMessage
            {
                RoomId = messageDto.RoomId,
                UserId = messageDto.UserId,
                CreatedAt = System.DateTime.UtcNow,
                Message = messageDto.Message
            };

            _context.ChatMessages.Add(messageEnity);
            _context.SaveChanges();

            messageDto.Id = messageEnity.Id;
            messageDto.CreatedBy = messageEnity.User.FullName;
            messageDto.AvatarUrl = messageEnity.User.AvatarUrl

            return messageDto;
        }
    }
}
