﻿
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace ProjectSCAM.Models.Logic {
    public sealed class Singleton {
        public DBManager DBManager { get; set; }
        public OPCManager opcManager { get; set; }
        public BatchReportServiceProvider BatchReportGenerator { get; set; }
        private static readonly Singleton instance = new Singleton();

        // server, port, user id, password, database
        private readonly string[] DB_INFO = {"balarama.db.elephantsql.com",
            "5432", "ppcrexqw", "HL8HORvW5RUPUlBUcf_PIcZWxjlOoc1F", "ppcrexqw"};

        // Explicit static constructor to tell C# compiler
        // not to mark type as beforefieldinit
        static Singleton()
        {
        }

        private Singleton()
        {
            DBManager = new DBManager(DB_INFO[0], DB_INFO[1], DB_INFO[2], DB_INFO[3], DB_INFO[4]);
            opcManager = new OPCManager();
            BatchReportGenerator = new BatchReportServiceProvider();
        }
        public  void CreateBatchReport(float batchId,float productType, int aProduct, int dProduct, BatchValueCollection bv) {
            BatchReportGenerator.GenerateFile(batchId, productType, aProduct, dProduct, bv);
        }

        public static Singleton Instance
        {
            get
            {
                return instance;
            }
        }
    }
}
