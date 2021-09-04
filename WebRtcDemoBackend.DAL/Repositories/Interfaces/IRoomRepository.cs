using System.Collections.Generic;
using System.Threading.Tasks;
using WebRtcDemoBackend.Models.DTO;

namespace WebRtcDemoBackend.DAL.Repositories.Interfaces
{
    public interface IRoomRepository
    {
        RoomDto Get(int roomId);

        IReadOnlyCollection<RoomDto> GetAll();

        RoomDto Create(RoomDto room);

        void DeleteAll(string password);
    }
}
