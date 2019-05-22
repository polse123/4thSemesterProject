/*global brease*/
define(['brease/core/Class'], function (SuperClass) {

    'use strict';

    var ModuleClass = SuperClass.extend(function EditorHandles(widget) {
	    SuperClass.call(this);
	    this.widget = widget;
	}, null),

	p = ModuleClass.prototype;

    p.getHandles = function () {

        var self = this;
        return {
            pointHandles: [],
            resizeHandles: [],
            moveHandles: []
        };
    };

    p.getSelectionDecoratables = function () {
        return [this.widget.elem];
    };

    return ModuleClass;

});