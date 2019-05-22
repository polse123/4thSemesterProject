/*global define*/
define(['brease/core/Utils'], function (Utils) {

    'use strict';

    var EventDispatcher = function EventDispatcher() {
        Utils.defineProperty(this, '_listeners', {}, false, false, true);
    },
    p = EventDispatcher.prototype;

    p.addEventListener = function (type, listener, unshift) {

        var listeners = this._listeners;
        if (listeners[type] === undefined) {
            listeners[type] = [];
        }

        if (listeners[type].indexOf(listener) === -1) {
            if (unshift === true) {
                listeners[type].unshift(listener);
            } else {
                listeners[type].push(listener);
            }
        }

    };

    p.hasEventListener = function (type, listener) {

        var listeners = this._listeners;
        if (listeners[type] !== undefined && listeners[type].indexOf(listener) !== -1) {
            return true;
        }
        return false;
    };

    p.hasListenersOfType = function (type) {
        var listeners = this._listeners;
        return (listeners !== undefined && listeners[type] !== undefined && listeners[type].length > 0);
    };

    p.removeEventListener = function (type, listener) {

        var listeners = this._listeners;
        if (listeners[type]) {
            var index = listeners[type].indexOf(listener);

            if (index !== -1) {
                listeners[type].splice(index, 1);
            }
        }
    };

    p.dispatchEvent = function (event, type) {

        var arListeners = this._listeners[(type !== undefined) ? type : event.type];

        if (arListeners !== undefined) {
            for (var i = 0, l = arListeners.length; i < l; i += 1) {
                arListeners[i].call(this, event);
            }
        }
    };

    return EventDispatcher;

});