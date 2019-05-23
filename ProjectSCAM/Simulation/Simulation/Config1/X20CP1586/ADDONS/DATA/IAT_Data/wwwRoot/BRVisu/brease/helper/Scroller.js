/*global define,console,_*/
define(['libs/iscroll-probe', 'brease/core/Utils', 'brease/events/BreaseEvent'], function (IScroll, Utils, BreaseEvent) {

    'use strict';
    /**
	* @class brease.helper.Scroller
	* @extends core.javascript.Object
    * 
    * @singleton
    */
    var Scroller = {

        init: function (popupManager) {
            if (popupManager !== undefined && typeof popupManager.update === 'function') {
                _popupManager = popupManager;
            }
            IScroll.prototype.breaseUpdateZoomFactor = function () {
                this.zoomFactor = Utils.getScaleFactor(this.wrapper);
            };
        },

        /**
        * @method addScrollbars
        * Method to add scrollbars to an area.
        * @param {HTMLElement/Selector} selector
        * @param {Object} options
        * @param {Boolean} noObserver (optional)
        * if set true, no MutationObserver is used
        */
        addScrollbars: function (selector, options, noObserver) {
            var wrapper = typeof selector === 'string' ? document.querySelector(selector) : selector,
                scroller;
            if (wrapper !== null) {
                scroller = new IScroll(wrapper, _settings(options));
                scroller.zoomFactor = Utils.getScaleFactor(wrapper);
                scroller.on('beforeScrollStart', function () { _start(this); });
                scroller.on('scrollEnd', function () { _stop(); });
                scroller.on('scrollCancel', function () { _stop(); });
                scroller.on('destroy', function () {
                    document.body.removeEventListener(BreaseEvent.APP_RESIZE, this.boundUpdateZoomFactor);
                });
                scroller.boundUpdateZoomFactor = scroller.breaseUpdateZoomFactor.bind(scroller);
                document.body.addEventListener(BreaseEvent.APP_RESIZE, scroller.boundUpdateZoomFactor);
                _popupManager.update();
                if (noObserver !== true) {
                    addObserver(wrapper, scroller);
                }
            } else {
                scroller = {
                    on: function () { warn(selector); },
                    off: function () { },
                    refresh: function () { },
                    scrollToElement: function () { },
                    scrollTo: function () { },
                    scrollBy: function () { },
                    destroy: function () { },
                    enable: function () { },
                    disable: function () { },
                    wrapper: {}
                };
            }
            return scroller;
        }

    },
    _safe = {
        scroller: {}
    },
    _popupManager = {
        update: function () { }
    },
    _defaults = {};
    Utils.defineProperty(_defaults, 'bounce', false);
    Utils.defineProperty(_defaults, 'fadeScrollbars', false);
    Utils.defineProperty(_defaults, 'momentum', true);
    Utils.defineProperty(_defaults, 'mouseWheel', false);
    Utils.defineProperty(_defaults, 'resizeScrollbars', true);
    Utils.defineProperty(_defaults, 'scrollbars', 'custom');

    // fix for iScroll/Chrome 55 issue (A&P 512800)
    Utils.defineProperty(_defaults, 'disableTouch', false);
    Utils.defineProperty(_defaults, 'disableMouse', false);
    Utils.defineProperty(_defaults, 'disablePointer', true);

    // against fuzzy zoomed content in chrome (A&P 517465)
    Utils.defineProperty(_defaults, 'HWCompositing', false);

    Utils.defineProperty(Scroller, 'defaults', _defaults);

    function _settings(options) {
        var settings = $.extend({}, Scroller.defaults, options);
        settings.disableTouch = false;
        settings.disableMouse = false;
        settings.disablePointer = true;
        settings.HWCompositing = false;
        return settings;
    }

    function _start(scroller) {
        var id = $(scroller.wrapper).closest("[id]")[0].id;

        _safe.scroller[id] = scroller;

        for (var key in _safe.scroller) {
            if (_safe.scroller[key] !== scroller) {
                if ($.contains(scroller.wrapper, _safe.scroller[key].wrapper)) {
                    scroller.disable();
                    break;
                }
            }
        }
    }

    function _stop() {
        if (_safe.stopped !== true) {
            _safe.stopped = true;
            window.setTimeout(function () {
                for (var key in _safe.scroller) {
                    var scroller = _safe.scroller[key];
                    if (!scroller.enabled) {
                        scroller.initiated = 0;
                        scroller.enable();
                    }
                }
                _safe.scroller = {};
                _safe.stopped = false;
            }, 0);
        }
    }

    function addObserver(HTMLnode, scroller) {
        if (typeof MutationObserver === 'function') {
            var observer = new MutationObserver(handleMutations);

            observer.debouncedRefresh = _.debounce(_refresh.bind(null, scroller, observer), 300);
            observer.observe(HTMLnode, { childList: true, subtree: true });
        }
    }

    function _refresh(scroller, observer) {
        if (scroller.wrapper && scroller.wrapper.ownerDocument === document) {
            scroller.refresh();
        }
        observer.disconnect();
        observer.debouncedRefresh = null;
    }

    function handleMutations(mutations, observer) {
        var refresh = false;

        mutations.forEach(function (mutation) {
            if (mutation.addedNodes.length > 0) {
                refresh = true;
            }
        });
        if (refresh) {
            observer.debouncedRefresh();
        }
    }

    function warn(selector) {
        console.iatWarn('trying to add a scroller to a null object:' + selector);
    }

    return Scroller;
});