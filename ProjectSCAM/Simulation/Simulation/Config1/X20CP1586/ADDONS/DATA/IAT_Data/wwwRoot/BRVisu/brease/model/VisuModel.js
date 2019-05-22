/*global define,brease,CustomEvent*/
define(['brease/events/BreaseEvent', 'brease/events/ServerEvent', 'brease/core/Utils', 'brease/controller/objects/PageTypes', 'brease/controller/objects/AssignTypes', 'brease/controller/objects/VisuStatus', 'brease/controller/libs/LogCode'], function (BreaseEvent, ServerEvent, Utils, PageTypes, AssignTypes, VisuStatus, LogCode) {
    /*jshint white:false */
    'use strict';

    /**
    * @class brease.model.VisuModel
    * @extends Object
    * controls visu(s)
    * @singleton
    */
    var VisuModel = {

        init: function (runtimeService, logger) {
            if (logger) {
                _logger = logger;
            }
            if (runtimeService) {
                _runtimeService = runtimeService;
                _runtimeService.addEventListener(ServerEvent.VISU_ACTIVATED, _visuActivatedHandler);
            }
            _initModel();
            _pendingVisus.reset();
            return this;
        },

        activateVisu: function (visuId, callbackInfo) {
            visuId = Utils.ensureVisuId(visuId);
            if (callbackInfo.visuId) {
                callbackInfo.visuId = Utils.ensureVisuId(callbackInfo.visuId);
            }
            var visu = _visuModel.visus[visuId],
                deferred = $.Deferred();

            if (visu === undefined || visu.status !== VisuStatus.LOADED) {
                deferred.reject((visu !== undefined) ? visu.status : VisuStatus.NOT_FOUND, undefined, callbackInfo);
            } else {
                if (visu.active !== true) {
                    visu.activateDeferred = deferred;
                    visu.callbackInfo = callbackInfo;
                    _runtimeService.activateVisu(visuId, _activateVisuResponse, callbackInfo);
                    _pendingVisus.push(visuId);
                } else {
                    deferred.resolve(callbackInfo);
                }
            }
            return deferred.promise();
        },

        deactivateVisu: function (visuId) {
            visuId = Utils.ensureVisuId(visuId);
            if (_visuModel.visus[visuId]) {
                _runtimeService.deactivateVisu(visuId);
                _visuModel.visus[visuId].active = false;
                document.body.dispatchEvent(new CustomEvent(BreaseEvent.VISU_DEACTIVATED, { detail: { visuId: visuId } }));
            }
        },

        loadVisuData: function (visuId, rootContainerId) {
            var deferred = $.Deferred();
            visuId = Utils.ensureVisuId(visuId);
            if (visuId === undefined) {
                _logger.log(LogCode.VISU_NOT_FOUND, { visuId: visuId, container: brease.appElem });
                deferred.reject(visuId);
            } else {
                _runtimeService.loadVisuData(visuId, _loadVisuDataResponseHandler, { visuId: visuId, deferred: deferred, isRoot: true, rootContainerId: rootContainerId });
            }

            return deferred.promise();
        },
        getPageById: function (id) {
            return _visuModel.pages[id];
        },
        getNavById: function (id) {
            return _visuModel.navigations[id];
        },
        getVisuById: function (id) {
            return _visuModel.visus[Utils.ensureVisuId(id)];
        },
        getVisuByStartpage: function (pageId) {
            var visu;
            for (var visuId in _visuModel.visus) {
                if (_visuModel.visus[visuId].startPage === pageId) {
                    visu = _visuModel.visus[visuId];
                    break;
                }
            }
            return visu;
        },
        getDialogById: function (id) {
            return _visuModel.dialogs[id];
        },
        getContentById: function (id) {
            return _getContent(id);
        },
        isValidContent: function (id) {
            return _getContent(id) !== undefined;
        },
        getLayoutById: function (id) {
            return _visuModel.layouts[id];
        },
        getThemes: function () {
            return _visuModel.themes;
        },
        pageHasArea: function (areaId, page) {
            var success = false,
                layout = this.getLayoutById(page.layout);

            if (layout && layout.areas) {
                success = (layout.areas[areaId] !== undefined);
            }
            return success;
        },
        findAssignment: function (page, areaId) {
            return page.assignments[areaId];
        },
        findNav4page: function (pageId) {
            var nav;
            for (var navId in _visuModel.navigations) {

                if (_visuModel.navigations[navId].pages[pageId] !== undefined) {
                    nav = _visuModel.navigations[navId];
                    break;
                }
            }
            return nav;
        },

        parseVisuData: function (visuData, visuId) {

            return _parseVisuData(visuData, visuId);
        },

        // check if all pending visus are activated
        // activated means: visu is a known visu and its active state is not undefined
        allActivated: function () {
            var activated = false,
                visu;
            //console.always('allActivated', 'warn')
            for (var i = 0; i < _pendingVisus.length(); i += 1) {
                visu = _visuModel.visus[_pendingVisus.get(i)];
                activated = visu !== undefined && visu.active !== undefined;
                //console.log(_pendingVisus.get(i) + ',defined:' + (visu !== undefined) + ',activated:' + activated);
                if (activated === false) {
                    return false;
                }
            }
            _pendingVisus.reset();
            return true;
        },

        addContent: function (id, content) {
            if (_visuModel.contents[id] === undefined) {
                _visuModel.contents[id] = content;
            }
        }
    };

    function _getContent(id) {
        var content = _visuModel.contents[id];
        if (content) {
            content.id = id;
        }
        return content;
    }

    Object.defineProperty(VisuModel, 'startPageId', {
        get: function () {
            return _visuModel.startPageId;
        },
        enumerable: true,
        configurable: false
    });

    Object.defineProperty(VisuModel, 'startThemeId', {
        get: function () {
            return _visuModel.startThemeId;
        },
        enumerable: true,
        configurable: false
    });

    Object.defineProperty(VisuModel, 'startVisuId', {
        get: function () {
            return _visuModel.startVisuId;
        },
        enumerable: true,
        configurable: false
    });

    var _logger,
    _runtimeService,
    _visuModel,
    _pendingVisus = {
        stack: [],
        reset: function () {
            this.stack.length = 0;
        },
        length: function () {
            return this.stack.length;
        },
        get: function (i) {
            return this.stack[i];
        },
        push: function (item) {
            this.stack.push(item);
        }
    };

    function _initModel(rootVisuData, rootVisuId) {
        _visuModel = {
            pages: {},
            dialogs: {},
            layouts: {},
            contents: {},
            navigations: {},
            visus: {},
            themes: []
        };

        if (rootVisuData) {
            _visuModel.startPageId = rootVisuData.startPage;
            _visuModel.startVisuId = rootVisuId;
            _visuModel.startThemeId = rootVisuData.startTheme;
            _visuModel.configurations = rootVisuData.configurations;
        }
        //window.visuModel = _visuModel;
    }

    function _findAssignedVisu(page) {
        var visuId;
        for (var key in page.assignments) {
            var assignment = page.assignments[key];
            if (assignment.type === AssignTypes.VISU && _visuModel.visus[assignment.contentId] === undefined) {
                visuId = assignment.contentId = Utils.ensureVisuId(assignment.contentId);
                break;
            }
        }
        return visuId;
    }

    function _findUnloadedVisu() {
        var visuId;
        for (var pageId in _visuModel.pages) {
            visuId = _findAssignedVisu(_visuModel.pages[pageId]);
            if (visuId) {
                break;
            }
        }
        if (visuId === undefined) {
            for (var dialogId in _visuModel.dialogs) {
                visuId = _findAssignedVisu(_visuModel.dialogs[dialogId]);
                if (visuId) {
                    break;
                }
            }
        }
        return visuId;
    }

    function _loadVisuDataResponseHandler(response, callbackInfo) {

        if (response.success === true && response.visuData) {

            if (!Utils.isObject(response.visuData.layouts) || Object.keys(response.visuData.layouts).length === 0) {
                _logger.log(LogCode.NO_LAYOUTS_FOUND, { visuId: callbackInfo.visuId });
            }
            if (!Utils.isObject(response.visuData.pages) || Object.keys(response.visuData.pages).length === 0) {
                _logger.log(LogCode.NO_PAGES_FOUND, { visuId: callbackInfo.visuId });
            }
            if (callbackInfo.isRoot === true) {
                _initModel(response.visuData, callbackInfo.visuId);
                _visuModel.visus[callbackInfo.visuId] = new Visualization(callbackInfo.visuId, response.visuData.startPage, callbackInfo.rootContainerId);
                _extend(response.visuData, callbackInfo.visuId, true);
            } else {
                _visuModel.visus[callbackInfo.visuId] = new Visualization(callbackInfo.visuId, response.visuData.startPage);
                _extend(response.visuData, callbackInfo.visuId);

            }
        } else {
            _visuModel.visus[callbackInfo.visuId] = {
                status: (response.status === 'parsererror') ? VisuStatus.MALFORMED : VisuStatus.NOT_FOUND
            };
        }

        var unloadedVisu = _findUnloadedVisu();
        if (unloadedVisu !== undefined) {
            _runtimeService.loadVisuData(unloadedVisu, _loadVisuDataResponseHandler, {
                visuId: unloadedVisu, deferred: callbackInfo.deferred, isRoot: false
            });
        } else {
            callbackInfo.deferred.resolve(_visuModel.configurations);
        }
    }

    function _extend(visuData, visuId) {

        _mergeThemes(visuData.themes); // merge before parse, as themes will be removed
        visuData = _parseVisuData(visuData, visuId);

        $.extend(true, _visuModel, visuData);
    }

    function _mergeThemes(themes) {
        if (Array.isArray(themes)) {
            for (var i = 0; i < themes.length; i += 1) {
                if (_visuModel.themes.indexOf(themes[i]) === -1) {
                    _visuModel.themes.push(themes[i]);
                }
            }
        }
    }

    function _parseVisuData(loadedVisuData, visuId) {

        var visuData = Utils.deepCopy(loadedVisuData);

        delete visuData.startPage;
        delete visuData.startTheme;
        delete visuData.configurations;
        delete visuData.themes;

        // pages store which visu they belong to
        for (var pageId in visuData.pages) {
            var page = visuData.pages[pageId];
            page.visuId = visuId;
            page.id = pageId;
            page.type = PageTypes.PAGE;
            page.assignments = Utils.arrayToObject(page.assignments, 'areaId');
        }
        // dialogs store which visu they belong to
        for (var dialogId in visuData.dialogs) {
            var dialog = visuData.dialogs[dialogId];
            dialog.visuId = visuId;
            dialog.id = dialogId;
            dialog.type = PageTypes.DIALOG;
            dialog.assignments = Utils.arrayToObject(dialog.assignments, 'areaId');
        }
        // areas store their id
        for (var layoutId in visuData.layouts) {
            var layout = visuData.layouts[layoutId];
            for (var aid in layout.areas) {
                layout.areas[aid].id = aid;
            }
        }
        // contents store their id and visuId
        for (var contentId in visuData.contents) {
            var content = visuData.contents[contentId];
            content.id = contentId;
            content.visuId = visuId;
        }
        // parsing of Navigations; for better finding linking pages
        for (var navId in visuData.navigations) {
            visuData.navigations[navId] = _parseNavigation(navId, visuData);
        }
        return visuData;
    }

    function _visuActivatedHandler(e) {

        var visuId = e.detail.visuId,
            visu = _visuModel.visus[visuId];
        if (!visu) {
            return;
        }
        var deferred = visu.activateDeferred,
            callbackInfo = visu.callbackInfo;

        visu.active = true;
        window.clearTimeout(visu.timeout);
        delete visu.callbackInfo;
        delete visu.timeout;
        //console.log('%c' + BreaseEvent.VISU_ACTIVATED + ':' + e.detail.visuId, 'color:red');
        document.body.dispatchEvent(new CustomEvent(BreaseEvent.VISU_ACTIVATED, {
            detail: {
                visuId: visuId, active: visu.active
            }
        }));
        if (deferred) {
            deferred.resolve(callbackInfo);
        }
    }

    // response can be positive or negative
    // a visu is activated, if active!=undefined
    function _activateVisuResponse(response, callbackInfo) {
        //console.log('_activateVisuResponse:' + JSON.stringify(response), callbackInfo)
        var visu = _visuModel.visus[callbackInfo.visuId];
        if (visu) {
            var deferred = visu.activateDeferred,
            responseCode = (response !== undefined && response.status !== undefined) ? response.status.code : undefined;

            if (responseCode !== 0) {
                deferred.reject(VisuStatus.ACTIVATE_FAILED, responseCode, callbackInfo);
            } else if (visu.active !== true) { // it's possible that VisuActivated is sent before activateVisuResponse
                visu.timeout = window.setTimeout(function () {
                    brease.messenger.announce('VISU_NOT_ACTIVATED', { visuId: callbackInfo.visuId });
                }, 30000);
            }
        }
    }

    function _parseNavigation(navId, visuData) {

        var navData = visuData.navigations[navId],
            navObj = new Navigation(navId);

        for (var itemId in navData.pages) {
            if (visuData.pages && visuData.pages[itemId] !== undefined) {
                // casting to NavigationPage
                navObj.addPage(navData.pages[itemId], (visuData.pages) ? visuData.pages[itemId] : {
                    id: itemId
                }, itemId);
            } else {
                _logger.log(LogCode.PAGE_NOT_FOUND, { pageId: itemId, isStartPage: (visuData && visuData.startPage === itemId) });
            }
            if (navData.pages[itemId].targets) {
                for (var i = 0; i < navData.pages[itemId].targets.length; i += 1) {
                    // all targets of the page will have page as source (reachableFrom)
                    var targetId = navData.pages[itemId].targets[i];
                    if (visuData.pages && visuData.pages[targetId] !== undefined) {
                        if (navObj.pages[targetId] === undefined) {
                            // if target is not in navObj: add it
                            navObj.addPage(navData.pages[targetId], (visuData.pages) ? visuData.pages[targetId] : {
                                id: targetId
                            }, targetId);
                        }
                        navObj.pages[targetId].addSource(itemId);
                    } else {
                        _logger.log('PAGE_NOT_FOUND', { pageId: targetId, isStartPage: (visuData && visuData.startPage === targetId) });
                    }
                }
            }
            navObj.swipes[itemId] = navData.pages[itemId].swipe;
        }
        return navObj;

    }

    // Interne Objekte

    // *** Visualization ***

    function Visualization(id, startPage, containerId) {

        this.id = id;
        this.startPage = startPage;
        this.status = VisuStatus.LOADED;
        this.containerId = containerId;
    }

    // *** Navigation ***

    function Navigation(id) {
        this.id = id;
        this.pages = {};
        this.swipes = {};
    }

    Navigation.prototype.addPage = function (navPage, pageObj, pageId) {
        if (this.pages[pageId] === undefined) {
            this.pages[pageId] = new NavigationPage(pageId, (navPage) ? navPage.targets : undefined, pageObj.displayName, pageObj.image);
        }
    };

    function NavigationPage(id, targets, displayName, image) {
        this.id = id;
        if (image !== undefined) {
            this.image = image;
        }
        if (displayName !== undefined) {
            this.displayName = displayName;
        }
        this.targets = targets || [];
        this.reachableFrom = [];
    }

    NavigationPage.prototype.addSource = function (pageId) {
        this.reachableFrom.push(pageId);
    };

    return VisuModel.init();

});
