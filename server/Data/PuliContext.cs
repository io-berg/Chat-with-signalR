using Microsoft.EntityFrameworkCore;
using server.Data.Models;

namespace Server.Data
{
  public class PuliContext : DbContext
  {
    public PuliContext(DbContextOptions<PuliContext> options) : base(options)
    {
    }

    public DbSet<Highscore> Highscore { get; set; }
  }
}