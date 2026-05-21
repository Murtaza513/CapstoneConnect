namespace CapstoneConnect.ViewModels
{
    public class ProposalViewSupervisor
    {
        public int Submission_Id { get; set; }
        public int FypId { get; set; }
        public string FypTitle { get; set; }

        public string? FypDescription { get; set; }

        public string TeamMembers { get; set; }

        public DateTime SubmissionDate { get; set; }
         
        public IFormFile files { get; set; }

        public string? Feedback { get; set; }

        public decimal Plagiarism { get; set; }

        public string? status { get; set; }

        public string? Supervisor { get; set;}
        public string? CoSupervisor { get; set; }

    }
}
