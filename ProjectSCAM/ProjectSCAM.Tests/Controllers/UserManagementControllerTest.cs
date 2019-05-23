using System;
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
            var viewbagData = controller.ViewBag.UserTypes;
            // Assert
            Assert.IsNotNull(result);
            Assert.IsNotNull(viewbagData);
        }
    }
}
