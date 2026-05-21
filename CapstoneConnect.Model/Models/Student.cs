using System;
using System.Collections.Generic;

namespace CapstoneConnectDatabase.Models
{
    public partial class Student
    {
        public Student()
        {
            FypGroups = new HashSet<FypGroup>();
            Submissions = new HashSet<Submission>();
        }

        public string Id { get; set; } = null!;
        public string Name { get; set; } = null!;
        public string Department { get; set; } = null!;
        public decimal? Cgpa { get; set; }
        public int CompletedCreditHour { get; set; }
        public int Semester { get; set; }
        public DateTime EnrollmentDate { get; set; }
        public string? Email { get; set; }
        public int? FypId { get; set; }
        public string? MidEvaluationGrade { get; set; }
        public string? FinalEvaluationGrade { get; set; }

        public virtual FypGroup? Fyp { get; set; }
        public virtual ICollection<FypGroup> FypGroups { get; set; }
        public virtual ICollection<Submission> Submissions { get; set; }
    }
}
