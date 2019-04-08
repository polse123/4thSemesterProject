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
        public int HandledBy { get; set; }
        public int BatchId { get; set; }

        public string StopReason { get; set; }
        public string HandlerName { get; set; }

        public AlarmModel(int id, string timestamp, int stopReasonId, int handledBy, int batchId, string stopReason, string handlerName)
        {
            Id = id;
            this.timestamp = timestamp ?? throw new ArgumentNullException(nameof(timestamp));
            StopReasonId = stopReasonId;
            HandledBy = handledBy;
            BatchId = batchId;
            StopReason = stopReason ?? throw new ArgumentNullException(nameof(stopReason));
            HandlerName = handlerName;
        }
    }
}
