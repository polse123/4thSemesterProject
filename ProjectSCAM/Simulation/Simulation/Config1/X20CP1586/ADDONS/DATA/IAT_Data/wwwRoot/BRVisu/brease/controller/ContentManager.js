/*global define,CustomEvent*/
define(['brease/events/BreaseEvent', 'brease/events/ServerEvent', 'brease/core/Utils', 'brease/model/VisuModel', 'brease/controller/objects/ContentStatus'], function (BreaseEvent, ServerEvent, Utils, VisuModel, ContentStatus) {

    'use strict';

    /**
    * @class brease.controller.ContentManager
    * @extends Object
    * @singleton
    */

    var controller = {

        init: function (runtimeService) {

            runtimeService.addEventListener(ServerEvent.CONTENT_ACTIVATED, _contentActivatedHandler);
            runtimeService.addEventListener(ServerEvent.CONTENT_DEACTIVATED, _contentDeactivatedHandler);
        },

        getContent: function (contentId) {
            return _getContent(contentId);
        },

        setBindingLoadState: function (contentId, flag) {
            _getContent(contentId).bindingsLoaded = flag;
        },

        isBindingLoaded: function (contentId) {
            var content = _getContent(contentId);
            return (content !== undefined && content.bindingsLoaded === true);
        },

        setActiveState: function (contentId, state) {
            var content = _getContent(contentId);
            if (content) {
                content.activeState = state;
            }
        },

        getActiveState: function (contentId) {
            var content = _getContent(contentId);
            if (content) {
                return _getContent(contentId).activeState;
            } else {
                return ContentStatus.notExistent;
            }
        },

        isContentActive: function (contentId) {
            var content = _getContent(contentId);
            return (content !== undefined && content.activeState === ContentStatus.active);
        },

        allActive: function (contents) {
            var active = true;
            for (var i = 0; i < contents.length; i += 1) {
                active = active && this.isContentActive(contents[i]);
            }
            return active;
        },

        setLatestRequest: function (contentId, request) {
            var content = _getContent(contentId);
            if (content) {

                if (request === 'activate') {
                    content.count += 1;
                }
                content.latestRequest = contentId + '[' + content.count + ']' + request;
            }
            return content;
        },

        getLatestRequest: function (contentId) {
            var content = _getContent(contentId);
            if (content) {
                return _getContent(contentId).latestRequest;
            } else {
                return undefined;
            }
        },

        setActivateDeferred: function (contentId, deferred) {
            _getContent(contentId).activateDeferred = deferred;
        },

        setDeactivateDeferred: function (contentId, deferred) {
            _getContent(contentId).deactivateDeferred = deferred;
        },

        addVirtualContent: function (contentId, visuId) {
            if (_getContent(contentId) === undefined) {
                var content = {
                    id: contentId,
                    virtual: true,
                    visuId: visuId
                };
                _initializeContent(content);
                VisuModel.addContent(contentId, content);
            }
        }
    };

    function _contentActivatedHandler(e) {
        var content = _getContent(e.detail.contentId);
        if (content && content.activeState > ContentStatus.initialized) {
            controller.setActiveState(e.detail.contentId, ContentStatus.active);
            if (content.activateDeferred !== undefined) {
                content.activateDeferred.resolve(content.id);
                content.activateDeferred = undefined;
            }
            document.body.dispatchEvent(new CustomEvent(BreaseEvent.INITIAL_VALUE_CHANGE_FINISHED, { detail: { contentId: content.id } }));
            document.body.dispatchEvent(new CustomEvent(BreaseEvent.CONTENT_ACTIVATED, { detail: { contentId: content.id } }));
        }
    }

    function _contentDeactivatedHandler(e) {
        var content = _getContent(e.detail.contentId);
        if (content && content.activeState < ContentStatus.initialized) {
            if (content.deactivateDeferred !== undefined) {
                content.deactivateDeferred.resolve(content.id);
                content.deactivateDeferred = undefined;
            }
        }
    }

    function _getContent(contentId) {
        var content = VisuModel.getContentById(contentId);
        if (content !== undefined && content.state === undefined) {
            _initializeContent(content);
        }
        return content;
    }

    function _initializeContent(content) {
        content.state = ContentStatus.initialized;
        content.count = 0;
    }

    return controller;
});