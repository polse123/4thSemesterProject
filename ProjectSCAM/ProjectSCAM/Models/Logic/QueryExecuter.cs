using Npgsql;
using System;
using System.Collections.Generic;
using System.Text;

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
        private readonly object CONN_LOCK;

        /// <summary>
        /// string array that holds the names of the three batch values tables.
        /// Index 0 holds the name of the temperature table.
        /// Index 1 holds the name of the humidity table.
        /// Index 2 holds the name of the vibration table.
        /// </summary>
        private readonly string[] VALUE_TABLES = { "TemperatureValues", "HumidityValues", "VibrationValues" };

        /// <summary>
        /// Constructor for the QueryExecuter.
        /// A new connection is initialized.
        /// </summary>
        /// <param name="server"></param>
        /// <param name="port"></param>
        /// <param name="userid"></param>
        /// <param name="password"></param>
        /// <param name="database"></param>
        public QueryExecuter(string server, string port, string userid, string password, string database)
        {
            InitConnection(server, port, userid, password, database);
            CONN_LOCK = new object();
        }

        /// <summary>
        /// Initializes a connection.
        /// </summary>
        /// <param name="server"></param>
        /// <param name="port"></param>
        /// <param name="userid"></param>
        /// <param name="password"></param>
        /// <param name="database"></param>
        private void InitConnection(string server, string port, string userid, string password, string database)
        {
            // PostgeSQL-style connection string
            string connString = String.Format("Server={0};Port={1};" +
                "User Id={2};Password={3};Database={4};",
                server, port, userid, password, database);
            // Making connection with Npgsql provider
            conn = new NpgsqlConnection(connString);
        }

        /// <summary>
        /// Executes a query.
        /// </summary>
        /// <param name="query"></param>
        /// <returns></returns>
        public bool ExecuteQuery(string query)
        {
            lock (CONN_LOCK)
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
        public IList<UserType> RetrieveUserTypes(string append)
        {
            string query = "SELECT * FROM UserTypes" + append;
            List<UserType> list = new List<UserType>();

            lock (CONN_LOCK)
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
                    return null;
                }
                finally
                {
                    conn.Close();
                }
            }
            return list;
        }


        public IList<StopReasonModel> RetrieveStopReasons(string append)
        {
            string query = "SELECT * FROM StopReasons" + append;
            List<StopReasonModel> list = new List<StopReasonModel>();

            lock (CONN_LOCK)
            {
                try
                {
                    conn.Open();
                    NpgsqlCommand command = new NpgsqlCommand(query, conn);
                    NpgsqlDataReader dr = command.ExecuteReader();
                    while (dr.Read())
                    {
                        StopReasonModel reason = new StopReasonModel((int)dr[0], (bool)dr[1], dr[2].ToString().Trim());
                        list.Add(reason);
                    }
                }
                catch (NpgsqlException ex)
                {
                    return null;
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
        public IList<RecipeModel> RetrieveRecipes(string append)
        {
            string query = "SELECT * FROM Recipes" + append;
            List<RecipeModel> list = new List<RecipeModel>();

            lock (CONN_LOCK)
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
                        list.Add(recipe);
                    }
                }
                catch (NpgsqlException ex)
                {
                    return null;
                }
                finally
                {
                    conn.Close();
                }
            }
            return list;
        }

        /// <summary>
        /// Retrieves the maximum speed for a specific recipe.
        /// </summary>
        /// <param name="append"></param>
        /// <returns></returns>
        public int RetrieveMaxSpeed(string append)
        {
            string query = "SELECT maxspeed FROM Recipes" + append;

            int speed = 0;

            lock (CONN_LOCK)
            {
                try
                {
                    conn.Open();
                    NpgsqlCommand command = new NpgsqlCommand(query, conn);
                    NpgsqlDataReader dr = command.ExecuteReader();
                    while (dr.Read())
                    {
                        speed = (int)dr[0];
                        break;
                    }
                }
                catch (NpgsqlException ex)
                {
                    return 0;
                }
                finally
                {
                    conn.Close();
                }
            }
            return speed;
        }

        /// <summary>
        /// Retrieves machines from the db.
        /// The query append should start with " " or ";".
        /// </summary>
        /// <param name="append"></param>
        /// <returns></returns>
        public IList<MachineModel> RetrieveMachines(string append)
        {
            string query = "SELECT * FROM Machines " + append;

            List<MachineModel> list = new List<MachineModel>();

            lock (CONN_LOCK)
            {
                try
                {
                    conn.Open();
                    NpgsqlCommand command = new NpgsqlCommand(query, conn);
                    NpgsqlDataReader dr = command.ExecuteReader();
                    while (dr.Read())
                    {
                        MachineModel machine = new MachineModel((int)dr[0], dr[1].ToString().Trim(), dr[2].ToString().Trim(), (int)dr[3],
                            dr[4].ToString().Trim(), dr[5].ToString().Trim(), dr[6].ToString().Trim(), dr[7].ToString().Trim(), dr[8].ToString().Trim(), dr[9].ToString().Trim(),
                            dr[10].ToString().Trim(), dr[11].ToString().Trim(), dr[12].ToString().Trim(), dr[13].ToString().Trim(), dr[14].ToString().Trim(), dr[15].ToString().Trim(),
                            dr[16].ToString().Trim(), dr[17].ToString().Trim(), dr[18].ToString().Trim(), dr[19].ToString().Trim(), dr[20].ToString().Trim(), dr[21].ToString().Trim());
                        list.Add(machine);
                    }
                }
                catch (NpgsqlException ex)
                {
                    return null;
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
        public IList<UserModel> RetrieveUsers(string append)
        {
            string query = "SELECT Users.userid, Users.username, Users.firstname, Users.lastname, " +
                "Users.email, Users.phonenumber, Users.usertype, Usertypes.role " +
                "FROM Users INNER JOIN UserTypes ON Users.usertype = UserTypes.typeid" +
                append;

            List<UserModel> list = new List<UserModel>();

            lock (CONN_LOCK)
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
                        list.Add(user);
                    }
                }
                catch (NpgsqlException ex)
                {
                    return null;
                }
                finally
                {
                    conn.Close();
                }
            }
            return list;
        }

        /// <summary>
        /// Retrieves a list of customers.
        /// The query append should start with " " or ";".
        /// </summary>
        /// <param name="append"></param>
        /// <returns></returns>
        public IList<CustomerModel> RetrieveCustomers(string append)
        {
            string query = "SELECT * FROM Customers" + append;

            List<CustomerModel> list = new List<CustomerModel>();

            lock (CONN_LOCK)
            {
                try
                {
                    conn.Open();
                    NpgsqlCommand command = new NpgsqlCommand(query, conn);
                    NpgsqlDataReader dr = command.ExecuteReader();
                    while (dr.Read())
                    {
                        CustomerModel customer = new CustomerModel((int)dr[0], dr[1].ToString().Trim());
                        list.Add(customer);
                    }
                }
                catch (NpgsqlException ex)
                {
                    return null;
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
        public IList<BatchQueueModel> RetrieveFromBatchQueue(string append)
        {
            string query = "SELECT BatchQueue.queueid, BatchQueue.priority, BatchQueue.amount," +
                "BatchQueue.speed, BatchQueue.beerid, Recipes.name " +
                "FROM BatchQueue INNER JOIN Recipes ON BatchQueue.beerid = Recipes.beerid" +
                append;

            List<BatchQueueModel> list = new List<BatchQueueModel>();

            lock (CONN_LOCK)
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
                        list.Add(batch);
                    }
                }
                catch (NpgsqlException ex)
                {
                    return null;
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
        /// If alarmQuery is not null, an alarm is registered too.
        /// </summary>
        /// <param name="batchQuery"></param>
        /// <param name="temperatureValues"></param>
        /// <param name="humidityValues"></param>
        /// <param name="vibrationsValues"></param>
        /// <param name="alarmQuery"></param>
        /// <returns></returns>
        public KeyValuePair<bool, AlarmModel> RegisterBatch(int acceptableProducts,
            IList<KeyValuePair<string, double>> temperatureValues,
            IList<KeyValuePair<string, double>> humidityValues,
            IList<KeyValuePair<string, double>> vibrationValues,
            string batchQuery, StringBuilder alarmQuery)
        {
            int? batchId = null;

            lock (CONN_LOCK)
            {
                try
                {
                    // Register batch
                    conn.Open();
                    NpgsqlCommand command = new NpgsqlCommand(batchQuery, conn);
                    NpgsqlDataReader dr = command.ExecuteReader();
                    while (dr.Read())
                    {
                        batchId = (int)dr[0];
                    }
                    conn.Close();

                    if (batchId != null)
                    {
                        AlarmModel alarm = null;

                        // Register batch values
                        conn.Open();
                        RegisterBatchValues((int)batchId, temperatureValues, humidityValues, vibrationValues);
                        conn.Close();

                        // Register beers
                        conn.Open();
                        RegisterBeers((int)batchId, acceptableProducts);
                        conn.Close();

                        // Register alarm
                        if (alarmQuery != null)
                        {
                            alarmQuery.Append(batchId + ") RETURNING alarmid;");
                            conn.Open();
                            NpgsqlCommand a_command = new NpgsqlCommand(alarmQuery.ToString(), conn);
                            NpgsqlDataReader a_dr = a_command.ExecuteReader();
                            int? alarmId = null;
                            while (a_dr.Read())
                            {
                                alarmId = (int)a_dr[0];
                            }
                            conn.Close();

                            if (alarmId != null)
                            {
                                IList<AlarmModel> list = RetrieveAlarms(" WHERE alarmid = " + alarmId + ";");
                                if (list.Count != 0)
                                {
                                    foreach (AlarmModel element in list)
                                    {
                                        alarm = element;
                                        break;
                                    }
                                }
                            }
                        }

                        return new KeyValuePair<bool, AlarmModel>(true, alarm);
                    }
                    else return new KeyValuePair<bool, AlarmModel>(false, null);
                }
                catch (NpgsqlException ex)
                {
                    return new KeyValuePair<bool, AlarmModel>(false, null);
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
        public IList<BatchModel> RetrieveBatches(string append)
        {
            string query = "SELECT Batches.batchid, Batches.acceptableproducts, Batches.defectproducts, " +
                "Batches.timestampstart, Batches.timestampend, Batches.expirationdate, " +
                "Batches.succeeded, Batches.performance, Batches.quality, Batches.availability, Batches.oee, " +
                "Batches.speed, Batches.beerid, Batches.machine, Batches.soldto, Batches.recalled, " +
                "Recipes.name, Customers.customername " +
                "FROM Batches LEFT JOIN Recipes ON Batches.beerid = Recipes.beerid " +
                "LEFT JOIN Customers ON Batches.soldto = Customers.customerid" +
                append;

            IList<BatchModel> list = new List<BatchModel>();

            lock (CONN_LOCK)
            {
                try
                {
                    conn.Open();
                    NpgsqlCommand command = new NpgsqlCommand(query, conn);
                    NpgsqlDataReader dr = command.ExecuteReader();
                    while (dr.Read())
                    {
                        // dr[14] and dr[16] might have the value DBNull.
                        if (!Convert.IsDBNull(dr[14]))
                        {
                            BatchModel batch = new BatchModel((int)dr[0], (int)dr[1], (int)dr[2],
                                dr[3].ToString().Trim(), dr[4].ToString().Trim(), dr[5].ToString().Trim(),
                                (bool)dr[6], dr[7].ToString().Trim(), dr[8].ToString().Trim(), dr[9].ToString().Trim(),
                                dr[10].ToString().Trim(), (int)dr[11], (int)dr[12], (int)dr[13], (int)dr[14], (bool)dr[15],
                                dr[16].ToString().Trim(), dr[17].ToString().Trim());
                            list.Add(batch);
                        }
                        else
                        {
                            BatchModel batch = new BatchModel((int)dr[0], (int)dr[1], (int)dr[2],
                                        dr[3].ToString().Trim(), dr[4].ToString().Trim(), dr[5].ToString().Trim(),
                                        (bool)dr[6], dr[7].ToString().Trim(), dr[8].ToString().Trim(), dr[9].ToString().Trim(),
                                        dr[10].ToString().Trim(), (int)dr[11], (int)dr[12], (int)dr[13], null, (bool)dr[15],
                                        dr[16].ToString().Trim(), null);
                            list.Add(batch);
                        }
                    }
                }
                catch (NpgsqlException ex)
                {
                    return null;
                }
                finally
                {
                    conn.Close();
                }
            }
            return list;
        }

        /// <summary>
        /// Retrieves batch values.
        /// The query append should start with " " or ";".
        /// </summary>
        /// <param name="append"></param>
        /// <returns></returns>
        public BatchValueCollection RetrieveBatchValues(string append)
        {
            BatchValueCollection values = new BatchValueCollection();

            string[] queries = new string[3];
            for (int i = 0; i < 3; i++)
            {
                queries[i] = "SELECT " + VALUE_TABLES[i] + ".value, " + VALUE_TABLES[i] +
                    ".timestamp FROM " + VALUE_TABLES[i] + append;
            }

            lock (CONN_LOCK)
            {
                try
                {
                    for (int i = 0; i < 3; i++)
                    {
                        conn.Open();
                        NpgsqlCommand command = new NpgsqlCommand(queries[i], conn);
                        NpgsqlDataReader dr = command.ExecuteReader();
                        while (dr.Read())
                        {
                            KeyValuePair<string, double> value =
                                new KeyValuePair<string, double>(dr[1].ToString().Trim(), (double)dr[0]);
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
                        conn.Close();
                    }
                }
                catch (NpgsqlException ex)
                {
                    return null;
                }
                finally
                {
                    conn.Close();
                }
            }
            return values;
        }

        /// <summary>
        /// Retrieves beers.
        /// The query append should start with " " or ";".
        /// </summary>
        /// <param name="append"></param>
        /// <returns></returns>
        public IList<BeerModel> RetrieveBeers(string append)
        {
            string query = "SELECT * FROM Beers" + append;

            List<BeerModel> list = new List<BeerModel>();

            lock (CONN_LOCK)
            {
                // dr[3] might have type DBNull. In this case, an InvalidCastException will be thrown.
                try
                {
                    conn.Open();
                    NpgsqlCommand command = new NpgsqlCommand(query, conn);
                    NpgsqlDataReader dr = command.ExecuteReader();
                    while (dr.Read())
                    {
                        BeerModel beer = new BeerModel((int)dr[0], (bool)dr[1], (int)dr[2]);
                        list.Add(beer);
                    }
                }
                catch (NpgsqlException ex)
                {
                    return null;
                }
                finally
                {
                    conn.Close();
                }
            }
            return list;
        }

        /// <summary>
        /// Retrieves alarms.
        /// The query append should start with " " or ";".
        /// </summary>
        /// <param name="append"></param>
        /// <returns></returns>
        public IList<AlarmModel> RetrieveAlarms(string append)
        {
            string query = "SELECT Alarms.alarmid, Alarms.timestamp, Alarms.stopreason, Alarms.handledby, " +
                "Alarms.batch, StopReasons.actionrequired, StopReasons.stopdescription, Users.firstname, Users.lastname " +
                "FROM Alarms LEFT JOIN StopReasons ON Alarms.stopreason = StopReasons.stopid " +
                "LEFT JOIN Users ON Alarms.handledby = Users.userid" + append;

            List<AlarmModel> list = new List<AlarmModel>();

            lock (CONN_LOCK)
            {
                try
                {
                    conn.Open();
                    NpgsqlCommand command = new NpgsqlCommand(query, conn);
                    NpgsqlDataReader dr = command.ExecuteReader();
                    while (dr.Read())
                    {
                        // dr[3], dr[7] and dr[8] might have the value DBNull.
                        if (!Convert.IsDBNull(dr[3]))
                        {
                            AlarmModel alarm = new AlarmModel((int)dr[0], dr[1].ToString().Trim(), (int)dr[2],
                              (int)dr[3], (int)dr[4], (bool)dr[5], dr[6].ToString().Trim(),
                                dr[7].ToString().Trim() + " " + dr[8].ToString().Trim());
                            list.Add(alarm);
                        }
                        else
                        {
                            AlarmModel alarm = new AlarmModel((int)dr[0], dr[1].ToString().Trim(), (int)dr[2],
                               null, (int)dr[4], (bool)dr[5], dr[6].ToString().Trim(), null);
                            list.Add(alarm);
                        }
                    }
                }
                catch (NpgsqlException ex)
                {
                    return null;
                }
                finally
                {
                    conn.Close();
                }
            }
            return list;
        }

        /// <summary>
        /// Executes all queries in an array.
        /// Needs an open connection.
        /// </summary>
        /// <param name="queries"></param>
        /// <param name="stopIfFirstFails"></param>
        /// <returns></returns>
        private bool ExecuteQueries(string[] queries, bool stopIfFirstFails)
        {
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
                    if (firstExecution && stopIfFirstFails)
                    {
                        return false;
                    }
                }
            }
            return true;
        }

        /// <summary>
        /// Registers batch values.
        /// Needs an open connection.
        /// </summary>
        /// <param name="batchId"></param>
        /// <param name="temperatureValues"></param>
        /// <param name="humidityValues"></param>
        /// <param name="vibrationsValues"></param>
        /// <returns></returns>
        private bool RegisterBatchValues(int batchId,
            IList<KeyValuePair<string, double>> temperatureValues,
            IList<KeyValuePair<string, double>> humidityValues,
            IList<KeyValuePair<string, double>> vibrationsValues)
        {
            string[] queries = new string[temperatureValues.Count + humidityValues.Count + vibrationsValues.Count];
            IList<KeyValuePair<string, double>>[] valueLists = { temperatureValues, humidityValues, vibrationsValues };
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
            return ExecuteQueries(queries, true);
        }

        /// <summary>
        /// Registers beers.
        /// Needs an open connection.
        /// </summary>
        /// <param name="batchId"></param>
        /// <param name="acceptableProducts"></param>
        /// <returns></returns>
        private bool RegisterBeers(int batchId, int acceptableProducts)
        {
            string[] queries = new string[acceptableProducts];
            for (int i = 0; i < queries.Length; i++)
            {
                int productNumber = i + 1;
                queries[i] = "INSERT INTO Beers VALUES(" + productNumber + ", true, " + batchId + ");";
            }
            return ExecuteQueries(queries, true);
        }
    }
}
