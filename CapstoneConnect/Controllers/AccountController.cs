using CapstoneConnect.ViewModels;
using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;
using CapstoneConnectDatabase.Models;
using CapstoneConnect.Services;
using CapstoneConnect.Attributes;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Authorization;

namespace CapstoneConnect.Controllers
{
    [ApiController]
    [Route("[controller]")]
    [Logging]
    //[Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme, Roles = "Admin,FypGroup,Supervisor")]
    public class AccountController : ControllerBase
    {
        private readonly Account _BLL;

        public AccountController(Account bll)
        {
            _BLL = bll;
        }

        [HttpPost]
        [Route("Login")]
        [AllowAnonymous]
        public async Task<IActionResult> Login(LoginViewModel model)
        {
            return await _BLL.Login(model);
        }

        [HttpPost]
        [AllowAnonymous]
        [Route("Email")]
        public async Task<IActionResult> StudentEmail(GetId model)
        {
            return await _BLL.StudentEmail(model);
        }

        [HttpPost]
        [Route("VerifyTeamLead")]
        [AllowAnonymous]
        public async Task<IActionResult> VerifyTeamLead(TeamLeadVerificationModel model)
        {
            try
            {
                IActionResult response = await _BLL.VerifyTeamLead(model);
                if (response is BadRequestObjectResult badRequestResult)
                {
                    return BadRequest(badRequestResult.Value);
                }
                else if (response is NotFoundObjectResult notFoundResult)
                {
                    return NotFound(notFoundResult.Value);
                }
                else if (response is OkObjectResult okResult)
                {
                    return Ok(okResult.Value);
                }
                else
                {
                    return StatusCode(500, new { message = "An unexpected error occurred" });
                }
            }
            catch (Exception ex)
            {
                return new BadRequestObjectResult(new { message = "An error occurred during registration", error = ex.Message });
            }
        }

        [HttpPost]
        [AllowAnonymous]
        [Route("VerifyTeamMember/{memberId}")]
        public async Task<IActionResult> VerifyTeamMember(string memberId)
        {
            try
            {
                var response = await _BLL.VerifyTeamMember(memberId);
                if (response is BadRequestObjectResult badRequestResult)
                {
                    return BadRequest(badRequestResult.Value);
                }
                else if (response is NotFoundObjectResult notFoundResult)
                {
                    return NotFound(notFoundResult.Value);
                }
                else if (response is OkObjectResult okResult)
                {
                    return Ok(okResult.Value);
                }
                else
                {
                    return StatusCode(500, new { message = "An unexpected error occurred" });
                }
            }
            catch (Exception ex)
            {
                return new BadRequestObjectResult(new { message = "An error occurred during registration", error = ex.Message });
            }
        }
        [HttpPost("Verify")]
        [AllowAnonymous]
        public async Task<IActionResult> Verify(MailVerify request)
        {
            return await _BLL.VerifyOtp(request);
        }

        [HttpPost("RegisterFYP")]
        [AllowAnonymous]
        public async Task<IActionResult> RegisterFYP([FromBody] FypRegistration fyp)
        {
            return await _BLL.RegisterFYP(fyp);
        }


        [HttpPost("VerifyStudent")]
        public async Task<IActionResult> VerifyStudent(VerificationViewModel model)
        {
            return await _BLL.Verify_Student(model);
        }

        [HttpPost("ChangePassword")]
        public async Task<IActionResult> ChangePassword(PasswordChange payload)
        {
            return await _BLL.ChangePassword(payload);
        }

    }
}
