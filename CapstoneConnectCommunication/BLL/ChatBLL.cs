using CapstoneConnectCommunication.Hubs;
using CapstoneConnectCommunication.Models;
using CapstoneConnectDatabase.Models;
using Microsoft.AspNetCore.SignalR;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System;

namespace CapstoneConnectCommunication.BLL
{
    public class ChatBLL
    {
        private readonly CapstoneConnectContext _context;
        private readonly IHubContext<ChatHub> _hubContext;

        public ChatBLL(IHubContext<ChatHub> hubContext, CapstoneConnectContext context)
        {
            _context = context;
            _hubContext = hubContext;
        }

        public async Task<IActionResult> CreateChat(NewChatModel model)
        {
            var conversationExists = _context.Conversations
            .Where(c => c.Participants.Any(p => p.UserId == model.fypGroup.ToString()))
            .Any(c => c.Participants.Any(p => p.UserId == model.supervisor));

            if (conversationExists)
            {
                return new ConflictObjectResult(new { message = "Chat already exists!" });
            }

            var student = _context.FypGroups.Select(x => x.Id == model.fypGroup);
            var supervisor = _context.Supervisors.Select(x => x.Id == model.supervisor);

            if (student == null || supervisor == null)
            {
                return new NotFoundObjectResult(new { message = "User Id does not found!" });
            }

            var conversation = new Conversation
            {
                Name = $"Chat between {model.fypGroup} and {model.supervisor}",
                Participants = new List<Participant>
                {
                    new Participant { UserId = model.fypGroup.ToString()},
                    new Participant { UserId = model.supervisor }
                }

            };

            _context.Conversations.Add(conversation);
            await _context.SaveChangesAsync();
            return new OkObjectResult(new { message = "Chat created successfully!" });
        }

        public async Task<IEnumerable<ConversationDto>> GetChatsForUser(string userId)
        {
            if (string.IsNullOrEmpty(userId))
            {
                throw new ArgumentException("User ID cannot be null or empty", nameof(userId));
            }

            var conversations = await _context.Participants
                    .Where(p => p.UserId == userId)
                    .Include(p => p.Conversation)
                        .ThenInclude(c => c.Participants.Where(part => part.UserId != userId))
                    .Select(p => p.Conversation).ToListAsync();

            if (conversations == null || conversations.Count == 0)
            {
                return Enumerable.Empty<ConversationDto>();
            }

            List<ConversationDto> conversationDtos = await InitConversationDto(conversations);

            return conversationDtos;
        }

        private async Task<List<ConversationDto>> InitConversationDto(List<Conversation> conversations)
        {
            var userIds = conversations.SelectMany(c => c.Participants.Select(p => p.UserId)).Distinct();
            var users = await _context.AspNetUsers
                .Where(u => userIds.Contains(u.Id))
                .ToDictionaryAsync(u => u.Id, u => u.UserName);

            var conversationDtos = conversations.Select(c => new ConversationDto
            {
                ChatId = c.Id,
                CreatedAt = c.CreatedAt,
                Name = c.Name,
                Participants = c.Participants.Select(p =>
                {
                    var userIdTrimmed = p.UserId.Trim();

                    users.TryGetValue(userIdTrimmed, out var userName);

                    return new ParticipantDto
                    {
                        Id = p.Id,
                        UserId = p.UserId,
                        ConversationId = p.ConversationId,
                        UserName = userName ?? "Unknown"
                    };
                }).ToList()
            }).ToList();
            return conversationDtos;
        }

        public async Task<List<MessageDto>> GetChatMessages(int conversationId, string userId)
        {
            var messages = await _context.Messages
        .Where(m => m.ConversationId == conversationId &&
                    ((m.SenderId == userId && !m.IsSenderDeleted) ||
                     (m.ReceiverId == userId && !m.IsReceiverDeleted)))
        .OrderBy(m => m.MessageDate).ThenBy(m => m.MessageTime)
        .Select(m => new MessageDto
        {
            MessageId = m.Id,
            MessageContent = m.MessageContent,
            SenderId = m.SenderId,
            ReceiverId = m.ReceiverId,
            CreatedAt = m.CreatedAt,
            MessageDate = m.MessageDate,
            MessageTime = m.MessageTime
        })
        .ToListAsync();

            return messages;
        }


        public async Task<IActionResult> SendMessage([FromBody] SendMessageDto model)
        {
            var sender = _context.AspNetUsers.Select(x => x.Id == model.SenderId);
            if (sender == null)
            {
                return new NotFoundObjectResult(new { message = "Sender does not exist!" });
            }
            var message = new Message
            {
                ConversationId = model.ConversationId,
                SenderId = model.SenderId,
                MessageContent = model.MessageContent ?? "",
                ReceiverId = model.RecieverId
            };

            _context.Messages.Add(message);
            await _context.SaveChangesAsync();

            await _hubContext.Clients.Group(model.ConversationId.ToString())
           .SendAsync("ReceiveMessage", model);


            return new OkObjectResult(new { message = "Message saved successfully!" });
        }
    }
}