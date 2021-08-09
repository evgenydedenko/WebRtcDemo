using System.Collections.Generic;
using WebRtcDemoBackend.Models.DTO;

namespace WebRtcDemoBackend.DAL.Repositories.Interfaces
{
    public interface IChatRepository
    {
        IReadOnlyCollection<ChatMessageDto> GetAllMessages(int roomId);

        ChatMessageDto Create(ChatMessageDto messageDto);
    }
}
