using System;
using System.Collections.Generic;

namespace CapstoneConnectDatabase.Models
{
    public partial class ProjectRepositry
    {
        public ProjectRepositry()
        {
            Plagiarisms = new HashSet<Plagiarism>();
            SubmissionRepositries = new HashSet<SubmissionRepositry>();
        }

        public int FypId { get; set; }
        public string Title { get; set; } = null!;
        public string? SupervisorId { get; set; }
        public string? CosupervisorId { get; set; }
        public string? ProjectDescription { get; set; }
        public string? Inspiration { get; set; }
        public string? Tags { get; set; }
        public int? NumberofMembers { get; set; }
        public int? FypYear { get; set; }
        public string? TeamleadId { get; set; }
        public string? Grade { get; set; }
        public string? SupervisorRank { get; set; }
        public string? CoSupervisorRank { get; set; }

        public virtual Supervisor? Cosupervisor { get; set; }
        public virtual Supervisor? Supervisor { get; set; }
        public virtual ICollection<Plagiarism> Plagiarisms { get; set; }
        public virtual ICollection<SubmissionRepositry> SubmissionRepositries { get; set; }
    }
}
