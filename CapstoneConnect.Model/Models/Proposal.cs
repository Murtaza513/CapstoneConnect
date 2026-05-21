using System;
using System.Collections.Generic;

namespace CapstoneConnectDatabase.Models
{
    public partial class Proposal
    {
        public string Id { get; set; } = null!;
        public string Title { get; set; } = null!;
        public string Supervisor { get; set; } = null!;
        public string Teamlead { get; set; } = null!;
        public string TeamleadId { get; set; } = null!;
        public string Member1 { get; set; } = null!;
        public string Member1Id { get; set; } = null!;
        public string Member2 { get; set; } = null!;
        public string Member2Id { get; set; } = null!;
        public string? Member3 { get; set; }
        public string? Member3Id { get; set; }
        public string ProjectDescription { get; set; } = null!;
        public string Tags { get; set; } = null!;
        public string? Response { get; set; }
        public string? Feedback { get; set; }
        public string? Doc { get; set; }
    }
}
