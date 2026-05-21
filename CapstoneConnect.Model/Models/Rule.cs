using System;
using System.Collections.Generic;

namespace CapstoneConnectDatabase.Models
{
    public partial class Rule
    {
        public double MinimumCgpa { get; set; }
        public int MinimumCreditHours { get; set; }
        public int MaxSupervisorSlot { get; set; }
    }
}
