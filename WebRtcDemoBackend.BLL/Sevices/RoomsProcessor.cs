using System;
using System.Collections.Concurrent;
using System.Collections.Generic;
using System.Linq;
using WebRtcDemoBackend.BLL.Classes;
using WebRtcDemoBackend.BLL.Exceptions;
using WebRtcDemoBackend.Models.Common;

namespace WebRtcDemoBackend.BLL.Sevices
{
    public class RoomsProcessor
    {
        private readonly ConcurrentDictionary<int, RoomData> _rooms = new();

        public IReadOnlyCollection<RoomUserCountInfo> RoomsIds
        {
            get
            {
                return _rooms.Select(r => new RoomUserCountInfo
                {
                    Id = r.Key,
                    UserCount = r.Value.UsersCount
                }).ToArray();
            }
        }
        
        public IReadOnlyCollection<RoomUser> JoinRoom(int roomId, int userId, string connectionId)
        {
            var room = GetRoom(roomId) ?? AddRoom(roomId);
            if (room.UsersCount > Constants.Constants.MaxRoomUser)
            {
                throw new FullRoomException("Room is full");
            }
            room.AddUser(userId, connectionId);
            return room.GetAnotherUsers(connectionId);
        }

        public void LeaveRoom(int roomId, string connectionId)
        {
            var room = GetRoom(roomId);
            
            if (room == null) return;
            
            room.RemoveUser(connectionId);
            if (room.UsersCount == 0)
            {
                RemoveRoom(roomId);
            }
        }

        private RoomData GetRoom(int roomId)
        {
            return _rooms.TryGetValue(roomId, out var roomClients) ? roomClients : null;
        }

        private RoomData AddRoom(int roomId)
        {
            var room = new RoomData();

            _rooms.TryAdd(roomId, room);

            return room;
        }

        private RoomData RemoveRoom(int roomId)
        {
            _rooms.TryRemove(roomId, value: out var room);

            return room;
        }
    }
}
