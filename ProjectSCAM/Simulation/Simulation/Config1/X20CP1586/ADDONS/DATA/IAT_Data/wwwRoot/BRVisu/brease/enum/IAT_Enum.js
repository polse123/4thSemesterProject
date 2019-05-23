/*global define*/
define(function () {

    'use strict';


    /**
    * @class brease.enum.IAT_Enum
    * @extends core.javascript.Function
    * @constructor
    * Creates a new IAT_Enum instance.  
    * ##Example
    *       var align = new IAT_Enum({
    *           center: 'c',
    *           left: 'l',
    *           right: 'r'
    *       });
    * @param {Object} valueObj A key/value object of members of the enum
    */
    var IAT_Enum = function IAT_Enum(valueObj) {

        for (var key in valueObj) {
            if (IAT_Enum.prototype[key]) {
                throw new SyntaxError("reserved key '" + key + "'");
            }
            Object.defineProperty(this, key, {
                enumerable: true,
                configurable: false,
                writable: false,
                value: valueObj[key]
            });
        }

    };

    /**
    * @method hasMember
    * Check if IAT_Enum contains member
    * @param {ANY} member
    * @return {Boolean}
    */
    Object.defineProperty(IAT_Enum.prototype, 'hasMember', {
        value: function (obj) {
            return (this.getMembers().indexOf(obj) !== -1);
        },
        enumerable: false,
        configurable: false,
        writable: false
    });

    /**
    * @method getMembers
    * @return {Array}
    */
    Object.defineProperty(IAT_Enum.prototype, 'getMembers', {
        value: function () {
            var members = [];
            for (var member in this) {
                if (this.propertyIsEnumerable(member) && typeof this[member] !== 'function') {
                    members.push(this[member]);
                }
            }
            return members;
        },
        enumerable: false,
        configurable: false,
        writable: false
    });

    /**
    * @method getKeyForValue
    * @return {String}
    */
    Object.defineProperty(IAT_Enum.prototype, 'getKeyForValue', {
        value: function (value) {
            var key;
            for (var member in this) {
                if (this[member] === value) {
                    key = member;
                    break;
                }
            }
            return key;
        },
        enumerable: false,
        configurable: false,
        writable: false
    });

    return IAT_Enum;
});