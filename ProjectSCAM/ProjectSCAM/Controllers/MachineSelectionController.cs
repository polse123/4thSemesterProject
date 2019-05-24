
using ProjectSCAM.Models;
using ProjectSCAM.Models.Logic;
using System;
using System.Collections.Generic;
using System.Web;
using System.Web.Mvc;

namespace ProjectSCAM.Controllers {
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
            ViewBag.Machines = ServiceSingleton.Instance.DBService.RetrieveMachines();
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
              ServiceSingleton.Instance.DBService.RegisterMachine(m.Ip, m.Description, m.NameSpaceIndex,
            m.AmountNode, m.StateNode, m.DefectNode, m.AcceptableNode, m.AmountToProduceNode, m.MachSpeedNode,
            m.TemperatureNode, m.HumidityNode, m.VibrationNode, m.StopreasonNode, m.BatchIdNode, m.BarleyNode,
            m.HopsNode, m.MaltNode, m.WheatNode, m.YeastNode, m.MaintenanceTriggerNode, m.MaintenanceCounterNode);
                TempData["statusMessage"] = "Machine registered";
                return RedirectToAction("Index");
            }
            TempData["statusMessage"] = s;
            return RedirectToAction("Index");
        }

        [HttpPost]
        public void SetMachine(string ip)
        {
            Session["SelectedMachine"] = ip;
            Console.WriteLine(Session["SelectedMachine"].ToString());
            ServiceSingleton.Instance.OPCService.InitConnection(Session["SelectedMachine"].ToString());
        }
        public ActionResult EditMachine()
        {
            if(Session["SelectedMachine"] != null)
            {
                MachineModel m = MachineModel.GetFromDatabase(Session["SelectedMachine"].ToString());
                return View("EditMachine", m);
            } else
            {
               return  RedirectToAction("Index");
            }

        }
        public ActionResult Edit(MachineModel m)
        {
            if(ModelState.IsValid)
            {
                m.Update();
            }
            return RedirectToAction("Index");
        }
    }
}