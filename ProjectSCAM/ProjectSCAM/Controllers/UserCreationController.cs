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
            return View();
        }

        [HttpPost]
        public ActionResult RegisterUser()
        {
          
            string s = Request["usernameField, passwordField, repeatPasswordField, firstnameField, lastnameField, phonenumberField, emailField, UserTypesSelect"];

            return View("Index",s);
        }
    }
}