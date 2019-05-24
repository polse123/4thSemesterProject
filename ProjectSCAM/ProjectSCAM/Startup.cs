﻿using Microsoft.Owin;
using Owin;
using System.Globalization;
using System.Threading;

[assembly: OwinStartupAttribute(typeof(ProjectSCAM.Startup))]
namespace ProjectSCAM
{
    public partial class Startup
    {
        public void Configuration(IAppBuilder app)
        {
            CultureInfo.CurrentCulture = new CultureInfo("en-US", false);
            ConfigureAuth(app);
        }
    }
}
