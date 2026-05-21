using CapstoneConnectCommunication.Hubs;
using CapstoneConnectDatabase.Models;
using Microsoft.AspNetCore.SignalR;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks; 
using Microsoft.AspNetCore.Identity;

namespace CapstoneConnectCommunication.BLL
{
    public class NotificationBLL
    {

        private readonly CapstoneConnectContext _context;
        private readonly IHubContext<NotificationsHub> _hubContext;
        private readonly UserManager<IdentityUser> _userManager;
        private readonly SignInManager<IdentityUser> _signInManager;

        public enum NotificationType
        {
            Individual = 1,
            All = 2,
            FypGroup = 3,
            Supervisor = 4,
            Admin
        }

        public NotificationBLL(CapstoneConnectContext context, IHubContext<NotificationsHub> hubContext,
            UserManager<IdentityUser> userManager,
                   SignInManager<IdentityUser> signInManager
            )
        {
            _context = context;
            _hubContext = hubContext;
            _userManager = userManager;
            _signInManager = signInManager;
        }

        public async Task<IEnumerable<Notification>> GetNotifications()
        {
            return await _context.Notifications.ToListAsync();
        }

        public async Task<IEnumerable<Notification>> GetNotificationsByRole(string role)
        {
            return await _context.Notifications
                                 .Where(n => n.Role == role || n.Role == "Both")
                                 .OrderByDescending(n => n.Id).ToListAsync();
        }

        public async Task<List<Notification>> FetchNotifications(string userId)
        {
            if (string.IsNullOrEmpty(userId))
                throw new ArgumentNullException(nameof(userId), "UserId cannot be null or empty.");

            var notifications = await _context.Notifications
                                              .Where(x => x.UserId.Equals(userId)).
                                              OrderByDescending(y=>y.Id)
                                              .ToListAsync();

            return notifications;
        }



        public async Task<Notification> CreateNotification(Notification notification)
        {
            if (notification.NotificationType == (int)NotificationType.Individual && notification.UserId != null)
            {
                await HandleIndividualNotification(notification);
            }
            else if (notification.NotificationType == (int)NotificationType.All)
            {
                await HandleGroupNotification(notification, "FypGroup");
                await HandleGroupNotification(notification, "Supervisor");
                await _hubContext.Clients.All.SendAsync("ReceiveNotification", notification);
            }
            else if (notification.NotificationType == (int)NotificationType.FypGroup)
            {
                await HandleGroupNotification(notification, "FypGroup");
            }
            else if (notification.NotificationType == (int)NotificationType.Supervisor)
            {
                await HandleGroupNotification(notification, "Supervisor");
            }
            else
            {
                throw new InvalidOperationException("Unsupported notification type.");
            }

            return notification;
        }

        private async Task HandleIndividualNotification(Notification notification)
        {
            string connectionId = "";
            if (notification.UserId != null)
            {
                connectionId = NotificationsHub.GetConnectionId(notification.UserId);
            }

            _context.Notifications.Add(notification);
            await _context.SaveChangesAsync();

            if (!string.IsNullOrEmpty(connectionId))
            {
                await _hubContext.Clients.Client(connectionId).SendAsync("ReceiveNotification", notification);
            }
        }

        private async Task HandleGroupNotification(Notification notification, string role)
        {
            var usersInRole = await _userManager.GetUsersInRoleAsync(role);
            var userIds = usersInRole.Select(u => u.Id).ToList(); 

            foreach (var userId in userIds)
            {
                var clonedNotification = new Notification
                {
                    Title = notification.Title,
                    Details = notification.Details,
                    Role = role,
                    NotificationType = notification.NotificationType,
                    UserId = userId,
                    IsRead = notification.IsRead
                };
                _context.Notifications.Add(clonedNotification);
                var userConnectionId = NotificationsHub.GetConnectionId(userId);
                if (!string.IsNullOrEmpty(userConnectionId))
                {
                    await _hubContext.Clients.Client(userConnectionId).SendAsync("ReceiveNotification", clonedNotification);
                }
            }

            await _context.SaveChangesAsync();
        }

        public async Task MarkNotificationsAsRead(List<int> notificationIds)
        {
            if (notificationIds == null || notificationIds.Count == 0)
                throw new ArgumentException("Notification IDs cannot be null or empty.");

            var notifications = await _context.Notifications
                .Where(n => notificationIds.Contains(n.Id))
                .ToListAsync();

            foreach (var notification in notifications)
            {
                notification.IsRead = true;
            }

            await _context.SaveChangesAsync();
        }

    }

}
