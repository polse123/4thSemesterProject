using ProjectSCAM.Models.Logic;
using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Web;

namespace ProjectSCAM.Models
{
    public class BatchModel
    {
        [Required]
        [DefaultValue(1)]
        public int Id { get; set; }
        [Required]
        [DefaultValue(1)]
        public int AcceptableProducts { get; set; }
        [Required]
        [DefaultValue(1)]
        public int DefectProducts { get; set; }
        [Required]
        [DefaultValue("")]
        public string TimestampStart { get; set; }
        [Required]
        [DefaultValue("")]
        public string TimestampEnd { get; set; }
        [Required]
        [DefaultValue("")]
        public string ExpirationDate { get; set; }
        [Required]
        [DefaultValue(true)]
        public bool Succeeded { get; set; }
        [Required]
        [DefaultValue("1")]
        public string Performance { get; set; }
        [Required]
        [DefaultValue("1")]
        public string Quality { get; set; }
        [Required]
        [DefaultValue("1")]
        public string Availability { get; set; }
        [Required]
        [DefaultValue("1")]
        public string Oee { get; set; }
        [Required]
        [DefaultValue(100)]
        public int Speed { get; set; }
        [Required]
        [DefaultValue(0)]
        public int BeerId { get; set; }
        [Required]
        [DefaultValue(1)]
        public int Machine { get; set; }
        [Required]
        public int? SoldTo { get; set; }
        [Required]
        [DefaultValue(false)]
        public bool Recalled { get; set; }

        [Required]
        [DefaultValue("")]
        public string RecipeName { get; set; }
        [Required]
        [DefaultValue("")]
        public string CustomerName { get; set; }

        public BatchValueCollection Values { get; set; }

        public int ProducedProducts { get { return AcceptableProducts + DefectProducts; } }

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
        public static BatchModel Read(int id)
        {
            return Singleton.Instance.DBManager.RetrieveBatch(id);
        }

        public void getValues()
        {
            Values = Singleton.Instance.DBManager.RetrieveBatchValues(Id);
        }

        public BatchModel()
        {
            Values = new BatchValueCollection();
        }
    }
}
