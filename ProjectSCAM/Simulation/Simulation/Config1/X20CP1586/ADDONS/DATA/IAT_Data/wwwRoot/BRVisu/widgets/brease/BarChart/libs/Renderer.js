/*global _, createjs,brease*/
define(['brease/core/Class', 'brease/events/BreaseEvent','libs/d3/d3','brease/core/Types','brease/core/Utils','brease/enum/Enum'],function (SuperClass, BreaseEvent, d3, Types, Utils, Enum) {
    /*jshint validthis:true,white:false */
    'use strict';

    var	renderer = SuperClass.extend(function renderer(settings) {

	    SuperClass.call(this);
	    this.settings = settings;
	    this.settings.margin = {
	        top: 30,
	        left: 0,
	        bottom: 0,
	        right: 30
	    };
	    this.initialize();
	}, null),

	p = renderer.prototype;

    p.initialize = function () {

        this.data = {
            bars: [],
            lines: []
        };
        this.info = {
            bars: [],
            lines:[]
        };

        this.updateText = false;

        this.barChartContainer = d3.select('#' + this.settings.id);

        if (this.settings.maxValue === undefined) {
            this.settings.maxValue = 100;
        }
        if (this.settings.minValue === undefined) {
            this.settings.minValue = 0;
        }

        this._createXAxis(this);
        this._createYAxis(this);
        this._createUnitText(this);
        this._createGridAxis(this);
        this.setChartMargin(this.settings.chartMargin);
    };

    p.setBar = function (bar) {
        if (bar !== undefined) {
            if (this.info.bars.indexOf(bar.id) === -1) {
                this._addBarEntry(this, bar);
                this._updateAxis(this);
            } else {
                this._updateBarEntry(this, bar);
            }
        }

        if (this.updateText) {
            this._updateAxis(this);
            this.updateText = false;
        }

        this._updateBars(this);
    };

    p.removeBar = function (id) {
        if (this.info.bars.indexOf(id) !== -1) {
            this._removeBarEntry(this, id);
            this._updateAxis(this);
            this._updateBars(this);
        }
    };

    p.setLine = function (line) {
        if (line !== undefined) {
            if (this.info.lines.indexOf(line.id) === -1) {
                this._addLineEntry(this, line);
            } else {
                this._updateLineEntry(this, line);
            }
        }
        this._updateLine(this);
    };

    p.removeLine = function (id) {
        if (this.info.lines.indexOf(id) !== -1) {
            this._removeLineEntry(id);
        }
    };

    p.setMaxValue = function (maxValue) {
        var renderer = this,
            settings = this.settings;
        settings.maxValue = maxValue;

        if (settings.minValue === undefined) {
            settings.minValue = 0;
        }

        if (settings.orientation === Enum.Orientation.BTT) {
            this.scaleY.domain([settings.maxValue, settings.minValue]);
            this.axisYElement.call(renderer.axisY);
            this.gridYAxisElement.call(renderer.gridYAxis);
        } else {
            this.scaleX.domain([settings.minValue, settings.maxValue]);
            this.axisXElement.call(renderer.axisX);
            this.gridXAxisElement.call(renderer.gridXAxis);
        }
        this._updateLine(this);
    };

    p.setMinValue = function (minValue) {
        var renderer = this,
            settings = this.settings;
        settings.minValue = minValue;

        if (settings.maxValue === undefined) {
            settings.maxValue = 0;
        }

        if (settings.orientation === Enum.Orientation.BTT) {
            this.scaleY.domain([settings.maxValue, settings.minValue]);
            this.axisYElement.call(renderer.axisY);
            this.gridYAxisElement.call(renderer.gridYAxis);
        } else {
            this.scaleX.domain([settings.minValue, settings.maxValue]);
            this.axisXElement.call(renderer.axisX);
            this.gridXAxisElement.call(renderer.gridXAxis);
        }
        this._updateLine(this);
    };

    p.setBarPadding = function (barPadding) {
        this.settings.barPadding = barPadding;
        this._updateAxis(this);
        this._updateBars(this);
    };

    p.setUnitSymbol = function (unitSymbol) {
        if (Utils.isString(unitSymbol)) {
            this.settings.unitSymbol = unitSymbol;
            this.axisUnitText.text(unitSymbol);
        }
    };

    p.setShowValue = function (value) {
        this.settings.showValue = value;
        this._updateBars(this);
    };

    p.setOrientation = function (orientation) {
        this.settings.orientation = orientation;
        this.redraw();
    };

    p.setIdList = function (childrenIds, childrenWidgets) {
        var lineIds = [], barIds = [];

        childrenWidgets.forEach(function (widget, index) {
            if (widget.el.attr('data-brease-widget') === 'widgets/brease/BarChartItem') {
                barIds.push(childrenIds[index]);
            } else if (widget.el.attr('data-brease-widget') === 'widgets/brease/BarChartThreshold') {
                lineIds.push(childrenIds[index]);
            }
        });

        this.setBarIdList(barIds);
        this.setLineIdList(lineIds);
    };

    p.setBarIdList = function (barIdList) {
        this.settings.barIdList = barIdList;
    };

    p.setLineIdList = function (lineIdList) {
        this.settings.lineIdList = lineIdList;
    };

    p.setSize = function (height, width) {
        if (height !== undefined) {
            this.settings.height = height;
        }
        if (width !== undefined) {
            this.settings.width = width;
        }
        this.redraw();
    };

    p.setTransitionTime = function (time) {
        this.settings.transitionTime = time;
    };

    p.setNumberFormat = function (numberFormat) {
        this.settings.numberFormat = numberFormat;
        this.redraw();
    };

    p.getNumberFormat = function () {
        return this.settings.numberFormat;
    };

    p.setXAxisHeight = function (xAxisHeight) {
        this.settings.xAxisHeight = xAxisHeight;
        this.redraw();
    };

    p.setYAxisWidth = function (yAxisWidth) {
        this.settings.yAxisWidth = yAxisWidth;
        this.redraw();
    };

    p.setChartMargin = function (chartMargin) {

        var pixValString = '', pixValStringArray = [], pixValIntArray = [];

        if (typeof chartMargin === 'string') {
            pixValString = chartMargin;
        } else {
            return;
        }
        pixValStringArray = pixValString.split(' ');
        for (var i = 0; i < pixValStringArray.length; i += 1) {
            pixValIntArray[i] = parseInt(pixValStringArray[i], 10);
        }

        switch (pixValStringArray.length) {
            case 1:
                this.settings.margin = { top: pixValIntArray[0], right: pixValIntArray[0], bottom: pixValIntArray[0], left: pixValIntArray[0] };
                break;
            case 2:
                this.settings.margin = { top: pixValIntArray[0], right: pixValIntArray[1], bottom: pixValIntArray[0], left: pixValIntArray[1] };
                break;
            case 4:
                this.settings.margin = { top: pixValIntArray[0], right: pixValIntArray[1], bottom: pixValIntArray[2], left: pixValIntArray[3] };
                break;
            default:
                this.settings.margin = { top: 30, right: 30, bottom: 0, left: 0 };
        }
        this.redraw();
    };

    p.redraw = function () {
        this.barChartContainer.selectAll('g').filter(':not(.barWidget)').filter(':not(.lineWidget)').remove();
        this.barChartContainer.selectAll('.unitText').remove();
        this._createXAxis(this);
        this._createYAxis(this);
        this._createGridAxis(this);
        this._createUnitText(this);
        this._updateAxis(this);
        this._updateLine(this);
        this._updateBars(this);
        this.reposition();
    };

    p.reposition = function () {
        var yAxis = this.settings.el.find('.yAxis'),
            thresholds = this.settings.el.find('.lineWidget').detach();

        thresholds.insertAfter(yAxis);
    };
    //PRIVATE FUNCTIONS

    p._createYAxis = function (renderer) {
        if (renderer.settings.orientation === Enum.Orientation.BTT) {
            renderer.scaleY = d3.scale.linear()
                                  .domain([renderer.settings.maxValue, renderer.settings.minValue])
                                  .range([renderer.settings.margin.top, (parseInt(renderer.settings.height) - renderer.settings.xAxisHeight - renderer.settings.margin.bottom)]);
        } else {
            renderer.scaleY = d3.scale.ordinal()
                                    .domain([])
                                    .rangeRoundBands([renderer.settings.margin.top, (parseInt(renderer.settings.height) - renderer.settings.xAxisHeight - renderer.settings.margin.bottom)], (renderer.settings.barPadding / 100));
        }
        renderer.axisY = d3.svg.axis()
                                .scale(renderer.scaleY)
                                .orient('left');
        renderer.axisYElement = renderer.barChartContainer.insert('g', '.barWidget')
                                            .attr('class', 'yAxis')
                                            .attr('transform', 'translate(' + (parseInt(renderer.settings.yAxisWidth) + renderer.settings.margin.left) + ',0)')
                                            .call(renderer.axisY);
    };

    p._createXAxis = function (renderer) {
        if (renderer.settings.orientation === Enum.Orientation.BTT) {
            renderer.scaleX = d3.scale.ordinal()
                                    .domain([])
                                    .rangeRoundBands([renderer.settings.yAxisWidth + renderer.settings.margin.left, (parseInt(renderer.settings.width) - renderer.settings.margin.right)], (renderer.settings.barPadding / 100));
        } else {
            renderer.scaleX = d3.scale.linear()
                                    .domain([renderer.settings.minValue, renderer.settings.maxValue])
                                    .range([renderer.settings.yAxisWidth + renderer.settings.margin.left, (parseInt(renderer.settings.width) - renderer.settings.margin.right)]);
        }
        renderer.axisX = d3.svg.axis()
                                .scale(renderer.scaleX)
                                .orient('bottom');

        renderer.axisXElement = renderer.barChartContainer.insert('g', '.barWidget')
                                            .attr('class', 'xAxis')
                                            .attr('transform', 'translate(0,' + (parseInt(renderer.settings.height) - renderer.settings.xAxisHeight - renderer.settings.margin.bottom) + ')')
                                            .call(renderer.axisX);
    };

    p._createUnitText = function (renderer) {
        if (renderer.settings.orientation === Enum.Orientation.BTT) {
            renderer.axisUnitText = renderer.axisYElement.append('text')
                                                    .attr('class', 'unitText')
                                                    .attr('text-anchor', 'middle')
                                                    .attr('transform', 'translate(-10,13)')
                                                    .text(renderer.settings.unitSymbol);
        } else {
            renderer.axisUnitText = renderer.axisXElement.append('text')
                                                    .attr('class', 'unitText')
                                                    .attr('text-anchor', 'middle')
                                                    .attr('transform', 'translate(' + (renderer.settings.width - renderer.settings.margin.right + 15) + ',3)')
                                                    .text(renderer.settings.unitSymbol);
        }
    };

    p._createGridAxis = function (renderer) {
        if (renderer.settings.orientation === Enum.Orientation.BTT) {
            renderer.gridYAxis = d3.svg.axis()
                           .scale(renderer.scaleY)
                           .orient('left')
                           .innerTickSize(-renderer.settings.width + renderer.settings.yAxisWidth + renderer.settings.margin.left + renderer.settings.margin.right);

            renderer.gridYAxisElement = renderer.barChartContainer.insert('g', '.xAxis')
                                                 .attr('class', 'yAxisGrid')
                                                 .attr('transform', 'translate(' + (parseInt(renderer.settings.yAxisWidth) + renderer.settings.margin.left) + ',0)')
                                                 .call(renderer.gridYAxis);
        } else {
            renderer.gridXAxis = d3.svg.axis()
                                    .scale(renderer.scaleX)
                                    .orient('bottom')
                                    .innerTickSize(-renderer.settings.height + renderer.settings.xAxisHeight + renderer.settings.margin.top + renderer.settings.margin.bottom);

            renderer.gridXAxisElement = renderer.barChartContainer.insert('g', '.xAxis')
                                                .attr('class', 'xAxisGrid')
                                                .attr('transform', 'translate(0,' + (parseInt(renderer.settings.height) - renderer.settings.xAxisHeight - renderer.settings.margin.bottom) + ')')
                                                .call(renderer.gridXAxis);
        }
    };

    p._addBarEntry = function (renderer, data) {
        renderer.info.bars.push(data.id);
        this._sortEntries();

        var index = renderer.info.bars.indexOf(data.id),
            obj = { text: data.text, value: data.value, id: data.id };

        renderer.data.bars.splice(index, 0, obj);
    };

    p._removeBarEntry = function (renderer, id) {
        var index = renderer.info.bars.indexOf(id);
        if (index !== -1) {
            renderer.info.bars.splice(index, 1);
            renderer.data.bars.splice(index, 1);
        }
    };

    p._updateBarEntry = function (renderer, data) {
        var index = renderer.info.bars.indexOf(data.id);

        if (renderer.data.bars[index].text !== data.text) {
            renderer.updateText = true;
        }

        renderer.data.bars[index] = {
            text: data.text,
            value: data.value,
            id: data.id
        };
    };

    p._sortEntries = function () {
        var renderer = this;
        this.info.bars.sort(function (a, b) {
            return renderer.settings.barIdList.indexOf(a) - renderer.settings.barIdList.indexOf(b);
        });
    };

    p._addLineEntry = function (renderer, data) {
        renderer.info.lines.push(data.id);
        renderer.info.lines.sort(function (a, b) {
            return renderer.settings.lineIdList.indexOf(a) - renderer.settings.lineIdList.indexOf(b);
        });

        var index = renderer.info.lines.indexOf(data.id),
            obj = { value: data.value, id: data.id, window: data.window };

        renderer.data.lines.splice(index, 0, obj);
    };

    p._removeLineEntry = function ( id) {
        var index = this.info.lines.indexOf(id);
        if (index !== -1) {
            this.info.lines.splice(index, 1);
            this.data.lines.splice(index, 1);
        }
    };

    p._updateLineEntry = function (renderer, data) {
        var index = renderer.info.lines.indexOf(data.id);

        renderer.data.lines[index] = {
            value: data.value,
            id: data.id,
            window: data.window
        };
    };

    p._updateAxis = function (renderer) {

        var size, factor, text = [];

        renderer.data.bars.forEach(function (data) {
            text.push(data.text);
        });

        if (renderer.settings.orientation === Enum.Orientation.BTT) {
            size = (renderer.settings.width - renderer.settings.margin.right) - renderer.settings.yAxisWidth - renderer.settings.margin.left;
            factor = renderer.settings.barPadding / (size / renderer.data.bars.length);
            renderer.scaleX.domain(d3.range(0, text.length)).rangeRoundBands([renderer.settings.yAxisWidth + renderer.settings.margin.left, (parseInt(renderer.settings.width) - renderer.settings.margin.right)], factor);
            renderer.axisX.tickFormat(function (d, i) { return text[i]; });
            renderer.axisXElement.call(renderer.axisX);
            renderer.gridYAxisElement.call(renderer.gridYAxis);
        } else {
            size = (renderer.settings.height - renderer.settings.xAxisHeight) - renderer.settings.margin.top - renderer.settings.margin.bottom;
            factor = renderer.settings.barPadding / (size / renderer.data.bars.length);
            renderer.scaleY.domain(d3.range(0, text.length)).rangeRoundBands([renderer.settings.margin.top, (parseInt(renderer.settings.height) - renderer.settings.xAxisHeight - renderer.settings.margin.bottom)], factor);
            renderer.axisY.tickFormat(function (d, i) { return text[i]; });
            renderer.axisYElement.call(renderer.axisY);
            renderer.gridXAxisElement.call(renderer.gridXAxis);
        }
    };

    p._updateBars = function (renderer) {

        renderer.barChartContainer.selectAll('g.barWidget.visible defs rect')
                .data(renderer.data.bars)
                .transition()
                .duration(renderer.settings.transitionTime)
                .attr('x', function (d, i) {
                    return (renderer.settings.orientation === Enum.Orientation.BTT) ? renderer.scaleX(i) : renderer.scaleX(Math.min(Math.max(0, renderer.settings.minValue), d.value));
                })
                .attr('y', function (d, i) {
                    return (renderer.settings.orientation === Enum.Orientation.BTT) ? renderer.scaleY(Math.max(Math.max(0, renderer.settings.minValue), d.value)) : renderer.scaleY(i);
                })
                .attr('width', function (d) {
                    return (renderer.settings.orientation === Enum.Orientation.BTT) ? renderer.scaleX.rangeBand() : Math.abs(renderer.scaleX(d.value) - renderer.scaleX(Math.max(0, renderer.settings.minValue)));
                })
                .attr('height', function (d) {
                    return (renderer.settings.orientation === Enum.Orientation.BTT) ? Math.abs(renderer.scaleY(d.value) - renderer.scaleY(Math.max(0, renderer.settings.minValue))) : renderer.scaleY.rangeBand();
                });

        renderer.barChartContainer.selectAll('g.barWidget.visible > rect')
                .data(renderer.data.bars)
                .transition()
                .duration(renderer.settings.transitionTime)
                .attr('x', function (d, i) {
                    return (renderer.settings.orientation === Enum.Orientation.BTT) ? renderer.scaleX(i) : renderer.scaleX(Math.min(Math.max(0, renderer.settings.minValue), d.value));
                })
                .attr('y', function (d, i) {
                    return (renderer.settings.orientation === Enum.Orientation.BTT) ? renderer.scaleY(Math.max(Math.max(0, renderer.settings.minValue), d.value)) : renderer.scaleY(i);
                })
                .attr('width', function (d) {
                    return (renderer.settings.orientation === Enum.Orientation.BTT) ? renderer.scaleX.rangeBand() : Math.abs(renderer.scaleX(d.value) - renderer.scaleX(Math.max(0, renderer.settings.minValue)));
                })
                .attr('height', function (d) {
                    return (renderer.settings.orientation === Enum.Orientation.BTT) ? Math.abs(renderer.scaleY(d.value) - renderer.scaleY(Math.max(0, renderer.settings.minValue))) : renderer.scaleY.rangeBand();
                })
				.attr('clip-path', function (d) {
				    return ('url(' + document.location.pathname + document.location.search + '#' + d.id + '_clipPath)');
				});

        renderer.barChartContainer.selectAll('g.barWidget.visible > text')
                .data(renderer.data.bars)
                .transition()
                .duration(renderer.settings.transitionTime)
                .attr('text-anchor', function (d) {
                    return renderer._calculateTextAnchor(renderer, d);
                })
                .attr('dominant-baseline', function (d) {
                    return renderer._calculateDominantBaseline(renderer, d);
                })
                .attr('x', function (d, i) {
                    return (renderer.settings.orientation === Enum.Orientation.BTT) ? renderer.scaleX(i) + (renderer.scaleX.rangeBand() / 2) : renderer._calculateTextOffsetX(renderer, d);
                })
                .attr('y', function (d, i) {
                    return (renderer.settings.orientation === Enum.Orientation.BTT) ? renderer._calculateTextOffsetY(renderer, d) : renderer.scaleY(i) + (renderer.scaleY.rangeBand() / 2);
                })
                .text(function (d) {
                    if (typeof d.id !== 'undefined') {
                        d.value = brease.callWidget(d.id, 'getValue');
                    }
                    d.value = brease.formatter.formatNumber(d.value, renderer.getNumberFormat());
                    return renderer.settings.showValue ? d.value : '';
                });
    };

    p._updateLine = function (renderer) {

        renderer.barChartContainer.selectAll('g.lineWidget.visible > line.valueLine').filter(':not(.limitTop)').filter(':not(.limitBottom)')
                .data(renderer.data.lines)
                .transition()
                .duration(renderer.settings.transitionTime)
                .attr('x1', function (d) {
                    return (renderer.settings.orientation === Enum.Orientation.BTT) ? renderer.settings.yAxisWidth : renderer.scaleX(Math.max(Math.max(0, renderer.settings.minValue), d.value));
                })
                .attr('x2', function (d) {
                    return (renderer.settings.orientation === Enum.Orientation.BTT) ? (renderer.settings.width - renderer.settings.margin.right) : renderer.scaleX(Math.max(Math.max(0, renderer.settings.minValue), d.value));
                })
                .attr('y1', function (d) {
                    return (renderer.settings.orientation === Enum.Orientation.BTT) ? renderer.scaleY(Math.max(Math.max(0, renderer.settings.minValue), d.value)) : renderer.settings.margin.top;
                })
                .attr('y2', function (d) {
                    return (renderer.settings.orientation === Enum.Orientation.BTT) ? renderer.scaleY(Math.max(Math.max(0, renderer.settings.minValue), d.value)) : (renderer.settings.height - renderer.settings.xAxisHeight);
                });


        renderer.barChartContainer.selectAll('g.lineWidget.visible > line.limitTop')
                .data(renderer.data.lines)
                .transition()
                .duration(renderer.settings.transitionTime)
                .attr('x1', function (d) {
                    return (renderer.settings.orientation === Enum.Orientation.BTT) ? renderer.settings.yAxisWidth : renderer.scaleX(d.value + d.window);
                })
                .attr('x2', function (d) {
                    return (renderer.settings.orientation === Enum.Orientation.BTT) ? (renderer.settings.width - renderer.settings.margin.right) : renderer.scaleX(d.value + d.window);
                })
                .attr('y1', function (d) {
                    return (renderer.settings.orientation === Enum.Orientation.BTT) ? renderer.scaleY(d.value + d.window) : renderer.settings.margin.top;
                })
                .attr('y2', function (d) {
                    return (renderer.settings.orientation === Enum.Orientation.BTT) ? renderer.scaleY(d.value + d.window) : (renderer.settings.height - renderer.settings.xAxisHeight);
                });

        renderer.barChartContainer.selectAll('g.lineWidget.visible > line.limitBottom')
                .data(renderer.data.lines)
                .transition()
                .duration(renderer.settings.transitionTime)
                .attr('x1', function (d) {
                    return (renderer.settings.orientation === Enum.Orientation.BTT) ? renderer.settings.yAxisWidth : renderer.scaleX(d.value - d.window);
                })
                .attr('x2', function (d) {
                    return (renderer.settings.orientation === Enum.Orientation.BTT) ? (renderer.settings.width - renderer.settings.margin.right) : renderer.scaleX(d.value - d.window);
                })
                .attr('y1', function (d) {
                    return (renderer.settings.orientation === Enum.Orientation.BTT) ? renderer.scaleY(d.value - d.window) : renderer.settings.margin.top;
                })
                .attr('y2', function (d) {
                    return (renderer.settings.orientation === Enum.Orientation.BTT) ? renderer.scaleY(d.value - d.window) : (renderer.settings.height - renderer.settings.xAxisHeight);
                });

        renderer.barChartContainer.selectAll('g.lineWidget.visible > rect')
                .data(renderer.data.lines)
                .transition()
                .duration(renderer.settings.transitionTime)
                .attr('x', function (d) {
                    return (renderer.settings.orientation === Enum.Orientation.BTT) ? renderer.settings.yAxisWidth : renderer.scaleX(d.value - d.window);
                })
                .attr('width', function (d) {
                    return (renderer.settings.orientation === Enum.Orientation.BTT) ? (renderer.settings.width - renderer.settings.margin.right - renderer.settings.yAxisWidth) : renderer.scaleX(d.value + d.window) - renderer.scaleX(d.value - d.window);
                })
                .attr('y', function (d) {
                    return (renderer.settings.orientation === Enum.Orientation.BTT) ? renderer.scaleY(d.value + d.window) : renderer.settings.margin.top;
                })
                .attr('height', function (d) {
                    return (renderer.settings.orientation === Enum.Orientation.BTT) ? renderer.scaleY(d.value - d.window) - renderer.scaleY(d.value + d.window) : renderer.settings.height - renderer.settings.xAxisHeight - renderer.settings.margin.top;
                });

    };

    p._calculateDominantBaseline = function (renderer, data) {
        if (renderer.settings.orientation === Enum.Orientation.BTT) {
            if (data.value >= 0) {
                return 'ideographic';
            } else {
                return 'text-before-edge';
            }
        } else {
            return 'central';
        }
    };

    p._calculateTextAnchor = function (renderer, data) {
        if (renderer.settings.orientation === Enum.Orientation.BTT) {
            return 'middle';
        } else {
            if (data.value < 0) {
                return 'end';
            } else {
                return 'start';
            }
        }
    };

    p._calculateTextOffsetY = function (renderer, data) {
        if (data.value >= 0) {
            return renderer.scaleY(Math.max(0, data.value)) - 5;
        } else {
            return renderer.scaleY(data.value) + 15;
        }
    };

    p._calculateTextOffsetX = function (renderer, data) {
        if (data.value >= 0) {
            return renderer.scaleX(Math.max(0, data.value)) + 5;
        } else {
            return renderer.scaleX(data.value) - 5;
        }
    };

    return renderer;
});