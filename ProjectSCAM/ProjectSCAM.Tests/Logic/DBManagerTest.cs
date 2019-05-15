using Microsoft.VisualStudio.TestTools.UnitTesting;
using ProjectSCAM.Models;
using ProjectSCAM.Models.Logic;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;

namespace ProjectSCAM.Tests.Logic
{
    [TestClass]
    public class DBManagerTest
    {
        private DBManager dbManager;
        private QueryExecuter exe;

        // server, port, user id, password, database
        private readonly string[] DB_INFO = {"balarama.db.elephantsql.com",
            "5432", "ppcrexqw", "HL8HORvW5RUPUlBUcf_PIcZWxjlOoc1F", "ppcrexqw"};

        public DBManagerTest()
        {
            exe = new QueryExecuter(DB_INFO[0], DB_INFO[1], DB_INFO[2], DB_INFO[3], DB_INFO[4]);
            dbManager = new DBManager(exe);
        }

        [TestMethod]
        public void ResetDatabase()
        {
            // Get the current directory
            string directory = Directory.GetCurrentDirectory();
            // Set the correct path to the file
            int index = directory.IndexOf("ProjectSCAM.Tests");
            string path = directory.Remove(index) + "\\ProjectSCAM.Tests\\Logic\\DB_SQL.txt";
            if (File.Exists(path))
            {
                // Read the file
                string query = File.ReadAllText(path);
                // Execute the query
                bool success = exe.ExecuteQuery(query);
                // Check
                Assert.IsTrue(success);
            }
            else Assert.IsTrue(false);
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
            else Assert.IsTrue(false);
        }

        [TestMethod]
        public void RetrieveStopReasons()
        {
            IList<StopReasonModel> list = dbManager.RetrieveStopReasons();
            Assert.IsNotNull(list);
            if (list.Count != 0)
            {
                foreach (StopReasonModel element in list)
                {
                    Assert.IsNotNull(element);
                }
            }
            else Assert.IsTrue(false);
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
            else Assert.IsTrue(false);
        }

        /// <summary>
        /// Only works once after the DB has been reset.
        /// </summary>
        [TestMethod]
        public void RegisterMachine()
        {
            bool success = dbManager.RegisterMachine("Test Data", "This is test data", 5,
                "1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12", "13", "14", "15", "16", "17", "18");
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
            else Assert.IsTrue(false);
        }

        [TestMethod]
        public void EditMachine()
        {
            bool success = dbManager.RegisterMachine("Test Data Edit", "This is edited test data", 6,
                "1e", "2e", "3e", "4e", "5e", "6e", "7e", "8e", "9e", "10e", "11e", "12e", "13e", "14e", "15e", "16e", "17e", "18e");
            Assert.IsTrue(success);
        }

        /// <summary>
        /// RetrieveUsers, RetrieveUser, MakeInactive, RegisterUser
        /// </summary>
        [TestMethod]
        public void UserTest()
        {
            IList<UserModel> list = dbManager.RetrieveUsers(true);
            Assert.IsNotNull(list); //Test RetrieveUsers

            UserModel user1 = dbManager.RetrieveUser(1, true);
            Assert.IsNotNull(user1); //Test RetrieveUser by id

            UserModel user2 = dbManager.RetrieveUser("admin", "password", true);
            Assert.IsNotNull(user2); //Test RetrieveUser by username and password

            bool userMadeInactive = false;
            int? highestId = null;

            if (list.Count != 0) // Test RetrieveUsers
            {
                foreach (UserModel element in list)
                {
                    Assert.IsNotNull(element); //Test RetrieveUsers
                    if (highestId == null)
                    {
                        highestId = element.Id;
                    }
                    else if (element.Id > highestId)
                    {
                        highestId = element.Id;
                    }
                    if (!userMadeInactive)
                    {
                        userMadeInactive = dbManager.MakeUserInactive(2);
                        Assert.IsTrue(userMadeInactive); // Test MakeInactive
                    }
                }

                int newUserid = (int)highestId + 1;

                bool registered = dbManager.RegisterUser("Test" + newUserid, "Password", "Test", "User", "test" + newUserid + "@mail.com", "00000000", 1);
                Assert.IsTrue(registered); // Test RegisterUser
            }
            else Assert.IsTrue(false);
        }

        [TestMethod]
        public void RegisterCustomer()
        {
            bool success = dbManager.RegisterCustomer("Test");
            Assert.IsTrue(success);
        }

        /// <summary>
        /// RetrieveCustomers, EditCustomerName
        /// </summary>
        [TestMethod]
        public void CustomerTest()
        {
            IList<CustomerModel> list = dbManager.RetrieveCustomers();
            Assert.IsNotNull(list); // Test RetrieveCustomers

            int? customerId = null;

            if (list.Count != 0) // Test RetrieveCustomers
            {
                foreach (CustomerModel element in list)
                {
                    Assert.IsNotNull(element); // Test RetrieveCustomers
                    if (customerId == null)
                    {
                        customerId = element.Id;
                    }
                }
                if (customerId != null)
                {
                    bool success = dbManager.EditCustomerName((int)customerId, "Test");
                    Assert.IsTrue(success); // Test EditCustomer
                }
                else Assert.IsTrue(false);
            }
            else Assert.IsTrue(false);
        }

        /// <summary>
        /// RetrieveFromBatchQueue, RegisterIntoBatchQueue, EditPriority, RemoveFromBatchQueue
        /// </summary>
        [TestMethod]
        public void BatchQueueTest()
        {
            IList<BatchQueueModel> list = dbManager.RetrieveFromBatchQueue();
            Assert.IsNotNull(list); // Test RetrieveFromBatchQueue

            int? highestId = null;

            if (list.Count != 0) // Test RetrieveFromBatchQueue
            {
                foreach (BatchQueueModel element in list)
                {
                    Assert.IsNotNull(element); // Test RetrieveFromBatchQueue
                    if (highestId == null)
                    {
                        highestId = element.Id;
                    }
                    else if (element.Id > highestId)
                    {
                        highestId = element.Id;
                    }
                }
            }
            else Assert.IsTrue(false);

            if (highestId != null)
            {
                int newId = (int)highestId + 1;

                bool regiSuccess = dbManager.RegisterIntoBatchQueue(newId, 10, 100, 600, 0);
                Assert.IsTrue(regiSuccess); // Test RegisterIntoBatchQueue

                bool editSuccess = dbManager.EditPriority(newId, 20);
                Assert.IsTrue(editSuccess); // Test priority

                bool remoSuccess = dbManager.RemoveFromBatchQueue(newId);
                Assert.IsTrue(remoSuccess); // Test RemoveFromBatchQueue
            }
            else Assert.IsTrue(false);
        }

        /// <summary>
        /// RegisterBatch, RegisterBatchAndAlarm
        /// </summary>
        [TestMethod]
        public void BatchAndAlarmTest()
        {
            IList<KeyValuePair<string, double>> tList = new List<KeyValuePair<string, double>>();
            IList<KeyValuePair<string, double>> hList = new List<KeyValuePair<string, double>>();
            IList<KeyValuePair<string, double>> vList = new List<KeyValuePair<string, double>>();

            for (int i = 0; i < 7; i++)
            {
                KeyValuePair<string, double> pair = new KeyValuePair<string, double>("15/02/2019 10:45:1" + i + ".500", 10.2 + i);
                tList.Add(pair);
            }
            for (int i = 0; i < 7; i++)
            {
                KeyValuePair<string, double> pair = new KeyValuePair<string, double>("15/02/2019 10:45:1" + i + ".500", 5.7 + i);
                hList.Add(pair);
            }
            for (int i = 0; i < 7; i++)
            {
                KeyValuePair<string, double> pair = new KeyValuePair<string, double>("15/02/2019 10:45:1" + i + ".500", 2.5 + i);
                vList.Add(pair);
            }

            string date = DateTime.Now.ToString();
            bool success = dbManager.RegisterBatch(10, 50, "15/02/2019 10:45:10.500", "15/02/2019 10:45:16.500", "15/08/2019",
                true, 0.5, 0.6, 1.0, 600, 0, 1, tList, hList, vList);
            Assert.IsTrue(success); // Test RegisterBatch

            AlarmModel alarm = dbManager.RegisterBatchAndAlarm(10, 50, "15/02/2019 10:45:10.500", "15/02/2019 10:45:16.300", "15/08/2019",
                true, 0.5, 0.6, 1.0, 600, 0, 1, tList, hList, vList, "15/02/2019 10:45:16.500", 11);
            Assert.IsNotNull(alarm); // Test RegisterBatchAndAlarm
        }

        /// <summary>
        /// RetrieveBatches, RetrieveBatch
        /// </summary>
        [TestMethod]
        public void RetrieveBatches()
        {
            IList<BatchModel> list1 = dbManager.RetrieveBatches(false);
            IList<BatchModel> list2 = dbManager.RetrieveBatchesByAmount(3, false);
            IList<BatchModel> list3 = dbManager.RetrieveBatchesByMonth("3", "2019", false);
            IList<BatchModel> list4 = dbManager.RetrieveBatchesByMachine(1, false);
            IList<BatchModel> list5 = dbManager.RetrieveBatchesByRecipe(0, false);

            IList<BatchModel>[] lists = { list1, list2, list3, list4, list5 };

            int? batchId = null;

            for (int i = 0; i < lists.Length; i++)
            {
                Assert.IsNotNull(lists[i]);
                if (lists[i].Count != 0)
                {
                    foreach (BatchModel element in lists[i])
                    {
                        Assert.IsNotNull(element); // Test RetrieveBatches methods
                        if (batchId == null)
                        {
                            batchId = element.Id;
                        }
                    }
                }
                else Assert.IsNotNull(null);
            }

            BatchModel batch = dbManager.RetrieveBatch(1);
            Assert.IsNotNull(batch); // Test RetrieveBatch
        }

        [TestMethod]
        public void SetSale()
        {
            bool success = dbManager.SetSale(1, 1);
            Assert.IsTrue(success);
        }

        [TestMethod]
        public void RecallBatch()
        {
            bool success = dbManager.RecallBatch(1);
            Assert.IsTrue(success);
        }

        [TestMethod]
        public void RetrieveBatchValues()
        {
            BatchValueCollection values = dbManager.RetrieveBatchValues(1);
            Assert.IsNotNull(values);
            IList<KeyValuePair<string, double>>[] array = values.ToArray();
            for (int i = 0; i < 3; i++)
            {
                if (array[i].Count != 0)
                {
                    foreach (KeyValuePair<string, double> element in array[i])
                    {
                        Assert.IsNotNull(element);
                    }
                }
                else Assert.IsNotNull(null);
            }
        }

        [TestMethod]
        public void RetrieveBeers()
        {
            IList<BeerModel> list = dbManager.RetrieveBeers(1);
            Assert.IsNotNull(list);
            if (list.Count != 0)
            {
                foreach (BeerModel element in list)
                {
                    Assert.IsNotNull(element);
                }
            }
            else Assert.IsTrue(false);
        }

        [TestMethod]
        public void SetBeerAsDefect()
        {
            bool success = dbManager.SetBeerAsDefect(3, 1);
            Assert.IsTrue(success);
        }

        /// <summary>
        /// RetrieveAlarms, RetrieveAlarm
        /// </summary>
        [TestMethod]
        public void RetrieveAlarms()
        {
            IList<AlarmModel> list1 = dbManager.RetrieveAlarms();
            IList<AlarmModel> list2 = dbManager.RetrieveAlarms(2);
            IList<AlarmModel> list3 = dbManager.RetrieveUnhandledAlarms();
            IList<AlarmModel> list4 = dbManager.RetrieveUnhandledAlarms(1);
            IList<AlarmModel> list5 = dbManager.RetrieveAlarmsByMachine(1);
            IList<AlarmModel> list6 = dbManager.RetrieveAlarmsByMonth("3", "2019");
            IList<AlarmModel> list7 = dbManager.RetrieveAlarmsByStopReason(10);

            IList<AlarmModel>[] alarms = { list1, list2, list3, list4, list5, list6, list7 };

            int? alarmId = null;

            for (int i = 0; i < alarms.Length; i++)
            {
                Assert.IsNotNull(alarms[i]); // Testing RetrieveAlarms Methods

                if (alarms[i].Count != 0) // Testing RetrieveAlarms Methods
                {
                    foreach (AlarmModel element in alarms[i])
                    {
                        Assert.IsNotNull(element); // Testing RetrieveAlarms Methods
                        if (alarmId == null)
                        {
                            alarmId = element.Id;
                        }
                    }
                }
                else Assert.IsNotNull(null);
            }

            AlarmModel alarm = dbManager.RetrieveAlarm((int)alarmId);
            Assert.IsNotNull(alarm); // Testing RetrieveAlarm
        }

        [TestMethod]
        public void SetAlarmHandler()
        {
            bool success = dbManager.SetAlarmHandler(0, 0);
            Assert.IsTrue(success);
        }
    }
}
