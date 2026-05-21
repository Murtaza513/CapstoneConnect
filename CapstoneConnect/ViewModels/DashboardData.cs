namespace CapstoneConnect.ViewModels
{
    public class Member
    {
        public string Id { get; set; }
        public string Name { get; set; }
    }

    public class Dashboard_Supervisor
    {
        public string SupervisorId { get; set; }
        public string SupervisorName { get; set; }
    }

    public class Detail
    {
        public int? Progress { get; set; }
        public string Status { get; set; }
        public List<FeedbackItem> Feedback { get; set; }
    }
    public class FeedbackItem
    {
        public int FypId { get; set; }
        public string Feedback { get; set; }
    }

    public class DashboardData
    {
        public List<Member> Members { get; set; }
        public List<Dashboard_Supervisor> Supervisors { get; set; }
        public Detail Details { get; set; }
    }

}
