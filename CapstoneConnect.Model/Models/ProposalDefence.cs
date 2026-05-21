using System;
using System.Collections.Generic;

namespace CapstoneConnectDatabase.Models
{
    public partial class ProposalDefence
    {
        public int Id { get; set; }
        public string? InternalJury { get; set; }
        public string? ExternalJury { get; set; }
        public string? Remarks { get; set; }
        public string? Reponse { get; set; }
        public int? FypId { get; set; }
        public DateTime? Date { get; set; }
    }
}
