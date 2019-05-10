using Newtonsoft.Json;
using ProjectSCAM.Models;
using ProjectSCAM.Models.Logic;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System.Web.Mvc;

namespace SCAMS.Controllers {
    [AuthorizeUser(Type = "1")]
    public class BatchController : Controller {
        public ActionResult Index() {
            IList<BatchModel> list = Singleton.Instance.DBManager.RetrieveBatches(false);
            return View(list);
        }
        [HttpGet]
        public string GetBatchesBySearchParameter() {
            System.Diagnostics.Debug.WriteLine(Request["machineid"]);
          /*  int machineId = int.Parse(Request["machineId"]);
            System.Diagnostics.Debug.WriteLine(machineId);
            var json = Singleton.Instance.DBManager.RetrieveBatchesByMachine(machineId, false); */
            return JsonConvert.SerializeObject("yeet", Formatting.None);
        }
    }
}