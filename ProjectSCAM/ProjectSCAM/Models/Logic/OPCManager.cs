using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace ProjectSCAM.Models.Logic {
    public class OPCManager {
        public Dictionary<string,OpcClient> OpcConnections { get; set; }
        public OPCManager() {
            OpcConnections = new Dictionary<string, OpcClient>();
            InitConnections();
        }

        public void InitConnections() {
            string ip = "opc.tcp://127.0.0.1:4840";
            string ip2 = "opc.tcp://10.112.254.69:4840";
            OpcConnections.Add(ip, new OpcClient(ip));
            OpcConnections.Add(ip2, new OpcClient(ip2));
            //OpcConnections.Add(ip2, new OpcClient(ip2));

        }
        public bool HandleCommand(string ip, string command) {
            OpcClient opc;
            bool succeeded = OpcConnections.TryGetValue(ip,out opc);
            if(succeeded) {
                switch (command) {
                    case "start":
                        if(Singleton.Instance.DBManager.RetrieveFromBatchQueue().Count>0 && opc.StateCurrent == 4) {
                            BatchQueueModel bqm = Singleton.Instance.DBManager.RetrieveFromBatchQueue()[0];
                            Singleton.Instance.DBManager.RemoveFromBatchQueue(bqm.Id);
                            opc.StartMachine(10, bqm.BeerId, bqm.Amount, bqm.Speed);
                        }
                        break;
                    case "stop":
                        opc.StopMachine();
                        break;
                    case "clear":
                        opc.ClearMachine();
                        break;
                    case "abort":
                        opc.AbortMachine();
                        break;
                    case "reset":
                        opc.ResetMachine();
                        break;
                    default:
                        throw new Exception("Invalid command");
                }
            }
            return succeeded;
        }
        public OpcClient GetOpcConnection(string ip) {
            OpcClient opc;
            OpcConnections.TryGetValue(ip, out opc);          
            return opc;
        }
    }
}