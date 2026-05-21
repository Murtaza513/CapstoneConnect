namespace CapstoneConnect.ViewModels
{
    public class SupervisorViewModel
    {

        public string Id { get; set; } = null!;
        public string? Username { get; set; }

        public int? AvailableSlots { get; set; }
        public string? FypPreferences { get; set; }
        public string? Department { get; set; } 
        public int? ProjectsSupervised { get; set; }
        public string? Email { get; set; }
        public string? PhoneNumber { get; set; } 
        public string? AvgGrade { get; set; }
        public string? AvgRank { get; set; }

        public string? AdminRank { get; set; }
        public Dictionary<int,string>? OnGoingProject { get;set; }

        //public List<string> OnGoingProjects { get; set;}


    }
}
