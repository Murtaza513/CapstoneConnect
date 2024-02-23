using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using CapstoneConnect.Models;

namespace CapstoneConnect.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class AccountController : ControllerBase
    {
        [HttpPost]
        [Route("Login")]
        public IActionResult Login(LoginModel model)
        {
            
            if (!ModelState.IsValid)
            {
                return BadRequest("Invalid model");
            }
            var user = new UserModel { Username = model.Username, Email = "user@example.com" };
            
            var token = "your_generated_token_here";

            return Ok(new { user, token });
        }
    }
}
