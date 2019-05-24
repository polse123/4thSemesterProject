using System;
using System.Web.Mvc;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using MvcContrib.TestHelper;
using ProjectSCAM.Controllers;
using ProjectSCAM.Models;

namespace ProjectSCAM.Tests.Controllers {
    [TestClass]
    public class HistoryControllerTest {
        [TestMethod]
        public void IndexIdNull()
        {
            // Arrange
            TestControllerBuilder builder = new TestControllerBuilder();
            HistoryController controller = new HistoryController();
            builder.InitializeController(controller);

            // Act
            ViewResult result = controller.Index() as ViewResult;
            var tempData = controller.ViewBag.DataPoints;
            // Assert
            Assert.IsNotNull(result);
            Assert.IsNotNull(tempData);

        }
        [TestMethod]
        public void Index()
        {
            // Arrange
            TestControllerBuilder builder = new TestControllerBuilder();
            HistoryController controller = new HistoryController();
            builder.InitializeController(controller);
            controller.TempData["id"] = 2;

            // Act
            ViewResult result = controller.Index() as ViewResult;
            var tempData = controller.ViewBag.DataPoints;
            // Assert
            Assert.IsNotNull(result);
            Assert.IsNotNull(tempData);

        }
        [TestMethod]
        public void GetBatchesById()
        {
            // Arrange
            TestControllerBuilder builder = new TestControllerBuilder();
            HistoryController controller = new HistoryController();
            builder.InitializeController(controller);
            string id = "31";

            // Act
            RedirectToRouteResult result = controller.GetBatchesById(id) as RedirectToRouteResult;
            var tempData = (BatchModel)controller.TempData["batch"];
            // Assert
            Assert.IsTrue(result.RouteValues["action"].Equals("Index"));
            Assert.AreEqual(id, tempData.Id.ToString());

        }
    }
}
