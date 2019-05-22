/*global define,brease,CustomEvent,_*/
define(['brease/core/BaseWidget', 'brease/events/BreaseEvent'], function (SuperClass, BreaseEvent) {

    'use strict';

    /**
    * @class brease.core.ContainerWidget
    * @abstract
    * Base class for all container widgets.  
    * It should not usually be necessary to use this widget directly, because there are provided subclasses  
    * which implement specialized widget use cases which cover application needs.  
    * @extends brease.core.BaseWidget 
    *
    * @iatMeta studio:visible
    * false
    */

    /**
    * @property {WidgetList} children=["*"]
    * @inheritdoc  
    */
    var defaultSettings = {},

        WidgetClass = SuperClass.extend(function ContainerWidget() {
            SuperClass.apply(this, arguments);
        }, defaultSettings),

        p = WidgetClass.prototype;

    WidgetClass.widgetAddedHandler = 'widgetAddedHandler';
    WidgetClass.widgetRemovedHandler = 'widgetRemovedHandler';

    p.init = function () {

        this.el.wrapInner('<div class="container" />');
        this.getContainer();
        addListener.call(this);
        SuperClass.prototype.init.apply(this, arguments);

        this.debouncedRefresh = _.debounce(this._refresh.bind(this), 100);
    };

    p.disable = function () {
        SuperClass.prototype.disable.apply(this, arguments);
        if (this.initialized !== true) {
            selectChildren(this.getContainer()).each(function () {
                if (brease.uiController.callWidget(this.id, "setParentEnableState", false) === null) {
                    brease.uiController.addWidgetOption(this.id, 'parentEnableState', false);
                }
            });
        }
    };

    p._enableHandler = function () {
        SuperClass.prototype._enableHandler.apply(this, arguments);
        var disabled = this.isDisabled;

        selectChildren(this.getContainer()).each(function () {
            brease.uiController.callWidget(this.id, "setParentEnableState", !disabled);
        });
    };

    p.updateVisibility = function () {
        var hidden = this.isHidden;
        SuperClass.prototype.updateVisibility.apply(this, arguments);
        if (this.isHidden !== hidden) {
            hidden = this.isHidden;

            selectChildren(this.getContainer()).each(function () {
                brease.uiController.callWidget(this.id, "setParentVisibleState", !hidden);
            });
        }
        this.elem.dispatchEvent(new CustomEvent(BreaseEvent.VISIBILITY_CHANGED, { bubbles: false, detail: { visible: !this.isHidden } }));
    };

    p.visibilityChangeHandler = function (e) {
        if (this.scroller && ($.contains(e.target, this.elem) || e.target === this.elem || $.contains(this.elem, e.target))) {
            this.debouncedRefresh();
        }
    };

    p._refresh = function () {
        if (this.scroller && !this.isHidden) {
            this.scroller.refresh();
        }
    };

    p.dispose = function () {
        removeListener.call(this);
        SuperClass.prototype.dispose.apply(this, arguments);
    };

    p.wake = function () {
        SuperClass.prototype.wake.apply(this, arguments);
        document.body.addEventListener(BreaseEvent.VISIBILITY_CHANGED, this._bind('visibilityChangeHandler'), true);
    };

    p.suspend = function () {
        document.body.removeEventListener(BreaseEvent.VISIBILITY_CHANGED, this._bind('visibilityChangeHandler'), true);
        SuperClass.prototype.suspend.apply(this, arguments);
    };

    p.getContainer = function () {
        if (this.container === undefined) {
            this.container = this.el.find('>.container');
        }
        return this.container;
    };

    p[WidgetClass.widgetAddedHandler] = function () { };

    p[WidgetClass.widgetRemovedHandler] = function () { };

    function addListener() {
        if (brease.config.editMode === true) {
            this.elem.addEventListener(BreaseEvent.WIDGET_ADDED, this._bind(WidgetClass.widgetAddedHandler));
            this.elem.addEventListener(BreaseEvent.WIDGET_REMOVED, this._bind(WidgetClass.widgetRemovedHandler));
        }
        document.body.addEventListener(BreaseEvent.VISIBILITY_CHANGED, this._bind('visibilityChangeHandler'), true);
    }

    function removeListener() {
        if (brease.config.editMode === true) {
            this.elem.removeEventListener(BreaseEvent.WIDGET_ADDED, this._bind(WidgetClass.widgetAddedHandler));
            this.elem.removeEventListener(BreaseEvent.WIDGET_REMOVED, this._bind(WidgetClass.widgetRemovedHandler));
        }
        document.body.removeEventListener(BreaseEvent.VISIBILITY_CHANGED, this._bind('visibilityChangeHandler'), true);
    }

    function selectChildren(container) {
        var children = container.find('[data-brease-widget]');
        if (children.length > 0) {
            children = children.first().parent().children('[data-brease-widget]');
        }
        return children;
    }

    return WidgetClass;

});