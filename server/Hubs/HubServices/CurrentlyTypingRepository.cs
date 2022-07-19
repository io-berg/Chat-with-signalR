using server.Hubs.Models;

namespace server.Hubs.HubServices
{
    public class CurrentlyTypingRepository
    {
        List<UserConnection> _repository;

        public CurrentlyTypingRepository()
        {
            _repository = new List<UserConnection>();
        }

        public void Add(UserConnection userConnection)
        {
            _repository.Add(userConnection);
        }

        public void Remove(UserConnection userConnection)
        {
            _repository.Remove(userConnection);
        }

        public UserConnection GetConnection(string user, string room)
        {
            return _repository.Where(c => c.User == user && c.Room == room).Select(c => c).FirstOrDefault();
        }

        public List<string> GetCurrentlyTyping(string room)
        {
            return _repository.Where(c => c.Room == room).Select(c => c.User).ToList();
        }
    }
}
