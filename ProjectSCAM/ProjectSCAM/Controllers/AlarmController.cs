using Newtonsoft.Json;
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
            IList<AlarmModel> alarms = Singleton.Instance.DBManager.RetrieveAlarms();
            return View(alarms);
        }
        [HttpGet]
        public string Popup() {
            System.Diagnostics.Debug.WriteLine("fired");
            bool shouldPopup = Singleton.Instance.opcManager.AlarmManager.ActiveAlarms.Count > 0;
            if(shouldPopup) {
                System.Diagnostics.Debug.WriteLine(Singleton.Instance.opcManager.AlarmManager.ActiveAlarms[0].Id);
            }
            return JsonConvert.SerializeObject(shouldPopup,Formatting.None);
        }
        [HttpGet]
        public string GetAlarm() {
            System.Diagnostics.Debug.WriteLine("firedxxx");
            AlarmModel alarm = Singleton.Instance.opcManager.AlarmManager.ActiveAlarms[0];
            return JsonConvert.SerializeObject(alarm, Formatting.None);
        }
        [HttpPost]
        public void Handle() {
            Singleton.Instance.opcManager.AlarmManager.ActiveAlarms.RemoveAt(0);
        }
    }
}
