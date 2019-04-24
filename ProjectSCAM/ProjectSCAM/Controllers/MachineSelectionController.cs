
using ProjectSCAM.Models;
using ProjectSCAM.Models.Logic;
using System.Collections.Generic;
using System.Web;
using System.Web.Mvc;

namespace MvcMovie.Controllers {
    public class MachineSelectionController : Controller {
        // 
        // GET: /MachineSelection/ 

        public ActionResult Index() {
            IList<MachineModel> machineModels = Singleton.Instance.DBManager.RetrieveMachines();
            return View(machineModels);
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