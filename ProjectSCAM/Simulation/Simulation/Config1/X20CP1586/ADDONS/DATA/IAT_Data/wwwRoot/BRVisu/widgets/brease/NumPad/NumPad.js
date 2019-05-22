/*global define,brease,CustomEvent*/
define(['widgets/brease/Window/Window', 'brease/events/BreaseEvent', 'brease/enum/Enum', 'brease/core/Utils', 'brease/config/NumberFormat', 'widgets/brease/NumPad/libs/NumPadSlider'], function (SuperClass, BreaseEvent, Enum, Utils, NumberFormat, Slider) {
    /*jshint white:false */
    "use strict";

    /**
    * @class widgets.brease.NumPad
    * #Description
    * The NumPad is an overlay, to provide a virtual numeric keyboard.  
    * It opens in the context of a NumericInput widget.  
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
    * NumPad zur Eingabe numerischer Werte
    * @iatMeta description:de
    * NumPad zur Eingabe numerischer Werte
    * @iatMeta description:en
    * NumPad for the input of numeric values
    * @iatMeta description:ASHelp
    * The NumPad widget can not be used in a content directly, but its possible to use styles for it.
    */

    /**
    * @cfg {brease.enum.LimitViolationPolicy} limitViolationPolicy='noSubmit'
    * Controls behaviour of NumPad in case of a limit violation.   
    */
    var defaultSettings = {
        html: 'widgets/brease/NumPad/NumPad.html',
        stylePrefix: 'widgets_brease_NumPad',
        limitViolationPolicy: Enum.LimitViolationPolicy.NO_SUBMIT,
        format: { default: { decimalPlaces: 1, minimumIntegerDigits: 1 } },
        width: 354,
        arrow: {
            show: true,
            position: 'left',
            width: 12
        },
        positionOffset: 5,
        modal: true,
        showCloseButton: true,
        scale2fit: true,
        precision: 6
    }, instance,

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
    WidgetClass = SuperClass.extend(function NumPad(elem, options, deferredInit, inherited) {
        if (inherited === true) {
            SuperClass.call(this, null, null, true, true);
            _loadHTML(this);
        } else {
            if (instance === undefined) {
                SuperClass.call(this, null, null, true, true);
                _loadHTML(this);
                instance = this;
            } else {
                return instance;
            }
        }
    }, defaultSettings),

    p = WidgetClass.prototype;

    p.init = function () {

        if (this.settings.omitClass !== true) {
            this.addInitialClass('breaseNumPad');
        }
        this.settings.windowType = 'NumPad';
        SuperClass.prototype.init.call(this, true);

        this.settings.mms = brease.measurementSystem.getCurrentMeasurementSystem();
        this.settings.numberFormat = NumberFormat.getFormat(this.settings.format, this.settings.mms);
        this.settings.separators = brease.user.getSeparators();

        this.minEl = this.el.find('.minValue');
        this.maxEl = this.el.find('.maxValue');
        this.buttons = {
            "sign": this.el.find('button[data-action="sign"]'),
            "comma": this.el.find('button[data-action="comma"]'),
            "delete": this.el.find('button[data-action="delete"]'),
            "enter": this.el.find('button[data-action="enter"]')
        };
        this.error = false;
        this.numRegExp = new RegExp("[0-9]");
    };

    /**
    * @method show
    * opens NumPad relative to opener (usually NumericInput)  
    * @param {brease.objects.NumpadOptions} options
    * @param {HTMLElement} refElement Either HTML element of opener widget or any HTML element for relative positioning.
    */
    p.show = function (options, refElement) {
        options = _validatePositions(options);
        SuperClass.prototype.show.call(this, options, refElement); // settings are extended in super call

        this.closeOnLostContent(refElement);

        this.settings.mms = brease.measurementSystem.getCurrentMeasurementSystem();
        this.settings.numberFormat = NumberFormat.getFormat(this.settings.format, this.settings.mms);
        this.settings.separators = brease.user.getSeparators();

        this.settings.smallChange = this.settings.numberFormat.decimalPlaces > 0 ? (1 / Math.pow(10, this.settings.numberFormat.decimalPlaces)) : 1;

        if (this.settings.minValue !== undefined && this.settings.maxValue !== undefined) {
            this.settings.largeChange = Math.pow(10, Math.round(Math.log10(this.settings.maxValue / 10 - this.settings.minValue / 10)));
            _roundRangeValues.call(this);
        } else {
            this.settings.largeChange = 10 * this.settings.smallChange;
        }
        var lowestPossibleFormattedValue = _lowestPossibleFormattedValue.call(this, this.settings.minValue);
        this.minEl.html(_format.call(this, lowestPossibleFormattedValue));
        var highestPossibleFormattedValue = _highestPossibleFormattedValue.call(this, this.settings.maxValue);
        this.maxEl.html(_format.call(this, highestPossibleFormattedValue));

        this.slider.setSettings(lowestPossibleFormattedValue, highestPossibleFormattedValue, this.settings.smallChange, this.settings.largeChange, this.settings.numberFormat, this.settings.useDigitGrouping, this.settings.separators);
        this.slider.update();

        this.setValue(this.settings.value);
        this.outputIsInitialized = false;
        this.buttons.comma.html(this.settings.separators.dsp);

        brease.bodyEl.on('keydown', this._bind('_keyDownHandler'));
        brease.bodyEl.on('keypress', this._bind('_keyUpHandler'));
    };

    p.hide = function () {
        brease.bodyEl.off('keypress', this._bind('_keyUpHandler'));
        brease.bodyEl.off('keydown', this._bind('_keyDownHandler'));
        SuperClass.prototype.hide.call(this);
    };

    p.setValue = function (value) {
        //console.log('NumPad.setValue:' + value);
        _internalSetValue.call(this, value);
        this.slider.setValue(this.getValue(), true);
    };

    p.setValueAsString = function (strValue, oldStrValue, omitInit) {
        //console.log('NumPad.setValueAsString:strValue=' + strValue + ',oldStrValue=' + oldStrValue);
        strValue = (strValue.indexOf('0') === 0 && strValue.indexOf(this.settings.separators.dsp) !== 1) ? strValue.substring(1) : strValue;
        strValue = (strValue !== '' && strValue !== '-') ? strValue : ((strValue === '-') ? '-0' : '0');
        var value = brease.formatter.parseFloat(strValue, this.settings.separators);

        if (!isNaN(value)) {
            this.strValue = strValue;
            this.value = (this.strValue !== '') ? brease.formatter.parseFloat(this.strValue, this.settings.separators) : 0;

            this.slider.setValue(this.value, true);
            this.slider.setValueAsString(this.strValue);
            if (this.strValue.substring(0, 1) === '-') {
                _setNegativeSign(this, true);
            } else {
                _setNegativeSign(this, false);
            }

            _checkMinMax.call(this, this.value);
        } else {
            this.strValue = (oldStrValue) ? oldStrValue : this.strValue;
            this.value = brease.formatter.parseFloat(this.strValue, this.settings.separators);
        }
        if (omitInit !== true) {
            this.outputIsInitialized = true;
        }
    };

    p.getValue = function () {
        return this.value;
    };

    p._buttonClickHandler = function (e) {
        //console.debug(WidgetClass.name + '[id=' + this.elem.id + ']._buttonClickHandler:',e.currentTarget);
        this._handleEvent(e, true);
        var button = $(e.currentTarget),
            action = '' + button.attr('data-action'),
            buttonValue = button.attr('data-value'),
            actString = this.strValue,
            newString;

        switch (action) {

            case 'delete':
                this.setValueAsString(actString.substring(0, actString.length - 1), actString);
                this.outputIsInitialized = true;
                break;
            case 'comma':
                if (this.outputIsInitialized === false) {
                    actString = '0';
                }
                if (actString.indexOf(this.settings.separators.dsp) === -1) {
                    this.setValueAsString(actString + this.settings.separators.dsp, actString);
                    this.outputIsInitialized = true;
                }
                break;
            case 'sign':
                var signFlag = true;
                if (this.negativeSign) {
                    newString = actString.replace("-", "");
                    signFlag = false;
                }
                else {
                    newString = "-" + actString;
                    signFlag = true;
                }
                _setNegativeSign(this, signFlag);
                this.setValueAsString(newString, actString, true);

                break;

            case 'enter':
                _submitValue.call(this);
                this.outputIsInitialized = true;
                break;
            case 'value':
                if (this.outputIsInitialized === false) {
                    this.setValueAsString(((actString.substring(0, 1) === '-') ? '-' : '') + buttonValue, actString);
                    this.outputIsInitialized = true;
                } else {
                    newString = actString + buttonValue;
                    var commaIndex = newString.indexOf(this.settings.separators.dsp),
                        nachKomma = (commaIndex !== -1) ? newString.substring(commaIndex + 1) : '';

                    if (nachKomma.length <= this.settings.numberFormat.decimalPlaces) {
                        this.setValueAsString(actString + buttonValue, actString);
                        this.outputIsInitialized = true;
                    }
                }
                break;
        }
    };

    p._keyDownHandler = function (e) {
        if (e.keyCode === 8) {
            e.preventDefault();
            this._keyUpHandler(e);
        }
    };

    p._keyUpHandler = function (e) {
        var value = String.fromCharCode(e.keyCode || e.charCode);

        if (this.numRegExp.test(value)) {
            this.el.find('button[data-value="' + value + '"]').triggerHandler({
                type: BreaseEvent.CLICK
            });
        }

        else if (value === ",") {
            this.buttons.comma.triggerHandler({
                type: BreaseEvent.CLICK
            });
        }

        else if (value === "-" || value === '+') {
            this.buttons.sign.triggerHandler({
                type: BreaseEvent.CLICK
            });
        }

        else if (e.keyCode === 8) {
            this.buttons.delete.triggerHandler({
                type: BreaseEvent.CLICK
            });
        }

        else if (e.keyCode === 13) {
            this.buttons.enter.triggerHandler({
                type: BreaseEvent.CLICK
            });
        }

    };

    p._onSliderChanged = function (e) {
        //console.log('_onSliderChanged:', JSON.stringify({ value: e.detail.value }), (this.settings !== undefined));
        if (this.getValue() !== e.detail.value) {
            this.outputIsInitialized = false;
            _internalSetValue.call(this, e.detail.value);
        }
    };

    // PRIVATE

    function _loadHTML(widget) {
        require(['text!' + widget.settings.html], function (html) {
            widget.deferredInit.call(widget, document.body, html, true);
            widget.slider = Slider.init(widget);
            widget.el.find('.breaseNumPadButtons button').on(BreaseEvent.CLICK, widget._bind('_buttonClickHandler')).on(BreaseEvent.MOUSE_DOWN, widget._bind(_onButtonMouseDown));
            widget.readyHandler();
        });
    }

    function _onButtonMouseDown(e) {
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

    function _format(value) {
        if (isNaN(value)) {
            return brease.settings.noValueString;
        } else {
            return brease.formatter.formatNumber(value, this.settings.numberFormat, this.settings.useDigitGrouping, this.settings.separators);
        }
    }

    function _checkMinMax(value) {

        if (value < this.settings.minValue) {
            this.error = true;
        } else if (value > this.settings.maxValue) {
            this.error = true;
        } else {
            this.error = false;
        }
        this.slider.setError(this.error);
        return value;
    }

    /*A&P 467975 
    * due to machine epsilon (Maschinengenauigkeit, floating point arithmetic) we have to round min/max
    * we round to 6 (=settings.precision) significant figures
    */
    function _roundRangeValues() {
        this.settings.minValue = brease.formatter.roundToSignificant(this.settings.minValue, this.settings.precision);
        this.settings.maxValue = brease.formatter.roundToSignificant(this.settings.maxValue, this.settings.precision);
    }

    function _lowestPossibleFormattedValue(minValue) {
        return _findPossibleFormattedValue.call(this, minValue, 'min');
    }

    function _highestPossibleFormattedValue(maxValue) {
        return _findPossibleFormattedValue.call(this, maxValue, 'max');
    }

    function _findPossibleFormattedValue(extreme, type) {
        var abs = Math.abs(extreme),
            factor = Math.max(1, Math.pow(10, this.settings.numberFormat.decimalPlaces)),
            result = brease.formatter.roundToFormat(extreme, this.settings.numberFormat.decimalPlaces);

        if (type === 'max' && result > extreme && abs > 1 / factor) {
            result -= 1 / factor;
        }
        if (type === 'min' && result < extreme && abs > 1 / factor) {
            result += 1 / factor;
        }
        return result;
    }

    function _internalSetValue(value) {
        this.value = _checkMinMax.call(this, value);
        this.strValue = _format.call(this, this.value);
        if (this.value >= 0) {
            _setNegativeSign(this, false);
        } else {
            _setNegativeSign(this, true);
        }
    }

    function _setNegativeSign(widget, flag) {
        if (flag !== widget.negativeSign) {
            widget.negativeSign = flag;
            if (flag === true) {
                widget.buttons.sign.addClass('active');
            }
            else {
                widget.buttons.sign.removeClass('active');
            }
        }
    }

    function _submitValue() {
        var submit = false,
            close = false,
            value = this.getValue();

        if (value >= this.settings.minValue && value <= this.settings.maxValue) {
            submit = true;
            close = true;
        } else {
            switch (this.settings.limitViolationPolicy) {
                case Enum.LimitViolationPolicy.NO_SUBMIT:
                    submit = false;
                    close = false;
                    break;
                case Enum.LimitViolationPolicy.NO_SUBMIT_AND_CLOSE:
                    submit = false;
                    close = true;
                    break;
                case Enum.LimitViolationPolicy.SUBMIT_ALL:
                    submit = true;
                    close = true;
                    break;
                case Enum.LimitViolationPolicy.SET_TO_LIMIT:
                    if (Math.abs(value - this.settings.maxValue) < Math.abs(value - this.settings.minValue)) {
                        this.setValue(this.settings.maxValue);
                    } else {
                        this.setValue(this.settings.minValue);
                    }
                    submit = false;
                    close = false;
                    break;
                case Enum.LimitViolationPolicy.SET_TO_LIMIT_AND_SUBMIT:
                    if (Math.abs(value - this.settings.maxValue) < Math.abs(value - this.settings.minValue)) {
                        this.setValue(this.settings.maxValue);
                    } else {
                        this.setValue(this.settings.minValue);
                    }
                    submit = true;
                    close = true;
                    break;
            }
        }
        /**
        * @event submit
        * Fired after user clicks 'enter' to submit value    
        * @param {Object} detail  
        * @param {Number} detail.value  
        * @param {String} type {@link brease.events.BreaseEvent#static-property-SUBMIT BreaseEvent.SUBMIT}
        * @param {HTMLElement} target element of widget
        */
        if (submit === true) {
            this.dispatchEvent(new CustomEvent(BreaseEvent.SUBMIT, { detail: { value: this.getValue() } }));
        }
        if (close === true) {
            this.hide();
        }
    }

    function _validatePositions(options) {
        options.arrow = options.arrow || {};
        if (options.position) {
            var position = options.position;

            if (position.horizontal === 'left') {
                options.position.vertical = 'middle';
                options.arrow.position = 'right';
                options.arrow.show = true;
            } else if (position.horizontal === 'right') {
                options.position.vertical = 'middle';
                options.arrow.position = 'left';
                options.arrow.show = true;
            } else {
                if (position.vertical === 'top') {
                    options.position.horizontal = 'center';
                    options.arrow.position = 'bottom';
                    options.arrow.show = true;
                } else if (position.vertical === 'bottom') {
                    options.position.horizontal = 'center';
                    options.arrow.position = 'top';
                    options.arrow.show = true;
                } else {
                    options.position.vertical = 'middle';
                    options.position.horizontal = 'center';
                    options.arrow.show = false;
                }
            }
        } else {
            options.position = {
                vertical: 'middle',
                horizontal: 'center'
            };
            options.arrow.show = false;
        }
        return options;
    }

    return WidgetClass;

});