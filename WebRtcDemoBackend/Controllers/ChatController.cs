using Microsoft.AspNetCore.Mvc;
using WebRtcDemoBackend.DAL.Repositories.Interfaces;
using WebRtcDemoBackend.Models.DTO;

namespace WebRtcDemoBackend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ChatController : ControllerBase
    {
        private readonly IChatRepository _chatRepository;

        public ChatController(IChatRepository chatRepository)
        {
            _chatRepository = chatRepository;
        }

        [HttpGet]
        public IActionResult GetAllMessages(int roomId)
        {
            return Ok(_chatRepository.GetAllMessages(roomId));
        }

        [HttpPost]
        public IActionResult GetAllMessages(ChatMessageDto messageDto)
        {
            return Ok(_chatRepository.Create(messageDto));
        }
    }
}
