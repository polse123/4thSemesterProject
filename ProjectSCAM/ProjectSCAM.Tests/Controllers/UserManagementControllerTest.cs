using System;
using System.Web.Mvc;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using MvcContrib.TestHelper;
using ProjectSCAM.Controllers;

namespace ProjectSCAM.Tests.Controllers {
    [TestClass]
    public class UserManagementControllerTest {
        [TestMethod]
        public void Index()
        {
            // Arrange
            TestControllerBuilder builder = new TestControllerBuilder();
            UserManagementController controller = new UserManagementController();
            builder.InitializeController(controller);

            // Act
            ViewResult result = controller.Index() as ViewResult;

            // Assert
            Assert.IsNotNull(result);
            Assert.IsNotNull(result.Model);
        }
        [TestMethod]
        public void MakeUserInactive()
        {
            // Arrange
            TestControllerBuilder builder = new TestControllerBuilder();
            builder.HttpContext.Request.RequestType = "POST";
            UserManagementController controller = new UserManagementController();
            builder.InitializeController(controller);
            string id = "3";

            // Act
            RedirectToRouteResult result = controller.MakeUserInactive(id) as RedirectToRouteResult;

            // Assert
            Assert.IsTrue(result.RouteValues["action"].Equals("Index"));
        }
    }
}
