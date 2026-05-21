using System;
using System.Security.Principal;
//using CapstoneConnect.Models;
using CapstoneConnectDatabase.Models;
using CapstoneConnect.ViewModels;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using CapstoneConnect.BLL;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Authorization;
using CapstoneConnect.Attributes;

namespace CapstoneConnect.Controllers
{
    [ApiController]
    [Route("[controller]")]
    [Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme, Roles = "Admin,FypGroup,Supervisor")]
    [Logging]
    public class UserManagementController : ControllerBase
    {
        private readonly UserManager<IdentityUser> _userManager;
        private readonly CapstoneConnectContext _context;
        private readonly RoleManager<IdentityRole> _roleManager;
        private readonly UserManagement _BLL;

        public UserManagementController(UserManager<IdentityUser> userManager,
                              SignInManager<IdentityUser> signInManager, CapstoneConnectContext context, RoleManager<IdentityRole> roleManager, UserManagement bLL)
        {
            _userManager = userManager;
            _context = context;
            _roleManager = roleManager;
            _BLL = bLL;
        }

        [HttpPost]
        [Route("RoleAdd")]
        public async Task<IActionResult> AddRole()
        {
            try
            {
                bool result = await _BLL.AddRoleAsync("FypGroup");
                if (result)
                {
                    return Ok(new { message = "Role added successfully" });
                }
                else
                {
                    return BadRequest(new { message = "Failed to add role" });
                }
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }

        }

        [HttpPost]
        [Route("AddIdentityAsync")]
        public async Task<IActionResult> AddIdentityAsync(AddUser account)
        {
            try
            {
                bool result = await _BLL.AddIdentityAsync(account);
                if (result)
                {
                    return Ok(new { message = "User added successfully", account.Id });
                }
                else
                {
                    return BadRequest(new { message = "Failed to add user" });
                }
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }

        }


        [HttpPost]
        [Route("UserAdd")]
        public async Task<IActionResult> AddUsers(List<AddUser> users)
        {
            try
            {
                IActionResult result = await _BLL.AddUsersAsync(users);
                return result;
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }

        }



        [HttpPost]
        [Route("UserRemove")]
        public async Task<IActionResult> Remove(DeleteUser user)
        {
            var user_fetched = await _userManager.FindByEmailAsync(user.Email);

            if (user == null)
            {
                return NotFound(new { message = "User not found" });
            }

            var result = await _userManager.DeleteAsync(user_fetched);

            if (result.Succeeded)
            {
                return Ok(new { message = "User removed successfully" });
            }

            return BadRequest(new { message = "Failed to remove user" });
        }

        [HttpPost]
        [Route("UserRemove")]
        public async Task<IActionResult> RemoveUser(DeleteUser user)
        {
            try
            {
                IActionResult result = await _BLL.RemoveUserAsync(user);
                return result;
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }

        }


        [HttpGet]
        [Route("FetchGuidelines")]
        public async Task<IActionResult> FetchGuidelines()
        {
            try
            {
                var Guidelines = await _BLL.FetchGuidelines();

                if (Guidelines == null)
                    return NotFound();

                return Ok(Guidelines);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }


        [HttpPost]
        [Route("DownloadFile/{guidelineid}")]
        public async Task<IActionResult> DownloadFile(int guidelineid)
        {
            try
            {
                // Call the BLL method to download the file and get the content and MIME type
                var result = await _BLL.DownloadFileAsync(guidelineid);
                var fileContent = result.content;
                var fileMimeType = result.mimeType;

                // Construct the file name; this can be dynamic or based on your logic
                var fileName = $"guideline_{guidelineid}{Path.GetExtension(result.filePath)}";

                // Return the file with the correct MIME type and file name
                return File(fileContent, fileMimeType, fileName);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }


        [HttpGet]
        [Route("SubmissionTypes/{section}")]
        public async Task<IActionResult> SubmissionTypes(String section)
        {
            try
            {
                var result = _BLL.SubmissionTypes(section);

                return Ok(result);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpGet]
        [Route("FetchFeedback/{SubId}")]
        public async Task<IActionResult> FetchFeedback(int SubId)
        {
            try
            {
                var result = await _BLL.FetchFeedback(SubId);

                return Ok(result);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }


        [HttpGet]
        [Route("GetFortnightlySheetFypGrp/{FypId}")]
        public async Task<IActionResult> GetFortnightlySheetFypGrp(int FypId)
        {
            return await _BLL.GetFortnightlySheetFypGrp(FypId);
        }

        [HttpGet]
        [Route("GetMOM/{Id}")]
        public async Task<IActionResult> GetMOM(int Id)
        {
            return await _BLL.Get_MOM(Id);
        }

        [HttpGet]
        [Route("ViewQueryById/{Id}")]
        public async Task<IActionResult> ViewQueryById(int Id)
        {
            return await _BLL.ViewQueryById(Id);
        }

        [HttpPost]
        [Route("UpdateQuery")]
        public async Task<IActionResult> UpdateQuery(Query query)
        {
            return await _BLL.UpdateQuery(query);
        }

        [Route("Calendar")]
        [HttpGet]
        public async Task<ActionResult> GetCalendars()
        {
            try
            {
                Dictionary<string, List<Calendar>> Calendar = await _BLL.Calendars();

                if (Calendar == null)
                    return null;

                return Ok(Calendar);

            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpGet]
        [Route("FetchSubmission/{groupid}")]
        public async Task<IActionResult> FetchSubmission(int groupid)
        {
            try
            {
                var submissions = await _BLL.GetSubmissionsForFypGrp(groupid);

                if (submissions == null)
                    return NotFound("No proposal are submitted");

                return Ok(submissions);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }


        [Route("GetSupervisor/{id}")]
        [HttpGet()]
        public async Task<IActionResult> GetSupervisor(string id)
        {
            try
            {
                SupervisorViewModel Supervisor = await _BLL.Supervisor(id);
                if (Supervisor == null)
                    return BadRequest("No such supervisor exists");

                return Ok(Supervisor);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }

        }


        [Route("GetAllSupervisors")]
        [HttpGet]
        public async Task<IActionResult> GetAllSupervisors()
        {
            try
            {
                var supervisors = await _BLL.GetAllSupervisors();
                return Ok(supervisors);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        //NEWW APIS FOR PROJECT REPOSITORY AND ONGOING PROJECTS
        [Route("ProjectRepositry")]
        [HttpGet]
        public async Task<IActionResult> ProjectRepositry()
        {
            try
            {
                List<Projects> Projects = await _BLL.ProjectRepository();

                if (Projects == null) return NotFound();

                return Ok(Projects);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [Route("ProjectRepositryById/{id}")]
        [HttpGet("id")]
        public async Task<IActionResult> ProjectRepositry(int id)
        {
            try
            {
                Projects Project = await _BLL.ProjectRepositoryById(id);
                if (Project == null) return NotFound();
                return Ok(Project);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        //Proposal Defenece APIS
        [HttpGet]
        [Route("FetchProposalDefence/{FypId}")]
        public async Task<IActionResult> FetchProposalDefence(int FypId)
        {
            try
            {
                var result = await _BLL.FetchProposalDefence(FypId);

                return Ok(result);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        //Mid Evaluation APIS
        [HttpGet]
        [Route("MidEvaluation/{FypId}")]
        public async Task<IActionResult> FetchMidEvaluation(int FypId)
        {
            try
            {
                var result = await _BLL.FetchMidEvaluation(FypId);

                return Ok(result);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpPost]
        [Route("DownloadSubmissionFile/{submissionId}")]
        public async Task<IActionResult> DownloadSubmissionFile(int submissionId)
        {
            try
            {
                // Call the BLL method to download the file and get the content and MIME type
                var result = await _BLL.DownloadSubmissionFile(submissionId);
                var fileContent = result.content;
                var fileMimeType = result.mimeType;

                // Construct the file name; this can be dynamic or based on your logic
                var fileName = $"submission_{submissionId}{Path.GetExtension(result.filePath)}";

                // Return the file with the correct MIME type and file name
                return File(fileContent, fileMimeType, fileName);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpPost]
        [Route("DownloadFinalReport/{FinalReportId}")]
        public async Task<IActionResult> DownloadFinalReport(int FinalReportId)
        {
            try
            {
                // Call the BLL method to download the file and get the content and MIME type
                var result = await _BLL.DownloadFinalReport(FinalReportId);
                var fileContent = result.content;
                var fileMimeType = result.mimeType;

                // Construct the file name; this can be dynamic or based on your logic
                var fileName = $"submission_{FinalReportId}{Path.GetExtension(result.filePath)}";

                // Return the file with the correct MIME type and file name
                return File(fileContent, fileMimeType, fileName);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }
    }
}
