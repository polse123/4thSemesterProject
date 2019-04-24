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
            bool success = dbManager.RegisterMachine();
            Assert.IsTrue(success);
        }

        [TestMethod]
        public void RetrieveMachines()
        {
            IList<MachineModel> list = dbManager.RetrieveMachines();
            Assert.IsNotNull(list);
            if (list.Count != 0)
            {
                foreach (MachineModel element in list)
                {
                    Assert.IsNotNull(element);
                }
            }
            else Assert.IsNotNull(null);
        }

        [TestMethod]
        public void RegisterUser()
        {
            bool success = dbManager.RegisterUser();
            Assert.IsTrue(success);
        }

        [TestMethod]
        public void RetrieveUsersAndMakeInactive()
        {
            IList<UserModel> list = dbManager.RetrieveUsers();
            Assert.IsNotNull(list);
            bool userMadeInactive;
            if (list.Count != 0)
            {
                foreach (UserModel element in list)
                {
                    if (!userMadeInactive)
                    {
                        bool userMadeInactive = dbManager.MakeUserInactive(element.Id);
                        Assert.IsTrue(userMadeInactive);
                    }
                    Assert.IsNotNull(element);
                }
            }
            else Assert.IsNotNull(null);
        }


        [TestMethod]
        public void RegisterCustomer()
        {
            bool success = dbManager.RegisterCustomer(...);
            Assert.IsTrue(success);
        }


        [TestMethod]
        public void RetrieveCustomers()
        {
            IList<CostumerModel> list = dbManager.RetrieveCustomers();
            Assert.IsNotNull(list);
            if (list.Count != 0)
            {
                foreach (CustumerModel element in list)
                {
                    Assert.IsNotNull(element);
                }
            }
            else Assert.IsNotNull(null);
        }

        [TestMethod]
        public void EditCustomerName()
        {
            bool success = dbManager.EditCustomerName(...);
            Assert.IsTrue(success);
        }

        [TestMethod]
        public void InsertIntoBatchQueue()
        {
            bool success = dbManager.InsertIntoBatchQueue(...);
            Assert.IsTrue(success);
        }

        [TestMethod]
        public void RetrieveFromBatchQueue()
        {
            IList<BatchModel> list = dbManager.RetrieveFromBatchQueue();
            Assert.IsNotNull(list);
            if (list.Count != 0)
            {
                foreach (BatchModel element in list)
                {
                    Assert.IsNotNull(element);
                }
            }
            else Assert.IsNotNull(null);
        }

        [TestMethod]
        public void RemoveFromBatchQueue()
        {
            bool success = dbManager.RemoveFromBatchQueue(...);
            Assert.IsTrue(success);
        }

        [TestMethod]
        public void RegisterBatch()
        {
            bool success = dbManager.RegisterBatch(...);
            Assert.IsTrue(success);
        }

        [TestMethod]
        public void RegisterBatch()
        {
            bool success = dbManager.RegisterBatchAndAlarm(...);
            Assert.IsTrue(success);
        }

        [TestMethod]
        public void RetrieveBatches()
        {
            IList<BatchModel> list1 = dbManager.RetrieveBatches();
            IList<BatchModel> list2 = dbManager.RetrieveBatches(...);
            IList<BatchModel> list3 = dbManager.RetrieveBatches(...);
            IList<BatchModel> list4 = dbManager.RetrieveBatches(...);
            IList<BatchModel> list5 = dbManager.RetrieveBatches(...);
            BatchModel batch = dbManager.RetrieveBatch(...);
            Assert.IsNotNull(list);
            if (list.Count != 0)
            {
                foreach (BatchModel element in list)
                {
                    Assert.IsNotNull(element);
                }
            }
            else Assert.IsNotNull(null);
        }

        [TestMethod]
        public void SetSale()
        {
            bool success = dbManager.SetSale(...);
            Assert.IsTrue(success);
        }

        [TestMethod]
        public void RetrieveBatchValues()
        {
            IList<BatchValueCollection> list = dbManager.RetrieveBatchValues(...);
            Assert.IsNotNull(list);
            if (list.Count != 0)
            {
                foreach (BatchValueCollection element in list)
                {
                    Assert.IsNotNull(element);
                    foreach (KeyValuePair batchValue in list)
                    {
                        Assert.IsNotNull(batchValue);

                    }
                }
            }
            else Assert.IsNotNull(null);
        }

        [TestMethod]
        public void RetrieveBeers()
        {
            IList<BeerModel> list = dbManager.RetrieveBeers();
            Assert.IsNotNull(list);
            if (list.Count != 0)
            {
                foreach (BeerModel element in list)
                {
                    Assert.IsNotNull(element);
                }
            }
            else Assert.IsNotNull(null);
        }

        [TestMethod]
        public void RetrieveAlarms()
        {
            IList<AlarmModel> list1 = dbManager.RetrieveAlarms();
            IList<AlarmModel> list2 = dbManager.RetrieveAlarms(...);
            AlarmModel = dbManager.RetrieveAlarm(...);
            Assert.IsNotNull(list);
            if (list.Count != 0)
            {
                foreach (AlarmModel element in list)
                {
                    Assert.IsNotNull(element);
                }
            }
            else Assert.IsNotNull(null);
        }

        [TestMethod]
        public void SetAlarmHandler()
        {
            bool success = dbManager.SetSale(...);
            Assert.IsTrue(success);
        }

        [TestMethod]
        public void BuildDatabase()
        {
            string s = "";


            bool success = dbManager.ExecuteQuery(...);
            Assert.IsTrue(success);
        }
    }
}
