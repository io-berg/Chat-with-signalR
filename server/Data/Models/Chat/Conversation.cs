using System.ComponentModel.DataAnnotations;
using server.Data.Models.auth;

namespace server.Data.Models.Chat
{
    public class Conversation
    {
        [Key]
        public string Id { get; set; }
        public string UserOneId { get; set; }
        public ApplicationUser UserOne { get; set; }
        public string UserTwoId { get; set; }
        public ApplicationUser UserTwo { get; set; }
        public List<ChatMessage> Messages { get; set; }
    }
}