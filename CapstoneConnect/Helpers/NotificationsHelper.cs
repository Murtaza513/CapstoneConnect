using CapstoneConnectDatabase.Models;
using Newtonsoft.Json;
using System.Text;
using CapstoneConnectLog;

namespace CapstoneConnect.Helpers
{
    public class NotificationsHelper
    {
        public enum NotificationType
        {
            Individual = 1,
            All = 2,
            FypGroup = 3,
            Supervisor = 4,
            Admin = 5
        }

        private readonly IHttpClientFactory _clientFactory;
        private readonly CapstoneConnectContext _context;
        private readonly string _communicationApiUrl;
        private readonly CommonExceptionLogger _logger;

        public NotificationsHelper(IHttpClientFactory clientFactory, CapstoneConnectContext context, 
            IConfiguration configuration, CommonExceptionLogger logger)
        {
            _clientFactory = clientFactory;
            _context = context;
            _communicationApiUrl = configuration["CommunicationApiUrl"] ?? "";
            _logger = logger;
        }

        public Notification CreateNotification(string title, string details, string userId, NotificationType notificationType, string role)
        {
            return new Notification
            {
                Title = title,
                Details = details,
                UserId = userId,
                NotificationType = (int)notificationType,
                Role = role,
                IsRead = false
            };
        }

        public async Task SendNotification(Notification notification)
        {
            await ExecuteRequest(notification);
        }

        public async Task SendNotifications(List<Notification> notifications)
        {
            foreach(var notification in notifications)
            {
                await ExecuteRequest(notification);
            }
        }

        private async Task ExecuteRequest(Notification notification)
        {
            try
            {
                var client = _clientFactory.CreateClient();
                var content = new StringContent(JsonConvert.SerializeObject(notification),
                    Encoding.UTF8, "application/json");

                var response = await client.PostAsync($"{_communicationApiUrl}/notifications/SendNotification/", content);
                if (response.IsSuccessStatusCode)
                {
                    string jsonResponse = await response.Content.ReadAsStringAsync();
                    JsonConvert.DeserializeObject<Notification>(jsonResponse);
                }
                else
                {
                    throw new Exception($"Failed to create notification. Status code: {response.StatusCode}");
                }
            }
            catch(Exception ex)
            {
                _logger.Error(ex, "Exception while accessing notification api");
            }
           
        }
    }
}
