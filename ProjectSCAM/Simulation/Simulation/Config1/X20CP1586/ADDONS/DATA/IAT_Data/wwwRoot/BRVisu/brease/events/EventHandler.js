/*global define,CustomEvent*/
define(['brease/events/BreaseEvent'], function (BreaseEvent) {
    'use strict';
    var _runtimeService, _bindingController,


	/**
	* @class brease.events.EventHandler
	* @extends Object
	* Handles events on the client
	* Example:
	*
	*         var EventHandler = require('brease/events/EventHandler');
    *
	*         var ev = new EventHandler('widgets.brease.Button.Event', 'button01' , 'Click', eventArgs, elem);
    *
    *         elem.addEventListener('Click', callbackFunction)
    *
    *         ev.dispatch();
    *
	*
	* @constructor
	* Creates a new Event instance.
	* @param {String} eventType event type
	* @param {String} refId ID of the event source
    * @param {String} eventName name of the event
	* @param {Object} eventArgs arguments which are provided with the event detail.
    * @param {HTMLElement} elem HTMLElement, required if event should be dispatched in DOM
	*/

	/**
	* @property {String} eventType (required) type of event; supported types: 'widgets.' and 'clientSystem.'; e.g. widgets.brease.Button.Event
	*/
	/**
	* @property {String} refId (optional)
	*/
	/**
	* @property {String} eventName (required) e.g. Click
	*/
	/**
	* @property {Object} eventArgs (optional)
	*/
    /**
	* @property {HTMLElement} elem (optional)
	*/
	EventHandler = function (eventType, refId, eventName, eventArgs, elem) {

	    this.data = {
	        event: eventName,
	        source: {
	            type: eventType,
	            refId: refId
	        },
	        eventArgs: eventArgs || {}
	    };
	    this.elem = elem;
	    this.isSubscribed = _isSubscribed(refId, eventType, eventName);
	    this.boundRevalidate = this.reValidate.bind(this);
	    document.body.addEventListener(BreaseEvent.CONTENT_ACTIVATED, this.boundRevalidate);

	},
	p = EventHandler.prototype;

    EventHandler.init = function (runtimeService, bindingController) {
        _runtimeService = runtimeService;
        _bindingController = bindingController;
    };

    p.dispose = function () {
        document.body.removeEventListener(BreaseEvent.CONTENT_ACTIVATED, this.boundRevalidate);
    };

    /**
	* @method setEventArgs
    * set event arguments
	* @param {Object} eventArgs
	*/
    p.setEventArgs = function (eventArgs) {
        this.data.eventArgs = eventArgs || {};
    };

    p.getEventArgs = function () {
        return this.data.eventArgs;
    };

    /**
   * @method dispatch
   * Dispatches event
   * @param {Boolean} useDom if true, event will be dispatched on elem in DOM
   */
    p.dispatch = function (useDom) {
        if (this.isSubscribed) {
            _runtimeService.sendEvent(this.data);
        }
        if (useDom !== false && this.elem !== undefined) {
            this.elem.dispatchEvent(new CustomEvent(this.data.event, { detail: this.data.eventArgs, bubbles: true }));
        }
    };

    p.reValidate = function () {
        this.isSubscribed = _isSubscribed(this.data.source.refId, this.data.source.type, this.data.event);
    };

    function _isSubscribed(refId, eventType, eventName) {
        var events,
            result = false;

        if (eventType.indexOf("widgets.") === 0) {
            events = _bindingController.getEventsForElement(refId, eventName);
            if (events) {
                result = true;
            }
        }
        else if (eventType.indexOf("clientSystem.") === 0) {
            result = _bindingController.isActiveSessionEvent(eventName);
        }
        return result;
    }

    return EventHandler;

});

