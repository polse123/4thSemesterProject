/*global define,brease,_*/
define(['brease/controller/objects/Client', 'brease/events/BreaseEvent', 'brease/enum/Enum', 'brease/core/Utils', 'brease/controller/libs/LoaderPool', 'brease/controller/libs/PageLogger', 'brease/model/VisuModel', 'brease/controller/libs/LoadCycle', 'brease/controller/libs/ScrollManager', 'brease/controller/libs/Areas', 'brease/controller/libs/Containers', 'brease/helper/Scroller', 'brease/core/libs/Deferred', 'brease/controller/objects/PageTypes', 'brease/controller/objects/AssignTypes', 'brease/controller/libs/Themes', 'brease/controller/objects/VisuStatus', 'brease/controller/libs/LogCode'], function (Client, BreaseEvent, Enum, Utils, LoaderPool, PageLogger, VisuModel, LoadCycle, ScrollManager, Areas, containers, Scroller, Deferred, PageTypes, AssignTypes, Themes, VisuStatus, LogCode) {
    /*jshint white:false */
    'use strict';

    /**
    * @class brease.controller.PageController
    * @extends Object
    * controls pages
    * @singleton
    */
    var PageController = {

        init: function init(runtimeService, config) {
            if (this.logger === undefined) {
                brease.appElem.addEventListener(BreaseEvent.PAGE_CHANGE, _pageChangeRequest.bind(this));
                ScrollManager.init(Scroller);
            }
            this.logger = new PageLogger(this, config);
            _runtimeService = runtimeService;
            _visuModel = VisuModel.init(runtimeService, this.logger);
        },

        start: function start(visuId, rootContainer, cachingConfig) {
            visuId = Utils.ensureVisuId(visuId);
            _loaderPool = new LoaderPool((cachingConfig) ? cachingConfig.cachingSlots : undefined);
            _loadCycle = new LoadCycle();
            $.when(
                _visuModel.activateVisu(visuId, { visuId: visuId, rootContainer: rootContainer })
            ).then(_activateStartVisuSuccess, _activateStartVisuFailed);
        },

        swipeNavigation: function swipeNavigation(dir) {
            var currentPageId = containers.getCurrentPage(this.rootContainer.id),
                nav = _visuModel.findNav4page(currentPageId);

            if (nav && nav.swipes && nav.swipes[currentPageId] && nav.swipes[currentPageId][dir]) {
                PageController.loadPage(nav.swipes[currentPageId][dir], this.rootContainer);
                return true;
            } else {
                return false;
            }
        },

        /**
        * @method loadPage
        * load page in area
        * @param {String} pageId
        * @param {HTMLElement} container
        * @return {Object}
        * @return {Boolean} return.success
        * @return {String} return.code
        */
        loadPage: function loadPage(pageId, container) {
            var response;
            if (!container) {
                response = { success: false, code: LogCode.CONTAINER_NOT_FOUND };
                this.logger.log(response.code, { pageId: pageId, isStartPage: (_visuModel.startPageId === pageId) });
            } else {
                //console.log('%cPageController.loadPage(' + pageId + ',' + container.id + ')', 'color:#00cccc;');
                var page = _visuModel.getPageById(pageId);
                if (page !== undefined) {
                    containers.setLatestRequest(container.id, pageId);
                    response = _loadPage.call(this, page, container);
                } else {
                    response = { success: false, code: LogCode.PAGE_NOT_FOUND };
                    this.logger.log(response.code, { pageId: pageId, isStartPage: (_visuModel.startPageId === pageId) });
                }
            }
            return response;
        },

        /**
        * @method loadDialog
        * load dialog in area
        * @param {String} dialogId
        * @param {HTMLElement} container
        */
        loadDialog: function loadDialog(dialogId, container) {
            //console.log("loadDialog:", dialogId, (container) ? container.id : 'undefined', _visuModel);
            var dialog = _visuModel.getDialogById(dialogId);
            if (dialog !== undefined) {
                containers.setLatestRequest(container.id, dialogId);
                _loadPage.call(this, dialog, container);
                return dialog;
            } else {
                this.logger.log(LogCode.DIALOG_NOT_FOUND, { dialogId: dialogId });
            }
        },

        /**
        * @method loadContentInArea
        * load content in area
        * @param {String} contentId
        * @param {String} areaId
        * @param {String} pageId
        * @return {Object}
        * @return {Boolean} return.success
        * @return {String} return.code
        */
        loadContentInArea: function loadContentInArea(contentId, areaId, pageId) {
            //console.log('%cPageController.loadContentInArea:contentId=' + contentId + ',areaId=' + areaId + ',pageId=' + pageId, 'color:#00dddd');
            var instance = this,
                def = $.Deferred(),
                content = _visuModel.getContentById(contentId);

            if (content === undefined || content.virtual === true) {
                _resolve.call(instance, def, false, LogCode.CONTENT_NOT_FOUND, {
                    contentId: contentId
                });
            } else if (_loaderPool.isContentActive(contentId) === true) {
                _resolve.call(instance, def, false, LogCode.CONTENT_IS_ACTIVE, {
                    contentId: contentId
                });
            } else {
                var page = _visuModel.getPageById(pageId) || _visuModel.getDialogById(pageId);

                if (!page) {
                    _resolve.call(instance, def, false, LogCode.PAGE_NOT_FOUND, {
                        pageId: pageId, isStartPage: false
                    });
                } else {
                    var containerId = containers.getContainerForPage(pageId);

                    if (containerId === undefined) {
                        _resolve.call(instance, def, false, LogCode.PAGE_NOT_CURRENT, {
                            pageId: pageId
                        });
                    } else {

                        if (_visuModel.pageHasArea(areaId, page) === false) {
                            _resolve.call(instance, def, false, LogCode.AREA_NOT_FOUND, { areaId: areaId, pageId: pageId, layoutId: page.layout });
                        } else {
                            var area = Areas.getArea(containerId, page.layout, areaId, page.type),
                                originalAssignment = _visuModel.findAssignment(page, areaId),
                                assignment;
                            if (!area) {
                                _resolve.call(instance, def, false, LogCode.AREA_NOT_FOUND, { areaId: areaId, pageId: pageId, layoutId: page.layout });
                            } else {
                                if (originalAssignment) {
                                    assignment = Utils.deepCopy(originalAssignment);
                                } else {
                                    assignment = {};
                                }
                                assignment.contentId = contentId;

                                _loadContent(area, assignment).done(function _loadContentSuccess(loaderId, contentChange, area, assignment) {
                                    //console.log('_loadContent.done:', loaderId, contentChange, area, assignment);
                                    var content = _visuModel.getContentById(assignment.contentId);
                                    if (content) {
                                        var zoomFactor = _zoomBaseContent(loaderId, {
                                            width: content.width, height: content.height
                                        }, {
                                            width: area.obj.width, height: area.obj.height
                                        }, assignment.zoomMode);
                                        area.setProperties({ width: content.width, height: content.height }, assignment, zoomFactor, contentChange);
                                    }
                                    _resolve.call(instance, def, true);

                                }).fail(function _loadContentFail() {

                                    _resolve.call(instance, def, false);
                                });
                            }
                        }
                    }
                }
            }

            return def.promise();
        },

        /**
        * @method setTheme
        * set Theme for Visualisation
        * @param {String} themeId
        */
        setTheme: function setTheme(themeId) {
            if (themeId !== undefined) {
                if (_visuModel.getThemes().indexOf(themeId) === -1) {
                    this.logger.log(LogCode.THEME_NOT_FOUND, { themeId: themeId });
                    return;
                }
                Themes.setTheme(themeId);
            }
        },

        themeId2Url: function themeId2Url(themeId) {
            return Themes.themeId2Url(themeId);
        },

        /**
        * @method getCurrentTheme
        * @return {String} themeId
        */
        getCurrentTheme: function getCurrentTheme() {
            return Themes.getCurrentTheme();
        },

        getThemes: function getThemes() {
            return _visuModel.getThemes();
        },

        emptyContainer: function emptyContainer(container) {
            //console.log('emptyContainer:', container);
            if (container && container.childNodes && container.id) {
                _emptyContainer.call(this, container);
                containers.resetCurrentPage(container.id);
            }
        },
        /**
        * @method getNavById
        * @param {String} id id of navigation
        * @return {Object} navigation navigation object
        */
        getNavById: function getNavById(id) {
            return _visuModel.getNavById(id);
        },
        /**
        * @method getPageById
        * @param {String} id id of page
        * @return {Object}
        */
        getPageById: function getPageById(pageId) {
            return _visuModel.getPageById(pageId);
        },
        getLayoutById: function getLayoutById(id) {
            return Utils.deepCopy(_visuModel.getLayoutById(id));
        },
        /**
        * @method getDialogById
        * @param {String} id id of dialog
        * @return {Object}
        */
        getDialogById: function getDialogById(id) {
            return _visuModel.getDialogById(id);
        },
        getVisuById: function getVisuById(id) {
            return _visuModel.getVisuById(id);
        },
        /**
        * @method getCurrentPage
        * @param {String} containerId id of area
        * @return {String} pageId id of page
        */
        getCurrentPage: function getCurrentPage(containerId) {
            return containers.getCurrentPage(containerId);
        },
        /**
        * @method getVisu4Page
        * @param {String} pageId id of page
        * @return {String} visuId id of page
        */
        getVisu4Page: function getVisu4Page(pageId) {
            if (_visuModel.getPageById(pageId) !== undefined) {
                return _visuModel.getPageById(pageId).visuId;
            } else if (_visuModel.getDialogById(pageId) !== undefined) {
                return _visuModel.getDialogById(pageId).visuId;
            } else {
                return undefined;
            }
        },
        /**
        * @method getContentUrlById
        * @param {String} contentId id of content
        * @return {String} url url of content
        */
        getContentUrlById: function getContentUrlById(contentId) {
            var url,
                content = _visuModel.getContentById(contentId);
            if (content) {
                url = content.path;
            }
            return url;
        },

        /**
        * @method getLoaderForElement
        * get closest ContentLoader for an HTMLElement
        * @param {HTMLElement/Selector} elem
        */
        getLoaderForElement: function getLoaderForElement(elem) {

            return $(elem).closest('.systemContentLoader')[0];
        },

        /**
        * @method getContentId
        * get contentId for an HTMLElement
        * @param {HTMLElement/Selector} elem
        */
        getContentId: function getContentId(elem) {
            var contentId,
                loaderElem = this.getLoaderForElement(elem);
            if (loaderElem !== undefined) {
                contentId = loaderElem.getAttribute('data-brease-contentid');
            }
            return contentId;
        },

        getLayoutDivId: function getLayoutDivId(containerId, layoutId) {
            return 'Layout_' + ((this.rootContainer.id === containerId) ? '' : containerId + '_') + layoutId;
        },

        getAreaDivId: function getAreaDivId(containerId, layoutId, areaId, pageType) {
            return Areas.getAreaDivId(containerId, layoutId, areaId, pageType);
        },

        loadHTML: function loadHTML(url, loopParams) {
            var def = new Deferred('singleShot', loopParams);

            require(['text!' + url], function loadHTMLSuccess(html) {
                def.resolve(html);
            }, function loadHTMLFail(error) {
                def.reject(error);
            });

            return def;
        },

        getRootZoom: function getRootZoom() {
            return _rootZoom.scale;
        },

        parseVisuData: function parseVisuData(visuData, visuId) {

            return _visuModel.parseVisuData(visuData, visuId);
        }
    },

    _runtimeService, _loadCycle, _loaderPool, _visuModel,
    _internalCall;

    function _activateStartVisuSuccess(callbackInfo) {
        var rootContainer = callbackInfo.rootContainer;
        Areas.init(ScrollManager, rootContainer.id);
        PageController.rootContainer = rootContainer;
        PageController.$rootContainer = $(rootContainer);
        PageController.setTheme(_visuModel.startThemeId);
        PageController.loadPage(_visuModel.startPageId, rootContainer);
    }

    function _activateStartVisuFailed(visuStatus, code, callbackInfo) {
        var data = {
            visuId: callbackInfo.visuId, container: callbackInfo.rootContainer
        };
        if (code !== undefined) {
            data.code = code;
        }
        PageController.logger.log('VISU_' + visuStatus, data);
    }

    function _loadPage(page, container) {

        if (_loadCycle.isOpen || _internalCall === true) {
            //console.log('%c' + 'loadPage:' + page.id + ',' + container.id, 'color:#00cccc');
            _internalCall = false;
            var currentPageId = containers.getCurrentPage(container.id),
                currentPage = _visuModel.getPageById(currentPageId),
                response;

            if (currentPage === undefined || currentPageId !== page.id) {

                if (_visuModel.getLayoutById(page.layout) !== undefined) {
                    var contentsToLoad = _contentsToLoad(page.id, page.type);
                    _loaderPool.startTagMode(contentsToLoad);
                    if (currentPage === undefined || page.layout !== currentPage.layout) {
                        _emptyContainer.call(this, container);
                    }
                    var layoutDiv = _createLayout.call(this, page.layout, container, page.type);
                    _setPageProps(layoutDiv, page);
                    containers.setCurrentPage(container.id, page.id);

                    _loadCycle.start(_cycleCallback, contentsToLoad, {
                        pageId: page.id, containerId: container.id, contentsToLoad: contentsToLoad
                    });
                    _loadAssignments.call(this, page, container);
                    _setStyle((page.style || 'default'), layoutDiv, page.type);

                    if (currentPage !== undefined && page.layout !== currentPage.layout && container.id !== this.rootContainer.id) {
                        _prepareZoom.call(this, page, container);
                    }
                    response = {
                        success: true
                    };
                } else {
                    response = {
                        success: false, code: LogCode.LAYOUT_NOT_FOUND
                    };
                    this.logger.log(response.code, {
                        pageId: page.id, layoutId: page.layout, isStartPage: (_visuModel.startPageId === page.id)
                    });
                }


            } else {
                response = {
                    success: false, code: LogCode.PAGE_IS_CURRENT
                };
                this.logger.log(response.code, {
                    pageId: page.id
                });

                var contentsOfPage = _contentsToLoad(page.id, page.type);
                for (var i = 0; i < contentsOfPage.length; i += 1) {
                    _loadCycle.remove(contentsOfPage[i]);
                }

            }
            return response;
        }
    }

    function _contentsToLoad(pageId, pageType) {
        var contents = [],
            page = (pageType === PageTypes.DIALOG) ? _visuModel.getDialogById(pageId) : _visuModel.getPageById(pageId);

        for (var aid in page.assignments) {

            var assignment = page.assignments[aid];

            switch (assignment.type) {
                case AssignTypes.CONTENT:
                    if (_visuModel.isValidContent(assignment.contentId)) {
                        contents.push(assignment.contentId);
                    }
                    break;

                case AssignTypes.PAGE:
                    contents.push.apply(contents, _contentsToLoad(assignment.contentId));
                    break;

                case AssignTypes.VISU:

                    var visuId = assignment.contentId,
                        visu = _visuModel.getVisuById(visuId);

                    if (visu && visu.status === VisuStatus.LOADED) {
                        contents.push.apply(contents, _contentsToLoad(visu.startPage));
                    }

                    break;
            }
        }
        return contents;
    }

    function _resolve(deferred, success, code, data) {
        if (code) {
            this.logger.log(code, data);
        }
        deferred.resolve(success);
    }

    function _cycleCallback(callbackInfo) {
        //console.always('_cycleCallback:', callbackInfo.pageId, _visuModel.startPageId);
        if (callbackInfo.pageId === _visuModel.startPageId) {
            _validateClient();
        }
        _loaderPool.endTagMode();
        containers.initPageLoadEvent(callbackInfo.containerId, callbackInfo.pageId, callbackInfo.contentsToLoad, callbackInfo.embedded);
    }

    function _validateClient() {
        var allAcivated = _visuModel.allActivated();

        //console.always('_validateClient,allAcivated:' + allAcivated);
        if (allAcivated) {
            Client.setValid(true);
        } else {
            document.body.addEventListener(BreaseEvent.VISU_ACTIVATED, _visuActivatedListener);
        }
    }

    function _visuActivatedListener() {
        var allAcivated = _visuModel.allActivated();

        //console.always('_visuActivatedListener,allAcivated:' + allAcivated);
        if (allAcivated) {
            document.body.removeEventListener(BreaseEvent.VISU_ACTIVATED, _visuActivatedListener);
            Client.setValid(true);
        }
    }

    function _prepareZoom(page, container) {

        var areaDiv, areaDivId, areaId, area, layoutId, parentPage, pageId, assignment, layoutDiv;

        areaDiv = $(container).closest("div[data-brease-areaId]")[0];
        if (areaDiv) {
            areaDivId = areaDiv.id;
            areaId = areaDiv.getAttribute('data-brease-areaId');
        }

        layoutDiv = $(container).closest("div[data-brease-layoutId]")[0];
        if (layoutDiv) {
            layoutId = layoutDiv.getAttribute("data-brease-layoutId");
        }

        if (areaId && layoutId) {
            area = _visuModel.getLayoutById(layoutId).areas[areaId];
        }

        parentPage = $(container).closest("div[data-brease-pageId]")[0];

        if (parentPage) {
            pageId = parentPage.getAttribute('data-brease-pageId');
            assignment = _visuModel.getPageById(pageId).assignments[areaId];
        }

        if (page && areaDivId && areaDiv && area && assignment) {
            _zoomAndStyle.call(this, page, Areas.get(areaDivId), assignment);
        }
    }

    function _setPageProps(layoutDiv, page) {
        layoutDiv.setAttribute("data-brease-pageId", page.id);
        var css = {
            'background-image': '',
            'background-color': (page.backColor) ? page.backColor : ''
        };

        if (page.backGround || page.backGroundGradient) {
            css['background-image'] = '';
            if (page.backGroundGradient) {
                css['background-image'] += page.backGroundGradient;
            }
            if (page.backGround) {
                css['background-image'] += ((css['background-image'] !== '') ? ', ' : '') + 'url(' + page.backGround + ')';
                css['background-repeat'] = 'no-repeat';
            }
        }

        if (page.sizeMode) {
            css['background-size'] = Enum.SizeMode.convertToCSS(page.sizeMode);
        }
        $(layoutDiv).css(css);
    }

    function _createLayout(layoutId, container, pageType) {
        //console.log("_createLayout:", layoutId, container.id, pageType);
        var containerId = container.id;
        if (container.id !== this.rootContainer.id && pageType !== PageTypes.DIALOG) {
            container = Areas.get(container.id).contentContainer;
        }

        var layoutDivId = this.getLayoutDivId(container.id, layoutId),
            layoutDiv = $('#' + container.id).find('#' + layoutDivId)[0];

        if (!layoutDiv) {
            var layoutObj = _visuModel.getLayoutById(layoutId);
            layoutObj.id = layoutId;
            layoutDiv = document.createElement('div');
            layoutDiv.setAttribute('style', 'width:' + layoutObj.width + 'px;height:' + layoutObj.height + 'px;display:block;position:absolute;z-index:0;');
            layoutDiv.setAttribute('id', layoutDivId);
            layoutDiv.setAttribute('class', 'breaseLayout');
            layoutDiv.setAttribute('data-brease-layoutId', layoutId);

            for (var areaId in layoutObj.areas) {
                layoutDiv.appendChild(Areas.add(containerId, layoutId, layoutObj.areas[areaId], pageType).div);
            }
            ScrollManager.remove(containerId);
            Utils.prependChild(container, layoutDiv);

            if (containerId === this.rootContainer.id) {
                if (brease.config.visu.zoom === true) {
                    _rootZoom.init(layoutDiv, this.$rootContainer);
                } else {
                    document.body.style['overflow'] = 'auto';
                    this.$rootContainer.css({
                        width: layoutObj.width + 'px',
                        height: layoutObj.height + 'px'
                    });
                    brease.dispatchResize();
                }
            }
        }
        return layoutDiv;
    }

    var _rootZoom = {
        scale: 1,
        listening: false,
        init: function init(layoutDiv, $rootContainer) {
            document.body.style['overflow'] = 'hidden';
            this.$layoutDiv = $(layoutDiv);
            this.$rootContainer = $rootContainer;
            this.scale = 1;
            if (!this.listening) {
                $(window).on('resize', _.debounce(this.zoom.bind(this), 150));
                this.listening = true;
            }
            this.zoom();
        },
        zoom: function zoom() {
            var boundingBox = this.$layoutDiv[0].getBoundingClientRect(),
                bodySize = document.body.getBoundingClientRect(),
                scaleW = Math.floor(bodySize.width) / (boundingBox.width / this.scale),
                scaleH = Math.floor(bodySize.height) / (boundingBox.height / this.scale);

            this.scale = Math.min(scaleW, scaleH);

            if (this.scale === scaleW) {
                var w = Math.floor(this.$layoutDiv.outerWidth() * this.scale);
                this.scale = w / this.$layoutDiv.outerWidth();
            } else {
                var h = Math.floor(this.$layoutDiv.outerHeight() * this.scale);
                this.scale = h / this.$layoutDiv.outerHeight();
            }

            this.$layoutDiv.css({
                'transform': 'scale(' + this.scale + ',' + this.scale + ')',
                'transform-origin': '0 0'
            });
            boundingBox = this.$layoutDiv[0].getBoundingClientRect();

            this.$rootContainer.css({
                width: boundingBox.width,
                height: boundingBox.height
            });
            brease.dispatchResize();
        }
    };

    function _loadAssignments(page, container) {

        var layout = _visuModel.getLayoutById(page.layout),
            omittedAreas = Object.keys(layout.areas);

        for (var areaId in page.assignments) {
            var assignment = page.assignments[areaId],
                areaObj = layout.areas[areaId];

            if (areaObj !== undefined) {
                var area = Areas.getArea(container.id, page.layout, assignment.areaId, page.type);
                _loadBaseContent.call(this, assignment, area);
                area.setStyle((assignment.style || 'default'));
                area.show();
                omittedAreas.splice(omittedAreas.indexOf(areaId), 1);
            } else {
                if (assignment.type === AssignTypes.CONTENT) {
                    _loadCycle.remove(assignment.contentId);
                }
                this.logger.log(LogCode.AREA_NOT_FOUND, {
                    contentId: assignment.contentId, layoutId: page.layout, pageId: page.id, areaId: assignment.areaId, isStartPage: (_visuModel.startPageId === page.id)
                });
            }
        }
        // if there are areas in the assigned layout, which have no assignment
        if (omittedAreas.length > 0) {
            for (var i = 0; i < omittedAreas.length; i += 1) {
                var omittedArea = Areas.getArea(container.id, page.layout, omittedAreas[i], page.type);
                omittedArea.hide();
                _emptyContainer.call(this, omittedArea.div);
            }
        }
    }

    function _showMessage(messageArea, text) {
        $(messageArea).html(text);
    }

    function _loadBaseContent(assignment, area) {

        var controller = this;

        switch (assignment.type) {
            case AssignTypes.CONTENT:

                window.performanceMonitor.profile('loadContent - ' + assignment.contentId + '', 0);
                _loadContent(area, assignment).done(function _loadContentSuccess(loaderId, contentChange, area, assignment) {
                    //console.log('_loadContent.done:', loaderId, contentChange, area, assignment);

                    _loadCycle.remove(assignment.contentId);
                    var content = _visuModel.getContentById(assignment.contentId);

                    if (content) {
                        var zoomFactor = _zoomBaseContent(loaderId, {
                            width: content.width, height: content.height
                        }, {
                            width: area.obj.width, height: area.obj.height
                        }, assignment.zoomMode);
                        area.setProperties({ width: content.width, height: content.height }, assignment, zoomFactor, contentChange);
                    }

                }).fail(function _loadContentFail(code, messageArea, area, assignment) {

                    if (code === LogCode.CONTENT_NOT_FOUND) {
                        controller.logger.log(code, {
                            contentId: assignment.contentId
                        });

                        if (messageArea) {
                            controller.logger.message('brease.error.CONTENT_NOT_FOUND', [assignment.contentId], _showMessage.bind(null, messageArea));
                        }
                    }
                });
                break;

            case AssignTypes.PAGE:
                var pageId = assignment.contentId;
                _internalPageLoad.call(this, pageId, area.div);
                _zoomAndStyle.call(this, _visuModel.getPageById(pageId), area, assignment);
                _updateZoomFactor(_visuModel.getVisuByStartpage(pageId));
                break;

            case AssignTypes.VISU:

                var visuId = assignment.contentId;
                $.when(_visuModel.activateVisu(visuId, {
                    visuId: visuId,
                    area: area,
                    assignment: assignment
                })).then(_activateEmbeddedVisuSuccess, _activateEmbeddedVisuFailed);
                break;
        }
    }

    function _activateEmbeddedVisuSuccess(callbackInfo) {
        var visu = _visuModel.getVisuById(callbackInfo.visuId);
        $.when(
            _loadVisu.call(PageController, callbackInfo.area, callbackInfo.assignment)
        ).then(function _loadVisuSuccess(pageId) {
            _zoomAndStyle.call(PageController, _visuModel.getPageById(pageId), callbackInfo.area, callbackInfo.assignment);
            _updateZoomFactor(visu);
        }, function _loadVisuFail(code, pageId) {
            if (code === LogCode.PAGE_IS_CURRENT) {
                _zoomAndStyle.call(PageController, _visuModel.getPageById(pageId), callbackInfo.area, callbackInfo.assignment);
                _updateZoomFactor(visu);
            }
        });

    }

    function _activateEmbeddedVisuFailed(visuStatus, code, callbackInfo) {
        if (visuStatus === VisuStatus.ACTIVATE_FAILED) {
            var contentsToLoad = _contentsToLoad(_visuModel.getVisuById(callbackInfo.visuId).startPage);
            for (var i = 0; i < contentsToLoad.length; i += 1) {
                _loadCycle.remove(contentsToLoad[i], true);
            }
        }
        var data = {
            visuId: callbackInfo.visuId
        };
        if (code !== undefined) {
            data.code = code;
        }
        _showVisuError.call(PageController, 'VISU_' + visuStatus, data, callbackInfo.area.div);
    }

    function _zoomAndStyle(page, area, assignment) {
        if (page !== undefined) {
            var layoutId = page.layout,
                layoutObj = _visuModel.getLayoutById(layoutId),
                layoutDivId = this.getLayoutDivId(area.contentContainer.id, layoutId),
                zoomFactor = _zoomBaseContent(layoutDivId, {
                    width: layoutObj.width, height: layoutObj.height
                }, {
                    width: area.obj.width, height: area.obj.height
                }, assignment.zoomMode);

            area.setProperties({ width: layoutObj.width, height: layoutObj.height }, assignment, zoomFactor, true);
        }
    }

    function _zoomBaseContent(containerId, baseContentSize, areaSize, zoomMode) {

        var wF = areaSize.width / baseContentSize.width,
            hF = areaSize.height / baseContentSize.height,
            factor = 1,
            css = {};

        if (zoomMode === 'contain') {
            factor = Math.min(wF, hF);
        } else if (zoomMode === 'cover') {
            factor = Math.max(wF, hF);
        }
        css['width'] = baseContentSize.width;
        css['height'] = baseContentSize.height;
        css['transform'] = 'scale(' + factor + ',' + factor + ')';
        css['transform-origin'] = '0 0';
        $('#' + containerId).css(css);

        //console.log("_zoomBaseContent:", containerId, baseContentSize, area, zoomMode + ' --> ' + factor.toFixed(2));
        return factor;
    }

    function _loadVisu(area, assignment) {

        var deferred = $.Deferred(),
            visuId = assignment.contentId,
            pageLoad,
            visu = _visuModel.getVisuById(visuId);

        if (visu.status === VisuStatus.LOADED) {

            //set StartTheme if no theme was applied before
            if (Themes.getCurrentTheme() === undefined) {
                this.setTheme(_visuModel.startThemeId);
            }

            pageLoad = _internalPageLoad.call(this, visu.startPage, area.div);
            if (pageLoad.success) {
                _visuModel.getVisuById(visuId).containerId = area.div.id;
                deferred.resolve(visu.startPage);
            } else {
                deferred.reject(pageLoad.code, visu.startPage);
            }

        } else {
            _showVisuError.call(this, 'VISU_' + visu.status, { visuId: visuId }, area.div);
            deferred.reject('VISU_' + visu.status);
        }

        return deferred.promise();
    }

    function _showVisuError(messageKey, data, areaDiv) {

        _emptyContainer.call(this, areaDiv);
        data.container = $(areaDiv).find('.ScrollBox')[0];
        this.logger.log(messageKey, data);
    }

    function _updateZoomFactor(visu) {
        if (visu && visu.containerId) {
            var factor = 1,
                layoutDiv = $('#' + visu.containerId).find('.breaseLayout');

            if (layoutDiv.length > 0) {
                factor = layoutDiv[0].getBoundingClientRect().width / layoutDiv.outerWidth();
            }

            visu.zoomFactor = factor;
        }
    }

    function _loadContent(area, assignment) {
        var deferred = new Deferred('singleShot', [area, assignment]),
            content = _visuModel.getContentById(assignment.contentId);

        containers.resetCurrentPages(area.div.id);

        _loaderPool.loadContent(content, area.$contentContainer, deferred);

        return deferred;
    }

    function _internalPageLoad(pageId, container) {
        _internalCall = true;
        return this.loadPage(pageId, container);
    }

    function _pageChangeRequest(e) {
        var container = document.getElementById(e.detail.containerId);
        if (container !== null) {
            this.loadPage(e.detail.pageId, document.getElementById(e.detail.containerId));
        }
    }

    function _emptyContainer(container) {

        if (container.childNodes.length > 0) {

            var i, l, collection,
                $container = $(container);

            collection = $container.find('.LayoutArea');
            for (i = 0, l = collection.length; i < l; i += 1) {
                Areas.get(collection[i].id).dispose();
                containers.dispose(collection[i].id);
            }

            collection = $container.find('.systemContentLoader');
            for (i = 0, l = collection.length; i < l; i += 1) {
                if (_loaderPool.slots <= _loaderPool.maxSlots) {
                    _loaderPool.suspendLoader(collection[i]);
                } else {
                    _loaderPool.flushLoader(collection[i]);
                }
                containers.dispose(collection[i].id);
            }
            containers.resetCurrentPages(container.id);
            if (container !== this.rootContainer) {
                brease.uiController.dispose(container);
            }

            $container.children().not('.iScrollLoneScrollbar,.iScrollBothScrollbars,.ScrollBox').remove();
            $container.children('.ScrollBox').empty();
        }
    }
    var stylePattern = new RegExp(".*_style_.*");

    function _setStyle(style, container, type) {

        var $el = $(container), //container is either a HTMLElement or an id-selector
            styleClass = 'system_brease_' + type + '_style_' + style;

        if (type === PageTypes.DIALOG) {
            $el = $el.closest('[data-brease-widget="widgets/brease/DialogWindow"]');
        }
        var classList = $el[0].classList;

        if (classList.contains(styleClass) === false) {


            for (var i in classList) {
                if (stylePattern.test(classList[i])) {
                    $el.removeClass(classList[i]);
                }
            }
            $el.addClass(styleClass);
        }
    }

    return PageController;

});
