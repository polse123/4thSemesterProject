/*global brease*/
define(function (require) {

    'use strict';

    /**
    * @class widgets.brease.common.libs.EditorGrid
    * #Description
    * Provide functionality for container widgets using a grid in the editor
    * @extends brease.core.Class
    *
    * @iatMeta studio:visible
    * false
    */

    var SuperClass = require('brease/core/Class'),
        d3 = require('libs/d3/d3'),
        globalize = require('globalize'),
        ChartUtils = require("widgets/brease/common/libs/ChartUtils"),

    defaultSettings = {
    },

    ModuleClass = SuperClass.extend(function EditorGrid(widget, configuration) {
        SuperClass.call(this);
        this.widget = widget;
        if(!configuration.mainContainer) {
            this.parentWidget = brease.callWidget(widget.el.parents(':eq(1)')[0].id, 'widget');
            this.areas = (this.parentWidget) ? this.parentWidget.editorGrid.areas : null;
        }
        this.children = {};
        this.configuration = configuration;
	    this.init();
    }, defaultSettings),

	p = ModuleClass.prototype;

    p.init = function () {
        this.widget.el.on("widget_added", this._bind('childrenAdded'));
        this.widget.el.on("widget_removed", this._bind('childrenRemoved'));
    };

    p.dispose = function () {
        this.widget.el.off("widget_added", this._bind('childrenAdded'));
        this.widget.el.off("widget_removed", this._bind('childrenRemoved'));
    };

    p.childrenAdded = function (event) {
        if (event.target === this.widget.elem) {
            var widgetId = event.detail.widgetId,
                widget = brease.callWidget(widgetId, 'widget');
            if (!this.children.hasOwnProperty(widgetId)) {
                this.children[widgetId] = widget;
            }
        }
    };

    p.childrenRemoved = function (event) {
        if (event.target === this.widget.elem) {
            var widgetId = event.detail.widgetId;
            if (this.children.hasOwnProperty(widgetId)) {
                delete this.children[widgetId];
            }
        }
    };

    p.createLayout = function () {
        var editorGrid = this;

        this.areas = {
            left: $("<div class='container areaLeft'></div>"),
            right: $("<div class='container areaRight'></div>"),
            graph: $("<div class='container areaGraph'></div>")
        };

        switch (editorGrid.configuration.layout) {
            case "2Areas":
                editorGrid.leftAreaSize = 0;
                editorGrid.widget.el.append(this.areas.left);
                this.areas.right.append(this.areas.graph);
                editorGrid.widget.el.append(this.areas.right);
                break;

            case "5Areas":
                this.areas.center = $("<div class='container areaCenter'></div>");
                this.areas.top = $("<div class='container areaTop'></div>");
                this.areas.bottom = $("<div class='container areaBottom'></div>");

                editorGrid.leftAreaSize = 0;
                editorGrid.rightAreaSize = 0;
                editorGrid.topAreaHeight = 0;
                editorGrid.bottomAreaHeight = 0;
                editorGrid.actualOrder = 0;

                this.areas.top.css('flex-basis', editorGrid.topAreaHeight);
                this.areas.bottom.css('flex-basis', editorGrid.bottomAreaHeight);

                editorGrid.widget.el.append(this.areas.left);
                this.areas.center.append(this.areas.top);
                this.areas.center.append(this.areas.graph);
                this.areas.center.append(this.areas.bottom);
                editorGrid.widget.el.append(this.areas.center);
                editorGrid.widget.el.append(this.areas.right);
                break;
        }
    };

    p.createAxis = function () {
        var editorGrid = this,
            axisConfiguration = {};
        axisConfiguration = _calculateAxisConfiguration(editorGrid);
        editorGrid.scaleContainer = d3.select(editorGrid.widget.el.get(0))
                                        .append("svg")
                                        .attr("style", "z-index:-1")
                                        .attr("class", "container scaleContainer");
        editorGrid.scale = (editorGrid.widget.editorGrid.configuration.scaleType === 'time') ? d3.time.scale() : d3.scale.linear() ;
        editorGrid.scale.domain(axisConfiguration.domain)
            .range(axisConfiguration.range);
        
        editorGrid.axis = d3.svg.axis()
            .scale(editorGrid.scale)
            .orient(axisConfiguration.orient);

        if (editorGrid.widget.editorGrid.configuration.tickFormat) {
            editorGrid.axis.tickFormat(function (d) {
                return _tickFormat(editorGrid.widget.editorGrid.configuration.tickFormat, d, editorGrid.widget.editorGrid.configuration.scaleType);
            });
        }
        editorGrid.axisElement = editorGrid.scaleContainer.append("g")
                                            .attr("class", "axis")
                                            .attr("id", axisConfiguration.id)
                                            .call(editorGrid.axis);

        var tickLabelSelection = editorGrid.axisElement.selectAll(".tick>text");
        ChartUtils.formatTickLabels(tickLabelSelection, editorGrid.configuration.axisPosition,
            editorGrid.configuration.tickLabelDistance, editorGrid.configuration.tickLabelRotation);

        editorGrid.scaleContainer.append("g")
                .attr("transform", "translate(" +
                    ((editorGrid.widget.elem.className.match(/breaseChartYAxisWidget/)) ? axisConfiguration.axisLabelDistance : (editorGrid.areas.graph.width() / 2)) + ", " +
                    ((editorGrid.widget.elem.className.match(/breaseChartYAxisWidget/)) ? (editorGrid.areas.graph.height() / 2) : axisConfiguration.axisLabelDistance) + ") " +
                    "rotate(" + ((editorGrid.widget.elem.className.match(/breaseChartYAxisWidget/)) ? -90 : 0) + ")")
                .attr("id", axisConfiguration.id + "_axisLabel")
                .attr("class", "containerAxisDescription")
                .append("text")
                .attr("class", "axisDescription")
                .style('text-anchor', 'middle')
                .text(axisConfiguration.axisLabel);
    };

    p.updateAxis = function () {
        var editorGrid = this,
            axisConfiguration = {};
        axisConfiguration = _calculateAxisConfiguration(editorGrid);
        
        editorGrid.scale.domain(axisConfiguration.domain);
        editorGrid.scale.range(axisConfiguration.range);
        editorGrid.axis.orient(axisConfiguration.orient);

        if (axisConfiguration.tickFormat) {
            editorGrid.axis.tickFormat(function (d) {
                return _tickFormat(editorGrid.widget.editorGrid.configuration.tickFormat, d, editorGrid.widget.editorGrid.configuration.scaleType);
            });
        }
        editorGrid.axisElement.call(editorGrid.axis);
        editorGrid.axisElement.attr("transform", "translate(" + axisConfiguration.offsetX + "," + axisConfiguration.offsetY + ")")
                              .call(editorGrid.axis);

        var tickLabelSelection = editorGrid.axisElement.selectAll(".tick>text");
        ChartUtils.formatTickLabels(tickLabelSelection, editorGrid.configuration.axisPosition,
            editorGrid.configuration.tickLabelDistance, editorGrid.configuration.tickLabelRotation);

        editorGrid.scaleContainer.select('.containerAxisDescription')
            .attr("transform", "translate(" +
                    ((editorGrid.widget.elem.className.match(/breaseChartYAxisWidget/)) ? axisConfiguration.axisLabelDistance : (editorGrid.areas.graph.width() / 2)) + ", " +
                    ((editorGrid.widget.elem.className.match(/breaseChartYAxisWidget/)) ? (editorGrid.areas.graph.height() / 2) : axisConfiguration.axisLabelDistance) + ") " + 
                    "rotate(" + ((editorGrid.widget.elem.className.match(/breaseChartYAxisWidget/)) ? -90 : 0) + ")");

        editorGrid.scaleContainer.select('.axisDescription')
            .attr('dy', ((editorGrid.configuration.axisPosition === "left" || editorGrid.configuration.axisPosition === "top") ? '-0.03em' : '0.75em'))
            .text(axisConfiguration.axisLabel);
    };

    p.updateAllChildren = function () {
        //ToBe overwritten
    };
    
    function _calculateAxisConfiguration(editorGrid) {
        var axisConfiguration = {};
        switch (editorGrid.configuration.axisType){
            case 'Vertical':
                axisConfiguration.domain = editorGrid.widget.settings.orientation === 'TopToBottom' ? [0, 100] : [100, 0];
                axisConfiguration.range = (editorGrid.parentWidget.editorGrid.configuration.layout === '5Areas') ? [20, editorGrid.areas.graph.height() - 20] : [20, editorGrid.widget.el.height() - 20];
                axisConfiguration.orient = (editorGrid.configuration.axisPosition === 'right') ? 'right' : 'left';
                axisConfiguration.offsetX = (editorGrid.configuration.offsetX) || ((editorGrid.configuration.axisPosition === 'right') ? 0 : editorGrid.widget.settings.width - 10);
                axisConfiguration.offsetY = (editorGrid.configuration.offsetY) || 0;
                axisConfiguration.axisLabel = editorGrid.configuration.axisLabel || null;
                axisConfiguration.axisLabelDistance = (editorGrid.configuration.offsetX + 1 + (editorGrid.configuration.axisPosition === 'left' ? -1 : 1) * editorGrid.configuration.axisLabelDistance) || 0;
                axisConfiguration.id = editorGrid.widget.elem.id + '_YAxis';


                break;
            case 'Horizontal':
                axisConfiguration.domain = editorGrid.widget.settings.orientation === 'RightToLeft' ? ((editorGrid.widget.editorGrid.configuration.axisDomain) ? editorGrid.widget.editorGrid.configuration.axisDomain : [100, 0]) : (editorGrid.widget.editorGrid.configuration.axisDomain) ? editorGrid.widget.editorGrid.configuration.axisDomain : [0, 100];
                if (axisConfiguration.format) {
                    axisConfiguration.format = (editorGrid.widget.editorGrid.configuration.tickFormat) ? ((editorGrid.widget.editorGrid.configuration.scaleType === 'time') ? d3.time.format(editorGrid.widget.editorGrid.configuration.tickFormat) : d3.format('d')) : d3.format('d');
                }
                axisConfiguration.range = (editorGrid.parentWidget.editorGrid.configuration.layout === '5Areas') ? [20, editorGrid.areas.graph.width() - 20] : [20, editorGrid.widget.el.width() - 20];
                axisConfiguration.orient = (editorGrid.configuration.axisPosition === 'top') ? 'top' : 'bottom';
                axisConfiguration.offsetX = editorGrid.configuration.offsetX || 0;
                axisConfiguration.offsetY = editorGrid.configuration.offsetY || ((editorGrid.configuration.axisPosition === 'top') ? editorGrid.widget.settings.height - 10 : 0);
                axisConfiguration.axisLabel = editorGrid.configuration.axisLabel || null;
                axisConfiguration.axisLabelDistance = editorGrid.configuration.offsetY + 1 +
                    (editorGrid.configuration.axisPosition === 'top' ? -1 : 1) * editorGrid.configuration.axisLabelDistance || 0;
                axisConfiguration.id = editorGrid.widget.elem.id + '_XAxis';
                break;
            default:
                axisConfiguration = undefined;
        }
        return axisConfiguration;
    }

    function _tickFormat(format, d, type) {

        switch (type) {

            case 'time':
                return Globalize.format(d, format);

            case 'number':
                var digits = (format.decimalPlaces === 0) ? format.minimumIntegerDigits : format.minimumIntegerDigits + format.decimalPlaces + 1,
                    numFormat = d3.format("0" + ((d < 0) ? digits + 1 : digits) + "." + format.decimalPlaces + "f");

                return numFormat(d);

            default:
                return d3.format('d');

        }
    }

    return ModuleClass;
});
