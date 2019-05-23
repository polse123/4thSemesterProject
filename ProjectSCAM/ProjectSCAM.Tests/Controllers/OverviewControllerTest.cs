using System;
using System.Web.Mvc;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using MvcContrib.TestHelper;
using ProjectSCAM.Controllers;
using ProjectSCAM.Models.Logic;

namespace ProjectSCAM.Tests.Controllers {
    [TestClass]
    public class OverviewControllerTest {
        [TestMethod]
        public void Index()
        {
            // Arrange
            TestControllerBuilder builder = new TestControllerBuilder();
            OverviewController controller = new OverviewController();
            builder.InitializeController(controller);
            // Act
            ViewResult result =  controller.Index() as ViewResult;

            // Assert
            Assert.IsNotNull(result);
            Assert.IsNotNull(controller.ViewBag.BatchQueue);
        }
        [TestMethod]
        public void MachineControlNull()
        {
            // Arrange
            TestControllerBuilder builder = new TestControllerBuilder();
            OverviewController controller = new OverviewController();
            builder.InitializeController(controller);
            // Act
            string result = controller.MachineControl(null);

            // Assert
            Assert.AreEqual("Select a machine", result);
        }
        [TestMethod]
        public void MachineControlInvalid()
        {
            // Arrange
            TestControllerBuilder builder = new TestControllerBuilder();
            builder.Session["SelectedMachine"] = 1;
            OverviewController controller = new OverviewController();
            MachineSelectionController controllerMachine = new MachineSelectionController();
            builder.InitializeController(controllerMachine);
            builder.InitializeController(controller);
            // Act
            controllerMachine.SetMachine("123");
            string result = controller.MachineControl("nothing personnel, kid");

            // Assert
            Assert.AreEqual("Invalid command", result);
        }
        [TestMethod]
        public void MachineControlValid()
        {
            // Arrange
            TestControllerBuilder builder = new TestControllerBuilder();
            builder.Session["SelectedMachine"] = 1;
            OverviewController controller = new OverviewController();
            MachineSelectionController controllerMachine = new MachineSelectionController();
            builder.InitializeController(controller);
            ServiceSingleton.Instance.OPCService.InitConnection("123");
            // Act

            string result = controller.MachineControl("start");

            // Assert
            Assert.AreEqual("command valid", result);
        }
        [TestMethod]
        public void RefreshBQ()
        {
            // Arrange
            TestControllerBuilder builder = new TestControllerBuilder();
            builder.HttpContext.Request.RequestType = "GET";
            OverviewController controller = new OverviewController();
            builder.InitializeController(controller);
            // Act
            string result = controller.RefreshBQ();

            // Assert
            Assert.IsNotNull(result);
        }
        [TestMethod]
        public void Message()
        {
            // Arrange
            TestControllerBuilder builder = new TestControllerBuilder();
            builder.HttpContext.Session["SelectedMachine"] = "123";
            OverviewController controller = new OverviewController();
            builder.InitializeController(controller);
            ServiceSingleton.Instance.OPCService.InitConnection("123");

            // Act
            JsonResult result = controller.Message();

            // Assert
            Assert.IsFalse(result.Data.ToString().Contains("error"));
        }
        [TestMethod]
        public void MessageNull()
        {
            // Arrange
            TestControllerBuilder builder = new TestControllerBuilder();
            OverviewController controller = new OverviewController();
            builder.InitializeController(controller);

            // Act
            JsonResult result = controller.Message();

            // Assert
            Assert.IsTrue(result.Data.ToString().Contains("error"));
        }
    }
}
