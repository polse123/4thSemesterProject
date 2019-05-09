using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Web;

namespace ProjectSCAM.Models
{
    public class TrackingModel
    {
        [Required]
        [DefaultValue(1)]
        public int BatchId { get; set; }
        [Required]
        [DefaultValue(1)]
        public int CustomerId { get; set; }
        [Required]
        [DefaultValue("")]
        public string CustomerName { get; set; }

        public TrackingModel() { }
    }
}
