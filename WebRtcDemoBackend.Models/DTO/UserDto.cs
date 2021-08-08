namespace WebRtcDemoBackend.Models.DTO
{
    public class UserDto
    {
        public int? DbId { get; set; }

        public string GoogleId { get; set; }

        public string FullName { get; set; }
        
        public string Email { get; set; }
        
        public string AvatarUrl { get; set; }
    }
}
