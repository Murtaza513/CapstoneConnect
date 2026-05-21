using System;
using CapstoneConnect.ViewModels;
using CapstoneConnectDatabase.Models;
using GemBox.Document;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using CapstoneConnect.Helpers;
using Newtonsoft.Json;
using System.Text;
using DocumentFormat.OpenXml.InkML;
using DocumentFormat.OpenXml.Presentation;
using DocumentFormat.OpenXml.Wordprocessing;
using CapstoneConnectLog;


namespace CapstoneConnect.BLL
{
    public class Supervisorr
    {

        private readonly CapstoneConnectContext _context;
        private readonly FileReader _filehelper;
        private readonly NotificationsHelper _notificationsHelper;
        private readonly ChatHelper _chatHelper;
        private readonly IHttpClientFactory _clientFactory;
        private readonly CommonExceptionLogger _logger;

        public Supervisorr(ChatHelper chatHelper,CommonExceptionLogger logger ,IHttpClientFactory clientFactory,CapstoneConnectContext context, FileReader filehelper, NotificationsHelper notificationsHelper)
        {
            _chatHelper = chatHelper;
            _clientFactory = clientFactory;
            _context = context;
            _filehelper = filehelper;
            _notificationsHelper = notificationsHelper;
            _logger = logger;
        }
        public async Task<List<ProposalViewSupervisor>> FetchProposal(SupervisorPayload Payload)
        {
            try
            {
                List<ProposalViewSupervisor> ViewProposals = new List<ProposalViewSupervisor>();

                List<Submission> proposals = new List<Submission>();

                if (Payload.Status == "Pending")
                {
                    proposals.AddRange(await _context.Submissions
                        .Where(s =>
                            ((s.SupervisorId == Payload.SupId && (s.Status == "03" || s.Status == "02"))
                            || (s.CoSupervisorId == Payload.SupId && (s.Status == "03" || s.Status == "01")))
                            && (s.Type == 1))
                        .ToListAsync());
                }
                else if (Payload.Status == "Approved")
                {
                    proposals.AddRange(await _context.Submissions
                    .Where(s =>
                        (s.SupervisorId == Payload.SupId && s.Type == Payload.Type_Submission && (s.Status == "01" || s.Status == "00")) ||
                        (s.CoSupervisorId == Payload.SupId && s.Type == Payload.Type_Submission && (s.Status == "02" || s.Status == "00"))
                        && (s.Type == 1))
                    .ToListAsync());                   
                }
                else if(Payload.Status == "Rejected")
                {
                    proposals.AddRange(await _context.Submissions
                                         .Where(sub => (sub.SupervisorId == Payload.SupId || sub.CoSupervisorId == Payload.SupId)
                                                       && sub.Status == "05"
                                                       && sub.Type == 1)
                                         .ToListAsync());
                }

                foreach (Submission submission in proposals)
                {
                    ProposalViewSupervisor viewProposal = new ProposalViewSupervisor
                    {
                        Submission_Id = submission.Id,

                        FypId = submission.FypGrpId,

                        FypTitle = await _context.FypGroups.Where(f => f.Id == submission.FypGrpId).Select(f => f.Title).FirstOrDefaultAsync(),

                        TeamMembers = string.Join(", ", await (from student in _context.Students
                                                               join fypGroup in _context.FypGroups on student.FypId equals fypGroup.Id
                                                               where student.FypId == submission.FypGrpId
                                                               select student.Name).ToListAsync()),

                        SubmissionDate = submission.Time,

                        FypDescription = await _context.FypGroups.Where(s => s.Id == submission.FypGrpId).Select(s => s.ProjectDescription).FirstOrDefaultAsync(),

                        //FypDescription = await _filehelper.GetContentFromFile(submission.DocumentPath, "Abstract:  "),

                        Plagiarism = submission.IsPlagiarised == true ? (decimal)(await _context.Plagiarisms.Where(p => p.SubmissionId == submission.Id).Select(p => p.PlagiarismPercentage).FirstOrDefaultAsync()) : 0,

                        status = _context.SubmissionStatuses.Where(s => s.StatusNumber == submission.Status).Select(s => s.Status).FirstOrDefault(),

                        Feedback = submission.Feedback,

                        Supervisor = _context.Supervisors.Where(s => s.Id == submission.SupervisorId).Select(s=>s.Username).FirstOrDefault(),
                        
                        CoSupervisor = _context.Supervisors.Where(s => s.Id == submission.CoSupervisorId).Select(s => s.Username).FirstOrDefault(),
                    };

                    ViewProposals.Add(viewProposal);
                }

                return ViewProposals;
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex);
                throw;
            }
        }

        public async Task<byte[]> DownloadFile(int submissionid)
        {
            try
            {
                var documentPaths = await _context.Submissions.Where(s => s.Id == submissionid).Select(s => s.DocumentPath).FirstOrDefaultAsync();


                if (!File.Exists(documentPaths))
                {
                    throw new FileNotFoundException("File not found", documentPaths);
                }

                return File.ReadAllBytes(documentPaths);
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex);
                throw ex;
            }

        }



        public async Task<IActionResult> AcceptProposal(SupervisorPayload payload)
        {
            try
            {
                var proposal = await _context.Submissions.Where(s => s.Id == payload.SubmissionId).FirstOrDefaultAsync();

                if (proposal != null)
                {
                    if (proposal.SupervisorId == payload.SupId)
                    {
                        if (proposal.Status == "03") { proposal.Status = "01"; }
                        else if (proposal.Status == "02")
                        {
                            proposal.Status = "00"; 
                            var result = await UpdateFypGroup_Supervisor(proposal);
                            if (!result)
                            {
                                return new BadRequestObjectResult(new { Message = "No Available Slots" });
                            }
                            Remove_PendingAbstracts(proposal.FypGrpId, proposal.Id);      
                            
                        }
                        else { return new BadRequestObjectResult(new { Message = "Invalid Status" }); }
                    }
                    else if (proposal.CoSupervisorId == payload.SupId)
                    {
                        if (proposal.Status == "03") { proposal.Status = "02"; }
                        else if (proposal.Status == "01")
                        {
                            proposal.Status = "00";
                            var result = await UpdateFypGroup_Supervisor(proposal);
                            if (!result)
                            {
                                return new BadRequestObjectResult(new { Message = "No Available Slots" });
                            }
                            Remove_PendingAbstracts(proposal.FypGrpId, proposal.Id); 
                           
                        }
                        else { return new BadRequestObjectResult(new { Message = "Invalid Status" }); }
                    }

                    await _context.SaveChangesAsync();

                    await CreateChat(proposal);
                    var supervisorName = _context.Supervisors.
                        Where(x => x.Id == payload.SupId).Select(y => y.Username).FirstOrDefault();

                    Notification notification = InitNotification("Submission Update.", $"{supervisorName} has accepted your " +
                        $"proposal!", proposal.FypGrpId.ToString(), (int)NotificationsHelper.NotificationType.Individual, "FypGroup"
                        );

                    await _notificationsHelper.SendNotification(notification);
                    await _context.SaveChangesAsync();

                  

                    return new OkObjectResult(new { Message = "Proposal Accepted Successfuly" });
                }
                else
                    return new NotFoundObjectResult(new { Message = "No Such Proposals" });
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex);
                throw ex;
            }
        }

        public async Task<bool> UpdateFypGroup_Supervisor(Submission Proposal)
        {
            try
            {
                if (Proposal != null)
                {
                    var FypGrp = await _context.FypGroups.Where(s => s.Id == Proposal.FypGrpId).FirstOrDefaultAsync();
                    var Supervisor = await _context.Supervisors.Where(s => s.Id == Proposal.SupervisorId).FirstOrDefaultAsync();
                    var CoSupervisorId = await _context.Supervisors.Where(s => s.Id == Proposal.CoSupervisorId).FirstOrDefaultAsync();

                    if (Supervisor.AvailableSlots > 0 && CoSupervisorId.AvailableSlots > 0)
                    {
                        FypGrp.SupervisorId = Proposal.SupervisorId;
                        FypGrp.CosupervisorId = Proposal.CoSupervisorId;
                        FypGrp.Status = "Abstract";
                   
                        Supervisor.AvailableSlots = Supervisor.AvailableSlots - 1;
                        CoSupervisorId.AvailableSlots = CoSupervisorId.AvailableSlots - 1;
                    }                       
                    else
                        return false;

                    await _context.SaveChangesAsync();

                    return true;
                }
                return false;
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex);
                throw ex;
            }


        }

        public async Task<bool> Remove_PendingAbstracts(int FypId, int AcceptedProposal)
        {
            try
            {
                var AbstractToDelete = _context.Submissions
                    .Where(s => s.FypGrpId == FypId && s.Type == 1 && s.Status != "00" && s.Id != AcceptedProposal).ToList();

                // Remove the submissions
                _context.Submissions.RemoveRange(AbstractToDelete);

                // Save changes to the database
                await _context.SaveChangesAsync();

                // Always return true
                return true;
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex);
                throw;
            }
        }


        public async Task<bool> RejectProposal(SupervisorPayload payload)
        {
            try
            {
                var proposal = await _context.Submissions.Where(s => s.Id == payload.SubmissionId).FirstOrDefaultAsync();

                if (proposal != null)
                {
                    if (proposal.SupervisorId == payload.SupId || proposal.CoSupervisorId == payload.SupId)
                    {
                        proposal.Status = "05";
                    }
                    else
                    {
                        return false;
                    }
                    proposal.Feedback = payload.Feedback;
                    await _context.SaveChangesAsync();

                    var supervisorName = _context.Supervisors.
                        Where(x => x.Id == proposal.SupervisorId).Select(y => y.Username).FirstOrDefault();

                    Notification notification = InitNotification("Submission Update.", $"{supervisorName} has accepted your " +
                        $"proposal!", proposal.FypGrpId.ToString(), (int)NotificationsHelper.NotificationType.Individual, "FypGroup"
                        );

                    await _notificationsHelper.SendNotification(notification);
                    await _context.SaveChangesAsync();

                    return true;
                }
                else
                    return false;
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex);
                throw;
            }
        }



        public async Task<IActionResult> AddOrUpdateFeedbackAsync(SupervisorPayload payload)
        {
            try
            {
                // Retrieve the submission
                var submission = await _context.Submissions
                    .FirstOrDefaultAsync(s => s.Id == payload.SubmissionId);

                if (submission == null)
                {
                    return new NotFoundObjectResult(new { Message = "Submission not found." });
                }

                if (!string.IsNullOrEmpty(payload.Feedback))
                {
                    submission.Feedback = payload.Feedback;
                }

                if (!string.IsNullOrEmpty(payload.Status))
                {
                    var encoded_status = await _context.SubmissionStatuses.Where(s => s.Status == payload.Status).Select(s => s.StatusNumber).FirstOrDefaultAsync();

                    if (encoded_status == null)
                    {
                        return new BadRequestObjectResult(new { Message = "Invalid status." });
                    }

                    submission.Status = encoded_status;
                    int progress;

                    if (payload.Status == "Accepted")
                    {
                        var typeProgressEntity = await _context.SubmissionTypes.Where(s => s.SubmissionId == submission.Type).FirstOrDefaultAsync();

                        // Check if the entity was found
                        if (typeProgressEntity != null)
                        {

                            progress = (int)typeProgressEntity.Progress;


                            var FYPGRP = await _context.FypGroups
                                .FirstOrDefaultAsync(s => s.Id == submission.FypGrpId);

                            FYPGRP.Progress = FYPGRP.Progress + progress;
                        }
                    }
                }

                // Save changes to the database
                await _context.SaveChangesAsync();

                Notification notification = _notificationsHelper.CreateNotification(
                    "Supervisor Feedback", $"New feedback by {payload.SupId}",
                    submission.FypGrpId.ToString() ?? ""
                    , NotificationsHelper.NotificationType.Individual, "FypGroup"
                );

                await _notificationsHelper.SendNotification(notification);

                return new OkObjectResult(new { Message = "Submission updated successfully." });
            }
            catch (Exception ex)
            {
                // Log the exception (you may want to use a logging framework here)
                Console.WriteLine(ex);

                // Return a bad request with the exception message
                return new BadRequestObjectResult(new { Message = "An error occurred while updating the submission.", Details = ex.Message });
            }
        }

        public async Task<IActionResult> GetFypGroups(string supervisorId)
        {
            // Validate input
            if (string.IsNullOrWhiteSpace(supervisorId))
            {
                return new BadRequestObjectResult("Supervisor ID is required.");
            }

            try
            {
                var query = await (from fg in _context.FypGroups
                                   join s in _context.Students on fg.Id equals s.FypId
                                   where fg.TeamleadId == s.Id &&
                                         (fg.SupervisorId == supervisorId || fg.CosupervisorId == supervisorId)
                                   select new SupervisedProject
                                   {
                                       FypId = fg.Id,
                                       Title = fg.Title,
                                       ProjectDescription = fg.ProjectDescription,
                                       Status = fg.Status,
                                       Progress = fg.Progress,
                                       TeamLead = s.Name,
                                       MemberNames = string.Join(", ", fg.Students
                                                                   .Where(st => st.FypId == fg.Id && st.Id != fg.TeamleadId)
                                                                   .Select(st => st.Name))
                                   }).ToListAsync();

                var result = query.ToList();

                if (result == null || result.Count == 0)
                {
                    return new NotFoundObjectResult("No FYP groups found for the given supervisor.");
                }

                return new OkObjectResult(result);
            }
            catch (Exception ex)
            {
                // Log the exception (not shown here for brevity)
                return new ObjectResult("An error occurred while processing your request.")
                {
                    StatusCode = 500
                };
            }
        }

        public async Task<IActionResult> MarkAsComplete(int FypId)
        {
            try
            {
                var FypGroup = _context.FypGroups.Where(s => s.Id == FypId).FirstOrDefault();

                FypGroup.Status = "Complete";

                await _context.SaveChangesAsync();

                var notifications = new List<Notification>
                            {
                                _notificationsHelper.CreateNotification("Project Status", $"Congratulations, your project has been completed!", FypId.ToString(), NotificationsHelper.NotificationType.Individual, "FypGroup"),
                                _notificationsHelper.CreateNotification($"Project status for {FypGroup.Title}", $"{FypGroup.Title} has been completed!", FypGroup.SupervisorId, NotificationsHelper.NotificationType.Individual, "Supervisor")
                            };

                await _notificationsHelper.SendNotifications(notifications);
                return new OkObjectResult(new { Message = "Project updated successfully." });
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.ToString());
                throw;
            }

        }

        private static Notification InitNotification(string title, string details,
                   string userId, int type, string role)
        {
            var notification = new Notification
            {
                Title = title,
                Details = details,
                UserId = userId,
                NotificationType = type,
                Role = role,
                IsRead = false


            };

            return notification;
        }
    
        
        //FEEDBACK TO MOM
        public async Task<IActionResult> MOM_Feedback(Meeting ProvidedFeedback)
        {
            try
            {
                var MOM = await _context.Meetings.Where(m => m.Id == ProvidedFeedback.Id).FirstOrDefaultAsync();

                MOM.Feedback = ProvidedFeedback.Feedback;

                await _context.SaveChangesAsync();

                var notification = _notificationsHelper.CreateNotification("Mom feedback", $"Your supervisor has provided Mom feedback", ProvidedFeedback.FypId.ToString(), NotificationsHelper.NotificationType.Individual, "FypGroup");

                await _notificationsHelper.SendNotification(notification);

                return new OkObjectResult(new { message = "MOM Feedback Added Successfully" });
            }
            catch(Exception ex)
            {
                return new BadRequestObjectResult(new { message = "An error occurred while adding feedback to MOM", error = ex.Message });
            }
        }

        public async Task<IActionResult> GetSupervisorProfile(string supervisorId)
        {
            try
            {
                var profileView = await _context.Supervisors
                    .Where(s => s.Id == supervisorId)
                    .Select(s => new ProfileView
                    {
                        SupervisorId = s.Id,
                        SupervisorName = s.Username,
                        Preferences = s.Fyppreferences,
                        Department = s.Department
                    })
                    .FirstOrDefaultAsync();

                if (profileView == null)
                {
                    return new NotFoundObjectResult(new { message = "Supervisor not found" });
                }
                profileView.RegisteredEmail = _context.AspNetUsers.Where(s=>s.Id == supervisorId).Select(s=>s.Email).FirstOrDefault();
                return new OkObjectResult(profileView);
            }
            catch (Exception ex)
            {
                return new BadRequestObjectResult(new { message = "An error occurred while fetching Supervisor profile", error = ex.Message });
            }
        }

        private async Task CreateChat( Submission proposal)
        {
            try
            {
                var result = await _context.FypGroups
                     .Where(x => x.Id == proposal.FypGrpId)
                     .Select(y => new { y.SupervisorId, y.CosupervisorId })
                     .FirstOrDefaultAsync();

                var supervisorId = result?.SupervisorId;
                var coSupervisorId = result?.CosupervisorId;

                var chats = new List<NewChat>
                        {
                            new NewChat
                            {
                                fypGroup = proposal.FypGrpId,
                                supervisor = result?.SupervisorId
                            },
                            new NewChat
                            {
                                fypGroup = proposal.FypGrpId,
                                supervisor = result?.CosupervisorId
                            }
                        };

                await _chatHelper.CreateChat(chats);

            }
            catch (Exception ex)
            {
                _logger.Error(ex,"Error creating chat");
            }
            
        }
    }
}