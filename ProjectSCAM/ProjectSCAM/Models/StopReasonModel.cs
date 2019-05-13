using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace ProjectSCAM.Models
{
    public class StopReasonModel
    {
        public int StopId { get; }

        public bool ActionRequired { get; }

        public string Description { get; }

        public StopReasonModel(int stopId, bool actionRequired, string description)
        {
            StopId = stopId;
            ActionRequired = actionRequired;
            Description = description ?? throw new ArgumentNullException(nameof(description));
        }
    }
}
