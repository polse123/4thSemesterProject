using ProjectSCAM.Models;
using ProjectSCAM.Models.Logic;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System.Web.Mvc;

namespace SCAMS.Controllers
{
    //[AuthorizeUser(Type = "0")]
    public class UserManagementController : Controller
    {
        public ActionResult Index()
        {
            IList<UserModel> users = ServiceSingleton.Instance.DBService.RetrieveUsers(true);
            return View(users);
        }

        [HttpPost]
        public ActionResult MakeUserInactive()
        {
            string value = Request["userId"];
            System.Diagnostics.Debug.WriteLine(value);

            try
            {
                int.TryParse(value, out int userId);
                ServiceSingleton.Instance.DBService.MakeUserInactive(userId);
            }
            catch (Exception) { }
            return RedirectToAction("Index");
        }
    }
}
