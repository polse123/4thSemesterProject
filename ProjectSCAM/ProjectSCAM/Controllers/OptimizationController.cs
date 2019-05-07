using ProjectSCAM.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System.Web.Mvc;

namespace SCAMS.Controllers
{
    [AuthorizeUser(Type = "1")]
    public class OptimizationController : Controller
    {
        public ActionResult Index()
        {
            return View();
        }
    }
}