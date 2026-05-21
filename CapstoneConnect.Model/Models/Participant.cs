using System;
using System.Collections.Generic;

namespace CapstoneConnectDatabase.Models
{
    public partial class Participant
    {
        public int Id { get; set; }
        public string UserId { get; set; } = null!;
        public int ConversationId { get; set; }

        public virtual Conversation Conversation { get; set; } = null!;
    }
}
