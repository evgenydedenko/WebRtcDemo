using System;

namespace WebRtcDemoBackend.DAL.Repositories
{
    public abstract class BaseRepository : IDisposable
    {
        protected AppDbContext _context;

        public BaseRepository(AppDbContext context)
        {
            _context = context;
        }

        public void Dispose()
        {
            _context?.Dispose();
        }
    }
}
