using System;
using System.Collections.Generic;

namespace CapstoneConnectDatabase.Models
{
    public partial class SubmissionStatus
    {
        public SubmissionStatus()
        {
            Submissions = new HashSet<Submission>();
        }

        public string Status { get; set; } = null!;
        public string StatusNumber { get; set; } = null!;

        public virtual ICollection<Submission> Submissions { get; set; }
    }
}
