using AutoMapper;
//using CapstoneConnect.Models;
using CapstoneConnectDatabase.Models;
using CapstoneConnect.ViewModels;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Data;
using System.Globalization;
using Calendar = CapstoneConnectDatabase.Models.Calendar;
using Microsoft.EntityFrameworkCore.Metadata.Internal;
using CapstoneConnect.Constants;
using CapstoneConnect.BLL;
using Microsoft.Extensions.Logging.Abstractions;
using CapstoneConnect.Attributes;
//using CapstoneConnect.Models;

namespace CapstoneConnect.Controllers
{
    [ApiController]
    [Route("[controller]")]
    [Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme, Roles = "Admin")]
    [Logging]
    public class AdminController : Controller
    {
        private readonly CapstoneConnectContext _context;
        private readonly UserManagementController _userManagement;
        private readonly IMapper _mapper;
        private readonly Admin _BLL;

        public AdminController(CapstoneConnectContext context, UserManagementController userManagement, IMapper mapper, Admin bll)
        {
            _context = context;
            _userManagement = userManagement;
            _mapper = mapper;
            _BLL = bll;
        }


        [HttpGet]
        [Route("FetchProjects")]
        public async Task<IActionResult> FetchProjects()
            {
            try
            {
                List<FypDetails> Fyp_Projects = await _BLL.FetchProjects();

                //if (Fyp_Projects == null)
                //    return NotFound("No unapproved FypGroups found.");

                return Ok(Fyp_Projects);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }


        }

        [HttpPost]
        [Route("AcceptProposal/{projectId}")]
        public async Task<IActionResult> AcceptProposal(int projectId)
        {
            try
            {
                bool result = await _BLL.AcceptProposal(projectId);
                if (result == false)
                    return null;

                return Ok();
            }
            catch (Exception e)
            {
                return BadRequest(e.Message);
            }

        }

        [HttpPost]
        [Route("RejectProposal")]
        public async Task<IActionResult> RejectProposal(FypRegistration RejectFyp)
        {
            try
            {
                bool result = await _BLL.RejectProposal(RejectFyp);
                if (result == false)
                    return new BadRequestObjectResult(new { message = "Choudn't reject registration"});

                return Ok();
            }
            catch (Exception e) {
                return BadRequest(e.Message);
            }

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


        [Route("Calendar/{id}")]
        [HttpGet]
        public async Task<ActionResult<Calendar>> GetCalendar(CalendarView calendar)
        {
            try
            {
                var calendarr = await _BLL.Calendar_By_Id(calendar.Id);

                if (calendar == null)
                    return NotFound();

                return calendarr;
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }

        }


        [Route("SectionCalendar/{section}")]
        [HttpGet]
        public async Task<List<Calendar>> GetSectionCalendar(CalendarView calendar)
        {
            try
            {
                var Section_Calendars = await _BLL.Calendar_By_Section(calendar.Section);

                if (Section_Calendars == null)
                    return null;
                return Section_Calendars;
            }
            catch (Exception ex)
            {
                return null;
            }
        }


        [Route("AddCalendar")]
        // POST: api/Calendar
        [HttpPost]
        public async Task<ActionResult> AddCalendar(Calendar calendar)
        {
            try
            {
                bool result = await _BLL.AddCalendar(calendar);

                if (result)
                    return CreatedAtAction(nameof(GetCalendar), new { id = calendar.Id }, calendar);

                return BadRequest("Event was not added");
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }

        }


        [Route("UpdateCalendar/{id}")]
        [HttpPut]
        public async Task<IActionResult> UpdateCalendar(Calendar UpdatedCalendar)
        {

            bool result = await _BLL.UpdateCalendar(UpdatedCalendar);
            if (!result)
                return BadRequest("Calendar was not updated");

            return Ok(new { message = "Calendar Updated for the Section" });
        }


        [Route("DeleteCalendar/{id}")]
        // DELETE: api/Calendar/5
        [HttpDelete]
        public async Task<IActionResult> DeleteCalendar(int id)
        {
            try
            {
                bool result = await _BLL.DeleteCalendar(id);
                if (result)
                    return Ok(new { message = "Deadline deleted successfuly" });
                return BadRequest("Event was not deleted");
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }


        //Supervisor APIS
        [Route("AddSupervisor")]
        [HttpPost]
        public async Task<IActionResult> AddSupervisor(SupervisorViewModel newSupervisor)
        {
            try
            {
                bool result = await _BLL.AddSupervisor(newSupervisor);

                if (result)
                    return CreatedAtAction(nameof(_userManagement.GetSupervisor), new { id = newSupervisor.Id }, newSupervisor);

                return BadRequest("Supervisor was not added");
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }





        //FOR RANKING SUPERVISOR BY ADMIN, THIS API WILL BE CALLED.
        [Route("UpdateSupervisor/{id}")]
        [HttpPut()]
        public async Task<IActionResult> UpdateSupervisor(SupervisorViewModel updatedSupervisor)
        {
            try
            {
                bool result = await _BLL.UpdateSupervisor(updatedSupervisor);

                if (result)
                    return Ok("Supervisor updated");

                return BadRequest("Supervisor was not updated");
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }


        [Route("DeleteSupervisor/{id}")]
        [HttpDelete()]
        public async Task<IActionResult> DeleteSupervisor(string id)
        {
            try {

                bool result = await _BLL.DeleteSupervisor(id);

                if (result)
                    return Ok(new { message = "Supervisor Deleted" });

                return BadRequest("Supervisor was not deleted");
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }



        [Route("CurrentProjects")]
        [HttpGet]
        public async Task<IActionResult> CurrentProjects()
        {
            try
            {
                List<FypGroup> projects = await _BLL.CurrentProjects();

                if (projects == null) return NotFound();

                return Ok(projects);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }



        //ONGOING PROJECTS APIS
        [Route("CurrentProjectById/{id}")]
        [HttpGet("id")]
        public async Task<IActionResult> CurrentProjectsWithId(int id)
        {
            try
            {
                FypGroup project = await _BLL.CurrentProjectsWithId(id);

                if (project == null) return NotFound();

                return Ok(project);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }



        

        [Route("OngoingProjects")]
        [HttpGet]
        public async Task<IActionResult> OngoingProjects()
        {
            try
            {
                List<Projects> Projects = await _BLL.OngoingProject();

                if (Projects == null) return NotFound();

                return Ok(Projects);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [Route("OngoingProjectsById/{id}")]
        [HttpGet("id")]
        public async Task<IActionResult> OngoingProjects(int id)
        {
            try
            {
                Projects Projects = await _BLL.OngoingProjectById(id);

                if (Projects == null) return NotFound();

                return Ok(Projects);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }


        [HttpPost]
        [Route("AddGuidelines")]
        public async Task<IActionResult> AddGuidelines([FromForm] GuidelinesView newGuid)
        {
            try
            {
                var result = await _BLL.AddGuidelines(newGuid);

                return result;
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpPost]
        [Route("DeleteGuideline/{id}")]
        public async Task<IActionResult> DeleteGuideline(int id)
        {
            try
            {
                var result = await _BLL.DeleteGuideline(id);

                return result== null ? NotFound() : Ok(result);
            }
            catch(Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }


        [HttpPost]
        [Route("UpdateGuideline")]
        public async Task<IActionResult> UpdateGuideline([FromForm] GuidelinesView newGuid)
        {
            try
            {
                var result = await _BLL.UpdateGuideline(newGuid);

                return result == null ? NotFound() : Ok(result);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }
    
        [HttpPost]
        [Route("AddOrUpdateProposalDefence")]
        public async Task<IActionResult> AddOrUpdateProposalDefence([FromBody] ProposalDefence payload)
        {
            try
            {
                if (!ModelState.IsValid)
                {
                    return BadRequest(ModelState);
                }

                var result = await _BLL.AddOrUpdateProposalDefence(payload);

                return result;
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }


       

        [HttpPost]
        [Route("AddOrUpdateMidEvaluation")]
        public async Task<IActionResult> AddOrUpdateMidEvaluation([FromBody] Evaluations payload)
        {
            try
            {
                if (!ModelState.IsValid)
                {
                    return BadRequest(ModelState);
                }

                var result = await _BLL.AddOrUpdateMidEvaluation(payload);

                return result;
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }




        //Final Evaluation APIS
        [HttpGet]
        [Route("FetchFinalEvaluation/{FypId}")]
        public async Task<IActionResult> FetchFinalEvaluation(int FypId)
        {
            try
            {
                var result = await _BLL.FetchFinalEvaluation(FypId);

                return Ok(result);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }


        [HttpPost]
        [Route("AddOrUpdateFinalEvaluation")]
        public async Task<IActionResult> AddOrUpdateFinalEvaluation([FromBody] Evaluations payload)
        {
            try
            {
                if (!ModelState.IsValid)
                {
                    return BadRequest(ModelState);
                }

                var result = await _BLL.AddOrUpdateFinalEvaluation(payload);

                return result;
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }


        [HttpGet]
        [Route("GetAdminProfile/{AdminId}")]
        public async Task<IActionResult> GetAdminProfile(string AdminId)
        {
            return await _BLL.GetAdminProfile(AdminId);
        }

        [HttpGet]
        [Route("GetAllQueries")]
        public async Task<IActionResult> GetAllQueries()
        {
            return await _BLL.GetAllQueries();
        }

        [HttpPost]
        [Route("EmailEvaluationResults")]
        public async Task<IActionResult> EmailEvaluationResults([FromForm] EmailResults results)
        {
            return await _BLL.EmailEvaluationResults(results);
        }
    }
}

