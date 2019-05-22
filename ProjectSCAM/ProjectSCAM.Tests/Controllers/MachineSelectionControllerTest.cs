using System;
using System.Collections.Specialized;
using System.Net.Http;
using System.Web;
using System.Web.Mvc;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using Moq;
using MvcContrib.TestHelper;
using ProjectSCAM.Controllers;
using ProjectSCAM.Models;
using ProjectSCAM.Models.Logic;

namespace ProjectSCAM.Tests.Controllers
{
    [TestClass]
    public class MachineSelectionControllerTest
    {
        [TestMethod]
        public void Index()
        {
            // Arrange
            MachineSelectionController controller = new MachineSelectionController();

            // Act
            ViewResult result = controller.Index() as ViewResult;

            // Assert
            Assert.IsNotNull(result);
        }
        [TestMethod]
        public void CreateInvalidMachine()
        {
            // Arrange
            MachineSelectionController controller = new MachineSelectionController();
            MachineModel m = new MachineModel();
            controller.ModelState.AddModelError("Error", "Error");

            // Act

            RedirectToRouteResult result = controller.Create(m) as RedirectToRouteResult;

            // Assert
            Assert.IsTrue(result.RouteValues["action"].Equals("Index"));
            Assert.IsTrue(controller.ViewData.ModelState.Count > 0);
            Assert.IsTrue(controller.TempData["statusMessage"].ToString().Contains("Error"));
        }
        [TestMethod]
        public void CreateValidMachine()
        {
            // Arrange
            MachineSelectionController controller = new MachineSelectionController();
            MachineModel m = new MachineModel(1,"testy","testy",4,"test", "test", "test", "test", "test", "test", "test", "test", "test", "test",
                "test", "test", "test", "test", "test", "test", "test","test");

            // Act

            RedirectToRouteResult result = controller.Create(m) as RedirectToRouteResult;

            // Assert
            Assert.IsTrue(result.RouteValues["action"].Equals("Index"));
            Assert.IsTrue(controller.ViewData.ModelState.Count < 1);
            Assert.AreEqual("Machine registered",controller.TempData["statusMessage"].ToString());
        }

        
        [TestMethod]
        public void SetMachine()
        {
            // Arrange
            TestControllerBuilder builder = new TestControllerBuilder();
            MachineSelectionController controller = new MachineSelectionController();
            builder.InitializeController(controller);
            // Act
            controller.SetMachine("123");

            // Assert
            Assert.IsTrue(ServiceSingleton.Instance.OPCService.OpcConnections.ContainsKey("123"));

        }
    }
}
