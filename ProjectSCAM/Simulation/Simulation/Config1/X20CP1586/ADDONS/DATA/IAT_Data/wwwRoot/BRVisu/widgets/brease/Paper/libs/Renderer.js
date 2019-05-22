define(function (require) {

    'use strict';

    var SuperClass = require('brease/core/Class'),
        d3 = require('libs/d3/d3'),
        Enum = require('brease/enum/Enum'),
        BreaseEvent = require('brease/events/BreaseEvent'),
        Types = require('brease/core/Types'),
        Utils = require('brease/core/Utils'),

    Renderer = SuperClass.extend(function Renderer(widget, settings) {
        SuperClass.call(this);
        this.widget = widget;
        this.settings = settings;
        this.scaleFactor = Utils.getChromeScale(this.widget.elem);
        _addClickBehavior(this);
    }, null),

    p = Renderer.prototype;

    p.updateSVG = function (source, svgData) {
        var widgetID = this.widget.elem.id,
            widgetWidth = this.widget.el.css("width"),
            widgetHeight = this.widget.el.css("height"),
            concatenation,
            fileGroup = $('<g data-source="file">'),
            contentGroup = $('<g data-source="content">'),
            svgContainer,
            existingFileData,
            existingContentData,
            renderer = this;

        if (source === "content") {
            svgContainer = $('#' + widgetID).find('svg.breasePaperSVGContainer');
            existingFileData = svgContainer.find("[data-source='file']").first().clone();
            existingContentData = svgContainer.find("[data-source='content']").first().clone();

            if (existingFileData.length > 0) {
                fileGroup.html(existingFileData.prop('innerHTML'));
                contentGroup.html(svgData);
                concatenation = fileGroup.prop('outerHTML') + contentGroup.prop('outerHTML'); //+ zoomRect;
            }
            else {
                contentGroup.html(svgData);
                concatenation = contentGroup.prop('outerHTML');
            }
            svgContainer.empty();
            svgContainer.append(concatenation);
            $('#' + widgetID).html(svgContainer.prop('outerHTML'));

            _addClipPath(widgetID, widgetWidth, widgetHeight);
            _addZoomBehavior(widgetID, renderer);
        } else if (source === "file") {
            var filePath = svgData;
            _extractSVGFileData(filePath).then(function (extractedData) {

                svgContainer = $('#' + widgetID).find('svg.breasePaperSVGContainer');
                existingFileData = svgContainer.find("[data-source='file']").first().clone();
                existingContentData = svgContainer.find("[data-source='content']").first().clone();

                //svgData = extractedData;

                if (existingContentData.length > 0) {
                    fileGroup.html(extractedData);
                    contentGroup.html(existingContentData.prop('innerHTML'));
                    concatenation = fileGroup.prop('outerHTML') + contentGroup.prop('outerHTML'); //+ zoomRect;
                }
                else {
                    fileGroup.html(extractedData);
                    concatenation = fileGroup.prop('outerHTML');
                }
                svgContainer.empty();
                svgContainer.append(concatenation);
                $('#' + widgetID).html(svgContainer.prop('outerHTML'));

                _addClipPath(widgetID, widgetWidth, widgetHeight);
                _addZoomBehavior(widgetID, renderer);

            });
        }

    };

    p.evalTransform = function (data) {

        data.forEach(function (obj) {

            if (obj.select !== undefined && obj.select !== "" && obj.select !== null) {

                obj.originalSelect = obj.select;
                obj.select = "#" + this.widget.el[0].id + " svg " + obj.select;

                this.executeTransform(obj);
            }

        }, this);
    };

    p.executeTransform = function (obj) {
        var selection = d3.selectAll(obj.select),
            selectionLength = selection[0].length,
            self = this,
            endCounter = 0;

        var params = {
            translate_X: undefined,
            translate_Y: undefined,
            scale_X: undefined,
            scale_Y: undefined,
            spin_deg: undefined,
            spin_X: undefined,
            spin_Y: undefined,
            fill: undefined,
            display: undefined,
            tPath_ID: undefined,
            tPath_startPos: undefined,
            tPath_endPos: undefined,
            tPath_autoRotate: undefined,
            pathToTrace: undefined,
            totalPathLength: undefined,
            adjustedPathLength: undefined,
            transitionTime: undefined,
            easeMode: undefined
        };

        _objToParams(this, obj, params);

        if (selectionLength > 0) {
            selection
            .transition()
            .ease(params.easeMode)
            .duration(params.transitionTime)
            .call(_appendPathTransform, params, self)
            .call(_appendTransform, params, self)
            .call(_appendFill, params.fill)
            .call(_appendStyle, params.style, self)
            .call(_appendDisplay, params.display)
            .each("end", function () {
                if (params && params.display === "none") {
                    selection.style('display', params.display);
                }
                params = null;
                endCounter += 1;
                if (endCounter === selectionLength) {
                    self.widget._triggerTransformDoneEvent(obj.originalSelect);
                }
            });
        }
    };

    p.executeActionZoom = function (direction) {
        // useful: http://bl.ocks.org/linssen/7352810

        /*
        executeActionZoom works mostly with mostly unscaled values, as they are coming from widget environment.
        --> whatever ist scaled, needs to be unscaled for calculation.
        */
        var zoomFactor = 1.2,
            desiredScaleLevel,
            widgetWidth = parseInt(this.widget.el.css("width")),
            widgetHeight = parseInt(this.widget.el.css("height")),
            widgetCenter = [widgetWidth / 2, widgetHeight / 2],
            currentScale = this.zoom.scale(),
            scaleExtent = this.zoom.scaleExtent(),
            currentTranslate = this.zoom.translate(),
            translate0 = [],
            l = [],
            expectedCenterOffsetStep_X,
            expectedCenterOffsetStep_Y,
            totalCenterOffset_X,
            totalCenterOffset_Y,
            // values in this method are unscaled, so we need to unscaleFactor the currentTranslate as well
            view = { translate_X: currentTranslate[0] / this.scaleFactor, translate_Y: currentTranslate[1] / this.scaleFactor, scale: currentScale },
            widgetID = this.widget.elem.id,
            fileGroup = d3.select('#' + widgetID + ' svg.breasePaperSVGContainer g[data-source="file"]'),
            contentGroup = d3.select('#' + widgetID + ' svg.breasePaperSVGContainer g[data-source="content"]');

        if (direction === 1) {
            desiredScaleLevel = currentScale * (zoomFactor);
        } else if (direction === -1) {
            desiredScaleLevel = currentScale * (1 / zoomFactor);
        } else if (direction === 0) {
            desiredScaleLevel = 1;
        }

        if (desiredScaleLevel < scaleExtent[0]) {
            desiredScaleLevel = scaleExtent[0];
        } else if (desiredScaleLevel > scaleExtent[1]) {
            desiredScaleLevel = scaleExtent[1];
        }

        translate0 = [(widgetCenter[0] - view.translate_X) / view.scale, (widgetCenter[1] - view.translate_Y) / view.scale];

        view.scale = desiredScaleLevel;
        l = [translate0[0] * view.scale + view.translate_X, translate0[1] * view.scale + view.translate_Y];

        // view.translate_X += widgetCenter[0] - l[0];
        // view.translate_Y += widgetCenter[1] - l[1];

        expectedCenterOffsetStep_X = widgetCenter[0] - l[0];
        expectedCenterOffsetStep_Y = widgetCenter[1] - l[1];
        totalCenterOffset_X = view.translate_X + expectedCenterOffsetStep_X;
        totalCenterOffset_Y = view.translate_Y + expectedCenterOffsetStep_Y;

        view.translate_X = Math.min(0, Math.max(totalCenterOffset_X, widgetWidth * (1 - view.scale)));
        view.translate_Y = Math.min(0, Math.max(totalCenterOffset_Y, widgetHeight * (1 - view.scale)));

        if (direction === 0) {
            this.zoom.scale(view.scale).translate([0, 0]);
        } else {
            // when working in event environment like here, we need to scaleFactor the translate
            this.zoom.scale(view.scale).translate([view.translate_X * this.scaleFactor, view.translate_Y * this.scaleFactor]);
        }

        // working in widget environment, so no scaleFactor needed
        fileGroup.attr("transform", "translate(" + [view.translate_X, view.translate_Y] + ")" + " scale(" + this.zoom.scale() + ")");
        contentGroup.attr("transform", "translate(" + [view.translate_X, view.translate_Y] + ")" + " scale(" + this.zoom.scale() + ")");

    };

    p.updateTransitionTime = function (transitionTime) {
        this.settings.transitionTime = transitionTime;
    };

    p.updateColorList = function (colorList) {
        this.settings.colorList = colorList;
    };

    p.dispose = function () {
        SuperClass.prototype.dispose.apply(this, arguments);
    };

    function _extractSVGFileData(filePath) {
        var deferred = jQuery.Deferred();
        if (filePath === "") {
            deferred.resolve("");
        } else {
            var url = _createUrlFromPath(filePath);
            $.get(url, function (data) {
                deferred.resolve(data);
            }, 'text');
        }

        return deferred.promise();
    }

    function _createUrlFromPath(filePath) {
        if (/^\/FileDevice/.test(filePath)) {
            return filePath;
        } else {
            if (/^\//.test(filePath)) {
                return "/BRVisu" + filePath;
            } else {
                return "/BRVisu/" + filePath;
            }
        }
    }

    function _addClipPath(widgetID, widgetWidth, widgetHeight) {
        var svgContainer = d3.select('#' + widgetID + ' svg.breasePaperSVGContainer'),
            fileGroup = d3.select('#' + widgetID + ' svg.breasePaperSVGContainer g[data-source="file"]'),
            contentGroup = d3.select('#' + widgetID + ' svg.breasePaperSVGContainer g[data-source="content"]');

        svgContainer.append('defs')
            .append('clipPath')
            .attr('id', widgetID + "_clipPath")
                .append('rect')
                    .attr('x', 0)
                    .attr('y', 0)
                    .attr('width', widgetWidth)
                    .attr('height', widgetHeight);

        fileGroup.attr("clip-path", "url(" + document.location.pathname + document.location.search + "#" + widgetID + "_clipPath)");
        contentGroup.attr("clip-path", "url(" + document.location.pathname + document.location.search + "#" + widgetID + "_clipPath)");
    }

    function _addClickBehavior(renderer) {
        var mouseUpRecieved = false,
            clickToleranceAdhered = false,
            downEvent,
            upEvent;

        renderer.widget.el.on("vmousedown", function (e) {
            downEvent = e;
            mouseUpRecieved = false;
            clickToleranceAdhered = false;

            renderer.timeout = setTimeout(function () {
                if (mouseUpRecieved && clickToleranceAdhered) {
                    mouseUpRecieved = false;
                    clickToleranceAdhered = false;
                    renderer.widget._customClickHandler(downEvent);
                }
            }, 300);
        });
        renderer.widget.el.on("vmouseup", function (e) {
            mouseUpRecieved = true;
            upEvent = e;
            clickToleranceAdhered = _monitorToleranceBreak(downEvent, upEvent);
        });
    }

    function _addZoomBehavior(widgetID, renderer) {
        /*
        _addZoomBehavior works mostly with mostly scaled values, as they are coming from event environment.
        --> whatever ist not scaled, needs to be scaled for calculation.
        */
        var svgContainer = d3.select('#' + widgetID + ' svg.breasePaperSVGContainer'),
            fileGroup = d3.select('#' + widgetID + ' svg.breasePaperSVGContainer g[data-source="file"]'),
            contentGroup = d3.select('#' + widgetID + ' svg.breasePaperSVGContainer g[data-source="content"]'),
            minZoomLevel = renderer.widget.getMinZoomLevel() / 100,
            maxZoomLevel = renderer.widget.getMaxZoomLevel() / 100,
            widgetWidth = parseInt(renderer.widget.el.css("width")),
            widgetHeight = parseInt(renderer.widget.el.css("height"));

        renderer.drag = d3.behavior.drag()
        .on("dragstart", function () {
            d3.event.sourceEvent.stopPropagation();
        })
        .on("drag", function () {
        })
        .on("dragend", function () {
        });

        svgContainer.call(renderer.drag);

        renderer.zoom = d3.behavior.zoom().scaleExtent([minZoomLevel, maxZoomLevel])
        .on("zoom", function () {
            d3.event.sourceEvent.stopPropagation();

            // values in this method are scaled, so we need to scaleFactor the widgetWidht / widgetHeight as well
            var e = d3.event,
                tx = Math.min(0, Math.max(e.translate[0], widgetWidth * renderer.scaleFactor * (1 - e.scale))),
                ty = Math.min(0, Math.max(e.translate[1], widgetHeight * renderer.scaleFactor * (1 - e.scale))),
                eventScale = d3.event.scale;

            renderer.zoom.translate([tx, ty]);

            // unscaleFactor tx and ty to be used in widget environment again
            tx = tx / renderer.scaleFactor;
            ty = ty / renderer.scaleFactor;

            fileGroup.attr("transform", "translate(" + [tx, ty] + ")" + " scale(" + eventScale + ")");
            contentGroup.attr("transform", "translate(" + [tx, ty] + ")" + " scale(" + eventScale + ")");
        });

        svgContainer.call(renderer.zoom).on("dblclick.zoom", null);

    }

    function _monitorToleranceBreak(downEvent, upEvent) {
        if (downEvent.type === "vmousedown" && upEvent.type === "vmouseup") {
            var tolerance = 10,
                diff = {
                    x: Math.abs(downEvent.clientX - upEvent.clientX),
                    y: Math.abs(downEvent.clientY - upEvent.clientY)
                };
            if (diff.x <= tolerance && diff.y <= tolerance) {
                return true;
            }
        }
        return false;
    }

    function _objToParams(renderer, obj, params) {
        params.transitionTime = renderer.settings.transitionTime,
        params.easeMode = 'linear';

        _translateToParams(obj, params);
        _scaleToParams(obj, params);
        _spinToParams(obj, params);
        _fillToParams(renderer, obj, params);
        _styleToParams(obj, params);
        _displayToParams(obj, params);
        _durationToParams(obj, params);
        _tPathToParams(obj, params);


    }

    function _translateToParams(obj, params) {
        if (obj.translate !== undefined) {
            params.translate_X = obj.translate[0];
            params.translate_Y = obj.translate[1];
        }
    }

    function _scaleToParams(obj, params) {
        if (obj.scale !== undefined) {
            params.scale_X = obj.scale[0];
            params.scale_Y = obj.scale[1];
        }
    }

    function _spinToParams(obj, params) {
        if (obj.spin !== undefined) {
            params.spin_deg = obj.spin[0];
            params.spin_X = obj.spin[1];
            params.spin_Y = obj.spin[2];
        }
    }

    function _fillToParams(renderer, obj, params) {
        if (obj.fill !== undefined && typeof obj.fill === "number") {
            params.fill = renderer.settings.colorList[obj.fill];
        }
    }

    function _styleToParams(obj, params) {
        if (obj.style !== undefined) {
            params.style = obj.style;
        }
    }

    function _displayToParams(obj, params) {
        if (obj.display !== undefined) {
            _isDisplayBlock(obj, params);
            _isDisplayNone(obj, params);
        }
    }

    function _isDisplayBlock(obj, params) {
        if (obj.display === true || obj.display === 'true' || obj.display === 1 || obj.display === '1') {
            params.display = 'block';
        }
    }

    function _isDisplayNone(obj, params) {
        if (obj.display === false || obj.display === 'false' || obj.display === 0 || obj.display === '0') {
            params.display = 'none';
        }
    }

    function _durationToParams(obj, params) {
        if (obj.duration !== '' && obj.duration !== undefined && obj.duration !== null) {
            params.transitionTime = obj.duration;
        }
    }

    function _tPathToParams(obj, params) {
        if (obj.tPath !== undefined) {
            params.tPath_ID = obj.tPath[0];
            params.tPath_autoRotate = obj.tPath[1];
            params.tPath_startPos = obj.tPath[2];
            params.tPath_endPos = obj.tPath[3];

            _modifyPathParams(params);
        }
    }

    function _modifyPathParams(params) {
        if (params.tPath_ID.startsWith("#")) {
            params.tPath_ID = params.tPath_ID.replace("#", "");
        }

        if (params.tPath_startPos === "" || params.tPath_startPos === null || params.tPath_startPos === undefined) {
            params.tPath_startPos = 0;
        }
        if (params.tPath_endPos === "" || params.tPath_endPos === null || params.tPath_endPos === undefined) {
            params.tPath_endPos = 100;
        }

        params.tPath_startPos = params.tPath_startPos / 100;
        params.tPath_endPos = params.tPath_endPos / 100;

        params.pathToTrace = document.getElementById(params.tPath_ID);
        params.totalPathLength = params.pathToTrace.getTotalLength();
        params.adjustedPathLength = params.totalPathLength * (params.tPath_endPos - params.tPath_startPos);
    }

    function _appendPathTransform(transition, params, self) {
        if (params.tPath_ID !== undefined) {
            transition.attrTween("transform", function () {
                _attachAbsentMatrices(self, this);
                var previousScale_X = this.transform.baseVal.getItem(1).matrix.a;
                var previousScale_Y = this.transform.baseVal.getItem(1).matrix.d;
                return function (timer) {
                    var returnString = '';
                    var currentPoint = params.pathToTrace.getPointAtLength(timer * params.adjustedPathLength + params.totalPathLength * params.tPath_startPos);
                    returnString += _buildPathTranslate(currentPoint);

                    if (params.scale_X !== undefined) {
                        returnString += _buildPathScale(params.scale_X, params.scale_Y, timer, previousScale_X, previousScale_Y);
                    }

                    if (params.tPath_autoRotate === true) {
                        var upcomingPoint = params.pathToTrace.getPointAtLength(timer * params.adjustedPathLength + 1 + params.totalPathLength * params.tPath_startPos);
                        var angle = Math.atan2(upcomingPoint.y - currentPoint.y, upcomingPoint.x - currentPoint.x) * 180 / Math.PI;
                        returnString += _buildPathRotate(angle);
                    }

                    return returnString;
                };
            });
        }
    }

    function _buildPathTranslate(currentPoint) {
        return "translate(" + currentPoint.x + "," + currentPoint.y + ")";
    }

    function _buildPathScale(scale_X, scale_Y, timer, previousScale_X, previousScale_Y) {
        return "scale(" + (((scale_X - previousScale_X) * timer) + previousScale_X) + ", " + (((scale_Y - previousScale_Y) * timer) + previousScale_Y) + ")";
    }

    function _buildPathRotate(angle) {
        return "rotate(" + angle + ")";
    }

    function _appendTransform(transition, params, self) {
        var transformString = '';
        if (params.tPath_ID === undefined && (params.translate_X !== undefined || params.scale_X !== undefined || params.spin_deg !== undefined)) {

            //-----------------------------------------------------
            // Useful resources:
            // https://bl.ocks.org/mbostock/3305854
            // http://jsfiddle.net/SHF2M/
            // http://bl.ocks.org/bycoffe/c3849a0b15234d7e32fc
            // https://jsfiddle.net/42y1d30m/3/
            // https://jsfiddle.net/42y1d30m/5/
            // https://jsfiddle.net/42y1d30m/1/
            // http://jsfiddle.net/FZXwH/
            //-----------------------------------------------------

            transition.each(function () {
                d3.select(this).transition().attrTween("transform", function () {

                    _attachAbsentMatrices(self, this);

                    var previousRotation = Math.atan2(this.transform.baseVal.getItem(2).matrix.b, this.transform.baseVal.getItem(2).matrix.a) * 180 / Math.PI;

                    var interpolate_translate_X = d3.interpolate(this.transform.baseVal.getItem(0).matrix.e, params.translate_X);
                    var interpolate_translate_Y = d3.interpolate(this.transform.baseVal.getItem(0).matrix.f, params.translate_Y);
                    var interpolate_scale_X = d3.interpolate(this.transform.baseVal.getItem(1).matrix.a, params.scale_X);
                    var interpolate_scale_Y = d3.interpolate(this.transform.baseVal.getItem(1).matrix.d, params.scale_Y);
                    var interpolate_spin_deg = d3.interpolate(previousRotation, params.spin_deg);
                    var interpolate_spin_X = d3.interpolate(params.spin_X, params.spin_X);
                    var interpolate_spin_Y = d3.interpolate(params.spin_Y, params.spin_Y);

                    return function (t) {
                        return _buildTranslate(params, interpolate_translate_X, interpolate_translate_Y, t) +
                            _buildScale(params, interpolate_scale_X, interpolate_scale_Y, t) +
                            _buildSpinRotate(params, interpolate_spin_deg, interpolate_spin_X, interpolate_spin_Y, t);
                    };

                });
            });
        }
    }

    function _attachAbsentMatrices(self, selectedElement) {
        var mainSVGContainer = self.widget.elem.firstElementChild;

        var translateSVGTransform = mainSVGContainer.createSVGTransform();
        translateSVGTransform.setTranslate(0, 0);
        var scaleSVGTransform = mainSVGContainer.createSVGTransform();
        scaleSVGTransform.setScale(1, 1);
        var spinRotateSVGTransform = mainSVGContainer.createSVGTransform();
        spinRotateSVGTransform.setRotate(0, 0, 0);

        if (selectedElement.transform.baseVal.numberOfItems !== 0) {
            for (var i = 0; i < selectedElement.transform.baseVal.numberOfItems; i += 1) {
                var currentItem = selectedElement.transform.baseVal.getItem(i);

                if (currentItem.type === SVGTransform.SVG_TRANSFORM_TRANSLATE) {
                    translateSVGTransform = currentItem;
                }
                if (currentItem.type === SVGTransform.SVG_TRANSFORM_SCALE) {
                    scaleSVGTransform = currentItem;
                }
                if (currentItem.type === SVGTransform.SVG_TRANSFORM_ROTATE) {
                    spinRotateSVGTransform = currentItem;
                }
            }
        }

        selectedElement.transform.baseVal.clear();

        selectedElement.transform.baseVal.appendItem(translateSVGTransform);
        selectedElement.transform.baseVal.appendItem(scaleSVGTransform);
        selectedElement.transform.baseVal.appendItem(spinRotateSVGTransform);
    }

    function _buildTranslate(params, interpolate_translate_X, interpolate_translate_Y, t) {
        if (params.translate_X !== undefined && params.translate_Y !== undefined) {
            return "translate(" + interpolate_translate_X(t) + "," + interpolate_translate_Y(t) + ")";
        } else {
            return "";
        }
    }

    function _buildScale(params, interpolate_scale_X, interpolate_scale_Y, t) {
        if (params.scale_X !== undefined && params.scale_Y !== undefined) {
            return "scale(" + interpolate_scale_X(t) + "," + interpolate_scale_Y(t) + ")";
        } else {
            return "";
        }
    }

    function _buildSpinRotate(params, interpolate_spin_deg, interpolate_spin_X, interpolate_spin_Y, t) {
        if (params.spin_deg !== undefined && params.spin_X !== undefined && params.spin_Y !== undefined) {
            return "rotate(" + interpolate_spin_deg(t) + "," + interpolate_spin_X(t) + "," + interpolate_spin_Y(t) + ")";
        } else {
            return "";
        }
    }

    function _appendFill(transition, fill) {
        if (fill !== undefined) {
            transition.style('fill', fill);
        }
    }

    function _appendStyle(transition, style, renderer) {
        var keyValuePairs;
        var currentPair;

        if (style !== undefined) {
            keyValuePairs = style.split(";");

            for (var i = 0; i < keyValuePairs.length; i += 1) {
                currentPair = keyValuePairs[i].split(":");
                if (currentPair[0] === "fill" || currentPair[0] === "stroke") {
                    currentPair[1] = renderer.settings.colorList[currentPair[1]];
                }
                transition.style(currentPair[0], currentPair[1]);
            }
        }
    }

    function _appendDisplay(transition, display) {
        var opacity;
        if (display === 'none') {
            opacity = 0;
            transition.style('opacity', opacity).each("end", function () { transition.style('display', display); });
        } else if (display === 'block') {
            opacity = 1;
            transition.style('display', display).style('opacity', opacity);
        }
    }

    return Renderer;
});