﻿/*global define*/
define(['brease/core/Utils', 'brease/enum/Enum'], function (Utils, Enum) {

    'use strict';

    var LogCode = function () { };
    LogCode.prototype.getConfig = function (code) {
        return logs[code];
    };
    var instance = new LogCode();

    Utils.defineProperty(instance, 'PAGE_NOT_FOUND', 'PAGE_NOT_FOUND');
    Utils.defineProperty(instance, 'PAGE_IS_CURRENT', 'PAGE_IS_CURRENT');
    Utils.defineProperty(instance, 'PAGE_NOT_CURRENT', 'PAGE_NOT_CURRENT');
    Utils.defineProperty(instance, 'CONTAINER_NOT_FOUND', 'CONTAINER_NOT_FOUND');
    Utils.defineProperty(instance, 'DIALOG_NOT_FOUND', 'DIALOG_NOT_FOUND');
    Utils.defineProperty(instance, 'NO_PAGES_FOUND', 'NO_PAGES_FOUND');
    Utils.defineProperty(instance, 'NO_LAYOUTS_FOUND', 'NO_LAYOUTS_FOUND');
    Utils.defineProperty(instance, 'LAYOUT_NOT_FOUND', 'LAYOUT_NOT_FOUND');
    Utils.defineProperty(instance, 'CONTENT_NOT_FOUND', 'CONTENT_NOT_FOUND');
    Utils.defineProperty(instance, 'CONTENT_IS_ACTIVE', 'CONTENT_IS_ACTIVE');
    Utils.defineProperty(instance, 'AREA_NOT_FOUND', 'AREA_NOT_FOUND');
    Utils.defineProperty(instance, 'NO_VISUDATA_FOUND', 'NO_VISUDATA_FOUND');
    Utils.defineProperty(instance, 'THEME_NOT_FOUND', 'THEME_NOT_FOUND');
    Utils.defineProperty(instance, 'VISU_MALFORMED', 'VISU_MALFORMED');
    Utils.defineProperty(instance, 'VISU_NOT_FOUND', 'VISU_NOT_FOUND');
    Utils.defineProperty(instance, 'VISU_ACTIVATE_FAILED', 'VISU_ACTIVATE_FAILED');



    var logs = {
        PAGE_NOT_FOUND: {
            code: Enum.EventLoggerId.CLIENT_PAGE_NOT_FOUND,
            messageKey: 'brease.error.STARTPAGE_NOT_FOUND',
            severity: Enum.EventLoggerSeverity.WARNING,
            verboseLevel: Enum.EventLoggerVerboseLevel.OFF
        },
        CONTAINER_NOT_FOUND: {
            code: Enum.EventLoggerId.CLIENT_PAGE_NOT_FOUND,
            messageKey: 'brease.error.STARTPAGE_NOT_FOUND',
            severity: Enum.EventLoggerSeverity.WARNING,
            verboseLevel: Enum.EventLoggerVerboseLevel.LOW
        },
        DIALOG_NOT_FOUND: {
            code: Enum.EventLoggerId.CLIENT_DIALOG_NOT_FOUND,
            severity: Enum.EventLoggerSeverity.WARNING,
            verboseLevel: Enum.EventLoggerVerboseLevel.LOW
        },
        NO_PAGES_FOUND: {
            code: Enum.EventLoggerId.CLIENT_NO_PAGES_FOUND,
            messageKey: 'brease.error.NO_PAGES_FOUND',
            severity: Enum.EventLoggerSeverity.WARNING,
            verboseLevel: Enum.EventLoggerVerboseLevel.LOW
        },
        NO_LAYOUTS_FOUND: {
            code: Enum.EventLoggerId.CLIENT_NO_LAYOUTS_FOUND,
            messageKey: 'brease.error.NO_LAYOUTS_FOUND',
            severity: Enum.EventLoggerSeverity.WARNING,
            verboseLevel: Enum.EventLoggerVerboseLevel.LOW
        },
        VISU_MALFORMED: {
            code: Enum.EventLoggerId.CLIENT_INCORRECT_VISU,
            messageKey: 'brease.error.INCORRECT_VISU',
            severity: Enum.EventLoggerSeverity.WARNING,
            verboseLevel: Enum.EventLoggerVerboseLevel.LOW
        },
        VISU_NOT_FOUND: {
            code: Enum.EventLoggerId.CLIENT_VISU_NOT_FOUND,
            messageKey: 'brease.error.VISU_NOT_FOUND',
            severity: Enum.EventLoggerSeverity.WARNING,
            verboseLevel: Enum.EventLoggerVerboseLevel.LOW
        },
        LAYOUT_NOT_FOUND: {
            code: Enum.EventLoggerId.CLIENT_LAYOUT_NOT_FOUND,
            messageKey: 'brease.error.LAYOUT_NOT_FOUND',
            severity: Enum.EventLoggerSeverity.WARNING,
            verboseLevel: Enum.EventLoggerVerboseLevel.LOW
        },
        CONTENT_NOT_FOUND: {
            code: Enum.EventLoggerId.CLIENT_CONTENT_NOT_FOUND,
            severity: Enum.EventLoggerSeverity.WARNING,
            verboseLevel: Enum.EventLoggerVerboseLevel.OFF
        },
        CONTENT_IS_ACTIVE: {
            code: Enum.EventLoggerId.CLIENT_CONTENT_IS_ACTIVE,
            severity: Enum.EventLoggerSeverity.WARNING,
            verboseLevel: Enum.EventLoggerVerboseLevel.OFF
        },
        AREA_NOT_FOUND: {
            code: Enum.EventLoggerId.CLIENT_AREA_NOT_FOUND,
            severity: Enum.EventLoggerSeverity.WARNING,
            verboseLevel: Enum.EventLoggerVerboseLevel.OFF
        },
        PAGE_NOT_CURRENT: {
            code: Enum.EventLoggerId.CLIENT_PAGE_NOT_CURRENT,
            severity: Enum.EventLoggerSeverity.WARNING,
            verboseLevel: Enum.EventLoggerVerboseLevel.LOW
        },
        THEME_NOT_FOUND: {
            code: Enum.EventLoggerId.CLIENT_THEME_NOT_FOUND,
            severity: Enum.EventLoggerSeverity.WARNING,
            verboseLevel: Enum.EventLoggerVerboseLevel.LOW
        },
        VISU_ACTIVATE_FAILED: {
            messageKey: 'brease.error.ACTIVATE_VISU_FAILED'
        }
    };

    return instance;
});