using System;
using System.Collections.Generic;

namespace CapstoneConnectDatabase.Models
{
    public partial class SubmissionRepositry
    {
        public int Id { get; set; }
        public int? Type { get; set; }
        public int? FypGrpId { get; set; }
        public string? DocumentPath { get; set; }

        public virtual ProjectRepositry? FypGrp { get; set; }
    }
}
