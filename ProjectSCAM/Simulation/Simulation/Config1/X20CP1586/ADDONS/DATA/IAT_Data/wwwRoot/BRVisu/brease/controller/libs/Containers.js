/*global define,brease,CustomEvent*/
define(['brease/events/BreaseEvent'], function (BreaseEvent) {

    'use strict';

    /**
    * @class brease.controller.libs.Containers
    * @extends Object
    * @singleton
    */

    var controller = {

        getCurrentPage: function (containerId) {
            return _getContainer(containerId).currentPage;
        },

        setCurrentPage: function (containerId, pageId) {
            var container = _getContainer(containerId);
            container.currentPage = pageId;
        },

        setLatestRequest: function (containerId, pageId) {
            var container = _getContainer(containerId);
            container.latestRequest = pageId;
            container.status = 'active';
        },

        getLatestRequest: function (containerId) {
            return _getContainer(containerId).latestRequest;
        },

        dispose: function (containerId) {
            if (_containers[containerId] !== undefined) {
                _containers[containerId].status = 'disposed';
            }
        },

        getContainerForPage: function (pageId) {
            var containerId;
            for (var cId in _containers) {
                if (_containers[cId].currentPage === pageId) {
                    containerId = cId;
                    break;
                }
            }
            return containerId;
        },

        resetCurrentPage: function (containerId) {
            if (_containers[containerId] !== undefined) {
                _containers[containerId].currentPage = undefined;
            }
        },

        resetCurrentPages: function (containerId) {
            var collection = $('#' + containerId).find('.LayoutArea');
            for (var i = 0, len = collection.length; i < len; i += 1) {
                controller.resetCurrentPage(collection[i].id);
            }
            if ($('#' + containerId).hasClass('LayoutArea')) {
                controller.resetCurrentPage(containerId);
            }
        },

        initPageLoadEvent: function (containerId, pageId, contentsToLoad, embedded) {
            new PageLoadEvent(_getContainer(containerId), pageId, contentsToLoad, embedded);
        }
    },
    _containers = {};

    function _getContainer(containerId) {
        if (_containers[containerId] === undefined) {
            _containers[containerId] = { id: containerId, status: 'active' };
        }
        return _containers[containerId];
    }

    // internal object PageLoadEvent

    var PageLoadEvent = function (container, pageId, contentsToLoad, embedded) {
        this.container = container;
        this.pageId = pageId;
        this.contentsToLoad = _getContentsToLoad(contentsToLoad);
        this.embedded = embedded;
        this.boundListener = this.activatedListener.bind(this);
        document.body.addEventListener(BreaseEvent.CONTENT_ACTIVATED, this.boundListener);
        this.check();
    };

    PageLoadEvent.prototype.activatedListener = function (e) {
        var index = this.contentsToLoad.indexOf(e.detail.contentId);
        if (index > -1 && this.contentsToLoad.length > 0) {
            this.contentsToLoad.splice(index, 1);
        }
        this.check();
    };

    PageLoadEvent.prototype.check = function () {
        if (this.container && this.container.status === 'active' && this.pageId === controller.getLatestRequest(this.container.id)) {

            if (this.contentsToLoad.length === 0) {
                _dispatch(this.pageId, this.container.id);
                if (Array.isArray(this.embedded)) {
                    for (var i = 0; i < this.embedded.length; i += 1) {
                        _dispatch(this.embedded[i].pageId, this.embedded[i].containerId);
                    }
                }
                this.dispose();
            }

        } else {
            this.dispose();
        }
    };

    PageLoadEvent.prototype.dispose = function () {
        this.container = null;
        this.contentsToLoad = null;
        this.embedded = null;
        document.body.removeEventListener(BreaseEvent.CONTENT_ACTIVATED, this.boundListener);
    };

    function _getContentsToLoad(arContent) {
        var contentsToLoad = [];
        for (var i = 0; i < arContent.length; i += 1) {
            if (brease.uiController.bindingController.isContentActive(arContent[i]) !== true) {
                contentsToLoad.push(arContent[i]);
            }
        }
        return contentsToLoad;
    }

    function _dispatch(pageId, containerId) {
        brease.appElem.dispatchEvent(new CustomEvent(BreaseEvent.PAGE_LOADED, { bubbles: true, cancelable: true, detail: { pageId: pageId, containerId: containerId } }));
    }

    return controller;
});