using Microsoft.AspNetCore.SignalR;
using System.Collections.Concurrent;

namespace CapstoneConnectCommunication.Hubs
{
    public class ChatHub : Hub
    {
        private static ConcurrentDictionary<string, string> userConnections =
           new ConcurrentDictionary<string, string>();

        public override async Task OnConnectedAsync()
        {
            var userId = Context?.GetHttpContext()?.Request?.Query["userId"];
            if (!string.IsNullOrEmpty(userId))
            {
                var groupsQuery = Context?.GetHttpContext()?.Request?.Query["groups"];
                if (!string.IsNullOrEmpty(groupsQuery))
                {
                    var groups = groupsQuery.ToString().Split(',');

                    foreach (var group in groups)
                    {
                        await Groups.AddToGroupAsync(Context?.ConnectionId, group);
                    }
                }

                userConnections[userId] = Context?.ConnectionId;
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

        public async Task SendMessage(int conversationId, int senderId, string messageContent)
        {
            await Clients.Group(conversationId.ToString()).SendAsync("ReceiveMessage", senderId, messageContent);
        }

        public async Task JoinRoom(int conversationId)
        {
            await Groups.AddToGroupAsync(Context.ConnectionId, conversationId.ToString());
        }

        public async Task LeaveRoom(int conversationId)
        {
            await Groups.RemoveFromGroupAsync(Context.ConnectionId, conversationId.ToString());
        }

        public static string GetConnectionId(string userId)
        {
            userConnections.TryGetValue(userId, out var connectionId);
            return connectionId;
        }

    }
}
