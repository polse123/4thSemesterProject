﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;

namespace SCAMS.Controllers
{
    public class UserCreationController : Controller
    {
        public IActionResult Index()
        {
            return View();
        }
    }
}