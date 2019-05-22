/*global define*/
define(['brease/core/Utils'], function (Utils) {

    'use strict';

    var Types = {};

    Utils.defineProperty(Types, 'PAGE', 'Page');
    Utils.defineProperty(Types, 'DIALOG', 'Dialog');

    return Types;
});