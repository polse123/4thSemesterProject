using ProjectSCAM.Models.Logic;
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
        [Required]
        public int NameSpaceIndex { get; set; }
        [Required]
        public string AmountNode { get; set; }
        [Required]
        public string StateNode { get; set; }
        [Required]
        public string DefectNode { get; set; }
        [Required]
        public string AcceptableNode { get; set; }
        [Required]
        public string AmountToProduceNode { get; set; }
        [Required]
        public string MachSpeedNode { get; set; }
        [Required]
        public string TemperatureNode { get; set; }
        [Required]
        public string HumidityNode { get; set; }
        [Required]
        public string VibrationNode { get; set; }
        [Required]
        public string StopreasonNode { get; set; }
        [Required]
        public string BatchIdNode { get; set; }
        [Required]
        public string BarleyNode { get; set; }
        [Required]
        public string HopsNode { get; set; }
        [Required]
        public string MaltNode { get; set; }
        [Required]
        public string WheatNode { get; set; }
        [Required]
        public string YeastNode { get; set; }
        [Required]
        public string MaintenanceTriggerNode { get; set; }
        [Required]
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
        public static MachineModel GetFromDatabase(string ip)
        {
            return ServiceSingleton.Instance.OPCService.GetMachine(ip);

        }
        public void Update() {
            ServiceSingleton.Instance.DBService.EditMachine((int)Id, Ip, Description,  NameSpaceIndex,
            AmountNode, StateNode, DefectNode, AcceptableNode, AmountToProduceNode, MachSpeedNode,
            TemperatureNode, HumidityNode, VibrationNode, StopreasonNode, BatchIdNode, BarleyNode,
            HopsNode, MaltNode, WheatNode, YeastNode, MaintenanceTriggerNode, MaintenanceCounterNode);
        }
    }
}
