using System;
using System.Collections.Generic;

namespace CapstoneConnectDatabase.Models
{
    public partial class WorkItem
    {
        public int Id { get; set; }
        public string? Title { get; set; }
        public string? Description { get; set; }
        public string? Feedback { get; set; }
        public int? FypId { get; set; }
        public string? AssignedTo { get; set; }
        public string? Status { get; set; }
        public DateTime? AssignedOn { get; set; }
        public string? CreatedBy { get; set; }
        public DateTime? Deadline { get; set; }

        public virtual FypGroup? Fyp { get; set; }
    }
}
