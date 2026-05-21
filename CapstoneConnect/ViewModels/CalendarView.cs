using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace CapstoneConnect.ViewModels
{
    public class CalendarView
    {
        public int Id { get; set; }
        public string? Title { get; set; } = null!;
        public string? Description { get; set; } = null!;
        public string? Section { get; set; } = null!;

        public DateTime? Deadline { get; set;} = null!;
    }
}
