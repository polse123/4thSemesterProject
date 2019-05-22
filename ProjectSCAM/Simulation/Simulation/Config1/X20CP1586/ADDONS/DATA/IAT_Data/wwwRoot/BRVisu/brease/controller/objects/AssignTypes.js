/*global define*/
define(['brease/core/Utils'], function (Utils) {

    'use strict';

    var Types = {};

    Utils.defineProperty(Types, 'CONTENT', 'Content');
    Utils.defineProperty(Types, 'PAGE', 'Page');
    Utils.defineProperty(Types, 'VISU', 'Visu');

    return Types;
});