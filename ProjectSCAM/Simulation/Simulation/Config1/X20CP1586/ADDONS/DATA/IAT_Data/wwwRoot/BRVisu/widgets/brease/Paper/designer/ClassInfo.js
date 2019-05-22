/*global define*/
define(["brease/core/designer/BaseWidget/ClassInfo"], function (superClassInfo, classExtension) {
	"use strict";
	var classInfo = {
		meta: {
			className: "widgets.brease.Paper", 
			parents: ["*"],
			children: [],
			inheritance: ["widgets.brease.Paper","brease.core.BaseWidget"],
			actions: {"setColorList":{"method":"setColorList","parameter":{"colorList":{"name":"colorList","index":0,"type":"ColorList"}}},"SetEnable":{"method":"setEnable","parameter":{"value":{"name":"value","index":0,"type":"Boolean"}}},"setMaxZoomLevel":{"method":"setMaxZoomLevel","parameter":{"maxZoomLevel":{"name":"maxZoomLevel","index":0,"type":"UNumber"}}},"setMinZoomLevel":{"method":"setMinZoomLevel","parameter":{"minZoomLevel":{"name":"minZoomLevel","index":0,"type":"UNumber"}}},"SetStyle":{"method":"setStyle","parameter":{"value":{"name":"value","index":0,"type":"StyleReference"}}},"setSvgContent":{"method":"setSvgContent","parameter":{"svgContent":{"name":"svgContent","index":0,"type":"String"}}},"setSvgFilePath":{"method":"setSvgFilePath","parameter":{"svgFilePath":{"name":"svgFilePath","index":0,"type":"ImagePath"}}},"setTransform":{"method":"setTransform","parameter":{"transform":{"name":"transform","index":0,"type":"String"}}},"setTransitionTime":{"method":"setTransitionTime","parameter":{"transitionTime":{"name":"transitionTime","index":0,"type":"UInteger"}}},"SetVisible":{"method":"setVisible","parameter":{"value":{"name":"value","index":0,"type":"Boolean"}}},"ZoomIn":{"method":"zoomIn"},"ZoomOut":{"method":"zoomOut"},"ZoomReset":{"method":"zoomReset"}}
		}
	};
	if (superClassInfo.classExtension) {
		classInfo.classExtension = superClassInfo.classExtension;
	}
	if (classExtension) {
		classInfo.classExtension = classExtension;
	}
	return classInfo;
});