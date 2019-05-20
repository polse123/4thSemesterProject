using ProjectSCAM.Models;
using ProjectSCAM.Models.Logic;
using System;
using System.Collections;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System.Web.Mvc;

namespace SCAMS.Controllers
{
    //[AuthorizeUser(Type = "0")]
    public class UserCreationController : Controller
    {
        public ActionResult Index()
        {
            if (TempData["statusMessage"] != null)
            {
                ViewBag.statusMessage = TempData["statusMessage"];
            }
            else
            {
                ViewBag.statusMessage = "";
            }
            ViewBag.UserTypes = ServiceSingleton.Instance.DBManager.RetrieveUserTypes();
            return View();
        }

        [HttpPost]
        public ActionResult RegisterUser(UserModel m)
        {
            bool success = false;
            if (ModelState.IsValid)
            {
                success = ServiceSingleton.Instance.DBManager.RegisterUser(m.Username, m.Password,
                       m.FirstName, m.LastName, m.Email, m.PhoneNumber, m.UserType);
            }
            if (success)
            {
                TempData["statusMessage"] = "User successfully registered";
            }
            else
            {
                string s = "";
                foreach (ModelState modelState in ViewData.ModelState.Values)
                {
                    foreach (ModelError error in modelState.Errors)
                    {
                        s += error.ErrorMessage;
                    }
                }
                TempData["statusMessage"] = "User wasn't registered " + s;
            }

            return RedirectToAction("Index");
        }
    }
}