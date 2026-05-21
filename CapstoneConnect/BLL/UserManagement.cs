using Abp.MimeTypes;
using CapstoneConnect.ViewModels;
using CapstoneConnectDatabase.Models;
using DocumentFormat.OpenXml.InkML;
using MimeKit;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Reflection;
using AutoMapper;
using CapstoneConnect.Services;
using CapstoneConnect.Helpers;

namespace CapstoneConnect.BLL
{
    public class UserManagement
    {
        private readonly UserManager<IdentityUser> _userManager;
        private readonly CapstoneConnectContext _context;
        private readonly RoleManager<IdentityRole> _roleManager;
        private readonly IMapper _mapper;
        private readonly APIHelper _Helper;
        private readonly NotificationsHelper _notificationsHelper;

        public UserManagement(NotificationsHelper notificationsHelper,UserManager<IdentityUser> userManager, IMapper mapper,
                      SignInManager<IdentityUser> signInManager, APIHelper helper, CapstoneConnectContext context, RoleManager<IdentityRole> roleManager)
        {
            _mapper = mapper;
            _userManager = userManager;
            _context = context;
            _roleManager = roleManager;
            _Helper = helper;
            _notificationsHelper = notificationsHelper;
        }


        public async Task<bool> AddRoleAsync(string roleName)
        {
            try
            {
                var newRole = new IdentityRole(roleName);
                var result = await _roleManager.CreateAsync(newRole);
                return result.Succeeded;
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex);
                throw;
            }

        }

        public async Task<bool> AddIdentityAsync(AddUser account)
        {
            try
            {
                var user = new IdentityUser
                {
                    Id = account.Id,
                    UserName = account.Username.Replace(" ", ""),
                    Email = account.Email,
                    PhoneNumber = account.PhoneNumber
                };

                var verifyEmail = await _userManager.FindByEmailAsync(account.Email);

                if (verifyEmail != null)
                {
                    // Check if the user has the specified role
                    var roles = await _userManager.GetRolesAsync(verifyEmail);
                    if (roles.Contains("FypGroup") || roles.Contains("Supervisor"))
                    {
                        return false;
                    }                   
                }               
                var result = await _userManager.CreateAsync(user, account.Password); // Assuming account.Password exists

                if (result.Succeeded)
                {
                   var roleResult = await _userManager.AddToRoleAsync(user, account.Role);
                   return roleResult.Succeeded;
                }
                
                return false;
            }
            catch(Exception ex)
            {
                Console.WriteLine(ex.ToString());
                throw;
            }
        }

        public async Task<IActionResult> AddUsersAsync(List<AddUser> users)
        {
            try
            {
                foreach (var person in users)
                {
                    bool result = await AddIdentityAsync(person);
                    if (result)
                    {
                        switch (person.Role)
                        {
                            case "Student":
                                var newStudent = new CapstoneConnectDatabase.Models.Student
                                {
                                    Id = person.Id,
                                    Name = person.Username,
                                    Department = person.Department,
                                    Cgpa = (decimal?)person.CGPA,
                                    CompletedCreditHour = person.Completed_Credit_Hour,
                                    Semester = person.Semester,
                                    EnrollmentDate = person.EnrolmentDate
                                };
                                _context.Students.Add(newStudent);
                                break;
                            case "Supervisor":
                                var newSupervisor = new Supervisor
                                {
                                    Id = person.Id,
                                    Username = person.Username,
                                    Department = person.Department,
                                    Fyppreferences = person.FypPreferences,
                                    AvailableSlots = person.AvailableSlots
                                };
                                _context.Supervisors.Add(newSupervisor);
                                break;
                            case "Admin":
                                var newAdmin = new Administrator
                                {
                                    Id = person.Id,
                                    Username = person.Username,
                                    Email = person.Email,
                                    OfficeNo = person.OfficeNo,
                                    Joindate = person.Joindate
                                };
                                _context.Administrators.Add(newAdmin);
                                break;
                            default:
                                return new BadRequestObjectResult(new { message = "Invalid Role: ", person.Role });
                        }
                    }
                    else
                    {
                        return new BadRequestObjectResult(new { message = "User was not added" });
                    }
                }

                await _context.SaveChangesAsync();
                return new OkObjectResult(new { message = "Users added successfully" });
            }
            catch(Exception ex)
            {
                Console.WriteLine(ex.ToString());
                throw;
            }
            
        }


        public async Task<IActionResult> RemoveUserAsync(DeleteUser user)
        {
            try
            {
                var userFetched = await _userManager.FindByEmailAsync(user.Email);
                if (userFetched == null)
                {
                    return new NotFoundObjectResult(new { message = "User not found" });
                }

                var result = await _userManager.DeleteAsync(userFetched);
                if (result.Succeeded)
                {
                    return new OkObjectResult(new { message = "User removed successfully" });
                }

                return new BadRequestObjectResult(new { message = "Failed to remove user" });
            }
            catch(Exception ex)
            {
                Console.WriteLine(ex.ToString());
                throw;
            }
         }

        public async Task<List<GuidelinesView>> FetchGuidelines()
        {
            try
            {
                var query = from g in _context.Guidelines
                            join s in _context.SubmissionTypes
                            on g.SubmissionId equals s.SubmissionId
                            select new GuidelinesView
                            {
                                Id = g.Id,
                                Section = g.Section,
                                Description = g.Description,
                                SubmissionType = s.SubmissionName // Ensure this is the correct property name
                            };

                return await query.ToListAsync();
            }
            catch(Exception ex)
            {
                Console.WriteLine(ex.ToString());
                throw;
            }
        }


        public async Task<(byte[] content, string mimeType, string filePath)> DownloadFileAsync(int guidelineid)
        {
            try
            {
                var guideline = _context.Guidelines
                            .FirstOrDefault(s => s.Id == guidelineid);

                if (guideline == null)
                {
                    throw new Exception("Template not found");
                }

                var filepath = guideline.TemplatePath;              

                return await _Helper.DownloadDocumentAsync(filepath);
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.Message);
                throw;
            }
        }

        public async Task<List<string>> SubmissionTypes(string section)
        {
            try
            {
                var submissionName = _context.SubmissionTypes
                                   .Where(st => st.SubmissionType1 == section)
                                   .Select(st => st.SubmissionName)
                                   .ToList();
                
                return submissionName;
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.ToString());
                throw;
            }
        }


        public async Task<IActionResult> FetchFeedback(int SubId)
        {
            try
            {
                var result = await (from sub in _context.Submissions
                                    join sta in _context.SubmissionStatuses
                                    on sub.Status equals sta.StatusNumber
                                    where sub.Id == SubId
                                    select new SupervisorPayload
                                    {
                                        Feedback = sub.Feedback,
                                        Status = sta.Status
                                    }).FirstOrDefaultAsync();


                return new OkObjectResult(result);
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.ToString());
                throw;
            }
        }


        ////Fortnightly Sheet APIs 
        public async Task<IActionResult> GetFortnightlySheetFypGrp(int FypId)
        {
            try
            {
                var result = await _context.Meetings.Where(f => f.FypId == FypId).Select(f => new { f.Id, f.MeetingNumber, f.Date, f.Agenda, f.ListOfParticipants }).ToListAsync();

                if (result == null)
                    throw new ArgumentNullException(nameof(FypId));

                return new OkObjectResult(result);
            }
            catch (Exception ex)
            {
                return new BadRequestObjectResult(new { message = "An error occurred while fetching fortnightly sheet", error = ex.Message });
            }
        }

        public async Task<IActionResult> Get_MOM(int id)
        {
            try
            {
                var result = await _context.Meetings.Where(f => f.Id == id).FirstOrDefaultAsync();

                if (result == null)
                    throw new ArgumentNullException(nameof(id));

                return new OkObjectResult(result);
            }
            catch (Exception ex)
            {
                return new BadRequestObjectResult(new { Message = "Error occured while fetching MOM details" });
            }
        }
        public async Task<IActionResult> ViewQueryById(int Id)
        {
            try
            {
                var Query = _context.Queries.Where(f => f.Id == Id).ToList();

                if (Query.Any())
                    return new OkObjectResult(Query);

                return null;
            }
            catch (Exception ex)
            {
                return new BadRequestObjectResult(new { message = "An error fetching Query", error = ex.Message });
            }
        }

        public async Task<IActionResult> UpdateQuery(Query Updated_Query)
        {
            try
            {
                var existingquery = await _context.Queries.FirstOrDefaultAsync(m => m.Id == Updated_Query.Id);

                if (existingquery == null)
                {
                    return new NotFoundObjectResult(new { message = "Query not found" });
                }

                foreach (PropertyInfo property in typeof(Query).GetProperties())
                {
                    if (property.Name == "Id" || property.Name == "FypId")
                        continue;

                    var updatedValue = property.GetValue(Updated_Query);

                    if (updatedValue != null)
                    {
                        property.SetValue(existingquery, updatedValue);
                        _context.Entry(existingquery).Property(property.Name).IsModified = true;
                    }
                }

                Notification notification = _notificationsHelper.CreateNotification(
                  "Query Response", $"Admin has responded to your query {existingquery.Title}",
                  existingquery.FypId.ToString() ?? ""
                  , NotificationsHelper.NotificationType.Individual, "FypGroup"
              );

                await _notificationsHelper.SendNotification(notification);

                await _context.SaveChangesAsync();

                return new OkObjectResult(new { message = "Query Updated Successfully" });
            }
            catch (Exception ex)
            {
                return new BadRequestObjectResult(new { message = "An error occurred while updating Query", error = ex.Message });
            }
        }

        public async Task<Dictionary<string, List<Calendar>>> Calendars()
        {
            try
            {
                var calendars = await _context.Calendars.ToListAsync();

                var distinctSections = calendars.Select(entry => entry.Section).Distinct();

                var sectionEntries = new Dictionary<string, List<Calendar>>();

                foreach (var section in distinctSections)
                {
                    sectionEntries[section] = calendars.Where(x => x.Section == section).ToList();
                }

                return sectionEntries;
            }
            catch (Exception e)
            {
                Console.WriteLine(e.Message);
                throw e;
            }

        }
        public async Task<List<SubmissionViewFypGrp>> GetSubmissionsForFypGrp(int fypGrpId)
        {
            try
            {
                var result = await (from s in _context.Submissions
                                    join f in _context.FypGroups on s.FypGrpId equals f.Id
                                    join sup in _context.Supervisors on s.SupervisorId equals sup.Id
                                    join cosup in _context.Supervisors on s.CoSupervisorId equals cosup.Id
                                    join st in _context.SubmissionStatuses on s.Status equals st.StatusNumber
                                    join type in _context.SubmissionTypes on s.Type equals type.SubmissionId
                                    join stu in _context.Students on s.StudentId equals stu.Id
                                    from plag in _context.Plagiarisms
                                        .Where(p => p.SubmissionId == s.Id && s.IsPlagiarised == true)
                                        .DefaultIfEmpty()
                                    where s.FypGrpId == fypGrpId
                                    select new SubmissionViewFypGrp
                                    {
                                        Id = s.Id,
                                        Submission_Type = type.SubmissionName,
                                        Project_Title = f.Title,
                                        Supervisor_Name = sup.Username,
                                        Co_Supervisor_Name = cosup.Username,
                                        date = s.Time,
                                        status = st.Status,
                                        Plagiarism = plag.PlagiarismPercentage ?? 0, // Handle null value
                                        Submitted_By = stu.Name
                                    }).ToListAsync();

                return result;
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.ToString());
                throw;
            }
        }

        public async Task<(byte[] content, string mimeType, string filePath)> DownloadSubmissionFile(int submissionId)
        {
            try
            {
                var submission = _context.Submissions
                            .FirstOrDefault(s => s.Id == submissionId);

                if (submission == null)
                {
                    throw new Exception("Submission not found");
                }


                var content = _Helper.DownloadDocumentAsync(submission.DocumentPath);

                return content.Result;
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.Message);
                throw ex;
            }
        }

        public async Task<List<SupervisorViewModel>> GetAllSupervisors()
        {
            try
            {
                //var supervisors = await _context.Supervisors.ToListAsync();

                List<SupervisorViewModel> supervisorViewModels = await _context.Supervisors
                    .Join(_context.AspNetUsers,
                          s => s.Id,
                          a => a.Id,
                          (s, a) => new SupervisorViewModel
                          {
                              Id = s.Id,
                              Username = s.Username,
                              Email = a.Email,
                              Department = s.Department,
                              FypPreferences = s.Fyppreferences,
                              AvailableSlots = s.AvailableSlots
                          })
                    .ToListAsync();

                return supervisorViewModels;
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.Message);
                throw ex;
            }
        }

        public async Task<SupervisorViewModel> Supervisor(string id)
        {
            try
            {
                Supervisor supervisor = await _context.Supervisors.FindAsync(id);
                if (supervisor == null)
                    return null;

                SupervisorViewModel newSupervisor = _mapper.Map<SupervisorViewModel>(supervisor);

                //newSupervisor.Username = supervisor.Username;
                var user = await _context.AspNetUsers
                    .Where(u => u.Id == supervisor.Id)
                    .Select(u => new
                    {
                        Email = u.Email,
                        PhoneNumber = u.PhoneNumber
                    })
                    .FirstOrDefaultAsync();
                if (user != null)
                {
                    newSupervisor.Email = user.Email;
                    newSupervisor.PhoneNumber = user.PhoneNumber;
                }

                newSupervisor.OnGoingProject = await _context.FypGroups
                .Where(p => p.SupervisorId == supervisor.Id)
                .ToDictionaryAsync(
                    p => p.Id,
                    p => p.Title);

                var cosupervisorProjectsCountTask = await (
                 from cosupervisorProjects in _context.ProjectRepositries
                 where cosupervisorProjects.CosupervisorId == id
                 select cosupervisorProjects).CountAsync();

                var supervisorProjectsCountTask = await (
                    from supervisorProjects in _context.ProjectRepositries
                    where supervisorProjects.SupervisorId == id
                    select supervisorProjects).CountAsync();


                newSupervisor.ProjectsSupervised = cosupervisorProjectsCountTask + supervisorProjectsCountTask;

                return newSupervisor;
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.Message);
                throw ex;
            }
        }


        //NEWW APIS FOR PROJECT REPOSITORY AND ONGOING PROJECTS
        public async Task<List<Projects>> ProjectRepository()
        {
            try
            {
                List<Projects> Projects = await (from p in _context.ProjectRepositries
                                                 join s in _context.Alumni on p.TeamleadId equals s.Id
                                                 join sup in _context.Supervisors on p.SupervisorId equals sup.Id
                                                 join cosup in _context.Supervisors on p.CosupervisorId equals cosup.Id
                                                 select new Projects // Assuming ListProjectRepository is a class you've defined
                                                 {
                                                     Id = p.FypId,
                                                     Title = p.Title,
                                                     teamlead = s.Name,
                                                     Supervisor = sup.Username,
                                                     CoSupervisor = cosup.Username,
                                                     Description = p.ProjectDescription
                                                 }).ToListAsync();
                if (Projects == null)
                    return null;

                return Projects;
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.ToString());
                throw ex;
            }
        }

        public async Task<Projects> ProjectRepositoryById(int id)
        {
            try
            {
                Projects Project = await (from p in _context.ProjectRepositries
                                          join s in _context.Supervisors on p.SupervisorId equals s.Id
                                          join s2 in _context.Supervisors on p.CosupervisorId equals s2.Id
                                          join s3 in _context.Alumni on p.TeamleadId equals s3.Id
                                          where p.FypId == id
                                          select new Projects
                                          {
                                              Id = p.FypId,
                                              Title = p.Title,
                                              Supervisor = s.Username,
                                              CoSupervisor = s2.Username,
                                              Description = p.ProjectDescription ?? string.Empty, // Provide default value
                                              Grade = p.Grade,
                                              Inspiration = p.Inspiration,
                                              teamlead = s3.Name
                                          }).FirstOrDefaultAsync();
                if (Project == null)
                    return null;
                else
                {
                    Project.Members = await (from s in _context.Alumni
                                             where s.FypId == id
                                             select new
                                             {
                                                 s.Name,
                                                 s.FinalEvaluationGrade
                                             })
                                        .ToDictionaryAsync(s => s.Name, s => s.FinalEvaluationGrade);

                    Project.FinalReportId = await _context.SubmissionRepositries.Where(F => F.FypGrpId == id && F.Type == 13).Select(F => F.Id).FirstOrDefaultAsync();
                    //Project.Members.Remove(Project.teamlead);
                 
                    return Project;
                }
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.ToString());
                throw ex;
            }
        }

        public async Task<(byte[] content, string mimeType, string filePath)> DownloadFinalReport(int FinalReportId)
        {
            try
            {
                var FinalReport = _context.SubmissionRepositries
                            .FirstOrDefault(s => s.Id == FinalReportId);

                if (FinalReport == null)
                {
                    throw new Exception("Submission not found");
                }


                var content = _Helper.DownloadDocumentAsync(FinalReport.DocumentPath);

                return content.Result;
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.Message);
                throw ex;
            }
        }


        //PROPOSAL DEFENCE METHODS
        public async Task<ProposalDefence?> FetchProposalDefence(int Fypid)
        {
            try
            {
                var result = await _context.ProposalDefences.Where(s => s.FypId == Fypid).FirstOrDefaultAsync();

                return result;
            }
            catch (Exception e)
            {
                Console.WriteLine(e.ToString());
                throw;
            }
        }

        //MID EVALUATION METHODS
        public async Task<Evaluations?> FetchMidEvaluation(int Fypid)
        {
            try
            {

                var result = await _context.MidEvaluations.Where(s => s.FypId == Fypid).FirstOrDefaultAsync();

                if (result != null)
                {
                    Evaluations Eval = _mapper.Map<Evaluations>(result);
                    Eval.Grades = await _context.Students.Where(s => s.FypId == Fypid)
                        .Select(s => new { s.Id, MidEvaluationGrade = s.MidEvaluationGrade ?? string.Empty })
                        .ToDictionaryAsync(s => s.Id, s => s.MidEvaluationGrade);

                    return Eval;
                }
                else
                    return null;
            }
            catch (Exception e)
            {
                Console.WriteLine(e.ToString());
                throw;
            }
        }

       

    }
}
