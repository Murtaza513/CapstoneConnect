namespace CapstoneConnect.ViewModels
{
    public class SubmissionViewFypGrp
    {
        public int Id { get; set; }

        public string? Submission_Type { get; set; }
        public string? Project_Title { get; set; }

        public string? Supervisor_Name { get; set; }

        public string? Co_Supervisor_Name { get; set; }

        public DateTime? date { get; set; }

        public string? status { get; set; }

        public decimal Plagiarism { get; set; }

        public string? Submitted_By { get; set; }
    }
}
