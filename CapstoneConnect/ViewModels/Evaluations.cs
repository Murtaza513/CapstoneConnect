namespace CapstoneConnect.ViewModels
{
    public class Evaluations
    {
        public int Id { get; set; }
        public DateTime Date { get; set; }
        public string InternalJury { get; set; } = null!;
        public string Remarks { get; set; } = null!;
        public int? FypId { get; set; }
        public string? ExternalJury { get; set; }

        public Dictionary<string,string>? Grades { get; set; }
    }
}
