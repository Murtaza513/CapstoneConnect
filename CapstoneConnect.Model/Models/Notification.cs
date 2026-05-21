using System;
using System.Collections.Generic;

namespace CapstoneConnectDatabase.Models
{
    public partial class Notification
    {
        public int Id { get; set; }
        public string Title { get; set; } = null!;
        public string Details { get; set; } = null!;
        public string? Role { get; set; }
        public string? UserId { get; set; }
        public DateTime CreatedAt { get; set; }
        public int NotificationType { get; set; }
        public bool IsRead { get; set; } = false;
    }
}
