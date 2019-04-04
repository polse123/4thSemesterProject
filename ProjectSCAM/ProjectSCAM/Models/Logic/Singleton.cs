using SCAMS.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace ProjectSCAM.Models.Logic {
    public sealed class Singleton {
        public DBManager DbManager { get; set; }
        public OpcClient OpcManager { get; set; }
        public LinkedList<AlarmModel> Alarms { get; set; }
        private static readonly Singleton instance = new Singleton();

        // Explicit static constructor to tell C# compiler
        // not to mark type as beforefieldinit
        static Singleton() {
        }

        private Singleton() {
            DbManager = new DBManager("balarama.db.elephantsql.com","5432", "ppcrexqw", "HL8HORvW5RUPUlBUcf_PIcZWxjlOoc1F",
                "ppcrexqw");
            OpcManager = new OpcClient();
            Alarms = new LinkedList<AlarmModel>();
        }

        public static Singleton Instance {
            get {
                return instance;
            }
        }
    }
}