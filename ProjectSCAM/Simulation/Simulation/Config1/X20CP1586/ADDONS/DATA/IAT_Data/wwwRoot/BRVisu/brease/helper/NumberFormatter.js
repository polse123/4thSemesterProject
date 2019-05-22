/*global define*/
define(function () {

    'use strict';

    /**
    * @class brease.helper.NumberFormatter
    * @extends core.javascript.Function
    * 
    * @singleton
    */
    var Formatter = function () {
        if (_instance === undefined) {
            _instance = this;
        }
        return _instance;
    },

    p = Formatter.prototype;
    p.defaults = {
        useDigitGrouping: false,
        decimalPlaces: 1,
        minimumIntegerDigits: 1,
        maximumIntegerDigits: 8,
        separators: {
            dsp: '.',
            gsp: ','
        }
    };

    /*
    /* PUBLIC
    */

    p.parseFloat = function (strValue, separators) {
        separators = separators || { dsp: '.' };
        strValue = strValue.replace(floatPattern(separators), '');
        strValue = strValue.replace(separators.dsp, '.');
        return parseFloat(strValue);
    };

    /**
	* @method formatNumber
	* Format a numeric value.  
	* @param {Number} value
	* @param {brease.config.NumberFormat} format
	* @param {Boolean} useDigitGrouping
	* @param {Object} separators
	* @param {String} separators.dsp decimal separator (The decimal separator (or decimal mark) is a symbol used to separate the integer part from the fractional part of a number written in decimal form.)
	* @param {String} separators.gsp grouping separator for digit grouping of the integer part of a number written in decimal form
	*/
    p.formatNumber = function (value, format, useDigitGrouping, separators) {

        var absValue = Math.abs(value),
            sign = value / absValue;

        scienceNrRegex.lastIndex = 0;
        if (scienceNrRegex.test(absValue.toString())) {
            return formatScience.call(this, absValue, (sign === -1) ? '-' : '', separators, format);
        } else {
            return formatFloat.call(this, absValue, (sign === -1) ? '-' : '', separators, format, useDigitGrouping);
        }
    };

    p.roundToSignificant = function (value, precision) {
        if (isNaN(value)) {
            throw new SyntaxError('value has to be a number');
        }
        if (isNaN(precision)) {
            throw new SyntaxError('precision has to be a positive integer >= 1');
        }
        if (value === 0) {
            return value;
        }
        precision = Math.max(1, parseInt(precision, 10));
        var abs = Math.abs(value),
            sign = value / abs,
            log = Math.floor(Math.log10(abs)) + 1,
            factor = Math.max(1, Math.round(Math.pow(10, precision) / Math.pow(10, log)));

        return sign * Math.round(factor * abs) / factor;
    };

    p.roundToFormat = function (value, decimalPlaces) {
        if (isNaN(value)) {
            throw new SyntaxError('value has to be a number');
        }
        if (isNaN(decimalPlaces)) {
            throw new SyntaxError('decimalPlaces has to be a positive integer >= 0');
        }
        if (value === 0) {
            return value;
        }
        decimalPlaces = Math.max(0, parseInt(decimalPlaces, 10));
        var abs = Math.abs(value),
            sign = value / abs,
            factor = Math.max(1, Math.pow(10, decimalPlaces));

        if (abs > 0 && abs * factor < Number.MAX_VALUE) { //otherwise its not calculable
            return sign * Math.round(abs * factor) / factor;
        } else {
            return value;
        }
    };

    /*
    /* PRIVATE
    */

    function _setSeparator(type, separators) {
        var sep = this.defaults.separators[type];
        if (separators && separators[type]) {
            sep = separators[type];
        }
        return sep;
    }

    function _setFormat(type, format, min) {
        var ret = this.defaults[type];
        if (format && format[type] >= min) {
            ret = parseInt(format[type], 10);
        }
        return ret;
    }

    function _convertToScience(absValue, sign, decimalPlaces, dsp) {
        var pow10 = Math.floor(Math.log10(absValue)),
            normalized = absValue / (Math.pow(10, pow10)),
            rounded = Math.round(normalized * Math.pow(10, decimalPlaces)) / Math.pow(10, decimalPlaces);

        if (rounded === 10) { rounded = 1; pow10 += 1; }

        var parts = rounded.toFixed(decimalPlaces).split('.');
        if (parts.length > 1) {

            return sign + parts[0] + dsp + parts[1] + 'e+' + pow10;
        } else {

            return sign + parts[0] + 'e+' + pow10;
        }
    }

    function formatFloat(absValue, sign, separators, format, useDigitGrouping) {

        var dsp = _setSeparator.call(this, 'dsp', separators),
            gsp = _setSeparator.call(this, 'gsp', separators),
            decimalPlaces = _setFormat.call(this, 'decimalPlaces', format, 0),
            minimumIntegerDigits = _setFormat.call(this, 'minimumIntegerDigits', format, 1),
            maximumIntegerDigits = _setFormat.call(this, 'maximumIntegerDigits', format, 1),
            integerDigits,
            fractionDigits = '';

        if (minimumIntegerDigits > maximumIntegerDigits) {
            maximumIntegerDigits = minimumIntegerDigits;
        }

        var parts = absValue.toFixed(decimalPlaces).split('.');

        if (decimalPlaces > 0) {
            fractionDigits = parts[1];
        }
        if (parts[0].length > maximumIntegerDigits) {
            return _convertToScience(absValue, sign, decimalPlaces, dsp);
        } else {
            if (minimumIntegerDigits > 0 && minimumIntegerDigits > parts[0].length) {
                var temp = parseInt(parts[0], 10) / Math.pow(10, minimumIntegerDigits - 1);
                integerDigits = temp.toFixed(minimumIntegerDigits - 1).replace('.', '');
            } else {
                integerDigits = parts[0];
            }
            if (useDigitGrouping === true) {
                integerDigits = addGrouping(integerDigits, gsp);
            }

            return sign + integerDigits + ((integerDigits !== '' && fractionDigits !== '') ? dsp : '') + fractionDigits;
        }
    }

    function formatScience(absValue, sign, separators, format) {

        var dsp = this.defaults.separators.dsp,
            gsp = this.defaults.separators.gsp;

        if (separators) {
            if (separators.dsp) {
                dsp = separators.dsp;
            }
            if (separators.gsp) {
                gsp = separators.gsp;
            }
        }


        var parts = absValue.toString().split('e+');
        parts[0] = parseFloat(parts[0]).toFixed(format.decimalPlaces);
        parts[0] = parts[0].replace('.', dsp);
        return sign + parts.join('e+');
    }

    function addGrouping(intd, gsp) {
        return intd.split(grRegEx).join(gsp);
    }

    function floatPattern(separators) {
        if (_separators.gsp !== separators.gsp) {
            _separators.gsp = separators.gsp;
            _floatPattern = new RegExp("\\" + separators.gsp, "g");
        }
        return _floatPattern;
    }

    var grRegEx = /(?=(?:\d{3})+(?:\.|$))/g,
        scienceNrRegex = /[0-9]\.[0-9]*e\+[0-9]{1,2}/g,
        _instance,
        _separators = {},
        _floatPattern;

    return Formatter;

});