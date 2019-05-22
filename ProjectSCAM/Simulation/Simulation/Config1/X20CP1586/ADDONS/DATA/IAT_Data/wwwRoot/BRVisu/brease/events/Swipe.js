/*global define,brease*/
define(['brease/core/Utils', 'hammer'], function (Utils, Hammer) {
    /*jshint white:false*/
    'use strict';

    var EVENTS = {
        TwoFingerSwipe: 'TwoFingerSwipe'
    }, Swipe = {

        EVENTS: EVENTS,

        init: function () {

            if (swipes[EVENTS.TwoFingerSwipe] === undefined) {

                swipes[EVENTS.TwoFingerSwipe] = {
                    swipe: new Hammer.Manager(document.body),
                    recognizer: new Hammer.Swipe({ event: 'swipe2', direction: Hammer.DIRECTION_ALL, pointers: 2, threshold: brease.settings.swipe.moveThreshold, velocity: brease.settings.swipe.velocity })
                };

                swipes[EVENTS.TwoFingerSwipe].swipe.add([swipes[EVENTS.TwoFingerSwipe].recognizer]);

                swipes[EVENTS.TwoFingerSwipe].swipe.on("swipe2", function (e) {
                    var dir = '';
                    switch (e.direction) {
                        case 2:
                            dir = 'fromRight';
                            break;
                        case 4:
                            dir = 'fromLeft';
                            break;
                        case 8:
                            dir = 'fromBottom';
                            break;
                        case 16:
                            dir = 'fromTop';
                            break;
                    }

                    var fingerDistance = 0,
                        x = [],
                        y = [];

                    for (var i = 0; i < e.pointers.length; i += 1) {
                        x.push(e.pointers[i].pageX);
                        y.push(e.pointers[i].pageY);
                    }
                    if (x.length > 1) {
                        var diffX = Math.abs(x[0] - x[1]);
                        var diffY = Math.abs(y[0] - y[1]);
                        if (e.direction === 2 || e.direction === 4) {
                            fingerDistance = parseInt(diffY, 10);
                        } else {
                            fingerDistance = parseInt(diffX, 10);
                        }
                    }



                    if (dir !== '' && lock === false && (fingerDistance === 0 || fingerDistance <= brease.settings.swipe.maxFingerDistance)) {
                        lock = true;
                        var newEvent = { type: EVENTS.TwoFingerSwipe, target: e.target, detail: { direction: dir } };
                        Utils.transferProperties(e.changedPointers[0], newEvent, positionProps);
                        _dispatch(newEvent);
                        _startUnlock();
                    }
                });

            }
            return Swipe;
        },

        on: function (type, fn) {
            if (!listeners[type]) { listeners[type] = []; }
            listeners[type].push(fn);
        }
    },
    swipes = {},
    listeners = {},
    lock = false,
    lockTimer,
    positionProps = ['clientX', 'clientY', 'pageX', 'pageY', 'screenX', 'screenY'];

    function _startUnlock() {
        if (lockTimer) { clearTimeout(lockTimer); }
        lockTimer = window.setTimeout(_unlock, 300);
    }

    function _unlock() {
        lock = false;
    }

    function _dispatch(e) {
        for (var i = 0; i < listeners[e.type].length; i += 1) {
            listeners[e.type][i].call(null, e);
        }
    }

    return Swipe.init();
});