﻿using Newtonsoft.Json;
using ProjectSCAM.Models;
using ProjectSCAM.Models.Logic;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System.Web.Mvc;

namespace SCAMS.Controllers
{
    [AuthorizeUser(Type = "1")]
    public class AlarmController : Controller
    {
        public ActionResult Index()
        {
            ViewBag.Machines = Singleton.Instance.DBManager.RetrieveMachines();
            System.Diagnostics.Debug.WriteLine(Singleton.Instance.DBManager.RetrieveMachines()[0].Id);
            if (TempData["alarms"] != null) {
                IList<AlarmModel> list = (IList<AlarmModel>)TempData["alarms"];
                TempData["alarms"] = null;
                return View(list);
            } else {
                IList<AlarmModel> list = Singleton.Instance.DBManager.RetrieveAlarms();
                return View(list);
            }
        }
        [HttpGet]
        public string Popup() {
            bool shouldPopup = Singleton.Instance.opcManager.AlarmManager.ActiveAlarms.Count > 0;
            if(shouldPopup) {
                System.Diagnostics.Debug.WriteLine(Singleton.Instance.opcManager.AlarmManager.ActiveAlarms[0].Id);
            }
            return JsonConvert.SerializeObject(shouldPopup,Formatting.None);
        }
        [HttpGet]
        public string GetAlarm() {
            AlarmModel alarm = Singleton.Instance.opcManager.AlarmManager.ActiveAlarms[0];
            return JsonConvert.SerializeObject(alarm, Formatting.None);
        }
        [HttpPost]
        public void Handle() {
            Singleton.Instance.opcManager.AlarmManager.ActiveAlarms[0].Handle(int.Parse(Session["userID"].ToString()));
        }
        [HttpGet]
        public ActionResult GetAlarmsByMachine(string machineId) {
            System.Diagnostics.Debug.WriteLine(machineId + "out");
            IList<AlarmModel> list = new List<AlarmModel>();
            int intMachineId;
            bool add = int.TryParse(machineId, out intMachineId);
            if (add) {
                System.Diagnostics.Debug.WriteLine("in");
                System.Diagnostics.Debug.WriteLine(intMachineId);
                list = Singleton.Instance.DBManager.RetrieveAlarmsByMachine(intMachineId);
            } 

            TempData["alarms"] = list;
            return RedirectToAction("Index");
        }
        [HttpGet]
        public ActionResult GetAlarmsByDate(string date) {
            IList<AlarmModel> list = new List<AlarmModel>();
            if (date.Length == 7) {
                string month = date.Substring(0, 2);
                string year = date.Substring(3, 4);
                System.Diagnostics.Debug.WriteLine(month + " - " + year);
                TempData["alarms"] = Singleton.Instance.DBManager.RetrieveAlarmsByMonth(month, year);
            } else {
                TempData["alarms"] = list;
            }

            return RedirectToAction("Index");
        }
    }
}
