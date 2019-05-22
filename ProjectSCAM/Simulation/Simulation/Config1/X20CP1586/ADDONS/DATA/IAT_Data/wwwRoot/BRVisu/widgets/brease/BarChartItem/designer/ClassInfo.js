/*global define*/
define(["brease/core/designer/BaseWidget/ClassInfo"], function (superClassInfo, classExtension) {
	"use strict";
	var classInfo = {
		meta: {
			className: "widgets.brease.BarChartItem", 
			parents: ["widgets.brease.BarChart"],
			children: [],
			inheritance: ["widgets.brease.BarChartItem","brease.core.BaseWidget"],
			actions: {"SetEnable":{"method":"setEnable","parameter":{"value":{"name":"value","index":0,"type":"Boolean"}}},"setMaxValue":{"method":"setMaxValue","parameter":{"value":{"name":"value","index":0,"type":"Number"}}},"setMinValue":{"method":"setMinValue","parameter":{"value":{"name":"value","index":0,"type":"Number"}}},"setNode":{"method":"setNode","parameter":{"node":{"name":"node","index":0,"type":"brease.datatype.Node"}}},"SetStyle":{"method":"setStyle","parameter":{"value":{"name":"value","index":0,"type":"StyleReference"}}},"setText":{"method":"setText","parameter":{"text":{"name":"text","index":0,"type":"String"}}},"SetValue":{"method":"setValue","parameter":{"value":{"name":"value","index":0,"type":"Number"}}},"SetVisible":{"method":"setVisible","parameter":{"value":{"name":"value","index":0,"type":"Boolean"}}}}
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