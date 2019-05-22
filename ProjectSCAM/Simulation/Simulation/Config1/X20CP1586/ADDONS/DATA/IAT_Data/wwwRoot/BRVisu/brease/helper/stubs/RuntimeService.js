/*global define*/
define(['brease/events/EventDispatcher', 'brease/events/ServerEvent', 'brease/controller/objects/VisuStatus'], function (EventDispatcher, ServerEvent, VisuStatus) {

    'use strict';

    var RuntimeServiceStub = function RuntimeServiceStub(testData) {
        this.testData = {};
        for (var key in testData) {
            this.testData[key.toLowerCase()] = testData[key];
        }
    };

    RuntimeServiceStub.prototype = new EventDispatcher();
    RuntimeServiceStub.prototype.constructor = RuntimeServiceStub;

    var p = RuntimeServiceStub.prototype;

    p.loadVisuData = function (visuId, callback, callbackInfo) {
        visuId = visuId.toLowerCase();
        if (typeof callback === 'function') {
            if (this.testData && this.testData[visuId]) {
                callback({ success: true, visuData: this.testData[visuId] }, callbackInfo);
            } else {
                if (visuId === 'malformedvisu') {
                    callback({ success: false, status: 'parsererror' }, callbackInfo);
                } else {
                    callback({ success: false, status: VisuStatus.NOT_FOUND }, callbackInfo);
                }
            }
        }
    };

    p.activateVisu = function (visuId, callback, callbackInfo) {
        console.warn('activateVisu:' + visuId);

        window.setTimeout(activateVisuResponse.bind(this, callback, callbackInfo), 50);
        window.setTimeout(activateVisuEvent.bind(this, visuId), 150);
    };

    p.activateContent = function (contentId, visuId) {
        console.log('activateContent:' + contentId + ',visuId=' + visuId);
    };

    p.deactivateVisu = function (visuId) {
        console.log('deactivateVisu:' + visuId);
    };

    p.getSessionEventSubscription = function () {
        return { success: true, eventSubscriptions: [] };
    };

    p.setClientInformation = function (data) {
        console.log('%csetClientInformation:' + data, 'color:#cc00cc;');
    };

    p.sendUpdate = function (data) {
        console.log('sendUpdate:', JSON.stringify(data));
    };

    p.sendEvent = function (data) {
        console.log('sendEvent:', JSON.stringify(data));
    };

    function activateVisuResponse(callback, callbackInfo) {
        callback({ status: { code: 0 } }, callbackInfo);
    }

    function activateVisuEvent(visuId) {
        this.dispatchEvent({
            event: ServerEvent.VISU_ACTIVATED,
            detail: {
                visuId: visuId.toLowerCase()
            }
        }, ServerEvent.VISU_ACTIVATED);
    }

    return RuntimeServiceStub;

});