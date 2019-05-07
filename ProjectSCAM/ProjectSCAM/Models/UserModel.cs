using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Web;

namespace ProjectSCAM.Models
{
    public class UserModel
    {
        public int? Id { get; set; }
        [Required]
        public string Username { get; set; }
        [Required]
        [PasswordPropertyText]
        public string Password { get; set; }
        [Required]
        [Compare(nameof(Password), ErrorMessage = "Passwords don't match.")]
        [PasswordPropertyText]
        [DisplayName("Confirm Password")]
        public string RepeatPassword { get; set; }
        [Required]
        [DisplayName("First Name")]
        public string FirstName { get; set; }
        [Required]
        [DisplayName("Last Name")]
        public string LastName { get; set; }
        [Required]
        [EmailAddress]
        public string Email { get; set; }
        [DisplayName("Phone Number")]
        [Phone]
        public string PhoneNumber { get; set; }
        [Required]
        [DisplayName("Is Active")]
        public bool IsActive { get; set; }
        [Required]
        [DisplayName("User Type")]
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

        public UserModel()
        {

        }
    }
}
