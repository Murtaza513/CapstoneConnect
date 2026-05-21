namespace CapstoneConnect.ViewModels
{
    public class MailRequest
    {
        public string? Id { get; set; }
        public string? Subject { get; set; }
        public string? Body { get; set; }
        public List<IFormFile>? Attachments { get; set; }
    }
}
