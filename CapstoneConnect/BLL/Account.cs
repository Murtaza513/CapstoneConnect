using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;
using System;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using CapstoneConnect.Authentication.JwtManager;
using CapstoneConnect.Helpers;
using CapstoneConnect.ViewModels;
using CapstoneConnectDatabase.Models;
using CapstoneConnect.Services;
using static System.Net.WebRequestMethods;
using AutoMapper.Internal;
using DocumentFormat.OpenXml.InkML;

public class Account
{
    private readonly UserManager<IdentityUser> _userManager;
    private readonly SignInManager<IdentityUser> _signInManager;
    private readonly CapstoneConnectContext _context;
    private readonly NotificationsHelper _notificationsHelper;
    private readonly APIHelper _helper;
    private readonly MailService _mailService;

    public Account(UserManager<IdentityUser> userManager,
                   SignInManager<IdentityUser> signInManager, CapstoneConnectContext context, APIHelper helper,
                   MailService mailService,NotificationsHelper notificationsHelper)
    {
        _userManager = userManager;
        _signInManager = signInManager;
        _context = context;
        _helper = helper;
        _notificationsHelper = notificationsHelper;
        _mailService = mailService;
    }

    public async Task<IActionResult> Login(LoginViewModel model)
    {
        try
        {
            if (model == null) throw new ArgumentNullException(nameof(model));

            var user = await _userManager.FindByIdAsync(model.Id);
            if (user == null)
                return new UnauthorizedResult();

            UserRole role = await GetUserRole(user);
            var result = await _signInManager.PasswordSignInAsync(user.UserName, model.Password, model.RememberMe, lockoutOnFailure: false);

            //UNCOMMENT BELOW CODE BEFORE DEPLOYMENT
            //if (result.Succeeded)
            //{
                JwtHandler handler = new JwtHandler();
                var bearerToken = handler.GenerateJwtToken(user.UserName.ToString(), role, model.Id);

                if (role == UserRole.FypGroup)
                {
                    var status = _context.FypGroups.Where(x => x.Id == int.Parse(model.Id))
                                    .Select(x => x.Status).FirstOrDefault();

                    var supervisor = (from sup in _context.Supervisors
                                      join fyp in _context.FypGroups on sup.Id equals fyp.SupervisorId
                                      where fyp.Id == int.Parse(model.Id)
                                      select sup.Username).FirstOrDefault();

                    var cosupervisor = (from sup in _context.Supervisors
                                        join fyp in _context.FypGroups on sup.Id equals fyp.CosupervisorId
                                        where fyp.Id == int.Parse(model.Id)
                                        select sup.Username).FirstOrDefault();

                    return new OkObjectResult(new { message = "Login successful", role = role.ToString(), userName = user, token = bearerToken, status = status, supervisor = supervisor, cosupervisor = cosupervisor });
                }
                return new OkObjectResult(new { message = "Login successful", role = role.ToString(), userName = user, token = bearerToken });
            //}
            //else
            //{
            //    return new BadRequestObjectResult(new { message = "Incorrect Password" });
            //}
        }
        catch (Exception ex)
        {
            // Log exception here
            return new BadRequestObjectResult(new { message = "An error occurred during login", error = ex.Message });
        }
    }

    public async Task<IActionResult> StudentEmail(GetId model)
    {
        try
        {
            if (model == null) throw new ArgumentNullException(nameof(model));

            Student user = await _context.Students.FirstOrDefaultAsync(u => u.Id == model.Id);

            return new OkObjectResult(new { message = "Email fetched", Email = user?.Email });
        }
        catch (Exception ex)
        {
            // Log exception here
            return new BadRequestObjectResult(new { message = "An error occurred while fetching the email", error = ex.Message });
        }
    }

    public async Task<IActionResult> VerifyTeamLead(TeamLeadVerificationModel model)
    {
        if (model == null) throw new ArgumentNullException(nameof(model));

        _helper.SetValue("Title", model.projectTitle);
        _helper.SetValue("No.Members", model.noOfMembers.ToString());
        _helper.SetValue("TeamleadId", model.teamLeadId);

        
        Student student = await _context.Students.FirstOrDefaultAsync(u => u.Id == model.teamLeadId);

        if (student == null)
        {
            return new NotFoundObjectResult(new { message = "Student not found" });
        }

        var criteriaMet = await AcademicCriteriaVerification(student.Id);
        if (!criteriaMet)
        {
            return new BadRequestObjectResult(new { message = "Teamlead doesn't meet academic criteria" });
        }

        MailRequest mailRequest = new MailRequest
        {
            Id = model.teamLeadId,
            Subject = "Registration OTP",
            Body = "Test Body"
        };
        bool emailSent = await SendEmail(mailRequest);

        if (!emailSent)
        {
            return new BadRequestObjectResult(new { message = "Failed to send verification email" });
        }


        return new OkObjectResult(new { message = "Session Updated", Email = student.Email });
    }

    public async Task<IActionResult> VerifyTeamMember(string memberId)
    {
        if (memberId == null) throw new ArgumentNullException(nameof(memberId));

        Student student = await _context.Students.FirstOrDefaultAsync(u => u.Id == memberId);

        if (student == null)
        {
            return new NotFoundObjectResult(new { message = "Student not found" });
        }

        var criteriaMet = await AcademicCriteriaVerification(student.Id);
        if (!criteriaMet)
        {
            return new BadRequestObjectResult(new { message = "Student with ID: " + memberId + " doesn't meet academic criteria"  });
        }

        MailRequest mailRequest = new MailRequest
        {
            Id = memberId,
            Subject = "Registration OTP",
            Body = "Test Body"
        };
        bool emailSent = await SendEmail(mailRequest);

        if (!emailSent)
        {
            return new BadRequestObjectResult(new { message = "Failed to send verification email" });
        }

        return new OkObjectResult(new { message = "Session Updated", Email = student.Email });
    }

    private async Task<bool> AcademicCriteriaVerification(string id)
    {
        if (string.IsNullOrEmpty(id)) throw new ArgumentNullException(nameof(id));

        var student = await _context.Students.FirstOrDefaultAsync(u => u.Id == id);
        if (student == null)
        {
            throw new ArgumentException("Student not found", nameof(id));
        }

        var criteria = await _context.Rules.FirstOrDefaultAsync<Rule>();
        if (criteria == null)
        {
            throw new InvalidOperationException("Academic criteria not found");
        }

        if (student.FypId != null)
        {
            throw new InvalidOperationException($"Student with Id: {id} is already registered");
        }

        if(!student.Cgpa.HasValue)
        {
            throw new InvalidOperationException($"CGPA for Student with Id: {id} is already not known!");
        }

        return (double)student.Cgpa >= criteria.MinimumCgpa && student.CompletedCreditHour >= criteria.MinimumCreditHours;
    }


    public async Task<IActionResult> Verify_Student(VerificationViewModel model)
    {
        try
        {
            if (model == null) throw new ArgumentNullException(nameof(model));

            var student = await _context.Students.Where(s => s.Id== model.Id).FirstOrDefaultAsync();

            if(student != null)
            {
                if(student.FypId != model.FypId)
                    return new BadRequestObjectResult(new { message = "Student does not belong to this FYP Group"});
            }

            var user = await _userManager.FindByIdAsync(model.Id);
            if (user == null)
                return new UnauthorizedResult();

            UserRole role = UserRole.Student;
            var result = await _signInManager.PasswordSignInAsync(user.UserName, model.Password, model.RememberMe, lockoutOnFailure: false);
            //UNCOMMENT BELOW CODE BEFORE DEPLOYMENT
            //if(result.Succeeded)
            //{
                JwtHandler handler = new JwtHandler();
                var bearerToken = handler.GenerateJwtToken(user.UserName.ToString(), role, model.Id);
                return new OkObjectResult(new { message = "Verification successful", role = role.ToString(), userName = user, token = bearerToken });
            //}
            //else
            //{
            //    return new BadRequestObjectResult(new { message = "Incorrect Password" });
            //}
        }
        catch (Exception ex)
        {
            // Log exception here
            return new BadRequestObjectResult(new { message = "An error occurred during verification", error = ex.Message });
        }
    }
    public bool Student_Exists(string id)
    {
        try
        {
            var result = _context.Students
                   .Where(s => s.Id == id)
                   .Select(s => s.FypId)
                   .FirstOrDefault();

            return result != null;
        }
        catch (Exception ex)
        {
            // Log exception here
            throw new Exception("An error occurred while checking if the student exists", ex);
        }
    }

    private async Task<bool> SendEmail(MailRequest request)
    {
        try
        {
            if (request == null) throw new ArgumentNullException(nameof(request));

            Student student = await _context.Students.FirstOrDefaultAsync(u => u.Id == request.Id);

            if (student == null)
            {
                return false;
            }

            bool result = await _mailService.SendEmailAsync(request, student.Email, "OTP Verification");
            return result;
        }
        catch (Exception ex)
        {
            // Log exception here
            return false;
        }
    }


    public async Task<IActionResult> VerifyOtp(MailVerify request)
    {
        try
        {
            if (request == null) throw new ArgumentNullException(nameof(request));

            Student student = await _context.Students.FirstOrDefaultAsync(u => u.Id == request.Id);

            if (student == null)
            {
                return new NotFoundObjectResult(new { message = "Student not found" });
            }

            bool result = await _mailService.VerifyEmailAsync(request, student.Email);

            if (result)
                return new OkObjectResult(new { message = "Email Verified" });       

           return new BadRequestObjectResult(new { message = "Email not Verified" });
        }
        catch (Exception ex)
        {
            // Log exception here
            return new BadRequestObjectResult(new { message = "An error occurred while verifying the email", error = ex.Message });
        }
    }

    public async Task<IActionResult> RegisterFYP(FypRegistration fyp)
    {
        if (fyp == null)
        {
            return new BadRequestObjectResult(new { message = "Invalid FYP registration data" });
        }

        using (var transaction = await _context.Database.BeginTransactionAsync())
        {
            try
            {
                var teamLead = await _context.Students.FindAsync(fyp.teamLeadId);
                if (teamLead == null)
                {
                    throw new InvalidOperationException("Team lead not found");
                }

                var newFYP = new FypGroup
                {
                    Title = fyp.fypTitle,
                    TeamleadId = fyp.teamLeadId,
                    NumberofMembers = fyp.students.Count + 1, //Adding 1 to Students for Teamlead
                    
                };

                _context.FypGroups.Add(newFYP);
                await _context.SaveChangesAsync();               

                teamLead.FypId = newFYP.Id;

                foreach (var studentId in fyp.students)
                {
                    var student = await _context.Students.FindAsync(studentId);
                    if (student == null)
                    {
                        throw new InvalidOperationException($"Student with ID {studentId} not found");
                    }
                    student.FypId = newFYP.Id;
                }

                await _context.SaveChangesAsync();
                await transaction.CommitAsync();

                return new OkObjectResult(new { message = "Group Registered!", ProjectId = newFYP.Id });
            }
            catch (Exception ex)
            {
                await transaction.RollbackAsync();
                return new BadRequestObjectResult(new { message = "An error occurred while registering the FYP group", error = ex.Message });
            }
        }
    }

    private async Task<UserRole> GetUserRole(IdentityUser user)
    {
        try
        {
            if (await _userManager.IsInRoleAsync(user, UserRole.Student.ToString()))
                return UserRole.Student;
            else if (await _userManager.IsInRoleAsync(user, UserRole.Admin.ToString()))
                return UserRole.Admin;
            else if (await _userManager.IsInRoleAsync(user, UserRole.Supervisor.ToString()))
                return UserRole.Supervisor;
            else if (await _userManager.IsInRoleAsync(user, UserRole.FypGroup.ToString()))
                return UserRole.FypGroup;

            return UserRole.Student;
        }
        catch (Exception ex)
        {
            // Log exception here
            throw new Exception("An error occurred while getting the user role", ex);
        }
    }


    public async Task<IActionResult> ChangePassword(PasswordChange payload)
    {
        try
        {
            if (payload == null)
            {
                throw new ArgumentNullException(nameof(payload));
            }

            IdentityUser user = null;

            if (!string.IsNullOrEmpty(payload.SupId.ToString()))
                user = await _userManager.FindByIdAsync(payload.SupId.ToString());

            if (user == null)
                return new BadRequestObjectResult(new { message = "User not found." });

            var result = await _userManager.ChangePasswordAsync(user, payload.CurrentPassword, payload.NewPassword);
            if (result.Succeeded)
            {
                await _signInManager.RefreshSignInAsync(user);
                var notification = new Notification
                {
                    Title = "Password Change",
                    Details = "Password Updated Successfully!",
                    UserId = user.Id,
                    NotificationType = (int)NotificationsHelper.NotificationType.Individual,
                    Role = "",
                    IsRead = false
                };
                await _notificationsHelper.SendNotification(notification);
                return new OkObjectResult(new { message = "Password changed successfully!" });
            }

            // Collect error messages from the result
            var errors = string.Join("; ", result.Errors.Select(e => e.Description));
            return new BadRequestObjectResult(new { message = "An error occurred while changing password", errors });
        }
        catch (Exception ex)
        {
            return new BadRequestObjectResult(new { message = "An error occurred while changing password", error = ex.Message });
        }
    }
}
