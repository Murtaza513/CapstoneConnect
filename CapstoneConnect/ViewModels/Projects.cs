namespace CapstoneConnect.ViewModels
{
    public class Projects
    {
        public int Id { get; set; }

        public string Title { get; set; }

        public string teamlead { get; set; }

        public string Supervisor { get; set; }

        public string? Description { get; set; }

        public Dictionary<string,string>? Members { get; set; }
        
        public string? CoSupervisor { get; set; }

        public string? Grade { get; set; }

        public string? Inspiration { get; set; }

        public string? Tags { get; set; }

        public string? Status { get; set; }

        public int? Progress { get; set; }

        public int? FinalReportId { get; set; }
    }
}
