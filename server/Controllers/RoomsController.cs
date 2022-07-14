using Microsoft.AspNetCore.Mvc;
using server.Hubs.HubServices;
using server.Hubs.Models;

namespace Server.Controllers
{
    [Route("api/[controller]")]
    public class RoomsController : Controller
    {
        private readonly ChatConnectionsRepository _connections;

        public RoomsController(ChatConnectionsRepository connections)
        {
            _connections = connections;
        }


        [HttpGet]
        public IActionResult Get(int count = 10)
        {
            var rooms = _connections.GetRoomInfosAsync(count);

            return Ok(rooms);
        }
    }
}