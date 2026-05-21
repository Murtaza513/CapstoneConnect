namespace CapstoneConnect.ViewModels
{
    public class DocumentUpload
    {
        public string Type { get; set; }
        public IFormFile? Files { get; set; }

        public int FypGroupId { get; set; }

        public string? SupervisorID{ get; set; }

        public string? CoSupervisorId { get; set; }

        public string? StudentId { get; set; }
    }
}
