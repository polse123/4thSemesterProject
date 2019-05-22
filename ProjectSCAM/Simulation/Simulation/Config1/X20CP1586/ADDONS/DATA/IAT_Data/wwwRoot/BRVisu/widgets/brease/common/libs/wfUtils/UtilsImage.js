define(function (require) {

    'use strict';

    var d3 = require('libs/d3/d3'),

        UtilsImage = {};

    UtilsImage.getInlineSvg = function (sourceImage) {
        var deferedElement = $.Deferred();
        d3.xml(sourceImage).mimeType("image/svg+xml").get(function (error, xml) {
            if (error) {
                var brokenSvg = UtilsImage.getBrokenSvg();
                deferedElement.resolve($(brokenSvg));
            } else {
                deferedElement.resolve($(xml.documentElement));
            }
        });
        return deferedElement.promise();
    };

    UtilsImage.isStylable = function (sourceImage) {
        var isStylable;
        if (sourceImage !== '' && sourceImage !== undefined) {
            isStylable = sourceImage.split('.').pop() === 'svg' ? true : false;
        } else {
            isStylable = false;
        }
        return isStylable;
    };

    UtilsImage.getBrokenSvg = function () {
        // svg created according to "../common/libs/wfUtils/broken.svg"
        var svgElement = document.createElementNS(d3.ns.prefix.svg, 'svg');
        var brokenSvg = d3.select(svgElement)
            .attr("style", "width: 20px; height:23px");

        brokenSvg.append("line")
            .attr("x1", 3.75)
            .attr("y1", -0.069449)
            .attr("x2", 0.75)
            .attr("y2", 23)
            .attr("stroke", "#b2b2b2")
            .attr("stroke-width", 1.5);

        brokenSvg.append("line")
            .attr("x1", 23)
            .attr("y1", 22.25)
            .attr("x2", 0)
            .attr("y2", 22.25)
            .attr("stroke", "#666666")
            .attr("stroke-width", 1.5);

        brokenSvg.append("line")
            .attr("x1", 22.521265)
            .attr("y1", 3.787241)
            .attr("x2", 22.521265)
            .attr("y2", 16.808505)
            .attr("stroke", "#666666")
            .attr("stroke-width", 1.5);

        brokenSvg.append("line")
            .attr("x1", 19.25)
            .attr("y1", 5.202132)
            .attr("x2", 19.25)
            .attr("y2", 23)
            .attr("stroke", "#666666")
            .attr("stroke-width", 1.5);

        brokenSvg.append("rect")
            .attr("height", 3.339856)
            .attr("width", 15.40424)
            .attr("x", 2.297881)
            .attr("y", 17.436729)
            .attr("stroke", "#00bf00")
            .attr("stroke-width", 1.5)
            .attr("fill", "#00bf00");

        brokenSvg.append("rect")
            .attr("height", 7.914511)
            .attr("width", 14.553177)
            .attr("x", 2.808519)
            .attr("y", 8.01064)
            .attr("stroke", "#97c9fc")
            .attr("stroke-width", 2.5)
            .attr("fill", "#97c9fc");

        brokenSvg.append("rect")
            .attr("height", 3.489358)
            .attr("width", 8.51063)
            .attr("x", 2.808518)
            .attr("y", 2.563837)
            .attr("stroke", "#97c9fc")
            .attr("stroke-width", 2.5)
            .attr("fill", "#97c9fc");

        brokenSvg.append("ellipse")
            .attr("rx", 1.548673)
            .attr("ry", 0.309735)
            .attr("cx", 5.840707)
            .attr("cy", 5.615045)
            .attr("stroke", "#ffffff")
            .attr("stroke-width", 1.5);

        brokenSvg.append("ellipse")
            .attr("rx", 7.743362)
            .attr("ry", 2.964602)
            .attr("cx", 10.088495)
            .attr("cy", 16.676991)
            .attr("stroke", "#00bf00")
            .attr("stroke-width", 1.5)
            .attr("fill", "#00bf00");

        brokenSvg.append("line")
            .attr("x1", 21.814158)
            .attr("y1", 12.207965)
            .attr("x2", 7.743362)
            .attr("y2", 25.039822)
            .attr("stroke", "#ffffff")
            .attr("stroke-width", 3.5);

        brokenSvg.append("line")
            .attr("x1", 12.964601)
            .attr("y1", 0.349558)
            .attr("x2", 19.690264)
            .attr("y2", 6.013275)
            .attr("stroke", "#666666")
            .attr("stroke-width", 1.5);

        brokenSvg.append("line")
            .attr("x1", 0)
            .attr("y1", 0.615045)
            .attr("x2", 13.672565)
            .attr("y2", 0.792036)
            .attr("stroke", "#b2b2b2")
            .attr("stroke-width", 1.5);

        brokenSvg.append("line")
            .attr("x1", 12.964601)
            .attr("y1", -0.09292)
            .attr("x2", 13.053096)
            .attr("y2", 6.89823)
            .attr("stroke", "#666666")
            .attr("stroke-width", 1.5);

        brokenSvg.append("line")
            .attr("x1", 19.867255)
            .attr("y1", 6.190266)
            .attr("x2", 12.610619)
            .attr("y2", 6.278761)
            .attr("stroke", "#666666")
            .attr("stroke-width", 1.5);

        return svgElement;
    };

    return UtilsImage;

});