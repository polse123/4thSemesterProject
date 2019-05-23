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
            ViewBag.Batches = ServiceSingleton.Instance.DBService.RetrieveBatches(true);
            ViewBag.Customers = ServiceSingleton.Instance.DBService.RetrieveCustomers();
            return View();
        }

        public ActionResult Sell(TrackingModel model)
        {
            bool success = ServiceSingleton.Instance.DBService.SetSale(model.BatchId, model.CustomerId);
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
            bool success = ServiceSingleton.Instance.DBService.RecallBatch(model.BatchId);
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
            bool success = ServiceSingleton.Instance.DBService.RegisterCustomer(model.CustomerName);
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
                beers = ServiceSingleton.Instance.DBService.RetrieveBeers((int)TempData["batchId"]);
                ViewBag.BatchId = TempData["batchid"];
            }
            else
            {
                beers = ServiceSingleton.Instance.DBService.RetrieveBeers(model.BatchId);
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
            ServiceSingleton.Instance.DBService.SetBeerAsDefect(model.ProductNumber, model.BatchId);
            TempData["batchid"] = model.BatchId;
            return RedirectToAction("Beers");
        }
    }
}
