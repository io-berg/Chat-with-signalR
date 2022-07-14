using server.Hubs.Models;

namespace server.Hubs.HubServices
{
    public class CurrentlyTypingRepository
    {
        IDictionary<string, UserConnection> _repository;

        public CurrentlyTypingRepository()
        {
            _repository = new Dictionary<string, UserConnection>();
        }

        public void Add(string connectionId, UserConnection userConnection)
        {
            _repository.Add(connectionId, userConnection);
        }

        public void Remove(string connectionId)
        {
            _repository.Remove(connectionId);
        }

        public List<UserConnection> GetCurrentlyTyping(string room)
        {
            return _repository.Where(c => c.Value.Room == room).Select(c => c.Value).ToList();
        }
    }
}
