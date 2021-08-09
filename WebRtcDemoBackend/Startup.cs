using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.OpenApi.Models;
using WebRtcDemoBackend.DAL;
using WebRtcDemoBackend.Hubs;
using WebRtcDemoBackend.Infrastructure.Extensions;
using WebRtcDemoBackend.Models.Infrastructure.ConfigOptions;

namespace WebRtcDemoBackend
{
    public class Startup
    {
        public const string corsPolicyName = "ApiCorsPolicy";

        public Startup(IConfiguration configuration)
        {
            Configuration = configuration;
        }

        public IConfiguration Configuration { get; }

        // This method gets called by the runtime. Use this method to add services to the container.
        public void ConfigureServices(IServiceCollection services)
        {
            services.AddDbContext<AppDbContext>(options =>
                options.UseSqlServer(Configuration.GetConnectionString("DefaultConnection")));
            
            services.AddDatabaseDeveloperPageExceptionFilter();

            services.RegisterDalDependencies();
            services.AddHttpContextAccessor();

            services.AddCors(o => o.AddPolicy(corsPolicyName, builder =>
            {
                var corsSection = Configuration.GetSection("Cors").Get<CorsOptions>();
                builder.WithOrigins(corsSection.Origins)
                     .AllowAnyMethod()
                     .AllowAnyHeader()
                     .AllowCredentials();
            }));
            services.AddControllers();
            services.AddSwaggerGen(c =>
            {
                c.SwaggerDoc("v1", new OpenApiInfo { Title = "WebRtcDemoBackend", Version = "v1" });
            });
            services.AddSignalR(o => {
                o.EnableDetailedErrors = true;
            });
        }

        // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
        public void Configure(IApplicationBuilder app, IWebHostEnvironment env)
        {
            if (env.IsDevelopment())
            {
                app.UseDeveloperExceptionPage();
                app.UseSwagger();
                app.UseSwaggerUI(c => c.SwaggerEndpoint("/swagger/v1/swagger.json", "WebRtcDemoBackend v1"));
            }

            app.UseHttpsRedirection();

            app.UseRouting();

            app.UseAuthorization();

            app.UseCors(corsPolicyName);

            app.UseEndpoints(endpoints =>
            {
                endpoints.MapControllers();
                endpoints.MapHub<RoomsHub>("/chat");
            });
        }
    }
}
