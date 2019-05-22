/*global define,brease*/
define(['widgets/brease/Window/Window', 'brease/events/BreaseEvent', 'brease/enum/Enum', 'brease/core/Utils'], function (SuperClass, BreaseEvent, Enum, Utils) {

    "use strict";

    /**
    * @class widgets.brease.DialogWindow
    * #Description
    * widget to show a dialog window
    * @extends widgets.brease.Window
    *
    * @iatMeta studio:visible
    * false
    * @iatMeta category:Category
    * System
    */

    /**
    * @cfg {Boolean} modal = true
    * @inheritdoc 
    */
    /**
    * @cfg {Boolean} forceInteraction = true
    * @inheritdoc 
    */
    /**
    * @cfg {Boolean} showCloseButton = false
    * @inheritdoc  
    */
    var defaultSettings = {
        modal: true,
        arrow: {
            show: false
        },
        forceInteraction: true,
        showCloseButton: true,
        position: {
            horizontal: 'center',
            vertical: 'middle'
        },
        pointOfOrigin: Enum.PointOfOrigin.CONTAINER,
        html: 'widgets/brease/DialogWindow/DialogWindow.html',
        stylePrefix: "system_brease_Dialog",
        width: 400,
        height: 200
    },

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
    WidgetClass = SuperClass.extend(function DialogWindow(elem, options, deferredInit, inherited) {
        if (inherited === true) {
            SuperClass.call(this, null, null, true, true);
        } else {

            SuperClass.call(this, null, options, true, true);
            _loadHTML(this);
        }

    }, defaultSettings),

    p = WidgetClass.prototype,
    _counter = 0;

    function _loadHTML(widget) {
        require(['text!' + widget.settings.html], function _loadHTMLSuccess(html) {
            var id = "DialogWindow" + (_counter += 1);
            html = html.replace(/\{\{ID\}\}/g, id);
            widget.deferredInit.call(widget, document.body, html);
            widget.headerEl = widget.el.find('header .textDiv');
            widget.imgEl = widget.el.find('header img.dummyImage');
            widget.$imageDiv = widget.el.find('header .imageDiv');
            widget.innerHeader = widget.el.find('.innerHeader');
            widget.readyHandler();
        });
    }

    p.init = function () {
        this.addInitialClass('breaseDialogWindow');
        this.contentBox = this.el.find('.contentBox');
        this.settings.windowType = 'DialogWindow';
        SuperClass.prototype.init.call(this, true);
    };

    p._setDimensions = function () {

        if (this.contentBox.children().length > 0) {
            var size = _getLayoutSize(this.contentBox);
            this.contentBox.css({ 'height': size.height, 'width': size.width });
            this.settings.width = undefined;
            this.settings.height = undefined;

        }
        else {
            this.settings.height = this.defaultSettings.height;
            this.settings.width = this.defaultSettings.width;
        }
        var dialog = brease.pageController.getDialogById(this.settings.id);
        if (dialog) {
            var layout = brease.pageController.getLayoutById(dialog.layout);
            this.innerHeader.css('max-width', layout.width + 'px');
        }
        SuperClass.prototype._setDimensions.call(this);
    };


    /**
    * @method show
    * Opens the DialogWindow
    * @param {brease.objects.DialogWindowOptions} options
    * @param {HTMLElement} refElement Either HTML element of opener widget or any HTML element for relative positioning.
    * @return {Boolean} success Returns true, if dialog exists.
    */
    p.show = function (options, refElement) {

        var dialog = brease.pageController.loadDialog(options.id, this.contentBox[0]);

        if (options.headerText !== undefined) {
            options.header = { text: options.headerText };
        }

        if (options.headerText === undefined && dialog !== undefined && dialog.displayName !== undefined) {
            options.header = { text: dialog.displayName };
        }

        var zoomFactor = 1;
        if (dialog === undefined) {

            this.el.find('.contentBox').css('width', 'auto');

            var message = brease.language.getSystemTextByKey("BR/IAT/brease.error.DIALOG_NOT_FOUND");

            brease.textFormatter.format(message, [options.id]).then(this._bind(_showError));
        } else {

            // A&P 466795: Dialog has to be zoomed like the visu it belongs to
            zoomFactor = _setZoom(this.el, dialog.visuId);
        }
        options.zoomFactor = zoomFactor;

        this.el.attr("data-brease-dialogId", options.id);

        if (dialog && dialog.style) { options.style = dialog.style; }
        SuperClass.prototype.show.call(this, options, refElement);
        this._setDimensions();
        document.body.addEventListener(BreaseEvent.THEME_CHANGED, this._bind('_themeChangeHandler'));
        return (dialog !== undefined);
    };

    function getBackgroundImageUrl($div) {

        var css = $div.css('background-image');
        if (css !== undefined && css !== null && css !== 'none') {
            return css.match(/url\([^\)]+\)/gi)[0].split(/[()'"]+/)[1];
        } else {
            return undefined;
        }
    }

    p._themeChangeHandler = function () {
        this._setImage();
    };

    p._setImage = function () {
        var url = getBackgroundImageUrl(this.$imageDiv);
        if (url !== undefined) {
            this.imgEl.attr('src', url);
            this.$imageDiv.css('display', 'inline-block');
        } else {
            this.$imageDiv.css('display', 'none');
        }
        var maxWidth = Math.floor(this.el.find('header').outerWidth() - this.headerEl.outerWidth() - this.closeButton.outerWidth() - 20);
        this.$imageDiv.css('max-width', maxWidth + 'px');
    };

    p._setContent = function () {
        SuperClass.prototype._setContent.apply(this, arguments);
        this._setImage();
    };

    function _showError(text) {
        this.contentBox.append($('<div class="errorText" >' + text + '</div>'));
    }

    function _setZoom($el, visuId) {

        var visu = brease.pageController.getVisuById(visuId),
            factor = 1;

        // it's possible to load a dialog from an embedded Visu which is not loaded so far -> containerID is undefined
        if (visu && visu.containerId) {

            var currentPage = brease.pageController.getPageById(brease.pageController.getCurrentPage(visu.containerId));
            if (currentPage) {
                var layoutDiv = document.querySelector('[data-brease-layoutid="' + currentPage.layout + '"]');

                factor = Utils.getScaleFactor(layoutDiv);
            }
        }

        $el.css({ 'transform': 'scale(' + factor + ',' + factor + ')', 'transform-origin': '0 0' });

        return factor;
    }

    /**
    * @method hide
    * closes window  
    */
    p.hide = function () {
        brease.pageController.emptyContainer(this.contentBox[0]);

        document.body.removeEventListener(BreaseEvent.THEME_CHANGED, this._bind('_themeChangeHandler'));
        SuperClass.prototype.hide.call(this);
    };

    p.dispose = function () {
        document.body.removeEventListener(BreaseEvent.THEME_CHANGED, this._bind('_themeChangeHandler'));
        SuperClass.prototype.dispose.apply(this, arguments);
    };

    function _getLayoutSize(container) {
        var size = {
            width: 0,
            height: 0
        },
        areas = container.find('> div');

        if (areas.length > 0) {
            var pos, area;
            for (var i = 0; i < areas.length; i += 1) {
                area = $(areas[i]);
                pos = area.position();
                size.width = Math.max(size.width, pos.left + area.width());
                size.height = Math.max(size.height, pos.top + area.height());
            }
        }
        return size;
    }

    return WidgetClass;

});