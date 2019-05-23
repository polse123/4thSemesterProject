define(function (require) {

    'use strict';

    var wanakana = require("widgets/brease/KeyBoard/libs/external/wanakana"),

    Plugin = function PluginWanaKana() {},

	p = Plugin.prototype;

    p.init = function (keyboard) {
        this.keyboard = keyboard;
    };

    p.show = function () {
        this.cursor = undefined;
    };

    p.hide = function () {
    };

    p.onInput = function (val, cursor) {

        if (this.cursor === undefined) {
            this.cursor = cursor;
        }

        if (this.cursor > cursor) {
            this.cursor = cursor;
        }
        if (!/\w/g.test(val[cursor - 1])) {
            this.cursor = cursor;
        }

        var result = wanakana.toKana(val, {
            IMEMode: true
        });

        if (this.value === result) {
            return;
        }
        this.value = result;
        this.keyboard.setValue(result);

    };

    p.onDelete = function () { };

    p.dispose = function () { };

    return new Plugin();

});