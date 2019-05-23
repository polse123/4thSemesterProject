/*global define*/
define(function () {
    /*jshint white:false */
    'use strict';

    /**
    * @class brease.services.RuntimeService
    * @extends core.javascript.Object
    * connector to runtime services; available via brease.runtimeService
    * @singleton
    */
    var RuntimeService = function RuntimeService() { },

	p = RuntimeService.prototype;

    p.init = function (serviceBridge, webSocket) {
        this.services = serviceBridge;
        this.socket = webSocket;
    };

    p.socketIsReady = function () {
        var deferred = $.Deferred();
        this.socket.start(function (success) {
            if (success === true) {
                deferred.resolve();
            } else {
                deferred.reject();
            }
        });
        return deferred.promise();
    };

    p.startHeartbeat = function () {
        this.socket.startHeartbeat.apply(this.socket, arguments);
    };

    p.addEventListener = function () {
        this.socket.addEventListener.apply(this.socket, arguments);
    };
    
    p.removeEventListener = function () {
        this.socket.removeEventListener.apply(this.socket, arguments);
    };
    
    /*#######################
     ### LANGUAGE related ###
     #######################*/

    /**
    * @method
    * Method to load a list of available languages from server
    * @param {Function} [callback] A callback method to handle result
    */
    p.loadLanguages = function () {
        this.services.loadLanguages.apply(this.services, arguments);
    };

    /**
    * @method
    * Method to load an Object (associative Array) of available text from server
    * @param {String} [langKey] An optional String to specify language. If no key is given, text of current selected language is loaded.
    * @param {Function} [callback] A callback method to handle result
    */
    p.loadTexts = function () {
        this.services.loadTexts.apply(this.services, arguments);
    };
    p.loadSystemTexts = function () {
        this.services.loadSystemTexts.apply(this.services, arguments);
    };

    /**
    * @method
    * Method to switch language
    * @param {String} langKey A String to specify language.
    * @param {Function} [callback] A callback method to handle result
    */
    p.switchLanguage = function () {
        this.services.switchLanguage.apply(this.services, arguments);
    };

    p.getAllUnitSymbols = function () {
        this.services.getAllUnitSymbols.apply(this.services, arguments);
    };

    p.getUnitSymbols = function () {
        this.services.getUnitSymbols.apply(this.services, arguments);
    };


    /*######################
     ### CULTURE related ###
     ######################*/

    /**
    * @method
    * Method to load a list of available cultures from server
    * @param {Function} [callback] A callback method to handle result
    */
    p.loadCultures = function () {
        this.services.loadCultures.apply(this.services, arguments);
    };

    /**
    * @method
    * Method to switch culture
    * @param {String} key A String to specify culture.
    * @param {Function} [callback] A callback method to handle result
    */
    p.switchCulture = function () {
        this.services.switchCulture.apply(this.services, arguments);
    };


    /*######################
     ### MEASUREMENTSYSTEM related ###
     ######################*/

    /**
    * @method
    * Method to load a list of available cultures from server
    * @param {Function} [callback] A callback method to handle result
    */
    p.loadMeasurementSystemList = function () {
        this.services.loadMeasurementSystemList.apply(this.services, arguments);
    };

    /**
    * @method
    * Method to switch Measurement-System
    * @param {String} key A String to specify Measurement-System.
    * @param {Function} [callback] A callback method to handle result
    */
    p.switchMeasurementSystem = function () {
        this.services.switchMeasurementSystem.apply(this.services, arguments);
    };


    /*###################
     ### USER related ###
     ####################*/

    p.authenticateUser = function () {
        this.services.authenticateUser.apply(this.services, arguments);
    };

    p.setCurrentUser = function () {
        this.services.setCurrentUser.apply(this.services, arguments);
    };

    p.loadCurrentUser = function () {
        this.services.loadCurrentUser.apply(this.services, arguments);
    };

    p.setDefaultUser = function () {
        this.services.setDefaultUser.apply(this.services, arguments);
    };

    p.userHasRoles = function () {
        this.services.userHasRoles.apply(this.services, arguments);
    };

    p.loadUserRoles = function () {
        this.services.loadUserRoles.apply(this.services, arguments);
    };

    /*####################
     ### TextFormatter ###
     #####################*/

    p.formatText = function () {
        this.services.formatText.apply(this.services, arguments);
    };

    /*###################
	### LOGGING related ###
	####################*/

    /**
    * @method
    * Method to write an event into the Eventlog
    * @param {Number} [eventId] EventId of the Event
	* @param {Number} [verboseLevel] Verbose level of the Event
	* @param {String} [text] additional Information about the event
	* @param {Function} [callback] A callback method to handle response
    */
    p.logEvents = function (eventId, verboseLevel, text, args, callback) {
        var eventData = [];
        if (eventId !== undefined) {
            var data = {
                eventId: eventId,
                verboseLvl: verboseLevel,
                text: text || "",
                args: args || []
            };

            eventData.push(data);
        }
        this.services.logEvents(eventData, callback);
    };



    /*#######################
      ### BINDING related ###
      #######################*/

    p.getSubscription = function () {
        this.services.getSubscription.apply(this.services, arguments);
    };

    p.activateContent = function () {
        this.services.activateContent.apply(this.services, arguments);
    };

    p.deactivateContent = function () {
        this.services.deactivateContent.apply(this.services, arguments);
    };

    p.activateVisu = function () {
        this.services.activateVisu.apply(this.services, arguments);
    };

    p.deactivateVisu = function () {
        this.services.deactivateVisu.apply(this.services, arguments);
    };

    p.sendUpdate = function (data) {
        //console.log('sendUpdate(connected=' + _isConnected + '):', JSON.stringify(data[0].eventArgs, null, '\t'));
        if (data !== undefined) {
            this.socket.send(JSON.stringify({
                Command: 'update',
                Resource: 'services',
                Data: data
            }));
        }
    };

    p.createBindings = function () {
        this.services.createBindings.apply(this.services, arguments);
    };

    p.deleteBindings = function () {
        this.services.deleteBindings.apply(this.services, arguments);
    };

    /*#######################
    ### Action Event related ###
    #######################*/

    p.getEventSubscription = function () {
        this.services.getEventSubscription.apply(this.services, arguments);
    };

    p.getSessionEventSubscription = function () {
        this.services.getSessionEventSubscription.apply(this.services, arguments);
    };

    p.sendEvent = function (data) {
        if (data !== undefined) {
            //console.log('webSocket.dispatchEvent:', JSON.stringify(data, null, '\t'));
            this.socket.send(JSON.stringify({
                Command: 'event',
                Resource: 'services',
                Data: data
            }));
        }
    };

    p.actionResponse = function (data) {
        if (data !== undefined) {
            //console.log('webSocket.actionResponse:', JSON.stringify(data, null, '\t'));
            this.socket.send(JSON.stringify({
                Command: 'actionResponse',
                Resource: 'services',
                Data: data
            }));
        }
    };

    /*#######################
      ### CLIENTINFO ###
      #######################*/

    p.setClientInformation = function () {
        this.services.setClientInformation.apply(this.services, arguments);
    };

    p.registerClient = function () {
        this.services.registerClient.apply(this.services, arguments);
    };



    /*#######################
      ###  VISU related   ###
      #######################*/

    p.loadVisuData = function () {
        this.services.loadVisuData.apply(this.services, arguments);
    };

    p.loadConfiguration = function () {
        this.services.loadConfiguration.apply(this.services, arguments);
    };

    /*#######################
        ### OPC UA ###
    #######################*/

    p.opcuaReadNodeHistory = function () {
        this.services.opcuaReadNodeHistory.apply(this.services, arguments);
    };

    p.opcuaReadHistoryCount = function () {
        this.services.opcuaReadHistoryCount.apply(this.services, arguments);
    };

    p.opcuaReadHistoryStart = function () {
        this.services.opcuaReadHistoryStart.apply(this.services, arguments);
    };

    p.opcuaReadHistoryEnd = function () {
        this.services.opcuaReadHistoryEnd.apply(this.services, arguments);
    };

    p.opcuaBrowse = function () {
        this.services.opcuaBrowse.apply(this.services, arguments);
    };

    p.opcuaCallMethod = function () {
        this.services.opcuaCallMethod.apply(this.services, arguments);
    };

    p.opcuaRead = function () {
        this.services.opcuaRead.apply(this.services, arguments);
    };

    return new RuntimeService();

});