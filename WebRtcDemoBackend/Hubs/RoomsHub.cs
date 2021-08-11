using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.SignalR;
using System;
using System.Threading.Tasks;
using WebRtcDemoBackend.BLL.Sevices;
using WebRtcDemoBackend.DAL.Repositories.Interfaces;
using WebRtcDemoBackend.Models.DTO;

namespace WebRtcDemoBackend.Hubs
{
    public class RoomsHub : Hub
    {
        private readonly IHttpContextAccessor _http;
        private readonly IChatRepository _chatRepository;
        private readonly static RoomsProcessor roomsProcessor = new();

        public RoomsHub(IHttpContextAccessor http, 
            IChatRepository chatRepository)
        {
            _http = http;
            _chatRepository = chatRepository;
        }

        public override async Task OnConnectedAsync()
        {
            var roomId = GetRoomId();
            await Groups.AddToGroupAsync(Context.ConnectionId, roomId);
            await base.OnConnectedAsync();
        }

        public override async Task OnDisconnectedAsync(Exception exception)
        {
            var roomId = GetRoomId();
            await Groups.RemoveFromGroupAsync(Context.ConnectionId, roomId);
            await base.OnDisconnectedAsync(exception);
        }

        public async Task SendMessage(ChatMessageDto chatMessageDto)
        {
            chatMessageDto = _chatRepository.Create(chatMessageDto);
            var roomId = chatMessageDto.RoomId.ToString();
            await Clients.Group(roomId).SendAsync("OnMessageSent", chatMessageDto);
        }

        private string GetRoomId()
        {
            var query = _http.HttpContext.Request.Query;
            return query["roomId"];
        }
    }
}
