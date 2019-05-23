/*global define,console*/
define(['brease/helper/stubs/Server', 'brease/events/ServerEvent', 'brease/events/BreaseEvent'], function (Server, ServerEvent, BreaseEvent) {

    'use strict';

    var _timeoutForSessionActivated = 0;

    return {
        send: function (data) {
            var dataObj;
            try {
                dataObj = JSON.parse(data);
            } catch (e) {
                console.log('PARSE ERROR:' + e.message);
            }

            if (dataObj && dataObj.Command === "update") {
                Server.setData(dataObj.Data);
            }
        },

        getModelData: function (widgetId, attribute) {
            return Server.getModelData(widgetId, attribute);
        },

        start: function (callback) {
            callback(true);
            window.setTimeout(function () {
                var type = ServerEvent.SESSION_ACTIVATED;
                Server.dispatchEvent({ event: type }, type);
            }, _timeoutForSessionActivated);

        },
        startHeartbeat: function () {

        },
        addEventListener: function (eventType, fn) {
            Server.addEventListener(eventType, fn);
        },
        removeEventListener: function (eventType, fn) {
            Server.removeEventListener(eventType, fn);
        },
        triggerServerAction: function (action, target, aId, args) {
            var type = "action";
            Server.dispatchEvent({
                "event": type,
                "detail": {
                    "action": action,
                    "target": target,
                    "actionArgs": args || {},
                    "actionId": aId
                }
            }, type);
        },

        triggerServerChange: function (widgetId, attribute, value) {
            var type = ServerEvent.PROPERTY_VALUE_CHANGED;
            Server.dispatchEvent({
                "event": type,
                "detail": [
                    {
                        "data": [
                            {
                                "attribute": attribute,
                                "value": value
                            }
                        ],
                        "refId": widgetId
                    }
                ]
            }, type);
        },

        triggerConnectionStateChange: function (state) {
            var type = BreaseEvent.CONNECTION_STATE_CHANGED;
            Server.dispatchEvent({
                event: type,
                detail: { state: state }
            }, type);
        },

        triggerContentActivated: function (contentId) {
            var type = ServerEvent.CONTENT_ACTIVATED;
            Server.dispatchEvent({
                event: type,
                detail: { contentId: contentId }
            }, type);
        }
    };
});