/*global define,console,brease, CustomEvent*/
define(['brease/controller/objects/Client', 'brease/events/BreaseEvent', 'brease/core/Utils', 'brease/core/Types', 'brease/enum/Enum'], function (Client, BreaseEvent, Utils, Types, Enum) {
    /*jshint white:false*/
    'use strict';

    /**
    * @class brease.controller.ActionController
    * @extends core.javascript.Object
    * Main controller to handle actions
    * It provides methods handle actions
    * 
    * @singleton
    */
    var ActionController = function ActionController() { },
		p = ActionController.prototype,
        _runtimeService;

    p.init = function (runtimeService) {
        if (_runtimeService !== undefined) {
            _runtimeService.removeEventListener('action', _serverActionHandler);
        }
        _runtimeService = runtimeService;
        _runtimeService.addEventListener('action', _serverActionHandler);
    };

    function _serverActionHandler(e) {

        var action = e.detail,
            type = _getActionType(action);

        try {
            switch (type) {
                case "widget":
                    _processWidgetAction(action);
                    break;

                case "clientSystem":
                    _processSystemAction(action);
                    break;

                default:
                    _processActionResponse({}, action.actionId, false);
                    break;

            }
        } catch (error) {
            _log(error, action.action);
            _processActionResponse(false, action.actionId, false);
        }
    }

    function _getActionType(action) {

        if (action.action.indexOf("widgets.") !== -1) {
            return "widget";
        }

        else if (action.action.indexOf("clientSystem.") === 0) {
            return "clientSystem";
        }

        else {
            console.warn("Target:", action.action, 'notAvailable');

        }
    }

    function _processSystemAction(action) {

        switch (action.action) {
            case ("clientSystem.Action.ShowMessageBox"):
                _runShowMessageBoxAction(action);
                break;

            case ("clientSystem.Action.OpenDialog"):
                if (Client.isValid === true) {
                    _runOpenDialogAction(action);
                } else {
                    _processActionResponse({}, action.actionId, false);
                    console.warn("client not valid -> action 'OpenDialog' rejected");
                }
                break;

            case ("clientSystem.Action.CloseDialog"):
                if (Client.isValid === true) {
                    _runCloseDialogAction(action);
                } else {
                    _processActionResponse({}, action.actionId, false);
                    console.warn("client not valid -> action 'CloseDialog' rejected");
                }
                break;

            case ("clientSystem.Action.Navigate"):
                if (Client.isValid === true) {
                    _runNavigateAction(action);
                } else {
                    _processActionResponse({}, action.actionId, false);
                    console.warn("client not valid -> action 'Navigate' rejected");
                }
                break;

            case ("clientSystem.Action.LoadContentInArea"):
                if (Client.isValid === true) {
                    _runLoadContentInAreaAction(action);
                } else {
                    _processActionResponse({}, action.actionId, false);
                    console.warn("client not valid -> action 'LoadContentInArea' rejected");
                }
                break;

            case ("clientSystem.Action.Logout"):
                _runLogoutAction(action);
                break;

            case ("clientSystem.Action.Login"):
                _runLoginAction(action);
                break;

            case ("clientSystem.Action.ChangeTheme"):
                if (Client.isValid === true) {
                    _runChangeThemeAction(action);
                } else {
                    _processActionResponse({}, action.actionId, false);
                    console.warn("client not valid -> action 'ChangeTheme' rejected");
                }
                break;

            case ("clientSystem.Action.SetLanguage"):
                _runSetLanguageAction(action);
                break;

            case ("clientSystem.Action.SetMeasurementSystem"):
                _runSetMeasurementSystemAction(action);
                break;

            default:
                console.warn("Action:", action.action, "notAvailable");
                _processActionResponse({}, action.actionId, false);
                break;
        }
    }

    function _getMethodArgs(WidgetClass, actionName, method) {

        if (WidgetClass.meta && WidgetClass.meta.actions) {
            var params = [];
            for (var param in WidgetClass.meta.actions[actionName].parameter) {
                params[WidgetClass.meta.actions[actionName].parameter[param].index] = param;
            }
            return params;
        } else {
            return Utils.getFunctionArguments(method);
        }

    }

    function _processWidgetAction(action) {

        var widgetId = action.target.refId,
            widget = brease.callWidget(widgetId, 'widget');

        if (widget === null) {
            _processActionResponse(null, action.actionId, false);
        } else if (widget.state < Enum.WidgetState.INITIALIZED || widget.state > Enum.WidgetState.READY) {
            console.iatWarn('widget action for ' + action.target.refId + ': widget in unavailable state');
            _processActionResponse(null, action.actionId, false);
        } else {
            var actionName = action.action.split('.').pop(),
			    methodName = actionName.substring(0, 1).toLowerCase() + actionName.substring(1),
                method = widget[methodName],
                WidgetClass = widget.constructor;

            if (method === undefined) {
                console.iatWarn("Action '" + actionName + "' not available on type " + WidgetClass.defaults.className);
                _processActionResponse(null, action.actionId, false);
            } else {

                var methodCallArgs = _createArgs(method, actionName, action.actionArgs, WidgetClass);

                $.when(method.apply(widget, methodCallArgs)).then(function (data) {
                    _processActionResponse(data, action.actionId, (data !== null));
                });

                // if method is a setter, we have to dispatch an ATTRIBUTE_CHANGE event, to update any bindings
                if (methodName.indexOf('set') === 0) {

                    var prop = methodName.substring(3).replace(/^[A-Z]/g, function (item) {
                        return item.toLowerCase();
                    }),
                    subscriptions = brease.uiController.getSubscriptionsForElement(widgetId);

                    if (subscriptions && subscriptions[prop]) {
                        var detail = {
                        };
                        detail[prop] = methodCallArgs[0];
                        document.getElementById(widgetId).dispatchEvent(new CustomEvent(BreaseEvent.ATTRIBUTE_CHANGE, {
                            detail: detail, bubbles: true
                        }));
                    }
                }
            }
        }

    }

    function _createArgs(method, actionName, objActionArgs, WidgetClass) {

        var methodCallArgs = [];

        var actionArgNames = Object.keys(objActionArgs);

        if (actionArgNames.length > 1) {
            var sortedArgs = _getMethodArgs(WidgetClass, actionName, method);
            if (sortedArgs) {
                actionArgNames = sortedArgs;
            }
        }

        for (var i = 0; i < actionArgNames.length; i += 1) {
            methodCallArgs.push(_parseValue(objActionArgs[actionArgNames[i]], actionArgNames[i], WidgetClass, actionName));
        }

        return methodCallArgs;
    }

    function _parseValue(value, argName, WidgetClass, actionName) {

        if (!Utils.isString(value)) {
            return value;
        }

        if (WidgetClass.meta === undefined || WidgetClass.meta.actions === undefined || WidgetClass.meta.actions[actionName] === undefined) {
            return value;
        }

        var param = WidgetClass.meta.actions[actionName].parameter[argName];

        if (!param || Types.objectTypes.indexOf(param.type) === -1) {
            return value;
        }

        try {
            value = JSON.parse(value.replace(/\'/g, '"'));
        } catch (e) {
            console.iatWarn('illegal data in attribute ' + argName + ' for action ' + actionName);
        }

        return value;
    }

    function _runShowMessageBoxAction(action) {
        var args = action.actionArgs;
        $.when(brease.overlayController.showMessageBox(args.type, args.header, args.message, args.icon, args.buttonText, args.style)).then(function (result) {
            _processActionResponse(result, action.actionId, true);
        });
    }

    function _runOpenDialogAction(action) {
        var args = action.actionArgs;
        $.when(brease.overlayController.openDialog(args.dialogId, args.mode, args.horizontalPos, args.verticalPos, undefined, args.headerText, args.autoClose)).then(function (result, exists) {
            _processActionResponse(result, action.actionId, exists);
        });
    }

    function _runCloseDialogAction(action) {
        var args = action.actionArgs;
        $.when(brease.overlayController.closeDialog(args.dialogId)).then(function (result) {
            _processActionResponse(result, action.actionId, true);
        });
    }

    function _runLoadContentInAreaAction(action) {
        var args = action.actionArgs;
        $.when(brease.pageController.loadContentInArea(args.contentId, args.areaId, args.pageId)).then(function (result) {
            _processActionResponse(result, action.actionId, true);
        });
    }

    function _runNavigateAction(action) {
        var args = action.actionArgs,
            visu, container;

        visu = brease.pageController.getVisuById(brease.pageController.getVisu4Page(args.pageId));
        if (visu !== undefined) {
            container = document.getElementById(visu.containerId);
            $.when(brease.pageController.loadPage(args.pageId, container, true)).then(function () {
                _processActionResponse({}, action.actionId, true);
            });
        } else {
            _processActionResponse({}, action.actionId, false);
        }
    }

    function _runLoginAction(action) {
        var args = action.actionArgs;

        $.when(brease.user.loginAction(args.userName, args.password)).then(function (result) {
            _processActionResponse(result.success, action.actionId, true);
        });
    }

    function _runLogoutAction(action) {

        $.when(brease.user.setDefaultUser()).then(function () {
            _processActionResponse({}, action.actionId, true);
        });
    }

    function _runChangeThemeAction(action) {
        var args = action.actionArgs;
        $.when(brease.pageController.setTheme(args.theme)).then(function () {
            _processActionResponse({}, action.actionId, true);
        });
    }

    function _runSetLanguageAction(action) {
        var args = action.actionArgs;
        $.when(brease.language.switchLanguage(args.value)).then(function (result) {
            _processActionResponse({}, action.actionId, result.success);
        });
    }

    function _runSetMeasurementSystemAction(action) {
        var args = action.actionArgs;
        $.when(brease.measurementSystem.switchMeasurementSystem(args.value)).then(function () {
            _processActionResponse({}, action.actionId, true);
        });
    }

    function _processActionResponse(data, id, success) {
        var res = {
            actionId: id,
            actionResult: {
                result: data,
                success: success
            }
        };
        //console.iatInfo("actionresponse", data, id, success);
        _runtimeService.actionResponse(res);
    }

    function _log(e, actionName) {

        var message = 'Error in ' + actionName;
        if (e.stack) {
            message += '\n' + e.stack;
        } else if (e.message) {
            message += '\n' + e.message;
        } else {
            message += '\n' + e.toString();
        }
        console.log(message);
    }

    return new ActionController();

});