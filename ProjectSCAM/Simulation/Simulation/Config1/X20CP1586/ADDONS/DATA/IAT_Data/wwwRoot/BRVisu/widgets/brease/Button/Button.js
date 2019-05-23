/*global define,brease,console,CustomEvent,_*/
define(function (require) {
    /*jshint white:false */
    'use strict';

    var SuperClass = require('brease/core/BaseWidget'),
		languageDependency = require('brease/decorators/LanguageDependency'),
		Enum = require('brease/enum/Enum'),
		Types = require('brease/core/Types'),
        Utils = require('brease/core/Utils'),
        UtilsImage = require('widgets/brease/common/libs/wfUtils/UtilsImage'),
		BreaseEvent = require('brease/events/BreaseEvent'),

	/**
	* @class widgets.brease.Button
	* #Description
	* Button with text and/or image.  
	* Text can be language dependent.  
	* @breaseNote 
	* @extends brease.core.BaseWidget
    * @aside example buttons
	*
	* @iatMeta category:Category
	* Buttons
	* @iatMeta description:short
	* Button mit projektierten Aktionen (onClick)
	* @iatMeta description:de
	* Löst ein Ereignis mit einer zugeordneten Aktion aus, wenn der Benutzer darauf klickt
	* @iatMeta description:en
	* Raises an event with an associated action when the user clicks it
	*/

    /**
	* @cfg {ImagePath} image=''
	* @iatStudioExposed
    * @iatCategory Appearance
	* @bindable
	* Path to an optional image. 
	*/

	/**
	* @cfg {ImagePath} mouseDownImage=''
	* @iatStudioExposed
    * @iatCategory Appearance
    * @bindable
	* Path to an optional image for mouseDown.
	*/

	/**
	* @cfg {brease.enum.ImageAlign} imageAlign='left'
	* @iatStudioExposed
    * @iatCategory Appearance
	* Position of image relative to text. 
	*/

	/**
	* @cfg {String} text=''
    * @localizable
	* @iatStudioExposed
    * @iatCategory Appearance
	* @bindable
	* Text which is displayed in the button  
	*/

	/**
	* @cfg {String} mouseDownText=''
    * @localizable
    * @iatCategory Appearance
	* @iatStudioExposed
	* @bindable
	* Text which is displayed in the button when pressed
	*/

	/**
	* @cfg {Boolean} ellipsis=false
	* @iatStudioExposed
    * @iatCategory Behavior 
	* If true, overflow of text is symbolized with an ellipsis. This option has no effect, if wordWrap = true.
	*/

	/**
	* @cfg {Boolean} wordWrap=false
	* @iatStudioExposed
    * @iatCategory Behavior 
	* If true, text will wrap when necessary.  
	* This property has no effect, if multiLine=false
	*/

    /**
    * @cfg {Boolean} breakWord=false
    * @iatStudioExposed
    * @iatCategory Behavior 
	* Allows lines to be broken within words if an otherwise unbreakable string is too long to fit.
    */

	/**
	* @cfg {Boolean} multiLine=false
	* @iatStudioExposed
    * @iatCategory Behavior 
	* If true, more than one line is possible.  
	* Text will wrap when necessary (if property wordWrap is set to true) or at explicit line breaks (\n).
	* If false, text will never wrap to the next line. The text continues on the same line.
	*/

	defaultSettings = {
	    imageAlign: Enum.ImageAlign.left,
	    ellipsis: false,
	    wordWrap: false,
	    multiLine: false,
	    breakWord: false
	},

	WidgetClass = SuperClass.extend(function Button() {
	    SuperClass.apply(this, arguments);
	}, defaultSettings),

	p = WidgetClass.prototype;

    WidgetClass.static.multitouch = true;

    p.init = function () {
        if (this.settings.omitClass !== true) {
            this.addInitialClass('breaseButton');
        }
        _imgHandling.call(this);
        _overflowInit(this);
        _textInit.call(this);

        SuperClass.prototype.init.call(this);
    };

    p.langChangeHandler = function (e) {
        if (this.settings.textkey) {
            this.setText(brease.language.getTextByKey(this.settings.textkey), true);
        }
        if (this.settings.mouseDownTextkey) {
            this.setMouseDownText(brease.language.getTextByKey(this.settings.mouseDownTextkey), true);
        }
    };

    /**
	* @method setText
	* @iatStudioExposed
	* Sets the visible text. This method can remove an optional textkey.
	* @param {String} text
	* @param {Boolean} keepKey Set true, if textkey should not be removed
	*/
    p.setText = function (text, keepKey) {
        this.settings.text = text;
        if (keepKey !== true) {
            this.removeTextKey();
        }

        if (brease.config.editMode !== true) {
            if (brease.language.isKey(this.settings.text) === true) {
                this.setTextKey(brease.language.parseKey(this.settings.text), false);
                this.langChangeHandler();
                return;
            }
        }

        if (this.textEl === undefined) {
            _appendTextEl(this);
        }

        if (this.textEl) {
            this.textEl.text(text);
        }
        
        this.setClasses();
    };

    /**
	* @method getText
	* Returns the visible text.
	* @return {String}
	*/
    p.getText = function () {
        return this.settings.text;
    };

    /**
	* @method setMouseDownText
	* @iatStudioExposed
	* Sets the visible text for pressed state. This method can remove an optional textkey.
	* @param {String} text
	* @param {Boolean} keepKey Set true, if textkey should not be removed
	*/
    p.setMouseDownText = function (text, keepKey) {
        this.settings.mouseDownText = text;

        if (this.settings.mouseDownText !== undefined && this.settings.mouseDownText !== '') {
            if (keepKey !== true) {
                this.removeMouseDownTextKey();
            }

            if (brease.config.editMode !== true) {
                if (brease.language.isKey(this.settings.mouseDownText) === true) {
                    this.setMouseDownTextKey(brease.language.parseKey(this.settings.mouseDownText), false);
                    this.langChangeHandler();
                    return;
                }
            }

            if (this.downtextEl === undefined) {
                _appendDownTextEl(this);
            }

            if (this.downtextEl) {
                if (this.settings.mouseDownText === '') {
                    this.downtextEl.text(this.settings.text);
                }
                this.downtextEl.text(text);
            }
            this.setClasses();
        } else if (this.downtextEl !== undefined) {
            _removeDownTextEl(this);
        }
    };

    /**
	* @method getMouseDownText
	* Returns the visible text for pressed state.
	* @return {String}
	*/
    p.getMouseDownText = function () {
        return this.settings.mouseDownText;
    };

    /**
    * @method setMouseDownImage
    * @iatStudioExposed
    * Sets the image when mouse down
    * @param {ImagePath} mouseDownImage
    */
    p.setMouseDownImage = function (mouseDownImage) {
        if (mouseDownImage === '') {
            this.settings.mouseDownImage = undefined;
            if (this.el.hasClass('active') || this.el.hasClass('checked')) {
                this.setImage(this.settings.image, true);
            }
        } else {
            this.settings.mouseDownImage = mouseDownImage;
            if (this.el.hasClass('active') || this.el.hasClass('checked')) {
                this.setImage(this.settings.mouseDownImage, true);
            }
        }
    };

    /**
	* @method getMouseDownImage 
	* Returns the image when mouse down 
	* @return {ImagePath} mouseDownImage
	*/
    p.getMouseDownImage = function () {
        return this.settings.mouseDownImage;
    };

    /**
    * @method setEllipsis
    * Sets the value if ellipsis should be used.
    * @param {Boolean} ellipsis
    */
    p.setEllipsis = function (ellipsis) {
        this.settings.ellipsis = ellipsis;
        _overflowInit(this);
    };

    /**
	* @method getEllipsis 
	* Returns the value if ellipsis  should be used.
	* @return {Boolean} ellipsis
	*/
    p.getEllipsis = function () {
        return this.settings.ellipsis;
    };

    /**
    * @method setImageAlign
    * Sets the value for image align.
    * @param {brease.enum.ImageAlign} imageAlign
    */
    p.setImageAlign = function (imageAlign) {
        this.settings.imageAlign = imageAlign;
        this.setClasses();
        if (this.textEl && (this.settings.imageAlign === Enum.ImageAlign.left || this.settings.imageAlign === Enum.ImageAlign.top)) {
            this.el.prepend(this.imgEl);
            this.el.prepend(this.svgEl);
        } else {
            this.el.append(this.imgEl);
            this.el.append(this.svgEl);
        }
    };

    /**
	* @method getImageAlign 
	* Returns the value for image align.
	* @return {brease.enum.ImageAlign} imageAlign
	*/
    p.getImageAlign = function () {
        return this.settings.imageAlign;
    };

    /**
    * @method setMultiLine
    * Sets the value for multiLine.
    * @param {Boolean} multiLine
    */
    p.setMultiLine = function (multiLine) {
        this.settings.multiLine = multiLine;
        _overflowInit(this);
    };

    /**
	* @method getMultiLine 
	* Returns the value of multiLine.
	* @return {Boolean} multiLine
	*/
    p.getMultiLine = function () {
        return this.settings.multiLine;
    };

    /**
    * @method setWordWrap
    * Sets the value for word wrap.
    * @param {Boolean} wordWrap
    */
    p.setWordWrap = function (wordWrap) {
        this.settings.wordWrap = wordWrap;
        _overflowInit(this);
    };

    /**
	* @method getWordWrap 
	* Returns the value for word wrap.
	* @return {Boolean} wordWrap
	*/
    p.getWordWrap = function () {
        return this.settings.wordWrap;
    };

    /**
    * @method setBreakWord
    * Sets the value for break word.
    * @param {Boolean} breakWord
    */
    p.setBreakWord = function (breakWord) {
        this.settings.breakWord = breakWord;
        _overflowInit(this);
    };

    /**
	* @method getBreakWord 
	* Returns the value for break word.
	* @return {Boolean} breakWord
	*/
    p.getBreakWord = function () {
        return this.settings.breakWord;
    };

    /**
	* @method setTextKey
	* set the textkey
	* @param {String} key The new textkey
	*/
    p.setTextKey = function (key, invoke) {
        //console.debug(WidgetClass.name + '[id=' + this.elem.id + '].setTextKey:', key);
        if (key !== undefined) {
            this.settings.textkey = key;
            this.setLangDependency(true);
            if (invoke !== false) {
                this.langChangeHandler();
            }
        }
    };

    /**
	* @method getTextKey
	* get the textkey
	*/
    p.getTextKey = function () {
        return this.settings.textkey;
    };

    /**
	* @method removeTextKey
	* remove the textkey
	*/
    p.removeTextKey = function () {

        this.settings.textkey = null;
        if (!this.settings.mouseDownTextkey) {
            this.setLangDependency(false);
        }
    };

    /**
	* @method setMouseDownTextKey
	* set the textkey for mouseDownText
	* @param {String} key The new textkey
	*/
    p.setMouseDownTextKey = function (key, invoke) {
        //console.debug(WidgetClass.name + '[id=' + this.elem.id + '].setMouseDownTextKey:', key);
        if (key !== undefined) {
            this.settings.mouseDownTextkey = key;
            this.setLangDependency(true);
            if (invoke !== false) {
                this.langChangeHandler();
            }
        }
    };

    /**
	* @method getMouseDownTextKey
	* get the mouseDownTextkey
	*/
    p.getMouseDownTextKey = function () {
        return this.settings.mouseDownTextkey;
    };

    /**
	* @method removeMouseDownTextKey
	* remove the mouseDownTextkey
	*/
    p.removeMouseDownTextKey = function () {

        this.settings.mouseDownTextkey = null;
        if (!this.settings.textkey) {
            this.setLangDependency(false);
        }
    };

    /**
	* @method setImage
	* @iatStudioExposed
	* Sets an image.
	* @param {ImagePath} image
	*/
    p.setImage = function (image, omitSettings) {
        //console.debug(WidgetClass.name + '[id=' + this.elem.id + '].setImage:', image, this.settings.imageAlign, Enum.ImageAlign.left);
        var widget = this;

        if (image !== undefined && image !== '') {

            if (omitSettings !== true) {
                this.settings.image = image;
            }
            if (UtilsImage.isStylable(image)) {
                this.imgEl.hide();
                UtilsImage.getInlineSvg(image).then(function(svgElement) {
                    widget.svgEl.replaceWith(svgElement);
                    widget.svgEl = svgElement;
                    widget.svgEl.show();
                });
            } else {
                this.imgEl.show();
                this.svgEl.hide();
            this.imgEl.attr('src', image);
            }
            this.setClasses();
        } else {
                this.settings.image = undefined;
            this.imgEl.hide();
            this.svgEl.hide();
        }
    };

    /**
	* @method getImage
	* Returns the path of the image.
	* @return {ImagePath} text
	*/
    p.getImage = function () {
        return this.settings.image;
    };

    /**
	* @method removeImage
	* @iatStudioExposed
	* Remove an image.
	*/
    p.removeImage = function () {
        if (this.imgEl) {
            this.imgEl.hide();
            this.svgEl.hide();
            this.settings.image = undefined;
        }
        this.setClasses();
    };

    /**
	* @method removeText
	* @iatStudioExposed
	* Remove text.
	*/
    p.removeText = function () {
        this.setText('');
        this.setClasses();
    };

    /**
	* @method removeMouseDownText
	* @iatStudioExposed
	* Remove mouseDownText.
	*/
    p.removeMouseDownText = function () {
        this.setMouseDownText('');
        this.setClasses();
    };

    p._initEventHandler = function () {
        if (this.el) {
            this.el.on(BreaseEvent.CLICK, this._bind('_clickEventHandler'));
            this.el.on(BreaseEvent.CLICK, this._bind('_clickHandler')).on('click', this._bind('_preventClickHandler'));
            this.el.on(BreaseEvent.DBL_CLICK, this._bind('_dblclickHandler'));
            this.el.on(BreaseEvent.MOUSE_DOWN, this._bind('_downHandler'));
        }

    };

    p._clickHandler = function (e) {

    };

    p._clickEventHandler = function (e) {
        if (this.isDisabled || brease.config.editMode) { return; }

        /**
        * @event Click
        * @iatStudioExposed
        * Fired when element is clicked on.
        */
        var clickEv = this.createEvent("Click", { origin: brease.uiController.parentWidgetId(e.target) });
        clickEv.dispatch();
    };

    p._dblclickHandler = function (e) {
        if (this.isDisabled || brease.config.editMode) { return; }

        /**
        * @event DoubleClick
        * @iatStudioExposed
        * Fired when element has double click.
        */
        var clickEv = this.createEvent("DoubleClick");
        clickEv.dispatch();
    };

    p._downHandler = function (e) {
        if (this.isDisabled || brease.config.editMode || this.isActive) { return; }
        this.isActive = true;
        this.pointerId = Utils.getPointerId(e);

        if (this.settings.mouseDownImage !== undefined) {
            this.setImage(this.settings.mouseDownImage, true);
        }

        this.el.addClass('active');
        $(document).on(BreaseEvent.MOUSE_UP, this._bind('_upHandler'));

        /**
        * @event MouseDown
        * @iatStudioExposed
        * Fired when widget enters mouseDown state
        */
        var clickEv = this.createEvent("MouseDown");
        clickEv.dispatch();
    };

    p._upHandler = function (e) {
        if (this.isDisabled || brease.config.editMode || Utils.getPointerId(e) !== this.pointerId) { return; }
        this.isActive = false;

        if (this.settings.mouseDownImage !== undefined && this.settings.image !== undefined) {
            this.setImage(this.settings.image, true);
        }

        if (this.settings.mouseDownImage !== undefined && this.settings.image === undefined) {
            this.setImage('', false);
        }

        this.el.removeClass('active');
        $(document).off(BreaseEvent.MOUSE_UP, this._bind('_upHandler'));


        /**
        * @event MouseUp
        * @iatStudioExposed
        * Fired when widget enters mouseUp state
        */
        var clickEv = this.createEvent("MouseUp");
        clickEv.dispatch();

    };

    p.disable = function () {
        if (this.isActive) {
            this.el.trigger(BreaseEvent.MOUSE_UP);
        }
        SuperClass.prototype.disable.apply(this, arguments);
    };

    p._preventClickHandler = function (e) {
        this._handleEvent(e);
    };

    p.wake = function () {
        SuperClass.prototype.wake.apply(this, arguments);
    };

    p.suspend = function () {
        $(document).off(BreaseEvent.MOUSE_UP, this._bind('_upHandler'));
        this.isActive = false;
        this.el.removeClass('active');
        SuperClass.prototype.suspend.apply(this, arguments);
    };

    p.dispose = function () {
        $(document).off(BreaseEvent.MOUSE_UP, this._bind('_upHandler'));
        this.isActive = false;
        this.el.removeClass('active');
        SuperClass.prototype.dispose.apply(this, arguments);
    };

    p.setClasses = function () {
        var imgClass;
        if (this.imgEl !== undefined && this.textEl !== undefined && this.settings.text !== '') {

            switch (this.settings.imageAlign) {
                case Enum.ImageAlign.left:
                    imgClass = 'image-left';
                    break;

                case Enum.ImageAlign.right:
                    imgClass = 'image-right';
                    break;

                case Enum.ImageAlign.top:
                    imgClass = 'image-top';
                    break;

                case Enum.ImageAlign.bottom:
                    imgClass = 'image-bottom';
                    break;

            }
            this.el.removeClass('image-left image-right image-top image-bottom');
            this.el.addClass(imgClass);
        }
        else {
            this.el.removeClass('image-left image-right image-top image-bottom');
        }
    };

    // private 

    function _imgHandling() {
        this.settings.imageAlign = Types.parseValue(this.settings.imageAlign, 'Enum', { IAT_Enum: Enum.ImageAlign, default: Enum.ImageAlign.left });
        if (this.imgEl === undefined && this.svgEl === undefined) {
            this.imgEl = $('<img/>').hide();
            this.svgEl = $('<svg/>').hide();
        }
        this.setImageAlign(this.settings.imageAlign);
        if (this.settings.image !== undefined) {
            this.setImage(this.settings.image);
        }
    }

    function _overflowInit(widget) {
        widget.settings.ellipsis = Types.parseValue(widget.settings.ellipsis, 'Boolean');
        widget.settings.multiLine = Types.parseValue(widget.settings.multiLine, 'Boolean');
        widget.settings.wordWrap = Types.parseValue(widget.settings.wordWrap, 'Boolean');

        if (widget.settings.ellipsis === true) {
            widget.el.addClass('ellipsis');
        }
        else {
            widget.el.removeClass('ellipsis');
        }

        if (widget.settings.multiLine === true) {

            widget.el.addClass('multiLine');

            if (widget.settings.wordWrap === true) {
                widget.el.addClass('wordWrap');
                widget.el.removeClass('multiLine');
            } else {
                widget.el.removeClass('wordWrap');
            }

            if (widget.settings.breakWord === true) {
                widget.el.addClass('breakWord');
                widget.el.removeClass('multiLine');
            } else {
                widget.el.removeClass('breakWord');
            }

        } else {
            widget.el.removeClass('breakWord');
            widget.el.removeClass('wordWrap');
            widget.el.removeClass('multiLine');
        }
    }

    function _textInit() {
        //console.log('[' + this.elem.id + ']._textInit');
        if (this.settings.text !== undefined && this.settings.text !== '') {
            if (brease.language.isKey(this.settings.text) === false) {
                this.setText(this.settings.text);
            } else {
                this.setTextKey(brease.language.parseKey(this.settings.text), false);
            }
        }

        if (this.settings.mouseDownText !== undefined && this.settings.mouseDownText !== '') {
            if (brease.language.isKey(this.settings.mouseDownText) === false) {
                this.setMouseDownText(this.settings.mouseDownText);
            } else {
                this.setMouseDownTextKey(brease.language.parseKey(this.settings.mouseDownText), false);
            }
        }
        this.langChangeHandler();
    }

    function _appendDownTextEl(widget) {
        if (widget.downtextEl === undefined) {
            widget.downtextEl = $('<span class="down"></span>');
        }
        if (widget.imgEl && (widget.settings.imageAlign === Enum.ImageAlign.right || widget.settings.ImageAlign === Enum.ImageAlign.bottom)) {
            widget.el.prepend(widget.downtextEl);
        } else {
            widget.el.append(widget.downtextEl);
        }
    }

    function _removeDownTextEl(widget) {
        if (widget.downtextEl !== undefined) {
            widget.downtextEl.remove();
            widget.downtextEl = undefined;
        }
    }

    function _appendTextEl(widget) {
        if (widget.textEl === undefined) {
            widget.textEl = $('<span class="up"></span>');
        }
        if (widget.imgEl && (widget.settings.imageAlign === Enum.ImageAlign.right || widget.settings.imageAlign === Enum.ImageAlign.bottom)) {
            widget.el.prepend(widget.textEl);
        } else {
            widget.el.append(widget.textEl);
        }
    }

    return languageDependency.decorate(WidgetClass, false);

});