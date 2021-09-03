using System;

namespace WebRtcDemoBackend.BLL.Exceptions
{
    public class FullRoomException : Exception
    {
        public FullRoomException(string message) : base(message)
        {
            
        }
    }
}