/*global define,brease,_*/
define(['brease/events/BreaseEvent'], function (BreaseEvent) {

    'use strict';

    /**
	* @class brease.controller.PopUpManager
	* Helper class for overlays, which derive from Window widget.  
    * Attention: the calculation of the highest z-index only works for widgets, which derive from Window widget and have their DOM element outside the appContainer!
	* @singleton
	*/
    var PopUpManager = {

        init: function () {
            _update();
            _updateDimensions();
            document.body.addEventListener(BreaseEvent.APP_RESIZE, _.debounce(_updateDimensions, 200));
            $(window).on('resize', _.debounce(_updateDimensions, 200));
        },

        /**
		* @method addWindow
		* @param {String} widgetId
		* add widget-id to list of opened windows
		*/
        addWindow: function (widgetId, type) {
            if (!_windows[widgetId]) {
                _windows[widgetId] = {
                    id: widgetId,
                    type: type,
                    index: _index += 1
                };
            }
        },

        /**
		* @method getNumberOfWindowsOfType
		* @param {String} type supported types: 'MessageBox', 'DialogWindow'
		* @return {Integer} number of open windows of specified type
		*/
        getNumberOfWindowsOfType: function (type) {
            var nr = 0;
            for (var widgetId in _windows) {

                if (_windows[widgetId] && _windows[widgetId].type === type) {
                    nr += 1;
                }
            }
            return nr;
        },

        /**
		* @method removeWindow
		* @param {String} widgetId
		* remove widget-id of list of opened windows
		*/
        removeWindow: function (widgetId) {
            delete _windows[widgetId];
        },

        /**
		* @method overlays
		* @param {String} widgetId
		* get all opened windows, which have higher z-index
		*/
        overlays: function (widgetId) {
            var overlays = [],
                index = 0;

            if (_windows[widgetId]) {
                index = _windows[widgetId].index;
                for (var id in _windows) {
                    if (_windows[id] && _windows[id].index > index) {
                        overlays.push(_windows[id].id);
                    }
                }
            }
            return overlays;
        },

        /**
        * @method getHighestZindex
        * Method to find highest used z-index.
        */
        getHighestZindex: function () {
            _update();
            _maxIndex += 1;
            return _maxIndex;
        },

        update: function () {
            _update();
            _updateDimensions();
        },

        getDimensions: function () {
            return {
                winWidth: _dimensions.winWidth,
                winHeight: _dimensions.winHeight,
                appWidth: _dimensions.appWidth,
                appHeight: _dimensions.appHeight
            };
        }

    };

    var _maxIndex = -1,
		_windows = {},
        _index = 0,
        _pending = false,
        _dimensions = {};

    function _update() {
        if (!_pending) {
            _pending = true;
            window.setTimeout(_setHighestZindex, 0);
        }
    }

    function _updateDimensions() {
        _dimensions = {
            winWidth: window.innerWidth,
            winHeight: window.innerHeight,
            appWidth: brease.appView.innerWidth(),
            appHeight: brease.appView.innerHeight()
        };
    }

    function _setHighestZindex() {
        _pending = false;

        var collection = document.querySelectorAll('body > [class],body > [style],body > [id]'),
            maxIndex = 0,
            zIndex = 0,
            l = collection.length;

        for (var i = l - 1; i >= 0; i -= 1) {
            zIndex = parseFloat(_getCSS(collection[i], 'z-index'));
            if (zIndex > maxIndex) {
                maxIndex = zIndex;
            }
        }

        _maxIndex = maxIndex;
    }

    function _getCSS(elem, propName) {
        return window.getComputedStyle(elem).getPropertyValue(propName);
    }

    PopUpManager.init();

    return PopUpManager;

});