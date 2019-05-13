using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Web;

namespace ProjectSCAM.Models
{
    public class MachineModel
    {
        public int? Id { get; set; }
        [DisplayName("Enter IP address")]
        [Required]
        [StringLength(40, ErrorMessage = "IP length can't be more than 40.")]
        public string Ip { get; set; }
        [DisplayName("Enter a short description")]
        [Required]
        public string Description { get; set; }

        public KeyValuePair<string, int> AmountNode { get; set; }

        public KeyValuePair<string, int> StateNode { get; set; }

        public KeyValuePair<string, int> DefectNode { get; set; }

        public KeyValuePair<string, int> AcceptableNode { get; set; }

        public KeyValuePair<string, int> AmountToProduceNode { get; set; }

        public KeyValuePair<string, int> MachSpeedNode { get; set; }

        public KeyValuePair<string, int> TemperatureNode { get; set; }

        public KeyValuePair<string, int> HumidityNode { get; set; }

        public KeyValuePair<string, int> VibrationNode { get; set; }

        public KeyValuePair<string, int> StopreasonNode { get; set; }

        public KeyValuePair<string, int> BatchIdNode { get; set; }

        public KeyValuePair<string, int> BarleyNode { get; set; }

        public KeyValuePair<string, int> HopsNode { get; set; }

        public KeyValuePair<string, int> MaltNode { get; set; }

        public KeyValuePair<string, int> WheatNode { get; set; }

        public KeyValuePair<string, int> YeastNode { get; set; }

        public KeyValuePair<string, int> MaintenanceTriggerNode { get; set; }

        public KeyValuePair<string, int> MaintenanceCounterNode { get; set; }

        public MachineModel(int id, string ip, string description,
            KeyValuePair<string, int> amountNode, KeyValuePair<string, int> stateNode, KeyValuePair<string, int> defectNode,
            KeyValuePair<string, int> acceptableNode, KeyValuePair<string, int> amountToProduceNode, KeyValuePair<string, int> machSpeedNode,
            KeyValuePair<string, int> temperatureNode, KeyValuePair<string, int> humidityNode, KeyValuePair<string, int> vibrationNode,
            KeyValuePair<string, int> stopreasonNode, KeyValuePair<string, int> batchIdNode, KeyValuePair<string, int> barleyNode,
            KeyValuePair<string, int> hopsNode, KeyValuePair<string, int> maltNode, KeyValuePair<string, int> wheatNode,
            KeyValuePair<string, int> yeastNode, KeyValuePair<string, int> maintenanceTriggerNode, KeyValuePair<string, int> maintenanceCounterNode)
        {
            Id = id;
            Ip = ip ?? throw new ArgumentNullException(nameof(ip));
            Description = description;
            AmountNode = amountNode;
            StateNode = stateNode;
            DefectNode = defectNode;
            AcceptableNode = acceptableNode;
            AmountToProduceNode = amountToProduceNode;
            MachSpeedNode = machSpeedNode;
            TemperatureNode = temperatureNode;
            HumidityNode = humidityNode;
            VibrationNode = vibrationNode;
            StopreasonNode = stopreasonNode;
            BatchIdNode = batchIdNode;
            BarleyNode = barleyNode;
            HopsNode = hopsNode;
            MaltNode = maltNode;
            WheatNode = wheatNode;
            YeastNode = yeastNode;
            MaintenanceTriggerNode = maintenanceTriggerNode;
            MaintenanceCounterNode = maintenanceCounterNode;
        }

        public MachineModel() { }
    }
}
