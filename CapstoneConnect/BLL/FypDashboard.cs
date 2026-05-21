using System.Reflection;
using Abp.IO;
using CapstoneConnect.Helpers;
using CapstoneConnect.ViewModels;
using CapstoneConnectDatabase.Models;
using DocumentFormat.OpenXml.Office2016.Drawing.ChartDrawing;
using DocumentFormat.OpenXml.Wordprocessing;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace CapstoneConnect.BLL
{
    public class FypDashboard
    {
        private readonly CapstoneConnectContext _context;
        private readonly NotificationsHelper _notificationsHelper;
        public FypDashboard(CapstoneConnectContext context,NotificationsHelper notificationsHelper)
        {
            _context = context;
            _notificationsHelper = notificationsHelper;
        }

        public async Task<IActionResult> GetNamesMembers(int FypId)
        {
            try
            {
                var names = _context.Students.Where(f => f.FypId == FypId).Select(f => f.Name).ToList();

                if (names == null)
                    return new BadRequestObjectResult(new { Message = "There are no members with that FypId" });

                return new OkObjectResult(names);
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.ToString());
                return new BadRequestObjectResult(new { Message = "An error occurred while fetching names of members", Details = ex.Message });
            }
        }

        public async Task<IActionResult> DashboardData(int FypId)
        {
            try
            {
                var fypMembers = await _context.Students
                    .Where(s => s.FypId == FypId)
                    .Select(s => new Member { Id = s.Id.ToString(), Name = s.Name })
                    .ToListAsync();

                var supervisors = await (from sup in _context.Supervisors
                                         join fyp in _context.FypGroups on sup.Id equals fyp.SupervisorId
                                         where fyp.Id == FypId
                                         select new Dashboard_Supervisor { SupervisorId = sup.Id.ToString(), SupervisorName = sup.Username })
                                        .ToListAsync();

                var coSupervisors = await (from sup in _context.Supervisors
                                           join fyp in _context.FypGroups on sup.Id equals fyp.CosupervisorId
                                           where fyp.Id == FypId
                                           select new Dashboard_Supervisor { SupervisorId = sup.Id.ToString(), SupervisorName = sup.Username })
                                          .ToListAsync();

                supervisors.AddRange(coSupervisors);

                var progressStatus = await _context.FypGroups
                    .Where(f => f.Id == FypId)
                    .Select(f => new { f.Progress, f.Status })
                    .FirstOrDefaultAsync();

                var feedbackItems = await _context.WorkItems
                    .Where(w => w.FypId == FypId && w.Feedback != null)
                    .OrderByDescending(w => w.Id)
                    .Select(w => new FeedbackItem { FypId = w.Id, Feedback = w.Feedback })
                    .ToListAsync();

                var details = new Detail
                {
                    Progress = progressStatus?.Progress,
                    Status = progressStatus?.Status,
                    Feedback = feedbackItems
                };

                var result = new DashboardData
                {
                    Members = fypMembers,
                    Supervisors = supervisors,
                    Details = details
                };

                return new OkObjectResult(result);
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.ToString());
                return new BadRequestObjectResult(new { Message = "An error occurred during fetching dashboard data", Details = ex.Message });
            }
        }

        public async Task<IActionResult> AddWorkItem(WorkItem workItem)
        {
            try
            {
                if (workItem == null)
                     return new BadRequestObjectResult(new { Message = "Invalid Input" });

                workItem.AssignedOn = DateTime.Now;
                await _context.WorkItems.AddAsync(workItem);     
                _context.SaveChanges();

                var supervisorId = await _context.FypGroups.
                    Where(x => x.Id == workItem.FypId).Select(x => x.SupervisorId).FirstOrDefaultAsync();

                Notification notification = _notificationsHelper.CreateNotification(
                        "Task", $"New task added by group {workItem.FypId}", supervisorId,
                   NotificationsHelper.NotificationType.Individual,"Supervisor"
                    );

                await _notificationsHelper.SendNotification(notification);

                return new OkObjectResult(new {Message =  "Work item created "});
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.ToString());
                return new BadRequestObjectResult(new { Message = "An error occurred during adding workitem", Details = ex.Message });
            }
        }


        public async Task<IActionResult> GetWorkItemByFypId(int FypId)
        {
            try
            {
                var result = await _context.WorkItems.Where(f => f.FypId == FypId).Select(f => new { f.Id, f.Title, f.AssignedTo, f.Status }).ToListAsync();

                if (result == null || result.Count == 0)
                    return new BadRequestObjectResult(new { Message = "Invalid Input" });
               
                return new OkObjectResult(result);
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.ToString());
                return new BadRequestObjectResult(new { Message = "An error occurred while fetching work item", Details = ex.Message });
            }
        }



        public async Task<IActionResult> GetWorkItemById(int workitemid)
        {
            try
            {
                var result = await _context.WorkItems.Where(f => f.Id == workitemid).ToListAsync();

                if (result == null || result.Count == 0)
                    return new BadRequestObjectResult(new { Message = "Invalid Input" });

                return new OkObjectResult(result);
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.ToString());
                return new BadRequestObjectResult(new { Message = "An error occurred while fetching work item", Details = ex.Message });
            }
        }

        public async Task<IActionResult> UpdateWorkItem(WorkItem updatedWorkItem)
        {
            try
            {
                var existingworkitem = await _context.WorkItems.Where(f => f.Id == updatedWorkItem.Id).FirstOrDefaultAsync();

                if(existingworkitem == null)
                    return new BadRequestObjectResult(new { Message = "Invalid Input" });

                foreach (PropertyInfo property in typeof(WorkItem).GetProperties())
                {
                    if (property.Name == "Id")
                        continue;
                    var updatedValue = property.GetValue(updatedWorkItem);
                    if (updatedValue != null)
                    {
                        property.SetValue(existingworkitem, updatedValue);
                        _context.Entry(existingworkitem).Property(property.Name).IsModified = true;
                    }
                }

                await _context.SaveChangesAsync();

                var supervisorId = await _context.FypGroups.
                   Where(x => x.Id == existingworkitem.FypId).Select(x => x.SupervisorId).FirstOrDefaultAsync();

                Notification notification = _notificationsHelper.CreateNotification(
                        "Task", $"Task {updatedWorkItem.Title} updated by {existingworkitem.FypId}",
                        supervisorId ?? "", NotificationsHelper.NotificationType.Individual, "Supervisor"
                    );

                await _notificationsHelper.SendNotification(notification);
               


                return new OkObjectResult(new { Message = "Work item Updated successfuly" });
            }
            catch(Exception ex) 
            {
                Console.WriteLine(ex.ToString());
                return new BadRequestObjectResult(new { Message = "An error occurred while updating work item", Details = ex.Message });
            }
        }

        public async Task<IActionResult> DeleteWorkItem(int workitemid)
        {
            try
            {
                var workItem = await _context.WorkItems.FindAsync(workitemid);
                if (workItem == null)
                    return new BadRequestObjectResult(new { Message = "Invalid Input" });

                _context.WorkItems.Remove(workItem);
                await _context.SaveChangesAsync();

                return new OkObjectResult(new { Message = "Work item Deleted successfuly" });
            }
            catch(Exception ex)
            {
                Console.WriteLine(ex.ToString());
                return new BadRequestObjectResult(new { Message = "An error occurred while deleting work item", Details = ex.Message });
            }
        }
    }
}
