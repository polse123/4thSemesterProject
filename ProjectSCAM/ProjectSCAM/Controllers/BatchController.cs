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
        public ActionResult Index()
        {
            if (TempData["batches"] != null)
            {
                IList<BatchModel> list = (IList<BatchModel>)TempData["batches"];
                TempData["batches"] = null;
                return View(list);
            }
            else
            {
                IList<BatchModel> list = ServiceSingleton.Instance.DBService.RetrieveBatches(false);
                return View(list);
            }

        }
        [HttpGet]
        public ActionResult GetBatchesById(string id)
        {
            IList<BatchModel> list = new List<BatchModel>();
            int intId;
            bool add = int.TryParse(id, out intId);
            if (add)
            {
                BatchModel m = ServiceSingleton.Instance.DBService.RetrieveBatch(intId);

                if (m != null)
                {
                    list.Add(m);
                }
            }

            TempData["batches"] = list;
            return RedirectToAction("Index");

        }
        [HttpGet]
        public ActionResult GetBatchesByLatest(string latest)
        {
            IList<BatchModel> list = new List<BatchModel>();
            int intLatest;
            bool add = int.TryParse(latest, out intLatest);
            if (add)
            {
                list = ServiceSingleton.Instance.DBService.RetrieveBatchesByAmount(intLatest, false);
            }

            TempData["batches"] = list;
            return RedirectToAction("Index");
        }
        [HttpGet]
        public ActionResult GetBatchesByDate(string date)
        {
            IList<BatchModel> list = new List<BatchModel>();
            if (date.Length == 7)
            {
                string month = date.Substring(0, 2);
                string year = date.Substring(3, 4);
                System.Diagnostics.Debug.WriteLine(month + " - " + year);
                TempData["batches"] = ServiceSingleton.Instance.DBService.RetrieveBatchesByMonth(month, year, false);
            }
            else
            {
                TempData["batches"] = list;
            }

            return RedirectToAction("Index");
        }
        [HttpGet]
        public ActionResult GetBatchesByMachine(string machineId)
        {
            IList<BatchModel> list = new List<BatchModel>();
            int intMachineId;
            bool add = int.TryParse(machineId, out intMachineId);
            if (add)
            {
                list = ServiceSingleton.Instance.DBService.RetrieveBatchesByMachine(intMachineId, false);
            }

            TempData["batches"] = list;
            return RedirectToAction("Index");
        }
        [HttpGet]
        public ActionResult GetBatchesByRecipe(string recipe)
        {
            IList<BatchModel> list = new List<BatchModel>();
            int intProductType;
            bool add = int.TryParse(recipe, out intProductType);
            if (add)
            {
                list = ServiceSingleton.Instance.DBService.RetrieveBatchesByRecipe(intProductType, false);
            }

            TempData["batches"] = list;
            return RedirectToAction("Index");
        }


        [HttpGet]
        public ActionResult HistoryButton(string id)
        {
            // string id = Request["id"];
            if (id != null)
            {
                TempData["id"] = id;
            }
            else
            {
                TempData["id"] = "0";
            }
            //Need to make sure that ID is set and not null.
            //TempData["id"] = id;
            return RedirectToAction("Index", "History");
        }
        [HttpPost]
        public void CreateBatchReport(string id)
        {
            int intId;

            bool create = int.TryParse(id, out intId);
            if (create)
            {
                BatchModel m = BatchModel.Read(intId);
                if (m != null)
                {
                    m.GetValues();
                    m.CreateBatchReport();
                }

            }

        }

        public ActionResult RecallButton()
        {
            //missing code for recall
            return RedirectToAction("Index", "Tracking");
        }
    }
}
