using System;
using System.Web.Mvc;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using MvcContrib.TestHelper;
using ProjectSCAM.Controllers;
using ProjectSCAM.Models;

namespace ProjectSCAM.Tests.Controllers {
    [TestClass]
    public class TrackingControllerTest {
        [TestMethod]
        public void Index()
        {
            // Arrange
            TestControllerBuilder builder = new TestControllerBuilder();
            TrackingController controller = new TrackingController();
            builder.InitializeController(controller);

            // Act
            ViewResult result = controller.Index() as ViewResult;
            var viewbagData1 = controller.ViewBag.Customers;
            var viewbagData2 = controller.ViewBag.Batches;
            // Assert
            Assert.IsNotNull(result);
            Assert.IsNotNull(viewbagData1);
            Assert.IsNotNull(viewbagData2);
        }
        [TestMethod]
        public void Beers()
        {
            // Arrange
            TestControllerBuilder builder = new TestControllerBuilder();
            TrackingController controller = new TrackingController();
            builder.InitializeController(controller);
            TrackingModel model = new TrackingModel();
            model.BatchId = 1;
            model.CustomerId = 1;
            model.CustomerName = "jesus";
            // Act
            ViewResult result = controller.Beers(model) as ViewResult;
            var viewbagData = controller.ViewBag.BatchId;
            // Assert
            Assert.IsNotNull(result);
            Assert.AreEqual(model.BatchId, (int)viewbagData);
        }
        [TestMethod]
        public void RegisterBeerAsDefect()
        {
            // Arrange
            TestControllerBuilder builder = new TestControllerBuilder();
            TrackingController controller = new TrackingController();
            builder.InitializeController(controller);
            BeerModel model = new BeerModel();
            model.BatchId = 1;
            model.ProductNumber = 1;
            // Act
            RedirectToRouteResult result = controller.RegisterBeerAsDefect(model) as RedirectToRouteResult;
            var tempData = controller.TempData["batchid"];
            // Assert
            Assert.IsTrue(result.RouteValues["action"].Equals("Beers"));
            Assert.AreEqual(model.BatchId, (int)tempData);
        }
    }
}
