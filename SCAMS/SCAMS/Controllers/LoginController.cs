﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;

namespace SCAMS.Controllers
{
    public class LoginController : Controller
    {
        public IActionResult Index()
        {
            return View();
        }

        //public string Welcome(string name, int numTimes = 1)
        //{
        //    return "Hello {name}, NumTimes is: {numTimes}";
        //}
    }
}