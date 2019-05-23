/*global define,brease,console,CustomEvent*/
define(function (require) {
    /*jshint white:false */
    'use strict';

    var SuperClass = require('brease/core/BaseWidget'),
		Enum = require('brease/enum/Enum'),
		BreaseEvent = require('brease/events/BreaseEvent'),
		uiController = brease.uiController,
		bindingController = require('brease/controller/BindingController'),
		Utils = require('brease/core/Utils'),

	/**
	* @class widgets.brease.FragmentLoader
	* #Description
	* widget to load HTML fragments (contents).  
	* @breaseNote
	* @extends brease.core.BaseWidget
	*
    * @iatMeta studio:visible
	* false
	* @iatMeta category:Category
	* System
	* @iatMeta category:IO
	* System
	* @iatMeta category:Performance
	* Low,Medium,High
	* @iatMeta description:short
	* Container welcher Contents zur Laufzeit ladet
	* @iatMeta description:de
	* Container welcher contents zur Laufzeit ladet
	* @iatMeta description:en
	* Container that loads contents during runtime
	*/

	/**
	* @cfg {brease.enum.LoadPolicy} loadPolicy='onDemand'
	* @iatStudioExposed
	* Policy for loading data  
	*/
	/**
	* @cfg {brease.enum.CachePolicy} cachePolicy='noCache'
	* @iatStudioExposed
	* Policy for caching data  
	*/
	/** 
	* @cfg {String} url='' url of content to load
	* @iatStudioExposed
	*/
	/**
	* @cfg {ContentReference} contentId='' contentId of content to load 
	* @iatStudioExposed
	*/

	/**
	* @cfg {Boolean} enable
	* @hide
	*/
	/**
	* @cfg {StyleReference} style
	* @hide
	*/
	defaultSettings = {
	    loadPolicy: Enum.LoadPolicy.ONDEMAND,
	    cachePolicy: Enum.CachePolicy.NO_CACHE,
	    omitClass: true,
	    initialHide: false
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
    * @event VisibleChanged
    * @inheritdoc
    */
	WidgetClass = SuperClass.extend(function FragmentLoader() {
	    SuperClass.apply(this, arguments);
	}, defaultSettings),

	p = WidgetClass.prototype;

    p.init = function () {

        if (this.settings.omitClass !== true) {
            this.addInitialClass('breaseFragmentLoader');
        }
        this.isLoaded = false;
        this.loadQueue = [];
        this.timer = null;
        if (this.settings.url && this.settings.loadPolicy === Enum.LoadPolicy.IMMEDIATE) {
            this.load(this.settings.url, this.settings.contentId);
        }
        SuperClass.prototype.init.call(this);
    };

    /**
	* @method load
	* Load a fragment (content) by url.  
	* This method loads the given url independent of other settings like 'cachePolicy'. If another content was loaded before, it will be unloaded.
	* @param {String} url
	* @param {String} [contentId] Optional contentId for binding purposes.
	*/
    p.load = function (url, contentId, showFlag) {

        if ((this.loadQueue.length === 0 || url !== this.loadQueue[0])) {
            this.loadQueue.unshift(url);
            var previousUrl = this.settings.url;
            var previousContentId = this.settings.contentId;
            this.settings.url = url;
            this.settings.contentId = contentId;
            this.loadFlag = true;
            if (showFlag === true) {
                this.settings.initialHide = false;
            }
            window.performanceMonitor.profile('loadContent - ' + this.settings.contentId + '', 0);
            if (this.isLoaded === true) {
                brease.appElem.dispatchEvent(new CustomEvent(BreaseEvent.BEFORE_UNLOAD, { detail: { id: this.elem.id, contentId: previousContentId } }));
                _unload(this, previousUrl, previousContentId);
            } else {
                _load.call(this);
            }

            this.el.attr("data-brease-contentId", contentId);
        }
    };

    /**
	* @method show
	* Shows FragmentLoader and loads its content, if necessary.  
	*/
    p.show = function () {

        if (this.isLoaded === false) {
            this.settings.initialHide = false;
            this.load(this.settings.url, this.settings.contentId);
        } else {
            this.setVisible(true);
            uiController.loadValuesForContent(this.settings.contentId || this.settings.url);

            /**
			* @event fragment_show
			* Fired after fragment is set visible  
			* @param {String} url URL of fragment
			* See at {@link brease.events.BreaseEvent#static-property-FRAGMENT_SHOW BreaseEvent.FRAGMENT_SHOW} for event type  
			* @eventComment
			*/
            this.dispatchEvent(new CustomEvent(BreaseEvent.FRAGMENT_SHOW, { detail: { url: this.settings.url } }));
        }
    };

    /**
	* @method hide
	* Hides FragmentLoader and detaches and/or disposes content, if necessary.
	* @fires fragment_hide
	*/
    p.hide = function () {
        brease.appElem.dispatchEvent(new CustomEvent(BreaseEvent.BEFORE_HIDE, { detail: { id: this.elem.id } }));
        var widget = this;
        this.loadFlag = false;
        if (this.settings.cachePolicy === Enum.CachePolicy.CACHE) {
            bindingController.deactivateContent(this.settings.contentId || this.settings.url);
        } else {
            uiController.dispose(widget.elem, false, widget._bind('contentDisposedHandler'));
            if (this.isLoaded) {
                bindingController.deactivateContent(this.settings.contentId || this.settings.url);
            }
            this.isLoaded = false;

        }
        this.setVisible(false);
        /**
		* @event fragment_hide
		* Fired after fragment is set hidden  
		* @param {String} url URL of fragment
		* See at {@link brease.events.BreaseEvent#static-property-FRAGMENT_HIDE BreaseEvent.FRAGMENT_HIDE} for event type  
		* @eventComment
		*/
        this.dispatchEvent(new CustomEvent(BreaseEvent.FRAGMENT_HIDE, { detail: { url: this.settings.url } }));
    };

    /**
	* @method getIsLoaded
	* Get load state of FragmentLoader.  
	*/
    p.getIsLoaded = function () {

        return this.isLoaded;
    };

    p.getContentId = function () {
        return this.settings.contentId || this.settings.url;
    };

    /**
	* @method getUrl
	* Get url of loaded fragment.<br/>
	*/
    p.getUrl = function () {
        return this.settings.url;
    };

    p.dispose = function () {
        this.loadFlag = false;
        uiController.dispose(this.elem, false);
        if (this.isLoaded === true) {
            bindingController.deactivateContent(this.settings.contentId || this.settings.url);
        }
        SuperClass.prototype.dispose.apply(this, arguments);
    };

    p.contentDisposedHandler = function (callback) {
        this.el.empty();
        if (callback) {
            callback.call(this);
        }
    };

    p.busyHandler = function () {
        this.el.html(brease.language.getTextByKey('BR/IAT/brease.common.pageloading'));
    };

    p._contentReadyHandler = function () {

        var widget = this;
        window.performanceMonitor.profile('sendInitialValues - ' + widget.settings.contentId + '', 0);

        bindingController.sendInitialValues(widget.settings.contentId || widget.settings.url, function () {
            if (widget.elem) {

                if (widget.settings.initialHide !== true && widget.loadFlag === true) {
                    widget.setVisible(true);
                } else {
                    widget.setVisible(false);
                }
                widget.dispatchEvent(new CustomEvent(BreaseEvent.FRAGMENT_SHOW, { detail: { url: widget.settings.url }, bubbles: true }));
            }
            window.performanceMonitor.profile('sendInitialValues - ' + widget.settings.contentId + '', 1);
            window.performanceMonitor.profile('loadContent - ' + widget.settings.contentId + '', 1);
        });
    };

    /**
	* @event Click
	* @hide
	*/

    p._clickHandler = function () {

    };

    function _parseContent(elem) {

        var deferred = $.Deferred(),
            widget = this,
			listener = function () {
			    elem.removeEventListener(BreaseEvent.CONTENT_PARSED, listener);
			    window.performanceMonitor.profile('parseContent - ' + widget.settings.contentId + '', 1);
			    deferred.resolve();
			};
        elem.addEventListener(BreaseEvent.CONTENT_PARSED, listener);
        window.performanceMonitor.profile('parseContent - ' + this.settings.contentId + '', 0);
        uiController.parse(elem);

        return deferred.promise();
    }

    function _unload(widget, url, contentId) {

        widget.isLoaded = false;

        bindingController.deactivateContent(contentId || url);

        uiController.dispose(widget.elem, false, function () {
            widget.contentDisposedHandler.call(widget, _load);
        });

        widget.setVisible(false);
    }

    function _load() {
        var widget = this;
        if (widget.timer) {
            window.clearTimeout(widget.timer);
        }
        widget.timer = window.setTimeout(widget._bind('busyHandler'), 1000);

        window.performanceMonitor.profile('loadContentHTML - ' + widget.settings.contentId + '', 0);
        require(['text!' + widget.settings.url], widget._bind('_loadSuccess'), widget._bind('_loadFail'));
    }

    p._loadSuccess = function (html) {

        var widget = this;
        if (widget.settings.url === widget.loadQueue[0]) {
            if (widget.timer) {
                window.clearTimeout(widget.timer);
            }
            widget.loadQueue.length = 0;

            widget.el.html(Utils.parseTemplate(html));
            widget.el.find('script').remove();
            /**
            * @event fragment_loaded
            * Fired AFTER content is loaded and BEFORE it's parsed  
            * @param {String} url URL of fragment
            * See at {@link brease.events.BreaseEvent#static-property-FRAGMENT_LOADED BreaseEvent.FRAGMENT_LOADED} for event type  
            * @eventComment
            */
            widget.dispatchEvent(new CustomEvent(BreaseEvent.FRAGMENT_LOADED, { detail: { url: widget.settings.url } }));
            window.performanceMonitor.profile('loadContentHTML - ' + widget.settings.contentId + '', 1);
            widget.isLoaded = true;

            $.when(
                bindingController.activateContent(widget.settings.contentId || widget.settings.url),
                _parseContent.call(widget, widget.elem)
            ).then(widget._bind('_contentReadyHandler'));
        }
    };

    p._loadFail = function (error) {
        var widget = this;
        if (widget.timer) {
            window.clearTimeout(widget.timer);
        }
        widget.isLoaded = false;
        /**
        * @event load_error
        * Fired if an error occurs at content loading  
        * @param {String} url URL of fragment
        * See at {@link brease.events.BreaseEvent#static-property-LOAD_ERROR BreaseEvent.LOAD_ERROR} for event type  
        * @eventComment
        */
        if (widget.elem) {
            widget.dispatchEvent(new CustomEvent(BreaseEvent.LOAD_ERROR, { detail: { url: widget.settings.url } }));
            widget.el.html('ERROR: could not load fragment with url=' + widget.settings.url);
            widget.setVisible(true);
        }
        console.iatWarn('WARNING: could not load fragment in FragmentLoader[' + ((widget.elem) ? widget.elem.id : '') + ']:' + error.message);
    };

    return WidgetClass;

});