using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System.Web.Mvc;

namespace SCAMS.Controllers
{
    public class LoginController : Controller
    {
        public ActionResult Index()
        {
            return View();
        }
        
        //public string Welcome(string name, int numTimes = 1)
        //{
        //    return "Hello {name}, NumTimes is: {numTimes}";
        //}
    }
}