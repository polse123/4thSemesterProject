/*global define,brease*/
define(['brease/events/EventHandler', 'brease/events/ClientSystemEvent', 'brease/events/BreaseEvent', 'brease/events/ServerEvent', 'brease/events/Swipe', 'brease/core/Utils', 'brease/events/VirtualEvents', 'brease/controller/objects/ContentStatus', 'brease/model/VisuModel'], function (EventHandler, ClientSystemEvent, BreaseEvent, ServerEvent, Swipe, Utils, VirtualEvents, ContentStatus, _visuModel) {
    /*jshint white:false*/
    'use strict';

    /**
    * @class brease.controller.EventController
    * @extends core.javascript.Object
    * Controller to handle Clientsystem Events
    * @singleton
    */
    var EventController = {

        init: function (runtimeService, bindingController, visuModel) {
            if (visuModel) {
                _visuModel = visuModel;
            }
            EventHandler.init(runtimeService, bindingController);
            _initKeyEvents();
            _initSwipeEvent();
            _initContentEvents(runtimeService);

            // revalidate events when new events are loaded
            document.body.addEventListener(BreaseEvent.EVENTBINDING_LOADED, _eventbindingLoadedHandler);

            return this;
        }
    },
    _keyDownQueue = [],
    _keyPressQueue = [],
    _swipe = {};

    function _initKeyEvents() {
        document.addEventListener('keypress', _keyPressHandler);
        document.addEventListener('keyup', _keyUpHandler);
        document.addEventListener('keydown', _keyDownHandler);
    }

    function _initSwipeEvent() {
        Swipe.on(Swipe.EVENTS.TwoFingerSwipe, function (e) {

            if (Utils.hasClass(e.target, 'breaseModalDimmer') === false) {
                _swipe.direction = e.detail.direction;
                if (VirtualEvents.touchLength <= 1) {
                    _endHandler(e);
                } else {
                    brease.bodyEl.on(BreaseEvent.MOUSE_UP, _upHandler);
                }
            }
        });
        brease.bodyEl.on(BreaseEvent.MOUSE_DOWN, _startHandler);
    }

    function _initContentEvents(runtimeService) {
        document.body.addEventListener(BreaseEvent.FRAGMENT_SHOW, _contentLoadedHandler);
        runtimeService.addEventListener(ServerEvent.CONTENT_ACTIVATED, _contentActivatedHandler);
    }

    function _startHandler(e) {
        _swipe.startPoint = { left: e.clientX, top: e.clientY };
    }

    function _getAreaForPoint(point) {

        var cpId = brease.pageController.getCurrentPage('appContainer'),
            cp = brease.pageController.getPageById(cpId),
            layout = brease.pageController.getLayoutById(cp.layout),
            areas = [];

        for (var areaId in cp.assignments) {
            var area = layout.areas[areaId];
            if (area.left <= point.left && point.left <= area.left + area.width && area.top <= point.top && point.top <= area.top + area.height) {
                areas.push(area);
            }
        }
        if (areas.length > 1) {
            areas.sort(function (a, b) { return b.zIndex - a.zIndex; });
        }
        if (areas.length > 0) {
            return areas[0].id;
        } else {
            return undefined;
        }
    }

    function _upHandler(e) {
        if (VirtualEvents.touchLength <= 1) {
            brease.bodyEl.off(BreaseEvent.MOUSE_UP, _upHandler);
            _endHandler(e);
        }
    }

    function _endHandler(e) {
        _swipe.startArea = _getAreaForPoint(_swipe.startPoint);
        _swipe.endArea = _getAreaForPoint({ left: e.clientX, top: e.clientY });
        window.setTimeout(function () {
            if (!brease.pageController.swipeNavigation(_swipe.direction)) {
                _dispatchEvent(ClientSystemEvent.SYSTEM_SWIPE, {
                    direction: _swipe.direction, areaId: (_swipe.startArea !== undefined && _swipe.startArea === _swipe.endArea) ? _swipe.startArea : ''
                });
            }
        }, 10);
    }

    function _contentLoadedHandler(e) {
        if (_events[ClientSystemEvent.CONTENT_LOADED]) {
            _events[ClientSystemEvent.CONTENT_LOADED].reValidate();
        }

        var contentId = e.detail.contentId,
            content = _visuModel.getContentById(contentId);

        //console.log('_contentLoadedHandler:', contentId, content !== undefined, ',state:' + ((content) ? content.activeState : ''));
        if (content !== undefined) {
            if (content.activeState === ContentStatus.active) {
                _dispatchEvent(ClientSystemEvent.CONTENT_LOADED, {
                    contentId: contentId, visuId: content.visuId
                });
            } else {
                _eventQueue.add(contentId);
            }
        }
    }

    var _eventQueue = {
        queue: new Map(),
        add: function (contentId) {
            this.queue.set(contentId, contentId);
        },
        contains: function (contentId) {
            return this.queue.get(contentId) !== undefined;
        },
        remove: function (contentId) {
            this.queue.delete(contentId);
        }
    };

    function _contentActivatedHandler(e) {

        if (_events[ClientSystemEvent.CONTENT_LOADED]) {
            _events[ClientSystemEvent.CONTENT_LOADED].reValidate();
        }

        var contentId = e.detail.contentId;

        if (_eventQueue.contains(contentId)) {
            _eventQueue.remove(contentId);
            var content = _visuModel.getContentById(contentId);

            //console.log('_contentActivatedHandler:', contentId, content !== undefined);
            if (content !== undefined) {
                _dispatchEvent(ClientSystemEvent.CONTENT_LOADED, {
                    contentId: contentId, visuId: content.visuId
                });
            }
        }
    }

    function _keyDownHandler(e) {

        if (e.key !== undefined && _keyDownQueue.indexOf(e.key) === -1) {

            var keyCode = _keyCode(e);
            if (keyCode !== undefined) {

                _keyDownQueue.push(e.key);
                _dispatchEvent(ClientSystemEvent.KEY_DOWN, { key: e.key, keyASCII: keyCode });
            }
        }
    }

    function _keyPressHandler(e) {

        if (e.key !== undefined && _keyPressQueue.indexOf(e.key) === -1) {

            var keyCode = _keyCode(e);
            if (keyCode !== undefined) {

                _keyPressQueue.push(e.key);
                _dispatchEvent(ClientSystemEvent.KEY_PRESS, { key: e.key, keyASCII: keyCode });
            }
        }
    }

    function _keyUpHandler(e) {

        if (e.key !== undefined) {

            _removeFromQueue(_keyDownQueue, e.key);
            _removeFromQueue(_keyPressQueue, e.key);

            var keyCode = _keyCode(e);
            if (keyCode !== undefined) {
                _dispatchEvent(ClientSystemEvent.KEY_UP, { key: e.key, keyASCII: keyCode });
            }
        }
    }

    var _events = {};

    function _dispatchEvent(type, args) {
        if (_events[type] !== undefined) {
            _events[type].setEventArgs(args);
        } else {
            _events[type] = new EventHandler('clientSystem.Event', null, type, args, brease.appElem);
        }
        _events[type].dispatch();
    }

    function _eventbindingLoadedHandler() {
        for (var type in _events) {
            _events[type].reValidate();
        }
    }

    function _removeFromQueue(queue, key) {
        var index = queue.indexOf(key);
        if (index !== -1) {
            queue.splice(index, 1);
        }
    }

    function _keyCode(e) {

        if (e.key !== undefined && e.key.length === 1) {
            return e.key.charCodeAt(0);
        }
        else if (e.which !== undefined) {
            return e.which;
        }
        else {
            return e.keyCode;
        }
    }

    return EventController;

});