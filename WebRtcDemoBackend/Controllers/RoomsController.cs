using Microsoft.AspNetCore.Mvc;
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
