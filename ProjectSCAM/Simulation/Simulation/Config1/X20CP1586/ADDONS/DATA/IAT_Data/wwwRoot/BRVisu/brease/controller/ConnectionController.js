/*global define,brease,CustomEvent*/
define(['brease/events/ServerEvent', 'brease/events/BreaseEvent'], function (ServerEvent, BreaseEvent) {

    'use strict';

    /**
    * @class brease.controller.ConnectionController
    * @extends Object
    * controls server connections
    * @singleton
    */
    var ConnectionController = {
        init: function (runtimeService, systemMessage, reconnectHandler, transferFinishedHandler) {
            if (reconnectHandler !== undefined) {
                _reconnectHandler = reconnectHandler;
            }
            if (transferFinishedHandler !== undefined) {
                _transferFinishedHandler = transferFinishedHandler;
            }
            runtimeService.addEventListener(BreaseEvent.CONNECTION_STATE_CHANGED, _connectionStateChangedHandler.bind(this, systemMessage));
            runtimeService.addEventListener(ServerEvent.TRANSFER_START, _transferStartHandler.bind(this, systemMessage));
            runtimeService.addEventListener(ServerEvent.TRANSFER_FINISH, _transferFinishHandler.bind(this, systemMessage));
        }
    },
    _transferInProcess = false,

    _reconnectHandler = function () {
        window.location.reload();
    },

    _transferFinishedHandler = function () {
        window.location.reload();
    };

    function _connectionStateChangedHandler(systemMessage, e) {
        if (e.detail.state === true) {
            systemMessage.clear();
            _reconnectHandler();
        } else if (_transferInProcess !== true) {
            document.body.dispatchEvent(new CustomEvent(BreaseEvent.CONNECTION_STATE_CHANGED, { detail: { state: e.detail.state } }));
            systemMessage.showMessage(brease.language.getSystemTextByKey('BR/IAT/brease.common.connectionError.text'));
        }
    }

    function _transferStartHandler(systemMessage) {
        _transferInProcess = true;
        systemMessage.showMessage(brease.language.getSystemTextByKey('BR/IAT/brease.common.transferStart'));
    }

    function _transferFinishHandler(systemMessage) {
        _transferInProcess = false;
        systemMessage.clear();
        _transferFinishedHandler();
    }

    return ConnectionController;

});