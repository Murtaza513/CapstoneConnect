using System;
using System.Collections.Generic;

namespace CapstoneConnectDatabase.Models
{
    public partial class Meeting
    {
        public int Id { get; set; }
        public DateTime? Date { get; set; }
        public string? Location { get; set; }
        public string? ListOfParticipants { get; set; }
        public int? FypId { get; set; }
        public string? Agenda { get; set; }
        public string? Description { get; set; }
        public string? Feedback { get; set; }
        public int? MeetingNumber { get; set; }

        public virtual FypGroup? Fyp { get; set; }
    }
}
