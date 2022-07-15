using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using server.Hubs.HubServices;

namespace Server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
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