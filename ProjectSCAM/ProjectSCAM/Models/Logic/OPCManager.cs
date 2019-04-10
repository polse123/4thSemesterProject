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

            string ip2 = "opc.tcp://192.168.0.122:4840";
            OpcConnections.Add(ip, new OpcClient(ip));
            OpcConnections.Add(ip2, new OpcClient(ip2));

        }
        public bool HandleCommand(string ip, string command) {
            OpcClient opc;
            bool succeeded = OpcConnections.TryGetValue(ip,out opc);
                opc.HandleCommand(command);
            return succeeded;
        }
        public OpcClient GetOpcConnection(string ip) {
            OpcClient opc;
            OpcConnections.TryGetValue(ip, out opc);          
            return opc;
        }
    }
}