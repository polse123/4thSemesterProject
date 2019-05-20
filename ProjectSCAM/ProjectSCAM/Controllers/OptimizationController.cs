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
    public class OptimizationController : Controller
    {

        public ActionResult Index()
        {

             if (TempData["batches"] != null)
            {
                IList<BatchModel> SortedList = (IList<BatchModel>)TempData["batches"];
                TempData["batches"] = null;

                ViewBag.DataPoints = JsonConvert.SerializeObject(SortedList.OrderBy(o => o.Speed), Formatting.None);
                return View();
            }
            else
            {
                List<BatchModel> SortedList = ServiceSingleton.Instance.DBManager.RetrieveBatches(true).OrderBy(o => o.Speed).ToList();
                ViewBag.DataPoints = JsonConvert.SerializeObject(SortedList, Formatting.None);

                return View();
            }

        }
        [HttpGet]
        public ActionResult GetBatchesByRecipe(string recipe)
        {
            IList<BatchModel> list = new List<BatchModel>();
            int intProductType;
            bool add = int.TryParse(recipe, out intProductType);
            if (add)
            {
                list = ServiceSingleton.Instance.DBManager.RetrieveBatchesByRecipe(intProductType, true);
            }

            TempData["batches"] = list;
            return RedirectToAction("Index");
        }

    }
}

