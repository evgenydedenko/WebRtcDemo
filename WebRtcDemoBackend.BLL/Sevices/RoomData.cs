using System.Collections.Generic;
using System.Linq;
using WebRtcDemoBackend.Models.Common;

namespace WebRtcDemoBackend.BLL.Sevices
{
    public class RoomData
    {
        private readonly List<RoomUser> users = new();
        private readonly object _lock = new();

        public int UsersCount 
        { 
            get 
            {
                lock(_lock)
                {
                    return users.Count;
                }
            } 
        }

        public void AddUser(int userId, string connectionId)
        {
            lock(_lock)
            {
                RemoveUserByConnection(connectionId);
                users.Add(new RoomUser(userId, connectionId));
            }
        }

        public void RemoveUser(string connectionId)
        {
            lock(_lock)
            {
                RemoveUserByConnection(connectionId);
            }
        }

        public IReadOnlyCollection<RoomUser> GetAnotherUsers(string connectionId)
        {
            return users.Where(x => x.ConnectionId != connectionId).ToArray();
        }

        private void RemoveUserByConnection(string connectionId)
        {
            var user = FindUser(connectionId);
            if (user != null)
            {
                users.Remove(user);
            }
        }

        private RoomUser FindUser(string connectionId)
        {
            return users.FirstOrDefault(x => x.ConnectionId == connectionId);
        }
    }
}
