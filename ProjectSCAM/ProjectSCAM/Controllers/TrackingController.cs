using ProjectSCAM.Models;
using ProjectSCAM.Models.Logic;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace ProjectSCAM.Controllers
{
    [AuthorizeUser(Type = "1")]
    public class TrackingController : Controller
    {
        public ActionResult Index()
        {
            ViewBag.Batches = Singleton.Instance.DBManager.RetrieveBatches(true);
            ViewBag.Customers = Singleton.Instance.DBManager.RetrieveCustomers();
            return View();
        }

        public ActionResult Sell(TrackingModel model)
        {
            bool success = Singleton.Instance.DBManager.SetSale(model.BatchId, model.CustomerId);
            if (success)
            {
                ViewBag.SellMessage = "Success";
            }
            else
            {
                ViewBag.SellMessage = "Error";
            }
            return RedirectToAction("Index");
        }

        public ActionResult Recall(TrackingModel model)
        {
            bool success = Singleton.Instance.DBManager.RecallBatch(model.BatchId);
            if (success)
            {
                ViewBag.RecallMessage = "Success";
            }
            else
            {
                ViewBag.RecallMessage = "Error";
            }
            return RedirectToAction("Index");
        }

        public ActionResult CreateCustomer(TrackingModel model)
        {
            bool success = Singleton.Instance.DBManager.RegisterCustomer(model.CustomerName);
            if (success)
            {
                ViewBag.CreateMessage = "Success";
            }
            else
            {
                ViewBag.CreateMessage = "Error";
            }
            return RedirectToAction("Index");
        }

        public ActionResult Beers(TrackingModel model)
        {
            IList<BeerModel> beers;

            if (TempData["batchId"] != null)
            {
                beers = Singleton.Instance.DBManager.RetrieveBeers((int)TempData["batchId"]);
                ViewBag.batchId = TempData["batchid"];
                TempData["batchId"] = null;
            }
            else
            {
                beers = Singleton.Instance.DBManager.RetrieveBeers(model.BatchId);
                ViewBag.BatchId = model.BatchId;
            }

            if (beers != null)
            {
                ViewBag.Beers = beers;
                return View();
            }
            else
            {
                return RedirectToAction("Index");
            }
        }

        public ActionResult RegisterBeerAsDefect(BeerModel model)
        {
            Singleton.Instance.DBManager.SetBeerAsDefect(model.ProductNumber, model.BatchId);
            TempData["batchid"] = model.BatchId;
            return RedirectToAction("Beers");
        }
    }
}
