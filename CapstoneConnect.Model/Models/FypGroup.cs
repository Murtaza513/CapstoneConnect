using System;
using System.Collections.Generic;

namespace CapstoneConnectDatabase.Models
{
    public partial class FypGroup
    {
        public FypGroup()
        {
            Meetings = new HashSet<Meeting>();
            Queries = new HashSet<Query>();
            Students = new HashSet<Student>();
            Submissions = new HashSet<Submission>();
            WorkItems = new HashSet<WorkItem>();
        }

        public int Id { get; set; }
        public string Title { get; set; } = null!;
        public string? SupervisorId { get; set; }
        public string? CosupervisorId { get; set; }
        public string? ProjectDescription { get; set; }
        public string? Tags { get; set; }
        public byte Aproved { get; set; }
        public string Status { get; set; } = null!;
        public DateTime? CompletionDate { get; set; }
        public int? NumberofMembers { get; set; }
        public int FypYear { get; set; }
        public string? TeamleadId { get; set; }
        public int? Progress { get; set; }
        public string? MidGrade { get; set; }
        public string? FinalGrade { get; set; }

        public virtual Supervisor? Cosupervisor { get; set; }
        public virtual Supervisor? Supervisor { get; set; }
        public virtual Student? Teamlead { get; set; }
        public virtual ICollection<Meeting> Meetings { get; set; }
        public virtual ICollection<Query> Queries { get; set; }
        public virtual ICollection<Student> Students { get; set; }
        public virtual ICollection<Submission> Submissions { get; set; }
        public virtual ICollection<WorkItem> WorkItems { get; set; }
    }
}
