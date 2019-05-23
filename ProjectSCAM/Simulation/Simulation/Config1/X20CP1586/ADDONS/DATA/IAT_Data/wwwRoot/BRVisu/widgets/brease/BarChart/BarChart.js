define(['widgets/brease/DataHandlerWidget/DataHandlerWidget',
    'brease/events/BreaseEvent',
    'brease/enum/Enum',
    'brease/core/Utils',
    'brease/decorators/MeasurementSystemDependency',
    'brease/config/NumberFormat',
    'widgets/brease/BarChart/libs/Renderer'], function (SuperClass, BreaseEvent, Enum, Utils, measurementSystemDependency, NumberFormat, Renderer) {

    'use strict';

    /**
    * @class widgets.brease.BarChart
    * @extends widgets.brease.DataHandlerWidget
    * @iatMeta studio:isContainer
    * true
    * 	
    * @iatMeta category:Category
	* Chart,Container
    *
	* @iatMeta description:short
	* Container für BarChartItems
	* @iatMeta description:de
	* Ein BarChart ist ein Chart welcher Daten mithilfe von Rechtecken, in Abhängigkeit ihres Wertes representiert 
	* @iatMeta description:en
	* A BarChart is a chart which represents data with rectangular bars,
    * which lenghts are propertional to the values they represent
	*/

	/**
	* @cfg {Integer} barPadding=5
	* @iatStudioExposed
    * @iatCategory Appearance
	* space between 2 Bars 
	*/

    /**
	* @cfg {Integer} xAxisHeight=40
	* @iatStudioExposed
    * @iatCategory Appearance
	* Height of the xAxis 
	*/

    /**
	* @cfg {Integer} yAxisWidth=40
	* @iatStudioExposed
    * @iatCategory Appearance
	* Width of the yAxis
	*/

    /**
	* @cfg {PixelValCollection} chartMargin='30px 30px 0px 0px'
	* @iatStudioExposed
    * @iatCategory Appearance
	* Defines margins between the chart area and the external border of the widget
	*/

	/**
	* @cfg {Boolean} showValue=true
	* @iatStudioExposed
    * @iatCategory Behavior
	* When true BarChart is displaying the actual Value of each Bar  
	*/

	/**
	* @cfg {brease.enum.Orientation} orientation=BottomToTop
	* @iatStudioExposed
    * @iatCategory Appearance
	* Orientation of the Widget
    * Currently supported orientations are only ButtomToTop and LeftToRight. TopToBottom and RightToLeft are reserved for later usage
	*/

	/**
	* @cfg {brease.config.MeasurementSystemUnit} unit=''
	* @iatStudioExposed
    * @bindable
    * @iatCategory Appearance
	* brease.config.NumberFormat for every measurement system  
	*/

	/**
	* @cfg {Boolean} showUnit=false
	* @iatStudioExposed
    * @iatCategory Behavior
	* When true the UnitSymbol for the selected unit is shown on the Y-Axis  
	*/

	/**
	* @cfg {UInteger} transitionTime=0
	* @iatStudioExposed
    * @iatCategory Behavior
	* Defines the time (in ms) used for a transition when the value of a Bar changes.  
	*/

    /**
    * @cfg {brease.config.MeasurementSystemFormat} format={'metric':{ 'decimalPlaces' : 0, 'minimumIntegerDigits' : 1 }, 'imperial' :{ 'decimalPlaces' : 0, 'minimumIntegerDigits' : 1 }, 'imperial-us' :{ 'decimalPlaces' : 0, 'minimumIntegerDigits' : 1 }}  
    * @iatStudioExposed
    * @iatCategory Appearance
    * @bindable
    * brease.config.NumberFormat for every measurement system.
    * Read more about <a href="../FAQ/FormatNumber.html">Number Formats</a>
    */

    /**
    * @property {WidgetList} [children=["widgets.brease.BarChartItem", "widgets.brease.BarChartThreshold"]]
    * @inheritdoc  
    */

	var defaultSettings = {
	    barPadding: 5,
	    showValue: true,
	    orientation: Enum.Orientation.BTT,
	    showUnit: false,
	    maxValue: 100,
	    minValue: 0,
	    minValueList: [],
	    maxValueList: [],
	    transitionTime: 0,
	    format: { default: { decimalPlaces: 0, minimumIntegerDigits: 1 } },
	    yAxisWidth: 40,
	    xAxisHeight: 40,
	    chartMargin: '30px 30px 0px 0px',
	    initRenderer: true
	},

	WidgetClass = SuperClass.extend(function BarChart() {
	    SuperClass.apply(this, arguments);
	}, defaultSettings),

    p = WidgetClass.prototype;

    p.init = function () {

        var that = this;

        if (this.settings.omitClass !== true) {
            this.el.addClass('breaseBarChart');
            this.el.addClass('container');
        }

        var rendererSettings = {
            id: that.elem.id,
            maxValue: that.getMaxValue(),
            minValue: that.getMinValue(),
            barPadding: that.getBarPadding(),
            showValue: that.getShowValue(),
            orientation: that.getOrientation(),
            unitText: that.getShowUnit() ? that.settings.unitSymbol : '',
            height: that.el.height(),
            width: that.el.width(),
            barIdList: [],
            lineIdList: [],
            transitionTime: that.getTransitionTime(),
            numberFormat: {},
            yAxisWidth: that.getYAxisWidth(),
            xAxisHeight: that.getXAxisHeight(),
            chartMargin: that.getChartMargin(),
            el: that.el
        };

        this.createRenderer(rendererSettings);

        SuperClass.prototype.init.call(this);
        this.measurementSystemChangeHandler();

        if (brease.config.editMode) {
            _initEditor(this);
        }
    };

    p.createRenderer = function (rendererSettings) {
        this.renderer = new Renderer(rendererSettings);
    };

    p.addClassNames = function (classNames) {
        var widget = this;
        classNames.forEach(function (id) {
            widget.el.addClass(id);
        });
        this.initialized = true;
    };

    //workaround to be able to resize the Widget in the propertyGrid
    p._setWidth = function (w) {
        SuperClass.prototype._setWidth.call(this, w);
        if (this.renderer !== undefined) {
            this.renderer.setSize(this.settings.height, this.settings.width);
        }
    };
    //workaround to be able to resize the Widget in the propertyGrid
    p._setHeight = function (h) {
        SuperClass.prototype._setHeight.call(this, h);
        if (this.renderer !== undefined) {
            this.renderer.setSize(this.settings.height, this.settings.width);
        }
    };

    /**
	* @method setBarPadding
	* Sets barPadding
	* @param {Integer} barPadding
	*/
    p.setBarPadding = function (barPadding) {
        this.settings.barPadding = barPadding;
        if (this.renderer !== undefined) {
            this.renderer.setBarPadding(barPadding);
        }
    };

    /**
	* @method getBarPadding 
	* Returns barPadding.
	* @return {Integer}
	*/
    p.getBarPadding = function () {
        return this.settings.barPadding;
    };

    /**
	* @method setXAxisHeight
	* Sets xAxisHeight
	* @param {Integer} xAxisHeight
	*/
    p.setXAxisHeight = function (xAxisHeight) {
        this.settings.xAxisHeight = xAxisHeight;
        if (this.renderer !== undefined) {
            this.renderer.setXAxisHeight(xAxisHeight);
        }
    };

    /**
	* @method getXAxisHeight 
	* Returns xAxisHeight.
	* @return {Integer}
	*/
    p.getXAxisHeight = function () {
        return this.settings.xAxisHeight;
    };

    /**
	* @method setYAxisWidth
	* Sets yAxisWidth
	* @param {Integer} yAxisWidth
	*/
    p.setYAxisWidth = function (yAxisWidth) {
        this.settings.yAxisWidth = yAxisWidth;
        if (this.renderer !== undefined) {
            this.renderer.setYAxisWidth(yAxisWidth);
        }
    };

    /**
	* @method getYAxisWidth 
	* Returns yAxisWidth.
	* @return {Integer}
	*/
    p.getYAxisWidth = function () {
        return this.settings.yAxisWidth;
    };

    /**
    * @method setChartMargin
    * Sets chartMargin
    * @param {PixelValCollection} chartMargin
    */
    p.setChartMargin = function (chartMargin) {
        this.settings.chartMargin = (chartMargin.match(/[\d]*\.*[\d]+px/g)) ? chartMargin : '30px 30px 0px 0px';
        if (this.renderer !== undefined) {
            this.renderer.setChartMargin(this.settings.chartMargin);
        }
    };

    /**
	* @method getChartMargin 
	* Returns chartMargin.
	* @return {PixelValCollection}
	*/
    p.getChartMargin = function () {
        return this.settings.chartMargin;
    };

    /**
	* @method setShowValue
	* Sets showValue
	* @param {Boolean} showValue
	*/
    p.setShowValue = function (showValue) {
        this.settings.showValue = showValue;
        if (this.renderer !== undefined) {
            this.renderer.setShowValue(this.getShowValue());
        }
    };

    /**
	* @method getShowValue 
	* Returns showValue.
	* @return {Boolean}
	*/
    p.getShowValue = function () {
        return this.settings.showValue;
    };

    /**
	* @method setOrientation
	* Sets orientation
	* @param {brease.enum.Orientation} orientation
	*/
    p.setOrientation = function (orientation) {
        this.settings.orientation = orientation;
        if (this.renderer !== undefined) {
            this.renderer.setOrientation(this.getOrientation());
        }
    };

    /**
	* @method getOrientation 
	* Returns orientation.
	* @return {brease.enum.Orientation}
	*/
    p.getOrientation = function () {
        return this.settings.orientation;
    };

    /**
	* @method setUnit
	* @iatStudioExposed
	* Sets unit
	* @param {brease.config.MeasurementSystemUnit} unit
	*/
    p.setUnit = function (unit) {
        this.settings.unit = unit;
        this.measurementSystemChangeHandler();
        this.setChildUnit();
    };

    /**
	* @method getUnit 
	* Returns unit.
	* @return {brease.config.MeasurementSystemUnit}
	*/
    p.getUnit = function () {
        return this.settings.unit;
    };

    /**
	* @method setShowUnit
	* Sets showUnit
	* @param {Boolean} showUnit
	*/
    p.setShowUnit = function (showUnit) {
        this.settings.showUnit = showUnit;
        var unitText = this.getShowUnit() ? this.settings.unitSymbol : '';
        if (this.renderer !== undefined) {
            this.renderer.setUnitSymbol(unitText);
        }
    };

    /**
	* @method getShowUnit 
	* Returns showUnit.
	* @return {Boolean}
	*/
    p.getShowUnit = function () {
        return this.settings.showUnit;
    };

    /**
	* @method setTransitionTime
	* Sets transitionTime
	* @param {UInteger} transitionTime
	*/
    p.setTransitionTime = function (transitionTime) {
        this.settings.transitionTime = transitionTime;
    };

    /**
	* @method getTransitionTime 
	* Returns transitionTime.
	* @return {UInteger}
	*/
    p.getTransitionTime = function () {
        return this.settings.transitionTime;
    };

    /**
    * @method setFormat
    * Sets format
    * @param {brease.config.MeasurementSystemFormat} format
    */
    p.setFormat = function (format) {
        this.settings.format = format;
        _updateFormat(this.settings.format, this);
    };

    /**
	* @method getFormat 
	* Returns format.
	* @return {brease.config.MeasurementSystemFormat}
	*/
    p.getFormat = function () {
        return this.settings.format;
    };

    p.setChildUnit = function () {
        var widget = this;
        this.settings.childrenList.forEach(function (currentWidget) {
            currentWidget.setUnit(widget.getUnit());
        });
    };

    p.updateData = function (objectReceive) {
        switch (objectReceive.type){
            case 'BarChartItem':
                _updateBars(this, objectReceive);
                break;

            case 'BarChartThreshold':
                _updateLines(this, objectReceive);
                break;

        }
        
    };

    p.setMinValue = function (dataReceived) {
        if (dataReceived.visibility) {
            this.settings.minValueList[dataReceived.id] = dataReceived.minValue;
        } else {
            delete this.settings.minValueList[dataReceived.id];
        }
        this.settings.minValue = _calcMinValue(this.settings.minValueList);
    };

    p.getMinValue = function () {
        return this.settings.minValue;
    };

    p.setMaxValue = function (dataReceived) {
        if (dataReceived.visibility) {
            this.settings.maxValueList[dataReceived.id] = dataReceived.maxValue;
        } else {
            delete this.settings.maxValueList[dataReceived.id];
        }
        this.settings.maxValue = _calcMaxValue(this.settings.maxValueList);
    };

    p.getMaxValue = function () {
        return this.settings.maxValue;
    };

    p.measurementSystemChangeHandler = function () {
        var widget = this;
        this.unitChange = $.Deferred();

        this.settings.mms = brease.measurementSystem.getCurrentMeasurementSystem();
        _updateFormat(this.settings.format, this);

        $.when(
            this.unitChange.promise()
        ).then(function successHandler() {
            if (widget.renderer !== undefined) {
                if (Utils.isFunction(widget.renderer.setUnitSymbol)) {
                    var unitText = widget.getShowUnit() ? widget.settings.unitSymbol : '';
                    widget.renderer.setUnitSymbol(unitText);
                }
            }
        });

        var previousUnit = this.settings.currentUnit;
        if (this.settings.unit !== undefined) {
            this.settings.currentUnit = this.settings.unit[this.settings.mms];
        }
        if (this.settings.currentUnit !== previousUnit) {
            brease.language.pipeAsyncUnitSymbol(this.settings.currentUnit, this._bind(_setUnitSymbol));
        } else {
            this.unitChange.resolve();
        }
    };

    p.childrenInitializedHandler = function () {
        SuperClass.prototype.childrenInitializedHandler.call(this);

        if (this.renderer !== undefined) {
            this.renderer.setIdList(this.settings.childrenIdList.slice(0), this.settings.childrenList.slice(0));
            this.renderer._sortEntries();
            this.renderer.reposition();
        }

        this.setChildUnit();
    };

    p.childrenAdded = function (event) {
        SuperClass.prototype.childrenAdded.call(this, event);
        if (event.target === this.elem) {
            this.renderer.setIdList(this.settings.childrenIdList.slice(0), this.settings.childrenList.slice(0));
            brease.callWidget(event.detail.widgetId, 'setParentWidget', this);
            brease.callWidget(event.detail.widgetId, 'executeWorkAroundEditorBars');
            this.renderer.redraw();
            this.renderer.reposition();
        }
    };

    p.childrenRemoved = function (event) {
        SuperClass.prototype.childrenRemoved.call(this, event);
        if (event.target === this.elem) {
            this.renderer.removeBar(event.detail.widgetId);
            this.renderer.removeLine(event.detail.widgetId);
            var index = this.settings.childrenIdList.indexOf(event.detail.widgetId);
            this.settings.childrenIdList.splice(index, 1);
            this.renderer.setIdList(this.settings.childrenIdList.slice(0), this.settings.childrenList.slice(0));
            this.renderer.redraw();
        }
    };

    //PRIVATE FUNCTIONS 

    function _calcMinValue(minArray) {
        var minValueVolatile;
        for (var key in minArray) {
            if (minArray[key] < minValueVolatile || minValueVolatile === undefined) {
                minValueVolatile = minArray[key];
            }
        }
        return minValueVolatile;
    }

    function _calcMaxValue(maxArray) {
        var maxValueVolatile;
        for (var key in maxArray) {
            if (maxArray[key] > maxValueVolatile || maxValueVolatile === undefined) {
                maxValueVolatile = maxArray[key];
            }
        }
        return maxValueVolatile;
    }

    function _setUnitSymbol(symbol) {
        this.settings.unitSymbol = symbol;
        this.unitChange.resolve();
    }

    function _initEditor(widget) {
        widget.el.addClass('iat-container-widget');
        
        require(['widgets/brease/BarChart/libs/EditorHandles'], function (EditorHandles) {
            var editorHandles = new EditorHandles(widget);
            widget.getHandles = function () {
                return editorHandles.getHandles();
            };
            widget.designer.getSelectionDecoratables = function () {
                return editorHandles.getSelectionDecoratables();
            };
            if (widget.renderer !== undefined) {
                widget.renderer.setTransitionTime(0);
            }
        });

    }

    function _updateFormat(format, widget) {
        var formatObject;
        if (widget.settings.format !== undefined && widget.renderer !== undefined) {
            if (Utils.isObject(format)) {
                widget.renderer.setNumberFormat(NumberFormat.getFormat(widget.settings.format, widget.settings.mms));
            }
            else if (typeof (format) === 'string') {
                if (brease.language.isKey(format)) {
                    try {
                        widget.setLangDependency(true);
                        var textKey = brease.language.parseKey(format);
                        formatObject = JSON.parse(brease.language.getTextByKey(textKey).replace(/\'/g, '"'));
                        widget.renderer.setNumberFormat(NumberFormat.getFormat(formatObject, widget.settings.mms));
                    } catch (error) {
                        console.iatWarn(widget.elem.id + ': Format String "' + format + '" is invalid!');
                        widget.renderer.setNumberFormat(NumberFormat.getFormat({}, widget.settings.mms));
                    }
                } else {
                    try {
                        formatObject = JSON.parse(format.replace(/\'/g, '"'));
                        widget.renderer.setNumberFormat(NumberFormat.getFormat(formatObject, widget.settings.mms));
                    } catch (error) {
                        console.iatWarn(widget.elem.id + ': Format String "' + format + '" is invalid!');
                        widget.renderer.setNumberFormat(NumberFormat.getFormat({}, widget.settings.mms));
                    }
                }
            }
        } else {
            if (widget.renderer !== undefined) {
                widget.renderer.setNumberFormat(NumberFormat.getFormat({}, widget.settings.mms));
            }
        }
    }

    function _updateLines(widget, objectReceive) {
        if (widget.renderer !== undefined) {
            if (Utils.isFunction(widget.renderer.setLine) && Utils.isFunction(widget.renderer.removeLine)) {
                if (objectReceive.visibility) {
                    widget.renderer.setLine({ value: objectReceive.value, id: objectReceive.id, window: objectReceive.window });
                } else {
                    widget.renderer.removeLine(objectReceive.id);
                }
            }
        }
    }

    function _updateBars(widget, objectReceive) {
        var oldMinValue = widget.getMinValue(),
            oldMaxValue = widget.getMaxValue();

        widget.setMinValue(objectReceive);
        widget.setMaxValue(objectReceive);

        if (widget.renderer !== undefined) {
            if (Utils.isFunction(widget.renderer.setMinValue) && oldMinValue !== widget.getMinValue()) {
                widget.renderer.setMinValue(widget.getMinValue());
            }

            if (Utils.isFunction(widget.renderer.setMaxValue) && oldMaxValue !== widget.getMaxValue()) {
                widget.renderer.setMaxValue(widget.getMaxValue());
            }

            if (Utils.isFunction(widget.renderer.setBar) && Utils.isFunction(widget.renderer.removeBar)) {
                if (objectReceive.visibility) {
                    widget.renderer.setBar({ text: objectReceive.text, value: objectReceive.value, id: objectReceive.id });
                } else {
                    widget.renderer.removeBar(objectReceive.id);
                }
            }
        }
    }

    return measurementSystemDependency.decorate(WidgetClass, true);
});
