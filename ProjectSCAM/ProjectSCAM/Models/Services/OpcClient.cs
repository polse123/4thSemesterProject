using ProjectSCAM.Models.Logic;
using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Globalization;
using System.Windows;
using System.Windows.Markup;
using UnifiedAutomation.UaBase;
using UnifiedAutomation.UaClient;

namespace ProjectSCAM.Models {
    public class OpcClient : INotifyPropertyChanged {
        public DateTime Start { get; set; }
        private bool isProcessRunning = false;
        private double processedProducts;
        private double defectProducts;
        private double acceptableProducts;
        private double amountToProduce;
        private double machSpeed;
        private double stateCurrent;
        private double tempCurrent;
        private double humidityCurrent;
        private double vibrationCurrent;
        private double stopReasonId;
        private double batchId;
        private double barley;
        private double hops;
        private double malt;
        private double wheat;
        private double yeast;
        //private double beerType;
        private double maintenanceTrigger = 0;
        private double maintenanceCounter;

        public Session Session { get; set; }
        public event PropertyChangedEventHandler PropertyChanged;
        public string Ip { get; set; }
        public int Recipe { get; set; }
        public BatchValueCollection BatchValues;
        public MachineModel Machine { get; set; }

        //Constructor with OPC connect and CreateSubscription
        public OpcClient(string ip, MachineModel m)
        {
            Machine = m;
            BatchValues = new BatchValueCollection();
            Ip = ip;
            Connect();
            if (Session.ConnectionStatus != ServerConnectionStatus.Disconnected)
            {
                CreateSubscription();
            }

        }

        //Connection to OPC
        public void Connect()
        {
            Session = new Session();
            try
            {
                //Connect to server with no security (simulator)
                Session.UseDnsNameAndPortFromDiscoveryUrl = true;
                Session.Connect(Ip, SecuritySelection.None);

                //Connect to server with no security (machine)
                //Session.Connect("opc.tcp://10.112.254.165:4840", SecuritySelection.None);
            }
            catch (Exception ex)
            {

            }
            if (Session.ConnectionStatus != ServerConnectionStatus.Disconnected)
            {
                maintenanceTrigger = ReadMaintenanceTrigger();
            }

        }

        public void CreateSubscription()
        {
            Subscription s;
            NodeId amountNode = new NodeId(Machine.AmountNode, (ushort)Machine.NameSpaceIndex);
            NodeId stateNode = new NodeId(Machine.StateNode, (ushort)Machine.NameSpaceIndex);
            NodeId defectNode = new NodeId(Machine.DefectNode, (ushort)Machine.NameSpaceIndex);
            NodeId acceptableNode = new NodeId(Machine.AcceptableNode, (ushort)Machine.NameSpaceIndex);
            NodeId amountToProduceNode = new NodeId(Machine.AmountToProduceNode, (ushort)Machine.NameSpaceIndex);
            NodeId machSpeedNode = new NodeId(Machine.MachSpeedNode, (ushort)Machine.NameSpaceIndex);
            NodeId tempNode = new NodeId(Machine.TemperatureNode, (ushort)Machine.NameSpaceIndex);
            NodeId humidityNode = new NodeId(Machine.HumidityNode, (ushort)Machine.NameSpaceIndex);
            NodeId vibrationNode = new NodeId(Machine.VibrationNode, (ushort)Machine.NameSpaceIndex);
            NodeId stopReasonNode = new NodeId(Machine.StopreasonNode, (ushort)Machine.NameSpaceIndex);
            NodeId bacthIdNode = new NodeId(Machine.BatchIdNode, (ushort)Machine.NameSpaceIndex);
            NodeId barleyNode = new NodeId(Machine.BarleyNode, (ushort)Machine.NameSpaceIndex);
            NodeId hopsNode = new NodeId(Machine.HopsNode, (ushort)Machine.NameSpaceIndex);
            NodeId maltNode = new NodeId(Machine.MaltNode, (ushort)Machine.NameSpaceIndex);
            NodeId wheatNode = new NodeId(Machine.WheatNode, (ushort)Machine.NameSpaceIndex);
            NodeId yeastNode = new NodeId(Machine.YeastNode, (ushort)Machine.NameSpaceIndex);
            NodeId maintenanceTriggerNode = new NodeId(Machine.MaintenanceTriggerNode, (ushort)Machine.NameSpaceIndex);
            NodeId maintenanceCounterNode = new NodeId(Machine.MaintenanceCounterNode, (ushort)Machine.NameSpaceIndex);

            // list of monitored items
            List<MonitoredItem> monitoredItems = new List<MonitoredItem>();
            // convert nodeid to datamonitoreditem
            MonitoredItem miAmountNode = new DataMonitoredItem(amountNode);
            MonitoredItem miStateNode = new DataMonitoredItem(stateNode);
            MonitoredItem miDefectNode = new DataMonitoredItem(defectNode);
            MonitoredItem miAcceptableNode = new DataMonitoredItem(acceptableNode);
            MonitoredItem miAmountToProduceNode = new DataMonitoredItem(amountToProduceNode);
            MonitoredItem miMachSpeedNode = new DataMonitoredItem(machSpeedNode);
            MonitoredItem miTempNode = new DataMonitoredItem(tempNode);
            MonitoredItem miHumidityNode = new DataMonitoredItem(humidityNode);
            MonitoredItem miVibrationNode = new DataMonitoredItem(vibrationNode);
            MonitoredItem miStopReasonNode = new DataMonitoredItem(stopReasonNode);
            MonitoredItem miBatchIdNode = new DataMonitoredItem(bacthIdNode);
            MonitoredItem miBarleyNode = new DataMonitoredItem(barleyNode);
            MonitoredItem miHopsNode = new DataMonitoredItem(hopsNode);
            MonitoredItem miMaltNode = new DataMonitoredItem(maltNode);
            MonitoredItem miWheatNode = new DataMonitoredItem(wheatNode);
            MonitoredItem miYeastNode = new DataMonitoredItem(yeastNode);
            MonitoredItem miMaintenanceTriggerNode = new DataMonitoredItem(maintenanceTriggerNode);
            MonitoredItem miMaintenanceCounterNode = new DataMonitoredItem(maintenanceCounterNode);

            miTempNode.SamplingInterval = 500;
            miVibrationNode.SamplingInterval = 1000;
            miHumidityNode.SamplingInterval = 500;

            monitoredItems.Add(miAmountNode);
            monitoredItems.Add(miStateNode);
            monitoredItems.Add(miDefectNode);
            monitoredItems.Add(miAcceptableNode);
            monitoredItems.Add(miAmountToProduceNode);
            monitoredItems.Add(miTempNode);
            monitoredItems.Add(miHumidityNode);
            monitoredItems.Add(miVibrationNode);
            monitoredItems.Add(miStopReasonNode);
            monitoredItems.Add(miBatchIdNode);
            monitoredItems.Add(miBarleyNode);
            monitoredItems.Add(miHopsNode);
            monitoredItems.Add(miMaltNode);
            monitoredItems.Add(miWheatNode);
            monitoredItems.Add(miYeastNode);
            monitoredItems.Add(miMachSpeedNode);
            monitoredItems.Add(miMaintenanceTriggerNode);
            monitoredItems.Add(miMaintenanceCounterNode);

            // init subscription with parameters
            s = new Subscription(Session);
            s.PublishingInterval = 250;
            s.MaxKeepAliveTime = 1000;
            s.Lifetime = 1000000;
            s.MaxNotificationsPerPublish = 1;
            s.Priority = (byte)0;
            s.DataChanged += OnDataChanged;
            s.PublishingEnabled = true;
            s.CreateMonitoredItems(monitoredItems);
            // create the actual subscription
            s.Create(new RequestSettings() { OperationTimeout = 10000 });
        }
        private void OnDataChanged(Subscription s, DataChangedEventArgs e)
        {
            string sop = "" + Machine.StateNode + "";
            foreach (DataChange dc in e.DataChanges)
            {
                string identifier = dc.MonitoredItem.NodeId.Identifier.ToString();
                if (identifier.Equals(Machine.StateNode))
                {
                    StateCurrent = double.Parse(dc.Value.ToString());
                }
                else if (identifier.Equals(Machine.AmountNode))
                {
                    ProcessedProducts = double.Parse(dc.Value.ToString());
                }
                else if (identifier.Equals(Machine.TemperatureNode))
                {
                    TempCurrent = double.Parse((dc.Value.WrappedValue.ToFloat().ToString()));
                    BatchValues.TemperatureValues.Add(new KeyValuePair<string, double>
                        (DateTime.Now.ToString("MM/dd/yyyy HH:mm:ss:fff"), TempCurrent));

                }
                else if (identifier.Equals(Machine.DefectNode))
                {
                    DefectProducts = double.Parse(dc.Value.ToString());
                }
                else if (identifier.Equals(Machine.AcceptableNode))
                {
                    AcceptableProducts = double.Parse(dc.Value.ToString());
                }
                else if (identifier.Equals(Machine.AmountToProduceNode))
                {
                    AmountToProduce = double.Parse(dc.Value.ToString());
                }
                else if (identifier.Equals(Machine.MachSpeedNode))
                {
                    MachSpeed = double.Parse(dc.Value.ToString());
                }
                else if (identifier.Equals(Machine.HumidityNode))
                {
                    HumidityCurrent = double.Parse((dc.Value.WrappedValue.ToFloat().ToString()));
                    BatchValues.HumidityValues.Add(new KeyValuePair<string, double>
                        (DateTime.Now.ToString("MM/dd/yyyy HH:mm:ss:fff"), HumidityCurrent));
                }
                else if (identifier.Equals(Machine.VibrationNode))
                {
                    VibrationCurrent = double.Parse((dc.Value.WrappedValue.ToFloat().ToString()));
                    BatchValues.VibrationValues.Add(new KeyValuePair<string, double>
                        (DateTime.Now.ToString("MM/dd/yyyy HH:mm:ss:fff"), VibrationCurrent));
                }
                else if (identifier.Equals(Machine.StopreasonNode))
                {
                    StopReasonId = double.Parse(dc.Value.ToString());
                }
                else if (identifier.Equals(Machine.BatchIdNode))
                {
                    BatchId = double.Parse(dc.Value.ToString());
                }
                else if (identifier.Equals(Machine.BarleyNode))
                {
                    Barley = double.Parse(dc.Value.ToString());
                }
                else if (identifier.Equals(Machine.HopsNode))
                {
                    Hops = double.Parse(dc.Value.ToString());
                }
                else if (identifier.Equals(Machine.MaltNode))
                {
                    Malt = double.Parse(dc.Value.ToString());
                }
                else if (identifier.Equals(Machine.WheatNode))
                {
                    Wheat = double.Parse(dc.Value.ToString());
                }
                else if (identifier.Equals(Machine.YeastNode))
                {
                    Yeast = double.Parse(dc.Value.ToString());
                }
                else if (identifier.Equals(Machine.MaintenanceTriggerNode))
                {
                    MaintenanceTrigger = double.Parse(dc.Value.ToString());
                }
                else if (identifier.Equals(Machine.MaintenanceCounterNode))
                {
                    MaintenanceCounter = double.Parse(dc.Value.ToString());
                }
            }
        }
        public void ClearValues()
        {
            ProcessedProducts = 0;
            DefectProducts = 0;
            AcceptableProducts = 0;
            AmountToProduce = 0;
            MachSpeed = 0;
            StateCurrent = 0;
            TempCurrent = 0;
            HumidityCurrent = 0;
            VibrationCurrent = 0;
            StopReasonId = 0;
            BatchId = 0;
            BatchValues = new BatchValueCollection();

        }

        public void Disconnect()
        {
            Session.Disconnect();
        }

        public void ResetMachine()
        {
            if (!isProcessRunning)
            {
                isProcessRunning = true;
                // collection of nodes to be written
                WriteValueCollection nodesToWrite = new WriteValueCollection();
                DataValue reset = new DataValue();
                reset.Value = 1;
                DataValue changeRequest = new DataValue();
                changeRequest.Value = true;
                nodesToWrite.Add(CreateWriteValue("::Program:Cube.Command.CntrlCmd", 6, Attributes.Value, reset));
                nodesToWrite.Add(CreateWriteValue("::Program:Cube.Command.CmdChangeRequest", 6, Attributes.Value,
                    changeRequest));
                Write(nodesToWrite);
                isProcessRunning = false;
            }
        }

        public void StopMachine()
        {
            if (!isProcessRunning)
            {
                isProcessRunning = true;
                // collection of nodes to be written
                WriteValueCollection nodesToWrite = new WriteValueCollection();
                DataValue stop = new DataValue();
                stop.Value = 3;
                DataValue changeRequest = new DataValue();
                changeRequest.Value = true;

                nodesToWrite.Add(CreateWriteValue("::Program:Cube.Command.CntrlCmd", 6, Attributes.Value, stop));
                nodesToWrite.Add(CreateWriteValue("::Program:Cube.Command.CmdChangeRequest", 6, Attributes.Value,
                    changeRequest));
                Write(nodesToWrite);
                isProcessRunning = false;
            }
        }

        public void AbortMachine()
        {
            if (!isProcessRunning)
            {
                isProcessRunning = true;
                // collection of nodes to be written
                WriteValueCollection nodesToWrite = new WriteValueCollection();
                DataValue abort = new DataValue();
                abort.Value = 4;
                DataValue changeRequest = new DataValue();
                changeRequest.Value = true;

                nodesToWrite.Add(CreateWriteValue("::Program:Cube.Command.CntrlCmd", 6, Attributes.Value, abort));
                nodesToWrite.Add(CreateWriteValue("::Program:Cube.Command.CmdChangeRequest", 6, Attributes.Value,
                    changeRequest));
                Write(nodesToWrite);
                isProcessRunning = false;
            }
        }

        public void ClearMachine()
        {
            if (!isProcessRunning)
            {
                isProcessRunning = true;
                // collection of nodes to be written
                WriteValueCollection nodesToWrite = new WriteValueCollection();
                DataValue clear = new DataValue();
                clear.Value = 5;
                DataValue changeRequest = new DataValue();
                changeRequest.Value = true;

                nodesToWrite.Add(CreateWriteValue("::Program:Cube.Command.CntrlCmd", 6, Attributes.Value, clear));
                nodesToWrite.Add(CreateWriteValue("::Program:Cube.Command.CmdChangeRequest", 6, Attributes.Value,
                    changeRequest));
                Write(nodesToWrite);
                isProcessRunning = false;
            }
        }

        public void StartMachine(float batchId, float productType,
            float amountToProduce, float machineSpeed)
        {
            if (!isProcessRunning)
            {
                float speed;
                float recipeMaxSpeed = ServiceSingleton.Instance.DBService.RetrieveMaxSpeed((int)productType);
                if (machineSpeed > recipeMaxSpeed)
                {
                    speed = recipeMaxSpeed;
                }
                else
                {
                    speed = machineSpeed;
                }
                isProcessRunning = true;
                Start = DateTime.Now;
                Recipe = (int)productType;
                // collection of nodes to be written
                WriteValueCollection nodesToWrite = new WriteValueCollection();
                DataValue start = new DataValue();
                start.Value = 2;
                DataValue changeRequest = new DataValue();
                changeRequest.Value = true;
                System.Diagnostics.Debug.WriteLine(Recipe);

                //write the nodes & clear the collection
                //Thread.Sleep(2000);
                // Create nodes necessary for starting machine
                // batch id
                nodesToWrite.Add(CreateWriteValue("::Program:Cube.Command.Parameter[0].Value", 6,
                    Attributes.Value, CreateDataValue(batchId)));
                // product type
                nodesToWrite.Add(CreateWriteValue("::Program:Cube.Command.Parameter[1].Value", 6,
                    Attributes.Value, CreateDataValue(Recipe)));
                // amount of product to be produced
                nodesToWrite.Add(CreateWriteValue("::Program:Cube.Command.Parameter[2].Value", 6,
                    Attributes.Value, CreateDataValue(amountToProduce)));
                // machine speed
                nodesToWrite.Add(CreateWriteValue("::Program:Cube.Command.MachSpeed", 6,
                    Attributes.Value, CreateDataValue(speed)));
                nodesToWrite.Add(CreateWriteValue("::Program:Cube.Command.CntrlCmd", 6, Attributes.Value, start));
                nodesToWrite.Add(CreateWriteValue("::Program:Cube.Command.CmdChangeRequest", 6, Attributes.Value,
                    changeRequest));
                Write(nodesToWrite);
                AddValues();
                isProcessRunning = false;
            }
        }
        public void AddValues()
        {
            BatchValues.TemperatureValues.Add(new KeyValuePair<string, double>(DateTime.Now.ToString("MM/dd/yyyy HH:mm:ss:fff"),
                ReadCurrentTemperature()));
            BatchValues.HumidityValues.Add(new KeyValuePair<string, double>(DateTime.Now.ToString("MM/dd/yyyy HH:mm:ss:fff"),
                ReadCurrentHumidity()));
            BatchValues.VibrationValues.Add(new KeyValuePair<string, double>(DateTime.Now.ToString("MM/dd/yyyy HH:mm:ss:fff"),
                ReadCurrentVibration()));
        }

        //Write to OPC
        private WriteValue CreateWriteValue(string nodeId, ushort namespaceIndex, uint attributeId, DataValue val)
        {
            return new WriteValue()
            {
                NodeId = new NodeId(nodeId, namespaceIndex),
                AttributeId = attributeId,
                Value = val
            };
        }

        //Creates a OPC data value object
        private DataValue CreateDataValue(float f)
        {
            return new DataValue()
            {
                Value = f
            };
        }

        //Writes a WriteValueCollection to the Session
        public void Write(WriteValueCollection nodesToWrite)
        {
            Session.Write(nodesToWrite);
        }

        //TODO skal fjernes herfra og ned (read metoder)
        private void StatusUpdateHandler(Session s, ServerConnectionStatusUpdateEventArgs e)
        {
            Console.WriteLine("succ");
        }

        public Int32 ReadStateCurrent()
        {
            ReadValueIdCollection nodesToRead = new ReadValueIdCollection();
            nodesToRead.Add(new ReadValueId()
            {
                NodeId = new NodeId("::Program:Cube.Status.StateCurrent", 6),
                AttributeId = Attributes.Value
            });
            List<DataValue> results = Session.Read(nodesToRead);
            DataValue dv = results[0];
            return (int)dv.Value;
        }


        public int readDataTypes()
        {
            ReadValueIdCollection nodesToRead = new ReadValueIdCollection();
            nodesToRead.Add(new ReadValueId()
            {
                NodeId = new NodeId("::Program:Cube.Command.Parameter[0].Value", 6),
                AttributeId = Attributes.Value
            });

            List<DataValue> result = null;
            result = Session.Read(nodesToRead, 0, TimestampsToReturn.Neither, null);
            //return TypeUtils.GetBuiltInType((NodeId)result[0].Value);
            return (int)result[0].Value;
        }

        public float ReadCurrentMachineSpeed()
        {
            ReadValueIdCollection nodesToRead = new ReadValueIdCollection();
            nodesToRead.Add(new ReadValueId()
            {
                NodeId = new NodeId("::Program:Cube.Status.CurMachSpeed", 6),
                AttributeId = Attributes.Value
            });

            List<DataValue> results = Session.Read(nodesToRead);
            DataValue dv = results[0];
            return (float)dv.Value;
        }

        public float ReadMachineSpeed()
        {
            ReadValueIdCollection nodesToRead = new ReadValueIdCollection();
            nodesToRead.Add(new ReadValueId()
            {
                NodeId = new NodeId("::Program:Cube.Status.MachSpeed", 6),
                AttributeId = Attributes.Value
            });

            List<DataValue> results = Session.Read(nodesToRead);
            DataValue dv = results[0];
            return (float)dv.Value;
        }


        public float ReadCurrentHumidity()
        {
            ReadValueIdCollection nodesToRead = new ReadValueIdCollection();
            nodesToRead.Add(new ReadValueId()
            {
                NodeId = new NodeId("::Program:Cube.Status.Parameter[2].Value", 6),
                AttributeId = Attributes.Value
            });

            List<DataValue> results = Session.Read(nodesToRead);
            DataValue dv = results[0];
            return (float)dv.Value;
        }

        public float ReadCurrentTemperature()
        {
            ReadValueIdCollection nodesToRead = new ReadValueIdCollection();
            nodesToRead.Add(new ReadValueId()
            {
                NodeId = new NodeId("::Program:Cube.Status.Parameter[3].Value", 6),
                AttributeId = Attributes.Value
            });

            List<DataValue> results = Session.Read(nodesToRead);
            DataValue dv = results[0];
            return (float)dv.Value;
        }

        public float ReadCurrentVibration()
        {
            ReadValueIdCollection nodesToRead = new ReadValueIdCollection();
            nodesToRead.Add(new ReadValueId()
            {
                NodeId = new NodeId("::Program:Cube.Status.Parameter[4].Value", 6),
                AttributeId = Attributes.Value
            });

            List<DataValue> results = Session.Read(nodesToRead);
            DataValue dv = results[0];
            return (float)dv.Value;
        }

        public Int32 ReadCurrentProductsProcessed()
        {
            ReadValueIdCollection nodesToRead = new ReadValueIdCollection();
            nodesToRead.Add(new ReadValueId()
            {
                NodeId = new NodeId("::Program:Cube.Admin.ProdProcessedCount", 6),
                AttributeId = Attributes.Value
            });

            List<DataValue> results = Session.Read(nodesToRead);
            DataValue dv = results[0];
            return (int)dv.Value;
        }

        public Int32 ReadDefectProducts()
        {
            ReadValueIdCollection nodesToRead = new ReadValueIdCollection();
            nodesToRead.Add(new ReadValueId()
            {
                NodeId = new NodeId("::Program:Cube.Admin.ProdDefectiveCount", 6),
                AttributeId = Attributes.Value
            });

            List<DataValue> results = Session.Read(nodesToRead);
            DataValue dv = results[0];
            return (int)dv.Value;
        }

        public UInt16 ReadMaintenanceTrigger()
        {
            ReadValueIdCollection nodesToRead = new ReadValueIdCollection();
            nodesToRead.Add(new ReadValueId()
            {
                NodeId = new NodeId("::Program:Maintenance.Trigger", 6),
                AttributeId = Attributes.Value
            });

            List<DataValue> results = Session.Read(nodesToRead);
            DataValue dv = results[0];
            return (UInt16)dv.Value;
        }


        protected void OnPropertyChanged(string name)
        {
            PropertyChangedEventHandler handler = PropertyChanged;
            if (handler != null)
            {
                handler(this, new PropertyChangedEventArgs(name));
            }
        }

        public double ProcessedProducts {
            get { return processedProducts; }
            set {
                processedProducts = value;
                OnPropertyChanged("ProcessedProducts");
            }
        }

        public double AcceptableProducts {
            get { return acceptableProducts; }
            set {
                acceptableProducts = value;
                OnPropertyChanged("AcceptableProducts");
            }
        }

        public double DefectProducts {
            get { return defectProducts; }
            set {
                defectProducts = value;
                OnPropertyChanged("DefectProducts");
            }
        }

        public double AmountToProduce {
            get { return amountToProduce; }

            set {
                amountToProduce = value;
                OnPropertyChanged("AmountToProduce");
            }
        }



        public double StateCurrent {
            get { return stateCurrent; }
            set {
                stateCurrent = value;
                OnPropertyChanged("StateCurrent");
            }
        }

        public double TempCurrent {
            get { return tempCurrent; }
            set {
                tempCurrent = value;
                OnPropertyChanged("TempCurrent");
            }
        }

        public double HumidityCurrent {
            get { return humidityCurrent; }
            set {
                humidityCurrent = value;
                OnPropertyChanged("HumidityCurrent");
            }
        }

        public double VibrationCurrent {
            get { return vibrationCurrent; }
            set {
                vibrationCurrent = value;
                OnPropertyChanged("VibrationCurrent");
            }
        }

        public double BatchId {
            get { return batchId; }
            set {
                stopReasonId = value;
                OnPropertyChanged("BatchId");
            }
        }

        public double StopReasonId {
            get { return stopReasonId; }
            set {
                stopReasonId = value;
                OnPropertyChanged("StopReasonId");
            }
        }

        public double Barley {
            get { return barley; }
            set {
                barley = value;
                OnPropertyChanged("Barley");
            }
        }

        public double Hops {
            get { return hops; }
            set {
                hops = value;
                OnPropertyChanged("Hops");
            }
        }

        public double Malt {
            get { return malt; }
            set {
                malt = value;
                OnPropertyChanged("Malt");
            }
        }
        public double MachSpeed {
            get { return machSpeed; }
            set {
                machSpeed = value;
                OnPropertyChanged("MachSpeed");
            }
        }

        public double Wheat {
            get { return wheat; }
            set {
                wheat = value;
                OnPropertyChanged("Wheat");
            }
        }

        public double Yeast {
            get { return yeast; }
            set {
                yeast = value;
                OnPropertyChanged("Yeast");
            }
        }

        public double MaintenanceTrigger {
            get { return maintenanceTrigger; }
            set {
                maintenanceTrigger = value;
                OnPropertyChanged("MaintenanceTrigger");
            }
        }

        public double MaintenanceCounter {
            get {
                if (maintenanceTrigger == 0)
                {
                    return maintenanceCounter;
                }
                else
                {
                    return (int)(maintenanceCounter / maintenanceTrigger * 100);
                }
            }
            set {
                maintenanceCounter = value;
                OnPropertyChanged("MaintenanceCounter");
            }
        }
    }
}