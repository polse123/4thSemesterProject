/*global define*/
define(['brease/events/BreaseEvent', 'brease/enum/Enum'], function (BreaseEvent, Enum) {

    'use strict';

    /**
    * @class brease.services.Logger
    * @extends core.javascript.Object
    * @ignore
    * Logger Service
    * Example of usage:
    *
    * @singleton
    */
    var Logger = function () { },
        p = Logger.prototype;

    /*
    /* PUBLIC
    */

    p.init = function (runtimeService) {
        this.runtimeService = runtimeService;
        this.verboseLevel = Enum.EventLoggerVerboseLevel.OFF;
        document.addEventListener(BreaseEvent.LOG_MESSAGE, this._logMessageHandler.bind(this));
        return this;
    };

    /**
	 * @method logMessage
	 * Method to write an event into the Eventlog
	 * @param {Number} eventId EventId of the Event
	 * @param {Number} [verbose] Verbose level of the Event
	 * @param {String} [text] additional Information about the event
	 */
    p.logMessage = function (eventId, verbose, text, args) {
        if (verbose === undefined || verbose <= this.verboseLevel) {
            this.runtimeService.logEvents(eventId, verbose, text, args, this._logCallbackHandler.bind(this));
        }
    };

    p.log = function (code, customer, verbose, severity, args, text) {
        if (verbose === undefined) {
            verbose = Enum.EventLoggerVerboseLevel.OFF;
        }
        if (code !== undefined) {
            var id = _generateId(code, Enum.EventLoggerFacility.IAT, customer || Enum.EventLoggerCustomer.BUR, severity);
            this.logMessage(id, verbose, text || "", args || []);
        }
    };

    p._logMessageHandler = function (e) {
        var verbose = Enum.EventLoggerVerboseLevel.OFF;
        if (e.detail.verbose !== undefined) {
            verbose = e.detail.verbose;
        }

        if (e.detail && e.detail.code) {
            e.detail.args = e.detail.args || [];
            var id = _generateId(e.detail.code, Enum.EventLoggerFacility.IAT, e.detail.customer || Enum.EventLoggerCustomer.BUR, e.detail.severity);
            this.logMessage(id, verbose, e.detail.text, e.detail.args);
        }
    };

    p._logCallbackHandler = function (data) {
        if (data.verboseLvl !== undefined) {
            this.verboseLevel = data.verboseLvl;
        }
    };

    function _generateId(code, facility, customer, severity) {
        var id;

        if (severity === undefined) {
            severity = 1;
        }

        id = code | (facility << 16) | (customer << 29) | (severity << 30);
        return id;

    }

    return new Logger();

});