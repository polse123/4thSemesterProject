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
            foreach(OpcClient x in Singleton.Instance.opcManager.OpcConnections.Values) {
                x.PropertyChanged += X_PropertyChanged;
            }
        }

        private void X_PropertyChanged(object sender, PropertyChangedEventArgs e) {
            if(e.PropertyName.Equals("StateCurrent")) {
                OpcClient opc = sender as OpcClient;
                if(opc.StateCurrent == 2) { // if machine is stopped, check stop reason
                    switch(opc.StopReasonId) {
                        case 10:
                            break;
                        case 11:
                            break;
                        default:

                            break;
                    }
                }
            }
        }
    }
}