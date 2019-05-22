using System;
using System.Collections.Specialized;
using System.Net.Http;
using System.Web;
using System.Web.Mvc;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using Moq;
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
        }

        
        [TestMethod]
        public void SetMachine()
        {
            // Arrange
            MachineSelectionController controller = new MachineSelectionController();
            Mock<ControllerContext> moqContext;
            Mock<HttpRequestBase> moqRequest;
            Mock<HttpSessionStateBase> moqSession;
            moqContext = new Mock<ControllerContext>();
            moqRequest = new Mock<HttpRequestBase>();
            moqSession = new Mock<HttpSessionStateBase>();
            moqContext.Setup(x => x.HttpContext.Session).Returns(moqSession.Object);

            controller.ControllerContext = moqContext.Object;

            // Act
               controller.SetMachine("123");
            OpcClient opc;
            ServiceSingleton.Instance.OPCService.OpcConnections.TryGetValue("123", out opc);
            //      RedirectToRouteResult result = controller.Create(m) as RedirectToRouteResult;

            // Assert
            Assert.IsNotNull(opc);
            //   Assert.IsTrue(controller.ViewData.ModelState.Count > 0);
        }
    }
}
