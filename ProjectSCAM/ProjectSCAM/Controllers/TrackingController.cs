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

        public ActionResult Sell(BatchModel batch)
        {
            System.Diagnostics.Debug.WriteLine("Sell start");
            if (batch.SoldTo != null)
            {
                System.Diagnostics.Debug.WriteLine("Sell if");
                bool success = Singleton.Instance.DBManager.SetSale(batch.Id, (int)batch.SoldTo);
                if (success)
                {
                    System.Diagnostics.Debug.WriteLine("Sell success");
                    ViewBag.SellMessage = "Success";
                }
                else
                {
                    System.Diagnostics.Debug.WriteLine("Sell error");
                    ViewBag.SellMessage = "Error";
                }
            }
            else
            {
                System.Diagnostics.Debug.WriteLine("Sell missing info");
                ViewBag.SellMessage = "Missing Customer id";
            }
            return RedirectToAction("Index");
        }

        public ActionResult Recall(BatchModel batch)
        {
            bool success = Singleton.Instance.DBManager.RecallBatch(batch.Id);
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

        public ActionResult CreateCustomer(CustomerModel customer)
        {
            bool success = Singleton.Instance.DBManager.RegisterCustomer(customer.CustomerName);
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
    }
}
