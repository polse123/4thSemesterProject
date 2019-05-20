
using ProjectSCAM.Models;
using ProjectSCAM.Models.Logic;
using System;
using System.Collections.Generic;
using System.Web;
using System.Web.Mvc;

namespace MvcMovie.Controllers
{
    [AuthorizeUser(Type = "1")]
    public class MachineSelectionController : Controller
    {
        // 
        // GET: /MachineSelection/ 

        public ActionResult Index()
        {
            if (TempData["statusMessage"] != null)
            {
                ViewBag.statusMessage = TempData["statusMessage"].ToString();
            }
            else
            {
                ViewBag.statusMessage = "";
            }

            //return View(msvm);
            ViewBag.Machines = ServiceSingleton.Instance.DBManager.RetrieveMachines();
            ViewBag.Machine = new MachineModel();
            return View();
        }
        [HttpPost]
        public ActionResult Create(MachineModel m)
        {
            string s = "";
            foreach (ModelState modelState in ViewData.ModelState.Values)
            {
                foreach (ModelError error in modelState.Errors)
                {
                    s += error.ErrorMessage;
                }
            }
            if (ModelState.IsValid)
            {
                // NEEDS UPDATING
                /*
                Singleton.Instance.DBManager.RegisterMachine(m.Ip, m.Description);
                TempData["statusMessage"] = "Machine registered";
                */
                return RedirectToAction("Index");
            }
            TempData["statusMessage"] = s;
            return RedirectToAction("Index");
        }

        [HttpPost]
        public void SetMachine()
        {
            Session["SelectedMachine"] = Request["ip"];
            ServiceSingleton.Instance.opcManager.InitConnection(Session["SelectedMachine"].ToString());
        }
    }
}