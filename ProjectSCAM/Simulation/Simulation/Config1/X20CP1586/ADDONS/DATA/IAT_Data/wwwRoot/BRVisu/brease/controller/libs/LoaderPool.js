/*global define,brease*/
define(['brease/events/BreaseEvent', 'brease/enum/Enum', 'brease/core/libs/Deferred', 'brease/core/Utils', 'brease/controller/WidgetController'], function (BreaseEvent, Enum, Deferred, Utils, widgetController) {
    /*jshint white:false*/
    'use strict';

    var LoaderPool = function (maxSlots) {
        this.slots = 0;
        this.maxSlots = (maxSlots !== undefined) ? Math.max(0, parseInt(maxSlots, 10)) : _slotsDefault;
        this.maxSlots = Math.min(this.maxSlots, _slotsMax);
        //this.maxSlots = 0;
        console.iatDebugLog('LoaderPool.maxSlots=' + this.maxSlots);

        this.locker = document.createDocumentFragment();
        this.pool = {};
        this.createPool = new Map();
        this.contentCount = {};
    },
    _slotsMax = 200,
    _slotsDefault = 25,
    _counter = 0;

    LoaderPool.prototype.loadContent = function (content, $target, deferred) {

        var loaderElemsInArea = $target.find('.systemContentLoader'),
            loaderLength = loaderElemsInArea.length,
            loaderInCreation;

        if (content && content.path !== undefined) {
            //console.log('loadContent ' + content.id + ' in ' + $target[0].id);
            _countContent.call(this, content);

            var loaderFound = false;

            if (loaderLength > 0) {
                //console.log('there are loaders in area:' + loaderLength);
                var loaderElem = loaderElemsInArea[0],
                    loaderId = loaderElem.id;
                if (widgetController.callWidget(loaderId, 'getUrl') === content.path) {
                    //console.log('loader in ' + $target[0].id + ' has already content ' + content.id);
                    deferred.resolve(loaderId, false);
                    window.performanceMonitor.profile('loadContent - ' + content.id + '', 1);
                    loaderFound = true;

                } else {
                    //console.log('loader ' + loaderElem.id + ' in ' + $target[0].id + ' has other content -> suspend');
                    _trySuspend.call(this, loaderElem);
                }
            } else {
                loaderInCreation = this.createPool.get($target[0].id);
                if (loaderInCreation) {
                    //console.log('there is a loader in creation phase for ' + $target[0].id + ' -> stop it');
                    _trySuspend.call(this, { id: loaderInCreation.loaderId });
                }
            }

            if (!loaderFound) {
                //console.log('no loader in area found!');
                _addLoaderToArea.call(this, content, $target[0], deferred);
            }

        } else {
            if (loaderLength > 0) {
                //console.log('suspend ContentLoader (' + loaderElemsInArea[0].id + ') in ' + $target[0].id);
                _trySuspend.call(this, loaderElemsInArea[0]);
            } else {
                loaderInCreation = this.createPool.get($target[0].id);
                if (loaderInCreation) {
                    //console.log('there is a loader in creation phase for ' + $target[0].id + ' -> stop it');
                    _trySuspend.call(this, { id: loaderInCreation.loaderId });
                }
            }
            deferred.reject('CONTENT_NOT_FOUND', $target[0]);
        }
    };

    function _trySuspend(loaderElem) {

        var state = widgetController.getState(loaderElem.id);

        if (state < Enum.WidgetState.INITIALIZED) {
            // loader not completely loaded -> abort loading
            widgetController.setOptions(loaderElem.id, { url: '', contentId: '' });
            var createInstance = this.createPool.get(loaderElem.id);
            if (createInstance) {
                createInstance.contentId = '';
            }
        } else {
            this.suspendLoader(loaderElem);
        }

    }

    LoaderPool.prototype.isContentActive = function (contentId) {
        var success = false,
            pool = this.pool;

        for (var id in pool) {
            if (pool[id].active === true) {
                if (contentId === widgetController.callWidget(id, 'getContentId')) {
                    success = true;
                    break;
                }
            }
        }
        return success;
    };

    LoaderPool.prototype.suspendLoader = function (loaderElem) {
        if (this.tagMode === true) {
            var contentId = widgetController.callWidget(loaderElem.id, 'getContentId'),
                isContentToLoad = _isContentToLoad.call(this, contentId),
                loader = this.pool[loaderElem.id];
            //console.log('%c mark for suspension:' + loaderElem.id + ' (' + widgetController.callWidget(loaderElem.id, 'getContentId') + ')', 'color:#cccc00');
            if (loader) {
                if (isContentToLoad) {
                    loader.tag = 'parked';
                    //console.log('mark as parked');
                } else {
                    loader.tag = 'suspend';
                    //console.log('mark as suspend');
                    widgetController.callWidget(loaderElem.id, 'deactivateContent');
                }
                this.locker.appendChild(loaderElem);
            }
        } else {
            _suspend.call(this, loaderElem);
        }
    };

    LoaderPool.prototype.flushLoader = function (loaderElem) {
        if (this.tagMode === true) {
            var contentId = widgetController.callWidget(loaderElem.id, 'getContentId'),
                isContentToLoad = _isContentToLoad.call(this, contentId),
                loader = this.pool[loaderElem.id];
            //console.log('%c mark for flushing:' + loaderElem.id + ' (' + contentId + ')', 'color:#cccc00');
            if (loader) {
                if (isContentToLoad) {
                    loader.tag = 'parked';
                    //console.log('mark as parked');
                } else {
                    loader.tag = 'flush';
                    //console.log('mark as flush');
                    widgetController.callWidget(loaderElem.id, 'deactivateContent');
                }
                this.locker.appendChild(loaderElem);
            }
        } else {
            _flush.call(this, loaderElem);
        }
    };

    function _isContentToLoad(contentId) {
        return this.contentsToLoad.indexOf(contentId) !== -1;
    }

    LoaderPool.prototype.startTagMode = function (contentsToLoad) {
        if (this.tagMode !== true) {
            for (var loaderId in this.pool) {
                this.pool[loaderId].tag = '';
            }
            this.tagMode = true;
            this.contentsToLoad = contentsToLoad;
        }
    };

    LoaderPool.prototype.endTagMode = function () {
        this.tagMode = false;
        for (var loaderId in this.pool) {
            if (this.pool[loaderId].tag === 'suspend') {
                if (this.maxSlots === 0) {
                    this.flushLoader(this.locker.querySelector('#' + loaderId));
                } else {
                    this.suspendLoader(this.locker.querySelector('#' + loaderId));
                }
            }
            if (this.pool[loaderId].tag === 'flush') {
                this.flushLoader(this.locker.querySelector('#' + loaderId));
            }
        }
    };


    /*
    /* PRIVATE
    */

    function _suspend(loaderElem) {
        //console.log('%c LoaderPool.suspend ' + loaderElem.id, 'color:#cccc00');
        var loader = this.pool[loaderElem.id];
        if (loader !== undefined) {
            try {
                widgetController.callWidget(loaderElem.id, 'suspend');
            } catch (e) {
                Utils.logError(e);
            } finally {
                loader.tag = '';
                loader.active = false;
                this.locker.appendChild(loaderElem);
            }

        } else {
            console.iatWarn('no loader with id=' + loaderElem.id + ' found!');
        }
    }

    function _flush(loaderElem) {
        //console.log('%c LoaderPool.flush ' + loaderElem.id, 'color:#cccc00');
        var loader = this.pool[loaderElem.id];
        if (loader !== undefined) {
            try {
                widgetController.callWidget(loaderElem.id, 'flush');
            } catch (e) {
                Utils.logError(e);
            } finally {
                loader.tag = '';
                loader.active = false;
                loader.contentId = '';
                this.locker.appendChild(loaderElem);
            }
        } else {
            console.iatWarn('no loader with id=' + loaderElem.id + ' found!');
        }
    }

    function _countContent(content) {
        if (this.contentCount[content.id] === undefined) {
            this.contentCount[content.id] = 0;
        }
        this.contentCount[content.id] += 1;
    }

    function _addLoaderToArea(content, areaDiv, deferred) {
        var loaderObj = _findContentLoaderWithContent.call(this, content.path);
        if (loaderObj) {

            Utils.prependChild(areaDiv, this.locker.querySelector('#' + loaderObj.id));
            try {
                if (loaderObj.tag !== 'parked') {
                    //console.log('%c there is a loader (=' + loaderObj.id + ') with content "' + content.id + '" -> try wake', 'color:green;');


                    if (widgetController.allPreviouslyReady(content.id)) {
                        //console.log('%cwake ' + loaderObj.id + ' (' + content.id + '' + content.path + ')', 'color:#00cc00;');
                        widgetController.callWidget(loaderObj.id, 'wake');
                    } else {
                        //console.log('%c' + 'content not completely ready -> load(' + content.id + '' + content.path + ')', 'color:#00cccc');
                        //widgetFactory.disposeInContent(document.getElementById(loaderObj.id), content.id);
                        widgetController.callWidget(loaderObj.id, 'load', content.path, content.id, true);
                    }
                }

            } catch (e) {
                Utils.logError(e);
            } finally {
                loaderObj.tag = '';
                loaderObj.active = true;
                loaderObj.contentId = content.id;
                deferred.resolve(loaderObj.id, true);
            }
        } else {
            //console.log('there are NO ContentLoaders with ' + content.id);
            //console.log('load content in ContentLoader from Pool!');
            _loadFromPool.call(this, areaDiv, content, deferred);
        }
    }

    function _loadFromPool(container, content, deferred) {

        //console.log('slots=' + this.slots + ', maxSlots=' + this.maxSlots);
        if (this.slots < this.maxSlots) {
            //console.log('maximum noch nicht erreicht -> neuer Loader fuer content ' + content.id);
            _createNew.call(this, container, content, deferred);
        } else {

            //console.log('maximum erreicht -> Loader wiederverwenden!');

            var loaderObj = _getAvailable.call(this, content.id);

            if (loaderObj !== undefined) {

                //console.log(loaderObj.id + ' wird recycelt');
                _loadAvailable.call(this, loaderObj, container, content, deferred);
            } else {
                //console.log('kein verfuegbarer ContentLoader -> neuer Loader fuer content ' + content.id);
                _createNew.call(this, container, content, deferred);
            }
        }
    }

    function _getAvailable(contentId) {
        var loader,
            loaderId,
            contentCount,
            minContentCount = Number.POSITIVE_INFINITY,
            pool = this.pool;

        for (var id in pool) {

            if (pool[id].active !== true || pool[id].tag === 'suspend' || pool[id].tag === 'flush') {
                contentCount = this.contentCount[pool[id].contentId];
                if (contentId === widgetController.callWidget(id, 'getContentId')) {
                    loaderId = id;
                    break;
                }
                if (contentCount < minContentCount) {
                    minContentCount = contentCount;
                    loaderId = id;
                }
            }
        }
        if (loaderId) {
            loader = pool[loaderId];
        }
        return loader;
    }

    function _findContentLoaderWithContent(contentPath) {

        var loader,
            pool = this.pool;

        for (var id in pool) {
            if (widgetController.callWidget(id, 'getUrl') === contentPath && (pool[id].active !== true || pool[id].tag === 'suspend' || pool[id].tag === 'flush' || pool[id].tag === 'parked')) {
                loader = pool[id];
                break;
            }
        }
        //console.log('try to find a loader with ' + contentPath + ':' + ((loader) ? loader.id : 'undefined'));
        return loader;
    }

    function _loadAvailable(loaderObj, container, content, deferred) {
        //console.log('%c_loadAvailable:' + content.id + ' in ' + loaderObj.id + ' in ' + container.id, 'color:#00cccc');
        //console.log('content in loader:' + loaderObj.contentId);
        loaderObj.tag = '';
        loaderObj.active = true;

        brease.pageController.emptyContainer(container);
        Utils.prependChild(container, this.locker.querySelector('#' + loaderObj.id));

        if (loaderObj.contentId !== content.id) {
            loaderObj.contentId = content.id;
            widgetController.callWidget(loaderObj.id, 'load', content.path, content.id);
        }
        deferred.resolve(loaderObj.id, true);
    }

    function _createNew(container, content, deferred) {

        var loaderId = 'SystemLoader' + (_counter += 1),
            poolInstance = this,
            createInstance = {
                contentReadyHandler: _contentReadyHandler.bind(poolInstance, container.id),
                initializedHandler: _initializedHandler.bind(poolInstance, container.id),
                deferred: deferred,
                containerId: container.id,
                contentId: content.id,
                loaderId: loaderId
            };
        //console.log('%c createNew: ' + loaderId, 'color:#9999ff');
        this.slots += 1;
        this.createPool.set(container.id, createInstance);

        container.addEventListener(BreaseEvent.CONTENT_READY, createInstance.contentReadyHandler);

        brease.uiController.createWidgets(container, [{
            className: 'system.widgets.ContentLoader',
            id: loaderId,
            options: {
                url: content.path,
                contentId: content.id
            },
            HTMLAttributes: {
                style: 'box-sizing: border-box; position:relative; overflow:hidden;visibility:hidden;',
                class: 'systemContentLoader'
            }
        }], true, brease.settings.globalContent, '#' + container.id + ' > :first-child');

    }

    // node of ContentLoader is added to DOM
    // from now on the loader is findable in the DOM
    function _contentReadyHandler(containerId, e) {

        var createInstance = this.createPool.get(containerId);
        //console.log('%c _contentReadyHandler: containerId=' + createInstance.containerId + ',loaderId=' + createInstance.loaderId+ ',contentId=' + createInstance.contentId + ',targetId=' + e.target.id, 'color:#9999ff');

        if (e.target.id === containerId) {
            e.target.removeEventListener(BreaseEvent.CONTENT_READY, createInstance.contentReadyHandler);
            var loaderElem = document.getElementById(createInstance.loaderId);
            if (loaderElem) {
                //console.log(loaderId + '.contentReady:' + createInstance.contentId);
                loaderElem.addEventListener(BreaseEvent.WIDGET_INITIALIZED, createInstance.initializedHandler);
            } else {
                this.createPool.delete(containerId);
            }
        }
    }

    function _initializedHandler(containerId, e) {
        var createInstance = this.createPool.get(containerId);
        if (createInstance) {
            var loaderId = createInstance.loaderId;
            //console.log('%c _initializedHandler: containerId=' + createInstance.containerId + ',loaderId=' + createInstance.loaderId+ ',contentId=' + createInstance.contentId + ',targetId=' + e.target.id, 'color:#9999ff');
            if (e.target.id === loaderId) {
                e.target.removeEventListener(BreaseEvent.WIDGET_INITIALIZED, createInstance.initializedHandler);

                this.pool[loaderId] = {
                    id: loaderId,
                    active: true,
                    contentId: createInstance.contentId
                };

                createInstance.deferred.resolve(loaderId, true);
                this.createPool.delete(containerId);
            }
        }
    }

    return LoaderPool;

});