using Microsoft.AspNetCore.SignalR;
using server.Hubs.HubServices;
using server.Hubs.Models;

namespace server.Hubs
{
    public class ChatHub : Hub
    {
        private readonly string _botUser;
        private readonly ChatConnectionsRepository _connections;
        private readonly CurrentlyTypingRepository _currentlyTyping;

        public ChatHub(ChatConnectionsRepository connections, CurrentlyTypingRepository currentlyTyping)
        {
            _connections = connections;
            _currentlyTyping = currentlyTyping;
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
                await StopTyping();
            }
        }

        public async Task IsTyping()
        {
            if (_connections.GetUser(Context.ConnectionId, out UserConnection userConnection))
            {
                _currentlyTyping.Add(Context.ConnectionId, userConnection);

                await SendCurrentlyTypingUsers(userConnection.Room);
            }
        }

        public async Task StopTyping()
        {
            if (_connections.GetUser(Context.ConnectionId, out UserConnection userConnection))
            {
                _currentlyTyping.Remove(Context.ConnectionId);

                await SendCurrentlyTypingUsers(userConnection.Room);
            }
        }

        public override Task OnDisconnectedAsync(Exception exception)
        {
            if (_connections.GetUser(Context.ConnectionId, out UserConnection userConnection))
            {
                _connections.Remove(Context.ConnectionId);
                _currentlyTyping.Remove(Context.ConnectionId);
                Clients.Group(userConnection.Room).SendAsync("RecieveMessage", _botUser, $"{userConnection.User} has left the room {userConnection.Room}");
                SendConnectedUsers(userConnection.Room);
                SendCurrentlyTypingUsers(userConnection.Room);
            }

            return base.OnDisconnectedAsync(exception);
        }

        public Task SendConnectedUsers(string room)
        {
            var users = _connections.GetRoomUsers(room);
            return Clients.Group(room).SendAsync("RecieveConnectedUsers", users);
        }

        public Task SendCurrentlyTypingUsers(string room)
        {
            var users = _currentlyTyping.GetCurrentlyTyping(room);
            return Clients.Group(room).SendAsync("RecieveTypingUsers", users);
        }
    }
}