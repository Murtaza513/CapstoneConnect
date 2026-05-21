    namespace CapstoneConnectCommunication.Models
{
    public class MessageDto
    {
        public int MessageId { get; set; }
        public string MessageContent { get; set; }
        public string SenderId { get; set; }
        public string ReceiverId { get; set; }

        public DateTime? CreatedAt { get; set; }
        public DateTime MessageDate { get; set; }
        public TimeSpan MessageTime { get; set; }

    }

}
