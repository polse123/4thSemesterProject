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
            if (TempData["batches"] != null) {
                IList<BatchModel> list = (IList<BatchModel>)TempData["batches"];
                TempData["batches"] = null;
                return View(list);
            } else {
                IList<BatchModel> list = Singleton.Instance.DBManager.RetrieveBatches(false);
                return View(list);
            }

        }
        [HttpGet]
        public ActionResult GetBatchesById(string id) {
            IList<BatchModel> list = new List<BatchModel>();
            int intId;
            bool add = int.TryParse(id, out intId);
            if (add) {
                BatchModel m = Singleton.Instance.DBManager.RetrieveBatch(intId);

                if (m != null) {
                    list.Add(m);
                }
            }

            TempData["batches"] = list;
            return RedirectToAction("Index");

        }
        [HttpGet]
        public ActionResult GetBatchesByLatest(string latest) {
            IList<BatchModel> list = new List<BatchModel>();
            int intLatest;
            bool add = int.TryParse(latest, out intLatest);
            if (add) {
                list = Singleton.Instance.DBManager.RetrieveBatchesByAmount(intLatest, false);
            }

            TempData["batches"] = list;
            return RedirectToAction("Index");
        }
        [HttpGet]
        public ActionResult GetBatchesByDate(string date) {
            string month = date.Substring(0, 2);
            string year = date.Substring(3, 4);
            System.Diagnostics.Debug.WriteLine(month + " - " + year);
            TempData["batches"] = Singleton.Instance.DBManager.RetrieveBatchesByMonth(month, year, false);
            return RedirectToAction("Index");
        }
    }
}