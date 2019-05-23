/*global define,brease,CustomEvent,_*/
define(['brease/core/BaseWidget', 'widgets/brease/Window/libs/Config', 'brease/events/BreaseEvent', 'brease/enum/Enum', 'brease/core/Utils', 'brease/decorators/LanguageDependency', 'brease/controller/PopUpManager'], function (SuperClass, WindowConfig, BreaseEvent, Enum, Utils, languageDependency, popupManager) {
    /*jshint white:false */
    "use strict";

    /**
    * @class widgets.brease.Window
    * @extends brease.core.BaseWidget
    * @mixin brease.objects.WindowConfig
    * #Description
    * widget to display an overlay with optional header, content and close button.
    *
    * @iatMeta studio:visible
    * false
    * @iatMeta category:Category
    * System
    */
    var defaultSettings = WindowConfig,

    /**
	* @method setEnable
    * @inheritdoc
	*/
    /**
	* @method setVisible
    * @inheritdoc
	*/
    /**
	* @method setStyle
    * @inheritdoc
	*/
    /**
    * @event EnableChanged
    * @inheritdoc
    */
    /**
    * @event Click
    * @inheritdoc
    */
    /**
    * @event VisibleChanged
    * @inheritdoc
    */
    WidgetClass = SuperClass.extend(function Window(elem, options, deferredInit, inherited) {
        SuperClass.call(this, elem, options, (deferredInit !== undefined) ? deferredInit : true, true);
        if (inherited !== true) {
            _loadHTML(this);
        }
        this.readyDeferred = $.Deferred();
    }, defaultSettings),

    p = WidgetClass.prototype;

    p.init = function () {

        if (this.settings.omitClass !== true) {
            this.addInitialClass('breaseWindow');
        }
        this.settings.stylePrefix = this.settings.stylePrefix || this.el.attr("data-brease-widget");
        this.settings.className = this.settings.className || this.el.attr("data-brease-widget");
        SuperClass.prototype.init.apply(this, arguments);

        this.arrow = this.el.find('.breaseWindowArrow');
        this.closeButton = this.el.find('.breaseWindowClose');
        this.header = this.el.find('> header');
        this.dimensions = {
            scale: 1
        };
        this.instanceSettings = Utils.deepCopy(this.settings);

        this.debouncedHide = _.debounce(this._bind('hide'), 10);
    };

    p.langChangeHandler = function () {
        this._setContent();
    };

    /**
    * @method show
    * Method to show the Window. 
    * @param {brease.objects.WindowOptions} options
    * @param {HTMLElement} refElement Either HTML element of opener widget or any HTML element for relative positioning.
    */
    p.show = function (options, refElement) {
        //console.debug(WidgetClass.name + '[' + this.elem.id + '].show:', options, ',refElement:' + refElement.id);
        var widget = this;
        this.closeDeferred = $.Deferred();
        //this.setStyle(this.settings.style);
        popupManager.addWindow(widget.elem.id, widget.settings.windowType);
        this.refElement = (refElement) ? ((refElement.jquery) ? refElement : $(refElement)) : undefined;
        this.settings = $.extend(true, {}, this.instanceSettings, options);
        if (this.settings.header !== undefined && brease.language.isKey(this.settings.header.text)) {
            this.settings.header.textkey = brease.language.parseKey(this.settings.header.text);
        }
        if (this.settings.content !== undefined && brease.language.isKey(this.settings.content.text)) {
            this.settings.content.textkey = brease.language.parseKey(this.settings.content.text);
        }
        var maxIndex = popupManager.getHighestZindex();
        this.el.css({
            'display': 'block',
            'z-index': maxIndex + 2
        });
        this._setModal(maxIndex);

        if (this.settings.cssClass !== undefined) {
            this.el.addClass(this.settings.cssClass);
        }

        this._setDimensions();
        this._setCloseButton();
        this._setContent();
        this._setPosition();
        this.setStyle(this.settings.style);
        _updateModalOverlays();
        brease.bodyEl.on(BreaseEvent.CLICK, widget._bind('_documentClickHandler'));
        this.dispatchEvent(new CustomEvent(BreaseEvent.WINDOW_SHOW, { detail: { id: this.elem.id }, bubbles: true }));
        this.header.on(BreaseEvent.MOUSE_DOWN, this._bind('_headerDownHandler'));
        this.el.on(BreaseEvent.MOUSE_DOWN, this._bind('_windowInFrontHandler'));
    };

    p.closeOnLostContentListener = function () {
        this.hide();
    };

    p.closeOnLostContent = function (refElement) {
        this.opener = brease.pageController.getLoaderForElement(refElement);
        if (this.opener) {
            this.opener.addEventListener(BreaseEvent.FRAGMENT_HIDE, this._bind('closeOnLostContentListener'));
        }
    };

    p.removeCloseOnLostContent = function () {
        if (this.opener) {
            this.opener.removeEventListener(BreaseEvent.FRAGMENT_HIDE, this._bind('closeOnLostContentListener'));
            this.opener = undefined;
        }
    };

    /**
    * @method hide
    * Method to hide the Window.  
    */
    p.hide = function () {
        var widget = this;
        this.el.css({
            'display': 'none'
        });
        if (this.settings.cssClass !== undefined) {
            this.el.removeClass(this.settings.cssClass);
        }
        brease.bodyEl.off(BreaseEvent.CLICK, widget._bind('_documentClickHandler'));
        this.removeCloseOnLostContent();
        this._removeModal();
        popupManager.removeWindow(widget.elem.id);

        this.refElement = null;

        this.dispatchEvent(new CustomEvent(BreaseEvent.CLOSED, { detail: { id: this.elem.id }, bubbles: true }));
        if (this.closeDeferred) {
            this.closeDeferred.resolve();
        }
        this.header.off(BreaseEvent.MOUSE_DOWN, this._bind('_headerDownHandler'));
        this.el.off(BreaseEvent.MOUSE_DOWN, this._bind('_windowInFrontHandler'));
        this.closeButton.off('click', this._bind('_closeButtonClickhandler'));
        _enableScroll.call(this);
        _start = undefined;
    };

    p._removeModal = function () {
        if (this.dimmer) {
            this.dimmer.removeClass('active');
            this.dimmer.hide();
            _updateModalOverlays();
            _removeModalListeners(this);
        }
    };

    function _removeModalListeners(widget) {
        var boundStopPropagation = widget._bind(_stopPropagation);
        widget.dimmer[0].removeEventListener('pointerdown', boundStopPropagation, true);
        widget.dimmer[0].removeEventListener('pointerup', boundStopPropagation, true);
        widget.dimmer[0].removeEventListener('touchstart', boundStopPropagation, BreaseEvent.support.options ? { capture: true, passive: true } : true);
        widget.dimmer[0].removeEventListener('touchend', boundStopPropagation, true);
        widget.dimmer[0].removeEventListener('mousedown', boundStopPropagation, true);
        widget.dimmer[0].removeEventListener('mouseup', boundStopPropagation, true);
        widget.dimmer.off(BreaseEvent.CLICK, widget._bind('_dimmerClickHandler'));
    }

    function _addModalListeners(widget) {
        var boundStopPropagation = widget._bind(_stopPropagation);
        widget.dimmer[0].addEventListener('pointerdown', boundStopPropagation, true);
        widget.dimmer[0].addEventListener('pointerup', boundStopPropagation, true);
        widget.dimmer[0].addEventListener('touchstart', boundStopPropagation, BreaseEvent.support.options ? { capture: true, passive: true } : true);
        widget.dimmer[0].addEventListener('touchend', boundStopPropagation, true);
        widget.dimmer[0].addEventListener('mousedown', boundStopPropagation, true);
        widget.dimmer[0].addEventListener('mouseup', boundStopPropagation, true);
        widget.dimmer.on(BreaseEvent.CLICK, widget._bind('_dimmerClickHandler'));
    }

    var _start;
    function _stopPropagation(e) {
        var stop = true;
        if (e.type === 'mouseup') {
            if (_start && $.containsOrEquals(this.elem, _start)) {
                stop = false;
                _start = undefined;
            }
        }
        if (stop === true) {
            e.stopPropagation();
            e.stopImmediatePropagation();
        }
    }

    p._setArrow = function (hasArrow, refOffset, refWidth, refHeight, elLeft, elTop, elWidth, elHeight) {

        var rootZoom = brease.pageController.getRootZoom();

        if (this.arrow.length > 0) {
            this.arrow.show();
        } else {
            this._addArrow();
        }

        this.el.removeClass('arrowRight arrowLeft arrowTop arrowBottom');

        switch (this.settings.arrow.position) {
            case Enum.Position.right:
                this.el.addClass('arrowRight');
                break;
            case Enum.Position.left:
                this.el.addClass('arrowLeft');
                break;
            case Enum.Position.top:
                this.el.addClass('arrowTop');
                break;
            case Enum.Position.bottom:
                this.el.addClass('arrowBottom');
                break;
        }

        if (this.arrow !== undefined && hasArrow === true) {
            if (this.settings.position.vertical === 'middle') {
                var top = Math.abs(elTop - refOffset.top) - this.settings.arrow.width + (refHeight / 2) * rootZoom;
                if (top < 0) {
                    top = 0;
                }
                if (top + 2 * this.settings.arrow.width > elHeight) {
                    top = elHeight - 2 * this.settings.arrow.width;
                }
                this.arrow.css({
                    top: (top / this.dimensions.scale) + 'px', left: ''
                });
            } else {
                var left = Math.abs(elLeft - refOffset.left) - this.settings.arrow.width + refWidth / 2;
                if (left < 0) {
                    left = 0;
                }
                if (left + 2 * this.settings.arrow.width > elWidth) {
                    left = elWidth - 2 * this.settings.arrow.width;
                }
                this.arrow.css({
                    top: '', left: left + 'px'
                });
            }
        }
    };

    p._setDimensions = function () {

        if (this.settings.width !== undefined) {
            this.el.css('width', this.settings.width + 'px');
        } else {
            this.el.css('width', 'auto');
        }
        if (this.settings.height !== undefined) {
            this.el.css('height', this.settings.height + 'px');
            var borderBottom = parseInt(this.el.css('border-bottom'), 10);
            this.el.find('.contentBox').css('height', this.settings.height - this.el.find('header').height() - ((isNaN(borderBottom)) ? 0 : borderBottom));
        } else {
            this.el.css('height', 'auto');
        }
        this.dimensions.width = this.el.outerWidth();
        this.dimensions.height = this.el.outerHeight();
        if (this.settings.scale2fit) {
            _scale2fit.call(this);
        }
    };

    function _scale2fit() {
        var globalDim = popupManager.getDimensions();

        if (this.dimensions.width > globalDim.winWidth || this.dimensions.height > globalDim.winHeight) {
            var factor = Math.min(globalDim.winWidth / this.dimensions.width, globalDim.winHeight / this.dimensions.height);
            this.el.css({
                'transform': 'scale(' + factor + ',' + factor + ')', 'transform-origin': '0 0'
            });
            this.dimensions.scale = factor;
        } else {
            this.el.css({
                'transform': 'none'
            });
            this.dimensions.scale = 1;
        }
    }

    p._setCloseButton = function () {
        if (this.settings.showCloseButton === true) {
            if (this.closeButton.length > 0) {
                this.closeButton.show();
                _addCloseListener.call(this);
            } else {
                this._addCloseButton();
            }
        } else {
            this.closeButton.hide();
        }

    };

    p._setContent = function () {
        var headerText = (this.settings.header) ? ((this.settings.header.textkey) ? brease.language.getTextByKey(this.settings.header.textkey) : this.settings.header.text) : '';
        if (this.headerEl === undefined) {
            this.headerEl = this.el.find('header > div');
        }
        this.headerEl.text(headerText);

        var contentText = (this.settings.content) ? ((this.settings.content.textkey) ? brease.language.getTextByKey(this.settings.content.textkey) : this.settings.content.text) : '';
        this.el.find('.content').text(contentText);
    };

    p._setPosition = function () {
        var offset = 0;

        //console.log('_setPosition:', { pointOfOrigin: this.settings.pointOfOrigin, horizontal: this.settings.position.horizontal, vertical: this.settings.position.vertical, offset: this.settings.position.offset });

        var position,
            bounding = this.elem.getBoundingClientRect(),
            elWidth = bounding.width,
            elHeight = bounding.height,
            refOffset = _getRefOffset(this.settings.pointOfOrigin, this.refElement),
            globalDim = popupManager.getDimensions(),
            refWidth = _getRefWidth(this.settings.pointOfOrigin, this.refElement, globalDim.appWidth),
            refHeight = _getRefHeight(this.settings.pointOfOrigin, this.refElement, globalDim.appHeight),
            hasArrow = (this.settings.pointOfOrigin === Enum.PointOfOrigin.ELEMENT && this.refElement !== undefined);

        position = _calcPosition(this.settings, elWidth, elHeight, refOffset, refWidth, refHeight, hasArrow);
        position = _respectBoundaries(position, elWidth, elHeight);

        offset = this._getOffset();
        this.el.css({
            display: 'block',
            position: 'fixed',
            left: Math.round(position.x + offset) + 'px',
            top: Math.round(position.y + offset) + 'px',
            margin: 0,
            "margin-left": '0',
            "margin-top": '0'
        });

        if (this.settings.arrow.show === false) {
            this.arrow.hide();
        } else {
            this._setArrow(hasArrow, refOffset, refWidth, refHeight, position.x + offset, position.y + offset, elWidth, elHeight);
        }
    };

    p._getOffset = function () { // returns something !=0 for MessageBox
        return 0;
    };

    p._addArrow = function () {
        this.arrow = $('<i/>').addClass('breaseWindowArrow');
        this.el.append(this.arrow);
    };

    p._addCloseButton = function () {
        this.closeButton = $('<a/>').addClass('breaseWindowClose');
        this.el.find('header').append(this.closeButton);
        _addCloseListener.call(this);
    };

    function _addCloseListener() {
        var instance = this;
        instance._addCloseListenerTimeout = window.setTimeout(function () {
            instance.closeButton.on('click', instance._bind('_closeButtonClickhandler'));
        }, 0);
    }

    p._closeButtonClickhandler = function (e) {
        this._handleEvent(e, true);
        this.debouncedHide();
    };

    p._setModal = function (maxIndex) {
        if (this.settings.modal === true) {
            if (this.dimmer === undefined) {
                this.dimmer = $('<div/>').attr('id', Utils.uniqueID('dimmer')).addClass('breaseModalDimmer').appendTo(document.body);
            }

            this.dimmer.css({
                'z-index': maxIndex + 1, display: 'block'
            });
            _addModalListeners(this);
            _disableScroll.call(this);
        }
    };

    p._documentClickHandler = function (e) {

        //console.log(this.constructor.name + '<' + WidgetClass.name + '>[id=' + this.elem.id + ']._documentClickHandler:', (e.target.id) ? e.target.id : e.target);

        var overlays = popupManager.overlays(this.elem.id),
            ol = overlays.length,
            clickInOverlay = false;

        if (ol > 0) {
            for (var i = 0; i < ol; i += 1) {
                if ($.containsOrEquals(document.getElementById(overlays[i]), e.target) !== false) {
                    clickInOverlay = true;
                }
            }
        }
        var thisZindex = parseFloat(this.el.css('z-index')),
            targetZindex = parseFloat($(e.target).css('z-index')),
            targetInRef = (this.refElement) ? $.containsOrEquals(this.refElement[0], e.target) : false;

        targetZindex = (isNaN(targetZindex)) ? 0 : targetZindex;

        if (clickInOverlay !== true && $.containsOrEquals(this.elem, e.target) === false && !targetInRef && targetZindex < thisZindex && this.settings.forceInteraction !== true) {
            this.debouncedHide();
        }

    };

    p._clickHandler = function (e) {
        // as windows are not bindable -> no need of propagation of click event to mapp view server -> no SuperClass call
        e.stopPropagation();
    };

    p._dimmerClickHandler = function (e) {

        if (this.settings.forceInteraction !== true && this.el.css('display') !== 'none') {
            this.debouncedHide();
        }
        // click-event is stopped at dimmer element to not bother underlying widgets
        e.stopPropagation();
    };

    p._windowInFrontHandler = function (e) {
        if (e.type.indexOf('mousedown') !== -1) {
            _start = e.target;
        }
        var maxIndex = popupManager.getHighestZindex(),
            curIndex = parseInt(this.el.css('z-index'), 10);

        if (maxIndex > curIndex) {
            this.el.css({
                'display': 'block',
                'z-index': maxIndex + 2
            });

            if (this.dimmer) {
                this.dimmer.css({
                    'z-index': maxIndex + 1
                });
            }
        }
    };

    p._headerDownHandler = function (e) {

        if (e.target !== this.closeButton[0]) {
            brease.bodyEl.on(BreaseEvent.MOUSE_MOVE, this._bind('_headerMoveHandler'));
            brease.bodyEl.on(BreaseEvent.MOUSE_UP, this._bind('_headerUpHandler'));

            this.startCursor = {
                left: e.pageX, top: e.pageY
            };
            this.startOffset = this.el.offset();
        }
    };

    p._headerMoveHandler = function (e) {
        var offset = {
            left: this.startOffset.left + (e.pageX - this.startCursor.left),
            top: this.startOffset.top + (e.pageY - this.startCursor.top)
        },
            scrollTopPos = document.body.scrollTop,
            scrollLeftPos = document.body.scrollLeft;

        //Check if window is inside boundaries
        if (e.pageX < 0 + scrollLeftPos) {
            return;
        }
        else if (e.pageY < 0 + scrollTopPos) {
            return;
        }

        else if (e.pageX > window.innerWidth + scrollLeftPos) {
            return;
        }

        else if (e.pageY > window.innerHeight + scrollTopPos) {
            return;
        }

        //set offset
        this.el.offset(offset);

    };

    p._headerUpHandler = function () {

        brease.bodyEl.off(BreaseEvent.MOUSE_MOVE, this._bind('_headerMoveHandler'));
        brease.bodyEl.off(BreaseEvent.MOUSE_UP, this._bind('_headerUpHandler'));

    };

    p.dispose = function () {
        brease.bodyEl.off(BreaseEvent.CLICK, this._bind('_documentClickHandler'));
        this.closeButton.off('click', this._bind('_closeButtonClickhandler'));
        if (this.dimmer) {
            this.dimmer.remove();
        }
        this.closeDeferred = null;
        window.clearTimeout(this._addCloseListenerTimeout);
        SuperClass.prototype.dispose.apply(this, arguments);
    };

    p.isReady = function () {
        return this.readyDeferred.promise();
    };

    p.onClose = function () {
        return this.closeDeferred.promise();
    };

    p.readyHandler = function () {
        this.settings.parentContentId = brease.settings.globalContent;
        brease.uiController.addWidget(this);
        this.readyDeferred.resolve(this);
        this._dispatchReady();
    };

    /// PRIVATE

    function _calcPosition(settings, elWidth, elHeight, refOffset, refWidth, refHeight, hasArrow) {
        var position = {
            x: 0,
            y: 0
        },
        rootZoom = brease.pageController.getRootZoom();

        if (hasArrow === true) {

            switch (settings.position.horizontal) {
                case Enum.Position.left:
                    position.x = refOffset.left - elWidth;
                    break;

                case Enum.Position.right:
                    position.x = refOffset.left + rootZoom * refWidth;
                    break;

                default: //center
                    position.x = refOffset.left + refWidth / 2 - elWidth / 2;
                    break;
            }

            switch (settings.position.vertical) {
                case Enum.Position.top:
                    position.y = refOffset.top - elHeight;
                    break;

                case Enum.Position.bottom:
                    position.y = refOffset.top + refHeight;
                    break;

                default: //middle:
                    position.y = refOffset.top + rootZoom * (refHeight / 2) - 40;
                    break;
            }
            position = _addArrowOffset(position, settings);

        } else {

            if (!_.isNumber(settings.position.horizontal)) {
                switch (settings.position.horizontal) {
                    case Enum.Position.left:
                        position.x = refOffset.left;
                        break;
                    case Enum.Position.right:
                        position.x = refOffset.left + refWidth - elWidth;
                        break;
                    default: //center
                        position.x = refOffset.left + (refWidth - elWidth) / 2;
                        break;
                }
            } else {
                position.x = rootZoom * (refOffset.left + settings.position.horizontal);
            }

            if (!_.isNumber(settings.position.vertical)) {
                switch (settings.position.vertical) {
                    case Enum.Position.top:
                        position.y = refOffset.top;
                        break;

                    case Enum.Position.bottom:
                        position.y = refOffset.top + refHeight - elHeight;
                        break;

                    default: //middle:
                        position.y = refOffset.top + (refHeight - elHeight) / 2;
                        break;
                }
            } else {
                position.y = rootZoom * (refOffset.top + settings.position.vertical);
            }
        }
        return position;
    }

    function _addArrowOffset(position, settings) {
        switch (settings.arrow.position) {
            case Enum.Position.top:
                position.y += settings.arrow.width;
                position.y += ((settings.position.offset !== undefined) ? settings.position.offset : 0);
                break;
            case Enum.Position.bottom:
                position.y -= settings.arrow.width;
                position.y -= ((settings.position.offset !== undefined) ? settings.position.offset : 0);
                break;
            case Enum.Position.right:
                position.x -= settings.arrow.width;
                position.x -= ((settings.position.offset !== undefined) ? settings.position.offset : 0);
                break;
            default: //left
                position.x += settings.arrow.width;
                position.x += ((settings.position.offset !== undefined) ? settings.position.offset : 0);
                break;
        }
        return position;
    }

    function _respectBoundaries(position, elWidth, elHeight) {

        var globalDim = popupManager.getDimensions(),
            maxWidth = Math.min(_getRefWidth(Enum.PointOfOrigin.APP, undefined, globalDim.appWidth), globalDim.winWidth),
            maxHeight = Math.min(_getRefHeight(Enum.PointOfOrigin.APP, undefined, globalDim.appHeight), globalDim.winHeight);

        if (position.x + elWidth > maxWidth) {
            position.x = maxWidth - elWidth;
        }
        if (position.x < 0) {
            position.x = 0;
        }
        if (position.y + elHeight > maxHeight) {
            position.y = maxHeight - elHeight;
        }
        if (position.y < 0) {
            position.y = 0;
        }
        return position;
    }

    function _getRefOffset(pointOfOrigin, refElement) {
        if (refElement !== undefined && pointOfOrigin !== Enum.PointOfOrigin.APP) {
            return refElement.offset();
        } else {
            return {
                top: 0, left: 0
            };
        }
    }
    function _getRefWidth(pointOfOrigin, refElement, appWidth) {
        if (refElement !== undefined && pointOfOrigin !== Enum.PointOfOrigin.APP) {
            return refElement.outerWidth();
        } else {
            // e.g. for MessageBox before any page is loaded
            return (appWidth > 100) ? appWidth : window.innerWidth;
        }
    }
    function _getRefHeight(pointOfOrigin, refElement, appHeight) {
        if (refElement !== undefined && pointOfOrigin !== Enum.PointOfOrigin.APP) {
            return refElement.outerHeight();
        } else {
            // e.g. for MessageBox before any page is loaded
            return (appHeight > 100) ? appHeight : window.innerHeight;
        }
    }

    function _loadHTML(widget) {
        require(['text!' + widget.settings.html], function (html) {
            var elemId = widget.settings.id || Utils.uniqueID('window');
            html = html.replace('WIDGETID', elemId);
            widget.deferredInit.call(widget, document.body, html);
            widget.headerEl = widget.el.find('header > div');
            widget.readyHandler();
            brease.uiController.parse(widget.elem);
        });
    }

    function _updateModalOverlays() {
        var index,
            maxIndex = 0,
            currentObject,
            activObject,
            overlays = $('.breaseModalDimmer:visible');

        for (var i = 0; i < overlays.length; i += 1) {
            currentObject = $(overlays[i]);
            currentObject.removeClass('active');
            index = currentObject.css('z-index');
            if (index > maxIndex) {
                maxIndex = index;
                activObject = currentObject;
            }
        }

        if (activObject) {
            activObject.addClass('active');
        }
    }

    var _safe;

    function _disableScroll() {
        this.dimmer.on('mousewheel DOMMouseScroll', _preventDefault);
        if (!_safe) {
            _safe = {
                x: brease.bodyEl.css('overflow-x'),
                y: brease.bodyEl.css('overflow-y')
            };
        }
        document.body.style.overflow = 'hidden';
    }

    function _enableScroll() {
        if ($('.breaseModalDimmer:visible').length === 0 && this.dimmer) {
            this.dimmer.off('mousewheel DOMMouseScroll', _preventDefault);
            brease.bodyEl.css('overflow-x', _safe.x);
            brease.bodyEl.css('overflow-y', _safe.y);
        }
    }

    function _preventDefault(e) {
        e.preventDefault();
    }

    return languageDependency.decorate(WidgetClass, true);

});
