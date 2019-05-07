using ProjectSCAM.Models;
using ProjectSCAM.Models.Logic;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System.Web.Mvc;

namespace SCAMS.Controllers
{
    [AuthorizeUser(Type = "0")]
    public class UserManagementController : Controller
    {
        public ActionResult Index()
        {
            IList<UserModel> users = Singleton.Instance.DBManager.RetrieveUsers(true);
            return View(users);
        }

        [HttpPost]
        public void MakeUserInactive()
        {
            string value = Request["userId"];

            try
            {
                int.TryParse(value, out int userId);
                Singleton.Instance.DBManager.MakeUserInactive(userId);
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }
    }
}
