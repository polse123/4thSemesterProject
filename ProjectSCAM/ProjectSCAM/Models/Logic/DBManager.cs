using Npgsql;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace ProjectSCAM.Models.Logic
{
    public class DBManager
    {
        NpgsqlConnection conn;

        public DBManager(string server, string port, string userid, string password, string database)
        {
            InitConnection(server, port, userid, password, database);
        }

        /// <summary>
        /// 
        /// </summary>
        /// <param name="server"></param>
        /// <param name="port"></param>
        /// <param name="userid"></param>
        /// <param name="password"></param>
        /// <param name="database"></param>
        private void InitConnection(string server, string port, string userid, string password, string database)
        {
            // PostgeSQL-style connection string
            string connstring = String.Format("Server={0};Port={1};" +
                "User Id={2};Password={3};Database={4};",
                server, port, userid, password, database);
            // Making connection with Npgsql provider
            conn = new NpgsqlConnection(connstring);
        }

        public LinkedList<UserModel> RetrieveUsers()
        {
            LinkedList<UserModel> users = new LinkedList<UserModel>();
            string query = "SELECT * FROM Users WHERE isactive = true";
            try
            {
                conn.Open();
                NpgsqlCommand command = new NpgsqlCommand(query, conn);
                NpgsqlDataReader dr = command.ExecuteReader();
                while (dr.Read())
                {
                    UserModel user = new UserModel(
                        (int)dr[0], dr[1].ToString(), dr[2].ToString(), dr[3].ToString(),
                        dr[4].ToString(), dr[5].ToString(), dr[6].ToString(), (bool)dr[7], (int)dr[8]);
                    users.AddLast(user);
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
            return users;

        }
    }
}
