using Npgsql;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace ProjectSCAM.Models.Logic
{
    public class QueryExecuter
    {
        private NpgsqlConnection conn;

        public QueryExecuter(NpgsqlConnection conn)
        {
            this.conn = conn;
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

        /// <summary>
        /// Retrieve batches from the batch queue (icludes Recipes.beerid).
        /// Optionally add query append (start with " " or ";").
        /// </summary>
        /// <param name="append"></param>
        /// <returns></returns>
        public LinkedList<BatchQueueModel> RetrieveFromBatchQueue(string append)
        {
            string query = "SELECT BatchQueue.queueid, BatchQueue.amount," +
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
                    BatchQueueModel batch = new BatchQueueModel((int)dr[0], (int)dr[1],
                        (int)dr[2], (int)dr[3], dr[4].ToString().Trim());
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
    }
}
