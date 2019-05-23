/*global define*/
define(['brease/core/Utils'], function (Utils) {

    'use strict';

    var ClientSystemEvent = {};

    Utils.defineProperty(ClientSystemEvent, 'CONTENT_LOADED', 'ContentLoaded');
    Utils.defineProperty(ClientSystemEvent, 'SYSTEM_SWIPE', 'SystemSwipe');
    Utils.defineProperty(ClientSystemEvent, 'KEY_DOWN', 'KeyDown');
    Utils.defineProperty(ClientSystemEvent, 'KEY_PRESS', 'KeyPress');
    Utils.defineProperty(ClientSystemEvent, 'KEY_UP', 'KeyUp');
    Utils.defineProperty(ClientSystemEvent, 'LOGIN_SUCCESS', 'LoginSuccess');
    Utils.defineProperty(ClientSystemEvent, 'LOGIN_FAILED', 'LoginFailed');

    return ClientSystemEvent;

});
