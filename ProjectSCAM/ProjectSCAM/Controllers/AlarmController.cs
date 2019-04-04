using Newtonsoft.Json;
using ProjectSCAM.Models.Logic;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System.Web.Mvc;

namespace SCAMS.Controllers
{
    public class AlarmController : Controller
    {
        public ActionResult Index()
        {
            return View();
        }
        [HttpGet]
        public string Popup() {
            bool popup = Singleton.Instance.Alarms.Count > 0 && Singleton.Instance.Alarms != null;
            return JsonConvert.SerializeObject(popup,Formatting.None);

        }
        [HttpPost]
        public void Handle() {
            Singleton.Instance.Alarms.Clear();

        }
    }
}