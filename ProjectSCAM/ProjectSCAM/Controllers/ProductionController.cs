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
    public class ProductionController : Controller
    {
        public ActionResult Index()
        {
            if(TempData["statusMessage"] != null) {
                ViewBag.statusMessage = TempData["statusMessage"].ToString();
            } else {
                ViewBag.statusMessage = "";
            }
            IList<RecipeModel> r = Singleton.Instance.DBManager.RetrieveRecipes();
            IList<BatchQueueModel> batchqueue = Singleton.Instance.DBManager.RetrieveFromBatchQueue();
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
                Singleton.Instance.DBManager.RegisterIntoBatchQueue(bqm.Id,bqm.Priority,bqm.Amount,bqm.Speed,bqm.BeerId);
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