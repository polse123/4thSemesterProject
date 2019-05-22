/*global define*/
define(['brease/core/Utils', 'brease/enum/Enum'], function (Utils, Enum) {

    'use strict';

    var ErrorCode = {};

    Utils.defineProperty(ErrorCode, 'getMessageByCode', function (code, args) {
        code = '' + code;
        if (_codes[code] !== undefined) {
            var message = _codes[code].message;
            if (Array.isArray(args)) {
                for (var i = 0; i < args.length; i += 1) {
                    message = message.replace(new RegExp("\\{" + i + "\\}", "g"), args[i]);
                }
            }
            return message;
        } else {
            return _codes['GENERIC_CONNECTION_FAILED'].message;
        }
    }, false, false, false);

    Utils.defineProperty(ErrorCode, 'getLogIdByCode', function (code) {
        code = '' + code;
        if (_codes[code] !== undefined) {
            return _codes[code].logId;
        } else {
            return _codes['GENERIC_CONNECTION_FAILED'].logId;
        }
    }, false, false, false);

    Utils.defineProperty(ErrorCode, 'NO_FURTHER_SESSION', '2148073484');
    Utils.defineProperty(ErrorCode, 'MAX_CLIENTS', '2148139020');
    Utils.defineProperty(ErrorCode, 'NOT_ENOUGH_LICENSES', '2148204556');
    Utils.defineProperty(ErrorCode, 'NO_LICENSE', '2148270092');
    Utils.defineProperty(ErrorCode, 'GENERIC_CONNECTION_FAILED', 'GENERIC_CONNECTION_FAILED');

    var _codes = {
        '2148073484': {
            message: 'Visualization already open on this client, no further sessions allowed',
            logId: Enum.EventLoggerId.NO_FURTHER_SESSION
        },
        '2148139020': {
            message: 'Maximum number of clients reached!',
            logId: Enum.EventLoggerId.MAX_CLIENTS
        },
        '2148204556': {
            message: 'No more clients allowed, no client license available',
            logId: Enum.EventLoggerId.NOT_ENOUGH_LICENSES
        },
        '2148270092': {
            message: 'Not allowed, license not available for visualization (id="{0}")!',
            logId: Enum.EventLoggerId.NO_LICENSE
        },
        'GENERIC_CONNECTION_FAILED': {
            message: 'server connection (register client) error',
            logId: Enum.EventLoggerId.CLIENT_START_FAIL
        }
    };

    return ErrorCode;
});