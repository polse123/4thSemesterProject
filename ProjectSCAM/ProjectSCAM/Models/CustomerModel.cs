using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Web;

namespace ProjectSCAM.Models
{
    public class CustomerModel
    {
        [Required]
        [DefaultValue(1)]
        public int Id { get; set; }
        [Required]
        [DefaultValue("")]
        public string CustomerName { get; set; }

        public CustomerModel(int customerId, string name)
        {
            Id = customerId;
            CustomerName = name ?? throw new ArgumentNullException(nameof(name));
        }

        public CustomerModel() { }
    }
}
