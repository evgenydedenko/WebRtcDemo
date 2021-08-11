using System.Collections.Concurrent;

namespace WebRtcDemoBackend.BLL.Sevices
{
    public class RoomsProcessor
    {
        private readonly ConcurrentDictionary<int, RoomData> rooms = new ConcurrentDictionary<int, RoomData>();

        public void AddUserRoom(int userId, string roomId, string connectionId)
        {
            var roomIdInt = int.Parse(roomId);
            JoinRoom(userId, roomIdInt, connectionId);
        }

        public void JoinRoom(int userId, int roomId, string connectionId)
        {
            var room = GetRoom(roomId);
            if (room == null)
            {
                room = AddRoom(roomId);
            }
            room.AddUser(userId, connectionId);
        }

        public void LeaveRoom(int roomId, string connectionId)
        {
            var room = GetRoom(roomId);
            if (room == null)
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

        public RoomData AddRoom(int roomId)
        {
            var room = new RoomData();

            rooms.TryAdd(roomId, room);

            return room;
        }

        public RoomData RemoveRoom(int roomId)
        {
            rooms.TryRemove(roomId, out RoomData room);

            return room;
        }
    }
}
