using System.Linq;
using System.Data;
using System.Reflection;
using AutoMapper;
using CapstoneConnect.Controllers;
using CapstoneConnect.Helpers;
using CapstoneConnect.Services;
using CapstoneConnect.ViewModels;
using CapstoneConnectDatabase.Models;
using DocumentFormat.OpenXml.Drawing.Charts;
using DocumentFormat.OpenXml.InkML;
using DocumentFormat.OpenXml.Office2016.Drawing.ChartDrawing;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Newtonsoft.Json;
using static Microsoft.EntityFrameworkCore.DbLoggerCategory;
using static System.Net.WebRequestMethods;
using DataTable = System.Data.DataTable;
using File = System.IO.File;

namespace CapstoneConnect.BLL
{
    public class Admin
    {
        private readonly CapstoneConnectContext _context;
        private readonly IMapper _mapper;
        private readonly MailService _mail;
        private readonly APIHelper Helper;
        private readonly UserManagement _user;
        private readonly NotificationsHelper _notificationsHelper;
        public Admin(CapstoneConnectContext context, IMapper mapper, MailService mail, APIHelper helper, UserManagement User
            , NotificationsHelper notificationsHelper)
        {
            _mapper = mapper;
            _context = context;
            _mail = mail;
            Helper = helper;
            _user = User;
            _notificationsHelper = notificationsHelper;
        }

        public async Task<List<FypDetails>> FetchProjects()
        {
            try
            {
                var unapprovedFypGroups = await _context.FypGroups
                    .Where(f => f.Aproved == 0).ToListAsync();

                var fypDetails = await MapFypDetails(unapprovedFypGroups);

                // Check if any unapproved FypGroups were found
                if (unapprovedFypGroups != null && unapprovedFypGroups.Any())
                {
                    return fypDetails;
                }
                else
                {
                    return null;
                }
            }
            catch (Exception ex)
            {
                // Log the exception or handle it appropriately
                Console.WriteLine(ex.ToString());
                throw ex;
            }
        }

        public async Task<List<FypDetails>> MapFypDetails(List<FypGroup> fypGroups)
        {
            List<FypDetails> FypDetails = new List<FypDetails>();

            try
            {
                foreach (var group in fypGroups)
                {
                    var studentsInGroup = await _context.Students
                    .Where(student => student.FypId == group.Id && student.Id != group.TeamleadId)
                    .ToListAsync();


                    if (studentsInGroup.Count > 0)
                    {
                        FypDetails detail = new FypDetails()
                        {
                            FypId = group.Id,
                            TeamLead_Id = group.TeamleadId,
                            Member1_Id = studentsInGroup.Count > 0 ? studentsInGroup[0].Id : null,
                            Member2_Id = studentsInGroup.Count > 1 ? studentsInGroup[1].Id : null,
                            Member3_Id = studentsInGroup.Count > 2 ? studentsInGroup[2].Id : null,
                            Title = group.Title,
                        };
                        FypDetails.Add(detail);

                    }
                }
            }
            catch (Exception e)
            {
                // Log the exception or handle it appropriately
                Console.WriteLine($"An error occurred while mapping FypDetails: {e.Message}");
            }
            return FypDetails;

        }
        public async Task<bool> AcceptProposal(int projectId)
        {
            try
            {
                var fypGroup = await _context.FypGroups.FirstOrDefaultAsync(x => x.Id == projectId);
                if (fypGroup != null)
                {
                    fypGroup.Aproved = 1;

                    bool output = await Storegroup_Identity(fypGroup);
                    if (!output)
                        return false;

                    await _context.SaveChangesAsync();

                    Notification notification = _notificationsHelper.CreateNotification(
                        "Proposal", $"your registration has been accepted!",
                        fypGroup.Id.ToString(), NotificationsHelper.NotificationType.Individual, "FypGroup"
                    );

                    await _notificationsHelper.SendNotification(notification);
                    return true;
                }
                else

                    return false;
            }
            catch (Exception e)
            {
                Console.WriteLine(e.Message);
                throw e;
            }
        }

        public async Task<bool> Storegroup_Identity(FypGroup group)
        {
            try
            {
                var teamLeadEmail = _context.Students
                                            .Where(s => s.Id == group.TeamleadId)
                                            .Select(s => s.Email)
                                            .FirstOrDefault();


                MailRequest Request = new MailRequest();
                Request.Subject = "FYP Portal Credentials";
                Request.Id = group.Id.ToString();
                bool result_email = await _mail.SendEmailAsync(Request, teamLeadEmail.ToString(), "Share Credentials");

                var GeneratedPassword = Helper.GetValue(teamLeadEmail.ToString());

                AddUser fypgroup = new AddUser
                {
                    Role = "FypGroup",
                    Id = group.Id.ToString(),
                    Username = group.Title,
                    Email = teamLeadEmail.ToString(),
                    Password = GeneratedPassword
                };

                bool result_identity = await _user.AddIdentityAsync(fypgroup);

                if (result_email && result_identity)
                    return true;

                return false;
            }
            catch (Exception e)
            {
                Console.WriteLine(e.Message);
                throw e;
            }
        }


        public async Task<bool> RejectProposal(FypRegistration RejectFyp)
        {
            try
            {
                var fypGroup = await _context.FypGroups.FirstOrDefaultAsync
                    (x => x.Id == RejectFyp.FypId);

                if (fypGroup != null)
                {
                    var studentsToUpdate = await _context.Students.Where(s => s.FypId == fypGroup.Id).ToListAsync();
                    foreach (var student in studentsToUpdate)
                    {
                        student.FypId = null;
                    }

                    RegistrationHistory value = new RegistrationHistory
                    {
                        FypId = fypGroup.Id,
                        Title = fypGroup.Title,
                        TeamleadId = fypGroup.TeamleadId,
                        Note = RejectFyp.RejectionNote
                    };

                    _context.FypGroups.Remove(fypGroup);
                    _context.RegistrationHistories.Add(value);
                    await _context.SaveChangesAsync();
                    return true;
                }
                else
                {
                    return false;
                }
            }
            catch (Exception e)
            {
                Console.WriteLine(e.Message);
                throw e;
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

        public async Task<ActionResult<Calendar>> Calendar_By_Id(int calendar)
        {
            try
            {
                var calendarr = await _context.Calendars.FindAsync(calendar);

                if (calendar == null)
                    return null;

                return calendarr;
            }
            catch (Exception e)
            {
                Console.WriteLine(e.Message);
                throw e;
            }

        }

        public async Task<List<Calendar>> Calendar_By_Section(string calendar)
        {
            try
            {
                var deadlines = await _context.Calendars
               .Where(c => c.Section.Contains(calendar))
               .ToListAsync();

                if (deadlines == null)
                {
                    return null;
                }

                return deadlines;
            }
            catch (Exception e)
            {
                Console.WriteLine(e.Message);
                throw e;
            }

        }

        public async Task<bool> AddCalendar(Calendar calendar)
        {
            try
            {
                _context.Calendars.Add(calendar);
                await _context.SaveChangesAsync();

                

                List<Notification> notifications = new List<Notification>
                {
                    _notificationsHelper.CreateNotification(
                        "Calendar", $"New annoucement was just posted!",
                        "", NotificationsHelper.NotificationType.FypGroup, "FypGroup"
                    )
                    ,
                    _notificationsHelper.CreateNotification(
                       "Calendar", $"New annoucement was just posted!",
                       "", NotificationsHelper.NotificationType.Supervisor, "Supervisor"
                   )
                };

                await _notificationsHelper.SendNotifications(notifications);

                return true;
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.ToString());
                throw ex;
            }

        }

        public async Task<bool> UpdateCalendar(Calendar UpdatedCalendar)
        {
            try
            {
                var existingCalendar = await _context.Calendars.FindAsync(UpdatedCalendar.Id);
                if (existingCalendar == null)
                    return false;

                foreach (PropertyInfo property in typeof(Calendar).GetProperties())
                {
                    if (property.Name == "Id" || property.Name == "FypId")
                        continue;

                    var updatedValue = property.GetValue(UpdatedCalendar);

                    if (updatedValue != null)
                    {
                        property.SetValue(existingCalendar, updatedValue);
                        _context.Entry(existingCalendar).Property(property.Name).IsModified = true;
                    }
                }

                await _context.SaveChangesAsync();

                List<Notification> notifications = new List<Notification>
                {
                    _notificationsHelper.CreateNotification(
                        "Calendar", $"Announcement {UpdatedCalendar.Title} was updated!",
                        "", NotificationsHelper.NotificationType.FypGroup, "FypGroup"
                    )
                    ,
                    _notificationsHelper.CreateNotification(
                       "Calendar", $"Announcement {UpdatedCalendar.Title} was updated!",
                       "", NotificationsHelper.NotificationType.Supervisor, "Supervisor"
                   )
                };

                await _notificationsHelper.SendNotifications(notifications);
                return true;
            }
            catch (DbUpdateConcurrencyException ex)
            {
                Console.WriteLine(ex.ToString());
                throw ex;
            }
        }

        public async Task<bool> DeleteCalendar(int id)
        {
            try
            {
                var calendar = await _context.Calendars.FindAsync(id);
                if (calendar == null)
                    return false;

                _context.Calendars.Remove(calendar);
                await _context.SaveChangesAsync();

                return true;

            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.ToString());
                throw ex;
            }

        }

        public async Task<bool> AddSupervisor(SupervisorViewModel newSupervisor)
        {
            try
            {
                MailRequest Request = new MailRequest();
                Request.Subject = "FYP Portal Credentials For Supervisor";
                Request.Id = newSupervisor.Id.ToString();
                bool result_email = await _mail.SendEmailAsync(Request, newSupervisor.Email.ToString(), "Share Credentials");

                var GeneratedPassword = Helper.GetValue(newSupervisor.Email.ToString());               

                AddUser IdentitySupervisor = _mapper.Map<AddUser>(newSupervisor);
                IdentitySupervisor.Role = "Supervisor";
                IdentitySupervisor.Password = GeneratedPassword;

                bool result_identity = await _user.AddIdentityAsync(IdentitySupervisor);

                if (result_identity)
                {
                    Supervisor Sup = _mapper.Map<Supervisor>(newSupervisor);
                    _context.Supervisors.Add(Sup);
                    await _context.SaveChangesAsync();
                    return true;
                }              
                return false;
            }
            catch (Exception e)
            {
                Console.WriteLine(e.Message);
                throw e;
            }

        }

       

        public async Task<bool> UpdateSupervisor(SupervisorViewModel updatedSupervisor)
        {
            try
            {
                string columnName;

                var nonNullProperties = updatedSupervisor.GetType().GetProperties()
               .Where(p => p.GetValue(updatedSupervisor) != null)
               .ToDictionary(p => p.Name, p => p.GetValue(updatedSupervisor));

                var existingSupervisor = await _context.Supervisors.FindAsync(updatedSupervisor.Id);
                var identitySupervisor = await _context.AspNetUsers.FindAsync(updatedSupervisor.Id);
                if (existingSupervisor == null)
                    return false;

                foreach (var pair in nonNullProperties)
                {
                    if (pair.Key == "Id" || pair.Key == "ProjectsSupervised")
                        continue;
                    else if (pair.Key == "Email" || pair.Key == "PhoneNumber")
                    {
                        columnName = pair.Key;
                        var newValue = pair.Value;
                        _context.Entry(identitySupervisor).Property(columnName).CurrentValue = newValue;
                    }
                    else
                    {
                        columnName = pair.Key;
                        var newValue = pair.Value;
                        _context.Entry(existingSupervisor).Property(columnName).CurrentValue = newValue;
                    }
                }

                // Exclude AvgGrade and AvgRank from being updated
                updatedSupervisor.AvgGrade = existingSupervisor.AvgGrade;
                updatedSupervisor.AvgRank = existingSupervisor.AvgRank;

                await _context.SaveChangesAsync();


                Notification notification = _notificationsHelper.CreateNotification(
                                    "Profile details", $"Your profile details were updated!",
                                    updatedSupervisor.Id
                                    , NotificationsHelper.NotificationType.Individual, "Supervisor"
                                );

                await _notificationsHelper.SendNotification(notification);
                return true;
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.ToString());
                throw ex;
            }

        }

        public async Task<bool> DeleteSupervisor(string id)
        {
            try
            {

                var supervisor = await _context.Supervisors.FindAsync(id);
                if (supervisor == null)
                    return false;

                _context.Supervisors.Remove(supervisor);
                await _context.SaveChangesAsync();

                return true;
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.ToString());
                throw ex;
            }
        }

        public async Task<List<FypGroup>> CurrentProjects()
        {
            try
            {
                List<FypGroup> projects = await _context.FypGroups.ToListAsync();

                if (projects == null)
                    return null;

                return projects;
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.ToString());
                throw ex;
            }

        }

        public async Task<FypGroup> CurrentProjectsWithId(int id)
        {
            try
            {
                FypGroup project = await _context.FypGroups.FirstOrDefaultAsync(e => e.Id == id);

                if (project == null)
                    return null;

                return project;
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.ToString());
                throw ex;
            }
        }

        

        public async Task<List<Projects>> OngoingProject()
        {
            try
            {
                List<Projects> Projects = await (from p in _context.FypGroups
                                                 join sup in _context.Supervisors on p.SupervisorId equals sup.Id
                                                 join cosup in _context.Supervisors on p.CosupervisorId equals cosup.Id
                                                 select new Projects
                                                 {
                                                     Id = p.Id,
                                                     Title = p.Title,
                                                     Supervisor = sup.Username,
                                                     CoSupervisor = cosup.Username,
                                                     Status = p.Status,
                                                     Progress = p.Progress
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


        public async Task<Projects> OngoingProjectById(int id)
        {
            try
            {
                Projects project = await (from p in _context.FypGroups
                                          join s in _context.Students on p.TeamleadId equals s.Id
                                          join sup in _context.Supervisors on p.SupervisorId equals sup.Id
                                          join cosup in _context.Supervisors on p.CosupervisorId equals cosup.Id
                                          where p.Id == id
                                          select new Projects
                                          {
                                              Id = p.Id,
                                              Title = p.Title,
                                              Description = p.ProjectDescription,
                                              teamlead = s.Name,
                                              Supervisor = sup.Username,
                                              CoSupervisor = cosup.Username,
                                              Tags = p.Tags
                                          }).FirstOrDefaultAsync();

                if (project == null)
                    return null;

                project.Members = await (from s in _context.Students
                                         where s.FypId == id
                                         select new
                                         {
                                             s.Id,
                                             s.Name
                                         })
                                       .ToDictionaryAsync(s => s.Id, s => s.Name);

                //project.Members.Remove(project.teamlead);

                return project;
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.ToString());
                throw ex;
            }
        }



        //GUIDELINES METHODS
        public async Task<IActionResult> AddGuidelines(GuidelinesView newGuid)
        {
            try
            {
                int submissionId;
                if (newGuid.SubmissionType == "Other")
                {
                    SubmissionType newType = new SubmissionType
                    {
                        SubmissionName = newGuid.Title,
                        SubmissionType1 = newGuid.Section
                    };
                    _context.SubmissionTypes.Add(newType);
                    await _context.SaveChangesAsync();
                    submissionId = (await getSubmissionId(newGuid.Title));
                }
                else
                {
                    submissionId = (await getSubmissionId(newGuid.SubmissionType));
                }
                //_context.SubmissionTypes.Where(st => st.SubmissionType1 == newGuid.SubmissionType).Select(st => st.SubmissionId).FirstOrDefault();

                string path = Helper.GuidelineUpload(newGuid.Section, newGuid.Files);

                Guideline New_Guideline = new Guideline
                {
                    Section = newGuid.Section,
                    Description = newGuid.Description,
                    TemplatePath = path,
                    SubmissionId = submissionId
                };

                _context.Guidelines.Add(New_Guideline);
                await _context.SaveChangesAsync();

                return new OkObjectResult(new { message = "Guideline Added successfully" });
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.ToString());
                throw;
            }
        }


        public async Task<bool> DeleteGuideline(int id)
        {
            try
            {
                var guideline = await _context.Guidelines.FindAsync(id);
                if (guideline == null)
                    return false;

                DeleteDocument(guideline.TemplatePath);
                _context.Guidelines.Remove(guideline);
                await _context.SaveChangesAsync();

                return true;
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.ToString());
                throw;
            }
        }

        public async Task<bool> UpdateGuideline(GuidelinesView UpdatedGuid)
        {
            try
            {
                if (UpdatedGuid.Id == null)
                {
                    //throw new ArgumentException("Guidelines Id cannot be null");
                    return false;
                }

                var guideline = await _context.Guidelines.FindAsync(UpdatedGuid.Id.Value);

                if (guideline == null)
                {
                    //throw new InvalidOperationException("Guideline not found");
                    return false;
                }

                if (!string.IsNullOrEmpty(UpdatedGuid.Section))
                {
                    guideline.Section = UpdatedGuid.Section;
                }

                if (!string.IsNullOrEmpty(UpdatedGuid.Description))
                {
                    guideline.Description = UpdatedGuid.Description;
                }

                if (!string.IsNullOrEmpty(UpdatedGuid.SubmissionType))
                {
                    guideline.SubmissionId = await getSubmissionId(UpdatedGuid.SubmissionType);
                }

                if (UpdatedGuid.Files != null)
                {
                    //guideline.TemplatePath = DocumentUpload(guideline.Section, UpdatedGuid.SubmissionType, UpdatedGuid.Files);
                    guideline.TemplatePath = Helper.GuidelineUpload(guideline.Section, UpdatedGuid.Files);
                }

                _context.Guidelines.Update(guideline);
                await _context.SaveChangesAsync();
                return true;
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.ToString());
                return false;
            }
        }


        public async Task<int> getSubmissionId(string name)
        {
            var submissionId = await _context.SubmissionTypes
                                 .Where(st => st.SubmissionName == name)
                                 .Select(st => st.SubmissionId)
                                 .FirstOrDefaultAsync();

            return submissionId;
        }



        public string DeleteDocument(string path)
        {
            try
            {
                if (File.Exists(path))
                {
                    File.Delete(path);
                    return "File deleted successfully.";
                }
                else
                {
                    return "File not found.";
                }
            }
            catch (Exception e)
            {
                Console.WriteLine(e.ToString());
                return "An error occurred while deleting the file.";
            }
        }



       

        public async Task<IActionResult> AddOrUpdateProposalDefence(ProposalDefence Payload)
        {
            try
            {
                var groupFyp = await _context.FypGroups.FirstOrDefaultAsync(s => s.Id == Payload.FypId);
                if (groupFyp == null)
                {
                    return new NotFoundObjectResult(new { message = "FypGroup not found" });
                }

                if (Payload.Reponse == "Strong Approve" || Payload.Reponse == "Weak Approve")
                    groupFyp.Status = "Fyp1";
                else if (Payload.Reponse == "Reevaluate")
                    groupFyp.Status = "Reevaluate";
                else if (Payload.Reponse == "Reject")
                    groupFyp.Status = "Rejected";

                var existingProposalDefence = await _context.ProposalDefences.FirstOrDefaultAsync(s => s.FypId == Payload.FypId);

                if (existingProposalDefence != null)
                {
                    // Update existing ProposalDefence
                    existingProposalDefence.Date = Payload.Date;
                    existingProposalDefence.InternalJury = Payload.InternalJury;
                    existingProposalDefence.Remarks = Payload.Remarks;
                    existingProposalDefence.Reponse = Payload.Reponse;
                    existingProposalDefence.ExternalJury = Payload.ExternalJury;

                    _context.ProposalDefences.Update(existingProposalDefence);
                }
                else
                {
                    // Add new MidEvaluation
                    ProposalDefence defence = new ProposalDefence
                    {
                        Date = Payload.Date,
                        InternalJury = Payload.InternalJury,
                        Remarks = Payload.Remarks,
                        Reponse = Payload.Reponse,
                        FypId = Payload.FypId,
                        ExternalJury = Payload.ExternalJury
                    };
                    _context.ProposalDefences.Add(defence);
                }

                await _context.SaveChangesAsync();
                Notification notification = _notificationsHelper.CreateNotification(
                                    "Proposal Defence", $"Proposal Defence Updated/Added",
                                    Payload.FypId.ToString()
                                    , NotificationsHelper.NotificationType.Individual, "FypGroup"
                                );

                await _notificationsHelper.SendNotification(notification);
                return new OkObjectResult(new { message = "Proposal Defence processed successfully" });
            }
            catch (Exception e)
            {
                Console.WriteLine(e.ToString());
                return new ObjectResult(new { message = "An error occurred while processing the request" }) { StatusCode = 500 };
            }
        }


      

        public async Task<IActionResult> AddOrUpdateMidEvaluation(Evaluations Payload)
        {
            try
            {
                var groupFyp = await _context.FypGroups.FirstOrDefaultAsync(s => s.Id == Payload.FypId);
                if (groupFyp == null)
                {
                    return new NotFoundObjectResult(new { message = "FypGroup not found" });
                }

                foreach (var Grade in Payload.Grades)
                {
                    var Student = _context.Students.Where(s => s.Id == Grade.Key).FirstOrDefault();
                    if (Student == null)
                    {
                        return new NotFoundObjectResult(new { message = "Student not found" });
                    }
                    Student.MidEvaluationGrade = Grade.Value;
                }
                groupFyp.Status = "Fyp2";

                var existingMidEvaluation = await _context.MidEvaluations
                                                          .FirstOrDefaultAsync(s => s.FypId == Payload.FypId);

                if (existingMidEvaluation != null)
                {
                    // Update existing MidEvaluation
                    existingMidEvaluation.Date = Payload.Date;
                    existingMidEvaluation.InternalJury = Payload.InternalJury;
                    existingMidEvaluation.Remarks = Payload.Remarks;
                    existingMidEvaluation.ExternalJury = Payload.ExternalJury;

                    _context.MidEvaluations.Update(existingMidEvaluation);
                }
                else
                {
                    // Add new MidEvaluation
                    MidEvaluation midEvaluation = new MidEvaluation
                    {
                        Date = Payload.Date,
                        InternalJury = Payload.InternalJury,
                        Remarks = Payload.Remarks,
                        FypId = Payload.FypId,
                        ExternalJury = Payload.ExternalJury
                    };
                    _context.MidEvaluations.Add(midEvaluation);
                }

                await _context.SaveChangesAsync();

                Notification notification = _notificationsHelper.CreateNotification(
                                    "Proposal Defence", $"Mid Evaluation processed successfully!",
                                    Payload.FypId.ToString()
                                    , NotificationsHelper.NotificationType.Individual, "FypGroup"
                                );

                await _notificationsHelper.SendNotification(notification);


                return new OkObjectResult(new { message = "Mid Evaluation Response processed successfully" });
            }
            catch (Exception e)
            {
                Console.WriteLine(e.ToString());
                return new ObjectResult(new { message = "An error occurred while processing the request" }) { StatusCode = 500 };
            }
        }





        //Final Evaluation METHODS
        public async Task<Evaluations?> FetchFinalEvaluation(int Fypid)
        {
            try
            {
                var result = await _context.FinalEvaluations.Where(s => s.FypId == Fypid).FirstOrDefaultAsync();

                if (result != null)
                {
                    Evaluations Eval = _mapper.Map<Evaluations>(result);
                    Eval.Grades = await _context.Students.Where(s => s.FypId == Fypid)
                        .Select(s => new { s.Id, FinalEvaluationGrade = s.FinalEvaluationGrade ?? string.Empty })
                        .ToDictionaryAsync(s => s.Id, s => s.FinalEvaluationGrade);

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

        public async Task<IActionResult> AddOrUpdateFinalEvaluation(Evaluations Payload)
        {
            try
            {
                var groupFyp = await _context.FypGroups.FirstOrDefaultAsync(s => s.Id == Payload.FypId);
                if (groupFyp == null)
                {
                    return new NotFoundObjectResult(new { message = "FypGroup not found" });
                }

                groupFyp.Status = "Done";

                groupFyp.FinalGrade = UpdateGradesAndCalculateAverage(Payload);
               
                    // Add new FinalEvaluation
                FinalEvaluation defence = new FinalEvaluation
                {
                    Date = Payload.Date,
                    InternalJury = Payload.InternalJury,
                    Remarks = Payload.Remarks,
                    FypId = Payload.FypId,
                    ExternalJury = Payload.ExternalJury,                        
                };
                    _context.FinalEvaluations.Add(defence);
                 var supervisorIds = new List<string>();
                 supervisorIds.Add(groupFyp.SupervisorId);
                 supervisorIds.Add(groupFyp.CosupervisorId);

                 Update_Supervisor_Slots(supervisorIds);
                 

                await _context.SaveChangesAsync();
                AddProject_ToExcel((int)Payload.FypId);
                return new OkObjectResult(new { message = "Final Evaluation Response processed successfully" });
            }
            catch (Exception e)
            {
                Console.WriteLine(e.ToString());
                return new ObjectResult(new { message = "An error occurred while processing the request" }) { StatusCode = 500 };
            }
        }

        public void AddProject_ToExcel(int FypId)
        {
            try
            {
                var Project = _context.ProjectRepositries.Where(F => F.FypId == FypId).FirstOrDefault();
                var result = Helper.UpdateDataSet(Project.FypId, Project.Title, Project.ProjectDescription);
            }
            catch (Exception e)
            {
                Console.WriteLine(e.ToString());
            }
        }


        // Your existing code modified to include grade calculation
        public string UpdateGradesAndCalculateAverage(Evaluations payload)
        {
            try
            {
                double totalGrades = 0;
                int gradeCount = 0;

                foreach (var grade in payload.Grades)
                {
                    CapstoneConnectDatabase.Models.Student student;
                    try
                    {
                        student = _context.Students.Where(s => s.Id == grade.Key).FirstOrDefault();
                    }
                    catch (Exception ex)
                    {
                        //ADD LOGER INFO HERE
                        //new Exception("Student not found");
                        return null;
                    }

                    student.FinalEvaluationGrade = grade.Value;

                    totalGrades += Helper.ConvertGradeToNumeric(grade.Value);
                    gradeCount++;
                }

                // Calculate the average grade
                double averageGradeNumeric = totalGrades / gradeCount;
                string averageGradeLetter = Helper.ConvertNumericToGrade(averageGradeNumeric);

                return averageGradeLetter;
            }
            catch (Exception e)
            {
                //ADD LOGER INFO HERE
               // new Exception(e.);
                return null;
            }
        }


        public void Update_Supervisor_Slots(List<String> Ids)
        {
            foreach (String s in Ids)
            {
                var sup = _context.Supervisors.Where(s => s.Id == s.Id).FirstOrDefault();
                sup.AvailableSlots = sup.AvailableSlots + 1;
            }
        }

        public async Task<IActionResult> GetAll_Queries()
        {
            try
            {
                var Queries = _context.Queries.OrderBy(q => q.Id).ToList();

                return new OkObjectResult(Queries);
            }
            catch (Exception ex)
            {
                return new ObjectResult(new { message = "An error occurred while Geting All Queries " }) { StatusCode = 500 };
            }
        }

        public async Task<IActionResult> GetAdminProfile(string adminId)
        {
            try
            {
                var profileView = await _context.Administrators
                    .Where(a => a.Id == adminId)
                    .Select(a => new ProfileView
                    {
                        AdminId = a.Id,
                        AdminUsername = a.Username
                    })
                    .FirstOrDefaultAsync();

                if (profileView == null)
                {
                    return new NotFoundObjectResult(new { message = "Administrator not found" });
                }
                profileView.RegisteredEmail = await _context.AspNetUsers.Where(s => s.Id == adminId).Select(s => s.Email).FirstOrDefaultAsync();
                return new OkObjectResult(profileView);
            }
            catch (Exception ex)
            {
                return new BadRequestObjectResult(new { message = "An error occurred while fetching Administrator profile", error = ex.Message });
            }
        }

        public async Task<IActionResult> GetAllQueries()
        {
            try
            {
                var queries = _context.Queries.OrderByDescending(q => q.Id).ToList();

                if (queries == null)
                {
                    return new NotFoundObjectResult(new { message = "Queries not found" });
                }
                return new OkObjectResult(queries);
            }
            catch (Exception ex)
            {
                return new BadRequestObjectResult(new { message = "An error occurred while fetching queries ", error = ex.Message });
            }
        }

        public async Task<IActionResult> EmailEvaluationResults(EmailResults results)
        {
            try
            {
                var email = _context.AspNetUsers.Where(s => s.Id == results.FypId.ToString())
                                                .Select(s => s.Email)
                                                .FirstOrDefault();

                MailRequest request = new MailRequest
                {
                    Id = results.FypId.ToString(),
                    Attachments = results.Attachments is List<IFormFile> ? (List<IFormFile>)results.Attachments : new List<IFormFile> { (IFormFile)results.Attachments },
                    Subject = "Final Evaluation Results for Fyp Id: " + results.FypId,
                    Body = "Following attachment contains results of your Fyp: "
                };

                if (await _mail.SendEmailAsync(request, email, "Results"))
                {
                    return new OkObjectResult(new { message = "Final Evaluation Response Emailed" });
                }
                else
                {
                    return new BadRequestObjectResult(new { message = "Results couldn't be mailed, kindly try again" });
                }
            }
            catch (Exception ex)
            {
                return new BadRequestObjectResult(new { message = "An error occurred while emailing results ", error = ex.Message });
            }
        }
    }
}

