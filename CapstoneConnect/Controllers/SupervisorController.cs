using CapstoneConnect.ViewModels;
using System.Collections.Generic;
using CapstoneConnectDatabase.Models;
using Microsoft.AspNetCore.Mvc;
using SupervisorBLL = CapstoneConnect.BLL.Supervisorr;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Authorization;
using CapstoneConnect.Attributes;

namespace CapstoneConnect.Controllers
{
    [ApiController]
    [Route("[controller]")]
    [Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme, Roles = "Supervisor")]
    [Logging]
    public class SupervisorController : Controller
    {
        private readonly CapstoneConnectContext _context;
        private readonly SupervisorBLL _BLL;

        public SupervisorController(CapstoneConnectContext context, SupervisorBLL bLL)
        {
            _context = context;
            _BLL = bLL;
        }



        [HttpPost]
        [Route("FetchProposal")]
        public async Task<IActionResult> FetchProposal(SupervisorPayload Payload)
        {
            try
            {
                List<ProposalViewSupervisor> Proposals = await _BLL.FetchProposal(Payload);

                if (Proposals == null)
                    return NotFound("No proposal are submitted");

                return Ok(Proposals);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpGet]
        [Route("DownloadFile/{SubmissionId}")]
        public async Task<IActionResult> DownloadProposalAsync(int submissionid)
        {
            try
            {
                var fileContent = await _BLL.DownloadFile(submissionid);
                return File(fileContent, "application/octet-stream");
            }
            catch (FileNotFoundException)
            {
                return NotFound(); // Return 404 Not Found if the file does not exist
            }
        }

        [HttpPost]
        [Route("AcceptProposal")]
        public async Task<IActionResult> AcceptProposal(SupervisorPayload Payload)
        {
            try
            {
                return await _BLL.AcceptProposal(Payload);

                //if (!result)
                //    return NotFound("No such proposal");
                //return Ok(result);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }


        [HttpPost]
        [Route("RejectProposal")]
        public async Task<IActionResult> RejectProposal(SupervisorPayload Payload)
        {
            try
            {
                var result = await _BLL.RejectProposal(Payload);

                if (!result)
                    return NotFound("No such proposal");
                return Ok(result);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }


        [HttpPost]
        [Route("AddOrUpdateFeedback")]
        public async Task<IActionResult> AddOrUpdateFeedback(SupervisorPayload Payload)
        {
            try
            {
                return await _BLL.AddOrUpdateFeedbackAsync(Payload);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }


        [HttpGet]
        [Route("SupervisorProjects/{supervisorId}")]
        public async Task<IActionResult> GetFypGroups(string supervisorId)
        {
            try
            {

                var result = await _BLL.GetFypGroups(supervisorId);

                return result;
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpPost]
        [Route("MarkProjectComplete/{FypId}")]
        public async Task<IActionResult> MarkProjectComplete(int fypid)
        {
            try
            {
                var result = await _BLL.MarkAsComplete(fypid);

                return Ok(result);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpPost]
        [Route("MOMFeedback")]
        public async Task<IActionResult> MOMFeedback(Meeting Feedback)
        {
            try
            {
                return await _BLL.MOM_Feedback(Feedback);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpGet]
        [Route("GetSupervisorProfile/{SupId}")]
        public async Task<IActionResult> GetSupervisorProfile(string SupID)
        {
            return await _BLL.GetSupervisorProfile(SupID);
        }
    }
}