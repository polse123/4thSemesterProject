/*global define,console,brease*/
define(['brease/events/EventDispatcher', 'brease/events/BreaseEvent'], function (EventDispatcher, BreaseEvent) {
    /*jshint white:false*/
    'use strict';

    var _enabled = false,
        _baseUrl = window.location.protocol + "//" + window.location.hostname + ":" + window.location.port,
        _config,
        _callback,
        _socket;

    function _startSocket(SocketClass, initialTimeout) {
        if ("WebSocket" in window) {
            var socketType = 'ws://';

            if (window.location.protocol.indexOf('https') === 0) {
                socketType = 'wss://';
            }
            try {
                var cmto = window.setTimeout(function () {
                    _socketError('timedOutInitially');
                }, (initialTimeout !== undefined) ? initialTimeout : 15000);

                if (!SocketClass) {
                    SocketClass = window.WebSocket;
                }
                _socket = new SocketClass(socketType + _config.host + ':' + _config.port + '?watchdog=' + _config.watchdog);

                _socket.onmessage = _onSocketMessage;

                _socket.onopen = function () {
                    console.log(socketModule.MESSAGES['success']);
                    window.clearTimeout(cmto);
                    _config.sockets.available = true;
                    _callback(true);
                };

                _socket.onclose = function () {
                    console.log(socketModule.MESSAGES['socketClosed']);
                    window.clearTimeout(_closingTimer);
                    if (_config.sockets.available !== true) {
                        window.clearTimeout(cmto);
                        _socketError('socketClosedBeforeSuccess');
                    } else {
                        _stopTimer();
                        _stopHeartbeat();
                        _processSocketMessage({
                            type: BreaseEvent.CONNECTION_STATE_CHANGED,
                            detail: {
                                state: false
                            }
                        });
                        window.setTimeout(_tryReconnect, 1000);
                    }
                };

                _socket.onerror = function (e) {
                    console.log('SOCKET ERROR[' + e.type + ']:' + e.message);
                };

            } catch (e) {
                _socketError('openSocketError', '\n' + e.message);
            }
        } else {
            _socketError('noSockets');
        }
    }

    function _onSocketMessage(event) {

        if (event.data !== 'pong') {
            var info;
            try {
                info = JSON.parse(event.data);
            } catch (e) {
                console.warn(socketModule.MESSAGES['parsererror'] + '\n' + e.message);
            }
            if (info) {
                if (info.Command === 'getUpdate' || info.Command === 'system') {
                    _processSocketMessage({
                        type: info.Data.event,
                        detail: info.Data.eventArgs
                    });
                }

                else if (info.Command === 'event') {
                    if (info.Data !== undefined) {
                        _processSocketMessage({
                            type: info.Data.event,
                            detail: info.Data.eventArgs
                        });
                    }

                }

                else if (info.Command === 'action') {
                    _processSocketMessage({
                        type: info.Command,
                        detail: info.Data
                    });
                }
            }
        }
        if (_heartbeat !== undefined) {
            _startTimer();
        }
    }

    var _heartbeat, _timer, _closingTimer;

    function _startTimer() {
        _stopTimer();
        if (_config.watchdog >= 10000) {
            _timer = window.setTimeout(_socketTimeout, _config.watchdog);
        }
    }

    function _stopTimer() {
        if (_timer) {
            window.clearTimeout(_timer);
        }
    }

    function _socketTimeout() {
        if (_socket.readyState === _socket.OPEN) {
            _socket.close();
            _closingTimer = window.setTimeout(function name() {
                if (_socket.readyState === _socket.CLOSING) {
                    console.log(socketModule.MESSAGES['socketNotClosing']);
                    _socket.onclose();
                    _socket.onclose = null;
                }

            }, 1500);
        }
    }

    function _startHeartbeat() {
        if (_config.watchdog >= 10000) {
            _sendHeartbeat();
            _heartbeat = window.setInterval(_sendHeartbeat, _config.watchdog / 2);
        }
        _startTimer();
    }

    function _stopHeartbeat() {
        if (_heartbeat) {
            window.clearInterval(_heartbeat);
        }
    }

    function _sendHeartbeat() {
        if (_socket.readyState === _socket.OPEN) {
            _socket.send('ping');
        }
    }

    function _tryReconnect() {
        $.ajax({
            type: 'GET',
            url: _baseUrl + window.location.pathname,
            async: true,
            complete: function (xhr, textStatus) {
                if (textStatus === "error") {
                    window.setTimeout(_tryReconnect, 1000);
                } else {
                    _startSocket();
                    _processSocketMessage({
                        type: BreaseEvent.CONNECTION_STATE_CHANGED,
                        detail: { state: true }
                    });
                }
            }
        });
    }

    function _processSocketMessage(event) {

        socketModule.dispatchEvent(event);
    }

    function _socketError(errorId, additional) {
        var message = socketModule.MESSAGES[errorId] + ((additional) ? additional : '');
        if (message) {
            console.log(message);
        }
        _callback(false);
    }

    var socketModule = new EventDispatcher();

    socketModule.send = function (data) {
        _socket.send(data);
    };
    socketModule.start = function (callback, SocketClass, initialTimeout) {

        _callback = callback;
        _config = {
            sockets: {},
            port: window.location.port,
            host: window.location.hostname,
            watchdog: 10000
        };
        if (brease.config.watchdog !== undefined && (brease.config.watchdog === 0 || brease.config.watchdog >= 10000)) {
            _config.watchdog = brease.config.watchdog;
        }

        if (_enabled !== true) {
            _enabled = true;
            _startSocket(SocketClass, initialTimeout);
        }
    };
    socketModule.startHeartbeat = function () {
        _startHeartbeat();
    };
    socketModule.MESSAGES = {
        timedOutInitially: 'socket connection timed out!',
        success: 'socket connection established!',
        parsererror: 'could not parse server message',
        noSockets: 'WebSockets not available',
        openSocketError: 'could not open WebSocket',
        socketClosed: 'socket connection closed!',
        socketClosedBeforeSuccess: 'socket connection closed before opened --> failure!',
        socketNotClosing: 'socket not closing -> force close'
    };

    return socketModule;
});