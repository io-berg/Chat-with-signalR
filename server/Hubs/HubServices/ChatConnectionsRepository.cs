using System.Linq;
using server.Hubs.Models;

namespace server.Hubs.HubServices
{
    public class ChatConnectionsRepository
    {
        IDictionary<string, UserConnection> _connections;

        public ChatConnectionsRepository()
        {
            _connections = new Dictionary<string, UserConnection>();
        }

        public void Add(string connectionId, UserConnection userConnection)
        {
            _connections.Add(connectionId, userConnection);
        }

        public void Remove(string connectionId)
        {
            _connections.Remove(connectionId);
        }

        public List<string> GetRoomUsers(string room)
        {
            return _connections.Where(c => c.Value.Room == room).Select(c => c.Value.User).ToList();
        }

        public bool GetUser(string connectionId, out UserConnection userConnection)
        {
            return _connections.TryGetValue(connectionId, out userConnection);
        }

        public bool IsConnectedToRoom(string username, string room)
        {
            return _connections.Any(c => c.Value.User == username && c.Value.Room == room);
        }

        public List<RoomInfo> GetRoomInfosAsync(int count = 10)
        {
            var rooms = _connections.Values.GroupBy(c => c.Room)
                .Select(c => new RoomInfo { Room = c.Key, Users = c.Count() })
                .OrderByDescending(r => r.Users)
                .Take(count);

            return rooms.ToList();
        }
    }
}