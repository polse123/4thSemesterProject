
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
            MachineModel machine = m.Machine;
            
            if(ModelState.IsValid) {
                Singleton.Instance.DBManager.RegisterMachine(m.Machine.Ip, m.Machine.Description);
                return ModelState.Values.ToString();
            }
            string s = "";
            foreach(var x in ModelState.Values) {
                s += x.ToString() + "-" + x.Value.ToString();
            }
            return s;
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