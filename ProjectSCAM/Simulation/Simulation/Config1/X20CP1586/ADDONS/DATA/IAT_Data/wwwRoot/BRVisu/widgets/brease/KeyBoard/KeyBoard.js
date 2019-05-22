/*global define,brease,console,CustomEvent*/
define(['widgets/brease/Window/Window', 'brease/events/BreaseEvent', 'brease/core/Utils', 'brease/controller/PopUpManager'], function (SuperClass, BreaseEvent, Utils, popupManager) {
    /*jshint white:false */
    "use strict";

    /**
    * @class widgets.brease.KeyBoard
    * #Description
    * The Keyboard is an overlay, to provide a virtual numeric keyboard.  
    * It opens in the context of a TextInput widget.      
    * @extends widgets.brease.Window
    * @singleton
    *
    * @iatMeta studio:visible
    * false
    * @iatMeta category:Category
    * System
    * @iatMeta studio:createHelp
    * true
    * @iatMeta description:short
    * Keyboard zur Eingabe von Text
    * @iatMeta description:de
    * Keyboard zur Eingabe von Text
    * @iatMeta description:en
    * Keyboard for the input of text
    * @iatMeta description:ASHelp
    * The Keyboard widget can not be used in a content directly, but its possible to use styles for it.
    */
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

    var defaultSettings = {
        layout: {
            default: 'widgets/brease/KeyBoard/assets/KeyBoardEn.html',
            ar: 'widgets/brease/KeyBoard/assets/KeyBoardAr.html',
            bg: 'widgets/brease/KeyBoard/assets/KeyBoardBg.html',
            cs: 'widgets/brease/KeyBoard/assets/KeyBoardCs.html',
            da: 'widgets/brease/KeyBoard/assets/KeyBoardDa.html',
            de: 'widgets/brease/KeyBoard/assets/KeyBoardDe.html',
            en: 'widgets/brease/KeyBoard/assets/KeyBoardEn.html',
            es: 'widgets/brease/KeyBoard/assets/KeyBoardEs.html',
            fi: 'widgets/brease/KeyBoard/assets/KeyBoardFi.html',
            fr: 'widgets/brease/KeyBoard/assets/KeyBoardFr.html',
            hu: 'widgets/brease/KeyBoard/assets/KeyBoardHu.html',
            it: 'widgets/brease/KeyBoard/assets/KeyBoardIt.html',
            ko: 'widgets/brease/KeyBoard/assets/KeyBoardKo.html',
            nl: 'widgets/brease/KeyBoard/assets/KeyBoardNl.html',
            no: 'widgets/brease/KeyBoard/assets/KeyBoardNo.html',
            pl: 'widgets/brease/KeyBoard/assets/KeyBoardPl.html',
            pt: 'widgets/brease/KeyBoard/assets/KeyBoardPt.html',
            ru: 'widgets/brease/KeyBoard/assets/KeyBoardRu.html',
            sk: 'widgets/brease/KeyBoard/assets/KeyBoardSk.html',
            sl: 'widgets/brease/KeyBoard/assets/KeyBoardSl.html',
            sv: 'widgets/brease/KeyBoard/assets/KeyBoardSv.html',
            ro: 'widgets/brease/KeyBoard/assets/KeyBoardRo.html',
            hr: 'widgets/brease/KeyBoard/assets/KeyBoardHr.html',
            zh: 'widgets/brease/KeyBoard/assets/KeyBoardZh.html'
        },
        modal: true,
        showCloseButton: true,
        showShiftValues: true,
        forceInteraction: false,
        plugin: {
            zh: "widgets/brease/KeyBoard/libs/external/PluginPinyin",
            ko: "widgets/brease/KeyBoard/libs/external/PluginHangul",
            ja: "widgets/brease/KeyBoard/libs/external/PluginWanaKana"
        },
        stylePrefix: 'widgets_brease_KeyBoard',
        scale2fit: true
    },

    /*
    * Layer 1: small caps
    * Layer 2: caps
    * Layer 3: special
    */
    currentLayer = 1,
    instance,

    WidgetClass = SuperClass.extend(function KeyBoard(elem, options, deferredInit, inherited) {
        if (inherited === true) {
            SuperClass.call(this, null, options || null, true, true);
            _loadHTML(this);
        } else {
            if (instance === undefined) {
                SuperClass.call(this, null, options || null, true, true);
                _loadHTML(this);
                instance = this;
            } else {
                if (this.output) {
                    instance.setValue('');
                }
                instance.settings = $.extend(true, {}, instance.settings, options);
                return instance;
            }
        }
    }, defaultSettings),

    p = WidgetClass.prototype;

    //** Public Methods **/

    p.init = function () {

        if (this.settings.omitClass !== true) {
            this.addInitialClass('breaseKeyBoard');
        }
        this.settings.windowType = 'KeyBoard';
        SuperClass.prototype.init.call(this, true);
        this.value = '';

        this.output = this.el.find('input');
        this.clear = this.el.find('.keyBoardBtnClear');
        this.valueButtons = this.el.find('button[data-value]');
        this.actionButtons = this.el.find('button[data-action]');
        this.shift = this.el.find('[data-action=shift]');
        this.special = this.el.find('[data-action=special]');

        if (this.eventsAttached !== true) {
            _addEventListeners.call(this);
        }

        if (brease.config.mobile === false) {
            this.output[0].removeAttribute('readonly');
        }
        this.loadPlugin();
    };

    p.getCursor = function () {
        return _getCursor.call(this);
    };

    p.setCursor = function (index) {
        _setCursor.call(this, index);
    };


    p.setValue = function (value, avoidSetField) {
        this.value = value || '';
        if (this.value !== '') {
            this.clear.show();
        } else {
            this.clear.hide();
        }

        if (avoidSetField !== true) {
            this.output.val(this.value);
            this.output[0].setSelectionRange(this.value.length, this.value.length);
            this.output.focus();
        }
    };

    p.showPlugin = function (deleteFlag) {

        if (this.plugin !== undefined) {
            if (deleteFlag === true) {
                this.plugin.onDelete(this.value, _getCursor.call(this));
            } else {
                this.plugin.onInput(this.value, _getCursor.call(this));
            }
        }
    };

    /**
    * @method getValue
    * returns the actual value<br/>
    * @return value
    */
    p.getValue = function () {
        return this.value;
    };

    /**
    * @method show
    * Method to show keyboard
    * @param {brease.objects.KeyboardOptions} options
    * @param {HTMLElement} refElement Either HTML element of opener widget or any HTML element for relative positioning.
    */
    p.show = function (options, refElement) {
        this._setLayout();
        SuperClass.prototype.show.call(this, options, refElement);
        this.closeOnLostContent(refElement);
        if (this.plugin !== undefined) {
            this.plugin.show();
        }
        if (options.type !== undefined) {
            this.output.attr('type', options.type);
        }
        if (options.maxLength !== undefined) {
            this.output.attr('maxlength', parseInt(options.maxLength, 10));
        } else {
            this.output.removeAttr('maxlength');
        }
        this.setValue(this.settings.text);
        if (this.settings.restrict !== undefined) {
            this.settings.regexp = new RegExp(this.settings.restrict);
        } else {
            this.settings.regexp = undefined;
        }
    };

    /**
    * @method hide
    * hides Keyboard  
    */
    p.hide = function () {
        if (currentLayer !== 1) {
            _switchKeyLayer.call(this, 1);
        }
        SuperClass.prototype.hide.call(this);
        if (this.plugin !== undefined) {
            this.plugin.hide();
        }
        this.el.removeClass('keyBoardSm keyBoardMd keyBoardFull');

    };

    p.langChangeHandler = function () {
        //this.settings.showShiftValues = (e.detail.currentLanguage === 'zh') ? true : false;
        this.loadLayout();

    };

    /**
    * @method loadPlugin
    * loads a language Plugin depending on the actual language  
    */
    p.loadPlugin = function () {

        var path = this.settings.plugin[brease.language.getCurrentLanguage()],
            widget = this;

        if (path !== undefined) {
            if (this.plugin !== undefined) {
                this.plugin.dispose();
            }
            require([path], function (Plugin) {
                widget.plugin = Plugin;
                widget.plugin.init(widget);
                widget.dispatchEvent(new CustomEvent(BreaseEvent.PLUGIN_LOADED, { bubbles: true }));
            });
        } else {
            this.plugin = undefined;
        }

    };

    /**
    * @method loadLayout
    * loads a keyboard layout depending on the actual language  
    */
    p.loadLayout = function () {

        var lang = brease.language.getCurrentLanguage(),
            path = this.settings.layout[lang];

        if (path === undefined) {
            path = this.settings.layout.default;
        }

        if (path !== undefined && path !== this.settings.html) {
            this.settings.html = path;
            _loadHTMLLayout(this);
        } else {
            var widget = this;
            window.setTimeout(function () {
                widget._dispatchReady();
            }, 0);
        }

    };

    p.dispose = function () {
        if (this.plugin) {
            this.plugin.dispose();
        }
        SuperClass.prototype.dispose.apply(this, arguments);
    };

    /**
    * Private Methods
    */

    p._onValueButtonClick = function (e) {
        this._handleEvent(e, true);
        var target = $(e.currentTarget),
            value;

        e.stopImmediatePropagation();
        switch (currentLayer) {

            case 1:
                value = target.attr('data-value');
                break;
            case 2:
                value = target.attr('data-shift-value');
                break;
            case 3:
                value = target.attr('data-special-value');
                break;
        }

        if (this.settings.maxLength !== undefined) {
            if (this.getValue().length >= this.settings.maxLength) {
                return;
            }
        }

        if (this.settings.regexp !== undefined) {
            var newVal = this.getValue() + value;
            for (var i = newVal.length - 1; i >= 0; i -= 1) {
                if (this.settings.regexp.test(newVal[i]) !== true) {
                    return;
                }
            }
        }
        _addChar.call(this, value, _getCursor.call(this));
    };


    function _onButtonMouseDown(e) {
        e.stopImmediatePropagation();
        if (this.activeButton) {
            Utils.removeClass(this.activeButton, 'active');
        }
        this.activeButton = e.target;
        Utils.addClass(this.activeButton, 'active');
        brease.docEl.on(BreaseEvent.MOUSE_UP, this._bind(_onButtonMouseUp));
    }

    function _onButtonMouseUp() {
        brease.docEl.off(BreaseEvent.MOUSE_UP, this._bind(_onButtonMouseUp));
        Utils.removeClass(this.activeButton, 'active');
        this.activeButton = undefined;
    }

    p._setLayout = function () {
        var dimensions = popupManager.getDimensions(),
            width = Math.min(dimensions.appWidth, dimensions.winWidth);

        if (width >= 1000) {
            this.el.addClass("keyBoardFull");
        }
        else if (width <= 640) {
            this.el.addClass("keyBoardSm");
        }
        else {
            this.el.addClass("keyBoardMd");
        }

    };

    p._onActionButtonClick = function (e) {
        this._handleEvent(e, true);
        var target = $(e.currentTarget),
            action = target.attr('data-action');

        switch (action) {

            case 'delete':
                _removeChar.call(this, _getCursor.call(this) - 1);
                break;
            case 'enter':
                _submitValue.call(this);
                break;
            case 'left':
                _cursorLeft.call(this);
                break;
            case 'right':
                _cursorRight.call(this);
                break;
            case 'shift':
                _onShift.call(this);
                break;
            case 'close':
                this.hide();
                break;
            case 'special':
                _onSpecial.call(this);
                break;
            default:
                console.iatWarn(WidgetClass.name + ' action not supported!');
                break;
        }
    };

    p._keyUpHandler = function (e) {
        if (e.which === 13) {
            _submitValue.call(this);
        } else {
            var newVal = this.output.val(),
                currentVal = this.getValue();

            if (newVal !== currentVal) {
                var filtered = '',
                    cursor = _getCursor.call(this),
                    diff = newVal.length - currentVal.length;

                if (diff > 0) {
                    for (var i = 0, l = newVal.length; i < l; i += 1) {
                        if (this.settings.regexp.test(newVal[i]) === true) {
                            filtered += newVal[i];
                        }
                    }
                    this.setValue(filtered);
                    _setCursor.call(this, cursor - (newVal.length - filtered.length));
                } else {
                    this.setValue(newVal, true);
                }
                this.showPlugin(e.which === 8);
            }


        }

    };

    p._onClear = function (e) {
        this._handleEvent(e, true);
        this.setValue('');
    };

    p.postProcessHTML = function (html) {
        html = html.replace('<i class="icon-left"></i>', '<svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" width="12px" height="20px" viewBox="0 0 12 20" enable-background="new 0 0 12 20" xml:space="preserve"><path d="M0,8.569L12,0v3.931L3.336,10L12,16.069V20L0,11.431V8.569z"/></svg>');
        html = html.replace('<i class="icon-right"></i>', '<svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" width="12px" height="20px" viewBox="0 0 12 20" enable-background="new 0 0 12 20" xml:space="preserve"><path d="M12,11.431L0,20v-3.931L8.664,10L0,3.931V0l12,8.569V11.431z"/></svg>');
        return html;
    };

    function _addEventListeners() {
        this.clear.on(BreaseEvent.CLICK, this._bind('_onClear'));
        this.valueButtons.on(BreaseEvent.CLICK, this._bind('_onValueButtonClick'));
        this.valueButtons.on(BreaseEvent.MOUSE_DOWN, this._bind(_onButtonMouseDown));
        this.actionButtons.on(BreaseEvent.CLICK, this._bind('_onActionButtonClick')).on(BreaseEvent.MOUSE_DOWN, this._bind(_onButtonMouseDown));
        this.output.on('keyup', this._bind('_keyUpHandler'));
        this.eventsAttached = true;
    }

    function _removeEventListeners() {
        this.clear.off();
        this.valueButtons.off();
        this.actionButtons.off();
        this.output.off();
        this.eventsAttached = false;
    }

    // initial html-layout loading
    function _loadHTML(widget) {
        var currentLang = brease.language.getCurrentLanguage(),
            path = widget.settings.layout[currentLang];

        //widget.settings.showShiftValues = (currentLang === 'zh') ? true : false;

        if (path === undefined) {
            path = widget.settings.layout.default;
        }
        widget.settings.html = path;

        require(['text!' + widget.settings.html], function (html) {
            html = widget.postProcessHTML(html);
            widget.deferredInit.call(widget, document.body, html);
            _switchKeyLayer.call(widget, 1);
            widget.readyHandler(); // in SuperClass Window
        });
    }

    function _loadHTMLLayout(widget) {
        _removeEventListeners.call(widget);
        widget.el.remove();

        require(['text!' + widget.settings.html], function (html) {
            html = widget.postProcessHTML(html);
            widget.el = $(html).prependTo(document.body);
            widget.elem = widget.el[0];
            window.setTimeout(function () {
                widget._dispatchReady();
            }, 0);
            widget.init.call(widget);
            _switchKeyLayer.call(widget, 1);
        });
    }

    function _addChar(c, index) {
        this.value = this.value.slice(0, index) + c + this.value.slice(index);
        this.cursor = index + 1;
        this.setValue(this.value);
        _setCursor.call(this, index += 1);
        this.showPlugin();
        if (currentLayer === 2) {
            _switchKeyLayer.call(this, 1);
        }
    }

    function _removeChar(index) {

        var value = this.value.substr(0, index) + this.value.substr(index + 1);
        this.cursor = index;
        this.setValue(value);
        _setCursor.call(this, index);
        if (this.plugin) {
            this.plugin.onDelete(this.value, _getCursor.call(this));
        }
    }

    function _parse(value) {
        return value.replace(/[\u00A0]/g, ' ');
    }

    function _submitValue() {

        this.dispatchEvent(new CustomEvent(BreaseEvent.SUBMIT, { detail: _parse(this.getValue()) }));
        this.output.trigger("blur");
        this.hide();
    }

    function _onShift() {

        if (currentLayer !== 2) {
            _switchKeyLayer.call(this, 2);
        }
        else {
            _switchKeyLayer.call(this, 1);
        }
    }

    function _onSpecial() {

        if (currentLayer !== 3) {
            _switchKeyLayer.call(this, 3);
        }
        else {
            _switchKeyLayer.call(this, 1);
        }
    }

    function _switchKeyLayer(layer) {

        var attr,
            value,
            shiftAttr,
            shiftValue,
            html,
            button;

        switch (layer) {

            case 1:
                attr = 'value';
                shiftAttr = 'shift-value';
                this.shift.removeClass('selected');
                this.special.removeClass('selected');
                break;
            case 2:
                attr = 'shift-value';
                shiftAttr = 'special-value';
                this.shift.addClass('selected');
                this.special.removeClass('selected');
                break;
            case 3:
                attr = 'special-value';
                shiftAttr = 'shift-value';
                this.special.addClass('selected');
                this.shift.removeClass('selected');
                break;
        }

        for (var i = 0; i < this.valueButtons.length; i += 1) {

            button = this.valueButtons.eq(i);
            value = button.data(attr);
            shiftValue = button.data(shiftAttr);
            html = ((value !== undefined) ? value : '') + ((this.settings.showShiftValues === true && attr === 'value') ? '<sub>' + ((shiftValue !== undefined) ? shiftValue : '') + '</sub>' : '');
            button.html(html);

        }

        currentLayer = layer;
    }

    function _cursorLeft() {

        this.cursor = this.output.get(0).selectionStart = this.output.get(0).selectionEnd -= 1;
        this.output.focus();
    }

    function _cursorRight() {

        this.cursor = this.output[0].selectionStart = this.output[0].selectionEnd += 1;
        this.output.focus();
    }

    function _setCursor(index) {
        this.cursor = this.output.get(0).selectionStart = this.output.get(0).selectionEnd = index;
    }

    function _getCursor() {

        return this.output.get(0).selectionStart;
    }

    return WidgetClass;

});