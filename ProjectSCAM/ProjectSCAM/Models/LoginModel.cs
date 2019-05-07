using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Web;

namespace ProjectSCAM.Models
{
    public class LoginModel
    {

        [Required]
        public string Username { get; set; }
        [Required]
        [PasswordPropertyText]
        public string Password { get; set; }
           
          
            

            public LoginModel(string username,string password)
            {
               
                Username = username ?? throw new ArgumentNullException(nameof(username));
                Password = null;
               
            }
          public LoginModel()
        {

        }
        }
    }


