using SCAMS.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace ProjectSCAM.Models.Logic {
    public sealed class Singleton {
        public DBManager dbManager { get; set; }
        public OpcClient opcManager { get; set; }
        private static readonly Singleton instance = new Singleton();

        // Explicit static constructor to tell C# compiler
        // not to mark type as beforefieldinit
        static Singleton() {
        }

        private Singleton() {
            dbManager = new DBManager("balarama.db.elephantsql.com","5432", "ppcrexqw", "HL8HORvW5RUPUlBUcf_PIcZWxjlOoc1F",
                "ppcrexqw");
            opcManager = new OpcClient();
        }

        public static Singleton Instance {
            get {
                return instance;
            }
        }
    }
}