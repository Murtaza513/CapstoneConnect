using System;
using System.Collections.Generic;

namespace CapstoneConnectDatabase.Models
{
    public partial class Query
    {
        public int Id { get; set; }
        public string? Title { get; set; }
        public string? Description { get; set; }
        public int? FypId { get; set; }
        public int? Count { get; set; }
        public string? Status { get; set; }
        public string? Response { get; set; }

        public virtual FypGroup? Fyp { get; set; }
    }
}
