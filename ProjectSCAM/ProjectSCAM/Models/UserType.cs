using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace ProjectSCAM.Models
{
    public class UserType
    {
        public int Id { get; }
        public string Role { get; }

        public UserType(int id, string role)
        {
            Id = id;
            Role = role ?? throw new ArgumentNullException(nameof(role));
        }
    }
}
