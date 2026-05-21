using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace CapstoneConnect.ViewModels
{
    public class AddUser
    {
        public string Role { get; set; }
        public string Id { get; set; }
        public string? Username { get; set; }
        public string Email { get; set; }
        public string Password { get; set; }
        public string? Department { get; set; }
        public float CGPA { get; set; }
        public int Completed_Credit_Hour { get; set; }
        public int Semester { get; set; }
        public string PhoneNumber { get; set; }
        public DateTime EnrolmentDate { get; set; }

        //Supervisors
        public int AvailableSlots { get; set; }
        public string? FypPreferences { get; set; }


        //Admin
        public string? OfficeNo { get; set; } 
        public string? Joindate { get; set; }


    }
}
