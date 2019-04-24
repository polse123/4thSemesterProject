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

        // server, port, user id, password, database
        private readonly string[] DB_INFO = {"balarama.db.elephantsql.com",
            "5432", "ppcrexqw", "HL8HORvW5RUPUlBUcf_PIcZWxjlOoc1F", "ppcrexqw"};

        public DBManagerTest()
        {
            dbManager = new DBManager(DB_INFO[0], DB_INFO[1], DB_INFO[2], DB_INFO[3], DB_INFO[4]);
        }

        [TestMethod]
        public void RetrieveUsertypes()
        {
            IList<UserType> list = dbManager.RetrieveUserTypes();
            Assert.IsNotNull(list);
            if (list.Count != 0)
            {
                foreach (UserType element in list)
                {
                    Assert.IsNotNull(element);
                }
            }
            else Assert.IsNotNull(null);
        }

        [TestMethod]
        public void RetrieveRecipes()
        {
            IList<RecipeModel> list = dbManager.RetrieveRecipes();
            Assert.IsNotNull(list);
            if (list.Count != 0)
            {
                foreach (RecipeModel element in list)
                {
                    Assert.IsNotNull(element);
                }
            }
            else Assert.IsNotNull(null);
        }

        [TestMethod]
        public void RegisterMachine()
        {

        }

    }
}
