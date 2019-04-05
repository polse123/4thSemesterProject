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
        private NpgsqlConnection conn;

        private string[] valueTables = { "temperatureValues", "humidityValues", "vibrationValues" };

        public QueryExecuter(NpgsqlConnection conn)
        {
            this.conn = conn;
        }

        /// <summary>
        /// Retrieve recipes.
        /// Optionally add query append (start with " " or ";").
        /// </summary>
        /// <param name="append"></param>
        /// <returns></returns>
        public LinkedList<RecipeModel> RetrieveRecipes(string append)
        {
            string query = "SELECT * FROM Recipes" + append;

            LinkedList<RecipeModel> list = new LinkedList<RecipeModel>();
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
            return list;
        }

        public LinkedList<MachineModel> RetrieveMachines(string append)
        {
            string query = "SELECT * FROM Machines" + append;

            LinkedList<MachineModel> list = new LinkedList<MachineModel>();
            try
            {
                conn.Open();
                NpgsqlCommand command = new NpgsqlCommand(query, conn);
                NpgsqlDataReader dr = command.ExecuteReader();
                while (dr.Read())
                {
                    MachineModel machine = new MachineModel((int)dr[0], dr[1].ToString().Trim(), dr[2].ToString().Trim());
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
            return list;
        }

        /// <summary>
        /// Retrieve a list of users (excludes Users.password and Users.isactive, includes UserTypes.role).
        /// Optionally add query append (start with " " or ";").
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
            return list;
        }

        /// <summary>
        /// Retrieve batches from the batch queue (icludes Recipes.beerid).
        /// Optionally add query append (start with " " or ";").
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
            return list;
        }

        public bool RegisterBatch(string query,
            List<KeyValuePair<string, double>> temperatureValues,
            List<KeyValuePair<string, double>> humidityValues,
            List<KeyValuePair<string, double>> vibrationsValues)
        {
            try
            {
                int? batchId = null;
                conn.Open();
                NpgsqlCommand command = new NpgsqlCommand(query, conn);
                NpgsqlDataReader dr = command.ExecuteReader();
                while (dr.Read())
                {
                    batchId = (int)dr[0];
                }
                if (batchId != null)
                {
                    RegisterBatchValues(conn, (int)batchId, temperatureValues, humidityValues, vibrationsValues);
                    return true;
                }
                else return false;
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

        /// <summary>
        /// Retrieve batches (includes Recipes.beerid).
        /// Optionally add query append (start with " " or ";").
        /// </summary>
        /// <param name="append"></param>
        /// <returns></returns>
        public LinkedList<BatchModel> RetrieveBatches(string append)
        {
            string query = "SELECT Batches.batchid, Batches.acceptableproducts, Batches.defectproducts, " +
                "Batches.timestampstart, Batches.timestampend, Batches.expirationdate, " +
                "Batches.succeeded, Batches.performance, Batches.quality, Batches.availablity, " +
                "Batches.speed, Batches.beerid, Batches.machine, Recipes.name" +
                "FROM Batches INNER JOIN Recipes ON Batches.beerid = Recipes.beerid" +
                append;

            LinkedList<BatchModel> list = new LinkedList<BatchModel>();
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
            return list;
        }



        public BatchValueCollection RetrieveBatchValues(int batchId, string append)
        {
            string[] queries = new string[3];
            for (int i = 0; i < 3; i++)
            {
                queries[i] = "SELECT " + valueTables[i] + ".value, " + valueTables[i] + ".timestamp FROM " + valueTables[i] + append;
            }
            BatchValueCollection values = new BatchValueCollection();
            try
            {
                conn.Open();
                for (int i = 0; i < 3; i++)
                {
                    NpgsqlCommand command = new NpgsqlCommand(queries[i], conn);
                    NpgsqlDataReader dr = command.ExecuteReader();
                    while (dr.Read())
                    {
                        KeyValuePair<string, double> value = new KeyValuePair<string, double>(dr[1].ToString().Trim(), (int)dr[0]);
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
            return values;
        }

        private bool RegisterBatchValues(NpgsqlConnection conn, int batchId,
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
                    queries[qIndex] = "INSERT INTO " + valueTables[i] + " VALUES(" + value.Value + ", " + value.Key + ", " + batchId + ");";
                    qIndex++;
                }
            }
            try
            {
                for (int i = 0; i < queries.Length; i++)
                {
                    try
                    {
                        NpgsqlCommand command = new NpgsqlCommand(queries[i], conn);
                        command.ExecuteReader();
                    }
                    catch (NpgsqlException ex) { }
                }
            }
            catch (NpgsqlException)
            {
                return false;
            }
            finally
            {
                conn.Close();
            }
            return true;
        }
    }
}
