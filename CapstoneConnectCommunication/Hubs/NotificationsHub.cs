using Microsoft.AspNetCore.SignalR;
using System.Collections.Concurrent;
using System.Threading.Tasks;

namespace CapstoneConnectCommunication.Hubs
{
    public class NotificationsHub : Hub
    {
        private static ConcurrentDictionary<string, string> userConnections = 
            new ConcurrentDictionary<string, string>();

        public override async Task OnConnectedAsync()
        {
            var userId = Context?.GetHttpContext()?.Request?.Query["userId"];
            if (!string.IsNullOrEmpty(userId))
            {
                var groupName = Context?.GetHttpContext()?.Request?.Query["group"];

                if (!string.IsNullOrEmpty(groupName))
                {
                    await Groups.AddToGroupAsync(Context.ConnectionId, groupName);
                }
                
                 userConnections[userId] = Context.ConnectionId;
                
            }
            await base.OnConnectedAsync();
        }


        public override async Task OnDisconnectedAsync(Exception exception)
        {
            var userId = Context?.GetHttpContext()?.Request.Query["userId"];
            if (!string.IsNullOrEmpty(userId))
            {
                userConnections.TryRemove(userId, out _);
            }
            await base.OnDisconnectedAsync(exception);
        }

        public static string GetConnectionId(string userId)
        {
            userConnections.TryGetValue(userId, out var connectionId);
            return connectionId;
        }
    }
}
