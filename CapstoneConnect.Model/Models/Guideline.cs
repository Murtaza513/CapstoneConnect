using System;
using System.Collections.Generic;

namespace CapstoneConnectDatabase.Models
{
    public partial class Guideline
    {
        public int Id { get; set; }
        public string? Section { get; set; }
        public string? Description { get; set; }
        public string? TemplatePath { get; set; }
        public int? SubmissionId { get; set; }

        public virtual SubmissionType? Submission { get; set; }
    }
}
