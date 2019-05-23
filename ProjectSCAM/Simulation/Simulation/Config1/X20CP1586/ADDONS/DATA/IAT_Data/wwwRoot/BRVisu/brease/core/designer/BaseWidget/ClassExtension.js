/*global define,require,console*/
define(['brease/core/Utils'], function (Utils) {

    'use strict';


    /**
    * @class brease.designer.BaseWidget.ClassExtension
    * @embeddedClass
    * @virtualNote 
    * Functionality of BaseWidget, available in editMode only. Available through the designer object of a widget instance.
    *
    *       var parentWidget = brease.callWidget('someWidgetId1', 'widget');
    *       var childWidget = brease.callWidget('someWidgetId1', 'widget');
    *
    *       parentWidget.designer.allowsChild(childWidget);
    *       childWidget.designer.isAllowedIn(parentWidget);
    *       
    */

    /**
    * @method allowsChild
    * Check if a widget allows another widget as child.  
    * Parent is the widget instance, where the method is called.  
    * Child is the widget given as parameter.  
    * @param {WidgetInstance} child
    * @return {Boolean}
    */

    /**
    * @method isAllowedIn
    * Check if a widget allows another widget as parent.  
    * Child is the widget instance, where the method is called.  
    * Parent is the widget given as parameter.  
    * @param {WidgetInstance} parent
    * @return {Boolean}
    */
    var ClassExtension = {
        extend: function (WidgetClass) {
            if (WidgetClass.name === "BaseWidget") {

                staticExtend(WidgetClass);

                var p = WidgetClass.prototype;

                p.isRotatable = function () { return true; };
                p.isMovable = function () { return true; };
                p.isResizable = function () { return true; };
                p.getHandles = function () { return []; };

                var oldInit = p.init;

                p.init = function () {
                    var widget = this,
                        meta = widget.constructor.meta;
                    this.designer = {
                        isRotatable: function () {
                            return widget.isRotatable.apply(widget, arguments);
                        },
                        isMovable: function () {
                            return widget.isMovable.apply(widget, arguments);
                        },
                        isResizable: function () {
                            return widget.isResizable.apply(widget, arguments);
                        },
                        getHandles: function () {
                            return widget.getHandles.apply(widget, arguments);
                        },
                        allowsChild: function (child) {

                            if (!Utils.isWidget(child)) {
                                throw new SyntaxError('argument has to be of type Widget');
                            }
                            var allowedChildren = meta.children,
                                inheritance = child.constructor.meta.inheritance;

                            if (allowedChildren.indexOf('*') !== -1) {
                                return true;
                            } else {
                                var allowed = false;
                                for (var i = 0; i < inheritance.length; i += 1) {
                                    if (allowedChildren.indexOf(inheritance[i]) !== -1) {
                                        allowed = true;
                                        break;
                                    }
                                }
                                return allowed;
                            }
                        },
                        isAllowedIn: function (parent) {
                            if (!Utils.isWidget(parent)) {
                                throw new SyntaxError('argument has to be of type Widget');
                            }
                            var allowedParents = meta.parents,
                                requestedParent = parent.constructor.meta.className;

                            if (Array.isArray(allowedParents)) {
                                return allowedParents.indexOf('*') !== -1 || allowedParents.indexOf(requestedParent) !== -1;
                            } else {
                                console.warn('Meta data of ' + parent.elem.id + ' missing!');
                                return false;
                            }
                        },
                        isAllowedInContent: function () {

                            var allowedParents = meta.parents,
                                requestedParent = 'system.brease.Content';

                            if (Array.isArray(allowedParents)) {
                                return allowedParents.indexOf('*') !== -1 || allowedParents.indexOf(requestedParent) !== -1;
                            }
                        }
                    };

                    oldInit.apply(this, arguments);
                };
            }
        }
    };

    function staticExtend(WidgetClass) {
        WidgetClass.static.getInitialProperties = function (x, y) {
            return {
                left: x,
                top: y
            };
        };
    }

    return ClassExtension;

});