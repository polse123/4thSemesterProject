﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Web;

namespace ProjectSCAM.Models.Logic {
    public class OPCServiceProvider {
        public Dictionary<string, OpcClient> OpcConnections { get; set; }
        public AlarmManager AlarmManager { get; set; }
        private BatchValueCollection bvc = new BatchValueCollection();

        public OPCServiceProvider()
        {
            AlarmManager = new AlarmManager();
            OpcConnections = new Dictionary<string, OpcClient>();
        }

        public void InitConnection(string ip)
        {
            foreach (AlarmModel alarm in ServiceSingleton.Instance.DBManager.RetrieveUnhandledAlarms(GetMachineId(ip)))
            {
                AlarmManager.ActiveAlarms.Add(alarm);
            }
            OpcClient c = new OpcClient(ip, GetMachine(ip));
            if (OpcConnections.ContainsKey(ip))
            {
                OpcConnections[ip] = c;
                AddEventHandler(c);
            }
            else
            {
                OpcConnections.Add(ip, c);
                AddEventHandler(c);
            }
        }
        private void AddEventHandler(OpcClient c)
        {
            c.PropertyChanged += Opc_PropertyChanged;
        }

        private void Opc_PropertyChanged(object sender, System.ComponentModel.PropertyChangedEventArgs e)
        {
            OpcClient opc = sender as OpcClient;
            // triggers when machine state changes
            if (e.PropertyName.Equals("StateCurrent"))
            {
                //proceed if batch was completed successfully
                if (opc.StateCurrent == 17)
                {
                    opc.AddValues();
                    DateTime end = DateTime.Now;
                    OEE oee = new OEE((int)opc.AcceptableProducts, (int)opc.DefectProducts, opc.Start, end, ServiceSingleton.Instance.DBManager.RetrieveMaxSpeed(opc.Recipe));
                    ServiceSingleton.Instance.DBManager.RegisterBatch((int)opc.AcceptableProducts, (int)opc.DefectProducts,
                        opc.Start.ToString("MM/dd/yyyy HH:mm:ss:fff"), DateTime.Now.ToString("MM/dd/yyyy HH:mm:ss:fff"), DateTime.Now.AddYears(10).ToString("MM/dd/yyyy"), true,
                        oee.CalculatePerformance(), oee.CalculateQuality(), oee.CalculateAvailability(),
                        (int)opc.MachSpeed,
                        3, GetMachineId(opc.Ip), opc.BatchValues.TemperatureValues, opc.BatchValues.HumidityValues, opc.BatchValues.VibrationValues);

                }
            }
            if (e.PropertyName.Equals("StopReasonId") && AlarmManager.ActiveAlarms.Count == 0 && opc.StateCurrent != 4 && opc.StopReasonId != 0 && opc.AmountToProduce != 0)
            {
                opc.AddValues();
                AlarmModel alarm = ServiceSingleton.Instance.DBManager.RegisterBatchAndAlarm((int)opc.AcceptableProducts, (int)opc.DefectProducts,
                        opc.Start.ToString("MM/dd/yyyy HH:mm:ss:fff"), DateTime.Now.ToString("MM/dd/yyyy HH:mm:ss:fff"), DateTime.Now.AddYears(10).ToString("MM/dd/yyyy"), false, 1, 1, 1,
                        (int)opc.MachSpeed,
                        3, GetMachineId(opc.Ip), opc.BatchValues.TemperatureValues, opc.BatchValues.HumidityValues, opc.BatchValues.VibrationValues, DateTime.Now.ToString("MM/dd/yyyy HH:mm:ss:fff"), (int)opc.StopReasonId);
                alarm.MachineId = GetMachineId(opc.Ip);
                AlarmManager.ActiveAlarms.Add(alarm);
                opc.ResetMachine();


            }
        }
        private MachineModel GetMachine(string ip)
        {
            MachineModel machine = new MachineModel();
            foreach (MachineModel m in ServiceSingleton.Instance.DBManager.RetrieveMachines())
            {
                if (m.Ip.Equals(ip))
                {
                    machine = m;
                }
            }
            return machine;
        }

        private int GetMachineId(string ip)
        {
            IList<MachineModel> machines = ServiceSingleton.Instance.DBManager.RetrieveMachines();
            int i = 0;
            foreach (MachineModel m in machines)
            {
                if (m.Ip.Equals(ip))
                {
                    i = (int)m.Id;
                }
            }
            return i;
        }

        public bool HandleCommand(string ip, string command)
        {
            OpcClient opc;
            bool succeeded = OpcConnections.TryGetValue(ip, out opc);
            if (succeeded)
            {
                switch (command)
                {
                    case "start":
                        if (ServiceSingleton.Instance.DBManager.RetrieveFromBatchQueue().Count > 0 && opc.StateCurrent == 4)
                        {
                            BatchQueueModel bqm = ServiceSingleton.Instance.DBManager.RetrieveFromBatchQueue()[0];
                            ServiceSingleton.Instance.DBManager.RemoveFromBatchQueue(bqm.Id);
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

        public OpcClient GetOpcConnection(string ip)
        {
            OpcClient opc;
            OpcConnections.TryGetValue(ip, out opc);
            return opc;
        }
    }
}