namespace CapstoneConnect.ViewModels
{
    public class PasswordChange
    {
        public int? FypId { get; set; }
        public string? SupId { get; set; }
        public string? AdminId { get; set; }

        public string CurrentPassword { get; set; }
        public string NewPassword { get; set; }
        public string ConfirmPassword { get; set; }
    }
}
