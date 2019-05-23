/*global define*/
define(function () {
    /*jshint white:false*/
    'use strict';

    var ScrollManager = {

        ADD_TIMEOUT: 50,
        REFRESH_TIMEOUT: 50,
        FAIL_TIMEOUT: 1000,

        init: function (scrollHelper, failTimeout, addTimeout, refreshTimeout) {
            _scrollHelper = scrollHelper;
            if (failTimeout > 0) {
                this.FAIL_TIMEOUT = failTimeout;
            }
            if (addTimeout > 0) {
                this.ADD_TIMEOUT = addTimeout;
            }
            if (refreshTimeout > 0) {
                this.REFRESH_TIMEOUT = refreshTimeout;
            }
        },

        refresh: function (elemId) {
            var item = _getItem(elemId);

            if (item) {
                if (item.refreshTimer) {
                    window.clearTimeout(item.refreshTimer);
                }
                var elem = document.getElementById(elemId);

                if (elem) {
                    if (elem.firstChild && _isSuitableChild(elem.firstChild) && elem.firstChild.scrollHeight > 0) {
                        _refresh(elemId, elem.firstChild);
                    } else {
                        item.refreshTimer = window.setTimeout(ScrollManager.refresh.bind(ScrollManager, elemId), this.REFRESH_TIMEOUT);
                    }
                } else {
                    _clear(elemId);
                }
            }
        },

        remove: function (elemId) {
            var item = _getItem(elemId);

            if (item) {
                if (item.addTimer) {
                    window.clearTimeout(item.addTimer);
                }
                if (item.refreshTimer) {
                    window.clearTimeout(item.refreshTimer);
                }
                if (item.scroller !== undefined) {
                    item.scroller.destroy();
                    item.scroller = undefined;
                }
                _clear(elemId);
            }
        },

        add: function (elem) {

            if (_isSuitable(elem) === false) {
                console.iatWarn('element not suitable for adding a Scroller!');
            } else if (this.hasScroller(elem) === true) {
                console.iatWarn('element has already a Scroller!');
            } else {
                var item = _init(elem.id);

                if (item.addTimer) {
                    window.clearTimeout(item.addTimer);
                }
                if (_isReady(elem)) {
                    _addScroller(elem);
                } else {
                    if (Date.now() - item.startTime < this.FAIL_TIMEOUT) {
                        item.addTimer = window.setTimeout(this.add.bind(this, elem), this.ADD_TIMEOUT);
                    } else {
                        _timeout(elem);
                    }
                }
            }
        },

        hasScroller: function (elem) {
            return (_private[elem.id] !== undefined && _private[elem.id].scroller !== undefined);
        },

        scrollTo: function (elemId, top, left) {
            if (_private[elemId] && _private[elemId].scroller) {
                _private[elemId].scroller.scrollTo(top, left);
            }
        }
    };

    var _private = {},
        _scrollHelper;

    function _isSuitable(elem) {
        return !elem === false && !elem.id === false && !elem.firstChild === false;
    }

    function _isReady(elem) {
        return (elem.scrollHeight > 0 && elem.firstChild.scrollHeight > 0);
    }

    function _addScroller(elem) {
        _private[elem.id].scroller = _scrollHelper.addScrollbars(elem, { mouseWheel: true, tap: true, scrollX: true, scrollY: true }, true);
        _private[elem.id].addTimer = undefined;
    }

    function _timeout(elem) {
        _clear(elem.id);
        console.iatWarn('add scroller timed out: ' + elem.id);
    }

    function _clear(elemId) {
        _private[elemId] = undefined;
    }

    function _init(id) {
        if (!_private[id]) {
            _private[id] = {
                startTime: Date.now()
            };
        }
        return _private[id];
    }

    function _getItem(id) {
        return _private[id];
    }

    function _refresh(id, firstChild) {
        if (_private[id].scroller !== undefined) {
            _private[id].scroller.scroller = firstChild;
            _private[id].scroller.scrollerStyle = firstChild.style;
            _private[id].scroller.refresh();
        }
        _private[id].refreshTimer = undefined;
    }

    function _isSuitableChild(elem) {

        return elem.className.indexOf('systemContentLoader') !== -1 || elem.className.indexOf('breaseLayout') !== -1 || elem.className.indexOf('ScrollBox') !== -1;
    }

    return ScrollManager;

});