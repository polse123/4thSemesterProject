/*global define,brease,console,CustomEvent,_*/
define(['brease/events/BreaseEvent', 'brease/enum/Enum', 'brease/core/Utils'], function (BreaseEvent, Enum, Utils) {

    'use strict';

    var Slider = {
        init: function (widget) {

            this.thumb = widget.el.find('.numpadSlider_thumb');
            this.track = widget.el.find('.numpadSlider_track');
            this.outputVal = widget.el.find('.numpadSlider_output span');

            this.settings = {
                error: false,
                width: this.track.outerWidth(),
                thumbWidth: this.thumb.outerWidth(),
                zoomFactor: this.getZoomFactor()
            };

            this.changeHandler = widget._onSliderChanged.bind(widget);

            this.thumb.on(BreaseEvent.MOUSE_DOWN, this.onMouseDown.bind(this));
            this.track.on(BreaseEvent.CLICK, this.trackClickHandler.bind(this));
            this.bound_onMouseMove = this.onMouseMove.bind(this);
            this.bound_onMouseUp = this.onMouseUp.bind(this);
            return this;
        },
        update: function () {
            this.settings.zoomFactor = this.getZoomFactor();
        },
        setSettings: function (minValue, maxValue, smallChange, largeChange, numberFormat, useDigitGrouping, separators) {
            this.settings.minValue = minValue;
            this.settings.maxValue = maxValue;
            this.settings.smallChange = smallChange;
            this.settings.largeChange = largeChange;
            this.settings.numberFormat = numberFormat;
            this.settings.useDigitGrouping = useDigitGrouping;
            this.settings.separators = separators;
        },
        setValue: function (value, omitDispatch) {
            //console.debug('numpadSlider.setValue:', value);
            if (value !== undefined) {
                this.value = value;
                if (this.value !== null) {

                    var val = Math.round(value / this.settings.smallChange) * this.settings.smallChange,
                        pos;

                    val = _limit(val, this.settings.minValue, this.settings.maxValue);

                    pos = this.valToPos(val);

                    if (val >= this.settings.minValue && val <= this.settings.maxValue) {
                        this.value = val;
                        this.setPosition(pos);
                        this.setOutput();
                        if (omitDispatch !== true) {
                            this.changeHandler({ detail: { value: this.value } });
                        }
                    }
                }
            }
        },
        setValueAsString: function (str) {
            //console.debug('numpadSlider.setValueAsString:', str);
            this.outputVal.text(str);
        },
        setOutput: function () {
            if (this.value === null) {
                this.outputVal.text(brease.settings.noValueString);
            } else {
                this.outputVal.text(brease.formatter.formatNumber(this.value, this.settings.numberFormat, this.settings.useDigitGrouping, this.settings.separators));
            }
        },
        setError: function (error) {
            var change = (error !== this.settings.error);
            this.settings.error = error;
            if (change) {
                if (error) {
                    this.outputVal.addClass('error');
                } else {
                    this.outputVal.removeClass('error');
                }
            }
        },
        onMouseDown: function (e) {
            this.mouseMove = true;
            _calcThumbOffset.call(this, e);

            brease.bodyEl.on(BreaseEvent.MOUSE_MOVE, this.bound_onMouseMove);
            brease.bodyEl.on(BreaseEvent.MOUSE_UP, this.bound_onMouseUp);
        },
        onMouseMove: function (e) {
            _moveSlider.call(this, e);
        },
        onMouseUp: function (e) {
            this.mouseMove = false;
            brease.bodyEl.off(BreaseEvent.MOUSE_MOVE);
            brease.bodyEl.off(BreaseEvent.MOUSE_UP);
            _moveSlider.call(this, e);
        },
        getZoomFactor: function () { // A&P 451830
            var zoomFactor = brease.bodyEl.css("zoom");
            if (zoomFactor === undefined || zoomFactor === 'normal' || zoomFactor === 'auto') {
                return 1;
            } else {
                return parseFloat(zoomFactor);
            }
        },
        trackClickHandler: function (e) {
            var value = this.value;
            if (!this.mouseMove) {
                var offset = this.calcOffset(e),
                    newValue = this.calcStep(offset, value);

                newValue = _limit(newValue, this.settings.minValue, this.settings.maxValue);

                this.setValue(newValue);
            }

            this.mouseMove = false;

        },
        calcOffset: function (e) {
            var thumbOffset = this.thumb.offset().left,
                offsetX = Utils.getOffsetOfEvent(e).x / this.settings.zoomFactor;

            return offsetX - thumbOffset - this.settings.thumbWidth / 2;
        },
        calcStep: function (offset, value) {
            var val;

            if (offset > 0) {
                val = value + this.settings.largeChange;
            }
            else if (offset < 0) {
                val = value - this.settings.largeChange;
            }

            return val;
        },
        posToVal: function (pos) {
            var nenner = (this.settings.width * this.settings.zoomFactor),
                val = (pos * (this.settings.maxValue / nenner - this.settings.minValue / nenner)) + this.settings.minValue;

            return _limit(val, this.settings.minValue, this.settings.maxValue);
        },
        valToPos: function (val) {
            var pos;
            val = _limit(val, this.settings.minValue, this.settings.maxValue);

            if (this.settings.maxValue === -this.settings.minValue) {

                pos = (((this.settings.width / this.settings.maxValue) / 2) * val) - this.rangeToPixels(this.settings.minValue);
            } else {

                pos = ((this.settings.width * val) / (this.settings.maxValue - this.settings.minValue)) - this.rangeToPixels(this.settings.minValue);
            }
            return pos;
        },
        rangeToPixels: function (range) {
            var px;
            if (this.settings.maxValue === -this.settings.minValue) {

                px = ((range / 2) / this.settings.maxValue) * this.settings.width;
            } else {

                px = (range * this.settings.width) / (this.settings.maxValue - this.settings.minValue);
            }
            return px;
        },
        setPosition: function (pos) {
            this.thumb.css('left', pos - (this.settings.thumbWidth / 2));
        }
    };

    function _limit(val, minValue, maxValue) {
        if (val < minValue) {
            val = minValue;
        }

        if (val > maxValue) {
            val = maxValue;
        }
        return val;
    }

    function _moveSlider(e) {
        var pageX = Utils.getOffsetOfEvent(e).x,
            pos = pageX - this.thumbOffset * this.settings.zoomFactor,
            val = this.posToVal(pos);

        this.setValue(val);
    }

    function _calcThumbOffset(e) {

        this.thumbOffset = this.track.offset().left;
    }

    return Slider;

});