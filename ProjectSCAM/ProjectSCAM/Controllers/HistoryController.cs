using Newtonsoft.Json;
using ProjectSCAM.Models;
using ProjectSCAM.Models.Logic;
using System;
using System.Collections;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System.Web.Mvc;

namespace ProjectSCAM.Controllers
{
    [AuthorizeUser(Type = "1")]
    public class HistoryController : Controller
    {
        int i=1;
        public ActionResult Index()
        {
            

            if (TempData["batch"] != null)
            {
                BatchModel array = (BatchModel)TempData["batch"];
                TempData["batch"] = null;

                return View();
            }
            else
            {

                if (TempData["id"] != null)
                {
                    i = int.Parse(TempData["id"].ToString());
                }
                BatchModel array = ServiceSingleton.Instance.DBService.RetrieveBatch(i);
                array.Values = ServiceSingleton.Instance.DBService.RetrieveBatchValues(array.Id);

            ViewBag.DataPoints = JsonConvert.SerializeObject(array, Formatting.None);
            return View();
            
        }}

        [HttpGet]
        public ActionResult GetBatchesById(string id)
        {
            BatchModel batch = new BatchModel();
            int intProductId;
            bool add = int.TryParse(id, out intProductId);
            if (add)
            {
                batch = ServiceSingleton.Instance.DBService.RetrieveBatch(intProductId);
            }

            TempData["batch"] = batch;
            return RedirectToAction("Index");
        }
    }
}