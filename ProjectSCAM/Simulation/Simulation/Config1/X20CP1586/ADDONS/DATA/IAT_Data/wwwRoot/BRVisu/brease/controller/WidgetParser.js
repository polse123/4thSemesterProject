/*global define,console,CustomEvent,brease*/
define(['brease/controller/FileManager', 'brease/controller/libs/FactoryUtils', 'brease/controller/objects/WidgetItem', 'brease/core/Utils', 'brease/events/BreaseEvent', 'brease/enum/Enum', 'brease/controller/libs/Queue'],
function (fileManager, factoryUtils, WidgetItem, Utils, BreaseEvent, Enum, Queue) {

    /*jshint white:false*/
    'use strict';

    var parser = {

        init: function init(widgetsController) {
            if (widgetsController !== undefined) {
                _widgetsController = widgetsController;
            }
        },

        start: function (target, queue, contentId, widgetList, andSelf) {
            for (var i = 0, l = widgetList.length; i < l; i += 1) {
                _addToQueue(widgetList[i], queue, contentId);
            }
            if (andSelf === true && target.getAttribute('data-brease-widget') !== null) {
                _addToQueue(target, queue, contentId);
            }

            queue.start(function queueStart(queue) {
                queue.run(_createWidget).then(function successHandler(elem) {
                    elem.dispatchEvent(new CustomEvent(BreaseEvent.CONTENT_PARSED));
                }, function errorHandler() {
                    console.log('errorHandler:', arguments);
                });
            });
        },

        /**
        * @method parse
        * Analyze an HTMLElement and create widgets for all found widget elements.  
        * @param {HTMLElement/jQuery} target
        * @param {Boolean} andSelf include target in creation process
        * @param {String} [contentId] id of the parent content of target
        */
        parse: function parse(target, andSelf, contentId) {
            target = factoryUtils.getElem(target);

            if (target !== null) {
                var queue = Queue.getQueue(target, 'parse', true),
                    nodeList = target.querySelectorAll('[data-brease-widget]'),
                    widgetList = [], idList = [],
                    node, i, l = nodeList.length;
                //console.log(queue.elem === target);
                //queue.elem = target;

                for (i = l - 1; i >= 0; i -= 1) {
                    node = nodeList[i];
                    node.id = factoryUtils.ensureElemId(node.id);

                    if (idList.indexOf(node.id) === -1) {
                        widgetList.push(node);
                        idList.push(node.id);
                    } else {
                        console.iatWarn('[parse] HTML element has duplicate id (' + node.id + ') and will be removed');
                        node.parentNode.removeChild(node);
                    }
                }

                contentId = factoryUtils.ensureContentId(contentId, target, _widgetsController.getState(target.id));

                parser.start(target, queue, contentId, widgetList, andSelf);
            } else {
                _warn('parse');
            }
        }

    },
    _private = {
    }, _widgetsController;

    /**
    * @method _createWidget
    * @private
    * create widgets  
    * @param {WidgetItem} widgetItem
    * @param {Queue} queue
    */
    function _createWidget(widgetItem, queue) {
        var options,
            widgetPath,
            state = _widgetsController.getState(widgetItem.id);

        if (state < Enum.WidgetState.INITIALIZED) {
            if (_widgetsController.optionsExist(widgetItem.id)) {
                //console.log('[' + widgetItem.id + ']options from brease.options');
                options = _widgetsController.getOptions(widgetItem.id);
                widgetPath = fileManager.getPathByClass(options.className);
                if (options.parentContentId === undefined) {
                    _widgetsController.addOption(widgetItem.id, 'parentContentId', widgetItem.parentContentId);
                }
            }
            else {
                //console.log('%c[' + widgetItem.id + ']options from data-brease-options', 'color:red;');
                options = Utils.parseElementData(widgetItem.elem, 'brease-options');
                widgetPath = fileManager.getPathByClass(widgetItem.elem.getAttribute('data-brease-widget'));
                if (options.parentContentId === undefined) {
                    options.parentContentId = widgetItem.parentContentId;
                }
                _widgetsController.setOptions(widgetItem.id, options, true);
            }

            fileManager.loadJSFiles(widgetPath, brease.config.editMode === true || brease.config.mocked !== true).done(function (WidgetClass) {
                //_private.loadWidgetFileSuccess(WidgetClass, widgetPath, widgetItem, queue);
                _defer({
                    method: 'loadWidgetFileSuccess', WidgetClass: WidgetClass, widgetPath: widgetPath, widgetItem: widgetItem, queue: queue
                });
            }).fail(function (message) {
                _loadWidgetFileFail(message, widgetPath, widgetItem, queue);
            });
        } else {
            console.iatInfo('createWidget:' + widgetItem.id + ' already initialized');
        }
    }

    function _addToQueue(node, queue, contentId) {

        if (_widgetsController.getWidget(node.id) === undefined || _widgetsController.getState(node.id) === undefined) {
            _widgetsController.setState(node.id, Enum.WidgetState.IN_PARSE_QUEUE);
            queue.add(new WidgetItem(node, Enum.WidgetState.IN_PARSE_QUEUE, contentId));

            //} else if (document.querySelectorAll('#' + node.id).length > 1) {
            //    console.iatWarn('[parse] HTML element has duplicate id (' + node.id + ') and will be removed');
            //    $(node).remove();
        } else {
            var state = _widgetsController.getState(node.id);
            if (state < Enum.WidgetState.IN_PARSE_QUEUE) {
                _widgetsController.setState(node.id, Enum.WidgetState.IN_PARSE_QUEUE);
                queue.add(new WidgetItem(node, Enum.WidgetState.IN_PARSE_QUEUE, contentId));
            } else {
                console.iatInfo('[parse] HTML element already parsed (id=' + node.id + '),state=' + state);
            }
        }
    }

    var _updatePending = false;
    var _queue = [];

    function _defer(item) {
        _queue.push(item);

        if (_updatePending !== true) {
            _updatePending = true;
            if (typeof window.requestAnimationFrame === 'function') {
                window.requestAnimationFrame(_processDefered);
            } else {
                window.setTimeout(_processDefered, 0);
            }
        }
    }

    function _processDefered() {
        for (var i = 0; i < _queue.length; i += 1) {
            var item = _queue[i];
            _private[item['method']].call(null, item['WidgetClass'], item['widgetPath'], item['widgetItem'], item['queue']);
        }
        _queue = [];
        _updatePending = false;
    }

    _private.loadWidgetFileSuccess = function (WidgetClass, widgetPath, widgetItem, queue) {

        if (widgetItem.state === Enum.WidgetState.IN_PARSE_QUEUE && queue.elem !== null) {
            try {

                var widget = new WidgetClass(widgetItem.elem, _widgetsController.getOptions(widgetItem.id, true));
                widget.state = Enum.WidgetState.INITIALIZED;
                _widgetsController.addWidget(widget);

                widget.dispatchEvent(new CustomEvent(BreaseEvent.WIDGET_INITIALIZED));
                if (widget.omitReadyEvent !== true) {
                    widget._defer('_dispatchReady');
                    //widget._dispatchReady();
                }
                queue.finishItem(widgetItem.id);
            } catch (e) {
                var m = 'script error for module ' + widgetPath.path;
                _widgetsController.setState(widgetItem.id, Enum.WidgetState.FAILED);
                console.log(m + ' (' + e.message + ')');
                if (console.error) {
                    console.error(e.stack);
                }
                brease.loggerService.log(Enum.EventLoggerId.CLIENT_SCRIPT_FAIL, Enum.EventLoggerCustomer.BUR, Enum.EventLoggerVerboseLevel.LOW, Enum.EventLoggerSeverity.ERROR, [], m);
                queue.finishItem(widgetItem.id);
            }
        }
    };

    function _loadWidgetFileFail(message, widgetPath, widgetItem, queue) {
        var m = 'load error for module ' + ((widgetPath && widgetPath.path) ? widgetPath.path : 'undefined') + '(' + message + ')';
        _widgetsController.setState(widgetItem.id, Enum.WidgetState.FAILED);
        console.log(m);
        brease.loggerService.log(Enum.EventLoggerId.CLIENT_MODULELOADER_FAIL, Enum.EventLoggerCustomer.BUR, Enum.EventLoggerVerboseLevel.LOW, Enum.EventLoggerSeverity.ERROR, [], m);
        queue.finishItem(widgetItem.id);
    }

    function _warn(fn, message) {
        var m = message || '[' + fn + '] target of wrong type';
        console.iatWarn(m);
        brease.loggerService.log(Enum.EventLoggerId.CLIENT_PARSE_ERROR, Enum.EventLoggerCustomer.BUR, Enum.EventLoggerVerboseLevel.LOW, Enum.EventLoggerSeverity.WARNING, [], m);
    }


    return parser;
});




/**
* @class brease.objects.Queue
* @alternateClassName Queue
* @extends Object
* @embeddedClass
* @virtualNote
*/