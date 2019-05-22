/*global define*/
define(['brease/core/Utils'], function (Utils) {

    'use strict';

    var VisuStatus = {};

    Utils.defineProperty(VisuStatus, 'LOADED', 'LOADED');
    Utils.defineProperty(VisuStatus, 'MALFORMED', 'MALFORMED');
    Utils.defineProperty(VisuStatus, 'NOT_FOUND', 'NOT_FOUND');
    Utils.defineProperty(VisuStatus, 'ACTIVATE_FAILED', 'ACTIVATE_FAILED');

    return VisuStatus;
});