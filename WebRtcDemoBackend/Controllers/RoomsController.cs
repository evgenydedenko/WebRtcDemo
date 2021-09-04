using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;
using WebRtcDemoBackend.BLL.Constants;
using WebRtcDemoBackend.DAL.Repositories.Interfaces;
using WebRtcDemoBackend.Hubs;
using WebRtcDemoBackend.Models.DTO;

namespace WebRtcDemoBackend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class RoomController : ControllerBase
    {
        private readonly IRoomRepository _roomRepository;

        public RoomController(IRoomRepository roomRepository)
        {
            _roomRepository = roomRepository;
        }

        [HttpGet]
        [Route("/api/[controller]/[action]")]
        public IActionResult Get(int roomId)
        {
            try
            {
                return Ok(_roomRepository.Get(roomId));
            } 
            catch (ArgumentException ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpGet]
        public IActionResult GetAll()
        {
            var rooms = _roomRepository.GetAll();
            MapActiveUsers(rooms);

            return Ok(rooms);
        }

        [HttpGet]
        [Route("/api/[controller]/[action]")]
        public IActionResult Search(string userName, int userId)
        {
            
            var rooms = _roomRepository.GetAll();

            MapActiveUsers(rooms);

            var existRoom = rooms.Where(x => x.UsersCount <= Constants.MaxRoomUser)
                                .OrderByDescending(x => x.UsersCount)
                                .FirstOrDefault() ?? 
                            _roomRepository.Create(new RoomDto
                            {
                                UserId = userId,
                                Description = "Auto generated room",
                                CreatedBy = userName,
                                CreatedAt = DateTime.UtcNow
                            });

            return Ok(existRoom.Id);
        }

        [HttpPost]
        public IActionResult Post([FromBody] RoomDto room)
        {
            return Ok(_roomRepository.Create(room));
        }

        [HttpGet]
        [Route("/api/[controller]/[action]")]
        public IActionResult Delete(string pas)
        {
            _roomRepository.DeleteAll(pas);

            return Ok();
        }

        private static void MapActiveUsers(IReadOnlyCollection<RoomDto> rooms)
        {
            var activeRooms = RoomsHub.RoomsProcessor.RoomsIds;

            if (activeRooms.Any())
            {
                foreach (var roomDto in rooms)
                {
                    var activeRoom = activeRooms.FirstOrDefault(x => x.Id == roomDto.Id);
                    if (activeRoom == null) continue;
                    roomDto.UsersCount = activeRoom.UserCount;
                }
            }
        }
    }
}
