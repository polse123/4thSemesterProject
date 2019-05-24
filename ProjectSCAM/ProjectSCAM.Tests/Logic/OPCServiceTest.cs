using System;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using ProjectSCAM.Models;
using ProjectSCAM.Models.Logic;

namespace ProjectSCAM.Tests.Logic
{
    [TestClass]
    public class OPCServiceTest
    {
        [TestMethod]
        public void InitConnection()
        {
            //arrange
            // ip of virtual simulation - must be turned on
            string ip = "opc.tcp://127.0.0.1:4840";

            //act
            ServiceSingleton.Instance.OPCService.InitConnection(ip);
            OpcClient opc = ServiceSingleton.Instance.OPCService.GetOpcConnection(ip);

            //assert
            Assert.IsTrue(ServiceSingleton.Instance.OPCService.OpcConnections.ContainsKey(ip));
            Assert.AreEqual(UnifiedAutomation.UaClient.ServerConnectionStatus.Connected, opc.GetSession().ConnectionStatus);
        }
        [TestMethod]
        public void GetMachine()
        {
            //arrange
            string ip = "opc.tcp://127.0.0.1:4840";

            //act
            MachineModel model = ServiceSingleton.Instance.OPCService.GetMachine(ip);

            //assert
            Assert.IsNotNull(model);
        }
        [TestMethod]
        public void HandleCommandInvalid()
        {
            //arrange
            string ip = "opc.tcp://127.0.0.1:4840";

            //act
            ServiceSingleton.Instance.OPCService.InitConnection(ip);
            bool exceptionTrigger = false;
            try
            {
                ServiceSingleton.Instance.OPCService.HandleCommand(ip, "attack");
            } catch(Exception ex)
            {
                exceptionTrigger = true;
            }

            //assert
            Assert.IsTrue(exceptionTrigger);
        }
        [TestMethod]
        public void HandleCommand()
        {
            //arrange
            string ip = "opc.tcp://127.0.0.1:4840";

            //act
            ServiceSingleton.Instance.OPCService.InitConnection(ip);
            bool succeeded = ServiceSingleton.Instance.OPCService.HandleCommand(ip, "reset");
            //assert
            Assert.IsTrue(succeeded);
        }
        [TestMethod]
        public void GetOpcConnection()
        {
            //arrange
            string ip = "opc.tcp://127.0.0.1:4840";

            //act
            ServiceSingleton.Instance.OPCService.InitConnection(ip);
            OpcClient opc = ServiceSingleton.Instance.OPCService.GetOpcConnection(ip);
            //assert
            Assert.IsNotNull(opc);
        }
    }
}
