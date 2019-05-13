using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace ProjectSCAM.Models
{
    public class BeerModel
    {
        public int ProductNumber { get; set; }
        public bool Acceptable { get; set; }
        public int BatchId { get; set; }

        public string ProductId
        {
            get
            {
                return BatchId.ToString() + "-" + ProductNumber.ToString();
            }
        }

        public BeerModel(int productNumber, bool acceptable, int batchId)
        {
            ProductNumber = productNumber;
            Acceptable = acceptable;
            BatchId = batchId;
        }

        public BeerModel() { }
    }
}
