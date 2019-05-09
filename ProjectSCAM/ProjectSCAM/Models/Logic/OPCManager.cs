using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace ProjectSCAM.Models.Logic {
    public class OPCManager {
        public Dictionary<string, OpcClient> OpcConnections { get; set; }
        public AlarmManager AlarmManager { get; set; }
        private IList<KeyValuePair<string, double>> lmao = new List<KeyValuePair<string, double>>();
        public OPCManager() {
            AlarmManager = new AlarmManager();
            OpcConnections = new Dictionary<string, OpcClient>();
        }

        public void InitConnection(string ip) {
            //   string ip = "opc.tcp://127.0.0.1:4840";
            //    string ip2 = "opc.tcp://10.112.254.69:4840";
            System.Diagnostics.Debug.WriteLine(ip);
            if(OpcConnections.ContainsKey(ip)) {
                OpcClient c = new OpcClient(ip);
                OpcConnections[ip] = c;
            } else {
                OpcClient c = new OpcClient(ip);
                OpcConnections.Add(ip, c);
                AddEventHandler(c);
            }

        }
        private void AddEventHandler(OpcClient c) {
            //    c.PropertyChanged += Opc_PropertyChanged;
        }

        private void Opc_PropertyChanged(object sender, System.ComponentModel.PropertyChangedEventArgs e) {
            OpcClient opc = sender as OpcClient;
            if (e.PropertyName.Equals("StateCurrent")) {
                
                //if successfully produced
                if (opc.StateCurrent == 17) {
                    System.Diagnostics.Debug.WriteLine((int)opc.AcceptableProducts);
                    Singleton.Instance.DBManager.RegisterBatch((int)opc.AcceptableProducts, (int)opc.DefectProducts,
                        opc.Start.ToString("MM/dd/yyyy HH:mm:ss:fff"), DateTime.Now.ToString("MM/dd/yyyy HH:mm:ss:fff"), DateTime.Now.AddYears(10).ToString("MM/dd/yyyy"), true, 1, 1, 1,
                        (int)opc.ProductsPerMinute,
                        3, GetMachineId(opc.Ip), lmao, lmao, lmao);
                }
            }
            if(e.PropertyName.Equals("StopReasonId") && opc.StateCurrent != 4) {
                System.Diagnostics.Debug.WriteLine(opc.StopReasonId);
                Singleton.Instance.DBManager.RegisterBatchAndAlarm((int)opc.AcceptableProducts, (int)opc.DefectProducts,
                        opc.Start.ToString("MM/dd/yyyy HH:mm:ss:fff"), DateTime.Now.ToString("MM/dd/yyyy HH:mm:ss:fff"), DateTime.Now.AddYears(10).ToString("MM/dd/yyyy"), true, 1, 1, 1,
                        (int)opc.ProductsPerMinute,
                        3, GetMachineId(opc.Ip), lmao, lmao, lmao,DateTime.Now.ToString("MM/dd/yyyy HH:mm:ss:fff"),(int)opc.StopReasonId);
                IList<AlarmModel> alarmies = Singleton.Instance.DBManager.RetrieveAlarms();
                AlarmModel a = alarmies[alarmies.Count-1];
                a.MachineId = GetMachineId(opc.Ip);
                System.Diagnostics.Debug.WriteLine(a.Id + a.MachineId + a.StopReason + a.StopReasonId);
                AlarmManager.ActiveAlarms.Add(a);


            }
        }
        private int GetMachineId(string ip) {
            IList<MachineModel> machines = Singleton.Instance.DBManager.RetrieveMachines();
            int i = 0;
            foreach (MachineModel m in machines) {
                if (m.Ip.Equals(ip)) {
                    i = (int)m.Id;
                }
            }
            return i;
        }

        public bool HandleCommand(string ip, string command) {
            OpcClient opc;
            bool succeeded = OpcConnections.TryGetValue(ip, out opc);
            if (succeeded) {
                switch (command) {
                    case "start":
                        if (Singleton.Instance.DBManager.RetrieveFromBatchQueue().Count > 0 && opc.StateCurrent == 4) {
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