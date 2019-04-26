
using ProjectSCAM.Models;
using ProjectSCAM.Models.Logic;
using System;
using System.Collections.Generic;
using System.Web;
using System.Web.Mvc;

namespace MvcMovie.Controllers {
    public class MachineSelectionController : Controller {
        // 
        // GET: /MachineSelection/ 

        public ActionResult Index() {
            MachineSelectViewModel msvm = new MachineSelectViewModel();
            IList<MachineModel> machineModels = Singleton.Instance.DBManager.RetrieveMachines();
            msvm.Machines = machineModels;
            return View(msvm);
        }
        [HttpPost]
        public string Create(MachineSelectViewModel m) {
            if(ModelState.IsValid) {

            }
            //Singleton.Instance.DBManager.RegisterMachine(msvm.Machine.Ip,msvm.Machine.Description);
;
            return m.Machine.Ip;
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