using System;
using System.Collections.Generic;

namespace CapstoneConnectDatabase.Models
{
    public partial class Administrator
    {
        public string Id { get; set; } = null!;
        public string Username { get; set; } = null!;
        public string OfficeNo { get; set; } = null!;
        public string Email { get; set; } = null!;
        public string Joindate { get; set; } = null!;
    }
}
