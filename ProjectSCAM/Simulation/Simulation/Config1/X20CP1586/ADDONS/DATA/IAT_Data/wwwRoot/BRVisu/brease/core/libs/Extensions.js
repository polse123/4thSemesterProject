/*global define,console*/
define(function () {

    'use strict';

    var Extensions = {
        originalConsole: window.console,
        console: {
            init: function (config) {
                if (config.storageLog) {
                    console.log = function () {
                        try {
                            throw new Error('LogError');
                        }
                        catch (e) {
                            var stack = e.stack.split('\n'),
                                file = stack[2].substring(stack[2].lastIndexOf('/') + 1),
                                track = file.split(':');
                            _logToStorage.call(null, 'log', Date.now(), arguments[0], track[0], track[1], arguments[1]);
                        }
                    };
                    console.debug = function () {

                        try {
                            throw new Error('LogError');
                        }
                        catch (e) {
                            var stack = e.stack.split('\n'),
                                file = stack[2].substring(stack[2].lastIndexOf('/') + 1),
                                track = file.split(':');
                            _logToStorage.call(null, 'debug', Date.now(), arguments[0], track[0], track[1], '#0000ff');
                        }
                    };
                    console.warn = function () {

                        try {
                            throw new Error('LogError');
                        }
                        catch (e) {
                            var stack = e.stack.split('\n'),
                                file = stack[2].substring(stack[2].lastIndexOf('/') + 1),
                                track = file.split(':');
                            _logToStorage.call(null, 'warn', Date.now(), arguments[0], track[0], track[1], '#000', '#fffbe6');
                        }
                    };
                    //window.onerror = function (e) {
                    //    if (e.stack) {
                    //        var stack = e.stack.split('\n'),
                    //                    file = stack[2].substring(stack[2].lastIndexOf('/') + 1),
                    //                    track = file.split(':');
                    //        _logToStorage.call(null, 'error', e.message, track[0], track[1], '#cc0000');
                    //    } else {
                    //        _logToStorage.call(null, 'error', e.message, 'unknown', 0, '#cc0000');
                    //    }
                    //}
                }
                if (config.warn === true) {
                    console.iatWarn = console.warn;
                    console.iatInfo = console.info;
                } else {
                    console.iatWarn = function () { };
                    console.iatInfo = function () { };
                }

                if (config.debug === true) {
                    console.iatDebug = console.debug;
                    console.iatDebugLog = console.log;
                } else {
                    console.iatDebug = function () { };
                    console.iatDebugLog = function () { };
                }
                console.always = function (msg, type, color) {
                    if (!console[type]) {
                        type = 'log';
                    }
                    var args = [((color) ? '%c' : '') + msg];
                    if (color !== undefined) {
                        args.push(color);
                    }
                    console[type].apply(console, args);
                };
                console.color = function (msg, color) {
                    console.log.call(console, '%c' + msg, 'color:' + color + ';');
                };
            }
        }
    };

    var _first = true;

    function _logToStorage() {
        var logData = localStorage.getItem("log");
        logData = (_first) ? _logEntry.apply(null, arguments) : logData + '|#|' + _logEntry.apply(null, arguments);
        _first = false;
        localStorage.setItem("log", logData);
    }

    function _logEntry(type, time, message, file, line, color, backColor) {
        var obj = {
            type: type,
            time: time,
            message: (message.indexOf('%c') === 0) ? message.substring(2) : message,
            file: file,
            line: line,
            color: (color) ? _color(color) : '#000',
            backColor: (backColor) ? backColor : 'transparent'
        };
        return JSON.stringify(obj);
    }
    function _color(color) {
        if (color.indexOf && color.indexOf('color:') !== -1) { return color.substring(color.indexOf(':') + 1); } else { return color; }
    }

    Math.range = function (value, min, max) {

        if (value < min) {
            value = min;
        }
        if (value > max) {
            value = max;
        }
        return value;
    };

    Math.roundTo = function (value, power) {
        var factor = Math.pow(10, power);
        if (isNaN(factor)) {
            return NaN;
        } else {
            return Math.round(value * factor) / factor;
        }
    };

    Math.log10 = Math.log10 || function (x) {
        return Math.log(x) / Math.LN10;
    };

    return Extensions;
});