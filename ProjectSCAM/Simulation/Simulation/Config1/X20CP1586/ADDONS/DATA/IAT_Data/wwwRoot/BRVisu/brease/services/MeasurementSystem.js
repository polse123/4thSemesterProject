/*global define,brease,console,CustomEvent,_*/
define(['brease/events/BreaseEvent', 'brease/core/Utils'], function (BreaseEvent, Utils) {

    'use strict';

    /**
	* @class brease.services.MeasurementSystem
	* @extends core.javascript.Object
	* MeasurementSystem service; available via brease.measurementSystem 
	* 
	* @singleton
	*/
    var MeasurementSystem = {

        init: function (runtimeService) {
            _runtimeService = runtimeService;
            return this;
        },

        isReady: function () {
            _loadDeferred = $.Deferred();
            _load();
            return _loadDeferred.promise();
        },

        /**
		* @method getMeasurementSystems
		* Method to get all loaded Measurement-Systems
		* @return {Object}
		*/
        getMeasurementSystems: function () {

            return Utils.deepCopy(_mms);
        },

        updateMeasurementSystems: function () {
            _updateDeferred = $.Deferred();
            if (_currentLanguage !== brease.language.getCurrentLanguage()) {
                _runtimeService.loadMeasurementSystemList(_updateMeasurementSystemList_responseHandler);
                _currentLanguage = brease.language.getCurrentLanguage();
            } else {
                _updateDeferred.reject('language is current');
            }

            return _updateDeferred.promise();

        },

        /**
		* @method getCurrentMeasurementSystem
		* Method to get current selected Measurement-System
		* @return {Object}
		*/
        getCurrentMeasurementSystem: function () {

            return _currentMeasurementSystem;
        },

        /**
		* @method switchMeasurementSystem
		* Method to change current selected Measurement-System
		* @param {String} key Key of one available Measurement-System (e.g. 'metric')
		*/
        switchMeasurementSystem: function (key) {
            //console.log('switchMeasurementSystem:', key);
            _switchDeferred = $.Deferred();
            if (_mms[key] === undefined) {
                console.iatWarn('Measurement-System \u00BB' + key + '\u00AB is not defined!');
                _switchDeferred.resolve({ success: false });

            } else if (_currentMeasurementSystem === key) {
                console.iatInfo('Measurement-System \u00BB' + key + '\u00AB is current!');
                _switchDeferred.resolve({ success: true });

            } else {
                _runtimeService.switchMeasurementSystem(key, _switchMeasurementSystem_responseHandler, { newKey: key });

            }

            return _switchDeferred.promise();
        }
    };

    /*
	/* PRIVATE
	*/

    var _mms = {},
		_currentMeasurementSystem = '',
		_currentLanguage,
		_switchDeferred,
		_loadDeferred,
        _updateDeferred,
		_runtimeService;

    function _finish(deferred, success, message) {

        if (success === true) {
            deferred.resolve(message);
        } else {
            deferred.reject(message);
        }
    }

    function _load() {

        _runtimeService.loadMeasurementSystemList(_loadMeasurementSystemList_responseHandler);
    }

    function _loadMeasurementSystemList_responseHandler(response) {

        if (_.isObject(response) && response.success === true) {
            //console.log('_loadMeasurementSystemList_responseHandler:', response);
            _mms = response.measurementSystemList;
            _currentMeasurementSystem = response.current_measurementSystem;
            document.body.dispatchEvent(new CustomEvent(BreaseEvent.MEASUREMENT_SYSTEM_LOADED, { detail: { currentMeasurementSystem: _currentMeasurementSystem } }));
            _finish(_loadDeferred, true);
        } else {
            _finish(_loadDeferred, false, 'MeasurementSystems load error');
        }
    }

    function _updateMeasurementSystemList_responseHandler(response) {

        if (_.isObject(response) && response.success === true) {
            //console.log('_loadMeasurementSystemList_responseHandler:', response);
            _mms = response.measurementSystemList;
            _currentMeasurementSystem = response.current_measurementSystem;
            document.body.dispatchEvent(new CustomEvent(BreaseEvent.MEASUREMENT_SYSTEM_LOADED, { detail: { currentMeasurementSystem: _currentMeasurementSystem } }));
            _finish(_updateDeferred, true);
        } else {
            _finish(_updateDeferred, false, 'MeasurementSystems load error');
        }
    }

    function _switchMeasurementSystem_responseHandler(response, callbackInfo) {
        //console.log('_switchMeasurementSystem_responseHandler:', callbackInfo);
        if (response.success === true) {
            _currentMeasurementSystem = callbackInfo.newKey;
            _switchDeferred.resolve({ success: true });
        } else {
            console.iatWarn('service switchMeasurementSystem failed!');
            _switchDeferred.resolve({ success: false });
        }
        document.body.dispatchEvent(new CustomEvent(BreaseEvent.MEASUREMENT_SYSTEM_CHANGED, { detail: { currentMeasurementSystem: _currentMeasurementSystem } }));
    }

    return MeasurementSystem;

});

/**
* @class brease.config.MeasurementSystemUnit
* @extends Object
* @embeddedClass
* @virtualNote
* brease.config.UnitCode for every measurement system.  
*
* Example:
*
*       {'metric': 'GRM','imperial': 'ONZ','imperial-us': 'ONZ'}
*
* Unit codes are CEFACT Common Codes.  
*/

/**
* @property {brease.config.UnitCode} metric
*/
/**
* @property {brease.config.UnitCode} imperial
*/
/**
* @property {brease.config.UnitCode} imperial-us
*/

/**
* @class brease.config.UnitCode
* @extends String
* @embeddedClass
* @virtualNote
* CEFACT Common Code of a unit  
* e.g.
*
*       CMT         (for cm)
*       KGM         (for kg)
*       WTT         (for W)
*
* <template>See <a href="../../../../unitsystem/units.htm">available units</a> and <a href="../../firstproject/page_shownode.html">unit guideline</a>.</template>
*/

/**
* @class brease.config.MeasurementSystemFormat
* @extends Object
* @embeddedClass
* @virtualNote
* brease.config.NumberFormat for every measurement system.  
*
* Example:
*
*       {'metric':{ 'decimalPlaces': 2, 'minimumIntegerDigits':2 }, 
*       'imperial':{ 'decimalPlaces': 3, 'minimumIntegerDigits':1 }, 
*       'imperial-us':{ 'decimalPlaces': 1, 'minimumIntegerDigits':1 }}
*
*/

/**
* @property {brease.config.NumberFormat} metric
*/
/**
* @property {brease.config.NumberFormat} imperial
*/
/**
* @property {brease.config.NumberFormat} imperial-us
*/