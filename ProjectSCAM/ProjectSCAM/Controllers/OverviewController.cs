using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using System.Web;
using System.Web.Mvc;
using Newtonsoft.Json;
using ProjectSCAM.Models;
using ProjectSCAM.Models.Logic;

namespace ProjectSCAM.Controllers
{
    [AuthorizeUser(Type = "1")]
    public class OverviewController : Controller
    {
        public ActionResult Index()
        {

            ViewBag.BatchQueue = ServiceSingleton.Instance.DBService.RetrieveFromBatchQueue();
            return View(ViewBag);
        }

        [HttpPost]
        public string MachineControl()
        {
            // get value of command variable in the request
            string value = Request["command"];

            // let opc manager handle the command
            if (Session["SelectedMachine"] != null)
            {
                try
                {
                    ServiceSingleton.Instance.OPCService.HandleCommand(Session["SelectedMachine"].ToString(), value);
                    return "command valid";
                }
                catch (Exception ex)
                {
                    System.Diagnostics.Debug.WriteLine(Session["SelectedMachine"]);
                    return ex.Message;
                }
            }
            else
            {
                return "Select a machine";
            }

        }
        [HttpGet]
        public string RefreshBQ()
        {
            IList<BatchQueueModel> batchq = ServiceSingleton.Instance.DBService.RetrieveFromBatchQueue();
            return JsonConvert.SerializeObject(batchq, Formatting.None);

        }

        public JsonResult Message()
        {
            if (Session["SelectedMachine"] != null)
            {
                var x = ServiceSingleton.Instance.OPCService.GetOpcConnection(Session["SelectedMachine"].ToString());
                return Json(x);
            }
            else
            {
                return Json("error");

            }
        }
    }
}