using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace ProjectSCAM.Models.Logic
{
    public class DBManager
    {
        /// <summary>
        /// The Query Executer.
        /// </summary>
        private QueryExecuter exe;

        /// <summary>
        /// The length of a timestamp.
        /// </summary>
        private readonly int TIMESTAMP_LENGTH = 23;
        /// <summary>
        /// the length of an expiration date timestamp.
        /// </summary>
        private readonly int EXPIRATION_DATE_LENGTH = 10;

        internal void RetrieveUser()
        {
            throw new NotImplementedException();
        }

        /// <summary>
        /// Query appendage used when running queries on the Batches table.
        /// Used when only succeeded queries are wanted.
        /// </summary>
        private readonly string SUCCEEDED_BATCHES_ONLY_APPEND = " WHERE succeeded = true";

        /// <summary>
        /// Query appendage used when retrieving batches.
        /// Used when batches should be ordered by timestamp with the newest first.
        /// </summary>
        private readonly string ORDER_BY_TIMESTAMP_END_APPEND = " ORDER BY timestampend DESC";

        /// <summary>
        /// Constructor for the DBManager.
        /// A QueryExecuter is created inside the DBManager and connection is initialized.
        /// </summary>
        /// <param name="server"></param>
        /// <param name="port"></param>
        /// <param name="userid"></param>
        /// <param name="password"></param>
        /// <param name="database"></param>
        public DBManager(string server, string port, string userid, string password, string database)
        {
            exe = new QueryExecuter(server, port, userid, password, database);
        }

        /// <summary>
        /// Constructor for the DBManager.
        /// An already initialized QueryExecuter is provided.
        /// </summary>
        /// <param name="exe"></param>
        public DBManager(QueryExecuter exe)
        {
            this.exe = exe;
        }

        /// <summary>
        /// Retrieve all users.
        /// </summary>
        /// <returns></returns>
        public IList<UserType> RetrieveUserTypes()
        {
            string append = ";";
            return exe.RetrieveUserTypes(append);
        }

        /// <summary>
        /// Retrieve all recipes.
        /// </summary>
        /// <returns></returns>
        public IList<RecipeModel> RetrieveRecipes()
        {
            string append = ";";
            return exe.RetrieveRecipes(append);
        }

        /// <summary>
        /// Insert a machine into the db.
        /// </summary>
        /// <param name="ipAddress"></param>
        /// <param name="description"></param>
        /// <returns></returns>
        public bool RegisterMachine(string ipAddress, string description)
        {
            string query = "INSERT INTO Machines(ipaddress, description)" +
                "VALUES('" + ipAddress + "', '" + description + "');";

            return exe.ExecuteQuery(query);
        }

        /// <summary>
        /// Retrieve all machines from the db.
        /// </summary>
        /// <returns></returns>
        public IList<MachineModel> RetrieveMachines()
        {
            string append = ";";
            return exe.RetrieveMachines(append);
        }

        /// <summary>
        /// Insert a user into the database.
        /// The user will be registered as active.
        /// </summary>
        /// <param name="username"></param>
        /// <param name="password"></param>
        /// <param name="firstName"></param>
        /// <param name="lastName"></param>
        /// <param name="email"></param>
        /// <param name="phoneNumber"></param>
        /// <param name="userType"></param>
        /// <returns></returns>
        public bool RegisterUser(string username, string password, string firstName,
            string lastName, string email, string phoneNumber, int userType)
        {
            string query = "INSERT INTO Users(username, password, firstname, " +
                "lastname, email, phonenumber, isactive, usertype) " +
                "VALUES('" + username + "', '" + password + "', '" + firstName + "', '" +
                lastName + "', '" + email + "', '" + phoneNumber + "', true, '" + userType + "');";

            return exe.ExecuteQuery(query);
        }

        /// <summary>
        /// Retrieve all users.
        /// </summary>
        /// <param name="activeOnly"></param>
        /// <returns></returns>
        public IList<UserModel> RetrieveUsers(bool activeOnly)
        {
            string append = "";
            if (activeOnly)
            {
                append = append + " WHERE isactive = true;";
            }
            else
            {
                append = ";";
            }
            return exe.RetrieveUsers(append);
        }

        /// <summary>
        /// Retrieve a specific user.
        /// </summary>
        /// <returns></returns>
        public UserModel RetrieveUser(int id, bool activeOnly)
        {
            string append = " WHERE userid = " + id;
            if (activeOnly)
            {
                append = append + " AND isactive = true;";
            }
            else
            {
                append = append + ";";
            }
            IList<UserModel> users = exe.RetrieveUsers(append);
            if (users != null)
            {
                if (users.Count != 0)
                {
                    return users.First();
                }
            }
            return null;
        }

        /// <summary>
        /// Retrieve a specific user.
        /// </summary>
        /// <param name="username"></param>
        /// <param name="password"></param>
        /// <param name="activeOnly"></param>
        /// <returns></returns>
        public UserModel RetrieveUser(string username, string password, bool activeOnly)
        {
            string append = " WHERE username = '" + username + "' AND password = '" + password + "'";
            if (activeOnly)
            {
                append = append + " AND isactive = true;";
            }
            else
            {
                append = append + ";";
            }
            IList<UserModel> users = exe.RetrieveUsers(append);
            if (users != null)
            {
                if (users.Count != 0)
                {
                    return users.First();
                }
            }
            return null;
        }

        /// <summary>
        /// The chosen user is made inactive.
        /// </summary>
        /// <param name="userid"></param>
        /// <returns></returns>
        public bool MakeUserInactive(int userid)
        {
            string query = "UPDATE Users SET isActive = false WHERE userid = " + userid + ";";
            return exe.ExecuteQuery(query);
        }

        /// <summary>
        /// Register a customer.
        /// </summary>
        /// <param name="customerName"></param>
        /// <returns></returns>
        public bool RegisterCustomer(string customerName)
        {
            string query = "INSERT INTO Customers(customername) VALUES('" + customerName + "');";
            return exe.ExecuteQuery(query);
        }

        /// <summary>
        /// Retrieve all customers.
        /// </summary>
        /// <returns></returns>
        public IList<CustomerModel> RetrieveCustomers()
        {
            string append = ";";
            return exe.RetrieveCustomers(append);
        }

        /// <summary>
        /// Edit the name of a customer.
        /// </summary>
        /// <param name="customerId"></param>
        /// <param name="newName"></param>
        /// <returns></returns>
        public bool EditCustomerName(int customerId, string newName)
        {
            string query = "UPDATE Customers SET customername = '" + newName +
                "' WHERE customerid = " + customerId + ";";
            return exe.ExecuteQuery(query);
        }

        /// <summary>
        /// Insert a batch into the batch queue in the db.
        /// </summary>
        /// <param name="queueid"></param>
        /// <param name="priority"></param>
        /// <param name="amount"></param>
        /// <param name="speed"></param>
        /// <param name="beerid"></param>
        /// <returns></returns>
        public bool RegisterIntoBatchQueue(int queueid,
            int priority, int amount, int speed, int beerid)
        {
            string query = " INSERT INTO BatchQueue VALUES(" + queueid + ", " +
                priority + ", " + amount + ", " + speed + ", " + beerid + ");";

            return exe.ExecuteQuery(query);
        }

        /// <summary>
        /// Retrieve all batches from the batch queue.
        /// The batches are ordered by priority.
        /// </summary>
        /// <returns></returns>
        public IList<BatchQueueModel> RetrieveFromBatchQueue()
        {
            string append = " ORDER BY priority ASC;";
            return exe.RetrieveFromBatchQueue(append);
        }

        /// <summary>
        /// Edit the priority of a batch in the batch queue.
        /// </summary>
        /// <param name="queueId"></param>
        /// <param name="priority"></param>
        /// <returns></returns>
        public bool EditPriority(int queueId, int priority)
        {
            string query = "UPDATE BatchQueue SET priority = " + priority +
                " WHERE queueid = " + queueId + ";";
            return exe.ExecuteQuery(query);
        }

        /// <summary>
        /// The chosen batch is removed from the batch queue.
        /// </summary>
        /// <param name="queueId"></param>
        /// <returns></returns>
        public bool RemoveFromBatchQueue(int queueId)
        {
            string append = " WHERE queueid = " + queueId + ";";
            return exe.RemoveFromBatchQueue(append);
        }

        /// <summary>
        /// Insert a batch into the db.
        /// </summary>
        /// <param name="acceptableProducts"></param>
        /// <param name="defectProducts"></param>
        /// <param name="timestampStart"></param>
        /// <param name="timestampEnd"></param>
        /// <param name="expirationDate"></param>
        /// <param name="succeeded"></param>
        /// <param name="performance"></param>
        /// <param name="quality"></param>
        /// <param name="availability"></param>
        /// <param name="speed"></param>
        /// <param name="beerId"></param>
        /// <param name="machine"></param>
        /// <param name="temperatureValues"></param>
        /// <param name="humidityValues"></param>
        /// <param name="vibrationsValues"></param>
        /// <returns></returns>
        public bool RegisterBatch(int acceptableProducts, int defectProducts,
            string timestampStart, string timestampEnd, string expirationDate, bool succeeded,
            double performance, double quality, double availability,
            int speed, int beerId, int machine,
            IList<KeyValuePair<string, double>> temperatureValues,
            IList<KeyValuePair<string, double>> humidityValues,
            IList<KeyValuePair<string, double>> vibrationsValues)
        {
            if (acceptableProducts >= 0 && defectProducts >= 0 &&
                timestampStart.Length == TIMESTAMP_LENGTH &&
                timestampEnd.Length == TIMESTAMP_LENGTH &&
                expirationDate.Length == EXPIRATION_DATE_LENGTH &&
                performance >= 0 && performance <= 1 &&
                quality >= 0 && quality <= 1 &&
                availability >= 0 && availability <= 1)
            {
                string query = MakeInsertIntoBatchesQuery(acceptableProducts, defectProducts,
                    timestampStart, timestampEnd, expirationDate, succeeded,
                    performance, quality, availability, speed, beerId, machine);

                KeyValuePair<bool, AlarmModel> result = exe.RegisterBatch(acceptableProducts,
                    temperatureValues, humidityValues,
                    vibrationsValues, query, null);

                return result.Key;
            }
            else { return false; }
        }

        /// <summary>
        /// Insert a batch and an alarm into the db
        /// </summary>
        /// <param name="acceptableProducts"></param>
        /// <param name="defectProducts"></param>
        /// <param name="timestampStart"></param>
        /// <param name="timestampEnd"></param>
        /// <param name="expirationDate"></param>
        /// <param name="succeeded"></param>
        /// <param name="performance"></param>
        /// <param name="quality"></param>
        /// <param name="availability"></param>
        /// <param name="speed"></param>
        /// <param name="beerId"></param>
        /// <param name="machine"></param>
        /// <param name="temperatureValues"></param>
        /// <param name="humidityValues"></param>
        /// <param name="vibrationsValues"></param>
        /// <param name="alarmTimestamp"></param>
        /// <param name="stopReason"></param>
        /// <returns></returns>
        public AlarmModel RegisterBatchAndAlarm(int acceptableProducts, int defectProducts,
            string timestampStart, string timestampEnd, string expirationDate, bool succeeded,
            double performance, double quality, double availability,
            int speed, int beerId, int machine,
            IList<KeyValuePair<string, double>> temperatureValues,
            IList<KeyValuePair<string, double>> humidityValues,
            IList<KeyValuePair<string, double>> vibrationsValues,
            string alarmTimestamp, int stopReason)
        {
            if (acceptableProducts >= 0 && defectProducts >= 0 &&
            timestampStart.Length == TIMESTAMP_LENGTH &&
            timestampEnd.Length == TIMESTAMP_LENGTH &&
            expirationDate.Length == EXPIRATION_DATE_LENGTH &&
            performance >= 0 && performance <= 1 &&
            quality >= 0 && quality <= 1 &&
            availability >= 0 && availability <= 1 &&
                alarmTimestamp.Length == TIMESTAMP_LENGTH)
            {
                string batchQuery = MakeInsertIntoBatchesQuery(acceptableProducts, defectProducts,
                    timestampStart, timestampEnd, expirationDate, succeeded,
                    performance, quality, availability, speed, beerId, machine);

                StringBuilder alarmQuery = new StringBuilder();
                alarmQuery.Append("INSERT INTO Alarms(timestamp, stopreason, handledby, batch) " +
                "VALUES('" + alarmTimestamp + "', " + stopReason + ", null, ");

                KeyValuePair<bool, AlarmModel> result = exe.RegisterBatch(acceptableProducts,
                    temperatureValues, humidityValues,
                    vibrationsValues, batchQuery, alarmQuery);

                return result.Value;
            }
            else { return null; }
        }

        /// <summary>
        /// Retrieve all batches.
        /// </summary>
        /// <param name="succeededOnly"></param>
        /// <returns></returns>
        public IList<BatchModel> RetrieveBatches(bool succeededOnly)
        {
            StringBuilder append = new StringBuilder();
            if (succeededOnly)
            {
                append.Append(SUCCEEDED_BATCHES_ONLY_APPEND);
            }
            append.Append(ORDER_BY_TIMESTAMP_END_APPEND + ";");
            return exe.RetrieveBatches(append.ToString());
        }

        /// <summary>
        /// Retrieve a specific amount of batches.
        /// The batches retrieved are the newest.
        /// </summary>
        /// <param name="amount"></param>
        /// <param name="succeededOnly"></param>
        /// <returns></returns>
        public IList<BatchModel> RetrieveBatchesByAmount(int amount, bool succeededOnly)
        {
            StringBuilder append = new StringBuilder();
            if (succeededOnly)
            {
                append.Append(SUCCEEDED_BATCHES_ONLY_APPEND);
            }
            append.Append(ORDER_BY_TIMESTAMP_END_APPEND + " LIMIT " + amount + ";");
            return exe.RetrieveBatches(append.ToString());
        }

        /// <summary>
        /// Retrieve batches produced in a specific month and year.
        /// </summary>
        /// <param name="month"></param>
        /// <param name="year"></param>
        /// <param name="succeededOnly"></param>
        /// <returns></returns>
        public IList<BatchModel> RetrieveBatchesByMonth(string month, string year, bool succeededOnly)
        {
            if (month.Length == 1)
            {
                month = "0" + month;
            }
            if (month.Length == 2 && year.Length == 4)
            {
                StringBuilder append = new StringBuilder();
                if (succeededOnly)
                {
                    append.Append(SUCCEEDED_BATCHES_ONLY_APPEND + " AND");
                }
                else { append.Append(" WHERE"); }

                append.Append(" timestampEnd LIKE '" + month + "/" + "__" + "/" + year + "%'");
                append.Append(ORDER_BY_TIMESTAMP_END_APPEND + ";");
                return exe.RetrieveBatches(append.ToString());
            }
            else throw new Exception();
        }

        /// <summary>
        /// Retrieve batches produced on a specific machine.
        /// </summary>
        /// <param name="machine"></param>
        /// <param name="succeededOnly"></param>
        /// <returns></returns>
        public IList<BatchModel> RetrieveBatchesByMachine(int machine, bool succeededOnly)
        {
            StringBuilder append = new StringBuilder();
            if (succeededOnly)
            {
                append.Append(SUCCEEDED_BATCHES_ONLY_APPEND + " AND");
            }
            else { append.Append(" WHERE"); }
            append.Append(" machine = " + machine + ORDER_BY_TIMESTAMP_END_APPEND + ";");
            return exe.RetrieveBatches(append.ToString());
        }

        /// <summary>
        /// Retrieve batches made with a specific recipe.
        /// </summary>
        /// <param name="beerId"></param>
        /// <param name="succeededOnly"></param>
        /// <returns></returns>
        public IList<BatchModel> RetrieveBatchesByRecipe(int beerId, bool succeededOnly)
        {
            StringBuilder append = new StringBuilder();
            if (succeededOnly)
            {
                append.Append(SUCCEEDED_BATCHES_ONLY_APPEND + " AND");
            }
            else { append.Append(" WHERE"); }
            append.Append(" Batches.beerid = " + beerId + ";");
            return exe.RetrieveBatches(append.ToString());
        }

        /// <summary>
        /// Retrieve a specific batch.
        /// </summary>
        /// <param name="batchId"></param>
        /// <returns></returns>
        public BatchModel RetrieveBatch(int batchId)
        {
            string append = " WHERE batchid = " + batchId + ";";
            IList<BatchModel> list = exe.RetrieveBatches(append);
            if (list.Count == 1)
            {
                return list.First();
            }
            else return null;
        }

        /// <summary>
        /// Register the sale of a batch
        /// </summary>
        /// <param name="batchId"></param>
        /// <param name="customerId"></param>
        /// <returns></returns>
        public bool SetSale(int batchId, int customerId)
        {
            string query = "UPDATE Batches SET soldto = " + customerId +
                " WHERE batchid = " + batchId + ";";
            return exe.ExecuteQuery(query);
        }

        /// <summary>
        /// Retrieve temperature, humidity and vibration values for a specific batch.
        /// </summary>
        /// <param name="batchId"></param>
        /// <returns></returns>
        public BatchValueCollection RetrieveBatchValues(int batchId)
        {
            string append = " WHERE belongingto = " + batchId + ";";
            return exe.RetrieveBatchValues(append);
        }

        /// <summary>
        /// Retrieve beers from a specific batch.
        /// </summary>
        /// <param name="batchId"></param>
        /// <returns></returns>
        public IList<BeerModel> RetrieveBeers(int batchId)
        {
            string append = " WHERE belongingto = " + batchId + ";";
            return exe.RetrieveBeers(append);
        }

        /// <summary>
        /// Retrieve all alarms.
        /// </summary>
        /// <returns></returns>
        public IList<AlarmModel> RetrieveAlarms()
        {
            string append = " ORDER BY timestamp ASC;";
            return exe.RetrieveAlarms(append);
        }

        /// <summary>
        /// Retrieve a specific amount of alarms.
        /// The alarms retrieved are the newest.
        /// </summary>
        /// <param name="amount"></param>
        /// <returns></returns>
        public IList<AlarmModel> RetrieveAlarms(int amount)
        {
            string append = " ORDER BY timestamp ASC LIMIT " + amount + ";";
            return exe.RetrieveAlarms(append);
        }

        /// <summary>
        /// Retrieve alarms that require handling.
        /// </summary>
        /// <returns></returns>
        public IList<AlarmModel> RetrieveUnhandledAlarms()
        {
            string append = " WHERE actionrequired AND handledby IS NULL ORDER BY timestamp ASC;";
            return exe.RetrieveAlarms(append);
        }

        /// <summary>
        /// Retrieve a specific alarm.
        /// </summary>
        /// <param name="alarmId"></param>
        /// <returns></returns>
        public AlarmModel RetrieveAlarm(int alarmId)
        {
            string append = " WHERE alarmid = " + alarmId + ";";
            IList<AlarmModel> list = exe.RetrieveAlarms(append);
            if (list.Count == 1)
            {
                return list.First();
            }
            else return null;
        }

        /// <summary>
        /// Register that a user has handled an alarm.
        /// </summary>
        /// <param name="userId"></param>
        /// <param name="alarmId"></param>
        /// <returns></returns>
        public bool SetAlarmHandler(int userId, int alarmId)
        {
            string query = "UPDATE Alarms SET handledby = " + userId +
                " WHERE alarmid = " + alarmId + ";";
            return exe.ExecuteQuery(query);
        }

        /// <summary>
        /// Returns a query that inserts a new batch into the batches table and returns the batch id.
        /// </summary>
        /// <param name="acceptableProducts"></param>
        /// <param name="defectProducts"></param>
        /// <param name="timestampStart"></param>
        /// <param name="timestampEnd"></param>
        /// <param name="expirationDate"></param>
        /// <param name="succeeded"></param>
        /// <param name="performance"></param>
        /// <param name="quality"></param>
        /// <param name="availability"></param>
        /// <param name="speed"></param>
        /// <param name="beerId"></param>
        /// <param name="machine"></param>
        /// <returns></returns>
        private string MakeInsertIntoBatchesQuery(int acceptableProducts, int defectProducts,
            string timestampStart, string timestampEnd, string expirationDate, bool succeeded,
            double performance, double quality, double availability,
            int speed, int beerId, int machine)
        {
            double oee = performance * quality * availability;

            string perf = performance.ToString();
            string qual = quality.ToString();
            string avai = availability.ToString();
            string oeeString = oee.ToString();

            string[] oeeStrings = { perf, qual, avai, oeeString };

            for (int i = 0; i < oeeStrings.Length; i++)
            {
                if (oeeStrings[i].Length > 12)
                {
                    oeeStrings[i] = oeeStrings[i].Substring(0, 12);
                }
            }

            return String.Format(("INSERT INTO Batches VALUES({0}, {1}, '{2}', '{3}', '{4}'," +
                "{5}, '{6}', '{7}', '{8}', '{9}', {10}, {11}, {12}, null, false) RETURNING batchid;"),
                acceptableProducts, defectProducts, timestampStart, timestampEnd, expirationDate,
                succeeded, oeeStrings[0], oeeStrings[1], oeeStrings[2], oeeStrings[3], speed, beerId, machine);
        }
    }
}
