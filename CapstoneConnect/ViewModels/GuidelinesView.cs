namespace CapstoneConnect.ViewModels
{
    public class GuidelinesView
    {
        public int? Id { get; set; }
        public string? Title { get; set; }
        public string? Section { get; set; }
        public string? Description { get; set; }
        public string? SubmissionType { get; set; }

        public IFormFile? Files { get; set; }
    }
}
