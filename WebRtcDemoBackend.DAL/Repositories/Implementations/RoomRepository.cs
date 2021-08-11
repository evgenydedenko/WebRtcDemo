using System;
using System.Collections.Generic;
using System.Linq;
using WebRtcDemoBackend.DAL.Repositories.Interfaces;
using WebRtcDemoBackend.Models.DTO;

namespace WebRtcDemoBackend.DAL.Repositories.Implementations
{
    public class RoomRepository : BaseRepository, IRoomRepository
    {
        public RoomRepository(AppDbContext context) : base(context)
        {

        }

        public RoomDto Create(RoomDto room)
        {
            var roomEntity = new Models.Room
            {
                Description = room.Description,
                CreatedAt = DateTime.UtcNow,
                UserId = room.UserId
            };
            
            _context.Rooms.Add(roomEntity);

            _context.SaveChanges();

            room.Id = roomEntity.Id;

            return room;
        }

        public IReadOnlyCollection<RoomDto> GetAll()
        {
           return _context.Rooms.Select(r => new RoomDto
           {
               Id = r.Id,
               CreatedAt = r.CreatedAt,
               UserId = r.UserId,
               CreatedBy = r.User.FullName,
               Description = r.Description
           }).ToArray();
        }

        public RoomDto Get(int roomId)
        {
            var entity = _context.Rooms.FirstOrDefault(r => r.Id == roomId);
           
            if (entity == null)
            {
                throw new ArgumentException($"Room with id '{roomId}' not found");
            }

            return new RoomDto
            {
                Id = entity.Id,
                CreatedAt = entity.CreatedAt,
                UserId = entity.UserId,
                CreatedBy = entity.User.FullName,
                Description = entity.Description
            };
        }
    }
}
