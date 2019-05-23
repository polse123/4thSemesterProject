/*global define*/
define(['brease/core/Decorator', 'brease/events/BreaseEvent', 'brease/enum/Enum'], function (Decorator, BreaseEvent, Enum) {

    'use strict';

    var LanguageDependency = function LanguageDependency() {
        this.initType = Decorator.TYPE_PRE;
    },
    dependency = "language",
    changeHandler = "langChangeHandler";

    /**
    * @class brease.decorators.LanguageDependency
    * @extends brease.core.Decorator
    * #Description
    * A decorator class to add functionality of language dependency to widgets.
    * ##Example:  
	*
	*     define(function (require) {
	*        var SuperClass = require('brease/core/BaseWidget'),
	*            languageDependency = require('brease/decorators/LanguageDependency'), 
	*            [...]
	*     
	*        return languageDependency.decorate(WidgetClass);
	*     });
	*
	*
    * @iatMeta studio:visible
    * false
    */

    /**
    * @method decorate
    * decorate a widget class with functionality of language dependency
    * @param {brease.core.WidgetClass} widgetClass
    * @param {Boolean} initialDependency Initial dependency of widget instances
    * @return {brease.core.WidgetClass} returns decorated WidgetClass
    */
    LanguageDependency.prototype = new Decorator();
    LanguageDependency.prototype.constructor = LanguageDependency;

    var instance = new LanguageDependency();

    /**
    * @property {Object} methodsToAdd
    * @property {Function} methodsToAdd.setLangDependency
    * @property {Boolean} methodsToAdd.setLangDependency.flag  
    * Enable or disable language dependency; dependent widgets listen to Language changes and execute method *langChangeHandler* on changes
    */
    instance.methodsToAdd = {

        init: function (initialDependency) {
            if (this[changeHandler] === undefined) {
                throw new Error('widget \u00BB' + this.elem.id + '\u00AB: decoration with "' + instance.constructor.name + '" requires method "' + changeHandler + '"');
            }
            var widget = this;
            this.dependencies[dependency] = {
                state: Enum.Dependency.INACTIVE,
                stored: {},
                suspend: function () {
                    if (widget.dependencies[dependency].state === Enum.Dependency.ACTIVE) {
                        widget.dependencies[dependency].stored.key = brease.language.getCurrentLanguage();
                        widget.dependencies[dependency].stored.version = brease.language.getCurrentVersion();
                        setState.call(widget, Enum.Dependency.SUSPENDED);
                    }
                },
                wake: function (e) {
                    if (widget.dependencies[dependency].state === Enum.Dependency.SUSPENDED) {
                        setState.call(widget, Enum.Dependency.ACTIVE);
                        if (widget.dependencies[dependency].stored.key !== brease.language.getCurrentLanguage() || widget.dependencies[dependency].stored.version !== brease.language.getCurrentVersion()) {
                            widget[changeHandler].call(widget, e);
                        }
                    }
                }
            };
            if (initialDependency === true) {
                this.setLangDependency(initialDependency);
            }
        },

        setLangDependency: function (flag) {
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
        //console.log('%c' + this.elem.id + '.dependencies[' + dependency + '].state=' + state, 'color:#00cccc');
        this.dependencies[dependency].state = state;
        if (state === Enum.Dependency.ACTIVE) {
            addListener.call(this);
        } else {
            removeListener.call(this);
        }
    }

    function addListener() {
        document.body.addEventListener(BreaseEvent.LANGUAGE_CHANGED, this._bind(changeHandler));
    }

    function removeListener() {
        document.body.removeEventListener(BreaseEvent.LANGUAGE_CHANGED, this._bind(changeHandler));
    }

    return instance;
});