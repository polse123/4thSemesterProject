/*global define,brease,console,CustomEvent,_,Globalize*/
define(['brease/events/BreaseEvent', 'brease/core/Utils', 'brease/config', 'globalize'], function (BreaseEvent, Utils, config) {

    'use strict';

    /**
    * @class brease.services.Culture
    * @extends core.javascript.Object
    * Culture service; available via brease.culture 
    * @singleton
    */
    var Culture = {

        init: function () {
            document.body.addEventListener(BreaseEvent.LANGUAGE_CHANGED, _langChangeHandler);
            return this;
        },

        isReady: function () {
            var deferred = $.Deferred();

            _switchTo(brease.language.getCurrentLanguage(), false, deferred);

            return deferred.promise();
        },

        /**
        * @method getCurrentCulture
        * Method to get current selected culture
        * @return {Object} 
        * @return {String} return.key
        * @return {Object} return.culture
        */
        getCurrentCulture: function () {

            return _currentCulture;
        },

        /**
        * @method switchCulture
        * Method to change current selected culture
        * @param {String} key key of an available culture (e.g. 'de')
        */
        switchCulture: function (key) {
            _switchTo(key, true);
        },

        findClosestCulture: function (key) {
            var deferred = $.Deferred();
            var culture = Globalize.findClosestCulture(key);

            if (culture !== null) {
                deferred.resolve(culture);
            } else {
                require(['libs/cultures/globalize.culture.' + key], function () {
                    deferred.resolve(Globalize.findClosestCulture(key));
                }, function () {
                    deferred.resolve(Globalize.cultures.default);
                });
            }
            return deferred.promise();
        },

        defaultCulture: {
            key: Globalize.cultures.default.name,
            culture: Globalize.cultures.default
        }
    };

    var _currentCulture = {};

    function _setCurrentCulture(culture) {
        Globalize.culture(culture.name);
        _currentCulture = {
            key: culture.name,
            culture: culture
        };
    }

    function _switchTo(key, dispatchEvent, deferred) {

        $.when(
            brease.culture.findClosestCulture(key)
        ).then(function (culture) {
            _setCurrentCulture(culture);
            if (dispatchEvent === true) {
                document.body.dispatchEvent(new CustomEvent(BreaseEvent.CULTURE_CHANGED, { detail: { currentCulture: _currentCulture.key } }));
            }
            if (deferred) {
                deferred.resolve();
            }
        });

    }

    function _langChangeHandler() {

        _switchTo(brease.language.getCurrentLanguage(), true);
    }

    return Culture;

});