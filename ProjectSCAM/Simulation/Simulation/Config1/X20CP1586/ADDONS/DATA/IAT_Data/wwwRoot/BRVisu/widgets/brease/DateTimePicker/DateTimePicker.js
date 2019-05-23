/*global define,brease,CustomEvent*/
define(['widgets/brease/Window/Window', 'widgets/brease/DateTimePicker/libs/SliderWheel', 'brease/events/BreaseEvent', 'brease/helper/DateFormatter', 'brease/decorators/CultureDependency'], function (SuperClass, SliderWheel, BreaseEvent, dateFormatter, cultureDependency) {
    /*jshint white:false,validthis: true */
    "use strict";

    /**
    * @class widgets.brease.DateTimePicker
    * #Description
    * DateTimePicker overlay for DateTime-Inputs, to provide a numeric virtual keyboard
    * @extends widgets.brease.Window
    * @singleton
    *
    * @iatMeta studio:visible
    * false
    *
    * @iatMeta category:Category
    * Controls
    * @iatMeta category:IO
    * Input,Output,System
    * @iatMeta category:Operation
    * Touch,Mouse
    * @iatMeta category:Appliance
    * Text
    * @iatMeta category:Performance
    * Low,Medium,High
    * @iatMeta description:short
    * Eingabe Zeit
    * @iatMeta description:de
    * Ermöglicht dem Benutzer eine Zeit einzugeben
    * @iatMeta description:en
    * Enables the uster to enter a time value
    */

    /**
    * @cfg {Date} value
    * @bindable
    * set value
    */
    var defaultSettings = {
        html: 'widgets/brease/DateTimePicker/DateTimePicker.html',
        stylePrefix: 'widgets_brease_DateTimePicker',
        dateTimeFormat: 'S',
        modal: true,
        scale2fit: true
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
    WidgetClass = SuperClass.extend(function DateTimePicker(elem, options, deferredInit, inherited) {
        if (inherited === true) {
            SuperClass.call(this, null, null, true, true);
        } else {
            if (instance === undefined) {
                SuperClass.call(this, null, null, true, true);
                _loadHTML(this);
            } else {
                return instance;
            }
        }
    }, defaultSettings),

    p = WidgetClass.prototype;

    function _loadHTML(widget) {
        require(['text!' + widget.settings.html], function (html) {
            widget.deferredInit.call(widget, document.body, html);
            widget.readyHandler();
        });
    }

    /**
    * Public Methods
    */

    p.init = function () {
        var widget = this;
        this.el.prependTo(document.body);
        if (this.settings.omitClass !== true) {
            this.addInitialClass('breaseDateTimePicker');
        }
        this.settings.windowType = 'DateTimePicker';
        SuperClass.prototype.init.call(this, true);

        this.value = new Date(1970, 0, 1, 0, 0, 0, 0);
        this.error = false;
        this.DateTimePickerYear = new SliderWheel(this, this.el.find('.dtfragment.year'), {
            range: {
                start: 1900,
                end: 2100,
                offset: 1
            },
            onChange: '_setYear'
        });

        this.DateTimePickerMonth = new SliderWheel(widget, widget.el.find('.dtfragment.month'), {
            data: _getMonthData(),
            onChange: '_setMonth'
        });

        this.DateTimePickerDay = new SliderWheel(this, this.el.find('.dtfragment.day'), {
            range: {
                start: 1,
                end: 31,
                offset: 1
            },
            format: 2,
            onChange: '_setDay'
        });

        this.DateTimePickerHour = new SliderWheel(this, this.el.find('.dtfragment.hour'), {
            range: {
                start: 0,
                end: 23,
                offset: 1
            },
            format: 2,
            onChange: '_setHour'

        });

        this.DateTimePickerMinute = new SliderWheel(this, this.el.find('.dtfragment.minute'), {
            range: {
                start: 0,
                end: 59,
                offset: 1
            },
            format: 2,
            onChange: '_setMinute'
        });

        this.DateTimePickerSecond = new SliderWheel(this, this.el.find('.dtfragment.second'), {
            range: {
                start: 0,
                end: 59,
                offset: 1
            },
            format: 2,
            onChange: '_setSecond'
        });

        this.DateTimePickerString = this.el.find('.actDate');
        this.btnEnter = this.el.find('.dateTimePickerEnter').on(BreaseEvent.CLICK, this._bind('_submitValue')).on(BreaseEvent.MOUSE_DOWN, this._bind(_addEnter));
        this.btnReset = this.el.find('.dateTimePickerReset').on(BreaseEvent.CLICK, this._bind('_resetValue')).on(BreaseEvent.MOUSE_DOWN, this._bind(_addReset));
        _setButtonText(this);
    };

    function _addEnter() {
        this.btnEnter.addClass('active');
        brease.bodyEl.on(BreaseEvent.MOUSE_UP, this._bind(_removeEnter));
    }

    function _removeEnter() {
        brease.bodyEl.off(BreaseEvent.MOUSE_UP, this._bind(_removeEnter));
        this.btnEnter.removeClass('active');
    }

    function _addReset() {
        this.btnReset.addClass('active');
        brease.bodyEl.on(BreaseEvent.MOUSE_UP, this._bind(_removeReset));
    }

    function _removeReset() {
        brease.bodyEl.off(BreaseEvent.MOUSE_UP, this._bind(_removeReset));
        this.btnReset.removeClass('active');
    }

    function _setButtonText(widget) {
        widget.btnReset.html(brease.language.getSystemTextByKey('BR/IAT/brease.common.reset'));
        widget.btnEnter.html(brease.language.getSystemTextByKey('BR/IAT/brease.common.enter'));
    }

    p.langChangeHandler = function () {
        _setButtonText(this);
        SuperClass.prototype.langChangeHandler.apply(this, arguments);
    };

    p.cultureChangeHandler = function () {
        this.DateTimePickerMonth.update(_getMonthData());
        _setDateTimePickerValue.call(this, this.value);
    };

    p.setValue = function (value) {
        //console.log('DateTimePicker.setValue:', value);
        if (value !== undefined && value !== "") {
            this.value = new Date(value.valueOf());
            this.oldValue = new Date(value.valueOf());
            _setDateTimePickerValue.call(this, this.value);
        }

    };

    p.getValue = function () {
        return this.value;
    };

    /**
    * @method show
    * @inheritdoc
    */
    p.show = function (options, refElement) {
        options = _validatePositions(options);
        SuperClass.prototype.show.apply(this, arguments);
        this.closeOnLostContent(refElement);
        this._setTimeComponents();
        this.setValue(this.settings.time);
    };

    p.dispose = function () {
        this.el.find('#breaseDateTimePickerButtons').off();
        brease.bodyEl.off(BreaseEvent.MOUSE_UP, this._bind(_removeEnter));
        brease.bodyEl.off(BreaseEvent.MOUSE_UP, this._bind(_removeReset));
        SuperClass.prototype.dispose.apply(this, arguments);
    };

    /**
     * Private Methods
     */
    p._submitValue = function (e) {
        this._handleEvent(e, true);
        this.dispatchEvent(new CustomEvent(BreaseEvent.SUBMIT, {
            detail: { value: this.getValue() }
        }));
        this.hide();
    };

    p._setTimeComponents = function () {
        var format;
        if (this.settings.dateTimeFormat.length === 1) {
            format = dateFormatter.getFormat4Pattern(this.settings.dateTimeFormat);
            if (format === undefined) {
                console.iatWarn('invalid pattern "' + this.settings.dateTimeFormat + '" in dateTimeFormat -> take default pattern "' + defaultSettings['dateTimeFormat'] + '"');
                this.settings.dateTimeFormat = defaultSettings['dateTimeFormat'];
                format = dateFormatter.getFormat4Pattern(this.settings.dateTimeFormat);
            }
        } else {
            format = this.settings.dateTimeFormat;
        }

        if (format.indexOf("y") !== -1) {
            this.DateTimePickerYear.show();
        } else {
            this.DateTimePickerYear.hide();
        }

        if (format.indexOf("M") !== -1) {
            this.DateTimePickerMonth.show();
        } else {
            this.DateTimePickerMonth.hide();
        }

        if (format.indexOf("d") !== -1) {
            this.DateTimePickerDay.show();
        } else {
            this.DateTimePickerDay.hide();
        }

        if (format.indexOf("H") !== -1 || format.indexOf("h") !== -1) {
            this.DateTimePickerHour.show();
        } else {
            this.DateTimePickerHour.hide();
        }

        if (format.indexOf("m") !== -1) {
            this.DateTimePickerMinute.show();
        } else {
            this.DateTimePickerMinute.hide();
        }

        if (format.indexOf("s") !== -1) {
            this.DateTimePickerSecond.show();
        } else {
            this.DateTimePickerSecond.hide();
        }
        this._setPosition();
    };

    p._resetValue = function () {
        this.setValue(this.oldValue);
    };

    p._setHour = function (val) {
        this.value.setHours(val);

    };

    p._setMinute = function (val) {
        this.value.setMinutes(val);

    };

    p._setSecond = function (val) {
        this.value.setSeconds(val);
    };

    p._setYear = function (val) {
        this.value.setYear(val);
        _checkDateIntegrity.call(this);
    };

    p._setMonth = function (val) {

        this.value.setMonth(val);
        _checkDateIntegrity.call(this);
    };

    p._setDay = function (val) {
        this.value.setDate(val);
        _checkDateIntegrity.call(this);
    };

    var _days = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31],
        _defaultMonthData = [
        { value: 0, text: 'January' },
        {
            value: 1, text: 'February'
        },
        {
            value: 2, text: 'March'
        },
        {
            value: 3, text: 'April'
        },
        {
            value: 4, text: 'May'
        },
        {
            value: 5, text: 'June'
        },
        {
            value: 6, text: 'July'
        },
        {
            value: 7, text: 'August'
        },
        {
            value: 8, text: 'September'
        },
        {
            value: 9, text: 'October'
        },
        {
            value: 10, text: 'November'
        },
        {
            value: 11, text: 'December'
        }
        ];

    function _getMonthData() {

        var monthData = _defaultMonthData;

        var culture = brease.culture.getCurrentCulture().culture;

        var m = culture.calendar.months.names;
        for (var i = 0; i < monthData.length; i += 1) {
            monthData[i]['text'] = m[i];
        }

        return monthData;
    }

    function _checkDateIntegrity() {
        /*jshint validthis: true */
        if (this.DateTimePickerDay && this.check) {
            var thisDay = this.value.getDate(),
                dayOfPicker = this.DateTimePickerDay.getValue();

            // if day of value and day of picker are different -> illegal date
            if (thisDay !== dayOfPicker) {
                var days = _getMonthLength(this.DateTimePickerMonth.getValue(), this.DateTimePickerYear.getValue());
                // set day to max of month in picker and value
                this.DateTimePickerDay.setValue(days);
                this.value.setDate(days);
                this.value.setMonth(this.DateTimePickerMonth.getValue());
            }
        }
    }

    function _getMonthLength(monthIndex, year) {
        if (monthIndex !== 1) {
            return _days[monthIndex];
        } else {
            return (_isLeapYear(year)) ? 29 : 28;
        }
    }

    function _isLeapYear(year) {
        return (((year % 4 === 0) && (year % 100 !== 0)) || (year % 400 === 0));
    }

    function _setDateTimePickerValue(value) {
        var instance = this;
        this.check = false; // to avoid integrity check on initial date
        this.DateTimePickerYear.setValue(value.getFullYear());
        this.DateTimePickerMonth.setValue(value.getMonth());
        this.DateTimePickerDay.setValue(value.getDate());
        this.DateTimePickerHour.setValue(value.getHours());
        this.DateTimePickerMinute.setValue(value.getMinutes());
        this.DateTimePickerSecond.setValue(value.getSeconds());
        dateFormatter.format(this.value, this.settings.dateTimeFormat, function (result) {
            instance.DateTimePickerString.text(result);
        });
        this.check = true;
    }

    function _validatePositions(options) {
        if (options.position) {
            var position = options.position;
            options.arrow = options.arrow || {};

            if (position.horizontal === 'left') {
                position.vertical = 'middle';
                options.arrow.position = 'right';
                options.arrow.show = true;
            } else if (position.horizontal === 'right') {
                position.vertical = 'middle';
                options.arrow.position = 'left';
                options.arrow.show = true;
            } else {
                if (position.vertical === 'top') {
                    position.horizontal = 'center';
                    options.arrow.position = 'bottom';
                    options.arrow.show = true;
                } else if (position.vertical === 'bottom') {
                    position.horizontal = 'center';
                    options.arrow.position = 'top';
                    options.arrow.show = true;
                } else {
                    position.vertical = 'middle';
                    position.horizontal = 'center';
                    options.arrow.show = false;
                }
            }
        }
        return options;
    }

    var instance = new WidgetClass();

    return cultureDependency.decorate(WidgetClass, true);

});
