/*global define,brease,console,CustomEvent,_*/
define(function (require) {

    'use strict';

    var SuperClass = require('brease/core/ContainerWidget'),
		BreaseEvent = require('brease/events/BreaseEvent'),
        languageDependency = require('brease/decorators/LanguageDependency'),
		Enum = require('brease/enum/Enum'),
        Types = require('brease/core/Types'),
        Scroller = require('brease/helper/Scroller'),

    /**
    * @class widgets.brease.FlexBox
    * #Description
    * widget to group widgets with Label.   
	* @breaseNote 
    * @extends brease.core.ContainerWidget
    * @iatMeta studio:isContainer
    * true
    *
    * @iatMeta category:Category
    * Container
	* @iatMeta description:short
    * Rahmen mit Label
    * @iatMeta description:de
    * Zeigt einen Rahmen um eine Gruppe von Widgets; optional mit einem Beschriftungstext
    * @iatMeta description:en
    * Defines a frame/area where FlexBox item are placed and can expand/shrink as confifured
    */

    /**
    * @cfg {brease.enum.Direction} alignment='vertical'
    * @iatStudioExposed
    * @iatCategory Appearance
    * Alignment of the FlexBoxItems
    * horizontal: elements aligned from left to right.
    * vertical: elements aligned from top to bottom.
    */

    /**
    * @property {WidgetList} [children=["widgets.brease.FlexBoxItem"]]
    * @inheritdoc  
    */

    defaultSettings = {},

    WidgetClass = SuperClass.extend(function FlexBox() {
        SuperClass.apply(this, arguments);
    }, defaultSettings),

    p = WidgetClass.prototype;

    p.init = function () {

        if (this.settings.omitClass !== true) {
            this.addInitialClass('breaseFlexBox');
        }

        SuperClass.prototype.init.call(this);

        _setAlignmentClass(this);

        if (brease.config.editMode) {
            var EditorHandles = require('widgets/brease/FlexBox/libs/EditorHandles');
            var editorHandles = new EditorHandles(this);

            this.getHandles = function () {
                return editorHandles.getHandles();
            };
        }

    };

    /**
    * @method setAlignment
    * Sets alignment
    * @param {brease.enum.Direction} alignment
    */
    p.setAlignment = function (alignment) {
        this.settings.alignment = alignment;
        _setAlignmentClass(this);
    };

    /**
    * @method getAlignment 
    * Returns alignment.
    * @return {brease.enum.Direction}
    */
    p.getAlignment = function () {
        return this.settings.alignment;
    };

    //Private

    function _setAlignmentClass(widget) {
        widget.container.removeClass('vertical horizontal');
        if (widget.settings.alignment === Enum.Direction.horizontal) {
            widget.container.addClass('horizontal');
        }
        else {
            widget.container.addClass('vertical');
        }
    }

    return WidgetClass;

});