namespace server.Data.Models.DTOs
{
    public class ConversationDTO
    {
        public string Id { get; set; }
        public string UserOne { get; set; }
        public string UserTwo { get; set; }
        public List<ChatMessageDTO> Messages { get; set; }
    }
}