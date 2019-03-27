﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;

namespace SCAMS.Controllers
{
    public class OPCMachine {
        // ingredients
        public int Yeast { get; set; }
        public int Hops { get; set; }
        public int Wheat { get; set; }
        public int Barley { get; set; }
        public int Malt { get; set; }
        // batch info
        public int Producing { get; set; }
        public int Produced { get; set; }
        public int Failed { get; set; }
        public int Speed { get; set; }
        public int ProductType { get; set; }
        // machine info
        public int MachineState { get; set; }
        // simulation purposes
        Random rand = new Random();

        public OPCMachine(int amountToProduce) {
            Yeast = 1000;
            Hops = 1000;
            Wheat = 1000;
            Barley = 1000;
            Malt = 1000;
            Producing = amountToProduce;
            MachineState = 14;
        }
        public void update() {
            if(Failed+Produced >= Producing || MachineState != 17) {
                Yeast--;
                Hops--;
                Wheat--;
                Barley--;
                Malt--;
                if (rand.Next(0, 1) == 1) {
                    Produced++;
                } else {
                    Failed++; ;
                }
            } else {
                MachineState = 17;
            }

        }


    }
    public class OverviewController : Controller
    {
        OPCMachine opc = new OPCMachine(100);
        public IActionResult Index()
        {
            return View();
        }
        public void Message() {
            Response.ContentType = "text/event-stream";
            do {
                if (opc.MachineState != 17) {
                    opc.update();
                    Response.WriteAsync("data:" + JsonConvert.SerializeObject(opc, Formatting.None) + "\n\n");
                }
                Thread.Sleep(100);
            } while (true);
        }
    }
}