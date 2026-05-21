using CapstoneConnect.Helpers;
using CapstoneConnectDatabase.Models;
using CapstoneConnect.Services;
using CapstoneConnect.Settings;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi.Models;
using System;
using System.Text;
using CapstoneConnect.Authentication.JwtManager;
using Microsoft.AspNetCore.Hosting;
using AutoMapper;
using CapstoneConnect.Controllers;
using CapstoneConnect.BLL;
using DocumentFormat.OpenXml.Office2016.Drawing.ChartDrawing;
using CapstoneConnectLog;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.



builder.Services.AddCustomJwtAuthentication();

builder.Services.AddDbContext<UserAuthenticationContext>(options =>
options.UseSqlServer(
            builder.Configuration.GetConnectionString("DefaultConnection")));

builder.Services.AddDbContext<CapstoneConnectContext>(options =>
options.UseSqlServer(
            builder.Configuration.GetConnectionString("DefaultConnection")));

builder.Services.AddIdentity<IdentityUser, IdentityRole>(options =>
{
    options.Password.RequireDigit = false;
    options.Password.RequireLowercase = false;
    options.Password.RequireUppercase = false;
    options.Password.RequireNonAlphanumeric = false;
    options.Password.RequiredLength = 1; 
}).
    AddEntityFrameworkStores<UserAuthenticationContext>();

builder.Services.Configure<IdentityOptions>(
    opts => opts.SignIn.RequireConfirmedEmail = false);


var connectionString = builder.Configuration.GetConnectionString("DefaultConnection") 
    ?? throw new InvalidOperationException("Connection string 'SQLServerIdentityConnection' not found.");

builder.Services.AddDbContext<CapstoneConnectContext>(options =>
    options.UseSqlServer(connectionString));

builder.Services.AddControllers().AddNewtonsoftJson(options =>
    options.SerializerSettings.ReferenceLoopHandling = Newtonsoft.Json.ReferenceLoopHandling.Ignore
);

builder.Services.AddAuthorization(options =>
{
    options.AddPolicy("Admin", policy => policy.RequireRole("Admin"));
    options.AddPolicy("Student", policy => policy.RequireRole("Student"));
    options.AddPolicy("Supervisor", policy => policy.RequireRole("Supervisor"));
    options.AddPolicy("FypGroup", policy => policy.RequireRole("FypGroup"));

});

builder.Services.AddAutoMapper(typeof(Program));
builder.Services.AddTransient<APIHelper>();
builder.Services.AddTransient<MailService>();
builder.Services.AddScoped<UserManagementController>();
builder.Services.AddScoped<Admin>();
builder.Services.AddScoped<FypDashboard>();
builder.Services.AddScoped<Supervisorr>();
builder.Services.AddScoped<Account>();
builder.Services.AddScoped<FileReader>();
builder.Services.AddScoped<NotificationsHelper>();
builder.Services.AddScoped<CapstoneConnect.BLL.UserManagement>();
builder.Services.AddScoped<NotificationsHelper>();
builder.Services.AddScoped<ChatHelper>();
builder.Services.AddScoped<CapstoneConnect.BLL.Student>();
builder.Services.AddScoped<CommonExceptionLogger>();
builder.Services.AddSingleton<IConfiguration>(builder.Configuration);
// Configure session options

// Add MVC services
builder.Services.AddMvc();

builder.Services.AddHttpClient();

builder.Services.AddControllers();

builder.Services.AddSwaggerGen(c =>
{
    c.SwaggerDoc("v1", new OpenApiInfo { Title = "MailVerification", Version = "v1" });
});
builder.Services.AddCors(c =>
{
    c.AddPolicy("AllowOrigin", options => options.AllowAnyOrigin());
});



builder.Services.AddControllersWithViews(); // Add MVC services

builder.Services.AddSingleton<IHttpContextAccessor, HttpContextAccessor>();
builder.Services.AddDistributedMemoryCache();


//CODE TO BE REMOVED AFTER SHIFTING ACCOUNTCONTROLLER TO BLL
builder.Services.AddScoped<AccountController>();

//CODE TO BE REMOVED AFTER SHIFTING ACCOUNTCONTROLLER TO BLL
builder.Services.AddScoped<Admin>();

builder.Services.AddSession(options =>
{
    options.IdleTimeout = TimeSpan.FromMinutes(10);
    options.Cookie.HttpOnly = false;
    options.Cookie.SameSite = SameSiteMode.None;
    options.Cookie.SecurePolicy = CookieSecurePolicy.SameAsRequest;
    options.Cookie.IsEssential = true;
    
    options.Cookie.Name = "CCCookie";

    options.Cookie.SecurePolicy = CookieSecurePolicy.None;


    options.Cookie.IsEssential = true;
    options.Cookie.SecurePolicy = CookieSecurePolicy.Always;
});
builder.Services.Configure<CookiePolicyOptions>(options =>
{
    
    options.CheckConsentNeeded = context => false; 
    options.MinimumSameSitePolicy = SameSiteMode.None;
});



var app = builder.Build();


using (var scope = app.Services.CreateScope())
{
    var roleManager = scope.ServiceProvider.GetRequiredService<RoleManager<IdentityRole>>();
    var roles = new[] { "Admin", "Student", "Supervisor", "FypGroup" };

    foreach (var role in roles)
    {
        if (!await roleManager.RoleExistsAsync(role))
        {
            await roleManager.CreateAsync(new IdentityRole(role));
        }
    }
}


if (!app.Environment.IsDevelopment())
{
    
    app.UseHsts();
    app.UseDeveloperExceptionPage();
    app.UseSwagger();
    app.UseSwaggerUI(c => c.SwaggerEndpoint("/swagger/v1/swagger.json", "MailVerification v1"));
}

app.UseSession();
app.UseHttpsRedirection();
app.UseStaticFiles();
app.UseCors(options =>
        options.WithOrigins("https://localhost:44431")
            .AllowAnyHeader()
            .AllowAnyMethod()
            .AllowCredentials()
            );
app.UseCors(options =>
        options.WithOrigins("https://localhost:7266")
            .AllowAnyHeader()
            .AllowAnyMethod()
            .AllowCredentials()
            );


app.UseAuthentication();
app.UseRouting();
app.UseAuthorization();

app.MapControllerRoute(
    name: "default",
    pattern: "{controller}/{action=Index}/{id?}");

app.MapFallbackToFile("index.html"); ;

app.Run();
