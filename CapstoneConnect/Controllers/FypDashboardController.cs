using CapstoneConnect.BLL;
using CapstoneConnectDatabase.Models;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using CapstoneConnect.Attributes;

namespace CapstoneConnect.Controllers
{
    [ApiController]
    [Route("[controller]")]
    [Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme, Roles = "Admin,Supervisor,FypGroup")]
    [Logging]
    public class FypDashboardController : Controller
    {
        private readonly CapstoneConnectContext _context;
        private readonly FypDashboard _BLL;
        
        public FypDashboardController(CapstoneConnectContext context, FypDashboard bLL)
        {
            _context = context;
            _BLL = bLL;
        }


        [HttpGet]
        [Route("GetNamesMembers/{FypId}")]
        public async Task<IActionResult> GetNamesMembers(int FypId)
        {
            return await _BLL.GetNamesMembers(FypId);
        }


        [HttpGet]
        [Route("DashboardData/{FypId}")]
        public async Task<IActionResult> DashboardData(int FypId)
        {
            return await _BLL.DashboardData(FypId);
        }

        [HttpPost]
        [Route("AddWorkItem")]
        public async Task<IActionResult> AddWorkItem(WorkItem workItem)
        {
            return await _BLL.AddWorkItem(workItem);
        }

        [HttpGet]
        [Route("GetWorkItemByFypId/{Fypid}")]
        public async Task<IActionResult> GetWorkItemByFypId(int Fypid)
        {
            return await _BLL.GetWorkItemByFypId(Fypid);
        }

        [HttpGet]
        [Route("GetWorkItemById/{Id}")]
        public async Task<IActionResult> GetWorkItemById(int Id)
        {
            return await _BLL.GetWorkItemById(Id);
        }

        [HttpPost]
        [Route("UpdateWorkItem")]
        public async Task<IActionResult> UpdateWorkItem(WorkItem UpdatedWorkItem)
        {
            return await _BLL.UpdateWorkItem(UpdatedWorkItem);
        }

        [HttpPost]
        [Route("DeleteWorkItem/{Id}")]
        public async Task<IActionResult> DeleteWorkItem(int id)
        {
            return await _BLL.DeleteWorkItem(id);
        }
    }
}
