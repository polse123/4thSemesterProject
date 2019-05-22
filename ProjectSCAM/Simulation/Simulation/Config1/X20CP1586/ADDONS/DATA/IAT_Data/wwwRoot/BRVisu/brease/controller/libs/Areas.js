/*global define*/
define(['brease/enum/Enum', 'brease/controller/objects/PageTypes'], function (Enum, PageTypes) {

    'use strict';

    /**
    * @class brease.controller.libs.Areas
    * @extends Object
    * @singleton
    */

    var Area = function (id, areaObj) {
        this.id = id;
        this.init(areaObj);
    },
    stylePattern = new RegExp(".*_style_.*"),
    scrollboxUse = true;

    Area.prototype.init = function (areaObj) {
        this.div = _createAreaDiv(this.id, areaObj);
        if (scrollboxUse) {
            this.innerBox = _createInnerBox(this.id, areaObj);
            this.div.appendChild(this.innerBox);
            this.$innerBox = $(this.innerBox);
        }
        this.$div = $(this.div);
        this.obj = areaObj;
    };

    Object.defineProperty(Area.prototype, 'contentContainer', { get: function () { return (scrollboxUse) ? this.innerBox : this.div; } });
    Object.defineProperty(Area.prototype, '$contentContainer', { get: function () { return (scrollboxUse) ? this.$innerBox : this.$div; } });

    Area.prototype.setStyle = function (style) {
        var styleClass = 'system_brease_Area_style_' + style;

        var classList = this.div.classList;

        if (classList.contains(styleClass) === false) {
            for (var i in classList) {
                if (stylePattern.test(classList[i])) {
                    this.$div.removeClass(classList[i]);
                }
            }
            this.$div.addClass(styleClass);
        }
    };

    Area.prototype.show = function () {
        this.$div.css('display', 'block');
    };

    Area.prototype.hide = function () {
        this.$div.css('display', 'none');
    };

    Area.prototype.dispose = function () {
        AreaController.scrollManager.remove(this.id);
        this.div = null;
        this.$div = null;
        if (scrollboxUse) {
            this.innerBox = null;
            this.$innerBox = null;
        }
        this.obj = null;
    };

    Area.prototype.addScrollbars = function (contentSize, zoomFactor) {

        var scrollX = contentSize && contentSize.width * zoomFactor > this.obj.width,
            scrollY = contentSize && contentSize.height * zoomFactor > this.obj.height;

        if (scrollboxUse) {
            this.$innerBox.css({ width: contentSize.width * zoomFactor, height: contentSize.height * zoomFactor });
        }

        if ((scrollX || scrollY) && AreaController.scrollManager.hasScroller(this.div) === false) {
            AreaController.scrollManager.add(this.div);
        } else {
            AreaController.scrollManager.refresh(this.div.id);
        }
    };

    Area.prototype.setProperties = function (contentSize, assignment, zoomFactor, contentChange) {

        var css = {};

        if (assignment.areaId !== undefined) {
            css['background-color'] = (assignment.backColor) ? assignment.backColor : '';
            css = _addBackground(css, assignment);
        }
        this.$div.css(css);
        this.addScrollbars(contentSize, zoomFactor);
        if (contentChange !== false) {
            if (AreaController.scrollManager.hasScroller(this.div)) {
                AreaController.scrollManager.refresh(this.id);
                AreaController.scrollManager.scrollTo(this.id, 0, 0);
            } else {
                this.$div.scrollLeft(0).scrollTop(0);
            }
        }
    };

    function _addBackground(css, assignment) {
        if (assignment.backGround || assignment.backGroundGradient) {
            css['background-image'] = '';
            if (assignment.backGroundGradient) {
                css['background-image'] += assignment.backGroundGradient;
            }
            if (assignment.backGround) {
                css['background-image'] += ((css['background-image'] !== '') ? ', ' : '') + 'url(' + assignment.backGround + ')';
                css['background-repeat'] = 'no-repeat';
            }
        } else {
            css['background-image'] = '';
        }

        if (assignment.sizeMode) {
            css['background-size'] = Enum.SizeMode.convertToCSS(assignment.sizeMode);
        }
        return css;
    }

    function _createAreaDiv(id, areaObj) {
        var div = document.createElement('div');
        div.setAttribute('id', id);
        div.setAttribute('style', 'position:absolute;' + ((areaObj.zIndex !== undefined) ? 'z-index:' + areaObj.zIndex + ';' : '') + 'overflow:hidden; top:' + areaObj.top + 'px; left:' + areaObj.left + 'px; width:' + areaObj.width + 'px; height:' + areaObj.height + 'px; box-sizing: border-box;display:block;');
        div.setAttribute('class', 'LayoutArea');
        div.setAttribute('data-brease-areaId', areaObj.id);
        return div;
    }

    function _createInnerBox(id, areaObj) {
        var box = document.createElement('div');
        box.setAttribute('id', _boxId(id));
        box.setAttribute('class', 'ScrollBox');
        box.setAttribute('style', 'position:absolute;top:0px; left:0px; width:' + areaObj.width + 'px; height:' + areaObj.height + 'px; box-sizing: border-box;display:block;');
        return box;
    }

    function _boxId(id) {
        return id + ((scrollboxUse) ? '_box' : '');
    }

    var AreaController = {

        init: function (scrollManager, rootContainerId) {
            this.scrollManager = scrollManager;
            this.rootContainerId = rootContainerId;
        },

        add: function (containerId, layoutId, areaObj, pageType) {
            var areaDivId = this.getAreaDivId(containerId, layoutId, areaObj.id, pageType),
                instance = _areas[areaDivId];

            if (instance === undefined) {
                _areas[areaDivId] = instance = new Area(areaDivId, areaObj);
            } else {
                instance.init(areaObj);
            }
            return instance;
        },

        get: function (id) {
            return _areas[id];
        },

        // containerId is either an areaDivId or rootContainerId or dialogDivId
        getArea: function (containerId, layoutId, areaId, pageType) {
            return _areas[this.getAreaDivId(containerId, layoutId, areaId, pageType)];
        },

        // containerId is either an areaDivId or rootContainerId or dialogDivId
        getAreaDivId: function (containerId, layoutId, areaId, pageType) {
            //console.warn("getAreaDivId:" ,containerId, layoutId, areaId, pageType);
            containerId = (containerId === this.rootContainerId) ? 'root' : ((pageType === PageTypes.DIALOG) ? containerId : _boxId(containerId));
            return containerId + '_' + layoutId + '_' + areaId;
        }

    },
    _areas = {};

    return AreaController;
});