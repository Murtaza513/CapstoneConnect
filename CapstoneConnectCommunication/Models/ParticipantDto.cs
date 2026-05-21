namespace CapstoneConnectCommunication.Models
{
    public class ParticipantDto
    {
        public int Id { get; set; }
        public string UserId { get; set; }

        public string UserName { get; set; } = string.Empty;
        public int ConversationId { get; set; }
    }
}
