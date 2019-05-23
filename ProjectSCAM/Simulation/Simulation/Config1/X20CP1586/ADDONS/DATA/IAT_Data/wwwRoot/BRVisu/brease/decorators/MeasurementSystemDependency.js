/*global define*/
define(['brease/core/Decorator', 'brease/events/BreaseEvent', 'brease/enum/Enum'], function (Decorator, BreaseEvent, Enum) {

    'use strict';

    var MeasurementSystemDependency = function () {
        this.initType = Decorator.TYPE_PRE;
    },
        dependency = "mms",
        changeHandler = "measurementSystemChangeHandler";

    /**
    * @class brease.decorators.MeasurementSystemDependency
    * @extends brease.core.Decorator
    * #Description
    * A decorator class to add functionality of measurement system dependency to widgets.
    * ##Example:  
	*
	*     define(function (require) {
	*        var SuperClass = require('brease/core/BaseWidget'),
	*            measurementSystemDependency = require('brease/decorators/MeasurementSystemDependency'),    
	*            [...]
	*     
	*        WidgetClass = SuperClass.extend(function NumericInput() {
	*           SuperClass.apply(this, arguments);
	*        }, defaultSettings),
	*     
	*        p = WidgetClass.prototype;
	*     
	*        p.init = function () {
	*           [...]
	*        };
	*     
	*        p.measurementSystemChangeHandler = function () {
	*           [...]
	*        };
	*     
	*        return measurementSystemDependency.decorate(WidgetClass, true);
	*     });
	*
	*/

    /**
    * @method decorate
    * decorate a widget class with functionality of measurement system dependency
    * @param {brease.core.WidgetClass} widgetClass
    * @param {Boolean} initialDependency Initial dependency of widget instances
    * @return {brease.core.WidgetClass}
    */
    MeasurementSystemDependency.prototype = new Decorator();
    MeasurementSystemDependency.prototype.constructor = MeasurementSystemDependency;

    var instance = new MeasurementSystemDependency();

    /**
    * @property {Object} methodsToAdd
    * @property {Function} methodsToAdd.setMeasurementSystemDependency
    * @property {Boolean} methodsToAdd.setMeasurementSystemDependency.flag  
    * Enable or disable MeasurementSystem dependency; dependent widgets listen to MeasurementSystem changes and execute method *measurementSystemChangeHandler* on changes
    */
    instance.methodsToAdd = {

        init: function (initialDependency) {
            if (this[changeHandler] === undefined) {
                throw new Error('widget \u00BB' + this.elem.id + '\u00AB: decoration with "' + instance.constructor.name + '" requires method "' + changeHandler + '"');
            }
            var widget = this;
            this.dependencies[dependency] = {
                state: Enum.Dependency.INACTIVE,
                suspend: function () {
                    if (widget.dependencies[dependency].state === Enum.Dependency.ACTIVE) {
                        widget.dependencies[dependency].stored = brease.measurementSystem.getCurrentMeasurementSystem();
                        setState.call(widget, Enum.Dependency.SUSPENDED);
                    }
                },
                wake: function (e) {
                    if (widget.dependencies[dependency].state === Enum.Dependency.SUSPENDED) {
                        setState.call(widget, Enum.Dependency.ACTIVE);
                        if (widget.dependencies[dependency].stored !== brease.measurementSystem.getCurrentMeasurementSystem()) {
                            widget[changeHandler].call(widget, e);
                        }
                    }
                }
            };
            if (initialDependency === true) {
                this.setMeasurementSystemDependency(initialDependency);
            }
        },

        setMeasurementSystemDependency: function (flag) {
            if (flag === true) {
                setState.call(this, Enum.Dependency.ACTIVE);
            } else {
                setState.call(this, Enum.Dependency.INACTIVE);
            }
        },

        dispose: function () {
            this.dependencies[dependency] = null;
            removeListener.call(this);
        }

    };

    function setState(state) {
        //console.log('%c' + this.elem.id + '.dependencies[' + dependency + '].state=' + state, 'color:#cc00cc');
        this.dependencies[dependency].state = state;
        if (state === Enum.Dependency.ACTIVE) {
            addListener.call(this);
        } else {
            removeListener.call(this);
        }
    }

    function addListener() {
        document.body.addEventListener(BreaseEvent.MEASUREMENT_SYSTEM_CHANGED, this._bind(changeHandler));
    }

    function removeListener() {
        document.body.removeEventListener(BreaseEvent.MEASUREMENT_SYSTEM_CHANGED, this._bind(changeHandler));
    }

    return instance;
});