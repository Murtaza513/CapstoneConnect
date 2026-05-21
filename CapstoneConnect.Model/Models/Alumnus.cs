using System;
using System.Collections.Generic;

namespace CapstoneConnectDatabase.Models
{
    public partial class Alumnus
    {
        public string Id { get; set; } = null!;
        public string Name { get; set; } = null!;
        public string Department { get; set; } = null!;
        public string Email { get; set; } = null!;
        public int FypId { get; set; }
        public string FinalEvaluationGrade { get; set; } = null!;
    }
}
