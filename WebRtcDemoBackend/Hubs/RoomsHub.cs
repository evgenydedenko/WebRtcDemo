using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.SignalR;
using System;
using System.Threading.Tasks;
using WebRtcDemoBackend.BLL.Helpers;
using WebRtcDemoBackend.BLL.Sevices;
using WebRtcDemoBackend.DAL.Repositories.Interfaces;
using WebRtcDemoBackend.Models.Common;
using WebRtcDemoBackend.Models.DTO;

namespace WebRtcDemoBackend.Hubs
{
    public class RoomsHub : Hub
    {
        private readonly IHttpContextAccessor _http;
        private readonly IChatRepository _chatRepository;
        private readonly static RoomsProcessor roomsProcessor = new();
        private IQueryCollection QueryParams => _http.HttpContext.Request.Query;
        private string ConnectionId => Context.ConnectionId;
        private string RoomId => QueryParams["roomId"];
        private string UserId => QueryParams["userId"];
        private int RoomNumId => RoomHelper.GetInt(QueryParams["roomId"]);
        private int UserNumId => RoomHelper.GetInt(QueryParams["userId"]);


        public RoomsHub(IHttpContextAccessor http, 
            IChatRepository chatRepository)
        {
            _http = http;
            _chatRepository = chatRepository;
        }

        public override async Task OnConnectedAsync()
        {
            await Groups.AddToGroupAsync(ConnectionId, RoomId);
            await base.OnConnectedAsync();
        }

        public override async Task OnDisconnectedAsync(Exception exception)
        {
            await Groups.RemoveFromGroupAsync(ConnectionId, RoomId);
            roomsProcessor.LeaveRoom(RoomNumId, ConnectionId);
            await base.OnDisconnectedAsync(exception);
        }

        public async Task SendMessage(ChatMessageDto chatMessageDto)
        {
            chatMessageDto = _chatRepository.Create(chatMessageDto);
            var roomId = RoomHelper.GetString(chatMessageDto.RoomId);
            await Clients.Group(roomId).SendAsync("OnMessageSent", chatMessageDto);
        }

        public async Task JoinRoom()
        {
            var anotherUsers = roomsProcessor.JoinRoom(RoomNumId, UserNumId, ConnectionId);
            await Clients.Group(RoomId).SendAsync("onAnotherUsersSent", anotherUsers);
        }

        public async Task OnSendingSignal(SignalDto payload)
        {
            await Clients.Group(RoomId).SendAsync("OnUserJoined", payload);
        }

        public async Task OnReturningSignal(SignalDto payload)
        {
            payload.ConnectionId = ConnectionId;
            await Clients.Group(RoomId).SendAsync("OnReceivingReturnedSignal", payload);
        }
    }
}
