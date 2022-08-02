using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.SignalR;
using server.Data.Models.Chat;
using server.Hubs.HubServices;
using server.Hubs.Models;
using server.Services;

namespace server.Hubs
{
    [Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme)]
    public class ChatHub : Hub
    {
        private readonly string _botUser;
        private readonly ChatConnectionsRepository _connections;
        private readonly CurrentlyTypingRepository _currentlyTyping;
        private readonly HistoryService _historyService;

        public ChatHub(ChatConnectionsRepository connections, CurrentlyTypingRepository currentlyTyping, HistoryService historyService)
        {
            _connections = connections;
            _currentlyTyping = currentlyTyping;
            _historyService = historyService;
            _botUser = "bot";
        }

        public async Task JoinRoom(string room)
        {
            var user = Context.User.Identity.Name;

            if (_connections.IsConnectedToRoom(user, room))
                await Clients.Caller.SendAsync("AlreadyConnectedToRoom", room);

            await Groups.AddToGroupAsync(Context.ConnectionId, room);

            _connections.Add(new UserConnection { User = user, Room = room });

            await Clients.Group(room).SendAsync("RecieveMessage", _botUser, $"{user} has joined the room.");
            await SendConnectedUsers(room);
            await Clients.Caller.SendAsync("RecieveChatHistory", await _historyService.GetRoomHistoryAsync(room), room);
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

        public async Task OpenDM(string user)
        {
            var currentUser = Context.User.Identity.Name;
            var recipient = _connections.Users.FirstOrDefault(u => u.username == user);

            if (recipient == null)
            {
                await Clients.Caller.SendAsync("RecipientNotFound", user);
                return;
            }

            var conversation = await _historyService.GetConversationAsync(currentUser, recipient.username);

            await Groups.AddToGroupAsync(recipient.connectionId, conversation.Id);
            await Groups.AddToGroupAsync(Context.ConnectionId, conversation.Id);

            _connections.Add(new UserConnection { User = user, Room = conversation.Id });
            _connections.Add(new UserConnection { User = currentUser, Room = conversation.Id });

            await Clients.Caller.SendAsync("RecieveOpenDMResponse", conversation);
            await Clients.Client(recipient.connectionId).SendAsync("RecieveOpenDMResponse", conversation);
            await SendConnectedUsers(conversation.Id);
            await Clients.Caller.SendAsync("RecieveChatHistory", await _historyService.GetRoomHistoryAsync(conversation.Id), conversation.Id);
            await Clients.Client(recipient.connectionId).SendAsync("RecieveChatHistory", await _historyService.GetRoomHistoryAsync(conversation.Id), conversation.Id);

        }

        public async Task SendMessage(string message, string room, string id = "")
        {
            var returnRoom = room;
            if (!string.IsNullOrEmpty(id)) returnRoom = id;

            var user = Context.User.Identity.Name;

            await Clients.Group(returnRoom).SendAsync("RecieveMessage", user, message, returnRoom);
            await StopTyping(returnRoom);

            await _historyService.SaveRoomMessage(returnRoom, user, message);
        }

        public async Task IsTyping(string room, string id = "")
        {
            var returnRoom = room;
            if (!string.IsNullOrEmpty(id)) returnRoom = id;

            var user = Context.User.Identity.Name;
            _currentlyTyping.Add(new UserConnection { User = user, Room = returnRoom });
            await SendCurrentlyTypingUsers(returnRoom);
        }

        public async Task StopTyping(string room, string id = "")
        {
            var returnRoom = room;
            if (!string.IsNullOrEmpty(id)) returnRoom = id;

            var user = Context.User.Identity.Name;
            _currentlyTyping.Remove(_currentlyTyping.GetConnection(user, returnRoom));
            await SendCurrentlyTypingUsers(returnRoom);
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

            _connections.Users.Remove(_connections.Users.FirstOrDefault(u => u.connectionId == Context.ConnectionId));

            return base.OnDisconnectedAsync(exception);
        }

        public override Task OnConnectedAsync()
        {
            var user = Context.User.Identity.Name;

            if (!_connections.Users.Any(u => u.connectionId == Context.ConnectionId))
            {
                _connections.Users.Add(new ConnectedUser { username = user, connectionId = Context.ConnectionId });
            }

            return base.OnConnectedAsync();
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