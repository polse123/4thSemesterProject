using ProjectSCAM.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System.Web.Mvc;

namespace SCAMS.Controllers
{
    public class UserCreationController : Controller
    {
        public ActionResult  Index()
        {
            if(TempData["statusMessage"] != null) {
                ViewBag.statusMessage = TempData["statusMessage"];
            } else {
                ViewBag.statusMessage = "";
            }
            return View();
        }

        [HttpPost]
        public ActionResult RegisterUser(UserModel m)
        {
            if(ModelState.IsValid) {
                // add the user to the db
                
                //
                TempData["statusMessage"] = "User successfully registered";
            } else {
                string s = "";
                foreach (ModelState modelState in ViewData.ModelState.Values) {
                    foreach (ModelError error in modelState.Errors) {
                        s += error.ErrorMessage;
                    }
                }
                TempData["statusMessage"] = "User wasn't registered " + s;
            }

            return RedirectToAction("Index");
        }
    }
}