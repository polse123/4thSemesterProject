/*global define,brease,console*/
define(['brease/events/BreaseEvent', 'brease/enum/Enum', 'brease/controller/libs/ErrorCode'], function (BreaseEvent, Enum, ErrorCode) {
    /*jshint white:false */
    'use strict';

    var Messenger = function (systemMessage) {
        this.systemMessage = systemMessage;
    },
    p = Messenger.prototype;

    p.announce = function (messageId, data) {

        switch (messageId) {

            case 'START_CONTENT':
                console.log('start with content:' + data.contentId);
                break;

            case 'START_VISU':
                console.log('start with visualization:' + data.visuId);
                break;

            case 'VISU_NOT_FOUND':
                console.log('visualization (visuId=' + data.visuId + ') not found');
                break;

            case 'VISU_NOT_ACTIVATED':
                console.log('visualization (visuId=' + data.visuId + ') not activated');
                this.systemMessage.showMessage('visualization (visuId=' + data.visuId + ') not activated');
                break;

            case 'CONFIGURATION_LOAD_ERROR':
                console.iatWarn('configuration not found; take default values');
                break;

            case 'START_SERVICES_SUCCESS':
                brease.loggerService.log(Enum.EventLoggerId.CLIENT_START_OK, Enum.EventLoggerCustomer.BUR, Enum.EventLoggerVerboseLevel.OFF, Enum.EventLoggerSeverity.SUCCESS, [data.clientId]);
                break;

            case 'START_SERVICES_FAILED':
                console.log('XHR error:' + data.message);
                this.systemMessage.showMessage('server connection (services) error');
                brease.loggerService.log(Enum.EventLoggerId.CLIENT_START_FAIL, Enum.EventLoggerCustomer.BUR, Enum.EventLoggerVerboseLevel.OFF, Enum.EventLoggerSeverity.ERROR, [], 'XHR error:' + data.message);
                break;

            case 'REGISTER_CLIENT_SUCCESS':
                console.log('registered client with id = ' + data.response['ClientId']);
                break;

            case 'REGISTER_CLIENT_FAILED':
                // generic connection failed message and id
                var logMessage = ErrorCode.getMessageByCode(ErrorCode.GENERIC_CONNECTION_FAILED),
                    logId = ErrorCode.getLogIdByCode(ErrorCode.GENERIC_CONNECTION_FAILED);

                if (data.response.status !== undefined && data.response.status.code !== undefined) {
                    // specific log message and id if there is a code
                    logMessage = ErrorCode.getMessageByCode(data.response.status.code, [data.visuId]);
                    logId = ErrorCode.getLogIdByCode(data.response.status.code);
                }
                brease.loggerService.log(logId, Enum.EventLoggerCustomer.BUR, Enum.EventLoggerVerboseLevel.OFF, Enum.EventLoggerSeverity.ERROR, [], logMessage);
                this.systemMessage.showMessage(logMessage);
                console.log(logMessage);
                break;

            case 'SERVER_CONNECTION_START':

                this.systemMessage.deferMessage('try to establish server connection...', 2000);
                console.log('try to establish server connection..');
                break;

            case 'SERVER_CONNECTION_SUCCESS':

                this.systemMessage.clear();
                break;

            case 'SERVER_CONNECTION_ERROR':

                this.systemMessage.showMessage('server connection error');
                break;

            case 'TEXT_LOAD_START':

                this.systemMessage.deferMessage('loading texts...', 2000);
                console.log('loading texts...');
                break;

            case 'TEXT_LOAD_SUCCESS':

                this.systemMessage.clear();
                break;

            case 'TEXT_LOAD_ERROR':

                this.systemMessage.showMessage('error on loading texts');
                break;

            case 'WIDGET_LOAD_ERROR':

                this.systemMessage.showMessage('error on loading system widgets');
                break;
        }
    };

    return Messenger;

});