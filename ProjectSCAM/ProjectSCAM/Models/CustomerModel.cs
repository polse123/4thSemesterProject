using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace ProjectSCAM.Models
{
    public class CustomerModel
    {
        public int Id { get; }

        public string CustomerName { get; }

        public CustomerModel(int customerId, string id)
        {
            Id = customerId;
            CustomerName = id ?? throw new ArgumentNullException(nameof(id));
        }
    }
}
