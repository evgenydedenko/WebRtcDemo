using System.Linq;
using WebRtcDemoBackend.DAL.Repositories.Interfaces;
using WebRtcDemoBackend.Models.DTO;

namespace WebRtcDemoBackend.DAL.Repositories.Implementations
{
    public class UserRepository : BaseRepository, IUserRepository
    {
        public UserRepository(AppDbContext context) : base(context)
        {

        }

        public UserDto GetOrInsert(UserDto user)
        {
            var existUser = _context.Users.FirstOrDefault(x => x.GoogleId == user.GoogleId);
            
            if (existUser == null)
            {
                existUser = new Models.User
                {
                    GoogleId = user.GoogleId,
                    AvatarUrl = user.AvatarUrl,
                    FullName = user.FullName,
                    Email = user.Email
                };

                _context.Users.Add(existUser);
                _context.SaveChanges();
            }

            user.DbId = existUser.Id;
            return user;
        }
    }
}
