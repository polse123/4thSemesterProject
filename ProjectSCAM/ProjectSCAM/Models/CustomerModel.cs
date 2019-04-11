using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace ProjectSCAM.Models
{
    public class CustomerModel
    {
        public int CustomerId { get; }

        public string CustomerName { get; }

        public CustomerModel(int customerId, string customerName)
        {
            CustomerId = customerId;
            CustomerName = customerName ?? throw new ArgumentNullException(nameof(customerName));
        }
    }
}
