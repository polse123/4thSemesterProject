
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
            //// instantiate parent model
            //MachineSelectViewModel msvm = new MachineSelectViewModel();
            //// retrieve machines from db
            //IList<MachineModel> machineModels = Singleton.Instance.DBManager.RetrieveMachines();
            //msvm.Machines = machineModels;
            //// retrieve message and pass to view
            if (TempData["statusMessage"] != null) {
                ViewBag.statusMessage = TempData["statusMessage"].ToString();
            } else {
                ViewBag.statusMessage = "";
            }

            //return View(msvm);
            ViewBag.Machines = Singleton.Instance.DBManager.RetrieveMachines();
            ViewBag.Machine = new MachineModel();
            return View();
        }
        [HttpPost]
        public ActionResult Create(MachineModel m) {
            string s = "";
            foreach (ModelState modelState in ViewData.ModelState.Values) {
                foreach (ModelError error in modelState.Errors) {
                    s += error.ErrorMessage;
                }
            }
            //pass message to redirect

            if (ModelState.IsValid) {
                Singleton.Instance.DBManager.RegisterMachine(m.Ip, m.Description);
                TempData["statusMessage"] = "Machine registered";
                return RedirectToAction("Index");
            }
            TempData["statusMessage"] = s;
            return RedirectToAction("Index");

        }
    }
}