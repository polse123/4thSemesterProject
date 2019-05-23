/*global define*/
define(['brease/services/RuntimeService'], function (runtimeService) {

    'use strict';

    /**
    * @class brease.services.Opcua
    * @extends core.javascript.Object
    * Opcua service; available via brease.services.opcua 
    * @singleton
    */
    var Opcua = {

        /**
        * @method readNodeHistory
        * Method to read history of an OPC UA node  
        * Example:
        *
        *       brease.services.opcua.readNodeHistory([{
        *           "nodeId": "NS6|String|::Program:var1",
        *           "unit": "MTS"
        *       }]).then(showResult);
        *
        * @param {NodeInfo[]} nodesReadInfo (required)
        * @param {TimeSpan} timeSpan (required)
		* @return {Promise}
        */
        readNodeHistory: function (nodesReadInfo, timeSpan) {
            var deferred = $.Deferred();
            var data = {
                "nodesReadInfo": nodesReadInfo
            };
            if (timeSpan) {
                data.timeSpan = timeSpan;
            }
            runtimeService.opcuaReadNodeHistory(data, runtimeService_callback, { deferred: deferred });
            return deferred.promise();
        },

        /**
        * @method readHistoryCount
        * Method to read the number of available historical data of an OPC UA node in a defined time span  
        * Example:
        *
        *       brease.services.opcua.readHistoryCount("::Program:var1", {
        *               "startTime": "2016-01-01T01:01:01.001",
        *               "endTime": "2016-01-01T01:02:01.001"
        *           }).then(showResult);
        *
        * @param {String} nodeId (required)
        * @param {TimeSpan} timeSpan (required)
		* @return {Promise}
        */
        readHistoryCount: function (nodeId, timeSpan) {
            var deferred = $.Deferred();

            runtimeService.opcuaReadHistoryCount({
                "nodeId": nodeId,
                "timeSpan": timeSpan
            }, runtimeService_callback, { deferred: deferred });
            return deferred.promise();
        },

        /**
        * @method readHistoryStart
        * Method to read the first (oldest) historical value of an OPC UA node  
        * Example:
        *
        *       brease.services.opcua.readHistoryStart("::Program:var1").then(showResult);
        *
        * @param {String} nodeId (required)
		* @return {Promise}
        */
        readHistoryStart: function (nodeId) {
            var deferred = $.Deferred();
            runtimeService.opcuaReadHistoryStart({ "nodeId": nodeId }, runtimeService_callback, { deferred: deferred });
            return deferred.promise();
        },

        /**
        * @method readHistoryEnd
        * Method to read the last (newest) historical value of an OPC UA node  
        * Example:
        *
        *       brease.services.opcua.readHistoryEnd("::Program:var1").then(showResult);
        *
        * @param {String} nodeId (required)
		* @return {Promise}
        */
        readHistoryEnd: function (nodeId) {
            var deferred = $.Deferred();
            runtimeService.opcuaReadHistoryEnd({ "nodeId": nodeId }, runtimeService_callback, { deferred: deferred });
            return deferred.promise();
        },

        /**
        * @method browse
        * Method to read all referenced nodes of an OPC UA node  
        * Example:
        *
        *       brease.services.opcua.browse("::Program:var1").then(showResult);
        *
        * @param {String} nodeId (required)
		* @return {Promise}
        */
        browse: function (nodeId) {
            var deferred = $.Deferred();
            runtimeService.opcuaBrowse({ "nodeId": nodeId }, runtimeService_callback, { deferred: deferred });
            return deferred.promise();
        },

        /**
        * @method read
        * Method to read all attributes of an OPC UA node  
        * Example:
        *
        *       brease.services.opcua.read([
        *           {
        *           "nodeId": "::Program:var1",
        *           "attributeId": 13
        *           }
        *       ]).then(showResult);
        *
        * @param {Object[]} nodesToRead (required)
		* @return {Promise}
        */
        read: function (nodes) {
            var deferred = $.Deferred();
            runtimeService.opcuaRead({ "nodesToRead": nodes }, runtimeService_callback, { deferred: deferred });
            return deferred.promise();
        },

        /**
        * @method callMethod
        * Method to call a method on OPC UA Server  
        * Example:
        *
        *       brease.services.opcua.callMethod("::Program:var1", "methodXY", {"arg1":10, "arg2":true}).then(showResult);
        *
        * @param {String} objectId (required) NodeId of object which provides the method
        * @param {String} methodId (required) NodeId of method
        * @param {Object} args arguments of method as key-value pairs
		* @return {Promise}
        */
        callMethod: function (objectId, methodId, args) {
            var deferred = $.Deferred();
            runtimeService.opcuaCallMethod({ "objectId": objectId, "methodId": methodId, "arguments": args }, runtimeService_callback, { deferred: deferred });
            return deferred.promise();
        }
    };

    function runtimeService_callback(result, callbackInfo) {
        callbackInfo.deferred.resolve(result);
    }

    return Opcua;

});