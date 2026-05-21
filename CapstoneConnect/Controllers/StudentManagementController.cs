//using CapstoneConnect.Models;
using CapstoneConnectDatabase.Models;
using CapstoneConnect.ViewModels;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Infrastructure.Internal;
using Microsoft.AspNetCore.StaticFiles;
using Newtonsoft.Json;
using System.Text.RegularExpressions;
using CapstoneConnect.BLL;
using Student = CapstoneConnect.BLL.Student;
using System.Text;
using CapstoneConnect.Helpers;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Authorization;
using CapstoneConnect.Attributes;

namespace CapstoneConnect.Controllers
{
    [ApiController]
    [Route("[controller]")]
    [Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme, Roles = "FypGroup")]
    [Logging]
    public class StudentManagementController : Controller
    {

        private readonly CapstoneConnectContext _context;
        private readonly Student _BLL;

        public StudentManagementController(CapstoneConnectContext context, Student bLL)
        {
            _context = context;
            _BLL = bLL;
        }


        [HttpGet]
        [Route("Description/{FypId}")]
        public async Task<IActionResult> Description(int FypId)
        {
            try
            {
                var Description = await _BLL.Description(FypId);

                if (Description == null)
                    return NotFound("No Description found");

                return Ok(Description);
            }
            catch(Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpPost]
        [Route("UpdateDescription")]
        public async Task<IActionResult> UpdateDescription(FypDescription Desc)
        {
            try
            {
                var Description = await _BLL.UpdateDescription(Desc);

                if (Description == false)
                    return NotFound("No Description found");

                return Ok(Description);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpGet]
        [Route("AvailableSupervisor")]
        public async Task<IActionResult> AvailableSupervisor()
        {
            try
            {
                var result = await _BLL.AvailableSupervisor();

                if (result == null)
                    return NotFound("No Supervisor Available");

                return Ok(result);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpGet]
        [Route("EligibleSubmissions/{FypId}")]
        public async Task<IActionResult> EligibleSubmissions(int FypId)
        {
            try
            {
                var result = await _BLL.Eligible_Submissions(FypId);

                if (result == null)
                    return NotFound("No Submission found");

                return Ok(result);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }

        }

        


        [HttpPost]
        [Route("UploadDocument")]
        public async Task<IActionResult> UploadDocument([FromForm] DocumentUpload documentUpload)
        {
            try
            {
                return await _BLL.UploadDocument(documentUpload);
            }
            catch(Exception ex) 
            {
                return BadRequest(ex.Message);
            }
        }
             
        [HttpGet]
        [Route("FetchSimilarProjects/{submissionId}")]
        public async Task<IActionResult> FetchSimilarProjects(int submissionId)
        {
            SimilarProject similarProject = new SimilarProject();
            if(submissionId != 0)
            {
                similarProject = await _BLL.GetSimilarProjects(submissionId);
            }
            return Ok(similarProject);
        }


        [HttpPost]
        [Route("AddMeetingMinutes")]
        public async Task<IActionResult> AddMeetingMinutes(Meeting meet)
        {
            return await _BLL.Add_MOM(meet);
        }

        [HttpPost]
        [Route("UpdateMeetingMinutes")]
        public async Task<IActionResult> UpdateMeetingMinutes(Meeting meet)
        {
            return await _BLL.Update_MOM(meet);
        }

        [HttpPost]
        [Route("DeleteMeetingMinutes/{Id}")]
        public async Task<IActionResult> DeleteMeetingMinutes(int Id)
        {
            return await _BLL.Delete_MOM(Id);
        }


        [HttpGet]
        [Route("ViewQueries/{FypId}")]
        public async Task<IActionResult> ViewQueries(int FypId)
        {
            return await _BLL.ViewQueries(FypId);
        }

        [HttpPost]
        [Route("AddQuery")]
        public async Task<IActionResult> AddQuery(Query query)
        {
            return await _BLL.Add_Query(query);
        }        

        [HttpDelete]
        [Route("DeleteQuery/{Id}")]
        public async Task<IActionResult> DeleteQuery(int Id)
        {
            return await _BLL.DeleteQuery(Id);
        }


        [HttpGet]
        [Route("GetFYPProfile/{FypId}")]
        public async Task<IActionResult> GetFYPProfile(int FypId)
        {
            return await _BLL.GetFYPProfile(FypId);
        }
    }
}
