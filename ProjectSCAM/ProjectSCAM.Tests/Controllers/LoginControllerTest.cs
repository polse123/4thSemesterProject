using System;
using System.Web;
using System.Web.Mvc;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using MvcContrib.TestHelper;
using ProjectSCAM.Controllers;
using ProjectSCAM.Models;

namespace ProjectSCAM.Tests.Controllers {
    [TestClass]
    public class LoginControllerTest {
        [TestMethod]
        public void LoginInvalidUser()
        {
            //Arrange
            TestControllerBuilder builder = new TestControllerBuilder();
            HttpContext.Current = new HttpContext(new HttpRequest(null, "http://tempuri.org", null), new HttpResponse(null));
            
            LoginController controller = new LoginController();
            builder.InitializeController(controller);
            LoginModel login = new LoginModel();
            login.Username = "fail";
            login.Password = "fail";

            // Act
            RedirectToRouteResult result = controller.Login(login) as RedirectToRouteResult;
            var tempData = controller.TempData["statusMessage"];


            // Assert
            Assert.IsTrue(result.RouteValues["action"].Equals("Index"));
            Assert.AreEqual("Login failed", tempData);
        }
        [TestMethod]
        public void UserType()
        {

        }
    }
}

