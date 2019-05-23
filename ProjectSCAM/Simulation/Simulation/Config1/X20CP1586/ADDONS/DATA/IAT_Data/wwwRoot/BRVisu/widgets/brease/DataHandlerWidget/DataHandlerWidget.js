/*global define,brease,console,CustomEvent,_*/
define(['brease/core/BaseWidget', 'brease/events/BreaseEvent', 'brease/enum/Enum', 'brease/core/Utils'], function (SuperClass, BreaseEvent, Enum, Utils) {

    'use strict';

    /**
    * @class widgets.brease.DataHandlerWidget
    * @abstract
    * #Description
    * Base class for all dataContainer Widgets --> e.g. BarChart, PieChart,...
    * @extends brease.core.BaseWidget
    * @iatMeta studio:visible
    * false
    *
    */

    var defaultSettings = {
        childrenInitialized: false,
        childrenList: [],
        childrenIdList: []
    },

    WidgetClass = SuperClass.extend(function DataHandlerWidget() {
        SuperClass.apply(this, arguments);
    }, defaultSettings),

    p = WidgetClass.prototype;

    p.init = function () {

        if (brease.config.editMode) {
            _initEditor(this);
        } else {
            _initChildren(this);
        }

        SuperClass.prototype.init.apply(this, arguments);
    };

    p.childrenInitializedHandler = function () {
        //can be overwritten in the derived Widgets to trigger eg. creating the renderer,...
        var widget = this;

        this.settings.childrenIdList.forEach(function (id) {
            var childrenWidget = brease.callWidget(id, 'widget');
            widget.settings.childrenList.push(childrenWidget);
        });

        this.settings.childrenIdList.forEach(function (id) {
            var childrenWidget = brease.callWidget(id, 'widget');
            if (Utils.isFunction(childrenWidget.setParentWidget)) {
                childrenWidget.setParentWidget(widget);
            }
        });

        var childrenReady = this.createEvent("WIDGET_CHILDREN_READY");
        childrenReady.dispatch();
    };

    p.getChildrenList = function () {
        return this.settings.childrenList;
    };

    p.getChildrenInitialized = function () {
        return this.settings.childrenInitialized;
    };

    p.childrenAdded = function (event) {
        if (event.target === this.elem) {
            var childrenWidgetId = event.detail.widgetId,
                childrenWidget = brease.callWidget(childrenWidgetId, 'widget');
            this.settings.childrenIdList.push(childrenWidgetId);
            this.settings.childrenList.push(childrenWidget);
        }
    };

    p.childrenRemoved = function (event) {
        if (event.target === this.elem) {
            var childrenWidgetId = event.detail.widgetId,
                childrenWidget = brease.callWidget(childrenWidgetId, 'widget'),
                index = this.settings.childrenList.indexOf(childrenWidget);
            if (index > -1) {
                this.settings.childrenList.splice(index, 1);
            }
        }
    };

    p.dispose = function () {
        _removeListener(this);
        SuperClass.prototype.dispose.apply(this, arguments);
    };

    p.enable = function () {
        SuperClass.prototype.enable.call(this, arguments);
        if (this.settings.childrenInitialized || brease.config.editMode) {
            _setChildWidgetEnableState(this);
        }

    };

    p.disable = function () {
        SuperClass.prototype.disable.call(this, arguments);
        if (this.settings.childrenInitialized || brease.config.editMode) {
            _setChildWidgetEnableState(this);
        }
    };

    //Private functions

    function _initChildren(widget) {
        widget.itemDefs = [];

        widget.el.find('[data-brease-widget]').each(function () {
            var children = this,
                id = children.id,
                d = $.Deferred();

            widget.itemDefs.push(d);
            widget.settings.childrenIdList.push(id);

            if (brease.uiController.getWidgetState(id) >= Enum.WidgetState.INITIALIZED && brease.uiController.getWidgetState(id) !== Enum.WidgetState.SUSPENDED) {
                d.resolve();
            } else {
                children.addEventListener(BreaseEvent.WIDGET_INITIALIZED, function (e) {
                    d.resolve();
                });
            }
        });

        $.when.apply($, widget.itemDefs).done(function () {
            widget.settings.childrenInitialized = true;
            _setChildWidgetEnableState(widget);
            widget.childrenInitializedHandler();
        });
    }

    function _setChildWidgetEnableState(widget) {
        widget.settings.childrenIdList.forEach(function (id) {
            brease.uiController.callWidget(id, "setParentEnableState", !widget.isDisabled);
        });
    }

    function _initEditor(widget) {
        if (brease.config.editMode === true) {
            widget.elem.addEventListener(BreaseEvent.WIDGET_ADDED, widget._bind(widget.childrenAdded));
            widget.elem.addEventListener(BreaseEvent.WIDGET_REMOVED, widget._bind(widget.childrenRemoved));
        }
    }

    function _removeListener(widget) {
        if (brease.config.editMode === true) {
            widget.elem.removeEventListener(BreaseEvent.WIDGET_ADDED, widget._bind(widget.childrenAdded));
            widget.elem.removeEventListener(BreaseEvent.WIDGET_REMOVED, widget._bind(widget.childrenRemoved));
        }
    }

    return WidgetClass;

});