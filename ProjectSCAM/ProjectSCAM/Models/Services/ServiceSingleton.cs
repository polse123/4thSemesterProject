﻿
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace ProjectSCAM.Models.Logic {
    public sealed class ServiceSingleton {
        public DBServiceProvider DBManager { get; set; }
        public OPCServiceProvider opcManager { get; set; }
        public BatchReportServiceProvider BatchReportGenerator { get; set; }
        private static readonly ServiceSingleton instance = new ServiceSingleton();

        // server, port, user id, password, database
        private readonly string[] DB_INFO = {"tek-mmmi-db0a.tek.c.sdu.dk",
            "5432", "si3_2018_group_23", "ear70.doling", "si3_2018_group_23_db"};

        // Explicit static constructor to tell C# compiler
        // not to mark type as beforefieldinit
        static ServiceSingleton()
        {
        }

        private ServiceSingleton()
        {
            DBManager = new DBServiceProvider(DB_INFO[0], DB_INFO[1], DB_INFO[2], DB_INFO[3], DB_INFO[4]);
            opcManager = new OPCServiceProvider();
            BatchReportGenerator = new BatchReportServiceProvider();
        }
        public  void CreateBatchReport(float batchId,float productType, int aProduct, int dProduct, BatchValueCollection bv) {
            BatchReportGenerator.GenerateFile(batchId, productType, aProduct, dProduct, bv);
        }

        public static ServiceSingleton Instance
        {
            get
            {
                return instance;
            }
        }
    }
}
