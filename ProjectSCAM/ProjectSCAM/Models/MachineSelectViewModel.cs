using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace ProjectSCAM.Models {
    public class MachineSelectViewModel {
        public IList<MachineModel> Machines { get; set; }
        public MachineModel Machine { get; set; }
    }
}