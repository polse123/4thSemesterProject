/*global createjs,brease,define*/
define(['brease/core/Class', 'brease/events/BreaseEvent'], function (SuperClass, BreaseEvent) {

    'use strict';

    var SliderWheel = SuperClass.extend(function SliderWheel(widget, elem, settings) {
        SuperClass.call(this);
        this.widget = widget;
        this.elem = elem;
        this.settings = settings;
        this.initialize();
    }, null),

	p = SliderWheel.prototype;

    p.initialize = function () {
        var marker1 = $('<div class="marker">'),
			marker2 = $('<div class="marker">');
        this.fragment = $('<div>').addClass('fragment');
        this.data = [];

        this.drawSlider();


        this.elem.append([marker1, marker2, this.fragment]);

        this.fragment.on(BreaseEvent.MOUSE_DOWN, this._bind('_onMouseDown'));
        //this.fragment.on(BreaseEvent.CLICK, this._bind('_onClick'));

        this._setIndex(0);



    };

    p.drawSlider = function () {
        var index = 0, text, elem;
        if (this.settings.range !== undefined) {
            for (var i = this.settings.range.start ; i <= this.settings.range.end; i += this.settings.range.offset) {
                if (this.settings.format !== undefined) {
                    text = pad(i, this.settings.format);
                }
                else {
                    text = i;
                }
                elem = $('<button data-index="' + index + '" data-value="' + i + '">' + text + '</button>');
                this.fragment.append(elem);
                this.data[index] = { value: i, text: text };
                index += 1;
            }
            this.offset = 0;
            this.max = 80;
            this.min = (index - 3) * -40;

        }

        else if (this.settings.data !== undefined) {
            for (var j in this.settings.data) {
                elem = $('<button data-index="' + index + '" data-value="' + this.settings.data[j].value + '">' + this.settings.data[j].text + '</button>');
                this.fragment.append(elem);
                this.data[index] = { value: this.settings.data[j].value, text: this.settings.data[j].text };
                index += 1;
            }
            this.offset = 0;
            this.max = 80;
            this.min = (index - 3) * -40;

        }

    };

    p.update = function (data) {
        for (var i = 0; i < data.length; i += 1) {
            var item = data[i];
            this.fragment.find('[data-value=' + item.value + ']').html(item.text);
        }
    };

    p._onClick = function (e) {
        e.originalEvent.preventDefault();
        var index = $(e.target).attr('data-index');

        if (index !== undefined) {
            this._setIndex(index);
        }
    };

    p._onMouseDown = function (e) {
        var target = e.currentTarget;
        this.oldOffset = this.offset;
        e.originalEvent.preventDefault();
        if (e.originalEvent.touches) {
            this.pageY = e.originalEvent.touches[0].pageY - this.offset;
        } else {
            this.pageY = e.pageY - this.offset;
        }

        this.fragment.removeClass("transition");
        $(document).on(BreaseEvent.MOUSE_MOVE, this._bind('_onMouseMove'));
        $(document).on(BreaseEvent.MOUSE_UP, this._bind('_onMouseUp'));
    };

    p._onMouseMove = function (e) {
        var pageY, offset;

        if (e.originalEvent.touches) {
            pageY = e.originalEvent.touches[0].pageY;
        } else {
            pageY = e.pageY;
        }

        offset = pageY - this.pageY;




        if (offset >= this.min && offset <= this.max) {
            this.offset = pageY - this.pageY;
        }
        this.fragment.css('top', this.offset);

    };

    p._onMouseUp = function (e) {
        $(document).off(BreaseEvent.MOUSE_MOVE, this._bind('_onMouseMove'));
        $(document).off(BreaseEvent.MOUSE_UP, this._bind('_onMouseUp'));
        if (this.offset !== this.oldOffset) {
            var index = Math.round(((this.offset) / -40.0) + 2);
            this._setIndex(index);
        }

        else {
            this._onClick(e);
        }
    };

    p._setIndex = function (index) {
        this.index = index;
        var offset = index * (-40) + 80;

        var value = this.data[index].value;

        this.fragment.addClass('transition');

        this.fragment.css('top', offset);
        this.offset = offset;
        this.widget[this.settings.onChange].call(this.widget, value);
    };

    p.getValue = function () {
        return this.data[this.index].value;
    };

    p.setValue = function (value) {
        var elem = this.fragment.find("button[data-value='" + value + "']"),
			index;

        if (elem) {
            index = elem.attr("data-index");
        }

        this._setIndex(index);
    };

    p.show = function () {
        this.elem.show();
    };

    p.hide = function () {
        this.elem.hide();

    };

    function pad(value, digits) {
        var str = value + '';
        if (str.length < digits) {
            str = "000000000" + str;
            return str.substr(str.length - digits);
        } else {
            return str;
        }
    }

    return SliderWheel;

});