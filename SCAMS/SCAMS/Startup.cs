using Microsoft.Owin;
using Owin;

[assembly: OwinStartupAttribute(typeof(SCAMS.Startup))]
namespace SCAMS
{
    public partial class Startup
    {
        public void Configuration(IAppBuilder app)
        {
            ConfigureAuth(app);
        }
    }
}
