using System;
using System.Collections.Generic;

namespace CapstoneConnectDatabase.Models
{
    public partial class Supervisor
    {
        public Supervisor()
        {
            FypGroupCosupervisors = new HashSet<FypGroup>();
            FypGroupSupervisors = new HashSet<FypGroup>();
            ProjectRepositryCosupervisors = new HashSet<ProjectRepositry>();
            ProjectRepositrySupervisors = new HashSet<ProjectRepositry>();
        }

        public string Id { get; set; } = null!;
        public string Username { get; set; } = null!;
        public int AvailableSlots { get; set; }
        public string? Fyppreferences { get; set; }
        public string Department { get; set; } = null!;
        public string? AvgGrade { get; set; }
        public string? AvgRank { get; set; }
        public string? AdminRank { get; set; }

        public virtual ICollection<FypGroup> FypGroupCosupervisors { get; set; }
        public virtual ICollection<FypGroup> FypGroupSupervisors { get; set; }
        public virtual ICollection<ProjectRepositry> ProjectRepositryCosupervisors { get; set; }
        public virtual ICollection<ProjectRepositry> ProjectRepositrySupervisors { get; set; }
    }
}
