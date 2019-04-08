using Npgsql;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Web;

namespace ProjectSCAM.Models.Logic
{
    public class DBManager
    {
        private QueryExecuter exe;

        private readonly int timestampLength = 23;
        private readonly int expirationDateLength = 10;

        // query appendages
        private string succeededBatchesOnlyAppend = " WHERE succeeded = true"; // to be used when running queries on the Batches table

        public DBManager(string server, string port, string userid, string password, string database)
        {
            exe = new QueryExecuter(InitConnection(server, port, userid, password, database));
        }

        /// <summary>
        /// Initializes a connection
        /// </summary>
        /// <param name="server"></param>
        /// <param name="port"></param>
        /// <param name="userid"></param>
        /// <param name="password"></param>
        /// <param name="database"></param>
        private NpgsqlConnection InitConnection(string server, string port, string userid, string password, string database)
        {
            // PostgeSQL-style connection string
            string connstring = String.Format("Server={0};Port={1};" +
                "User Id={2};Password={3};Database={4};",
                server, port, userid, password, database);
            // Making connection with Npgsql provider
            return new NpgsqlConnection(connstring);
        }

        public List<UserType> RetrieveUserTypes()
        {
            string append = ";";
            return exe.RetrieveUserTypes(append);
        }

        /// <summary>
        /// Retrieve all recipes
        /// </summary>
        /// <returns></returns>
        public LinkedList<RecipeModel> RetrieveRecipes()
        {
            string append = ";";
            return exe.RetrieveRecipes(append);
        }

        public LinkedList<MachineModel> RetrieveMachines()
        {
            string append = ";";
            return exe.RetrieveMachines(append);
        }

        /// <summary>
        /// Retrieve all active users
        /// </summary>
        /// <returns></returns>
        public LinkedList<UserModel> RetrieveUsers()
        {
            string append = " WHERE isactive = true;";
            return exe.RetrieveUsers(append);
        }

        public bool RegisterIntoBatchQueue(int queueid,
            int priority, int amount, int speed, int beerid)
        {
            string query = " INSERT INTO BatchQueue VALUES(" + queueid + ", " +
                priority + ", " + amount + ", " + speed + ", " + beerid + ");";
            return exe.RegisterIntoBatchQueue(query);
        }

        /// <summary>
        /// Retrieve all batches from batch queue
        /// </summary>
        /// <returns></returns>
        public LinkedList<BatchQueueModel> RetrieveFromBatchQueue()
        {
            string append = " ORDER BY priority DESC;";
            return exe.RetrieveFromBatchQueue(append);
        }

        public bool RemoveFromBatchQueue(int queueId)
        {
            string append = " WHERE queueid = " + queueId + ";";
            return exe.RemoveFromBatchQueue(append);
        }

        public bool RegisterBatch(int acceptableProducts, int defectProducts,
            string timestampStart, string timestampEnd, string expirationDate, bool succeeded,
            double performance, double quality, double availability,
            int speed, int beerId, int machine,
            List<KeyValuePair<string, double>> temperatureValues,
            List<KeyValuePair<string, double>> humidityValues,
            List<KeyValuePair<string, double>> vibrationsValues)
        {
            if (acceptableProducts >= 0 && defectProducts >= 0 &&
                timestampStart.Length == timestampLength &&
                timestampEnd.Length == timestampLength &&
                expirationDate.Length == expirationDateLength &&
                performance >= 0 && performance <= 1 &&
                quality >= 0 && quality <= 1 &&
                availability >= 0 && availability <= 1)
            {
                string query = MakeInsertIntoBatchesQuery(acceptableProducts, defectProducts,
                    timestampStart, timestampEnd, expirationDate, succeeded,
                    performance, quality, availability, speed, beerId, machine);

                return exe.RegisterBatch(query, temperatureValues, humidityValues, vibrationsValues);
            }
            else { return false; }
        }

        public bool RegisterBatchAndAlarm(int acceptableProducts, int defectProducts,
            string timestampStart, string timestampEnd, string expirationDate, bool succeeded,
            double performance, double quality, double availability,
            int speed, int beerId, int machine,
            List<KeyValuePair<string, double>> temperatureValues,
            List<KeyValuePair<string, double>> humidityValues,
            List<KeyValuePair<string, double>> vibrationsValues,
            string alarmTimestamp, int stopReason)
        {
            if (acceptableProducts >= 0 && defectProducts >= 0 &&
            timestampStart.Length == timestampLength &&
            timestampEnd.Length == timestampLength &&
            expirationDate.Length == expirationDateLength &&
            performance >= 0 && performance <= 1 &&
            quality >= 0 && quality <= 1 &&
            availability >= 0 && availability <= 1 &&
                alarmTimestamp.Length == timestampLength)
            {
                string batchQuery = MakeInsertIntoBatchesQuery(acceptableProducts, defectProducts,
                    timestampStart, timestampEnd, expirationDate, succeeded,
                    performance, quality, availability, speed, beerId, machine);

                StringBuilder alarmQuery = new StringBuilder();
                alarmQuery.Append("INSERT INTO Alarms(timestamp, stopreason, handledby, batch) " +
                "VALUES('" + alarmTimestamp + "', " + stopReason + ", null, ");

                return exe.RegisterBatch(batchQuery, temperatureValues, humidityValues, vibrationsValues, alarmQuery);
            }
            else { return false; }
        }

        /// <summary>
        /// Retrieve all batches
        /// </summary>
        /// <param name="succeededOnly"></param>
        /// <returns></returns>
        public LinkedList<BatchModel> RetrieveBatches(bool succeededOnly)
        {
            StringBuilder append = new StringBuilder();
            if (succeededOnly)
            {
                append.Append(succeededBatchesOnlyAppend);
            }
            append.Append(";");
            return exe.RetrieveBatches(append.ToString());
        }

        public LinkedList<BatchModel> RetrieveBatchesByAmount(int amount, bool succeededOnly)
        {
            StringBuilder append = new StringBuilder();
            if (succeededOnly)
            {
                append.Append(succeededBatchesOnlyAppend);
            }
            append.Append(" ORDER BY timestampstart DESC LIMIT " + amount + ";");
            return exe.RetrieveBatches(append.ToString());
        }

        public LinkedList<BatchModel> RetrieveBatchesByMonth(string month, string year, bool succeededOnly)
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
                    append.Append(succeededBatchesOnlyAppend + " AND");
                }
                else { append.Append(" WHERE"); }

                append.Append(" timestampEnd LIKE '" + month + "/" + "__" + "/" + year + "%'");
                return exe.RetrieveBatches(append.ToString());
            }
            else throw new Exception();
        }

        public LinkedList<BatchModel> RetrieveBatchesByMachine(int machine, bool succeededOnly)
        {
            StringBuilder append = new StringBuilder();
            if (succeededOnly)
            {
                append.Append(succeededBatchesOnlyAppend + " AND");
            }
            else { append.Append(" WHERE"); }
            append.Append(" machine = " + machine + ";");
            return exe.RetrieveBatches(append.ToString());
        }

        public LinkedList<BatchModel> RetrieveBatchesByRecipe(int beerId, bool succeededOnly)
        {
            StringBuilder append = new StringBuilder();
            if (succeededOnly)
            {
                append.Append(succeededBatchesOnlyAppend + " AND");
            }
            else { append.Append(" WHERE"); }
            append.Append(" beerid = " + beerId + ";");
            return exe.RetrieveBatches(append.ToString());
        }

        public BatchModel RetrieveBatch(int batchId)
        {
            string append = " WHERE batchid = " + batchId + ";";
            LinkedList<BatchModel> list = exe.RetrieveBatches(append);
            if (list.Count == 1)
            {
                return list.First();
            }
            else { return null; }
        }

        public BatchValueCollection RetrieveBatchValues(int batchId)
        {
            string append = " WHERE belongingto = " + batchId + ";";
            return exe.RetrieveBatchValues(batchId, append);
        }

        public List<AlarmModel> RetrieveAlarms()
        {
            string append = ";";
            return exe.RetrieveAlarms(append);
        }

        public List<AlarmModel> RetrieveAlarms(int amount)
        {
            string append = " ORDER BY timestamp DESC LIMIT " + amount + ";";
            return exe.RetrieveAlarms(append);
        }

        private string MakeInsertIntoBatchesQuery(int acceptableProducts, int defectProducts,
            string timestampStart, string timestampEnd, string expirationDate, bool succeeded,
            double performance, double quality, double availability,
            int speed, int beerId, int machine)
        {
            return "INSERT INTO Batches(acceptableproducts, defectproducts," +
               " timestampstart, timestampend, expirationdate, succeeded," +
               " performance, quality, availability, speed, beerid, machine)" +
               " VALUES(" + acceptableProducts + ", " + defectProducts + ", '" +
               timestampStart + "', '" + timestampEnd + "', '" + expirationDate + "', " +
               succeeded + ", " + performance + ", " + quality + ", " + availability + ", " +
               speed + ", " + beerId + ", " + machine + ") RETURNING batchid;";
        }
    }
}
