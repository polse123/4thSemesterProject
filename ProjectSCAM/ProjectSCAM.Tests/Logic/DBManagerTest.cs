using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Web.Mvc;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using ProjectSCAM;
using ProjectSCAM.Models;
using ProjectSCAM.Models.Logic;

namespace ProjectSCAM.Tests.Logic
{
    [TestClass]
    class DBManagerTest
    {
        private DBManager dbManager;

        public DBManagerTest()
        {
            dbManager = new DBManager("balarama.db.elephantsql.com", "5432",
                "ppcrexqw", "HL8HORvW5RUPUlBUcf_PIcZWxjlOoc1F", "ppcrexqw");
        }

        [TestMethod]
        public void RetrieveUsertypes()
        {
            IList<UserType> list = dbManager.RetrieveUserTypes();



        }




    }
}
