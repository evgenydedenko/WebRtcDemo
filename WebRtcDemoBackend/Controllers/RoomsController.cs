using Microsoft.AspNetCore.Mvc;
using System;
using WebRtcDemoBackend.DAL.Repositories.Interfaces;
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
            return Ok(_roomRepository.GetAll());
        }

        [HttpPost]
        public IActionResult Post([FromBody] RoomDto room)
        {
            return Ok(_roomRepository.Create(room));
        }
    }
}
