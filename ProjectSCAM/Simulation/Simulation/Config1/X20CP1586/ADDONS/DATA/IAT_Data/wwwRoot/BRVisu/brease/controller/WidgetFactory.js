/*global define,console,CustomEvent,brease*/
define(['brease/controller/FileManager', 'brease/core/Utils', 'brease/events/BreaseEvent', 'brease/enum/Enum', 'brease/controller/libs/FactoryUtils', 'brease/core/libs/Deferred', 'brease/controller/libs/Queue', 'brease/controller/WidgetParser'],
function (fileManager, Utils, BreaseEvent, Enum, factoryUtils, Deferred, Queue, widgetParser) {

    /*jshint white:false*/
    'use strict';

    var factory = {

        init: function init(widgetsController) {
            if (widgetsController !== undefined) {
                _widgetsController = widgetsController;
            }
            widgetParser.init(widgetsController);
        },

        /**
        * @method createWidgets
        * @param {HTMLElement/jQuery}
        * @param {WidgetConfig[]}
        * @param {Boolean} [autoParse=true]
        * @param {String} [contentId]
        * @param {String} [addBeforeSelector]  
        */
        createWidgets: function createWidgets(target, arWidgets, autoParse, contentId, addBeforeSelector) {
            target = factoryUtils.getElem(target);

            if (target !== null) {
                var queue = Queue.getQueue(target, 'create', true);
                queue.pending = true;
                queue.autoParse = (autoParse === false) ? false : true;
                contentId = factoryUtils.ensureContentId(contentId, target, _widgetsController.getState(target.id));
                queue.add(arWidgets.filter(_stateFilter).map(_convertToQueueItem.bind(null, contentId, addBeforeSelector)));

                fileManager.loadHTMLFiles(arWidgets, queue.id, [queue, contentId]).done(_startLoadQueue).fail(_startLoadQueue);

            } else {
                _warn('createWidgets');
            }
        }

    },
    _widgetsController;

    function _startLoadQueue(queue, contentId) {
        if (queue.pending === true) {
            queue.pending = false;
            queue.start(_widgetHTMLLoader, [contentId]);
        }
    }

    //***************//
    //*** PRIVATE ***//
    //***************//

    function _widgetHTMLLoader(queue, contentId) {

        queue.run(_loadHTML).then(function successHandler(elem) {
            elem.dispatchEvent(new CustomEvent(BreaseEvent.CONTENT_READY));
            if (queue.autoParse === true) {
                widgetParser.parse(elem, false, contentId);
            }
        }, function errorHandler() {
            console.log('errorHandler:', arguments);
        });
    }

    function _loadHTML(item, queue) {
        var widgetInfo = item.widgetInfo,
            widgetType = widgetInfo.className;

        if (widgetType) {
            var id = widgetInfo.id,
                content = widgetInfo.content,
                options = widgetInfo.options;

            if (!options) {
                options = {};
            }
            var className = fileManager.getPathByType(widgetType, 'class');

            _widgetsController.setOptions(id, options, false, true);
            _widgetsController.addOption(id, 'className', className);

            var html = fileManager.getHTMLByType(widgetType);
            if (html) {

                if (item.state === Enum.WidgetState.IN_QUEUE && queue.elem !== null) {
                    var newNode = factoryUtils.createNode(html, id, options, className, widgetInfo.HTMLAttributes, content);
                    if (options.styleClassAdded) {
                        _widgetsController.addOption(id, 'styleClassAdded', true);
                    }
                    if (widgetInfo.addBeforeSelector) {
                        queue.elem.insertBefore(newNode, document.querySelector(widgetInfo.addBeforeSelector));
                    } else {
                        queue.elem.appendChild(newNode);
                    }
                    item.state = Enum.WidgetState.INITIALIZED;
                    queue.finishItem(widgetInfo.id);
                }
            } else {
                _warn('_loadHTML', '[loadHTML] unknown class (' + widgetType + ') name given for widget creation; element[id=' + ((widgetInfo.id) ? widgetInfo.id : 'undefined') + '] not created!');
                item.state = Enum.WidgetState.FAILED;
                queue.finishItem(widgetInfo.id);
            }
        } else {
            _warn('_loadHTML', '[loadHTML] no class name given for widget creation; element[id=' + ((widgetInfo.id) ? widgetInfo.id : 'undefined') + '] not created!');
            item.state = Enum.WidgetState.FAILED;
            queue.finishItem(widgetInfo.id);
        }
    }

    /**
    * @method _convertToQueueItem
    * @param {String} contentId
    * @param {String} addBeforeSelector
    * @param {WidgetConfig} widgetConfig
    */
    function _convertToQueueItem(contentId, addBeforeSelector, widgetConfig) {
        if (contentId) {
            if (widgetConfig.options) {
                widgetConfig.options.parentContentId = contentId;
            } else {
                widgetConfig.options = {
                    parentContentId: contentId
                };
            }
        }
        if (addBeforeSelector) {
            widgetConfig.addBeforeSelector = addBeforeSelector;
        }
        widgetConfig.id = factoryUtils.ensureElemId(widgetConfig.id);
        return {
            state: Enum.WidgetState.IN_QUEUE,
            widgetInfo: widgetConfig,
            id: widgetConfig.id
        };
    }

    /**
    * @method _stateFilter
    * @param {WidgetConfig} widgetConfig
    */
    function _stateFilter(widgetConfig) {
        var success = _widgetsController.getState(widgetConfig.id) <= Enum.WidgetState.IN_QUEUE;
        if (!success) {
            console.iatWarn('filtered out:' + widgetConfig.id);
        }
        return success;
    }

    function _warn(fn, message) {
        var m = message || '[' + fn + '] target of wrong type';
        console.iatWarn(m);
        brease.loggerService.log(Enum.EventLoggerId.CLIENT_PARSE_ERROR, Enum.EventLoggerCustomer.BUR, Enum.EventLoggerVerboseLevel.LOW, Enum.EventLoggerSeverity.WARNING, [], m);
    }

    return factory;
});