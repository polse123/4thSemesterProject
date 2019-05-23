/*global define*/
define(function () {

    'use strict';
    var propertyDefaults = {
        enumerable: true,
        configurable: false,
        writable: false
    },

    _defineProperty = function (obj, name, value) {
        propertyDefaults.value = value;
        Object.defineProperty(obj, name, propertyDefaults);
    };

    var eventNames = {};
    _defineProperty(eventNames, 'CLICK', 'vclick');
    _defineProperty(eventNames, 'MOUSE_DOWN', 'vmousedown');
    _defineProperty(eventNames, 'MOUSE_UP', 'vmouseup');
    _defineProperty(eventNames, 'MOUSE_MOVE', 'vmousemove');
    _defineProperty(eventNames, 'DBL_CLICK', 'dblclick');

    var BreaseEvent = function () {
        this.EDIT = {};
    },
    p = BreaseEvent.prototype;

    _defineProperty(p, 'eventNames', eventNames);
    _defineProperty(p, 'support', {});

    p.init = function (editMode) {

        this.setEditMode(editMode);

        try { // testing the support of an options object in addEventlistener
            document.createElement("div").addEventListener("test", function () { }, { get capture() { breaseEvent.support.options = true; return false; }});
        } catch (e) {
            breaseEvent.support.options = false;
        }
        delete p.init;
    };

    p.setEditMode = function (editMode) {

        for (var name in this.eventNames) {
            this.EDIT[name] = (editMode === true) ? this.eventNames[name] : 'notAvailable';
            this[name] = (editMode === true) ? 'notAvailable' : this.eventNames[name];
        }
    };

    /** 
    * @enum {String} brease.events.BreaseEvent 
    */
    var breaseEvent = new BreaseEvent();

    /**
    * @property {string} APP_READY='app_ready'
    * @readonly
    * @static
    */
    _defineProperty(breaseEvent, 'APP_READY', 'app_ready');
    _defineProperty(breaseEvent, 'APP_RESIZE', 'app_resize');
    _defineProperty(breaseEvent, 'UI_READY', 'ui_ready');
    _defineProperty(breaseEvent, 'BINDING_LOADED', 'binding_loaded');
    _defineProperty(breaseEvent, 'EVENTBINDING_LOADED', 'eventbinding_loaded');
    _defineProperty(breaseEvent, 'CONTENT_ACTIVATED', 'ContentActivated');
    _defineProperty(breaseEvent, 'VISU_ACTIVATED', 'VisuActivated');
    _defineProperty(breaseEvent, 'VISU_DEACTIVATED', 'VisuDeactivated');
    _defineProperty(breaseEvent, 'CONNECTION_STATE_CHANGED', 'ConnectionStateChanged');

    /**
    * @property {string} RESOURCES_LOADED='resources_loaded'
    * @readonly
    * @static
    */
    _defineProperty(breaseEvent, 'RESOURCES_LOADED', 'resources_loaded');

    //Language.js
    _defineProperty(breaseEvent, 'LANGUAGE_LOADED', 'language_loaded');
    _defineProperty(breaseEvent, 'LANGUAGE_CHANGED', 'language_changed');

    //Culture.js
    _defineProperty(breaseEvent, 'CULTURE_LOADED', 'culture_loaded');
    _defineProperty(breaseEvent, 'CULTURE_CHANGED', 'culture_changed');

    //MeasurementSystem.js
    _defineProperty(breaseEvent, 'MEASUREMENT_SYSTEM_LOADED', 'measurementSystem_loaded');
    _defineProperty(breaseEvent, 'MEASUREMENT_SYSTEM_CHANGED', 'measurementSystem_changed');

    //User.js
    _defineProperty(breaseEvent, 'USER_CHANGED', 'user_changed');
    _defineProperty(breaseEvent, 'USER_LOADED', 'user_loaded');
    _defineProperty(breaseEvent, 'ROLES_CHANGED', 'roles_changed');

    //Scroller.js
    _defineProperty(breaseEvent, 'SCROLL_START', 'scrollStart');
    _defineProperty(breaseEvent, 'SCROLL_END', 'scrollEnd');
    /**
    * @property {string} VISIBILITY_CHANGED='visibility_changed'
    * @readonly
    * @static
    */
    _defineProperty(breaseEvent, 'VISIBILITY_CHANGED', 'visibility_changed');

    //Logger.js
    _defineProperty(breaseEvent, 'LOG_MESSAGE', 'log_message');

    //UIController
    /**
    * @property {string} CONTENT_PARSED='content_parsed'
    * @readonly
    * @static
    */
    _defineProperty(breaseEvent, 'CONTENT_PARSED', 'content_parsed');

    /**
    * @property {string} CONTENT_READY='content_ready'
    * @readonly
    * @static
    */
    _defineProperty(breaseEvent, 'CONTENT_READY', 'content_ready');

    /**
    * @property {string} PROPERTY_CHANGED='property_changed'
    * @readonly
    * @static
    */
    _defineProperty(breaseEvent, 'PROPERTY_CHANGED', 'property_changed');
    _defineProperty(breaseEvent, 'INITIAL_VALUE_CHANGE_FINISHED', 'PropertyValueChangedFinished');
    /**
    * @property {string} WIDGET_READY='widget_ready'
    * @readonly
    * @static
    */
    _defineProperty(breaseEvent, 'WIDGET_READY', 'widget_ready');
    _defineProperty(breaseEvent, 'WIDGET_INITIALIZED', 'widget_initialized');
    _defineProperty(breaseEvent, 'WIDGET_DISPOSE', 'widget_dispose');
    _defineProperty(breaseEvent, 'WIDGET_UPDATED', 'widget_updated');
    _defineProperty(breaseEvent, 'WIDGET_ADDED', 'widget_added');
    _defineProperty(breaseEvent, 'WIDGET_REMOVED', 'widget_removed');
    _defineProperty(breaseEvent, 'PLUGIN_LOADED', 'plugin_loaded');

    // Windows
    _defineProperty(breaseEvent, 'CLOSED', 'window_closed');
    _defineProperty(breaseEvent, 'WINDOW_SHOW', 'window_show');

    //Table.js
    /**
    * @property {string} SORT_COMPLETED='sort_completed'
    * @readonly
    * @static
    */
    _defineProperty(breaseEvent, 'SORT_COMPLETED', 'sort_completed');
    /**
    * @property {string} ROW_SELECTED='row_selected'
    * @readonly
    * @static
    */
    _defineProperty(breaseEvent, 'ROW_SELECTED', 'row_selected');

    //Fragment.js
    /**
    * @property {string} FRAGMENT_LOADED='fragment_loaded'
    * @readonly
    * @static
    */
    _defineProperty(breaseEvent, 'FRAGMENT_LOADED', 'fragment_loaded');
    /**
    * @property {string} FRAGMENT_SHOW='fragment_show'
    * @readonly
    * @static
    */
    _defineProperty(breaseEvent, 'FRAGMENT_SHOW', 'fragment_show');
    /**
    * @property {string} FRAGMENT_HIDE='fragment_hide'
    * @readonly
    * @static
    */
    _defineProperty(breaseEvent, 'FRAGMENT_HIDE', 'fragment_hide');
    _defineProperty(breaseEvent, 'BEFORE_HIDE', 'fragment_before_hide');
    _defineProperty(breaseEvent, 'BEFORE_UNLOAD', 'fragment_before_unload');
    _defineProperty(breaseEvent, 'PAGE_CHANGE', 'pageChange');
    _defineProperty(breaseEvent, 'PAGE_LOADED', 'pageLoaded');
    _defineProperty(breaseEvent, 'THEME_CHANGED', 'theme_changed');
    _defineProperty(breaseEvent, 'NAVIGATION_DISPOSE', 'navDispose');
    /**
    * @property {string} LOAD_ERROR='load_error'
    * @readonly
    * @static
    */
    _defineProperty(breaseEvent, 'LOAD_ERROR', 'load_error');

    //Trend.js
    _defineProperty(breaseEvent, 'UPDATE_CURSOR_INTERSECTION', 'update_cursor_intersection');
    _defineProperty(breaseEvent, 'UPDATE_CURSOR', 'update_ursor');
    _defineProperty(breaseEvent, 'REMOVE_CURSOR', 'remove_cursor');
    _defineProperty(breaseEvent, 'VIEWPORT_CHANGE', 'viewport_changed');
    _defineProperty(breaseEvent, 'CURVE_CHANGE', 'curve_changed');

    _defineProperty(breaseEvent, 'SUBMIT', 'value_submit');
    /**
    * @property {string} CHANGE='change'
    * @readonly
    * @static
    */
    _defineProperty(breaseEvent, 'CHANGE', 'change');
    _defineProperty(breaseEvent, 'ATTRIBUTE_CHANGE', 'attribute_change');
    _defineProperty(breaseEvent, 'NODE_ATTRIBUTE_CHANGE', 'node_attribute_change');
    _defineProperty(breaseEvent, 'NUMBERFORMAT_CHANGE', 'numberFormat_change');
    _defineProperty(breaseEvent, 'GROUP_CHANGE', 'group_change');
    _defineProperty(breaseEvent, 'TICK', 'tick');
    _defineProperty(breaseEvent, 'ALERT', 'alert');
    _defineProperty(breaseEvent, 'TAP_HOLD', 'taphold');

    return breaseEvent;

});
