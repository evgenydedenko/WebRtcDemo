using Microsoft.Extensions.DependencyInjection;
using WebRtcDemoBackend.DAL.Repositories.Implementations;
using WebRtcDemoBackend.DAL.Repositories.Interfaces;

namespace WebRtcDemoBackend.Infrastructure.Extensions
{
    public static class ServiceConfigurationExtensions
    {
        public static void RegisterDalDependencies(this IServiceCollection services)
        {
            services.AddScoped<IUserRepository, UserRepository>();
            services.AddScoped<IRoomRepository, RoomRepository>();
            services.AddScoped<IChatRepository, ChatRepository>();
        }
    }
}
