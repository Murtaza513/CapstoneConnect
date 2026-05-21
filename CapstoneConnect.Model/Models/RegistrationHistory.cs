using System;
using System.Collections.Generic;

namespace CapstoneConnectDatabase.Models
{
    public partial class RegistrationHistory
    {
        public int FypId { get; set; }
        public string? Title { get; set; }
        public string? TeamleadId { get; set; }
        public string? Note { get; set; }
    }
}
