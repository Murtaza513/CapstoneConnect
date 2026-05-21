using System;
using System.Collections.Generic;

namespace CapstoneConnectDatabase.Models
{
    public partial class Calendar
    {
        public int Id { get; set; }
        public string Title { get; set; } = null!;
        public string? Description { get; set; }
        public string? Section { get; set; }
        public DateTime? Deadline { get; set; }
    }
}
