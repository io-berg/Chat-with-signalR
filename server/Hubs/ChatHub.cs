using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.SignalR;
using server.Hubs.HubServices;
using server.Hubs.Models;

namespace server.Hubs
{
    [Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme)]
    public class ChatHub : Hub
    {
        private readonly string _botUser;
        private readonly ChatConnectionsRepository _connections;
        private readonly CurrentlyTypingRepository _currentlyTyping;

        public ChatHub(ChatConnectionsRepository connections, CurrentlyTypingRepository currentlyTyping)
        {
            _connections = connections;
            _currentlyTyping = currentlyTyping;
            _botUser = "Bot";
        }

        public async Task JoinRoom(string room)
        {
            var user = Context.User.Identity.Name;

            if (_connections.IsConnectedToRoom(user, room))
            {
                await Clients.Caller.SendAsync("AlreadyConnected", room);
                return;
            }

            await Groups.AddToGroupAsync(Context.ConnectionId, room);

            _connections.Add(new UserConnection { User = user, Room = room });

            await SendConnectedUsers(room);
            await Clients.Group(room).SendAsync("RecieveMessage", _botUser, $"{user} has joined the room.");
        }

        public async Task LeaveRoom(string room)
        {
            var user = Context.User.Identity.Name;

            if (!_connections.IsConnectedToRoom(user, room))
            {
                await Clients.Caller.SendAsync("NotConnected", room);
                return;
            }

            await Groups.RemoveFromGroupAsync(Context.ConnectionId, room);
            _connections.Remove(_connections.GetConnection(user, room));
            await SendConnectedUsers(room);
            await Clients.Group(room).SendAsync("RecieveMessage", _botUser, $"{user} has left the room.");
        }

        public async Task SendMessage(string message, string room)
        {
            var user = Context.User.Identity.Name;

            await Clients.Group(room).SendAsync("RecieveMessage", user, message, room);
            await StopTyping(room);
        }

        public async Task IsTyping(string room)
        {
            var user = Context.User.Identity.Name;
            _currentlyTyping.Add(new UserConnection { User = user, Room = room });
            await SendCurrentlyTypingUsers(room);
        }

        public async Task StopTyping(string room)
        {
            var user = Context.User.Identity.Name;

            _currentlyTyping.Remove(_currentlyTyping.GetConnection(user, room));

            await SendCurrentlyTypingUsers(room);
        }

        public override Task OnDisconnectedAsync(Exception exception)
        {
            var user = Context.User.Identity.Name;
            var connectedRooms = _connections.GetUserConnectedRooms(user);

            connectedRooms.ForEach(room =>
            {
                _connections.Remove(_connections.GetConnection(user, room.Room));
                _currentlyTyping.Remove(_currentlyTyping.GetConnection(user, room.Room));
                Clients.Group(room.Room).SendAsync("RecieveMessage", _botUser, $"{user} has left the room.");
                SendConnectedUsers(room.Room);
                SendCurrentlyTypingUsers(room.Room);
            });

            return base.OnDisconnectedAsync(exception);
        }

        public Task SendConnectedUsers(string room)
        {
            var users = _connections.GetRoomUsers(room);
            return Clients.Group(room).SendAsync("RecieveConnectedUsers", users, room);
        }

        public Task SendCurrentlyTypingUsers(string room)
        {
            var users = _currentlyTyping.GetCurrentlyTyping(room);
            return Clients.Group(room).SendAsync("RecieveTypingUsers", users, room);
        }
    }
}