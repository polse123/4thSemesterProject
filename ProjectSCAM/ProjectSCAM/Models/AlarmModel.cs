using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace ProjectSCAM.Models
{
    public class AlarmModel
    {
        public int Id { get; }
        public string timestamp { get; }
        public int StopReasonId { get; }
        public int? HandledBy { get; set; }
        public int BatchId { get; }

        public string StopReason { get; }
        public string HandlerName { get; set; }

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
    }
}
