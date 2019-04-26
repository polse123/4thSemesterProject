using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace ProjectSCAM.Models
{
    public class UserModel
    {
        public int Id { get; set; }
        public string Username { get; set; }
        public string Password { get; set; }
        public string RepeatPassword { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string Email { get; set; }
        public string PhoneNumber { get; set; }
        public bool IsActive { get; set; }
        public int UserType { get; set; }

        public string Role { get; }

        public UserModel(int id, string username, string firstName, string lastName, string email, string phoneNumber, int userType, string role)
        {
            Id = id;
            Username = username ?? throw new ArgumentNullException(nameof(username));
            Password = null;
            FirstName = firstName ?? throw new ArgumentNullException(nameof(firstName));
            LastName = lastName ?? throw new ArgumentNullException(nameof(lastName));
            Email = email ?? throw new ArgumentNullException(nameof(email));
            PhoneNumber = phoneNumber;
            IsActive = true;
            UserType = userType;
            Role = role ?? throw new ArgumentNullException(nameof(role));
        }
    }
}
