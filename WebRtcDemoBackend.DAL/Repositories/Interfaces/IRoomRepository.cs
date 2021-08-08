using System.Collections.Generic;
using WebRtcDemoBackend.Models.DTO;

namespace WebRtcDemoBackend.DAL.Repositories.Interfaces
{
    public interface IRoomRepository
    {
        IReadOnlyCollection<RoomDto> GetAll();

        RoomDto Create(RoomDto room);
    }
}
