using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using System.Web.Mvc;
using Newtonsoft.Json;
using SCAMS.Models;

namespace SCAMS.Controllers {
    public class OverviewController : Controller {
        public object OpcClientModel { get; private set; }

        public ActionResult Index() {
            return View();
        }
        //not being used rn
        //public void Setup(int amountToProduce, int speed, int productType) {
        //    opc = new OPCMachine(amountToProduce);
        //    opc.Speed = speed;
        //    opc.ProductType = productType;
        //}
        public void Message() {
            Response.ContentType = "text/event-stream";
            OpcClient opc = new OpcClient();
            do {
                Response.Write("data:" + JsonConvert.SerializeObject(opc, Formatting.None) + "\n\n");
                try {
                    Response.FlushAsync();
                } catch {

                }
                
                Thread.Sleep(1000);
            } while (true);
        }
    }
}