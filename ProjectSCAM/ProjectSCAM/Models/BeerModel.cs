using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace ProjectSCAM.Models
{
    public class BeerModel
    {
        public int ProductNumber { get; }
        public bool Acceptable { get; }
        public int BatchId { get; }

        public BeerModel(int productNumber, bool acceptable, int batchId)
        {
            ProductNumber = productNumber;
            Acceptable = acceptable;
            BatchId = batchId;
        }

        public string ProductId()
        {
            return BatchId.ToString() + "-" + ProductNumber.ToString();
        }
    }
}
