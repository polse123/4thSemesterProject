/*global define,brease,console,CustomEvent*/
define(['brease/events/BreaseEvent', 'brease/core/Utils', 'brease/config'], function (BreaseEvent, Utils, config) {

    'use strict';

    /**
    * @class brease.services.Language
    * @extends core.javascript.Object
    * Language service; available via brease.language  
    * Example of usage:
    * 
    *       <script>
    *           require(['brease', 'brease/events/BreaseEvent'], function (brease, BreaseEvent) {
    *               document.body.addEventListener(BreaseEvent.LANGUAGE_CHANGED, function() {
    *                   console.log('successfully changed!');
    *               });
    *               brease.language.switchLanguage('de');
    *           });
    *       </script>
    * 
    * @singleton
    */
    var Language = {

        /*
        /* PUBLIC
        */

        init: function (runtimeService) {
            _runtimeService = runtimeService;
            return this;
        },

        isReady: function () {
            _deferred = $.Deferred();
            //window.performanceMonitor.profile('language_initialLoad', { state: "started" });
            _initialLoad();
            return _deferred.promise();
        },

        allTextsLoaded: function () {
            _deferred = $.Deferred();
            _allTextsLoad();
            return _deferred.promise();
        },

        /**
        * @method getLanguages
        * Method to get info about all available languages
        * @return {Object} _languages
        */
        getLanguages: function () {

            return Utils.deepCopy(_languages);
        },

        /**
        * @method getCurrentLanguage
        * Method to get key (ISO 639-1) of current selected language.  
        * E.g. 'de' for german.
        * @return {String}
        */
        getCurrentLanguage: function () {

            return _current.key;
        },

        /**
        * @method getTextByKey
        * Get a text for a textkey in current selected language  
        * mapp view texts are in namespace "IAT"
        * @return {String}
        */
        getTextByKey: function (textkey) {
            //console.log('getTextByKey:', textkey, _texts[textkey]);
            if (textkey.indexOf('IAT/') === -1) {
                textkey = 'IAT/' + textkey;
            }
            var text = _texts[textkey];

            if (!text) {
                console.iatWarn('undefined text key:' + textkey);
            }
            return text || ((brease.config.editMode === true) ? '$' + textkey : config.undefinedTextReturnValue);
        },

        /**
        * @method getSystemTextByKey
        * Get a text for a textkey in current selected language  
        * system texts are in namespace "BR/IAT"
        * @return {String}
        */
        getSystemTextByKey: function (textkey) {
            var text = _texts[textkey];

            if (text !== undefined) {
                return text;
            } else {
                console.iatWarn('undefined text key:' + textkey);
                return config.undefinedTextReturnValue;
            }
        },

        getFormattedTextByKey: function (textkey, callback) {

            var text = _texts[textkey];

            if (text !== undefined) {
                if (_containsSnippet(text)) {
                    brease.textFormatter.format(text, []).then(function successHandler(result) {
                        callback(result);
                    }, function errorHandler() {
                        console.iatWarn('error in textFormatter for textkey "' + textkey + '"');
                        callback(undefined);
                    });
                } else {
                    callback(text);
                }
            } else {
                console.iatWarn('undefined text key:' + textkey);
                callback(config.undefinedTextReturnValue);
            }
        },

        /**
        * @method switchLanguage
        * Method to change current selected language
        * @param {String} key Key of one available language (e.g. 'de')
        */
        switchLanguage: function (key) {
            _deferred = $.Deferred();

            if (_languages.languages[key] === undefined) {
                console.iatWarn('Language \u00BB' + key + '\u00AB is not defined!');
                _deferred.resolve({ success: false });

            } else if (_current.key === key) {
                console.iatInfo('Language \u00BB' + key + '\u00AB is current!');
                _deferred.resolve({ success: true });

            } else {
                _newKey = key;
                _isChange = true;
                _current.version = 0;
                //window.performanceMonitor.profile('language_switch', { currentLanguage: _current.key, state: "started" });
                _runtimeService.switchLanguage(key, _switchLanguage_responseHandler);
            }
            return _deferred.promise();
        },

        /**
        * @method reloadTexts
        * Method to reload texts in current language
        */
        reloadTexts: function () {
            _isChange = true;
            _current.version += 1;
            _runtimeService.loadTexts(_current.key, _loadTexts_responseHandler, { type: 'reload' });
        },

        getCurrentVersion: function () {
            return _current.version;
        },

        setKeyText: function (key, text) {
            _texts[key] = text;
        },

        /**
        * @method
        * Method to add a text key to the text model. (This adds text keys locally in browser session only, not to the server side text system!)  
        * @param {String} key
        * @param {String} text
        * @param {Boolean} overwrite If you want to replace an existing key, set this to true.
        */
        addTextKey: function (key, text, overwrite) {

            if (_texts[key] && overwrite === true) {

                _texts[key] = text;
            } else if (_texts[key] && overwrite !== true) {

                console.iatWarn('text key [' + key + '] already exists!');
            } else {

                _texts[key] = text;
            }
        },

        /**
        * @method
        * Method to add a bunch of text keys to the text model. (This adds text keys locally in browser session only, not to the server side text system!)  
        * @param {Object} data Properties of this object are text keys (e.g. {"key1":"example text 1", "key2":"example text 2"})
        * @param {Boolean} overwrite If you want to replace existing keys, set this to true.
        */
        addTextKeys: function (data, overwrite) {

            for (var key in data) {
                Language.addTextKey(key, data[key], overwrite);
            }
        },

        isKey: function (text) {
            return (Utils.isString(text) && text.substring(0, 1) === '$');
        },

        parseKey: function (text) {
            try {
                return text.substring(1);
            } catch (e) {
                return undefined;
            }
        },

        parseProperty: function (prop) {
            if (Language.isKey(prop)) {
                return Language.getTextByKey(Language.parseKey(prop));
            } else {
                return prop;
            }
        },

        /**
        * @method
        * @async
        * (Asynchronous) method to pass the human readable unit symbol of a unit code to a callback function
        * @param {String} unitCode Common code of unit (UN/CEFACT)
        * @param {Function} callback
        * @param {String} callback.argument1 human readable unit symbol
        */
        pipeAsyncUnitSymbol: function (unitCode, callback) {
            //console.log('pipeAsyncUnitSymbol for :' + unitCode);
            if (unitCode !== undefined) {
                if (_unitSymbols[unitCode] !== undefined) {
                    if (callback !== undefined) {
                        callback(_unitSymbols[unitCode]);
                    }
                } else if (_pending[unitCode] !== undefined) {
                    _waitForSymbol(unitCode, callback);
                } else {
                    _loadSymbol(unitCode, callback);
                }
            } else if (callback !== undefined) {
                callback(undefined);
            }
        }
    };

    function _waitForSymbol(unitCode, callback) {
        $.when(
            _pending[unitCode].promise()
        ).then(function (symbol) {
            if (callback !== undefined) {
                callback(symbol);
            }
        });
    }

    function _loadSymbol(unitCode, callback) {
        _pending[unitCode] = $.Deferred();
        _runtimeService.getUnitSymbols(_current.key, [unitCode + ''], function (response) {
            if (response.unitSymbols[unitCode] !== undefined) {
                _unitSymbols[unitCode] = response.unitSymbols[unitCode];
            }
            _pending[unitCode].resolve(_unitSymbols[unitCode]);
            _pending[unitCode] = undefined;
            callback(_unitSymbols[unitCode]);
        });
    }

    /*
    /* PRIVATE
    */

    var _languages = {},
		_current = { version: 0 },
		_texts = {},
		_unitSymbols = { "GRM": "g", "DJ": "dag", "KGM": "kg", "ONZ": "oz", "LBR": "lb", "MMT": "mm", "DMT": "dm", "CMT": "cm", "4H": "µm", "MTR": "m", "INH": "in", "M7": "µin", "FOT": "ft", "YRD": "yd", "PAL": "Pa", "KPA": "kPa", "BAR": "bar", "HBA": "hbar", "MBR": "mbar", "KBA": "kbar", "CEL": "°C", "FAH": "°F", "KEL": "K", "MMQ": "mm³", "CMQ": "cm³", "DMQ": "dm³", "INQ": "in³", "FTQ": "ft³", "YDQ": "yd³", "AMP": "A", "B22": "kA", "H38": "MA", "4K": "mA", "B84": "µA", "C39": "nA", "WTT": "W", "KWT": "kW", "MAW": "MW", "JOU": "J", "KJO": "kJ", "WHR": "W·h", "MWH": "MW·h", "KWH": "kW·h" },
        _pending = {},
		_isChange = false,
        _deferred,
        _runtimeService, _newKey;

    function _finish(success, message) {
        if (success === true) {
            _deferred.resolve(message);
        } else {
            _deferred.reject(message);
        }
    }

    function _initialLoad() {
        _isChange = false;
        //window.performanceMonitor.profile('language_loadLanguages', { state: "started" });
        _runtimeService.loadLanguages(_loadLanguages_responseHandler);
    }

    function _allTextsLoad() {
        //window.performanceMonitor.profile('language_loadUserTexts', { state: "started" });
        _runtimeService.loadTexts(_current.key, _loadTexts_responseHandler, { type: 'user' });
    }

    function _loadLanguages_responseHandler(response) {
        //console.log('Language._loadLanguages_responseHandler:', response);
        //window.performanceMonitor.profile('language_loadLanguages', { state: "finished" });
        if (response.success === true) {
            _languages = {
                languages: response.languages,
                current_language: response.current_language
            };
            _current.key = _languages.current_language;
            //window.performanceMonitor.profile('language_getUnitSymbols', { state: "started" });
            //window.performanceMonitor.profile('language_loadSystemTexts', { state: "started" });
            _runtimeService.getUnitSymbols(_current.key, Object.keys(_unitSymbols), _getUnitSymbols_responseHandler);
            _runtimeService.loadSystemTexts(_current.key, _loadTexts_responseHandler, { type: 'system' });
        } else {
            _finish(false, 'languages load error');
        }
    }

    function _switchLanguage_responseHandler(response) {
        //console.log('_switchLanguage_responseHandler:', response);
        if (response.success === true) {
            _current.key = _newKey;
            _runtimeService.getUnitSymbols(_current.key, Object.keys(_unitSymbols), _getUnitSymbols_responseHandler);
            _runtimeService.loadTexts(_current.key, _loadTexts_responseHandler, { type: 'switch' });
            _deferred.resolve({ success: true });
        } else {
            console.iatWarn('service switchLanguage failed!');
            document.body.dispatchEvent(new CustomEvent(BreaseEvent.LANGUAGE_CHANGED, { detail: { currentLanguage: _current.key } }));
            _deferred.resolve({ success: false });
        }
    }

    function _loadTexts_responseHandler(response) {
        _texts = response;
        if (_isChange) {
            _isChange = false;
            document.body.dispatchEvent(new CustomEvent(BreaseEvent.LANGUAGE_CHANGED, { detail: { currentLanguage: _current.key } }));
        } else {
            _finish(true, 'languages and texts loaded successfully');
            document.body.dispatchEvent(new CustomEvent(BreaseEvent.LANGUAGE_LOADED, { detail: { currentLanguage: _current.key } }));
        }
    }

    function _getUnitSymbols_responseHandler(response) {
        //console.log('_getUnitSymbols_responseHandler:', JSON.stringify(response));
        //window.performanceMonitor.profile('language_getUnitSymbols', { state: "finished" });
        if (response.unitSymbols) {
            _unitSymbols = response.unitSymbols;
        } else {
            throw new Error('error on fetching unit symbols!');
        }
    }

    function _containsSnippet(text) {
        return (text !== undefined && text.indexOf('{') !== -1);
    }

    return Language;

});