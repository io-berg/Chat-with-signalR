using server.Data.Models.auth;

namespace server.Data.Models.Chat
{
    public class ChatMessage
    {
        public int Id { get; set; }
        public string Message { get; set; }
        public string UserId { get; set; }
        public ApplicationUser User { get; set; }
        public DateTime Time { get; set; }
    }
}