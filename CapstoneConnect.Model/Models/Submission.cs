using System;
using System.Collections.Generic;

namespace CapstoneConnectDatabase.Models
{
    public partial class Submission
    {
        public Submission()
        {
            Plagiarisms = new HashSet<Plagiarism>();
        }

        public int Id { get; set; }
        public int Type { get; set; }
        public DateTime Time { get; set; }
        public int FypGrpId { get; set; }
        public string? Status { get; set; }
        public string? Feedback { get; set; }
        public double? Grade { get; set; }
        public string DocumentPath { get; set; } = null!;
        public string? SupervisorId { get; set; }
        public string? CoSupervisorId { get; set; }
        public bool? IsPlagiarised { get; set; }
        public string? StudentId { get; set; }

        public virtual FypGroup FypGrp { get; set; } = null!;
        public virtual SubmissionStatus? StatusNavigation { get; set; }
        public virtual Student? Student { get; set; }
        public virtual SubmissionType TypeNavigation { get; set; } = null!;
        public virtual ICollection<Plagiarism> Plagiarisms { get; set; }
    }
}
