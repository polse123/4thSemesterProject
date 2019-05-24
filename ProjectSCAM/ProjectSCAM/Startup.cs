using Microsoft.Owin;
using Owin;
using System.Threading;

[assembly: OwinStartupAttribute(typeof(ProjectSCAM.Startup))]
namespace ProjectSCAM
{
    public partial class Startup
    {
        public void Configuration(IAppBuilder app)
        {
            var culture = new System.Globalization.CultureInfo("en-US");
            Thread.CurrentThread.CurrentCulture = culture;
            Thread.CurrentThread.CurrentUICulture = culture;
            ConfigureAuth(app);
        }
    }
}
