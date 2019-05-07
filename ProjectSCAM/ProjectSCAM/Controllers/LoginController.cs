using Microsoft.AspNet.Identity;
using ProjectSCAM.Models;
using ProjectSCAM.Models.Logic;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Threading.Tasks;
using System.Web.Mvc;

namespace SCAMS.Controllers
{
    public class LoginController : Controller
    {
        public ActionResult Index()
        {
            System.Web.HttpContext.Current.Session["UserType"] = "hello";
            if (TempData["statusMessage"] != null)
            {
                ViewBag.statusMessage = TempData["statusMessage"].ToString();
        } else {
                ViewBag.statusMessage = "";
            }
  
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
                        //Session["userType"] = uM.UserType;
                        //model.userRole = usermodelDB.userRole;
                        //FormsAuthentication.SetAuthCookie(model.userRole, true);
                        //System.Web.HttpContext.Current.Session["UserRole"] = usermodelDB.userRole;
                        //var ia = System.Web.HttpContext.Current.User.Identity.IsAuthenticated;
                        System.Web.HttpContext.Current.Session["UserType"] = "1";
                        return RedirectToAction("Index", "Overview");
                    }
                }
                else
                {   ViewBag.statusMessage = "Login failed";
                    TempData["statusMessage"] = "Login failed 1";
                    return RedirectToAction("Index", new { Message = "Login failed" });

                }
            }
            ViewBag.statusMessage = "Login failed";
            TempData["statusMessage"] = "Login failed 2";
            return RedirectToAction("Index", new { Message = "Login failed" });

        }
    }}

