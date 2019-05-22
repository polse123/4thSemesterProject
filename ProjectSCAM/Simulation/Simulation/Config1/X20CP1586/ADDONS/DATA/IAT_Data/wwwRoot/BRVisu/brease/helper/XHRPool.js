/*global define*/
define(['brease/helper/XHR'], function (XHR) {

    'use strict';

    var XHRPool = {

        getXHR: function (callbackInfo) {
            var xhr;
            if (_pool.length > 0) {
                xhr = _pool.shift();
            } else {
                xhr = new XHR();
                xhr.free = _free;
            }
            xhr.callbackInfo = callbackInfo;
            return xhr;
        }

    };

    /*
    /* PRIVATE
    */
    var _pool = [],
    _free = function (xhr) {
        _pool.push(xhr);
    };

    return XHRPool;

});