using System;
using System.Collections.Generic;

namespace CapstoneConnectDatabase.Models
{
    public partial class Message
    {
        public int Id { get; set; }
        public string MessageContent { get; set; } = null!;
        public int ConversationId { get; set; }
        public string SenderId { get; set; } = null!;
        public DateTime MessageDate { get; set; }
        public TimeSpan MessageTime { get; set; }
        public bool IsSenderDeleted { get; set; }
        public bool IsReceiverDeleted { get; set; }
        public string? ReceiverId { get; set; }
        public DateTime? CreatedAt { get; set; }

        public virtual Conversation Conversation { get; set; } = null!;
    }
}
