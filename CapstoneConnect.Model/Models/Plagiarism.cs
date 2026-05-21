using System;
using System.Collections.Generic;

namespace CapstoneConnectDatabase.Models
{
    public partial class Plagiarism
    {
        public int Id { get; set; }
        public int? SubmissionId { get; set; }
        public int? MatchedFypId { get; set; }
        public decimal? PlagiarismPercentage { get; set; }

        public virtual ProjectRepositry? MatchedFyp { get; set; }
        public virtual Submission? Submission { get; set; }
    }
}
