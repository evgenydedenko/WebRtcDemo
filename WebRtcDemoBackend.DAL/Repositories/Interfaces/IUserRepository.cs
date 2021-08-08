using WebRtcDemoBackend.Models.DTO;

namespace WebRtcDemoBackend.DAL.Repositories.Interfaces
{
    public interface IUserRepository
    {
        UserDto GetOrInsert(UserDto user);
    }
}
