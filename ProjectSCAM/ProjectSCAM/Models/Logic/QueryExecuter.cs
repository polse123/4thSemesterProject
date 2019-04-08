using Npgsql;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Web;

namespace ProjectSCAM.Models.Logic
{
    public class QueryExecuter
    {
        /// <summary>
        /// The connection to the db.
        /// </summary>
        private NpgsqlConnection conn;

        /// <summary>
        /// Lock for the connection.
        /// </summary>
        private readonly object connectionLock;

        /// <summary>
        /// string array with the names of the three batch values tables.
        /// Index 0 holds the name of the temperature table.
        /// Index 1 holds the name of the humidity table.
        /// Index 2 holds the name of the vibration table.
        /// </summary>
        private string[] VALUE_TABLES = { "TemperatureValues", "HumidityValues", "VibrationValues" };

        /// <summary>
        /// Constructor for the Query Executer.
        /// </summary>
        /// <param name="conn"></param>
        public QueryExecuter(NpgsqlConnection conn)
        {
            this.conn = conn;
        }

        /// <summary>
        /// Executes a query.
        /// </summary>
        /// <param name="query"></param>
        /// <returns></returns>
        public bool ExecuteQuery(string query)
        {
            lock (connectionLock)
            {
                try
                {
                    conn.Open();
                    NpgsqlCommand command = new NpgsqlCommand(query, conn);
                    command.ExecuteNonQuery();
                    return true;
                }
                catch (NpgsqlException ex)
                {
                    return false;
                }
                finally
                {
                    conn.Close();
                }
            }
        }

        /// <summary>
        /// Retrieves user types from the db.
        /// The query append should start with " " or ";".
        /// </summary>
        /// <param name="append"></param>
        /// <returns></returns>
        public List<UserType> RetrieveUserTypes(string append)
        {
            string query = "SELECT * FROM UserTypes" + append;
            List<UserType> list = new List<UserType>();

            lock (connectionLock)
            {
                try
                {
                    conn.Open();
                    NpgsqlCommand command = new NpgsqlCommand(query, conn);
                    NpgsqlDataReader dr = command.ExecuteReader();
                    while (dr.Read())
                    {
                        UserType type = new UserType((int)dr[0], dr[1].ToString().Trim());
                        list.Add(type);
                    }
                }
                catch (NpgsqlException ex)
                {
                    throw ex;
                }
                finally
                {
                    conn.Close();
                }
            }
            return list;
        }

        /// <summary>
        /// Retrieves recipes from the db.
        /// The query append should start with " " or ";".
        /// </summary>
        /// <param name="append"></param>
        /// <returns></returns>
        public LinkedList<RecipeModel> RetrieveRecipes(string append)
        {
            string query = "SELECT * FROM Recipes" + append;
            LinkedList<RecipeModel> list = new LinkedList<RecipeModel>();

            lock (connectionLock)
            {
                try
                {
                    conn.Open();
                    NpgsqlCommand command = new NpgsqlCommand(query, conn);
                    NpgsqlDataReader dr = command.ExecuteReader();
                    while (dr.Read())
                    {
                        RecipeModel recipe = new RecipeModel((int)dr[0], (int)dr[1], dr[2].ToString().Trim(),
                            (int)dr[3], (int)dr[4], (int)dr[5], (int)dr[6], (int)dr[7]);
                        list.AddLast(recipe);
                    }
                }
                catch (NpgsqlException ex)
                {
                    throw ex;
                }
                finally
                {
                    conn.Close();
                }
            }
            return list;
        }

        /// <summary>
        /// Retrieves machines from the db.
        /// The query append should start with " " or ";".
        /// </summary>
        /// <param name="append"></param>
        /// <returns></returns>
        public LinkedList<MachineModel> RetrieveMachines(string append)
        {
            string query = "SELECT * FROM Machines" + append;
            LinkedList<MachineModel> list = new LinkedList<MachineModel>();

            lock (connectionLock)
            {
                try
                {
                    conn.Open();
                    NpgsqlCommand command = new NpgsqlCommand(query, conn);
                    NpgsqlDataReader dr = command.ExecuteReader();
                    while (dr.Read())
                    {
                        MachineModel machine = new MachineModel((int)dr[0],
                            dr[1].ToString().Trim(), dr[2].ToString().Trim());
                        list.AddLast(machine);
                    }
                }
                catch (NpgsqlException ex)
                {
                    throw ex;
                }
                finally
                {
                    conn.Close();
                }
            }
            return list;
        }

        /// <summary>
        /// Retrieves a list of users.
        /// The query append should start with " " or ";".
        /// </summary>
        /// <param name="append"></param>
        /// <returns></returns>
        public LinkedList<UserModel> RetrieveUsers(string append)
        {
            string query = "SELECT Users.userid, Users.username, Users.firstname, Users.lastname, " +
                "Users.email, Users.phonenumber, Users.usertype, Usertypes.role " +
                "FROM Users INNER JOIN UserTypes ON Users.usertype = UserTypes.typeid " +
                append;

            LinkedList<UserModel> list = new LinkedList<UserModel>();

            lock (connectionLock)
            {
                try
                {
                    conn.Open();
                    NpgsqlCommand command = new NpgsqlCommand(query, conn);
                    NpgsqlDataReader dr = command.ExecuteReader();
                    while (dr.Read())
                    {
                        UserModel user = new UserModel(
                            (int)dr[0], dr[1].ToString().Trim(), dr[2].ToString().Trim(), dr[3].ToString().Trim(),
                            dr[4].ToString().Trim(), dr[5].ToString().Trim(), (int)dr[6], dr[7].ToString().Trim());
                        list.AddLast(user);
                    }
                }
                catch (NpgsqlException ex)
                {
                    throw ex;
                }
                finally
                {
                    conn.Close();
                }
            }
            return list;
        }

        /// <summary>
        /// Retrieves batches from the batch queue.
        /// The query append should start with " " or ";".
        /// </summary>
        /// <param name="append"></param>
        /// <returns></returns>
        public LinkedList<BatchQueueModel> RetrieveFromBatchQueue(string append)
        {
            string query = "SELECT BatchQueue.queueid, BatchQueue.priority, BatchQueue.amount," +
                "BatchQueue.speed, BatchQueue.beerid, Recipes.name " +
                "FROM BatchQueue INNER JOIN Recipes ON BatchQueue.beerid = Recipes.beerid" +
                append;

            LinkedList<BatchQueueModel> list = new LinkedList<BatchQueueModel>();

            lock (connectionLock)
            {
                try
                {
                    conn.Open();
                    NpgsqlCommand command = new NpgsqlCommand(query, conn);
                    NpgsqlDataReader dr = command.ExecuteReader();
                    while (dr.Read())
                    {
                        BatchQueueModel batch = new BatchQueueModel((int)dr[0], (int)dr[1], (int)dr[2],
                            (int)dr[3], (int)dr[4], dr[5].ToString().Trim());
                        list.AddLast(batch);
                    }
                }
                catch (NpgsqlException ex)
                {
                    throw ex;
                }
                finally
                {
                    conn.Close();
                }
            }
            return list;
        }

        /// <summary>
        /// Removes batches from the batch queue.
        /// The query append should start with " " or ";".
        /// </summary>
        /// <param name="append"></param>
        /// <returns></returns>
        public bool RemoveFromBatchQueue(string append)
        {
            string query = "DELETE FROM BatchQueue" + append;
            return ExecuteQuery(query);
        }

        /// <summary>
        /// Registers a batch and its batch values into the db.
        /// </summary>
        /// <param name="query"></param>
        /// <param name="temperatureValues"></param>
        /// <param name="humidityValues"></param>
        /// <param name="vibrationsValues"></param>
        /// <returns></returns>
        public bool RegisterBatch(string query,
            List<KeyValuePair<string, double>> temperatureValues,
            List<KeyValuePair<string, double>> humidityValues,
            List<KeyValuePair<string, double>> vibrationsValues)
        {
            return RegisterBatch(query, temperatureValues, humidityValues, vibrationsValues, null);
        }

        /// <summary>
        /// Registers a batch and its batch values into the db.
        /// If alarmQuery is not null, an alarm is registered too.
        /// </summary>
        /// <param name="batchQuery"></param>
        /// <param name="temperatureValues"></param>
        /// <param name="humidityValues"></param>
        /// <param name="vibrationsValues"></param>
        /// <param name="alarmQuery"></param>
        /// <returns></returns>
        public bool RegisterBatch(string batchQuery,
            List<KeyValuePair<string, double>> temperatureValues,
            List<KeyValuePair<string, double>> humidityValues,
            List<KeyValuePair<string, double>> vibrationValues,
            StringBuilder alarmQuery)
        {
            int? batchId = null;

            lock (connectionLock)
            {
                try
                {
                    conn.Open();
                    NpgsqlCommand command = new NpgsqlCommand(batchQuery, conn);
                    NpgsqlDataReader dr = command.ExecuteReader();
                    while (dr.Read())
                    {
                        batchId = (int)dr[0];
                    }
                    if (batchId != null)
                    {
                        // Register batch values
                        RegisterBatchValues((int)batchId, temperatureValues, humidityValues, vibrationValues);
                        if (alarmQuery != null)
                        {
                            // Register alarm
                            alarmQuery.Append(batchId + ");");
                            ExecuteQuery(alarmQuery.ToString());
                        }
                        return true;
                    }
                    return false;
                }
                catch (NpgsqlException ex)
                {
                    throw ex;
                }
                finally
                {
                    conn.Close();
                }
            }
        }

        /// <summary>
        /// Retrieves batches.
        /// The query append should start with " " or ";".
        /// </summary>
        /// <param name="append"></param>
        /// <returns></returns>
        public LinkedList<BatchModel> RetrieveBatches(string append)
        {
            string query = "SELECT Batches.batchid, Batches.acceptableproducts, Batches.defectproducts, " +
                "Batches.timestampstart, Batches.timestampend, Batches.expirationdate, " +
                "Batches.succeeded, Batches.performance, Batches.quality, Batches.availablity, " +
                "Batches.speed, Batches.beerid, Batches.machine, Recipes.name " +
                "FROM Batches INNER JOIN Recipes ON Batches.beerid = Recipes.beerid" +
                append;

            LinkedList<BatchModel> list = new LinkedList<BatchModel>();

            lock (connectionLock)
            {
                try
                {
                    conn.Open();
                    NpgsqlCommand command = new NpgsqlCommand(query, conn);
                    NpgsqlDataReader dr = command.ExecuteReader();
                    while (dr.Read())
                    {
                        BatchModel batch = new BatchModel((int)dr[0], (int)dr[1], (int)dr[2],
                            dr[3].ToString().Trim(), dr[4].ToString().Trim(), dr[5].ToString().Trim(),
                            (bool)dr[6], (double)dr[7], (double)dr[8], (double)dr[9],
                            (int)dr[10], (int)dr[11], (int)dr[12], dr[13].ToString().Trim());
                        list.AddLast(batch);
                    }
                }
                catch (NpgsqlException ex)
                {
                    throw ex;
                }
                finally
                {
                    conn.Close();
                }
            }
            return list;
        }

        /// <summary>
        /// Retrieves batch values for a specific batch.
        /// The query append should start with " " or ";".
        /// </summary>
        /// <param name="batchId"></param>
        /// <param name="append"></param>
        /// <returns></returns>
        public BatchValueCollection RetrieveBatchValues(int batchId, string append)
        {
            string[] queries = new string[3];
            for (int i = 0; i < 3; i++)
            {
                queries[i] = "SELECT " + VALUE_TABLES[i] + ".value, " + VALUE_TABLES[i] +
                    ".timestamp FROM " + VALUE_TABLES[i] + append;
            }
            BatchValueCollection values = new BatchValueCollection();

            lock (connectionLock)
            {
                try
                {
                    conn.Open();
                    for (int i = 0; i < 3; i++)
                    {
                        NpgsqlCommand command = new NpgsqlCommand(queries[i], conn);
                        NpgsqlDataReader dr = command.ExecuteReader();
                        while (dr.Read())
                        {
                            KeyValuePair<string, double> value =
                                new KeyValuePair<string, double>(dr[1].ToString().Trim(), (int)dr[0]);
                            if (i == 0)
                            {
                                values.TemperatureValues.Add(value);
                            }
                            else if (i == 1)
                            {
                                values.HumidityValues.Add(value);
                            }
                            else if (i == 2)
                            {
                                values.VibrationValues.Add(value);
                            }
                        }
                    }
                }
                catch (NpgsqlException ex)
                {
                    throw ex;
                }
                finally
                {
                    conn.Close();
                }
            }
            return values;
        }

        /// <summary>
        /// Retrieves alarms.
        /// The query append should start with " " or ";".
        /// </summary>
        /// <param name="append"></param>
        /// <returns></returns>
        public List<AlarmModel> RetrieveAlarms(string append)
        {
            string query = "SELECT Alarms.alarmid, Alarms.timestamp, Alarms.stopreason, Alarms.handledby, " +
                "Alarms.batch, StopReasons.stopdescription, Users.firstname, Users.lastname " +
                "FROM Alarms LEFT JOIN StopReasons ON Alarms.stopreason = StopReasons.stopid " +
                "LEFT JOIN Users on Alarms.handledby = Users.userid" + append;

            List<AlarmModel> list = new List<AlarmModel>();

            lock (connectionLock)
            {
                try
                {
                    conn.Open();
                    NpgsqlCommand command = new NpgsqlCommand(query, conn);
                    NpgsqlDataReader dr = command.ExecuteReader();
                    while (dr.Read())
                    {
                        AlarmModel alarm = new AlarmModel((int)dr[0], dr[1].ToString().Trim(), (int)dr[2],
                            (int)dr[3], (int)dr[4], dr[5].ToString().Trim(), dr[6].ToString().Trim());
                        list.Add(alarm);
                    }
                }
                catch (NpgsqlException ex)
                {
                    throw ex;
                }
                finally
                {
                    conn.Close();
                }
            }
            return list;
        }

        /// <summary>
        /// Registers batch values.
        /// </summary>
        /// <param name="batchId"></param>
        /// <param name="temperatureValues"></param>
        /// <param name="humidityValues"></param>
        /// <param name="vibrationsValues"></param>
        /// <returns></returns>
        private bool RegisterBatchValues(int batchId,
            List<KeyValuePair<string, double>> temperatureValues,
            List<KeyValuePair<string, double>> humidityValues,
            List<KeyValuePair<string, double>> vibrationsValues)
        {
            string[] queries = new string[temperatureValues.Count + humidityValues.Count + vibrationsValues.Count];
            List<KeyValuePair<string, double>>[] valueLists = { temperatureValues, humidityValues, vibrationsValues };
            int qIndex = 0;
            for (int i = 0; i < valueLists.Length; i++)
            {
                foreach (KeyValuePair<string, double> value in valueLists[i])
                {
                    queries[qIndex] = "INSERT INTO " + VALUE_TABLES[i] +
                        " VALUES(" + value.Value + ", '" + value.Key + "', " + batchId + ");";
                    qIndex++;
                }
            }
            bool firstExecution = true;
            for (int i = 0; i < queries.Length; i++)
            {
                try
                {
                    NpgsqlCommand command = new NpgsqlCommand(queries[i], conn);
                    command.ExecuteNonQuery();
                    if (firstExecution)
                    {
                        firstExecution = false;
                    }
                }
                catch (NpgsqlException ex)
                {
                    if (firstExecution)
                    {
                        return false;
                    }
                }
            }
            return true;
        }
    }
}
