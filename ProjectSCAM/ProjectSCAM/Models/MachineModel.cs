using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace ProjectSCAM.Models
{
    public class MachineModel
    {
        public int Id { get; }
        public string Ip { get; }
        public string Description { get; }

        public MachineModel(int id, string ip, string description)
        {
            Id = id;
            Ip = ip ?? throw new ArgumentNullException(nameof(ip));
            Description = description;
        }
    }
}
