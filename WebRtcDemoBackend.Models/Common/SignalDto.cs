namespace WebRtcDemoBackend.Models.Common
{
    public class SignalDto
    {
        public object Signal { get; set; }

        public string CallerID { get; set; }

        public string UserToSignal { get; set; }

        public string ConnectionId { get; set; }
    }
}
