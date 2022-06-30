

using Microsoft.AspNetCore.Mvc;
using server.Data.Models;
using Server.Data;

namespace Server.Controllers
{
  [Route("api/[controller]")]
  public class HighscoreController : Controller
  {
    private readonly PuliContext _context;

    public HighscoreController(PuliContext context)
    {
      _context = context;
    }

    [HttpGet]
    public IActionResult GetHighscore()
    {
      var highscore = _context.Highscore.ToList();
      return Ok(highscore);
    }

    [HttpPost]
    public IActionResult PostHighscore([FromBody] Highscore highscore)
    {
      _context.Highscore.Add(highscore);
      _context.SaveChanges();
      return Ok(highscore);
    }
  }
}