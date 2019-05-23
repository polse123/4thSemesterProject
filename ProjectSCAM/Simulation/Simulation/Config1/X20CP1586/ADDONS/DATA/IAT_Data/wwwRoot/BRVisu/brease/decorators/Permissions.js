/*global define,brease*/
define(['brease/core/Decorator', 'brease/events/BreaseEvent', 'brease/core/Utils', 'brease/enum/Enum'], function (Decorator, BreaseEvent, Utils, Enum) {

    'use strict';

    /**
    * @class brease.decorators.Permissions
    * @abstract 
    * @extends brease.core.Decorator  
    * #Description
    * A decorator class to add permissions to a widget class
    * ##Example:  
	*
	*     define(function (require) {
	*        var SuperClass = require('brease/core/BaseWidget'),
	*            permissions = require('brease/decorators/Permissions'),
	*     
	*        [...]
	*     
	*        return permissions.decorate(WidgetClass, undefined, {
	*           permissions: {
	*               view: {property: 'permissionView', updateMethod: 'updateVisibility'}
	*           }
	*        });
	*     });
	*
	*
    * @iatMeta studio:visible
    * false
    */
    var Permissions = function () {
        this.initType = Decorator.TYPE_PRE;
    },
    dependency = "roles",
    changeHandler = "permissionsChangeHandler";

    /**
    * @method decorate
    * decorate a widget class with functionality of permissions
    * @param {brease.core.WidgetClass} widgetClass
    * @param {Object} initData=undefined not used for this decorator
    * @param {Object} staticData
    * @param {brease.objects.Permissions} staticData.permissions
    * @return {brease.core.WidgetClass}
    */
    Permissions.prototype = new Decorator();

    var decoratorInstance = new Permissions();

    decoratorInstance.methodsToAdd = {

        init: function (initialDependency) {
            var widget = this;
            this.dependencies[dependency] = {
                state: Enum.Dependency.INACTIVE,
                suspend: function () {
                    if (widget.dependencies[dependency].state === Enum.Dependency.ACTIVE) {
                        widget.dependencies[dependency].stored = brease.user.getUserRoles();
                        setState.call(widget, Enum.Dependency.SUSPENDED);
                    }
                },
                wake: function () {
                    if (widget.dependencies[dependency].state === Enum.Dependency.SUSPENDED) {
                        setState.call(widget, Enum.Dependency.ACTIVE);
                        // compare works if roles are sorted (see services/User @_loadUserRolesResponseHandler)
                        if (widget.dependencies[dependency].stored.join(',') !== brease.user.getUserRoles().join(',')) {
                            widget[changeHandler].call(widget);
                        }
                    }
                }
            };
            if (initialDependency === true) {
                this._updatePermissions();
                setState.call(this, Enum.Dependency.ACTIVE);
            }
        },

        dispose: function () {
            this.dependencies[dependency] = null;
            removeListener.call(this);
        }

    };

    decoratorInstance.methodsToAdd[changeHandler] = function () {
        this._updatePermissions(true);
    };

    decoratorInstance.methodsToAdd['_updatePermissions'] = function (update) {
        var permissions = this.constructor.static.permissions;

        for (var key in permissions) {
            this._updatePermission(key, update);
        }
    };

    decoratorInstance.methodsToAdd['_updatePermission'] = function (key, update) {
        var permission = this.constructor.static.permissions[key];

        if (this.settings[permission.property] !== undefined) {
            //console.log('%c' + this.elem.id + '._updatePermission:' + permission.property, 'color:red');
            this.settings.permissions[key] = (this.settings[permission.property] !== null) ? brease.user.hasOneOfRoles(this.settings[permission.property]) : true;
            if (update === true) {
                this[permission.updateMethod].call(this);
            }
        }
    };

    function setState(state) {
        //console.log('%c' + this.elem.id + '.dependencies[' + dependency + '].state=' + state, 'color:#cd661d');
        this.dependencies[dependency].state = state;
        if (state === Enum.Dependency.ACTIVE) {
            addListener.call(this);
        } else {
            removeListener.call(this);
        }
    }

    function addListener() {
        document.body.addEventListener(BreaseEvent.ROLES_CHANGED, this._bind(changeHandler));
    }

    function removeListener() {
        document.body.removeEventListener(BreaseEvent.ROLES_CHANGED, this._bind(changeHandler));
    }

    return decoratorInstance;
});

/**
* @class brease.objects.Permissions
* An object with key/value pairs  
* - key is the name of the permission  
* - value is an object of type brease.objects.PermissionConfig  
* e.g.  
*       
*       {
*           view: {property: 'permissionView', updateMethod: 'updateVisibility'},
*           operate: {property: 'permissionOperate', updateMethod: 'updateOperability'},
*       }
*       
* Evaluated permissions are stored in settings.permissions of a widget. The name is the key of a permission.
* e.g. name = 'view' --> value is stored in settings.view
* @extends Object
* @abstract
* @embeddedClass
* @virtualNote  
* @iatMeta studio:visible
* false
*/

/**
* @class brease.objects.PermissionConfig
* @extends Object
* @abstract
* @embeddedClass
* @virtualNote  
* @iatMeta studio:visible
* false
*/

/**
* @property {String} updateMethod
* Method which is called after a permission changes. This happens initial and after a role change,
*/

/**
* @property {String} property
* Widget property, where roles are projected for this permission.
* e.g. 'permissionView' is the widget property, where roles can be assigned in an AS project
*/