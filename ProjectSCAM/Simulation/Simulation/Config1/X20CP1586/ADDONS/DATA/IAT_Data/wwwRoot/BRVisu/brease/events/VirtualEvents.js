/*global define*/
define(['brease/core/Utils', 'brease/events/DummyEvent', 'jquery'], function (Utils, DummyEvent) {
    /*jshint white:false*/
    'use strict';

    var VirtualEvents = {
        init: function () {

            // listener for native events
            for (var e in _events) {
                document.addEventListener(e, handleNativeEvent, true);
            }

            // jquery triggered events (especially for testing purposes)
            $document.on('click mousedown mouseup', function (e) {
                if (e.isTrigger !== undefined) {
                    triggerVirtualEvent(e.target, 'v' + e.type, e, { pointerId: 0 });
                }
            });

            // add virtual events to jquery "on/off" mechanism
            for (var i = 0; i < _virtualEventNames.length; i += 1) {
                $.event.special[_virtualEventNames[i]] = getEventObject(_virtualEventNames[i]);
            }

            _blocker.init();

            window.oncontextmenu = function (e) {
                e.preventDefault();
                e.stopPropagation();
                return false;
            };
            delete VirtualEvents.init;
            return this;
        },
        reset: function () {
            _blocker.reset();
            _blockMove = true;
        },
        getPointerId: function (nativeEvent) {
            return getPointerId(nativeEvent);
        },
        triggerVirtualEvent: function (target, eventType, nativeEvent, detail) {
            triggerVirtualEvent(target, eventType, nativeEvent, detail);
        }
    },
        _events = {
            mousedown: {
                vtype: 'vmousedown',
                device: 'mouse',
                phase: 'start'
            },
            touchstart: {
                vtype: 'vmousedown',
                device: 'touch',
                phase: 'start'
            },
            mouseup: {
                vtype: 'vmouseup',
                device: 'mouse',
                phase: 'end'
            },
            touchend: {
                vtype: 'vmouseup',
                device: 'touch',
                phase: 'end'
            },
            mousemove: {
                vtype: 'vmousemove',
                device: 'mouse',
                phase: 'move'
            },
            touchmove: {
                vtype: 'vmousemove',
                device: 'touch',
                phase: 'move'
            }
        },
        _blocker = {
            blocked: '',
            block: function (device) {
                this.blocked = device;
            },
            isBlocked: function (device) {
                return this.blocked === device;
            },
            startReset: function () {
                this.stopReset();
                this.timer = window.setTimeout(this.boundReset, 1000);
            },
            stopReset: function () {
                window.clearTimeout(this.timer);
            },
            reset: function () {
                this.stopReset();
                this.blocked = '';
            },
            init: function () {
                this.boundReset = this.reset.bind(this);
            }
        },
        _positionProps = ['clientX', 'clientY', 'pageX', 'pageY', 'screenX', 'screenY'],
        _virtualEventNames = ['vmousedown', 'vmousemove', 'vmouseup', 'vclick'],
        _pixelRatio = (window.devicePixelRatio > 1) ? window.devicePixelRatio : 1,
        _moveThreshold = _pixelRatio * 20,
        _scrollThreshold = 2,
        _start = {},
        _end = {},
        _allowed = {},
        _blockMove = true,
        $document = $(document);

    Utils.defineProperty(VirtualEvents, 'SCROLL_THRESHOLD', _scrollThreshold);
    Utils.defineProperty(VirtualEvents, 'MOVE_THRESHOLD', _moveThreshold);

    function handleNativeEvent(nativeEvent) {

        var type = nativeEvent.type,
            target = nativeEvent.target,
            event = _events[type],
            pointerId = getPointerId(nativeEvent),
            touchLength = getTouchLength(nativeEvent);

        VirtualEvents.touchLength = touchLength;
        //if (nativeEvent.type.indexOf('move') === -1) {
        //    console.log('handleNativeEvent:', { type: type, pointerId:pointerId, touchLength:touchLength }, nativeEvent);
        //}
        var trigger = eventPreprocessing(event, nativeEvent, target, pointerId, touchLength);


        if (trigger === true && _allowed[pointerId] === true) {

            if (event.vtype === 'vmouseup') {
                _end.el = getElementPosition(target), //get position before triggering vmouseup, because it can change position of target
                _end.ev = Utils.getOffsetOfEvent(nativeEvent);
            }

            triggerVirtualEvent(target, event.vtype, nativeEvent, { pointerId: pointerId });
            eventPostProcessing(event, nativeEvent, target, pointerId);
        }
    }

    function eventPreprocessing(event, nativeEvent, target, pointerId, touchLength) {
        var trigger = false;
        switch (event.phase) {

            case 'start':
                if (event.device === 'touch') {
                    _blocker.stopReset();
                    _blocker.block('mouse');
                    trigger = true;
                } else {
                    trigger = !_blocker.isBlocked('mouse');
                }
                if (touchLength > 1) {
                    _allowed[pointerId] = hasParentMultiTouch(target);
                } else {
                    _allowed[pointerId] = true;
                }
                _blockMove = false;
                break;
            case 'move':
                if (event.device === 'touch') {
                    trigger = !_blockMove;
                } else {
                    trigger = !_blocker.isBlocked('mouse') && !_blockMove;
                }
                break;
            case 'end':
                if (event.device === 'touch') {
                    trigger = true;
                } else {
                    trigger = !_blocker.isBlocked('mouse');
                }
                if (touchLength === 0) {
                    _blockMove = true;
                }
                if (touchLength === 0 && event.device === 'touch') {
                    _blocker.startReset();
                }
                break;
        }
        return trigger;
    }

    function eventPostProcessing(event, nativeEvent, target, pointerId) {
        if (event.vtype === 'vmouseup') {
            endPhase(nativeEvent, target, pointerId);
        }
        if (event.phase === 'end') {
            resetStorage(pointerId);
        }

        if (event.phase === 'start') {
            startPhase(nativeEvent, target, pointerId);
        }
    }

    function startPhase(nativeEvent, target, pointerId) {
        // set start coordinates after dispatching vmousedown 
        // because new css can move the element (e.g. because of borders)
        // and this can cause a blocking of vclick event
        _start[pointerId] = {
            el: getElementPosition(target),
            ev: Utils.getOffsetOfEvent(nativeEvent),
            target: target
        };
    }

    function endPhase(nativeEvent, target, pointerId) {
        if (_start[pointerId] !== undefined) {
            var elDiffX = Math.abs(_end.el.x - _start[pointerId].el.x),
                elDiffY = Math.abs(_end.el.y - _start[pointerId].el.y),
                evDiffX = Math.abs(_end.ev.x - _start[pointerId].ev.x),
                evDiffY = Math.abs(_end.ev.y - _start[pointerId].ev.y);

            if (elDiffX <= _scrollThreshold && elDiffY <= _scrollThreshold && evDiffX < _moveThreshold && evDiffY < _moveThreshold) {
                triggerVClick(nativeEvent, pointerId);
            } else if (evDiffX < 3 && evDiffY < 3 && _start[pointerId].target !== target) {
                triggerVClick(nativeEvent, pointerId);
            } else if (_events[nativeEvent.type].device === 'mouse' && Utils.closestWidgetElem(_start[pointerId].target) === Utils.closestWidgetElem(target)) {
                // mouse down and up event happen in the same widget
                var endPosOfInitialTarget = getElementPosition(_start[pointerId].target);
                if (Math.abs(endPosOfInitialTarget.x - _start[pointerId].el.x) < _scrollThreshold && Math.abs(endPosOfInitialTarget.y - _start[pointerId].el.y) < _scrollThreshold) {
                    // target of mousedown event did not move
                    triggerVClick(nativeEvent, pointerId);
                }
            }
        }
    }

    function triggerVClick(nativeEvent, pointerId) {
        triggerVirtualEvent(nativeEvent.target, 'vclick', nativeEvent, { pointerId: pointerId });
    }

    function resetStorage(pointerId) {
        _start[pointerId] = undefined;
    }

    function dummyMouseHandler() { }

    function getEventObject(eventType) {
        var realType = eventType.substr(1);

        return {
            setup: function () {
                $(this).on(realType, dummyMouseHandler);
            },

            teardown: function () {
                $(this).off(realType, dummyMouseHandler);
            }
        };
    }

    function getPointerId(e) {
        if (e.pointerId !== undefined) {
            return e.pointerId;
        } else {
            return (e.changedTouches) ? e.changedTouches[0].identifier : 0;
        }
    }

    function createVirtualEvent(nativeEvent, type, detail) {
        var e = $.event.fix(nativeEvent);
        e = fixPosition(e, nativeEvent, detail.pointerId);
        e.type = type;
        e.detail = detail;
        if (e.which === undefined) {
            e.which = 1;
        }
        if (type === 'vclick') {
            e.originalEvent = new DummyEvent('click', nativeEvent.target);
            Utils.transferProperties(nativeEvent, e.originalEvent, _positionProps);
            e.originalEvent.originalEvent = nativeEvent;
        }

        return e;
    }

    function fixPosition(e, nativeEvent, pointerId) {

        if (nativeEvent.type.indexOf('touch') !== -1) {

            var touch = findTouch(nativeEvent, pointerId);

            if (touch) {
                Utils.transferProperties(touch, e, _positionProps);
            }
        }
        return e;
    }

    function findTouch(nativeEvent, touchId) {

        var touch, i,
            touches = nativeEvent.touches,
            changedTouches = nativeEvent.changedTouches;

        if (changedTouches && changedTouches.length > 0) {
            for (i = 0; i < changedTouches.length; i += 1) {
                if (changedTouches[i].identifier === touchId) {
                    touch = changedTouches[i];
                    break;
                }
            }
        } else if (touches && touches.length > 0) {
            for (i = 0; i < touches.length; i += 1) {
                if (touches[i].identifier === touchId) {
                    touch = touches[i];
                    break;
                }
            }
        }

        return touch;
    }

    function hasParentMultiTouch(elem) {
        if (elem.getAttribute('data-multitouch') !== null) {
            return true;
        } else {
            var parents = $(elem).parents('[data-multitouch]');
            if (parents.length > 0) {
                return true;
            } else {
                return false;
            }
        }
    }

    function getElementPosition(el) {
        if (el && typeof el.getBoundingClientRect === 'function') {
            var pos = el.getBoundingClientRect();

            return {
                x: (pos.left !== undefined) ? pos.left : 0,
                y: (pos.top !== undefined) ? pos.top : 0
            };
        } else {
            return {
                x: 0,
                y: 0
            };
        }
    }

    function triggerVirtualEvent(target, eventType, nativeEvent, detail) {
        //if (eventType.indexOf('move') === -1) {
        //    console.log('%ctriggerVirtualEvent:' + eventType, 'color:#00cc00');
        //}
        var vE = createVirtualEvent(nativeEvent, eventType, detail);
        $(target).trigger(vE);
    }

    function getTouchLength(e) {
        var length = 0;
        if (e && e.touches) {
            length = e.touches.length;
        }
        return length;
    }

    return VirtualEvents.init();
});