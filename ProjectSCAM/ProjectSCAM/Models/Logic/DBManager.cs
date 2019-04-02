using Npgsql;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace ProjectSCAM.Models.Logic
{
    public class DBManager
    {
        private QueryExecuter exe;

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

        /// <summary>
        /// Retrieve all active users
        /// </summary>
        /// <returns></returns>
        public LinkedList<UserModel> RetrieveUsers()
        {
            string append = " WHERE isactive = true;";
            return exe.RetrieveUsers(append);
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

        /// <summary>
        /// Retrieve all batches from batch queue
        /// </summary>
        /// <returns></returns>
        public LinkedList<BatchQueueModel> RetrieveFromBatchQueue()
        {
            string append = ";";
            return exe.RetrieveFromBatchQueue(append);
        }

        /// <summary>
        /// Retrieve all batches
        /// </summary>
        /// <returns></returns>
        public LinkedList<BatchModel> RetrieveBatches()
        {
            string append = ";";
            return exe.RetrieveBatches(append);
        }

        public LinkedList<BatchModel> RetrieveBatchesByAmount(int amount)
        {
            string append = " ORDER BY timestampstart DESC LIMIT " + amount + ";";
            return exe.RetrieveBatches(append);
        }

        public LinkedList<BatchModel> RetrieveBatchesByMonth(string month, string year)
        {
            if (month.Length == 1)
            {
                month = "0" + month;
            }
            if (month.Length == 2 && year.Length == 4)
            {
                string append = " WHERE timestampEnd LIKE '" + month + "/" + "__" + "/" + year + "%'";
                return exe.RetrieveBatches(append);
            }
            else throw new Exception();
        }

        public LinkedList<BatchModel> RetrieveBatchesByMachine(int machine)
        {
            string append = " WHERE machine = " + machine + ";";
            return exe.RetrieveBatches(append);
        }

        public LinkedList<BatchModel> RetrieveBatchesByRecipe(int beerId)
        {
            string append = " WHERE beerid = " + beerId + ";";
            return exe.RetrieveBatches(append);
        }
    }
}
