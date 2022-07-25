using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using server.Data;
using server.Data.Models.auth;
using server.Data.Models.Chat;
using server.Data.Models.DTOs;

namespace server.Services
{
    public class HistoryService
    {
        private readonly AppDbContext _context;
        private readonly UserManager<ApplicationUser> _userManager;

        public HistoryService(AppDbContext context, UserManager<ApplicationUser> userManager)
        {
            _context = context;
            _userManager = userManager;
        }

        public async Task<List<ChatMessageDTO>> GetRoomHistoryAsync(string room)
        {
            var foundRoom = await _context.Rooms.Include(r => r.Messages)
                .ThenInclude(m => m.User)
                .FirstOrDefaultAsync(r => r.Name == room);

            if (foundRoom == null)
                return new List<ChatMessageDTO>();

            return foundRoom.Messages.Select(m => new ChatMessageDTO
            {
                Message = m.Message,
                User = m.User.UserName,
            }).ToList();
        }

        public async Task SaveRoomMessage(string room, string messageSender, string message)
        {
            var foundRoom = await _context.Rooms.Include(r => r.Messages)
                .FirstOrDefaultAsync(r => r.Name == room);

            var user = await _userManager.FindByNameAsync(messageSender);

            if (foundRoom == null)
            {
                foundRoom = new Room { Name = room, Messages = new List<ChatMessage>() };
                _context.Rooms.Add(foundRoom);
            }

            foundRoom.Messages.Add(new ChatMessage { User = user, Message = message, Time = DateTime.Now });
            await _context.SaveChangesAsync();
        }
    }
}