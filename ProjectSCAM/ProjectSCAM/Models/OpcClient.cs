using ProjectSCAM.Models.Logic;
using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Globalization;
using System.Windows;
using System.Windows.Markup;
using UnifiedAutomation.UaBase;
using UnifiedAutomation.UaClient;
using ProjectSCAM.Models;

namespace SCAMS.Models {
    public class OpcClient : INotifyPropertyChanged {
        private bool isProcessRunning = false;
        private double processedProducts;
        private double defectProducts;
        private double acceptableProducts;
        private double amountToProduce;
        private double productsPerMinute;
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
        private double maintenanceTrigger = 0;
        private double maintenanceCounter;

        private Session session;
        public event PropertyChangedEventHandler PropertyChanged;

        //Constructor with OPC connect and CreateSubscription
        public OpcClient() {
            Connect();
            CreateSubscription();
        }

        //Connection to OPC
        public void Connect() {
            session = new Session();
            try {
                //Connect to server with no security (simulator)
                //session.Connect("opc.tcp://127.0.0.1:4840", SecuritySelection.None);
                session.UseDnsNameAndPortFromDiscoveryUrl = true;
                //Connect to server with no security (machine)
                session.Connect("opc.tcp://10.112.254.165:4840", SecuritySelection.None);
            } catch (Exception ex) {

            }

            batchId = ReadCurrentBatchId();
            maintenanceTrigger = ReadMaintenanceTrigger();
        }

        public void CreateSubscription() {
            Subscription s;
            NodeId amountNode = new NodeId("::Program:Cube.Admin.ProdProcessedCount", 6);
            NodeId stateNode = new NodeId("::Program:Cube.Status.StateCurrent", 6);
            NodeId defectNode = new NodeId("::Program:Cube.Admin.ProdDefectiveCount", 6);
            NodeId acceptableNode = new NodeId("::Program:product.good", 6);
            NodeId amountToProduceNode = new NodeId("::Program:product.produce_amount", 6);
            NodeId productsPerMinuteNode = new NodeId("::Program:Cube.Status.MachSpeed", 6);
            NodeId tempNode = new NodeId("::Program:Cube.Status.Parameter[3].Value", 6);
            NodeId humidityNode = new NodeId("::Program:Cube.Status.Parameter[2].Value", 6);
            NodeId vibrationNode = new NodeId("::Program:Cube.Status.Parameter[4].Value", 6);
            NodeId stopReasonNode = new NodeId("::Program:Cube.Admin.StopReason.ID", 6);
            NodeId bacthIdNode = new NodeId("::Program:Cube.Status.Parameter[0].Value", 6);
            NodeId barleyNode = new NodeId("::Program:Inventory.Barley", 6);
            NodeId hopsNode = new NodeId("::Program:Inventory.Hops", 6);
            NodeId maltNode = new NodeId("::Program:Inventory.Malt", 6);
            NodeId wheatNode = new NodeId("::Program:Inventory.Wheat", 6);
            NodeId yeastNode = new NodeId("::Program:Inventory.Yeast", 6);
            NodeId maintenanceTriggerNode = new NodeId("::Program:Maintenance.Trigger", 6);
            NodeId maintenanceCounterNode = new NodeId("::Program:Maintenance.Counter", 6);

            // list of monitored items
            List<MonitoredItem> monitoredItems = new List<MonitoredItem>();
            // convert nodeid to datamonitoreditem
            MonitoredItem miAmountNode = new DataMonitoredItem(amountNode);
            MonitoredItem miStateNode = new DataMonitoredItem(stateNode);
            MonitoredItem miDefectNode = new DataMonitoredItem(defectNode);
            MonitoredItem miAcceptableNode = new DataMonitoredItem(acceptableNode);
            MonitoredItem miAmountToProduceNode = new DataMonitoredItem(amountToProduceNode);
            MonitoredItem miProductsPerMinuteNode = new DataMonitoredItem(productsPerMinuteNode);
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
            monitoredItems.Add(miProductsPerMinuteNode);
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
            monitoredItems.Add(miMaintenanceTriggerNode);
            monitoredItems.Add(miMaintenanceCounterNode);

            // init subscription with parameters
            s = new Subscription(session);
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
        public void HandleCommand(string command) {
            switch (command) {
                case "start":
                    StartMachine(10, 1, 1000, 60);
                    break;
                case "stop":
                    StopMachine();
                    break;
                case "clear":
                    ClearMachine();
                    break;
                case "abort":
                    AbortMachine();
                    break;
                case "reset":
                    ResetMachine();
                    break;
                default:
                    throw new Exception("Invalid command");
            }
        }
        private void OnDataChanged(Subscription s, DataChangedEventArgs e) {
            foreach (DataChange dc in e.DataChanges) {
                switch (dc.MonitoredItem.NodeId.Identifier.ToString()) {
                    // current state
                    case "::Program:Cube.Status.StateCurrent":
                        StateCurrent = double.Parse(dc.Value.ToString());
                        break;
                    // products processed
                    case "::Program:Cube.Admin.ProdProcessedCount":
                        ProcessedProducts = double.Parse(dc.Value.ToString());
                        break;
                    //  temperature
                    case "::Program:Cube.Status.Parameter[3].Value":
                        TempCurrent = double.Parse((dc.Value.WrappedValue.ToFloat().ToString()));
                        break;
                    // defect products processed
                    case "::Program:Cube.Admin.ProdDefectiveCount":
                        DefectProducts = double.Parse(dc.Value.ToString());
                        break;
                    // acceptable products processed
                    case "::Program:product.good":
                        AcceptableProducts = double.Parse(dc.Value.ToString());
                        break;
                    // amount of products to be produced
                    case "::Program:product.produce_amount":
                        AmountToProduce = double.Parse(dc.Value.ToString());
                        break;
                    // products per minute
                    case "::Program:Cube.Status.MachSpeed":
                        ProductsPerMinute = double.Parse(dc.Value.ToString());
                        break;
                    //relative humidity
                    case "::Program:Cube.Status.Parameter[2].Value":
                        HumidityCurrent = double.Parse((dc.Value.WrappedValue.ToFloat().ToString()));
                        break;
                    //vibration
                    case "::Program:Cube.Status.Parameter[4].Value":
                        VibrationCurrent = double.Parse((dc.Value.WrappedValue.ToFloat().ToString()));
                        break;
                    //stop reason id  StopReasonId
                    case "::Program:Cube.Admin.StopReason.ID":
                        StopReasonId = double.Parse(dc.Value.ToString());
                        Singleton.Instance.Alarms.AddLast(new AlarmModel());
                        break;
                    //batch id  BatchId
                    case "::Program:Cube.Status.Parameter[0].Value":
                        BatchId = double.Parse(dc.Value.ToString());
                        break;
                    //barley 
                    case "::Program:Inventory.Barley":
                        Barley = double.Parse(dc.Value.ToString());
                        break;
                    //hops
                    case "::Program:Inventory.Hops":
                        Hops = double.Parse(dc.Value.ToString());
                        break;
                    //malt
                    case "::Program:Inventory.Malt":
                        Malt = double.Parse(dc.Value.ToString());
                        break;
                    //wheat
                    case "::Program:Inventory.Wheat":
                        Wheat = double.Parse(dc.Value.ToString());
                        break;
                    //yeast
                    case "::Program:Inventory.Yeast":
                        Yeast = double.Parse(dc.Value.ToString());
                        break;
                    //maintenance trigger
                    case "::Program.Maintenance.Trigger":
                        MaintenanceTrigger = double.Parse(dc.Value.ToString());
                        break;
                    //maintenance counter
                    case "::Program:Maintenance.Counter":
                        MaintenanceCounter = double.Parse(dc.Value.ToString());
                        break;
                    default:
                        break;
                }
            }
        }

        public void Disconnect() {
            session.Disconnect();
        }

        public void ResetMachine() {
            if (!isProcessRunning) {
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

        public void StopMachine() {
            if (!isProcessRunning) {
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

        public void AbortMachine() {
            if (!isProcessRunning) {
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

        public void ClearMachine() {
            if (!isProcessRunning) {
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
            float amountToProduce, float machineSpeed) {
            if (!isProcessRunning) {
                isProcessRunning = true;
                // collection of nodes to be written
                WriteValueCollection nodesToWrite = new WriteValueCollection();
                DataValue start = new DataValue();
                start.Value = 2;
                DataValue changeRequest = new DataValue();
                changeRequest.Value = true;

                //write the nodes & clear the collection
                //Thread.Sleep(2000);
                // Create nodes necessary for starting machine
                // batch id
                nodesToWrite.Add(CreateWriteValue("::Program:Cube.Command.Parameter[0].Value", 6,
                    Attributes.Value, CreateDataValue(batchId)));
                // product type
                nodesToWrite.Add(CreateWriteValue("::Program:Cube.Command.Parameter[1].Value", 6,
                    Attributes.Value, CreateDataValue(productType)));
                // amount of product to be produced
                nodesToWrite.Add(CreateWriteValue("::Program:Cube.Command.Parameter[2].Value", 6,
                    Attributes.Value, CreateDataValue(amountToProduce)));
                // machine speed
                nodesToWrite.Add(CreateWriteValue("::Program:Cube.Command.MachSpeed", 6,
                    Attributes.Value, CreateDataValue(machineSpeed)));
                nodesToWrite.Add(CreateWriteValue("::Program:Cube.Command.CntrlCmd", 6, Attributes.Value, start));
                nodesToWrite.Add(CreateWriteValue("::Program:Cube.Command.CmdChangeRequest", 6, Attributes.Value,
                    changeRequest));

                Write(nodesToWrite);
                isProcessRunning = false;
            }
        }

        //Write to OPC
        private WriteValue CreateWriteValue(string nodeId, ushort namespaceIndex, uint attributeId, DataValue val) {
            return new WriteValue() {
                NodeId = new NodeId(nodeId, namespaceIndex),
                AttributeId = attributeId,
                Value = val
            };
        }

        //Creates a OPC data value object
        private DataValue CreateDataValue(float f) {
            return new DataValue() {
                Value = f
            };
        }

        //Writes a WriteValueCollection to the session
        public void Write(WriteValueCollection nodesToWrite) {
            session.Write(nodesToWrite);
        }

        //TODO skal fjernes herfra og ned (read metoder)
        private void StatusUpdateHandler(Session s, ServerConnectionStatusUpdateEventArgs e) {
            Console.WriteLine("succ");
        }

        public Int32 ReadStateCurrent() {
            ReadValueIdCollection nodesToRead = new ReadValueIdCollection();
            nodesToRead.Add(new ReadValueId() {
                NodeId = new NodeId("::Program:Cube.Status.StateCurrent", 6),
                AttributeId = Attributes.Value
            });
            List<DataValue> results = session.Read(nodesToRead);
            DataValue dv = results[0];
            return (int)dv.Value;
        }


        public int readDataTypes() {
            ReadValueIdCollection nodesToRead = new ReadValueIdCollection();
            nodesToRead.Add(new ReadValueId() {
                NodeId = new NodeId("::Program:Cube.Command.Parameter[0].Value", 6),
                AttributeId = Attributes.Value
            });

            List<DataValue> result = null;
            result = session.Read(nodesToRead, 0, TimestampsToReturn.Neither, null);
            //return TypeUtils.GetBuiltInType((NodeId)result[0].Value);
            return (int)result[0].Value;
        }

        public float ReadCurrentMachineSpeed() {
            ReadValueIdCollection nodesToRead = new ReadValueIdCollection();
            nodesToRead.Add(new ReadValueId() {
                NodeId = new NodeId("::Program:Cube.Status.CurMachSpeed", 6),
                AttributeId = Attributes.Value
            });

            List<DataValue> results = session.Read(nodesToRead);
            DataValue dv = results[0];
            return (float)dv.Value;
        }

        public float ReadMachineSpeed() {
            ReadValueIdCollection nodesToRead = new ReadValueIdCollection();
            nodesToRead.Add(new ReadValueId() {
                NodeId = new NodeId("::Program:Cube.Status.MachSpeed", 6),
                AttributeId = Attributes.Value
            });

            List<DataValue> results = session.Read(nodesToRead);
            DataValue dv = results[0];
            return (float)dv.Value;
        }

        public float ReadCurrentBatchId() {
            ReadValueIdCollection nodesToRead = new ReadValueIdCollection();
            nodesToRead.Add(new ReadValueId() {
                NodeId = new NodeId("::Program:Cube.Status.Parameter[0].Value", 6),
                AttributeId = Attributes.Value
            });

            List<DataValue> results = session.Read(nodesToRead);
            DataValue dv = results[0];
            return (float)dv.Value;
        }

        public float ReadProductAmountInBatch() {
            ReadValueIdCollection nodesToRead = new ReadValueIdCollection();
            nodesToRead.Add(new ReadValueId() {
                NodeId = new NodeId("::Program:Cube.Status.Parameter[1].Value", 6),
                AttributeId = Attributes.Value
            });

            List<DataValue> results = session.Read(nodesToRead);
            DataValue dv = results[0];
            return (float)dv.Value;
        }

        public float ReadCurrentHumidity() {
            ReadValueIdCollection nodesToRead = new ReadValueIdCollection();
            nodesToRead.Add(new ReadValueId() {
                NodeId = new NodeId("::Program:Cube.Status.Parameter[2].Value", 6),
                AttributeId = Attributes.Value
            });

            List<DataValue> results = session.Read(nodesToRead);
            DataValue dv = results[0];
            return (float)dv.Value;
        }

        public float ReadCurrentTemperature() {
            ReadValueIdCollection nodesToRead = new ReadValueIdCollection();
            nodesToRead.Add(new ReadValueId() {
                NodeId = new NodeId("::Program:Cube.Status.Parameter[3].Value", 6),
                AttributeId = Attributes.Value
            });

            List<DataValue> results = session.Read(nodesToRead);
            DataValue dv = results[0];
            return (float)dv.Value;
        }

        public float ReadCurrentVibration() {
            ReadValueIdCollection nodesToRead = new ReadValueIdCollection();
            nodesToRead.Add(new ReadValueId() {
                NodeId = new NodeId("::Program:Cube.Status.Parameter[4].Value", 6),
                AttributeId = Attributes.Value
            });

            List<DataValue> results = session.Read(nodesToRead);
            DataValue dv = results[0];
            return (float)dv.Value;
        }

        public Int32 ReadCurrentProductsProcessed() {
            ReadValueIdCollection nodesToRead = new ReadValueIdCollection();
            nodesToRead.Add(new ReadValueId() {
                NodeId = new NodeId("::Program:Cube.Admin.ProdProcessedCount", 6),
                AttributeId = Attributes.Value
            });

            List<DataValue> results = session.Read(nodesToRead);
            DataValue dv = results[0];
            return (int)dv.Value;
        }

        public Int32 ReadDefectProducts() {
            ReadValueIdCollection nodesToRead = new ReadValueIdCollection();
            nodesToRead.Add(new ReadValueId() {
                NodeId = new NodeId("::Program:Cube.Admin.ProdDefectiveCount", 6),
                AttributeId = Attributes.Value
            });

            List<DataValue> results = session.Read(nodesToRead);
            DataValue dv = results[0];
            return (int)dv.Value;
        }

        public UInt16 ReadMaintenanceTrigger() {
            ReadValueIdCollection nodesToRead = new ReadValueIdCollection();
            nodesToRead.Add(new ReadValueId() {
                NodeId = new NodeId("::Program:Maintenance.Trigger", 6),
                AttributeId = Attributes.Value
            });

            List<DataValue> results = session.Read(nodesToRead);
            DataValue dv = results[0];
            return (UInt16)dv.Value;
        }


        protected void OnPropertyChanged(string name) {
            PropertyChangedEventHandler handler = PropertyChanged;
            if (handler != null) {
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

        public double ProductsPerMinute {
            get { return productsPerMinute; }

            set {
                productsPerMinute = value;
                OnPropertyChanged("ProductsPerMinute");
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
                if (maintenanceTrigger == 0) {
                    return maintenanceCounter;
                } else {
                    return maintenanceCounter / maintenanceTrigger * 100;
                }
            }
            set {
                maintenanceCounter = value;
                OnPropertyChanged("MaintenanceCounter");
            }
        }
    }
}