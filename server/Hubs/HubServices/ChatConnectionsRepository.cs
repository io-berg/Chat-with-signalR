using System.Linq;
using server.Hubs.Models;

namespace server.Hubs.HubServices
{
    public class ChatConnectionsRepository
    {
        List<UserConnection> _connections;
        public List<ConnectedUser> Users;

        public ChatConnectionsRepository()
        {
            _connections = new List<UserConnection>();
            Users = new List<ConnectedUser>();
        }

        public void Add(UserConnection userConnection)
        {
            if (!_connections.Any(x => x.User == userConnection.User && x.Room == userConnection.Room))
                _connections.Add(userConnection);
        }

        public void Remove(UserConnection userConnection)
        {
            _connections.Remove(userConnection);
        }

        public List<string> GetRoomUsers(string room)
        {
            return _connections.Where(c => c.Room == room).Select(c => c.User).ToList();
        }

        public UserConnection GetConnection(string user, string room)
        {
            return _connections.Where(c => c.User == user && c.Room == room).Select(c => c).FirstOrDefault();
        }

        public bool IsConnectedToRoom(string user, string room)
        {
            return _connections.Where(c => c.User == user && c.Room == room).Select(c => c).Any();
        }

        public List<UserConnection> GetUserConnectedRooms(string username)
        {
            return _connections.Where(c => c.User == username).Select(c => c).ToList();
        }

        public List<RoomInfo> GetRoomInfosAsync(int count = 10)
        {
            var rooms = _connections.GroupBy(c => c.Room)
                .Select(c => new RoomInfo { Room = c.Key, Users = c.Count() })
                .OrderByDescending(r => r.Users)
                .Take(count);

            return rooms.ToList();
        }
    }
}