namespace CapstoneConnectCommunication.Models
{
    public class ConversationDto
    {
        public int ChatId { get; set; }
        public DateTime CreatedAt { get; set; }
        public string Name { get; set; }
        public List<ParticipantDto> Participants { get; set; }
    }
}
