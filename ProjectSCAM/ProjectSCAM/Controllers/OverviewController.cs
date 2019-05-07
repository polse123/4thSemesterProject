﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using System.Web;
using System.Web.Mvc;
using Newtonsoft.Json;
using ProjectSCAM.Models;
using ProjectSCAM.Models.Logic;

namespace SCAMS.Controllers {
    [AuthorizeUser(Type = "1")]
    public class OverviewController : Controller {
        public ActionResult Index() {
            Session["SelectedMachine"] = "opc.tcp://127.0.0.1:4840";
            return View();
        }
        // series of actionmethods that handle post requests
        [HttpPost]
        public string MachineControl() {
            // get value of command variable in the request
            string value = Request["command"];
            
            // let opc manager handle the command
            try {
                Singleton.Instance.opcManager.HandleCommand(Session["SelectedMachine"].ToString(), value);
                return "command valid";
            } catch (Exception ex) {
                return ex.Message;
            }

        }
        [HttpGet]
        public string RefreshBQ() {
            IList<BatchQueueModel> batchq = Singleton.Instance.DBManager.RetrieveFromBatchQueue();
            return JsonConvert.SerializeObject(batchq, Formatting.None);

        }
        [HttpPost]
        public string SetSelectedMachine() {
            string value = Request["ip"];
            Session["SelectedMachine"] = value;
            return "lmao";
        }

        public JsonResult Message() {
            var x = Singleton.Instance.opcManager.GetOpcConnection(Session["SelectedMachine"].ToString());
            return Json(x); ;
        }
    }
}