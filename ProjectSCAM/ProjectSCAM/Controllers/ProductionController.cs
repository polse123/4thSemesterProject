using ProjectSCAM.Models;
using ProjectSCAM.Models.Logic;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System.Web.Mvc;

namespace ProjectSCAM.Controllers
{
    [AuthorizeUser(Type = "1")]
    public class ProductionController : Controller
    {
        public ActionResult Index()
        {
            if(TempData["statusMessage"] != null) {
                ViewBag.statusMessage = TempData["statusMessage"].ToString();
            } else {
                ViewBag.statusMessage = "";
            }
            IList<RecipeModel> r = ServiceSingleton.Instance.DBService.RetrieveRecipes();
            IList<BatchQueueModel> batchqueue = ServiceSingleton.Instance.DBService.RetrieveFromBatchQueue();
            ViewBag.recipes = r;
            ViewBag.batchqueue = batchqueue;
            return View();
        }

        public ActionResult Create(BatchQueueModel bqm) {
            string s = "";
            foreach (ModelState modelState in ViewData.ModelState.Values) {
                foreach (ModelError error in modelState.Errors) {
                    s += error.ErrorMessage;
                }
            }
            if (ModelState.IsValid) {
                ServiceSingleton.Instance.DBService.RegisterIntoBatchQueue(bqm.Id,bqm.Priority,bqm.Amount,bqm.Speed,bqm.BeerId);
                TempData["statusMessage"] = "Batch inserted";
                return RedirectToAction("Index");
            } else {
                TempData["statusMessage"] = s;
                return RedirectToAction("Index");
            }

        }
        public ActionResult Update(BatchQueueModel bqm) {
            string s = "";
            foreach (ModelState modelState in ViewData.ModelState.Values) {
                foreach (ModelError error in modelState.Errors) {
                    s += error.ErrorMessage;
                }
            }
            if (ModelState.IsValid) {
                bqm.Update();
                return RedirectToAction("Index");
            } else {
                TempData["statusMessage"] = s;
                return RedirectToAction("Index");
            }
        }
    }
}