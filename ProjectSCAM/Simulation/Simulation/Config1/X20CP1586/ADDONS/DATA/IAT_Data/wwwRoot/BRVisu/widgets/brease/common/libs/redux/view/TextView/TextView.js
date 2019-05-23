define(['widgets/brease/common/libs/BoxLayout'],
    function (BoxLayout) {

    'use strict';

    var TextView = function (props, parent) {
        this.render(props, parent);
    };

    var p = TextView.prototype;

    p.render = function render(props, parent) {
        this.el = $(BoxLayout.createBox());
        this.span = $('<span></span>');
        _addCssClasses(this.el, props.textSettings, props.selected);
        this.span.text(props.text);
        this.el.append(this.span);
        parent.append(this.el);
    };

    p.dispose = function dispose() {
        this.span.remove();
        this.el.remove();
    };

    function _addCssClasses(element, textSettings, selected) {
        element.addClass('TextView');
        if (textSettings.ellipsis === true) {
            element.addClass('ellipsis');
        } else {
            element.removeClass('ellipsis');
        }
        if (selected) {
            element.addClass('textSelected');
        } else {
            element.removeClass('textSelected');
        }
        if (textSettings.multiLine === true) {
            element.addClass('multiLine');
            if (textSettings.wordWrap === true) {
                element.addClass('wordWrap');
                element.removeClass('multiLine');
            } else {
                element.removeClass('wordWrap');
            }
            if (textSettings.breakWord === true) {
                element.addClass('breakWord');
                element.removeClass('multiLine');
            } else {
                element.removeClass('breakWord');
            }
        } else {
            element.removeClass('breakWord');
            element.removeClass('wordWrap');
            element.removeClass('multiLine');
        }
    }

    return TextView;

});