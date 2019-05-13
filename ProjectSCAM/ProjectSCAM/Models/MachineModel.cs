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

        public int NameSpaceIndex { get; set; }

        public string AmountNode { get; set; }

        public string StateNode { get; set; }

        public string DefectNode { get; set; }

        public string AcceptableNode { get; set; }

        public string AmountToProduceNode { get; set; }

        public string MachSpeedNode { get; set; }

        public string TemperatureNode { get; set; }

        public string HumidityNode { get; set; }

        public string VibrationNode { get; set; }

        public string StopreasonNode { get; set; }

        public string BatchIdNode { get; set; }

        public string BarleyNode { get; set; }

        public string HopsNode { get; set; }

        public string MaltNode { get; set; }

        public string WheatNode { get; set; }

        public string YeastNode { get; set; }

        public string MaintenanceTriggerNode { get; set; }

        public string MaintenanceCounterNode { get; set; }

        public MachineModel(int? id, string ip, string description, int nameSpaceIndex,
            string amountNode, string stateNode, string defectNode, string acceptableNode, string amountToProduceNode, string machSpeedNode,
            string temperatureNode, string humidityNode, string vibrationNode, string stopreasonNode, string batchIdNode, string barleyNode,
            string hopsNode, string maltNode, string wheatNode, string yeastNode, string maintenanceTriggerNode, string maintenanceCounterNode)
        {
            Id = id ?? throw new ArgumentNullException(nameof(id));
            Ip = ip ?? throw new ArgumentNullException(nameof(ip));
            Description = description ?? throw new ArgumentNullException(nameof(description));
            NameSpaceIndex = nameSpaceIndex;
            AmountNode = amountNode ?? throw new ArgumentNullException(nameof(amountNode));
            StateNode = stateNode ?? throw new ArgumentNullException(nameof(stateNode));
            DefectNode = defectNode ?? throw new ArgumentNullException(nameof(defectNode));
            AcceptableNode = acceptableNode ?? throw new ArgumentNullException(nameof(acceptableNode));
            AmountToProduceNode = amountToProduceNode ?? throw new ArgumentNullException(nameof(amountToProduceNode));
            MachSpeedNode = machSpeedNode ?? throw new ArgumentNullException(nameof(machSpeedNode));
            TemperatureNode = temperatureNode ?? throw new ArgumentNullException(nameof(temperatureNode));
            HumidityNode = humidityNode ?? throw new ArgumentNullException(nameof(humidityNode));
            VibrationNode = vibrationNode ?? throw new ArgumentNullException(nameof(vibrationNode));
            StopreasonNode = stopreasonNode ?? throw new ArgumentNullException(nameof(stopreasonNode));
            BatchIdNode = batchIdNode ?? throw new ArgumentNullException(nameof(batchIdNode));
            BarleyNode = barleyNode ?? throw new ArgumentNullException(nameof(barleyNode));
            HopsNode = hopsNode ?? throw new ArgumentNullException(nameof(hopsNode));
            MaltNode = maltNode ?? throw new ArgumentNullException(nameof(maltNode));
            WheatNode = wheatNode ?? throw new ArgumentNullException(nameof(wheatNode));
            YeastNode = yeastNode ?? throw new ArgumentNullException(nameof(yeastNode));
            MaintenanceTriggerNode = maintenanceTriggerNode ?? throw new ArgumentNullException(nameof(maintenanceTriggerNode));
            MaintenanceCounterNode = maintenanceCounterNode ?? throw new ArgumentNullException(nameof(maintenanceCounterNode));
        }

        public MachineModel() { }
    }
}
