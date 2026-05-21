using CapstoneConnect.ViewModels;
using CapstoneConnectDatabase.Models;
using DocumentFormat.OpenXml.InkML;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.StaticFiles;
using Microsoft.EntityFrameworkCore;
using Newtonsoft.Json;
using Org.BouncyCastle.Ocsp;
using System.Text;
using static iText.Svg.SvgConstants;
using CapstoneConnect.Helpers;
using DocumentFormat.OpenXml.Office2013.Drawing.ChartStyle;
using System.Reflection;
using System.Linq.Dynamic.Core;

namespace CapstoneConnect.BLL
{
    public class Student
    {
        private readonly CapstoneConnectContext _context;
        private readonly APIHelper _help;
        private readonly NotificationsHelper _notificationsHelper;
        private readonly string ?_plagiarismApiUrl;

        public Student(NotificationsHelper notificationsHelper, CapstoneConnectContext context, APIHelper help,
            IConfiguration configuration)
        {
            _notificationsHelper = notificationsHelper;
            _context = context;
            _help = help;
            _plagiarismApiUrl = configuration["_plagiarismApiUrl"] ?? "";
        }

        public async Task<FypDescription> Description(int Id)
        {
            try
            {
                return await _context.FypGroups.Where(s => s.Id == Id).Select(s => new FypDescription { Id = s.Id, Title = s.Title, ProjectDescription = s.ProjectDescription, Tags = s.Tags }).FirstOrDefaultAsync();
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex);
                throw;
            }
        }


        public async Task<bool> UpdateDescription(FypDescription Desc)
        {
            try
            {
                var fypGroup = await _context.FypGroups.FindAsync(Desc.Id);
                if (fypGroup == null)
                {
                    return false;
                }

                fypGroup.Title = Desc.Title;
                fypGroup.ProjectDescription = Desc.ProjectDescription;
                fypGroup.Tags = Desc.Tags;

                await _context.SaveChangesAsync();

                
                Notification notification = _notificationsHelper.CreateNotification(
                                    "Description Updated","Project description updated successfully",
                                    fypGroup.Id.ToString(),
                                     NotificationsHelper.NotificationType.Individual, "FypGroup"
                                );

                await _notificationsHelper.SendNotification(notification);

                return true;
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.ToString());
                throw;
            }

        }

        public async Task<List<object>> AvailableSupervisor()
        {
            try
            {
                var availableSupervisors = await _context.Supervisors
                    .Where(s => s.AvailableSlots > 0)
                    .Select(s => new { s.Id, s.Username })
                    .ToListAsync();

                var result = availableSupervisors.Select(s => new
                {
                    id = s.Id.ToString(),
                    username = s.Username
                }).ToList<object>();

                return result;
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.ToString());
                throw;
            }
        }
        public async Task<List<string>> Eligible_Submissions(int FypId)
        {
            try
            {
                var FypGrpStatus = await _context.FypGroups
                    .Where(f => f.Id == FypId)
                    .Select(f => f.Status)
                    .FirstOrDefaultAsync();

                if (FypGrpStatus == "Pending")
                    return new List<string> { "Abstract" };

                var result = await (from t in _context.SubmissionTypes
                                    where !_context.Submissions
                                        .Where(s => s.Status != "04" && s.FypGrpId == FypId)
                                        .Select(s => s.Type)
                                        .Contains(t.SubmissionId)
                                    && (t.SubmissionType1 == FypGrpStatus || t.SubmissionType1 == "All")
                                    select t.SubmissionName).ToListAsync();

                return result;
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.ToString());
                throw;
            }
        }



        

        public async Task<ActionResult> UploadDocument(DocumentUpload documentUpload)
        {
            try
            {
                if (documentUpload.Files == null || documentUpload.Files.Length == 0)
                {
                    return new BadRequestObjectResult(new { Message = "No files uploaded." });
                }

                var submissionId = await _context.SubmissionTypes
                    .Where(st => st.SubmissionName == documentUpload.Type)
                    .Select(st => st.SubmissionId)
                    .FirstOrDefaultAsync();

                if (submissionId == default)
                {
                    return new BadRequestObjectResult(new { Message = "Submission type not found." });
                }


                if (submissionId == 1)
                {
                    var verifyAbstractConditions = await VerifyAbstractCriteria(documentUpload);

                    if (!verifyAbstractConditions)
                    {
                        return new BadRequestObjectResult(new { Message = "Either Abstract is submitted to same supervisor or Already 3 abstarct have been submitted" });
                    }
                }
                else
                {
                    var no_of_submissions_pendingORapproved = await _context.Submissions
                        .Where(s => s.FypGrpId == documentUpload.FypGroupId && (s.Status == "00" || s.Status == "03") && s.Type == submissionId)
                        .ToListAsync();

                    if (no_of_submissions_pendingORapproved.Any())
                    {
                        return new BadRequestObjectResult(new { Message = "Pending or approved submission already exists for this group." });
                    }
                    else
                    {
                        documentUpload.SupervisorID = await _context.FypGroups.Where(s => s.Id == documentUpload.FypGroupId).Select(s => s.SupervisorId).FirstOrDefaultAsync();
                        documentUpload.CoSupervisorId = await _context.FypGroups.Where(s => s.Id == documentUpload.FypGroupId).Select(s => s.CosupervisorId).FirstOrDefaultAsync();
                    }
                }

                string path = _help.SaveSubmission(documentUpload.FypGroupId, documentUpload.Type, documentUpload.Files);

                var newSubmission = new Submission
                {
                    Type = submissionId,
                    Time = DateTime.Now,
                    FypGrpId = documentUpload.FypGroupId,
                    DocumentPath = path,
                    SupervisorId = documentUpload.SupervisorID,
                    CoSupervisorId = documentUpload.CoSupervisorId,
                    Status = "03",
                    StudentId = documentUpload.StudentId
                };

                _context.Submissions.Add(newSubmission);
                await _context.SaveChangesAsync();

                if (submissionId == 1)
                {
                    var description = await _context.FypGroups
                        .Where(x => x.Id == documentUpload.FypGroupId)
                        .Select(x => x.ProjectDescription)
                        .FirstOrDefaultAsync();

                    if (!string.IsNullOrEmpty(description))
                    {
                        var similarity = await CheckSimilarity(description);
                        if (similarity != null)
                        {
                            await PlagiarismHelper(similarity, newSubmission.Id, newSubmission.FypGrpId);
                        }
                    }
                }

                List<Notification> allNotifications = new List<Notification>();

                var successMsg = $"{documentUpload.Type} uploaded successfully!";

                Notification notification = InitNotification("Document Uploaded!",
                    successMsg, documentUpload.FypGroupId.ToString(), (int)NotificationsHelper.NotificationType.Individual,
                    "FypGroup");

                allNotifications.Add(notification);

                //successMsg = $"New submission by group {documentUpload.FypGroupId}";
                successMsg = $"{documentUpload.FypGroupId} has submitted {documentUpload.Type}";

                notification = InitNotification("New document submission!",
                successMsg, documentUpload.SupervisorID, (int)NotificationsHelper.NotificationType.Individual,
                "Supervisor");

                allNotifications.Add(notification);

                if (documentUpload.CoSupervisorId != null)
                {
                    notification = InitNotification("New document submission!",
                    successMsg, documentUpload.CoSupervisorId, (int)NotificationsHelper.NotificationType.Individual,
                    "Supervisor");

                    allNotifications.Add(notification);
                }

                foreach (var n in allNotifications)
                {
                    await _context.SaveChangesAsync();
                    await _notificationsHelper.SendNotification(n);
                }


                return new OkObjectResult(new { Message = successMsg, Document = documentUpload });
            }
            catch (Exception ex)
            {

                Console.WriteLine(ex.ToString());
                return new BadRequestObjectResult(new { Message = "An error occurred during document upload.", Details = ex.Message });
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

        private async Task<bool> VerifyAbstractCriteria(DocumentUpload documentUpload)
        {
            var submissionCount = await _context.Submissions
                .Where(s => s.FypGrpId == documentUpload.FypGroupId && s.Type == 1 && s.Status == "03")
                .CountAsync();

            if (submissionCount > 3)
            {
                return false;
            }

            var multipleSubmissionSupervisorCheck = await _context.Submissions
                .Where(s => s.FypGrpId == documentUpload.FypGroupId && (s.SupervisorId == documentUpload.SupervisorID || s.CoSupervisorId == documentUpload.CoSupervisorId))
                .ToListAsync();

            if (multipleSubmissionSupervisorCheck.Any())
            {
                return false;
            }

            return true;
        }

        private async Task PlagiarismHelper(SimilarityResponse response, int submissionId, int FypGrpId)
        {
            try
            {
                if (response != null)
            {
                var submission = _context.Submissions.Where(x => x.Id == submissionId)
                    .FirstOrDefault();

                if (submission != null)
                {
                    submission.IsPlagiarised = true;
                    await _context.SaveChangesAsync();
                }

                    SimilarProject highestPlagProject = response.SimilarProjects.OrderBy(x => x.Similarity).FirstOrDefault();
                var entry = new Plagiarism
                {
                    SubmissionId = submission?.Id,
                    MatchedFypId = highestPlagProject?.FypId,
                    PlagiarismPercentage = (decimal)highestPlagProject?.Similarity

                };
                _context.Plagiarisms.Add(entry);
                
                await _context.SaveChangesAsync();
            }
            }
            catch(Exception e)
            {

            }
        }

        public async Task<SimilarityResponse> CheckSimilarity(string description)
        {
            var url = $"{_plagiarismApiUrl}/check_similarity";
            var projectDescription = new
            {
                project_description = description
            };
            var jsonPayload = JsonConvert.SerializeObject(projectDescription);
            using var client = new HttpClient();
            var content = new StringContent(jsonPayload, Encoding.UTF8, "application/json");
            try
            {
                var response = await client.PostAsync(url, content);

                var responseContent = await response.Content.ReadAsStringAsync();
                if (response.IsSuccessStatusCode)
                {
                    var similarityResponse = JsonConvert.DeserializeObject<SimilarityResponse>(responseContent);

                    if (similarityResponse?.SimilarProjects != null && similarityResponse.SimilarProjects.Count > 0)
                    {
                        return similarityResponse;
                    }
                }
                else
                {
                    Console.WriteLine($"Error: {response.StatusCode}, Content: {responseContent}");
                }

            }
            catch (Exception ex)
            {
                //Console.WriteLine($"Exception: {ex.Message}");
            }

            return null;
        }

        public async Task<SimilarProject> GetSimilarProjects(int submissionId)
        {
            var list = await _context.Plagiarisms.Where
                (x => x.SubmissionId == submissionId).ToListAsync();

            if (list == null)
            {
                return null;
            }
            List<SimilarProject> similarProjects = new List<SimilarProject>();

            foreach (var entry in list)
            {
                var project = new SimilarProject
                {
                    Similarity = (double)entry.PlagiarismPercentage,
                    FypId = entry.MatchedFypId

                };
                similarProjects.Add(project);
            }

            SimilarProject highestPlagProject  = similarProjects.OrderByDescending(x=>x.Similarity).FirstOrDefault();
            return highestPlagProject;

        }


        public async Task<IActionResult> Add_MOM(Meeting meet)
        {
            try
            {
                int maxId = 0;

                // Check if there are any elements in the Meetings collection
                if (await _context.Meetings.AnyAsync())
                {
                    // Get the maximum Id if there are elements
                    maxId = await (from q in _context.Meetings
                                   select q.Id).MaxAsync();
                }


                meet.Id = maxId + 1; // Check

                var latestMeetingNumber = await _context.Meetings.Where(m => m.FypId == meet.FypId).OrderByDescending(m => m.MeetingNumber).Select(m => m.MeetingNumber).FirstOrDefaultAsync();

                latestMeetingNumber = latestMeetingNumber == null ? 0 : latestMeetingNumber.Value;
                meet.MeetingNumber = latestMeetingNumber + 1;

                await _context.Meetings.AddAsync(meet);

                await _context.SaveChangesAsync();

                //var superId = _context.FypGroups
                //            .Where(x => x.Id == meet.FypId)
                //            .Select(x => x.SupervisorId) 
                //            .FirstOrDefault();

                var result = await _context.FypGroups
                   .Where(x => x.Id == meet.FypId)
                    .Select(y => new { y.SupervisorId, y.Title })
                    .FirstOrDefaultAsync();

                Notification notification = _notificationsHelper.CreateNotification(
                    "Minutes of meetings", $"Minutes of meetings added by {result.Title}",
                    result.SupervisorId ?? ""
                    , NotificationsHelper.NotificationType.Individual, "Supervisor"
                );

                await _notificationsHelper.SendNotification(notification);


                return new OkObjectResult(new { message = "MOM Added Successfully" });
            }
            catch (Exception ex)
            {
                return new BadRequestObjectResult(new { message = "An error occurred while adding MOM", error = ex.Message });
            }
        }

        public async Task<IActionResult> Update_MOM(Meeting updatedmeet)
        {
            try
            {
                var existingmeet = await _context.Meetings.FirstOrDefaultAsync(m => m.Id == updatedmeet.Id);

                if (existingmeet == null)
                {
                    return new NotFoundObjectResult(new { message = "Meeting not found" });
                }

                foreach (PropertyInfo property in typeof(Meeting).GetProperties())
                {
                    if (property.Name == "Id" || property.Name == "FypId")
                        continue;

                    var updatedValue = property.GetValue(updatedmeet);

                    if (updatedValue != null)
                    {
                        property.SetValue(existingmeet, updatedValue);
                        _context.Entry(existingmeet).Property(property.Name).IsModified = true;
                    }
                }

                await _context.SaveChangesAsync();

                var superId = _context.FypGroups
                           .Where(x => x.Id == updatedmeet.FypId)
                           .Select(x => x.SupervisorId)
                           .FirstOrDefault();

                var fypTitle = await _context.FypGroups.
                    Where(x => x.Id == updatedmeet.FypId).Select(x => x.Title).FirstOrDefaultAsync();

                Notification notification = _notificationsHelper.CreateNotification(
                    "Minutes of meetings", $"Minutes of meetings updated by {fypTitle}",
                    superId ?? ""
                    , NotificationsHelper.NotificationType.Individual, "Supervisor"
                );

                await _notificationsHelper.SendNotification(notification);

                return new OkObjectResult(new { message = "MOM Updated Successfully" });
            }
            catch (Exception ex)
            {
                return new BadRequestObjectResult(new { message = "An error occurred while updating MOM", error = ex.Message });
            }
        }

        public async Task<IActionResult> Delete_MOM(int id)
        {
            try
            {
                var meet = _context.Meetings.Where(m => m.Id == id).FirstOrDefault();

                _context.Meetings.Remove(meet);

                await _context.SaveChangesAsync();

                return new OkObjectResult(new { message = "MOM Deleted Successfully" });
            }
            catch (Exception ex)
            {
                return new BadRequestObjectResult(new { message = "An error occurred while deleting MOM", error = ex.Message });
            }
        }


        public async Task<IActionResult> ViewQueries(int FypID)
        {
            try
            {
                var Queries = _context.Queries.Where(f => f.FypId == FypID).ToList();

                if (Queries.Any())
                    return new OkObjectResult(Queries);

                return null;
            }
            catch (Exception ex)
            {
                return new BadRequestObjectResult(new { message = "An error fetching queries", error = ex.Message });
            }
        }


        public async Task<IActionResult> Add_Query(Query query)
        {
            try
            {
                var maxId = _context.Queries.Any() ? _context.Queries.Max(q => q.Id) : 0;
                query.Id = maxId + 1;

                var Last_Count = await (from q in _context.Queries
                                        where q.FypId == query.FypId
                                        select q.Count).MaxAsync();

                Last_Count = Last_Count.HasValue ? Last_Count.Value : 0;

                query.Count = Last_Count + 1;

                // Do not set query.ID explicitly when query is added to _context.Queries

                await _context.Queries.AddAsync(query);
                await _context.SaveChangesAsync();

                var fypTitle =await _context.FypGroups.
                    Where(x => x.Id == query.FypId).Select(x => x.Title).FirstOrDefaultAsync();

                Notification notification = _notificationsHelper.CreateNotification(
                    "Minutes of meetings", $"{fypTitle} has posted a new query.",
                        "", NotificationsHelper.NotificationType.Admin, "Admin"
                );

                await _notificationsHelper.SendNotification(notification);

                return new OkObjectResult(new { message = "Query Added Successfully" });
            }
            catch (Exception ex)
            {
                return new BadRequestObjectResult(new { message = "An error occurred while adding Query", error = ex.Message });
            }
        }


        public async Task<IActionResult> DeleteQuery(int Id)
        {
            try
            {
                var Query = await _context.Queries.Where(f => f.Id == Id).FirstOrDefaultAsync();

                _context.Queries.Remove(Query);

                await _context.SaveChangesAsync();

                return new OkObjectResult(new { message = "Query Deleted Successfully" });
            }
            catch (Exception ex)
            {
                return new BadRequestObjectResult(new { message = "An error deleting Query", error = ex.Message });
            }
        }

        public async Task<IActionResult> GetFYPProfile(int id)
        {
            try
            {
                var view = await (from fyp in _context.FypGroups
                                  join stu in _context.Students on fyp.TeamleadId equals stu.Id
                                  where fyp.Id == id
                                  select new ProfileView
                                  {
                                      FypId = fyp.Id,
                                      FypTitle = fyp.Title,
                                      TeamLeadId = stu.Id,
                                      TeamLeadName = stu.Name,
                                      TeamLeadCGPA = stu.Cgpa
                                  }).FirstOrDefaultAsync();

                if (view == null)
                {
                    return new BadRequestObjectResult(new { message = "No View Exists" });
                }

                var user = await _context.AspNetUsers
                    .Where(s => s.Id == id.ToString())
                    .Select(s => new { s.Email })
                    .FirstOrDefaultAsync();

                if (user == null)
                {
                    return new BadRequestObjectResult(new { message = "User not found" });
                }

                var members = await _context.Students
                    .Where(s => s.FypId == id && s.Id != view.TeamLeadId)
                    .Select(s => new { s.Id, s.Name, s.Cgpa })
                    .ToListAsync();

                view.RegisteredEmail = user.Email;
                view.MembersId = members.Select(m => m.Id).ToList();
                view.MembersName = members.Select(m => m.Name).ToList();
                view.MembersCGPA = members.Select(m => m.Cgpa ?? 0).ToList();

                return  new OkObjectResult(view);
            }
            catch (Exception ex)
            {
                return new BadRequestObjectResult(new { message = "An error fetching Profile", error = ex.Message });
            }
        }

    }
}
