/*global define,console*/
define(['brease/objects/Response'], function (Response) {

    'use strict';

    var XHR = function () {

        try {
            this.xhr = new XMLHttpRequest();
            this.ontimeout = _ontimeout.bind(this);
            this.onreadystatechange = _onreadystatechange.bind(this);
        } catch (e) {
            console.log('XMLHttpRequest not supported!');
            return null;
        }
    };

    XHR.prototype.open = function open(type, url) {
        this.xhr.open(type, url, true);
        this.xhr.setRequestHeader("Content-Type", "application/json");
        this.xhr.setRequestHeader("Cache-Control", "no-cache");
        this.xhr.setRequestHeader("Accept", "*/*");
        this.xhr.ontimeout = this.ontimeout;
        this.xhr.onreadystatechange = this.onreadystatechange;
    };

    XHR.prototype.send = function send(data, callback) {
        this.callback = callback;
        this.xhr.send(data);
    };

    function _onreadystatechange() {
        if (this.xhr.readyState !== XMLHttpRequest.DONE) {
            return;
        }
        if (this.xhr.status === XMLHttpRequest.UNSENT) {
            console.log('%chttp status 0 for server connection!', 'color:#fa00f1;');
            return;
        }
        this.xhr.ontimeout = null;
        this.xhr.onreadystatechange = null;
        if (typeof this.callback === 'function') {
            
            this.callback(Response.fromXHR(this.xhr), this.callbackInfo);
            this.callback = null;
            this.callbackInfo = null;
        }
        if (typeof this.free === 'function') {
            this.free(this);
        }
    }

    function _ontimeout() {
        console.log('%cserver connection timed out', 'color:#fa00f1;');
        if (typeof this.callback === 'function') {
            this.callback = null;
        }
        if (this.callbackInfo) {
            this.callbackInfo = null;
        }
        if (typeof this.free === 'function') {
            this.free(this);
            this.free = null;
        }
    }

    return XHR;

});