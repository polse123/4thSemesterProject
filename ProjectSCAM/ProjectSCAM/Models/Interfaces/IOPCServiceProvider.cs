using System.Collections.Generic;

namespace ProjectSCAM.Models.Logic {
    public interface IOPCServiceProvider {
        IList<AlarmModel> ActiveAlarms { get; set; }
        Dictionary<string, OpcClient> OpcConnections { get; set; }

        MachineModel GetMachine(string ip);
        OpcClient GetOpcConnection(string ip);
        bool HandleCommand(string ip, string command);
        void InitConnection(string ip);
    }
}