namespace CapstoneConnectCommunication.Models
{
    public class SendMessageDto
    {
        public int ConversationId { get; set; }
        public string SenderId { get; set; }
        public string RecieverId { get; set; }
        public string? MessageContent { get; set; }


    }
}
