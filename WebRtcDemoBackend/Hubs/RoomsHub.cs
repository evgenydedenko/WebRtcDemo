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
        public readonly static RoomsProcessor RoomsProcessor = new();
        private IQueryCollection QueryParams => _http?.HttpContext?.Request.Query;
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
            RoomsProcessor.LeaveRoom(RoomNumId, ConnectionId);
            await Clients.Group(RoomId).SendAsync("onAnotherUsersDisconnected", ConnectionId);
            await base.OnDisconnectedAsync(exception);
        }

        public async Task SendMessage(ChatMessageDto chatMessageDto)
        {
            chatMessageDto = _chatRepository.Create(chatMessageDto);
            var roomId = RoomHelper.GetString(chatMessageDto.RoomId);
            await Clients.Group(roomId).SendAsync("onMessageSent", chatMessageDto);
        }

        public async Task JoinRoom()
        {
            var anotherUsers = RoomsProcessor.JoinRoom(RoomNumId, UserNumId, ConnectionId);
            await Clients.Client(ConnectionId).SendAsync("onAnotherUsersSent", anotherUsers);
        }

        public async Task OnSendingSignal(SignalDto payload)
        {
            await Clients.Client(payload.UserToSignal).SendAsync("onUserJoined", payload);
        }

        public async Task OnReturningSignal(SignalDto payload)
        {
            payload.ConnectionId = ConnectionId;
            await Clients.Client(payload.CallerID).SendAsync("onReceivingReturnedSignal", payload);
        }
    }
}
