using Microsoft.AspNetCore.Mvc;
using server.Hubs.Models;

namespace Server.Controllers
{
    [Route("api/[controller]")]
    public class RoomsController : Controller
    {
        private readonly IDictionary<string, UserConnection> _connections;

        public RoomsController(IDictionary<string, UserConnection> connections)
        {
            _connections = connections;
        }


        [HttpGet]
        public IActionResult Get(int count = 10)
        {
            var rooms = _connections.Values.GroupBy(c => c.Room)
                .Select(c => new RoomInfo { Room = c.Key, Users = c.Count() })
                .OrderByDescending(r => r.Users)
                .Take(count);

            return Ok(rooms);
        }
    }
}