namespace WebRtcDemoBackend.BLL.Helpers
{
    public static class RoomHelper
    {
        public static string GetString(int roomId)
        {
            return roomId.ToString();
        }

        public static int GetInt(string roomId)
        {
            return int.Parse(roomId);
        }
    }
}
