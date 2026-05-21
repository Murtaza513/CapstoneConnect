namespace CapstoneConnect.ViewModels
{
    public class ProfileView
    {
        //STUDENT'S PROFILE VALUES
        public int? FypId { get; set; }
        public string? FypTitle { get; set; }
        public string? RegisteredEmail { get; set; }
        public string? TeamLeadId { get; set; }
        public string? TeamLeadName { get; set; }
        public decimal? TeamLeadCGPA { get; set; }
        public List<string>? MembersId { get; set; }
        public List<string>? MembersName { get; set; }
        public List<decimal>? MembersCGPA { get; set; }



        //SUPERVISOR'S PROFILE
        public string? SupervisorId { get; set; }
        public string? SupervisorName { get; set; }
        public string? Preferences { get; set; }
        public string? Department { get; set; }


        //ADMIN'S PROFILE
        public string? AdminId { get; set; }
        public string? AdminUsername { get; set; }
        public string? AdminEmail { get; set; }
    }
}
