using ProjectSCAM.Models;
using ProjectSCAM.Models.Logic;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System.Web.Mvc;

namespace SCAMS.Controllers
{
    [AuthorizeUser(Type = "1")]
    public class OptimizationController : Controller
    {
        public ActionResult Index()
        {
            //int.TryParse(param, out int id);
            BatchModel batch = Singleton.Instance.DBManager.RetrieveBatch(1);
            IList<BatchModel> list = new List<BatchModel>() { batch };
            return View(list);
        }
    }
}
