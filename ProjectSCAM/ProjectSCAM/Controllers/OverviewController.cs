﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using System.Web.Mvc;
using Newtonsoft.Json;
using ProjectSCAM.Models;
using ProjectSCAM.Models.Logic;
using SCAMS.Models;

namespace SCAMS.Controllers {
    public class OverviewController : Controller {
        public ActionResult Index() {
            return View();
        }
        // series of actionmethods that handle post requests
        [HttpPost]
        public string MachineControl() {
            // get value of command variable in the request
            string value = Request["command"];
            // let opc manager handle the command
            try {
                Singleton.Instance.opcManager.HandleCommand(value);
                return "command valid";
            } catch(Exception ex) {
                return ex.Message;
            }
            
        }
        [HttpPost]
        public string RefreshBQ() {
            LinkedList<BatchQueueModel> batchq = new LinkedList<BatchQueueModel>();
            BatchQueueModel bqm = new BatchQueueModel() {
                Amount = 651,
                Speed = 85,
                Type = 1
            };
            BatchQueueModel bqm2 = new BatchQueueModel() {
                Amount = 435,
                Speed = 75,
                Type = 2
            };
            batchq.AddLast(bqm);
            batchq.AddLast(bqm2);
            return JsonConvert.SerializeObject(batchq, Formatting.None);

        }
       
        public void Message() {
            Response.ContentType = "text/event-stream";

            do {
                Response.Write("data:" + JsonConvert.SerializeObject(Singleton.Instance.opcManager, Formatting.None) + "\n\n");
                try {
                    Response.FlushAsync();
                } catch {
                    Response.Close();
                }
                
                Thread.Sleep(1000);
            } while (true);
        }
    }
}