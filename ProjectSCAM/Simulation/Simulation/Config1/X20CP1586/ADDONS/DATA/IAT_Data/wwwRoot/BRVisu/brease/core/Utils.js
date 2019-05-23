/*global define,console,Element*/
define(function () {

    'use strict';

    /**
	* @class brease.core.Utils
	* @extends core.javascript.Object
	*/
    var Utils = {};

    Utils.defineProperty = function (obj, propName, propValue, enumerable, configurable, writable) {
        var config = {
            enumerable: (enumerable !== undefined) ? enumerable : true, // true if this property shows up during enumeration of the properties on the corresponding object.
            configurable: (configurable !== undefined) ? configurable : false, // true if the type of this property descriptor may be changed and if the property may be deleted from the corresponding object.
            writable: (writable !== undefined) ? writable : false, // true if the value associated with the property may be changed with an assignment operator.
            value: propValue
        };
        //console.log('defineProperty(' + propName + ')', config);
        Object.defineProperty(obj, propName, config);
    };

    Utils.deepCopy = function (obj) {
        return _deepCopy(obj);
    };

    Utils.extendDeepToNew = function (obj1, obj2) {
        return _deepExtend(_deepCopy(obj1), obj2);
    };

    Utils.toArray = function (obj, startIndex) {
        var ar;
        if (obj) {
            var l = obj.length;
            ar = [];
            startIndex = (startIndex !== undefined) ? startIndex : 0;
            if (l > startIndex) {
                for (var i = startIndex; i < l; i += 1) {
                    ar.push(obj[i]);
                }
            }
        }
        return ar;
    };

    Utils.parseTemplate = function (html) {
        if (html.indexOf('data-template="true"') !== -1) {

            var container = document.createDocumentFragment();
            $(container).append($(html));
            Utils.parseTemplates(container);
            return container;
        } else {
            return html;
        }
    };

    Utils.parseTemplates = function (container) {
        var templates = container.querySelectorAll('[data-template="true"]'),
			l = templates.length,
			template;
        for (var i = 0; i < l; i += 1) {
            template = templates[i];
            template.content = document.createDocumentFragment();
            while (template.childNodes[0]) {
                template.content.appendChild(template.childNodes[0]);
            }
        }
    };

    Utils.prependChild = function (container, child) {
        if (container instanceof Node === false) {
            throw new SyntaxError('first argument has to be of type Node');
        }
        if (child instanceof Node === false) {
            throw new SyntaxError('second argument has to be of type Node');
        }
        if (container.firstChild !== null) {
            container.insertBefore(child, container.firstChild);
        } else {
            container.appendChild(child);
        }
    };

    Utils.elemContains = function (container, child) {
        return $.contains(container, child);
    };

    /**
	* @method parseElementData
	* @static
	* Method to parse JSON strings in data-attributes.  
	* Example:  
	*
	*       <div id='d01' data-brease-widget='DateTimeOutput' data-brease-options='{"date":{"pattern":"Y"}}'></div>
	*       <script>
	*       var options = Utils.parseElementData(document.getElementById('d01'), 'brease-options');
	*       </script>
	*
	* @param {HTMLElement} elem
	* @param {String} dataKey Is added to "data-", to build attribute name. E.g. "brease-options" gives "data-brease-options".
	* @return {core.javascript.Object} JavaScript object
	*/
    Utils.parseElementData = function (elem, dataKey) {

        var attrName = 'data-' + dataKey,
			attrValue = elem.getAttribute(attrName),
			obj;

        try {
            obj = (attrValue !== null && attrValue !== '') ? JSON.parse(attrValue.replace(/\'/g, '"')) : {};
        } catch (e) {
            console.iatWarn('Illegal data in attribute ' + attrName + ' for widget ' + elem.id + ', widget will have default values!');
            obj = {};
        }
        return obj;

    };

    Utils.setDate = function (dateObject, h, m, s, ms) {
        if (dateObject !== undefined) {
            if (typeof dateObject.setHours === 'function' && !isNaN(h)) {
                dateObject.setHours(h);
            }
            if (typeof dateObject.setMinutes === 'function' && !isNaN(m)) {
                dateObject.setMinutes(m);
            }
            if (typeof dateObject.setSeconds === 'function' && !isNaN(s)) {
                dateObject.setSeconds(s);
            }
            if (typeof dateObject.setMilliseconds === 'function' && !isNaN(ms)) {
                dateObject.setMilliseconds(ms);
            }
        }
        return dateObject;
    };

    var id = 1, prefix_temp = 'abcdefghijklmnopqrstuvwxyz';

    /**
	* @method uniqueID
	* @static
	* Returns an application wide unique ID. 
	* @param {String} [prefix]
	* @return {String}
	*/
    Utils.uniqueID = function (prefix) {

        var pre = prefix || prefix_temp[Math.ceil(Math.random() * 25)];
        id += 1;
        return pre + '_' + id;

    };

    /**
	* @method radToDeg
	* @static
	* Method to convert radian to degree. 
	* @param {Number} rad
	* @return {Number} degree
	*/
    Utils.radToDeg = function (rad) {
        return (180 / Math.PI) * rad;
    };

    /**
	* @method degToRad
	* @static
	* Method to convert degree to radian. 
	* @param {Number} degree
	* @return {Number} rad
	*/
    Utils.degToRad = function (degree) {
        return (degree / 180) * Math.PI;
    };

    Utils.isString = function (item) {
        return (typeof item === 'string' || item instanceof String);
    };

    Utils.isBlank = function (item) {
        return (!item || /^\s*$/.test(item));
    };

    Utils.isWidget = function (obj) {
        return (obj && typeof obj._bind === 'function' && obj.settings !== undefined && obj.settings.className !== undefined && obj.settings.className.indexOf('widgets') !== -1);
    };

    Utils.isObject = function (item) {
        return (item instanceof Object);
    };

    Utils.isFunction = function (item) {
        return (typeof item === 'function');
    };

    Utils.isNumeric = function (item) {

        return !isNaN(item) && item !== '' && item !== true && item !== false && item !== null;
    };

    Utils.getter = function (attribute) {
        return _methodName('get', attribute);
    };

    Utils.setter = function (attribute) {
        return _methodName('set', attribute);
    };

    Utils.permission = function (request, response) {
        var permission = false, i;
        if (!Array.isArray(request) || request.length === 0) {
            return permission;
        }
        if (!Array.isArray(response) || response.length === 0) {
            return permission;
        }
        if (request.length < response.length) {
            for (i = 0; i < request.length; i += 1) {
                if (response.indexOf(request[i]) !== -1) {
                    permission = true;
                    break;
                }
            }
        } else {
            for (i = 0; i < response.length; i += 1) {
                if (request.indexOf(response[i]) !== -1) {
                    permission = true;
                    break;
                }
            }
        }
        return permission;
    };

    /**
   * @method getScaleFactor
   * @static
   * Returns the actual scale factor of an HTMLElement
   * @param {HTMLElement} elem
   * @return {Number} 
   */
    Utils.getScaleFactor = function (elem) {
        var factor = 1;
        if (elem instanceof Element && typeof elem.getBoundingClientRect === 'function') {
            var width = $(elem).outerWidth();
            if (width > 0) {
                factor = elem.getBoundingClientRect().width / width;
            }
        }
        return factor;
    };

    /**
    * @method closestWidgetElem
    * @static
    * Returns the closest HTMLElement which is a widget
    * Returns the root node, if no parent widget exists (document.body or documentFragment)
    * @param {HTMLElement} elem
    * @return {core.html.Node} 
    */
    Utils.closestWidgetElem = function (elem) {

        if (Utils.hasClass(elem, 'breaseWidget')) {
            return elem;
        } else {
            var cur = elem, parent;
            while (cur !== document.body) {
                if (Utils.hasClass(cur, 'breaseWidget')) {
                    break;
                } else {
                    parent = cur.parentNode;
                    if (parent) {
                        cur = parent;
                    } else {
                        break;
                    }
                }
            }

            return cur;
        }
    };

    /**
    * @method getChromeScale
    * @static
    * Returns the actual scale factor of an HTMLElement and 1 for Chrome Browser >= 58
    * @param {HTMLElement} elem
    * @return {Number} 
    */
    Utils.getChromeScale = function (elem) {

        var userAgent = navigator.userAgent,
            chromeIndex = navigator.userAgent.toLowerCase().indexOf('chrome'),
            isChrome = chromeIndex !== -1,
            majorVersion = 0;

        if (isChrome) {
            majorVersion = parseInt(userAgent.substring(chromeIndex + 7), 10);
        }
        if (isChrome && majorVersion >= 58) {
            return 1;
        } else {
            return Utils.getScaleFactor(elem);
        }

    };

    /**
    * @method objToLogText
    * @static
    * Method to convert an object to an suitable text for the event logger
    * @param {Object} obj
    * @return {String} text
    */
    Utils.objToLogText = function (obj) {
        var text = "";

        if (obj === undefined) {
            return "";
        }
        else if (typeof obj === "object") {
            for (var key in obj) {
                if (obj[key] && obj[key].toString() === "[object Object]") {
                    text += ((text !== '') ? ',' : '') + key + "={" + Utils.objToLogText(obj[key]) + "}";
                } else {
                    text += ((text !== '') ? ',' : '') + key + "=" + obj[key];
                }
            }
        }

        else {
            text = obj.toString();
        }

        return text;
    };

    Utils.logError = function (e) {
        if (e.stack) {
            console.log('%c' + e.stack, 'color:red;');
        } else if (e.name && e.message) {
            console.log('%c' + e.name + ': ' + e.message, 'color:red;');
        } else if (e.message) {
            console.log('%cError: ' + e.message, 'color:red;');
        } else {
            console.log('%cError in try/catch; log trace for more info', 'color:red;');
        }
    };

    Utils.getStylesheetByHref = function (href) {
        var stylesheet;
        if (href !== '') {
            for (var i = 0; i < document.styleSheets.length; i += 1) {
                if (document.styleSheets[i].href && document.styleSheets[i].href.indexOf(href) !== -1) {
                    stylesheet = document.styleSheets[i];
                    break;
                }
            }
        }
        return stylesheet;
    };

    var methodReg = /\(([\s\S]*?)\)/;

    Utils.getFunctionArguments = function getFunctionArguments(func) {
        if (typeof func !== 'function') {
            throw new SyntaxError('argument has to be of type function');
        }
        var params = methodReg.exec(func),
            argNames = [];

        if (params && params[1] !== '') {
            argNames = params[1].replace(/ /g, '').split(',');
        }
        return argNames;
    };

    Utils.getOriginalEvent = function (e) {

        while (e && typeof e.originalEvent !== "undefined") {
            e = e.originalEvent;
        }
        return e;
    };

    Utils.getPointerId = function (e) {
        var pointerId;
        if (e.detail && e.detail.pointerId !== undefined) {
            pointerId = e.detail.pointerId;
        } else {
            var oE = Utils.getOriginalEvent(e);
            if (oE.pointerId !== undefined) {
                pointerId = oE.pointerId;
            } else if (oE.changedTouches && oE.changedTouches.length > 0) {
                pointerId = oE.changedTouches[0].identifier;
            }
        }
        return pointerId;
    };

    Utils.getOffsetOfEvent = function (e) {

        var originalEvent = Utils.getOriginalEvent(e),
            offset = { x: 0, y: 0 };

        if (originalEvent.changedTouches && originalEvent.changedTouches.length > 0) {
            offset.x = originalEvent.changedTouches[0].pageX;
            offset.y = originalEvent.changedTouches[0].pageY;
        } else if (originalEvent.pageX !== undefined) {
            offset.x = originalEvent.pageX;
            offset.y = originalEvent.pageY;
        }
        //console.log('getOffsetOfEvent:', offset);
        return offset;
    };

    Utils.hasClass = function (elem, cssClass) {
        return elem !== null && elem !== undefined && ((elem.className !== undefined && typeof elem.className.indexOf === 'function' && elem.className.indexOf(cssClass) !== -1) || (elem.classList !== undefined && elem.classList.value !== undefined && elem.classList.value.indexOf(cssClass) !== -1));
    };

    Utils.addClass = function (node, className) {
        var current = '';
        if (node && typeof node.getAttribute === 'function' && typeof node.setAttribute === 'function' && Utils.isString(className)) {
            var act = node.getAttribute('class');
            if (act) {
                current = '' + act;
            }
            if (current !== '') {
                if (current.split(' ').indexOf(className) === -1) {
                    node.setAttribute('class', current + ' ' + className);
                }
            } else {
                node.setAttribute('class', className);
            }
        }
    };

    Utils.removeClass = function (node, className) {
        var current = '';
        if (node && typeof node.getAttribute === 'function' && typeof node.setAttribute === 'function' && Utils.isString(className)) {
            var act = node.getAttribute('class');
            if (act) {
                current = '' + act;
            }
            if (current !== '') {
                if (current.indexOf(' ') !== -1) {
                    var classNames = ('' + current).split(' '),
                        index = classNames.indexOf(className);
                    while (index !== -1) {
                        classNames.splice(index, 1);
                        index = classNames.indexOf(className);
                    }
                    node.setAttribute('class', classNames.join(' '));
                } else if (current === className) {
                    node.setAttribute('class', '');
                }
            }
        }
    };

    Utils.arrayToObject = function (arr, prop) {
        if (!Array.isArray(arr)) {
            throw new SyntaxError('first argument has to be of type Array');
        }
        if (prop !== undefined && !Utils.isString(prop)) {
            throw new SyntaxError('second argument has to be of type String');
        }
        var obj = {},
            item, key;
        for (var i = 0, l = arr.length; i < l; i += 1) {
            item = arr[i];
            key = (prop !== undefined && item[prop] !== undefined) ? item[prop] : '' + i;
            obj[key] = item;
        }
        return obj;
    };

    Utils.transferProperties = function (source, target, keys) {
        if (!Utils.isObject(source)) {
            throw new SyntaxError('first argument has to be of type Object');
        }
        if (!Utils.isObject(target)) {
            throw new SyntaxError('second argument has to be of type Object');
        }
        if (!Array.isArray(keys)) {
            throw new SyntaxError('third argument has to be of type Array');
        }
        for (var i = 0, len = keys.length; i < len; i += 1) {
            target[keys[i]] = source[keys[i]];
        }
    };

    Utils.ensureVisuId = function (visuId) {
        return Utils.isString(visuId) ? visuId.toLowerCase() : visuId;
    };

    function _methodName(prefix, attribute) {
        return prefix + attribute.substring(0, 1).toUpperCase() + attribute.substring(1);
    }

    function _deepCopy(o) {
        // faster than $.extend and JSON.parse/stringify
        var newO;

        if (typeof o !== 'object') {
            return o;
        }
        if (!o) {
            return o;
        }

        if (Array.isArray(o)) {
            newO = [];
            for (var i = 0, l = o.length; i < l; i += 1) {
                newO[i] = _deepCopy(o[i]);
            }
            return newO;
        }

        newO = {};
        for (var k in o) {
            newO[k] = _deepCopy(o[k]);
        }
        return newO;
    }

    function _deepExtend(o1, o2) {

        if (o1 !== undefined && o1 !== null) {
            var k, p;
            for (k in o2) {
                p = o2[k];
                if (p !== undefined) {
                    if (typeof p !== 'object' || p === null) {
                        o1[k] = p;

                    } else if (Array.isArray(p)) {
                        if (!Array.isArray(o1[k])) {
                            o1[k] = _deepCopy(p);
                        } else {
                            _arrayExtend(o1[k], p);
                        }
                    } else {
                        if (o1[k] === undefined) {
                            o1[k] = _deepCopy(p);
                        } else {
                            o1[k] = _deepExtend(o1[k], p);
                        }
                    }
                }
            }
            return o1;
        } else {
            if (o2 !== undefined) {
                return o2;
            } else {
                return o1;
            }
        }
    }

    function _arrayExtend(a1, a2) {
        for (var i = 0, l = a2.length; i < l; i += 1) {
            if (a2[i] !== undefined) {
                if (typeof a2[i] !== 'object' || a2[i] === null) {
                    a1[i] = a2[i];
                } else {
                    a1[i] = _deepExtend(a1[i], a2[i]);
                }
            }
        }
    }

    return Utils;

});