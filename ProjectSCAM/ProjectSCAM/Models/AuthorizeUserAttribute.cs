using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using System.Web.Routing;

namespace ProjectSCAM.Models
{
    public class AuthorizeUserAttribute : AuthorizeAttribute
    {

        public string Type { get; set; }
        //public string Type = "1";
        
        //public string[] Type = new string[2] {"0", "1"};
        //[AuthorizeUser(Type ="1")]
        protected override bool AuthorizeCore(HttpContextBase httpContext)
        {
            //var isAuthorized = base.AuthorizeCore(httpContext);
            //if (!isAuthorized)
            //{
            //    return false;
            //}
            if (httpContext.Session["UserType"] != null) {
                if (httpContext.Session["UserType"].ToString() == this.Type)
                {
                    return true;
                }
                else
                {
                    return false;
                }
            }
            else
            {
                return false;
            }
            //string userType = httpContext.session["UserType"].ToString();
            //Logic here
            //Note: Make a split on MultipleRoles, by ','
            //User is in both roles => return true, else return false
            //return userType.Contains(this.Type);
        }

        protected override void HandleUnauthorizedRequest(AuthorizationContext filterContext)
        {
            filterContext.Result = new RedirectToRouteResult(
                        new RouteValueDictionary(
                            new
                            {
                                controller = "Login",
                                action = "Index"
                            })
                        );
        }
    }
}