/*global define*/
define(['brease/core/Utils'], function (Utils) {

    'use strict';

    var ContentStatus = {};

    Utils.defineProperty(ContentStatus, 'notExistent', -2);
    Utils.defineProperty(ContentStatus, 'deactivated', -1);
    Utils.defineProperty(ContentStatus, 'initialized', 0);
    Utils.defineProperty(ContentStatus, 'activatePending', 1);
    Utils.defineProperty(ContentStatus, 'active', 2);

    return ContentStatus;
});