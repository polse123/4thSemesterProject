using System;
using System.Collections;
using System.Collections.Generic;
using System.ComponentModel;
using System.Linq;
using System.Web;

namespace ProjectSCAM.Models.Logic {
    public class AlarmManager {
        public IList<AlarmModel> ActiveAlarms { get; set; }
        public AlarmManager() {
            ActiveAlarms = new List<AlarmModel>();
        }
    }
}