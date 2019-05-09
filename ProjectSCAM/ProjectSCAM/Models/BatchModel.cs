using ProjectSCAM.Models.Logic;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace ProjectSCAM.Models
{
    public class BatchModel
    {
        public int Id { get; set; }
        public int ProducedProducts { get; set; }
        public int AcceptableProducts { get; set; }
        public int DefectProducts { get; set; }
        public string TimestampStart { get; set; }
        public string TimestampEnd { get; set; }
        public string ExpirationDate { get; set; }
        public bool Succeeded { get; set; }
        public string Performance { get; set; }
        public string Quality { get; set; }
        public string Availability { get; set; }
        public string Oee { get; set;  }
        public int Speed { get; set;  }
        public int BeerId { get; set; }
        public int Machine { get; set; }
        public int? SoldTo { get; set; }
        public bool Recalled { get; set; }

        public string RecipeName { get; set; }
        public string CustomerName { get; set; }

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
            ProducedProducts = AcceptableProducts + DefectProducts; 
            Values = new BatchValueCollection();

        }
        public static BatchModel Read(int id)
        {
            return Singleton.Instance.DBManager.RetrieveBatch(id);
        }

        public void getValues()
        {
            Values = Singleton.Instance.DBManager.RetrieveBatchValues(Id);
        }
    }
}
