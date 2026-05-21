using System;
using System.Collections.Generic;

namespace CapstoneConnectDatabase.Models
{
    public partial class MidEvaluation
    {
        public int Id { get; set; }
        public DateTime Date { get; set; }
        public string InternalJury { get; set; } = null!;
        public string Remarks { get; set; } = null!;
        public int? FypId { get; set; }
        public string? ExternalJury { get; set; }
    }
}
