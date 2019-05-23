/*global define,console,Globalize,brease*/
define(['globalize'], function (globalize) {

    'use strict';

    /**
    * @class brease.helper.DateFormatter
    * @extends core.javascript.Object
    * 
    * @singleton
    */
    var Formatter = {

        /**
        * @method format
        * Format a date or time  
        * @param {Date} value
        * @param {brease.config.DateFormat} format
        * @param {Function} callback
        * @param {String} cultureKey (optional) if not specified, current selected culture is taken
        */
        format: function (value, format, callback, cultureKey) {
            var result = _findFormat(format, cultureKey);
            callback(Globalize.format(value, result.format, result.key));
        },

        /**
        * @method formatSync
        * Format a date or time  (synchronous version)
        * @param {Date} value
        * @param {brease.config.DateFormat} format
        * @param {String} cultureKey (optional) if not specified, current selected culture is taken
        * @return {String}
        */
        formatSync: function (value, format, cultureKey) {
            var result = _findFormat(format, cultureKey);
            return Globalize.format(value, result.format, result.key);
        },

        getFormat4Pattern: function (pattern) {
            var culture = brease.culture.getCurrentCulture().culture;
            return culture.calendar.patterns[pattern];

        },
        defaultPattern: 'S'
    };

    function _findFormat(format, cultureKey) {
        var culture;

        if (cultureKey !== undefined) {
            culture = Globalize.findClosestCulture(cultureKey);
            if (culture === null) {
                var systemCulture = brease.culture.getCurrentCulture();
                console.iatWarn('invalid culture "' + cultureKey + '" -> take default culture "' + systemCulture.key + '"');
                culture = systemCulture.culture;
                cultureKey = systemCulture.key;
            }
        } else {
            culture = brease.culture.getCurrentCulture().culture;
        }

        if (format.length === 1 && culture.calendar.patterns[format] === undefined) {
            console.iatWarn('invalid pattern "' + format + '" -> take default pattern "' + Formatter.defaultPattern + '"');
            format = Formatter.defaultPattern;
        }
        return { format: format, key: cultureKey };
    }

    return Formatter;

});


/**
* @class brease.config.DateFormat
* @extends String
* @embeddedClass
* @virtualNote
* Either a format string (e.g. "HH:mm") or a pattern ("F").  
*
* <section>For available formats and patterns see at **[Internationalization Guide](#!/guide/internationalization)**</section>
* <template>Read more about <a href="../../FAQ/FormatDate.html">Date Formats</a> in FAQ.</template>
*/