define(function () {

    'use strict';

    /********************************
    ***** requestAnimationFrame *****
    ********************************/
    window.requestAnimationFrame = window.requestAnimationFrame || window.mozRequestAnimationFrame || window.webkitRequestAnimationFrame || window.msRequestAnimationFrame || window.oRequestAnimationFrame;

    /**********************
    ***** CustomEvent *****
    **********************/

    function CustomEvent(event, params) {
        params = params || { bubbles: false, cancelable: false, detail: undefined };
        var evt = document.createEvent('CustomEvent');
        evt.initCustomEvent(event, params.bubbles, params.cancelable, params.detail);
        return evt;
    }

    if (window.CustomEvent) {
        CustomEvent.prototype = window.CustomEvent.prototype;
    }
    window.CustomEvent = CustomEvent;


    /**********************************
    ***** Function.prototype.bind *****
    **********************************/

    if (!Function.prototype.bind) {
        Function.prototype.bind = function (oThis) {
            if (typeof this !== "function") {
                // closest thing possible to the ECMAScript 5 internal IsCallable function
                throw new TypeError("Function.prototype.bind - what is trying to be bound is not callable");
            }

            var aArgs = Array.prototype.slice.call(arguments, 1),
                fToBind = this,
                FNOP = function () { },
                fBound = function () {
                    return fToBind.apply((this instanceof FNOP && oThis) ? this : oThis,
                                         aArgs.concat(Array.prototype.slice.call(arguments)));
                };

            FNOP.prototype = this.prototype;
            fBound.prototype = new FNOP();

            return fBound;
        };
    }

    /**********************************
    ***** Number.isInteger *****
    **********************************/
    if (!Number.isInteger) {
        Number.isInteger = function (value) {
            return typeof value === 'number' &&
              isFinite(value) &&
              Math.floor(value) === value;
        };
    }

    /**********************************
    ***** Object.keys *****
    **********************************/
    if (!Object.keys) {
        Object.keys = function (o) {
            if (o !== Object(o)) {
                throw new TypeError('Object.keys called on a non-object');
            }
            var k = [], p;
            for (p in o) {
                if (Object.prototype.hasOwnProperty.call(o, p)) {
                    k.push(p);
                }
            }
            return k;
        };
    }

    /*********************************
    ***** console.debug *****
    **********************************/
    if (console && console.log && !('debug' in console)) {
        console['debug'] = function () {
            console.log.apply(console, arguments);
        };
    }
    if (console && console.log && !('warn' in console)) {
        console['warn'] = function () {
            console.log.apply(console, arguments);
        };
    }
    if (console && console.log && !('info' in console)) {
        console['info'] = function () {
            console.log.apply(console, arguments);
        };
    }

    /*********************************
    ***** Function.name *****
    **********************************/
    if (Function.prototype.name === undefined && Object.defineProperty !== undefined) {
        Object.defineProperty(Function.prototype, 'name', {
            get: function () {
                var funcNameRegex = /function\s([^(]{1,})\(/;
                var results = (funcNameRegex).exec((this).toString());
                return (results && results.length > 1) ? results[1].trim() : "";
            },
            set: function () { }
        });
    }

    /*********************************
    ***** array.includes *****
    **********************************/
    if (!Array.prototype.includes) {
        Object.defineProperty(Array.prototype, 'includes', {
            value: function (searchElement, fromIndex) {

                // 1. Let O be ? ToObject(this value).
                if (this === null || this === undefined) {
                    throw new TypeError('"this" is null or not defined');
                }

                var o = Object(this);

                // 2. Let len be ? ToLength(? Get(O, "length")).
                var len = o.length >>> 0;

                // 3. If len is 0, return false.
                if (len === 0) {
                    return false;
                }

                // 4. Let n be ? ToInteger(fromIndex).
                //    (If fromIndex is undefined, this step produces the value 0.)
                var n = fromIndex | 0;

                // 5. If n ≥ 0, then
                //  a. Let k be n.
                // 6. Else n < 0,
                //  a. Let k be len + n.
                //  b. If k < 0, let k be 0.
                var k = Math.max(n >= 0 ? n : len - Math.abs(n), 0);

                function sameValueZero(x, y) {
                    return x === y || (typeof x === 'number' && typeof y === 'number' && isNaN(x) && isNaN(y));
                }

                // 7. Repeat, while k < len
                while (k < len) {
                    // a. Let elementK be the result of ? Get(O, ! ToString(k)).
                    // b. If SameValueZero(searchElement, elementK) is true, return true.
                    // c. Increase k by 1. 
                    if (sameValueZero(o[k], searchElement)) {
                        return true;
                    }
                    k += 1;
                }

                // 8. Return false
                return false;
            }
        });
    }

    /*********************************
    ***** string.includes *****
    **********************************/
    if (!String.prototype.includes) {
        String.prototype.includes = function (search, start) {

            if (typeof start !== 'number') {
                start = 0;
            }

            if (start + search.length > this.length) {
                return false;
            } else {
                return this.indexOf(search, start) !== -1;
            }
        };
    }

    /***************************
    ***** document.baseURI *****
    ****************************/
    if (!document.baseURI) {
        Object.defineProperty(document, 'baseURI', {
            get: function () {
                var baseTags = document.getElementsByTagName("base"),
                    baseURI = (baseTags.length > 0) ? baseTags[0].href : document.URL;
                return baseURI;
            }
        });
    }

    /***************************
    ***** Map *****
    ****************************/
    if (!window.Map) {

        window.Map = function () {
            this.items = {};
            var instance = this;
            Object.defineProperty(instance, 'size', {
                get: function () {
                    return Object.keys(instance.items).length;
                }
            });
        };

        Map.prototype.set = function (key, value) {
            this.items[key] = value;
            return this;
        };

        Map.prototype.get = function (key) {
            return this.items[key];
        };

        Map.prototype.delete = function (key) {
            var returnValue = false;
            if (this.items[key]) {
                delete this.items[key];
                returnValue = true;
            }
            return returnValue;
        };

        Map.prototype.forEach = function (fn) {
            for (var key in this.items) {
                fn(this.items[key], key);
            }
        };

    }

});