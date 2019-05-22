using Newtonsoft.Json;
using ProjectSCAM.Models;
using ProjectSCAM.Models.Logic;
using System.Collections.Generic;
using System.Web.Mvc;

namespace ProjectSCAM.Controllers
{
    [AuthorizeUser(Type = "1")]
    public class AlarmController : Controller {
        public ActionResult Index() {
            ViewBag.Machines = ServiceSingleton.Instance.DBService.RetrieveMachines();
            System.Diagnostics.Debug.WriteLine(ServiceSingleton.Instance.DBService.RetrieveMachines()[0].Id);
            if (TempData["alarms"] != null) {
                IList<AlarmModel> list = (IList<AlarmModel>)TempData["alarms"];
                TempData["alarms"] = null;
                return View(list);
            } else {
                IList<AlarmModel> list = ServiceSingleton.Instance.DBService.RetrieveAlarms();
                return View(list);
            }
        }
        [HttpGet]
        public string Popup() {
            bool shouldPopup = ServiceSingleton.Instance.OPCService.AlarmManager.ActiveAlarms.Count > 0;
            if (shouldPopup) {
                System.Diagnostics.Debug.WriteLine(ServiceSingleton.Instance.OPCService.AlarmManager.ActiveAlarms[0].Id);
            }
            return JsonConvert.SerializeObject(shouldPopup, Formatting.None);
        }
        [HttpGet]
        public string GetAlarm() {
            AlarmModel alarm = ServiceSingleton.Instance.OPCService.AlarmManager.ActiveAlarms[0];
            return JsonConvert.SerializeObject(alarm, Formatting.None);
        }
        [HttpPost]
        public void Handle() {
            ServiceSingleton.Instance.OPCService.AlarmManager.ActiveAlarms[0].Handle(int.Parse(Session["userID"].ToString()));
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
                list = ServiceSingleton.Instance.DBService.RetrieveAlarmsByMachine(intMachineId);
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
                TempData["alarms"] = ServiceSingleton.Instance.DBService.RetrieveAlarmsByMonth(month, year);
            } else {
                TempData["alarms"] = list;
            }

            return RedirectToAction("Index");
        }
        [HttpGet]
        public ActionResult GetAlarmsByUnhandled() {

            TempData["alarms"] = ServiceSingleton.Instance.DBService.RetrieveUnhandledAlarms();

            return RedirectToAction("Index");
        }
    }
}
