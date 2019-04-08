using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace ProjectSCAM.Models
{
    public class BatchModel
    {
        public int Id { get; set; }
        public int AcceptableProducts { get; set; }
        public int DefectProducts { get; set; }
        public string TimestampStart { get; set; }
        public string TimestampEnd { get; set; }
        public string ExpirationDate { get; set; }
        public double Performance { get; set; }
        public double Quality { get; set; }
        public double Availability { get; set; }
        public int Speed { get; set; }
        public int BeerId { get; set; }
        public int Machine { get; set; }

        public string RecipeName { get; set; }

        public BatchModel(int id, int acceptableProducts, int defectProducts,
            string timestampStart, string timestampEnd, string expirationDate,
            double performance, double quality, double availability,
            int speed, int beerId, int machine, string recipeName)
        {
            Id = id;
            AcceptableProducts = acceptableProducts;
            DefectProducts = defectProducts;
            TimestampStart = timestampStart ?? throw new ArgumentNullException(nameof(timestampStart));
            TimestampEnd = timestampEnd ?? throw new ArgumentNullException(nameof(timestampEnd));
            ExpirationDate = expirationDate ?? throw new ArgumentNullException(nameof(expirationDate));
            Performance = performance;
            Quality = quality;
            Availability = availability;
            Speed = speed;
            BeerId = beerId;
            Machine = machine;
            RecipeName = recipeName ?? throw new ArgumentNullException(nameof(recipeName));
        }
    }
}
