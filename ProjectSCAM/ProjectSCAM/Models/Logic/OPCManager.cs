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
        public void AddEventHandlers() {
            foreach(OpcClient opc in OpcConnections.Values) {
                opc.PropertyChanged += Opc_PropertyChanged;
            }
        }

        private void Opc_PropertyChanged(object sender, System.ComponentModel.PropertyChangedEventArgs e) {
            if(e.PropertyName.Equals("StateCurrent")) {
                OpcClient opc = sender as OpcClient;
                //if successfully produced
                if(opc.StateCurrent == 17) {
                    Singleton.Instance.DBManager.RegisterBatch(opc.AcceptableProducts,opc.DefectProducts,
                        opc.Start,DateTime.Now,DateTime.Now.AddYears(10),true,1,1,1,opc.ProductsPerMinute,
                        3,);
                }

            }
        }
        private int GetMachineId(string ip) {
            IList<MachineModel> machines = Singleton.Instance.DBManager.RetrieveMachines();
            int i = 0;
            foreach(MachineModel m in machines) {
                if(m.Ip.Equals(ip)) {
                    i = (int)m.Id;
                }
            }
            return i;
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