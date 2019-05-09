﻿using System;
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
        public string Performance { get; }
        public string Quality { get; }
        public string Availability { get; }
        public string Oee { get; }
        public int Speed { get; }
        public int BeerId { get; }
        public int Machine { get; }
        public int? SoldTo { get; }
        public bool Recalled { get; }

        public string RecipeName { get; }
        public string CustomerName { get; }

        public BatchValueCollection Values { get; set; }

        public BatchModel(int id, int acceptableProducts, int defectProducts,
            string timestampStart, string timestampEnd, string expirationDate, bool succeeded,
            string performance, string quality, string availability, string oee,
            int speed, int beerId, int machine, int? soldTo, bool recalled, string recipeName, string customerName)
        {
            Id = id;
            AcceptableProducts = acceptableProducts;
            DefectProducts = defectProducts;
            TimestampStart = timestampStart ?? throw new ArgumentNullException(nameof(timestampStart));
            TimestampEnd = timestampEnd ?? throw new ArgumentNullException(nameof(timestampEnd));
            ExpirationDate = expirationDate ?? throw new ArgumentNullException(nameof(expirationDate));
            Succeeded = succeeded;
            Performance = performance ?? throw new ArgumentNullException(nameof(performance));
            Quality = quality ?? throw new ArgumentNullException(nameof(quality));
            Availability = availability ?? throw new ArgumentNullException(nameof(availability));
            Oee = oee ?? throw new ArgumentNullException(nameof(oee));
            Speed = speed;
            BeerId = beerId;
            Machine = machine;
            SoldTo = soldTo;
            Recalled = recalled;
            RecipeName = recipeName ?? throw new ArgumentNullException(nameof(recipeName));
            CustomerName = customerName;
            Values = new BatchValueCollection();
        }
    }
}
