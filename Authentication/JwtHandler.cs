using Microsoft.AspNetCore.DataProtection.KeyManagement;
using Microsoft.IdentityModel.Tokens;
using Microsoft.VisualBasic;
using System;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using System.Linq;
using System.Security.Claims;
using System.Text;
using System.Threading.Tasks;

namespace CapstoneConnect.Authentication.JwtManager
{
    public enum UserRole
    {
        Student,
        Admin,
        Supervisor,
        FypGroup
    }
    public class JwtHandler
    {
        public string GenerateJwtToken(string username, UserRole role, string Id)
        {
            string tokenToReturn;

            try
            {
                var securityKey = new SymmetricSecurityKey(Encoding.ASCII.GetBytes("CapstoneConnectSecureKeyCapstoneConnectSecureKey"));
                var signingCredentials = new SigningCredentials(securityKey, SecurityAlgorithms.HmacSha256);

                var claims = new[]
                {
                     new Claim(ClaimTypes.NameIdentifier,Id),
                     new Claim(ClaimTypes.Name, username),
                     new Claim(ClaimTypes.Role, role.ToString()) 
                };

                var jwtSecurityToken = new JwtSecurityToken(
                    issuer: "jwtIssuer",
                    audience: "jwtIssuer",
                    claims,
                    DateTime.UtcNow,
                    DateTime.UtcNow.AddMinutes(90),
                    signingCredentials

                    );

                tokenToReturn = new JwtSecurityTokenHandler()
                    .WriteToken(jwtSecurityToken);
            }
            catch (Exception)
            {
                throw;
            }
            return tokenToReturn;
        }
    }
}
