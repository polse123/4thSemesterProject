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

namespace SCAMS.Controllers
{
    public class OverviewController : Controller
    {
        public ActionResult Index()
        {
            return View();
        }
        // series of actionmethods that handle post requests
        [HttpPost]
        public string MachineControl()
        {
            // get value of command variable in the request
            string value = Request["command"];
            // let opc manager handle the command
            try
            {
                Singleton.Instance.OPCManager.HandleCommand(value);
                return "command valid";
            }
            catch (Exception ex)
            {
                return ex.Message;
            }

        }
        [HttpPost]
        public string RefreshBQ()
        {
            IList<BatchQueueModel> batchq = Singleton.Instance.DBManager.RetrieveFromBatchQueue();
            return JsonConvert.SerializeObject(batchq, Formatting.None);

        }

        public void Message()
        {
            Response.ContentType = "text/event-stream";

            do
            {
                Response.Write("data:" + JsonConvert.SerializeObject(Singleton.Instance.OPCManager, Formatting.None) + "\n\n");
                try
                {
                    Response.FlushAsync();
                }
                catch
                {
                    Response.Close();
                }

                Thread.Sleep(1000);
            } while (true);
        }
    }
}