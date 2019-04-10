using ProjectSCAM.Models;
using ProjectSCAM.Models.Logic;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System.Web.Mvc;

namespace SCAMS.Controllers
{
    public class UserManagementController : Controller
    {
        public ActionResult Index()
        {
            IList<UserModel> users = Singleton.Instance.dbManager.RetrieveUsers();

            return View(users);
        }
    }
}
