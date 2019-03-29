using Microsoft.Owin;
using Owin;

[assembly: OwinStartupAttribute(typeof(ProjectSCAM.Startup))]
namespace ProjectSCAM
{
    public partial class Startup
    {
        public void Configuration(IAppBuilder app)
        {
            ConfigureAuth(app);
        }
    }
}
