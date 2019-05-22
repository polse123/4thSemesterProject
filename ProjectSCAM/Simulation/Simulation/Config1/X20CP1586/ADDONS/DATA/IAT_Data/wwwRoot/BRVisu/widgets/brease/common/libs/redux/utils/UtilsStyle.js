define(function (require) {

    'use strict';

    var UtilsStyle = {};

    UtilsStyle.addStylePrefix = function addStylePrefix(prefix, style) {
        return prefix + '_style_' + style;
    };

    return UtilsStyle;

});