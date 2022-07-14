using Microsoft.AspNetCore.SignalR;
using server.Hubs.HubServices;
using server.Hubs.Models;

namespace server.Hubs
{
    public class ChatHub : Hub
    {
        private readonly string _botUser;
        private readonly ChatConnectionsRepository _connections;

        public ChatHub(ChatConnectionsRepository connections)
        {
            _connections = connections;
            _botUser = "ChatBot";
        }

        public async Task JoinRoom(UserConnection userConnection)
        {
            await Groups.AddToGroupAsync(Context.ConnectionId, userConnection.Room);

            _connections.Add(Context.ConnectionId, userConnection);

            await SendConnectedUsers(userConnection.Room);
            await Clients.Group(userConnection.Room).SendAsync("RecieveMessage", _botUser, $"{userConnection.User} has joined the room {userConnection.Room}");
        }

        public async Task SendMessage(String message)
        {
            if (_connections.GetUser(Context.ConnectionId, out UserConnection userConnection))
            {
                await Clients.Group(userConnection.Room).SendAsync("RecieveMessage", userConnection.User, message);
            }
        }

        public override Task OnDisconnectedAsync(Exception exception)
        {
            if (_connections.GetUser(Context.ConnectionId, out UserConnection userConnection))
            {
                _connections.Remove(Context.ConnectionId);
                Clients.Group(userConnection.Room).SendAsync("RecieveMessage", _botUser, $"{userConnection.User} has left the room {userConnection.Room}");
                SendConnectedUsers(userConnection.Room);
            }

            return base.OnDisconnectedAsync(exception);
        }

        public Task SendConnectedUsers(string room)
        {
            var users = _connections.GetRoomUsers(room);
            return Clients.Group(room).SendAsync("RecieveConnectedUsers", users);
        }
    }
}