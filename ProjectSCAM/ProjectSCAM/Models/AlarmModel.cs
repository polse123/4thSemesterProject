using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace ProjectSCAM.Models
{
    public class AlarmModel
    {
        public int Id { get; set; }
        public string timestamp { get; set; }
        public int StopReasonId { get; set; }
        public int? HandledBy { get; set; }
        public int BatchId { get; set; }
        public int MachineId { get; set; }

        public string StopReason { get; set; }
        public string HandlerName { get; set; }

        /// <summary>
        /// Used for initializing alarms with data from the database.
        /// </summary>
        /// <param name="id"></param>
        /// <param name="timestamp"></param>
        /// <param name="stopReasonId"></param>
        /// <param name="handledBy"></param>
        /// <param name="batchId"></param>
        /// <param name="stopReason"></param>
        /// <param name="handlerName"></param>
        public AlarmModel(int id, string timestamp, int stopReasonId, int? handledBy, int batchId, string stopReason, string handlerName)
        {
            Id = id;
            this.timestamp = timestamp ?? throw new ArgumentNullException(nameof(timestamp));
            StopReasonId = stopReasonId;
            HandledBy = handledBy;
            BatchId = batchId;
            StopReason = stopReason ?? throw new ArgumentNullException(nameof(stopReason));
            HandlerName = handlerName;
        }
        public AlarmModel() {

        }
    }
}
