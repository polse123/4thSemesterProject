/* global define */
define(['brease/enum/Enum'], function (Enum) {
    'use strict';

    var ChartUtils = {};

    function _parseInt(stringValue, defaultValue) {
        var result = parseInt(stringValue, 10);
        if (isNaN(result)) {
            return defaultValue;
        }
        return result;
    }

    ChartUtils.formatTickLabels = function (tickTextSelection, axisPosition, distance, rotation) {
        var rotationInteger = _parseInt(rotation, 0);
        var distanceInteger = _parseInt(distance, 0);

        var distanceAttribute = "";
        var rotationString = "";

        if (axisPosition === "top") {
            distanceAttribute = "y";
            distanceInteger = distanceInteger * (-1);
            rotationString = "rotate(" + rotationInteger + ", 0, " + distanceInteger + ")";
        }
        else if (axisPosition === "bottom") {
            distanceAttribute = "y";
            rotationString = "rotate(" + rotationInteger + ", 0, " + distanceInteger + ")";

        }
        else if (axisPosition === "right") {
            distanceAttribute = "x";
            rotationString = "rotate(" + rotationInteger + ", " + distanceInteger + ", 0)";
        }
        else {
            distanceAttribute = "x";
            distanceInteger = distanceInteger * (-1);
            rotationString = "rotate(" + rotationInteger + ", " + distanceInteger + ", 0)";
        }

        tickTextSelection
            .attr("transform", rotationString)
            .attr(distanceAttribute, distanceInteger);
    };

    return ChartUtils;
});