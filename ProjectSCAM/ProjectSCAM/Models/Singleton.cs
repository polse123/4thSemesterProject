using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace ProjectSCAM.Models {
    public sealed class Singleton {
        // should contain opc & db modules
        // e.g OPCManager & DBManager
        // all logic & persistence belongs to the model layer
        private static readonly Singleton instance = new Singleton();

        // Explicit static constructor to tell C# compiler
        // not to mark type as beforefieldinit
        static Singleton() {
        }

        private Singleton() {
        }

        public static Singleton Instance {
            get {
                return instance;
            }
        }
    }
}