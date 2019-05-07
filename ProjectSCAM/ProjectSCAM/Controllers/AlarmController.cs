using ProjectSCAM.Models;
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
            IList<AlarmModel> alarms = Singleton.Instance.DBManager.RetrieveAlarms();
            return View(alarms);
        }
    }
}
