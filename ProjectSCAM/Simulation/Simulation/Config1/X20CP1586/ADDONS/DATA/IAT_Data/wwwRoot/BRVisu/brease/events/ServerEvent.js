/*global define*/
define(['brease/core/Utils'], function (Utils) {

    'use strict';

    var ServerEvent = {};

    Utils.defineProperty(ServerEvent, 'CONTENT_ACTIVATED', 'ContentActivated');
    Utils.defineProperty(ServerEvent, 'CONTENT_DEACTIVATED', 'ContentDeactivated');
    Utils.defineProperty(ServerEvent, 'SESSION_ACTIVATED', 'SessionActivated');
    Utils.defineProperty(ServerEvent, 'VISU_ACTIVATED', 'VisuActivated');
    Utils.defineProperty(ServerEvent, 'PROPERTY_VALUE_CHANGED', 'PropertyValueChanged');
    Utils.defineProperty(ServerEvent, 'USER_CHANGED', 'UserChanged');
    Utils.defineProperty(ServerEvent, 'TRANSFER_START', 'TransferStart');
    Utils.defineProperty(ServerEvent, 'TRANSFER_FINISH', 'TransferFinish');

    return ServerEvent;

});
