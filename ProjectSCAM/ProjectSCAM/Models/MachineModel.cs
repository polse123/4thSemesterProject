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

        public int Id { get; set; }
        [DisplayName("Enter IP address")]
        [Required]
        public string Ip { get; set; }
        [DisplayName("Enter a short description")]
        [EmailAddress]
        
        public string Description { get; set; }

        public MachineModel(int id, string ip, string description)
        {
            Id = id;
            Ip = ip ?? throw new ArgumentNullException(nameof(ip));
            Description = description;
        }
        public MachineModel() {

        }
    }
}
