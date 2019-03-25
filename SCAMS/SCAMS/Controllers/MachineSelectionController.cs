using Microsoft.AspNetCore.Mvc;
using System.Web;


namespace MvcMovie.Controllers {
    public class MachineSelectionController : Controller {
        // 
        // GET: /MachineSelection/ 

        public ActionResult Index() {
            return View();
        }

        // 
        // GET: /MachineSelection/Welcome/ 

        public ActionResult Welcome(string name, int numTimes = 1) {
            ViewBag.Message = "Hello " + name;
            ViewBag.NumTimes = numTimes;

            return View();
        }
    }
}