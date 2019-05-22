using Microsoft.AspNet.Identity;
using ProjectSCAM.Models;
using ProjectSCAM.Models.Logic;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Threading.Tasks;
using System.Web.Mvc;

namespace ProjectSCAM.Controllers
{
    public class LoginController : Controller
    {
        public ActionResult Index()
        {
            System.Web.HttpContext.Current.Session["UserType"] = "hello";
            Session["userType"] = -2;
            Session["userID"] = -2;
            Session["username"] = "";
            Session["login"] = false;
            
            if (TempData["statusMessage"] != null)
            {
                ViewBag.statusMessage = TempData["statusMessage"].ToString();
            }
            else
            {
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
                UserModel uM = ServiceSingleton.Instance.DBService.RetrieveUser(u.Username, u.Password, true);
                if (uM != null)
                {
                    if (uM.UserType == 1) //Mangler login til admin eller andre usertypes!
                    {// session husk!!
                        //Session["userType"] = uM.UserType;
                        //model.userRole = usermodelDB.userRole;
                        //FormsAuthentication.SetAuthCookie(model.userRole, true);
                        //System.Web.HttpContext.Current.Session["UserRole"] = usermodelDB.userRole;
                        //var ia = System.Web.HttpContext.Current.User.Identity.IsAuthenticated;
                        System.Web.HttpContext.Current.Session["UserType"] = "1";

                        Session["userType"] = uM.UserType;
                        Session["userID"] = uM.Id;
                        Session["username"] = uM.Username;
                        Session["login"] = true;

                        return RedirectToAction("Index", "Overview");

                    }
                    if (uM.UserType == 0) //Mangler login til admin eller andre usertypes!
                    {// session husk!!
                        //Session["userType"] = uM.UserType;
                        //model.userRole = usermodelDB.userRole;
                        //FormsAuthentication.SetAuthCookie(model.userRole, true);
                        //System.Web.HttpContext.Current.Session["UserRole"] = usermodelDB.userRole;
                        //var ia = System.Web.HttpContext.Current.User.Identity.IsAuthenticated;
                        System.Web.HttpContext.Current.Session["UserType"] = "0";

                        Session["userType"] = uM.UserType;
                        Session["userID"] = uM.Id;
                        Session["username"] = uM.Username;
                        Session["login"] = true;

                        return RedirectToAction("Index", "UserManagement");

                    }

                }
                else
                {
                    TempData["statusMessage"] = "Login failed";
                    return RedirectToAction("Index");

                }
            }

                TempData["statusMessage"] = "Login failed";
                return RedirectToAction("Index");

        }
        [HttpGet]
        public JsonResult Usertype()
        {
            String x = System.Web.HttpContext.Current.Session["UserType"].ToString();
        //    MachineModel model = new MachineModel() { Description = "10", Id = 1, Ip = "2" };
            return Json(new { type = x}, JsonRequestBehavior.AllowGet);
        }
    }
}


