using System;
using System.Collections.Generic;
using System.Web.Mvc;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using MvcContrib.TestHelper;
using ProjectSCAM.Controllers;
using ProjectSCAM.Models;
using ProjectSCAM.Models.Logic;

namespace ProjectSCAM.Tests.Controllers {
    [TestClass]
    public class ProductionControllerTest {
        [TestMethod]
        public void Index()
        {

            // Arrange
            TestControllerBuilder builder = new TestControllerBuilder();
            ProductionController controller = new ProductionController();
            builder.InitializeController(controller);

            // Act
            ViewResult result = controller.Index() as ViewResult;
            var recipeData = (IList<RecipeModel>)controller.ViewBag.recipes;
            var batchqueueData = (IList<BatchQueueModel>)controller.ViewBag.batchqueue;
            // Assert
            Assert.IsNotNull(result);
            Assert.IsTrue(recipeData.Count > 0);
            Assert.IsNotNull(batchqueueData);
        }
        [TestMethod]
        public void CreateInvalid()
        {

            // Arrange
            TestControllerBuilder builder = new TestControllerBuilder();
            ProductionController controller = new ProductionController();
            builder.InitializeController(controller);
            controller.ModelState.AddModelError("Error", "Error");
            BatchQueueModel bqm = new BatchQueueModel();
            // Act
            RedirectToRouteResult result = controller.Create(bqm) as RedirectToRouteResult;
            var tempData = controller.TempData["statusMessage"].ToString();
            // Assert
            Assert.IsNotNull(result.RouteValues["action"].Equals("Index"));
            Assert.IsTrue(tempData.Contains("Error"));
        }
        [TestMethod]
        public void Create()
        {
            // Arrange
            TestControllerBuilder builder = new TestControllerBuilder();
            ProductionController controller = new ProductionController();
            builder.InitializeController(controller);
            BatchQueueModel bqm = new BatchQueueModel(999,1,1,1,3,"Stout");
            // Act
            RedirectToRouteResult result = controller.Create(bqm) as RedirectToRouteResult;
            ServiceSingleton.Instance.DBService.RemoveFromBatchQueue(999);
            var tempData = controller.TempData["statusMessage"].ToString();
            // Assert
            Assert.IsNotNull(result.RouteValues["action"].Equals("Index"));
            Assert.AreEqual("Batch inserted",tempData);
        }
    }
}
