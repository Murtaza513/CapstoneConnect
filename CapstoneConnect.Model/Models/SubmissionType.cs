using System;
using System.Collections.Generic;

namespace CapstoneConnectDatabase.Models
{
    public partial class SubmissionType
    {
        public SubmissionType()
        {
            Guidelines = new HashSet<Guideline>();
            Submissions = new HashSet<Submission>();
        }

        public int SubmissionId { get; set; }
        public string SubmissionName { get; set; } = null!;
        public string? SubmissionType1 { get; set; }
        public int? Progress { get; set; }

        public virtual ICollection<Guideline> Guidelines { get; set; }
        public virtual ICollection<Submission> Submissions { get; set; }
    }
}
