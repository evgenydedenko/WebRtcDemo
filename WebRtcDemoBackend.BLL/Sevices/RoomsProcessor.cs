using System.Collections.Concurrent;
using System.Collections.Generic;
using WebRtcDemoBackend.Models.Common;

namespace WebRtcDemoBackend.BLL.Sevices
{
    public class RoomsProcessor
    {
        private readonly ConcurrentDictionary<int, RoomData> rooms = new ConcurrentDictionary<int, RoomData>();

        public IReadOnlyCollection<RoomUser> JoinRoom(int roomId, int userId, string conenctionId)
        {
            var room = GetRoom(roomId);
            if (room == null)
            {
                room = AddRoom(roomId);
            }
            room.AddUser(userId, conenctionId);

            return room.GetAnotherUsers(conenctionId);
        }

        public void LeaveRoom(int roomId, string connectionId)
        {
            var room = GetRoom(roomId);
            if (room != null)
            {
                room.RemoveUser(connectionId);
                if (room.UsersCount == 0)
                {
                    RemoveRoom(roomId);
                } 
            }
        }

        public RoomData GetRoom(int roomId)
        {
            if (rooms.TryGetValue(roomId, out RoomData roomClients))
            {
                return roomClients;
            }
            return null;
        }

        private RoomData AddRoom(int roomId)
        {
            var room = new RoomData();

            rooms.TryAdd(roomId, room);

            return room;
        }

        private RoomData RemoveRoom(int roomId)
        {
            rooms.TryRemove(roomId, out RoomData room);

            return room;
        }
    }
}
