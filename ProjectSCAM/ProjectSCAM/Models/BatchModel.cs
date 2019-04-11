using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace ProjectSCAM.Models
{
    public class BatchModel
    {
        public int Id { get; }
        public int AcceptableProducts { get; }
        public int DefectProducts { get; }
        public string TimestampStart { get; }
        public string TimestampEnd { get; }
        public string ExpirationDate { get; }
        public bool Succeeded { get; }
        public double Performance { get; }
        public double Quality { get; }
        public double Availability { get; }
        public int Speed { get; }
        public int BeerId { get; }
        public int Machine { get; }
        public int SoldTo { get; }

        public BatchValueCollection Values { get; set; }

        public string RecipeName { get; }
        public string CustomerName { get; }

        public BatchModel(int id, int acceptableProducts, int defectProducts,
            string timestampStart, string timestampEnd, string expirationDate, bool succeeded,
            double performance, double quality, double availability,
            int speed, int beerId, int machine, int soldTo, string recipeName, string customerName)
        {
            Id = id;
            AcceptableProducts = acceptableProducts;
            DefectProducts = defectProducts;
            TimestampStart = timestampStart ?? throw new ArgumentNullException(nameof(timestampStart));
            TimestampEnd = timestampEnd ?? throw new ArgumentNullException(nameof(timestampEnd));
            ExpirationDate = expirationDate ?? throw new ArgumentNullException(nameof(expirationDate));
            Succeeded = succeeded;
            Performance = performance;
            Quality = quality;
            Availability = availability;
            Speed = speed;
            BeerId = beerId;
            Machine = machine;
            SoldTo = soldTo;
            Values = new BatchValueCollection();
            RecipeName = recipeName ?? throw new ArgumentNullException(nameof(recipeName));
            CustomerName = customerName;
        }
    }
}
