using System;
using System.Web.Mvc;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using MvcContrib.TestHelper;
using ProjectSCAM.Controllers;
using ProjectSCAM.Models;

namespace ProjectSCAM.Tests.Controllers {
    [TestClass]
    public class UserCreationControllerTest {
        [TestMethod]
        public void Index()
        {
            // Arrange
            TestControllerBuilder builder = new TestControllerBuilder();
            UserCreationController controller = new UserCreationController();
            builder.InitializeController(controller);

            // Act
            ViewResult result = controller.Index() as ViewResult;
            var viewbagData = controller.ViewBag.UserTypes;
            // Assert
            Assert.IsNotNull(result);
            Assert.IsNotNull(viewbagData);
        }
        [TestMethod]
        public void RegisterUserInvalid()
        {
            // Arrange
            TestControllerBuilder builder = new TestControllerBuilder();
            UserCreationController controller = new UserCreationController();
            builder.InitializeController(controller);
            controller.ModelState.AddModelError("Error", "Error");
;            UserModel model = new UserModel();
            // Act
            RedirectToRouteResult result = controller.RegisterUser(model) as RedirectToRouteResult;
            var tempData = controller.TempData["statusMessage"].ToString();
            // Assert
            Assert.IsTrue(result.RouteValues["action"].Equals("Index"));
            Assert.IsTrue(tempData.Contains("User wasn't registered "));
        }
        [TestMethod]
        public void RegisterUserValid()
        {
            // Arrange
            TestControllerBuilder builder = new TestControllerBuilder();
            UserCreationController controller = new UserCreationController();
            builder.InitializeController(controller);
            UserModel model = new UserModel(50,"unitTest","firstName","lastName","email@email.com","12121212",0,"Admin");
            model.Password = "Aa123456";
            // Act
            RedirectToRouteResult result = controller.RegisterUser(model) as RedirectToRouteResult;
            var tempData = controller.TempData["statusMessage"].ToString();
            // Assert
            Assert.IsTrue(result.RouteValues["action"].Equals("Index"));
        }
    }
}
