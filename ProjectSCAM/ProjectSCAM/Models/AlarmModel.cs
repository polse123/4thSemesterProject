using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace ProjectSCAM.Models
{
    public class AlarmModel
    {
        public int Id { get; }
        public string Timestamp { get; }
        public int StopReasonId { get; }
        public int? HandledBy { get; set; }
        public int BatchId { get; }

        public bool ActionRequired { get; }
        public string StopReason { get; }
        public string HandlerName { get; set; }

        public AlarmModel(int id, string timestamp, int stopReasonId, int? handledBy, int batchId, bool actionRequired, string stopReason, string handlerName)
        {
            Id = id;
            Timestamp = timestamp ?? throw new ArgumentNullException(nameof(timestamp));
            StopReasonId = stopReasonId;
            HandledBy = handledBy;
            BatchId = batchId;
            ActionRequired = actionRequired;
            StopReason = stopReason ?? throw new ArgumentNullException(nameof(stopReason));
            HandlerName = handlerName;
        }
    }
}
