﻿/*global define,brease,CustomEvent*/
define(['brease/events/BreaseEvent', 'brease/enum/Enum', 'brease/objects/Subscription', 'brease/controller/objects/ContentStatus'], function (BreaseEvent, Enum, Subscription, ContentStatus) {

    'use strict';


    var BindingLoader = {

        init: function (runtimeService, bindingModel, contentManager) {
            _runtimeService = runtimeService;
            _bindingModel = bindingModel;
            _contentManager = contentManager;
        },

        startListen: function () {
            document.body.addEventListener(BreaseEvent.VISU_ACTIVATED, _visuActivatedListener);
            document.body.addEventListener(BreaseEvent.VISU_DEACTIVATED, _visuActivatedListener);
        },

        loadSubscriptions: function (contentId, deferred) {
            var content = _contentManager.setLatestRequest(contentId, 'loadSubscriptions');
            if (content) {
                if (_contentManager.isBindingLoaded(contentId) !== true) {
                    $.when(
                        _loadBindingSubscriptions(contentId, content.latestRequest),
                        _loadEventBindingSubscriptions(contentId, content.latestRequest))
                    .then(function () {
                        if (_contentManager.getActiveState(contentId) > ContentStatus.initialized) {
                            _contentManager.setBindingLoadState(contentId, true);
                            window.performanceMonitor.profile('activateContent - ' + contentId + '', 1);
                            deferred.resolve(contentId);
                        }
                    });

                } else {
                    window.performanceMonitor.profile('activateContent - ' + contentId + '', 1);
                    deferred.resolve(contentId);
                }
            } else {
                deferred.resolve(contentId);
            }
            return deferred.promise();
        }

    }, _runtimeService, _bindingModel, _contentManager;

    function _loadBindingSubscriptions(contentId, requestId) {
        var deferred = $.Deferred(),
            content = _contentManager.getContent(contentId);
        if (content) {
            window.performanceMonitor.profile('loadBindingSubscriptions - ' + contentId + '', 0);
            _runtimeService.getSubscription(contentId, content.visuId, _loadBindingSubscriptions_responseHandler, { requestId: requestId, contentId: contentId, deferred: deferred });
        } else {
            deferred.resolve(contentId);
        }
        return deferred.promise();
    }

    function _loadEventBindingSubscriptions(contentId, requestId) {
        var deferred = $.Deferred(),
            content = _contentManager.getContent(contentId);
        if (content) {
            window.performanceMonitor.profile('loadEventBindingSubscriptions - ' + contentId + '', 0);
            _runtimeService.getEventSubscription(contentId, content.visuId, _loadEventBindingSubscriptions_responseHandler, { requestId: requestId, contentId: contentId, deferred: deferred });
        } else {
            deferred.resolve(contentId);
        }
        return deferred.promise();

    }

    function _loadBindingSubscriptions_responseHandler(response, callbackInfo) {

        //console.log('getSubscription,response:', response, callbackInfo);
        if (callbackInfo.requestId === _contentManager.getLatestRequest(callbackInfo.contentId)) {
            if (response.success === true && Array.isArray(response.subscriptions)) {

                for (var i = 0, l = response.subscriptions.length; i < l; i += 1) {
                    _bindingModel.addSubscription(Subscription.fromServerData(response.subscriptions[i], callbackInfo.contentId));
                }

            } else {
                console.iatInfo('no subscription for content "' + callbackInfo.contentId + '" available!');
                brease.loggerService.log(Enum.EventLoggerId.CLIENT_BINDING_ID_NOTFOUND, Enum.EventLoggerCustomer.BUR, Enum.EventLoggerVerboseLevel.LOW, Enum.EventLoggerSeverity.WARNING, [callbackInfo.contentId]);
            }
            document.body.dispatchEvent(new CustomEvent(BreaseEvent.BINDING_LOADED, { detail: { contentId: callbackInfo.contentId } }));
            window.performanceMonitor.profile('loadSubscriptions - ' + callbackInfo.contentId + '', 1);
            callbackInfo.deferred.resolve();
        } else {
            console.iatWarn('loadSubscriptions for content "' + callbackInfo.contentId + '" aborted!');
        }
    }

    function _loadEventBindingSubscriptions_responseHandler(response, callbackInfo) {
        //console.log('getEventSubscription,response:', response, callbackInfo);

        if (callbackInfo.requestId === _contentManager.getLatestRequest(callbackInfo.contentId)) {
            if (response.success === true && Array.isArray(response.eventSubscriptions)) {
                _addEventSubscriptions(callbackInfo.contentId, response.eventSubscriptions);

            } else {
                console.iatInfo('no event subscription for content "' + callbackInfo.contentId + '" available!');
            }
            document.body.dispatchEvent(new CustomEvent(BreaseEvent.EVENTBINDING_LOADED, { detail: { contentId: callbackInfo.contentId } }));
            window.performanceMonitor.profile('loadEventBindingSubscriptions - ' + callbackInfo.contentId, 1);
            callbackInfo.deferred.resolve();

        } else {
            console.iatWarn('loadEventSubscription for content "' + callbackInfo.contentId + '" aborted!');
        }
    }

    function _addEventSubscriptions(scopeId, subscriptions) {
        var sl = subscriptions.length,
            subscription;

        if (sl > 0) {

            for (var i = 0; i < sl; i += 1) {
                subscription = subscriptions[i];
                if (subscription.refId !== undefined) {
                    _bindingModel.addEventSubscription({
                        scopeId: scopeId,
                        elemId: subscription.refId,
                        eventId: subscription.refId,
                        event: subscription.event
                    });
                } else {
                    _bindingModel.addSessionEventSubscription({
                        scopeId: scopeId,
                        event: subscription.event
                    }, scopeId);
                }

            }
        }
    }

    function _loadSessionEventSubscriptions_responseHandler(response) {

        if (response.success === true && Array.isArray(response.eventSubscriptions)) {
            for (var i = 0; i < response.eventSubscriptions.length; i += 1) {
                _bindingModel.addSessionEventSubscription(response.eventSubscriptions[i], '_client');
            }

        } else {
            console.iatInfo('no event subscription for session available!');
        }
    }

    function _visuActivatedListener() {
        _runtimeService.getSessionEventSubscription(_loadSessionEventSubscriptions_responseHandler);
    }

    return BindingLoader;
});