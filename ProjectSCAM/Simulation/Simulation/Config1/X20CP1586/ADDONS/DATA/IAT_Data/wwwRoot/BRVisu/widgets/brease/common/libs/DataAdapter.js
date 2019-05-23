/*global brease*/
define(function (require) {

    'use strict';

    /**
    * @class widgets.brease.common.libs.DataAdapter
    * #Description
    * DataAdapter
    * @extends brease.core.Class
    *
    * @iatMeta studio:visible
    * false
    */

    var SuperClass = require('brease/core/Class'),
        d3 = require('libs/d3/d3'),
        Utils = require('brease/core/Utils'),

        ModuleClass = SuperClass.extend(function DataAdapter(widget) {
            SuperClass.call(this);

            this.widget = widget;
            this.settings = {
                chartMargin: {
                    marginTop: 15,
                    marginRight: 15,
                    marginBottom: 15,
                    marginLeft: 15
                },
                cursorAreaWidth: 10
            };

            this.init();
        }, null),

        p = ModuleClass.prototype;

    p.init = function () {

        this.xAxisAreas = [];
        this.yAxisAreas = [];
        this.xAxisCursorAreas = [];
        this.chartArea = {};

        this.yScales = [];
        this.xScales = [];
        this.xAxisCursors = [];

        this.graphs = [];
        for (var yValues in this.widget.chartItems.yValues) {

            this.graphs.push({
                id: yValues,
                coordinates: []
            });
        }

        _initializeChartAreas(this);
    };

    p.dispose = function () {

    };

    // Update
    p.updateScales = function () {

        _updateScales(this);
    };
    p.updateGraphData = function () {

        _updateGraphData(this);
    };
    p.updateCursor = function () {

        _updateCursor(this);
    };

    p.updateZoomLevelLimits = function () {

        _updateZoomLevelLimits(this);
    };

    // Getters
    p.getXAxisAreas = function () {

        return this.xAxisAreas;
    };
    p.getYAxisAreas = function () {

        return this.yAxisAreas;
    };
    p.getXAxisCursorAreas = function () {

        return this.xAxisCursorAreas;
    };
    p.getChartArea = function () {

        return this.chartArea;
    };
    p.getGraphs = function () {

        return this.graphs;
    };

    p.getYAxesMinimum = function () {
        var axisAreas = this.getYAxisAreas();
        var minimum = null;

        if (!this.widget || this.widget.chartItems.length < 1 || this.widget.chartItems.yAxis.length < 0) {
            return minimum;
        }

        for (var axisId in axisAreas) {
            if (Object.prototype.hasOwnProperty.call(axisAreas, axisId)) {
                var axisMinimum = this.widget.chartItems.yAxis[axisId].minimum();
                if (minimum === null || axisMinimum < minimum) {
                    minimum = axisMinimum;
                }
            }
        }

        return minimum;
    };

    p.getYAxesMaximum = function () {
        var axisAreas = this.getYAxisAreas();
        var maximum = null;

        if (!this.widget || this.widget.chartItems.length < 1 || this.widget.chartItems.yAxis.length < 0) {
            return maximum;
        }

        for (var axisId in axisAreas) {
            if (Object.prototype.hasOwnProperty.call(axisAreas, axisId)) {
                var axisMaximum = this.widget.chartItems.yAxis[axisId].maximum();
                if (maximum === null || axisMaximum > maximum) {
                    maximum = axisMaximum;
                }
            }
        }

        return maximum;
    };

    // Private Functions
    function _initializeChartAreas(dataAdapter) {

        var i = 0,
            axisId,
            xCursorId,
            xOffsetLeft = 0,
            xOffsetRight = dataAdapter.widget.settings.width,
            yOffsetTop = 0,
            yOffsetBottom = dataAdapter.widget.settings.height,
            xAxisSize = 0,
            yAxisSize = 0,
            xAxisWidgetId,
            xAxisWidget,
            xAxisMinValue,
            graphAreaWidth = dataAdapter.widget.settings.width,
            graphAreaHeight = dataAdapter.widget.settings.height,
            parseChartMargin;

        parseChartMargin = dataAdapter.widget.settings.chartMargin.match(/-?\d+(\.\d+)?px/g);

        for (var pos in dataAdapter.settings.chartMargin) {
            dataAdapter.settings.chartMargin[pos] = parseFloat(parseChartMargin[i], 10);
            i = (parseChartMargin[i + 1]) ? i + 1 : 0;
        }

        xOffsetLeft += dataAdapter.settings.chartMargin['marginLeft'];
        xOffsetRight -= dataAdapter.settings.chartMargin['marginRight'];
        yOffsetTop += dataAdapter.settings.chartMargin['marginTop'];
        yOffsetBottom -= dataAdapter.settings.chartMargin['marginBottom'];

        // Y-Axes (x positioning)
        for (axisId in dataAdapter.widget.chartItems.yAxis) {

            yAxisSize = parseInt(dataAdapter.widget.chartItems.yAxis[axisId].settings.width, 10);
            dataAdapter.yAxisAreas[axisId] = {
                id: axisId,
                y: dataAdapter.settings.chartMargin['marginTop'],
                width: yAxisSize,
                info: {
                    position: dataAdapter.widget.chartItems.yAxis[axisId].getAxisPosition(),
                    axisLabelDistance: parseInt(dataAdapter.widget.chartItems.yAxis[axisId].getAxisLabelDistance(), 10),
                    minZoomLevel: dataAdapter.widget.getMinZoomLevel() / 100,
                    maxZoomLevel: dataAdapter.widget.getMaxZoomLevel() / 100,
                    format: dataAdapter.widget.chartItems.yAxis[axisId].currentFormat(),
                    type: 'number'
                }
            };

            xOffsetRight -= (dataAdapter.yAxisAreas[axisId].info.position === 'right') ? yAxisSize : 0;

            dataAdapter.yAxisAreas[axisId].x = (dataAdapter.yAxisAreas[axisId].info.position === 'left') ? xOffsetLeft : xOffsetRight;

            xOffsetLeft += (dataAdapter.yAxisAreas[axisId].info.position === 'left') ? yAxisSize : 0;

            dataAdapter.yScales[axisId] = d3.scale.linear();
            dataAdapter.yAxisAreas[axisId].scale = dataAdapter.yScales[axisId];
        }

        // X-Axes
        for (axisId in dataAdapter.widget.chartItems.xAxis) {

            xAxisWidget = dataAdapter.widget.chartItems.xAxis[axisId];

            xAxisSize = parseInt(xAxisWidget.settings.height, 10);
            dataAdapter.xAxisAreas[axisId] = {
                id: axisId,
                x: xOffsetLeft,
                width: xOffsetRight - xOffsetLeft,
                height: xAxisSize,
                info: {
                    position: xAxisWidget.getAxisPosition(),
                    axisLabelDistance: parseInt(xAxisWidget.getAxisLabelDistance(), 10),
                    minZoomLevel: dataAdapter.widget.getMinZoomLevel() / 100,
                    maxZoomLevel: dataAdapter.widget.getMaxZoomLevel() / 100
                }
            };

            yOffsetBottom -= (dataAdapter.xAxisAreas[axisId].info.position === 'bottom') ? xAxisSize : 0;

            dataAdapter.xAxisAreas[axisId].y = (dataAdapter.xAxisAreas[axisId].info.position === 'bottom') ? yOffsetBottom : yOffsetTop;

            yOffsetTop += (dataAdapter.xAxisAreas[axisId].info.position === 'top') ? xAxisSize : 0;

            xAxisMinValue = dataAdapter.widget.chartItems.xAxis[axisId]._getMinValue();

            switch (xAxisWidget._getAxisType()) {

                case 'dateTime':
                    dataAdapter.xScales[axisId] = d3.time.scale();
                    break;

                case 'index':
                case 'secondsAsNumber':
                    dataAdapter.xScales[axisId] = d3.scale.linear();
                    break;
            }
            //dataAdapter.xScales[axisId] = (typeof xAxisMinValue === 'object') ? d3.time.scale() : d3.scale.linear();;
            dataAdapter.xAxisAreas[axisId].scale = dataAdapter.xScales[axisId];
        }

        // Y-Axes (y positioning)
        for (axisId in dataAdapter.widget.chartItems.yAxis) {
            dataAdapter.yAxisAreas[axisId].y = yOffsetTop;
            dataAdapter.yAxisAreas[axisId].height = yOffsetBottom - yOffsetTop;
        }

        // Chart Area
        dataAdapter.chartArea = {
            x: xOffsetLeft,
            y: yOffsetTop,
            width: xOffsetRight - xOffsetLeft,
            height: yOffsetBottom - yOffsetTop
        };

        // Cursor area - Position with respect to the graph area
        for (xCursorId in dataAdapter.widget.chartItems.xCursors) {
            var cursorWidget = dataAdapter.widget.chartItems.xCursors[xCursorId];

            dataAdapter.xAxisCursorAreas[xCursorId] = {
                id: xCursorId,
                xCursor: dataAdapter.widget.chartItems.xCursors[xCursorId].getValue(),
                yValues: [],
                yValueAxes: [],
                active: false,
                x: -dataAdapter.settings.cursorAreaWidth / 2 + dataAdapter.xAxisAreas[cursorWidget.axisWidget.elem.id].scale(cursorWidget._getValue()),
                y: 0,
                width: dataAdapter.settings.cursorAreaWidth,
                height: dataAdapter.chartArea.height,
                maxAvailableXPositionIndex: cursorWidget._getMaxDrawnXSampleIndex()
                //markerRadius: 
            };

            for (var graphId in dataAdapter.widget.chartItems.xCursors[xCursorId].graphWidgets) {
                dataAdapter.xAxisCursorAreas[xCursorId].yValues[graphId] = dataAdapter.widget.chartItems.xCursors[xCursorId].graphWidgets[graphId].getCursorValue();
                dataAdapter.xAxisCursorAreas[xCursorId].yValueAxes[graphId] = dataAdapter.widget.chartItems.yValues[graphId].axisWidget.elem.id;
            }
        }
    }

    function _updateScales(dataAdapter) {

        var axisId,
            xAxisMinValue,
            xAxisMaxValue,
            yAxisMinValue,
            yAxisMaxValue;

        for (axisId in dataAdapter.yAxisAreas) {

            yAxisMinValue = dataAdapter.widget.chartItems.yAxis[axisId].minimum();
            yAxisMaxValue = dataAdapter.widget.chartItems.yAxis[axisId].maximum();

            if (yAxisMinValue === yAxisMaxValue) {
                if (yAxisMinValue !== 0) {
                    yAxisMinValue = yAxisMinValue * 0.9;
                    yAxisMaxValue = yAxisMaxValue * 1.1;
                } else {
                    yAxisMinValue = -1;
                    yAxisMaxValue = 1;
                }
            }

            dataAdapter.yScales[axisId] = d3.scale.linear()
                .domain([
                    yAxisMinValue,
                    yAxisMaxValue])
                .range([
                    dataAdapter.yAxisAreas[axisId].height,
                    0]);

            dataAdapter.yAxisAreas[axisId].scale = dataAdapter.yScales[axisId];
            dataAdapter.yAxisAreas[axisId].info.format = dataAdapter.widget.chartItems.yAxis[axisId].currentFormat();
        }

        for (axisId in dataAdapter.xAxisAreas) {

            var xAxisWidget = dataAdapter.widget.chartItems.xAxis[axisId];

            xAxisMinValue = xAxisWidget._getMinValue();
            xAxisMaxValue = xAxisWidget._getMaxValue();

            switch (xAxisWidget._getAxisType()) {
                case 'dateTime':
                    dataAdapter.xScales[axisId] = d3.time.scale();
                    dataAdapter.xAxisAreas[axisId].info.type = xAxisWidget._getAxisType();
                    break;

                case 'index':
                case 'secondsAsNumber':
                    dataAdapter.xScales[axisId] = d3.scale.linear();
                    dataAdapter.xAxisAreas[axisId].info.type = xAxisWidget._getAxisType();
                    break;
            }

            dataAdapter.xAxisAreas[axisId].info.format = dataAdapter.widget.chartItems.xAxis[axisId].currentFormat();

            dataAdapter.xScales[axisId]
                .domain([xAxisMinValue, xAxisMaxValue])
                .range([0, dataAdapter.xAxisAreas[axisId].width]);

            dataAdapter.xAxisAreas[axisId].scale = dataAdapter.xScales[axisId];
        }

        _updateGraphData(dataAdapter);
    }

    function _updateGraphData(dataAdapter) {

        var valueWidget,
            yAxisWidgetId,
            xAxisWidgetId;

        for (var i = 0; i < dataAdapter.graphs.length; i += 1) {

            valueWidget = dataAdapter.widget.chartItems.yValues[dataAdapter.graphs[i].id];

            yAxisWidgetId = valueWidget.axisWidget.elem.id;
            xAxisWidgetId = valueWidget.xAxisWidget.elem.id;

            dataAdapter.graphs[i].yScale = dataAdapter.yScales[yAxisWidgetId];
            dataAdapter.graphs[i].xScale = dataAdapter.xScales[xAxisWidgetId];
            dataAdapter.graphs[i].coordinates = valueWidget._coordinates();
            dataAdapter.graphs[i].interpolationType = valueWidget.getInterpolationType();
        }
    }

    function _updateCursor(dataAdapter) {

        for (var xCursorId in dataAdapter.widget.chartItems.xCursors) {

            var cursorWidget = dataAdapter.widget.chartItems.xCursors[xCursorId];

            dataAdapter.xAxisCursorAreas[xCursorId].xCursor = cursorWidget._getValue();
            dataAdapter.xAxisCursorAreas[xCursorId].active = cursorWidget._getActive();
            dataAdapter.xAxisCursorAreas[xCursorId].x = -dataAdapter.settings.cursorAreaWidth / 2 + dataAdapter.xAxisAreas[cursorWidget.axisWidget.elem.id].scale(cursorWidget._getValue());
            dataAdapter.xAxisCursorAreas[xCursorId].y = 0;
            dataAdapter.xAxisCursorAreas[xCursorId].width = dataAdapter.settings.cursorAreaWidth;

            for (var graphId in dataAdapter.widget.chartItems.xCursors[xCursorId].graphWidgets) {
                dataAdapter.xAxisCursorAreas[xCursorId].yValues[graphId] = dataAdapter.widget.chartItems.xCursors[xCursorId].graphWidgets[graphId]._getIntersectionValue(cursorWidget._getValue(), cursorWidget._getActive());
                dataAdapter.xAxisCursorAreas[xCursorId].yValueAxes[graphId] = dataAdapter.widget.chartItems.yValues[graphId].axisWidget.elem.id;
            }
            dataAdapter.xAxisCursorAreas[xCursorId].maxAvailableXPositionIndex = cursorWidget._getMaxDrawnXSampleIndex();
        }
    }

    function _updateZoomLevelLimits(dataAdapter) {

        // update y-axes
        for (var axisId in dataAdapter.widget.chartItems.yAxis) {

            dataAdapter.yAxisAreas[axisId].info.minZoomLevel = dataAdapter.widget.getMinZoomLevel() / 100;
            dataAdapter.yAxisAreas[axisId].info.maxZoomLevel = dataAdapter.widget.getMaxZoomLevel() / 100;
        }

        // update x-axes
        for (axisId in dataAdapter.widget.chartItems.xAxis) {

            dataAdapter.xAxisAreas[axisId].info.minZoomLevel = dataAdapter.widget.getMinZoomLevel() / 100;
            dataAdapter.xAxisAreas[axisId].info.maxZoomLevel = dataAdapter.widget.getMaxZoomLevel() / 100;
        }
    }

    return ModuleClass;
});
