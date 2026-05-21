namespace CapstoneConnect.ViewModels
{
    public class FypRegistration
    {
        public int? FypId { get; set; }
        public string? teamLeadId { get; set; }
        public  List<string>? students {  get; set; }
        public string? fypTitle { get; set;}

        public string? teamleademail { get; set;}
        public Dictionary<string,decimal?>? cgpa { get;set; }
        public string? RejectionNote { get; set; }
    }
}
