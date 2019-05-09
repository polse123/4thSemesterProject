﻿using ProjectSCAM.Models;
using ProjectSCAM.Models.Logic;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System.Web.Mvc;

namespace SCAMS.Controllers
{
    [AuthorizeUser(Type = "1")]
    public class BatchController : Controller
    {
        public ActionResult Index()
        {
            IList<BatchModel> list = Singleton.Instance.DBManager.RetrieveBatches(false);
            return View(list);
        }
        [HttpGet]
        public ActionResult HistoryButton(string id)
        {
            // string id = Request["id"];
            TempData["id"] = id;
            return RedirectToAction("Index", "History");

        }
        public ActionResult BatchreportButton()
        {

            return RedirectToAction("Index");

        }
        public ActionResult RecallButton()
        {

            return RedirectToAction("Index");

        }
    }
   
}