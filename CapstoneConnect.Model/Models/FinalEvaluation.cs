using System;
using System.Collections.Generic;

namespace CapstoneConnectDatabase.Models
{
    public partial class FinalEvaluation
    {
        public int Id { get; set; }
        public string? InternalJury { get; set; }
        public string? ExternalJury { get; set; }
        public string? Remarks { get; set; }
        public DateTime? Date { get; set; }
        public int? FypId { get; set; }
    }
}
