namespace WebRtcDemoBackend.Models.Common
{
    public class RoomUser
    {
        public int UserId { get; set; }

        public string ConnectionId { get; set; }

        public RoomUser()
        {

        }

        public RoomUser(int userId, string connectionId)
        {
            UserId = userId;
            ConnectionId = connectionId;
        }
    }
}
