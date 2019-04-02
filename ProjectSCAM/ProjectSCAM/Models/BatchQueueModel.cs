using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace ProjectSCAM.Models {
    public class BatchQueueModel {
        public int Amount { get; set; }
        public int Speed { get; set; }
        public int Type { get; set; }
    }
}