using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using CapstoneConnectDatabase.Models;
using CapstoneConnectCommunication.BLL;
using System.Collections.Generic;
using System.Threading.Tasks;
using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.EntityFrameworkCore;
using CapstoneConnectLog.Attributes;

namespace CapstoneConnectCommunication.Controllers
{
    [Route("[controller]")]
    [ApiController]
    [Logging]
    public class NotificationsController : ControllerBase
    {
        private readonly NotificationBLL _notificationBLL;

        public NotificationsController(NotificationBLL notificationBLL)
        {
            _notificationBLL = notificationBLL;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<Notification>>> GetNotifications()
        {

            try
            {
                //throw new Exception("This is a test exception");
                var notifications = await _notificationBLL.GetNotifications();
                return Ok(notifications);

            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, "An error occured while fetching notifications.");
            }
        }

        [HttpGet("{role}")]
        public async Task<ActionResult<IEnumerable<Notification>>> GetNotificationsByRole(string role)
        {
            try
            {
                var notifications = await _notificationBLL.GetNotificationsByRole(role);
                return Ok(notifications);
            }
            catch(Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, "An error occured while fetching notifications.");
            }
        }

        [HttpPost("SendNotification")]
        public async Task<ActionResult<Notification>> SendNotification([FromBody] Notification notification)
        {
            try
            {
                var createdNotification = await _notificationBLL.CreateNotification(notification);
                return CreatedAtAction(nameof(GetNotificationsByRole), new { role = notification.Role }, createdNotification);
            }
            catch(Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, "An error occured while sending notification");
            }
        }

        [HttpGet("FetchNotifications/{userId}")]

        public async Task<ActionResult<List<Notification>>> FetchNotifications(string userId)
        {
            if (string.IsNullOrEmpty(userId))
                return BadRequest("UserId cannot be null or empty.");

            try
            {
                var notifications = await _notificationBLL.FetchNotifications(userId);

                if (notifications == null || notifications.Count == 0)
                    return Ok(new List<Notification>());

                return Ok(notifications);
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, "An error occurred while fetching notifications.");
            }

        }


        [HttpPost("MarkAsRead")]
        public async Task<ActionResult> MarkAsRead([FromBody] List<int> notificationIds)
        {
            if (notificationIds == null || notificationIds.Count == 0)
                return BadRequest("Notification IDs cannot be null or empty.");

            try
            {
                await _notificationBLL.MarkNotificationsAsRead(notificationIds);
                return Ok();
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, "An error occurred while marking notifications as read.");
            }
        }

    }
}
