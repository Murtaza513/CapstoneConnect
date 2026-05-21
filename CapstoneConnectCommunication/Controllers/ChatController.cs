using CapstoneConnectCommunication.BLL;
using Microsoft.AspNetCore.Mvc;
using CapstoneConnectDatabase.Models;
using CapstoneConnectCommunication.Models;
using CapstoneConnectLog.Attributes;
namespace CapstoneConnectCommunication.Controllers
{
    [Route("[controller]")]
    [ApiController]
    [Logging]
    public class ChatController : ControllerBase
    {
        private readonly ChatBLL _chatBLL;
        public ChatController(ChatBLL chatBLL)
        {
            _chatBLL = chatBLL; 
        }

        [HttpPost("CreateChat")]
        public async Task<IActionResult> CreateChat(NewChatModel model)
        {
            try
            {
                var result = await _chatBLL.CreateChat(model);
                return result;
            }
            catch (Exception ex) 
            {
                 return BadRequest(ex.Message);
            }
            
            
        }

        [HttpGet("FetchAllChats/{userId}")]
        public async Task<IActionResult> FetchAllChats(string userId)
        {
            try
            {
                if (userId == null)
                {
                    return BadRequest("User ID is required.");
                }
                var chats = await _chatBLL.GetChatsForUser(userId);
                return Ok(chats);
            }
            catch(Exception e)
            {
                return BadRequest(e.Message);
            }
           
        }

        [HttpGet("FetchChatMessages/{chatId}/{userId}")]
        public async Task<IActionResult> FetchChatMessages(int chatId, string userId)
        {
            try
            {
                var messages = await _chatBLL.GetChatMessages(chatId, userId);
                return Ok(messages);
            }
            catch(Exception e)
            {
                return BadRequest(e.Message);
            }
            
        }

        [HttpPost("SendMessage")]
        public async Task<ActionResult> SendMessage([FromBody]SendMessageDto model)
        {
            if (model == null)
            {
                return BadRequest("Invalid message data.");
            }
            try
            {
                await _chatBLL.SendMessage(model);
                return Ok();
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }


        }
        
    }
}
