using ProjectSCAM.Models;
using ProjectSCAM.Models.Logic;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System.Web.Mvc;

namespace SCAMS.Controllers
{
    public class LoginController : Controller
    {
        public ActionResult Index()
        {
            return View();
        }
        [HttpPost]
        [ValidateAntiForgeryToken]
        public ActionResult Login(LoginModel u)
        {
            if (ModelState.IsValid)
            {
                UserModel uM = Singleton.Instance.DBManager.RetrieveUser(u.Username, u.Password, true);
                if (uM != null)
                {
                    if (uM.UserType == 1)
                    {// session husk!!
                        return RedirectToAction("Index", "Overview");
                    }
                }
                else
                {
                    return RedirectToAction("Index", new { Message = "Login failed" });

                }
            }
            return RedirectToAction("Index", new { Message = "Login failed" });

        }
    }
}
