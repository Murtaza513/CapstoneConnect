using CapstoneConnectCommunication.BLL;
using CapstoneConnectCommunication.Hubs;
using CapstoneConnectDatabase.Models;
using CapstoneConnectLog;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Newtonsoft.Json;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddSignalR();
builder.Services.AddScoped<NotificationBLL>();
builder.Services.AddScoped<ChatBLL>();
builder.Services.AddScoped<CommonExceptionLogger>();

//builder.Services.AddIdentity<IdentityUser, IdentityRole>()
//    .AddEntityFrameworkStores<CapstoneConnectContext>()
//    .AddDefaultTokenProviders();


builder.Services.AddDbContext<UserAuthenticationContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")));

builder.Services.AddScoped<UserManager<IdentityUser>>();

builder.Services.AddIdentity<IdentityUser, IdentityRole>()
    .AddEntityFrameworkStores<UserAuthenticationContext>()
    .AddDefaultTokenProviders();

builder.Services.AddDbContext<CapstoneConnectContext>(options =>
options.UseSqlServer(
            builder.Configuration.GetConnectionString("DefaultConnection")));


builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
//builder.Services.AddSwaggerGen();

//builder.Services.AddCors(c =>
//{
//    c.AddPolicy("AllowOrigin", options => options.AllowAnyOrigin());
//});

//builder.Services.AddCors(options =>
//{
//    options.AddPolicy("AllowAll",
//        builder => builder
//            .AllowAnyOrigin()
//            .AllowAnyMethod()
//            .AllowAnyHeader()
//            .AllowCredentials());
//});

builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowSpecificOrigin", builder =>
    {
        builder.WithOrigins("https://capstoneconnectportal.azurewebsites.net")
               .AllowAnyMethod()
               .AllowAnyHeader()
               .AllowCredentials();
    });
});

var app = builder.Build();

app.UseCors("AllowSpecificOrigin");

//app.UseCors("AllowAll");


//if (app.Environment.IsDevelopment())
//{
//app.UseSwagger();
//app.UseSwaggerUI();
//}


app.UseHttpsRedirection();

app.UseRouting();



app.UseAuthorization();
app.UseAuthentication();

app.UseEndpoints(endpoints =>
{
    endpoints.MapControllers();
    endpoints.MapHub<NotificationsHub>("CapstoneConnectNotifications");
    endpoints.MapHub<ChatHub>("CapstoneConnectChat");
});

app.MapControllers();

app.Run();
