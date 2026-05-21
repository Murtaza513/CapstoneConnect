using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;

namespace CapstoneConnectDatabase.Models
{
    public class UserAuthenticationContext : IdentityDbContext
    {
       
    
        private readonly DbContextOptions? _options;
        public UserAuthenticationContext()
        {

        }

        public UserAuthenticationContext(DbContextOptions<UserAuthenticationContext> options)
            : base(options)
        {
            _options = options;
        }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);
        }
    }
}
