/*global define*/
define(function () {

    'use strict';

    // LoadCycle is a helper class to avoid that ContentLoaders are suspended and disposed in one JS "event loop".
    // As long a LoadCycle is running, ContentLoaders are marked for suspension instead of immediate suspension.
    // When a LoadCycle is finished, all marked ContentLoaders are suspended, if they are not disposed during the cycle.
    // This way it's ensured that every ContentLoader is either disposed or suspended.

    var LoadCycle = function () {
        this.isOpen = true;
        this.stack = [];
    };

    LoadCycle.prototype.start = function (callback, contents, callbackInfo) {

        if (this.isOpen === true) {
            this.isOpen = false;
            this.callback = callback;
            this.callbackInfo = callbackInfo;
            this.stack = [];
            if (Array.isArray(contents)) {
                for (var i = 0; i < contents.length; i += 1) {
                    if (this.stack.indexOf(contents[i]) === -1) {
                        this.stack.push(contents[i]);
                    }
                }
            }
            if (this.stack.length === 0) {
                _finish.call(this);
            }
        } else {
            if (this.callbackInfo.embedded === undefined) {
                this.callbackInfo.embedded = [];
            }
            this.callbackInfo.embedded.push({ containerId: callbackInfo.containerId, pageId: callbackInfo.pageId });
        }
    };

    LoadCycle.prototype.remove = function (item, removeFromContents) {
        //console.debug('LoadCycle.remove:' + item);
        var index = this.stack.indexOf(item);
        if (index !== -1) {
            this.stack.splice(index, 1);
        }
        if (removeFromContents === true && Array.isArray(this.callbackInfo.contentsToLoad)) {
            index = this.callbackInfo.contentsToLoad.indexOf(item);
            if (index !== -1) {
                this.callbackInfo.contentsToLoad.splice(index, 1);
            }
        }
        if (this.stack.length === 0 && this.isOpen === false) {
            _finish.call(this);
        }
    };

    Object.defineProperty(LoadCycle.prototype, 'isEmpty', {
        get: function () {
            return this.length === 0;
        },
        enumerable: true,
        configurable: false
    });

    Object.defineProperty(LoadCycle.prototype, 'length', {
        get: function () {
            return this.stack.length;
        },
        enumerable: true,
        configurable: false
    });

    function _finish() {
        //console.debug('LoadCycle.finish');
        this.isOpen = true;
        if (typeof this.callback === 'function') {
            this.callback(this.callbackInfo);
            this.callback = null;
            this.callbackInfo = null;
        }
    }

    return LoadCycle;

});