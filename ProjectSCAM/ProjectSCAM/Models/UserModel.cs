using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace ProjectSCAM.Models
{
    public class UserModel
    {
        public int Id { get; }
        public string Username { get; }
        public string Password { get; }
        public string FirstName { get; }
        public string LastName { get; }
        public string Email { get; }
        public string PhoneNumber { get; }
        public bool IsActive { get; set; }
        public int UserType { get; }

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
