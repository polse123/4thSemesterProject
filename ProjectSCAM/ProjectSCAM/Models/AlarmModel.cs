using ProjectSCAM.Models.Logic;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace ProjectSCAM.Models
{
    public class AlarmModel
    {
        public int Id { get; set; }
        public string Timestamp { get; set; }
        public int StopReasonId { get; set; }
        public int? HandledBy { get; set; }
        public int BatchId { get; set; }
        public int MachineId { get; set; }

        public string StopReason { get; set; }
        public bool ActionRequired { get; }
        public string HandlerName { get; set; }

        //used for handling the alarm
        private OpcClient opc;

        public AlarmModel(int id, string timestamp, int stopReasonId, int? handledBy, int batchId, bool actionRequired, string stopReason, string handlerName)
        {
            Id = id;
            Timestamp = timestamp ?? throw new ArgumentNullException(nameof(timestamp));
            StopReasonId = stopReasonId;
            HandledBy = handledBy;
            BatchId = batchId;
            ActionRequired = actionRequired;
            StopReason = stopReason ?? throw new ArgumentNullException(nameof(stopReason));
            HandlerName = handlerName;
        }
        public AlarmModel() {

        }
        private void LoadOpc()
        {
            if (opc == null)
            {
                MachineModel m;
                foreach (MachineModel machine in Singleton.Instance.DBManager.RetrieveMachines())
                {
                    if (machine.Id == MachineId)
                    {
                        m = machine;
                        opc = Singleton.Instance.opcManager.GetOpcConnection(m.Ip);
                    }
                }
            }
        }
        private void UpdateHandler(int userid)
        {
            Singleton.Instance.DBManager.SetAlarmHandler(userid,Id);
        }
        public bool Handle(int userid)
        {
            LoadOpc();
            if (StopReasonId == 10)
            {
                if(opc.Barley > 30000 && opc.Wheat > 30000 && opc.Yeast > 30000 && opc.Malt > 30000 && opc.Hops > 30000)
                {
                    Singleton.Instance.DBManager.SetAlarmHandler(userid, Id);
                    Singleton.Instance.opcManager.AlarmManager.ActiveAlarms.Remove(this);
                    return true;
                } else
                {
                    return false;
                }
            } else if(StopReasonId == 12)
            {
                if (opc.MaintenanceCounter <= (opc.MaintenanceTrigger * 0.8))
                {
                    Singleton.Instance.DBManager.SetAlarmHandler(userid, Id);
                    Singleton.Instance.opcManager.AlarmManager.ActiveAlarms.Remove(this);
                    return true;
                }
                else
                {
                    return false;
                }
            } else
            {
                Singleton.Instance.DBManager.SetAlarmHandler(userid, Id);
                Singleton.Instance.opcManager.AlarmManager.ActiveAlarms.Remove(this);
                return true;
            }
        }
    }
}
