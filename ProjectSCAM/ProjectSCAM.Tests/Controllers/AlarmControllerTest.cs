using System;
using System.Web.Mvc;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using MvcContrib.TestHelper;
using ProjectSCAM.Controllers;
using ProjectSCAM.Models.Logic;

namespace ProjectSCAM.Tests.Controllers {
    [TestClass]
    public class AlarmControllerTest {
        [TestMethod]
        public void Index()
        {
            // Arrange
            TestControllerBuilder builder = new TestControllerBuilder();
            AlarmController controller = new AlarmController();
            builder.InitializeController(controller);

            // Act
            ViewResult result = controller.Index() as ViewResult;

            // Assert
            Assert.IsNotNull(result);
            Assert.IsNotNull(result.Model);
        }
        [TestMethod]
        public void Popup()
        {
            // Arrange
            TestControllerBuilder builder = new TestControllerBuilder();
            builder.HttpContext.Request.RequestType = "GET";
            AlarmController controller = new AlarmController();
            builder.InitializeController(controller);

            // Act
            string result = controller.Popup();

            // Assert
            Assert.IsNotNull(result);
        }
        [TestMethod]
        public void GetAlarmsByMachine()
        {
            // Arrange
            TestControllerBuilder builder = new TestControllerBuilder();
            builder.HttpContext.Request.RequestType = "GET";
            AlarmController controller = new AlarmController();
            builder.InitializeController(controller);
            string machineId = "1";

            // Act
            RedirectToRouteResult result = controller.GetAlarmsByMachine(machineId) as RedirectToRouteResult;
            var tempData = controller.TempData["alarms"];
            // Assert
            Assert.IsNotNull(result.RouteValues["action"].Equals("Index"));
            Assert.IsNotNull(tempData);
        }
        [TestMethod]
        public void GetAlarmsByDate()
        {
            // Arrange
            TestControllerBuilder builder = new TestControllerBuilder();
            builder.HttpContext.Request.RequestType = "GET";
            AlarmController controller = new AlarmController();
            builder.InitializeController(controller);
            string date = "05/2019";

            // Act
            RedirectToRouteResult result = controller.GetAlarmsByDate(date) as RedirectToRouteResult;
            var tempData = controller.TempData["alarms"];
            // Assert
            Assert.IsNotNull(result.RouteValues["action"].Equals("Index"));
            Assert.IsNotNull(tempData);
        }
        [TestMethod]
        public void GetAlarmsByUnhandled()
        {
            // Arrange
            TestControllerBuilder builder = new TestControllerBuilder();
            builder.HttpContext.Request.RequestType = "GET";
            AlarmController controller = new AlarmController();
            builder.InitializeController(controller);

            // Act
            RedirectToRouteResult result = controller.GetAlarmsByUnhandled() as RedirectToRouteResult;
            var tempData = controller.TempData["alarms"];
            // Assert
            Assert.IsNotNull(result.RouteValues["action"].Equals("Index"));
            Assert.IsNotNull(tempData);
        }
        [TestMethod]
        public void GetAlarm()
        {
            // Arrange
            TestControllerBuilder builder = new TestControllerBuilder();
            builder.HttpContext.Request.RequestType = "GET";
            AlarmController controller = new AlarmController();
            builder.InitializeController(controller);
            ServiceSingleton.Instance.OPCService.ActiveAlarms.Add(new Models.AlarmModel());
            // Act
            string result = controller.GetAlarm();
            // Assert
            Assert.IsNotNull(result);
        }
    }
}
