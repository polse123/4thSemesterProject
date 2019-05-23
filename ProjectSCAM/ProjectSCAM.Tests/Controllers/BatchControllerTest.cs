using System;
using System.IO;
using System.Web.Mvc;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using MvcContrib.TestHelper;
using ProjectSCAM.Controllers;

namespace ProjectSCAM.Tests.Controllers {
    [TestClass]
    public class BatchControllerTest {
        [TestMethod]
        public void Index()
        {
            // Arrange
            TestControllerBuilder builder = new TestControllerBuilder();
            BatchController controller = new BatchController();
            builder.InitializeController(controller);

            // Act
            ViewResult result = controller.Index() as ViewResult;

            // Assert
            Assert.IsNotNull(result);
            Assert.IsNotNull(result.Model);
        }
        [TestMethod]
        public void GetBatchesById()
        {
            // Arrange
            TestControllerBuilder builder = new TestControllerBuilder();
            builder.HttpContext.Request.RequestType = "GET";        
            BatchController controller = new BatchController();
            builder.InitializeController(controller);
            string id = "1";

            // Act
            RedirectToRouteResult result = controller.GetBatchesById(id) as RedirectToRouteResult;
            var tempData = controller.TempData["batches"].ToString();
            

            // Assert
            Assert.IsTrue(result.RouteValues["action"].Equals("Index"));
            Assert.IsNotNull(tempData);
        }
        [TestMethod]
        public void GetBatchesByLatest()
        {
            // Arrange
            TestControllerBuilder builder = new TestControllerBuilder();
            builder.HttpContext.Request.RequestType = "GET";
            BatchController controller = new BatchController();
            builder.InitializeController(controller);
            string latest = "10";

            // Act
            RedirectToRouteResult result = controller.GetBatchesByLatest(latest) as RedirectToRouteResult;
            var tempData = controller.TempData["batches"].ToString();


            // Assert
            Assert.IsTrue(result.RouteValues["action"].Equals("Index"));
            Assert.IsNotNull(tempData);
        }
        [TestMethod]
        public void GetBatchesByDate()
        {
            // Arrange
            TestControllerBuilder builder = new TestControllerBuilder();
            builder.HttpContext.Request.RequestType = "GET";
            BatchController controller = new BatchController();
            builder.InitializeController(controller);
            string date = "05/2019";

            // Act
            RedirectToRouteResult result = controller.GetBatchesByDate(date) as RedirectToRouteResult;
            var tempData = controller.TempData["batches"].ToString();


            // Assert
            Assert.IsTrue(result.RouteValues["action"].Equals("Index"));
            Assert.IsNotNull(tempData);
        }
        [TestMethod]
        public void GetBatchesByMachine()
        {
            // Arrange
            TestControllerBuilder builder = new TestControllerBuilder();
            builder.HttpContext.Request.RequestType = "GET";
            BatchController controller = new BatchController();
            builder.InitializeController(controller);
            string id = "1";

            // Act
            RedirectToRouteResult result = controller.GetBatchesByMachine(id) as RedirectToRouteResult;
            var tempData = controller.TempData["batches"].ToString();


            // Assert
            Assert.IsTrue(result.RouteValues["action"].Equals("Index"));
            Assert.IsNotNull(tempData);
        }
        [TestMethod]
        public void GetBatchesByRecipe()
        {
            // Arrange
            TestControllerBuilder builder = new TestControllerBuilder();
            builder.HttpContext.Request.RequestType = "GET";
            BatchController controller = new BatchController();
            builder.InitializeController(controller);
            string id = "1";

            
            // Act
            RedirectToRouteResult result = controller.GetBatchesByRecipe(id) as RedirectToRouteResult;
            var tempData = controller.TempData["batches"].ToString();


            // Assert
            Assert.IsTrue(result.RouteValues["action"].Equals("Index"));
            Assert.IsNotNull(tempData);
        }
        [TestMethod]
        public void HistoryButton()
        {
            // Arrange
            TestControllerBuilder builder = new TestControllerBuilder();
            builder.HttpContext.Request.RequestType = "GET";
            BatchController controller = new BatchController();
            builder.InitializeController(controller);
            string id = "1";

            // Act
            RedirectToRouteResult result = controller.GetBatchesByRecipe(id) as RedirectToRouteResult;
            var tempData = controller.TempData["batches"].ToString();


            // Assert
            Assert.IsTrue(result.RouteValues["action"].Equals("Index"));
            Assert.IsNotNull(tempData);
        }
    }
}
