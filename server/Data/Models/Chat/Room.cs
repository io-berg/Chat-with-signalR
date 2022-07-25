namespace server.Data.Models.Chat
{
    public class Room
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public List<ChatMessage> Messages { get; set; }
    }
}