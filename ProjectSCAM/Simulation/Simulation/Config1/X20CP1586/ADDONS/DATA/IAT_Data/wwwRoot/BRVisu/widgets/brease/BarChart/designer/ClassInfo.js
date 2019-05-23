/*global define*/
define(["widgets/brease/DataHandlerWidget/designer/ClassInfo"], function (superClassInfo, classExtension) {
	"use strict";
	var classInfo = {
		meta: {
			className: "widgets.brease.BarChart", 
			parents: ["*"],
			children: ["widgets.brease.BarChartItem","widgets.brease.BarChartThreshold"],
			inheritance: ["widgets.brease.BarChart","widgets.brease.DataHandlerWidget","brease.core.BaseWidget"],
			actions: {"setBarPadding":{"method":"setBarPadding","parameter":{"barPadding":{"name":"barPadding","index":0,"type":"Integer"}}},"setChartMargin":{"method":"setChartMargin","parameter":{"chartMargin":{"name":"chartMargin","index":0,"type":"PixelValCollection"}}},"SetEnable":{"method":"setEnable","parameter":{"value":{"name":"value","index":0,"type":"Boolean"}}},"setFormat":{"method":"setFormat","parameter":{"format":{"name":"format","index":0,"type":"brease.config.MeasurementSystemFormat"}}},"setOrientation":{"method":"setOrientation","parameter":{"orientation":{"name":"orientation","index":0,"type":"brease.enum.Orientation"}}},"setShowUnit":{"method":"setShowUnit","parameter":{"showUnit":{"name":"showUnit","index":0,"type":"Boolean"}}},"setShowValue":{"method":"setShowValue","parameter":{"showValue":{"name":"showValue","index":0,"type":"Boolean"}}},"SetStyle":{"method":"setStyle","parameter":{"value":{"name":"value","index":0,"type":"StyleReference"}}},"setTransitionTime":{"method":"setTransitionTime","parameter":{"transitionTime":{"name":"transitionTime","index":0,"type":"UInteger"}}},"SetUnit":{"method":"setUnit","parameter":{"unit":{"name":"unit","index":0,"type":"brease.config.MeasurementSystemUnit"}}},"SetVisible":{"method":"setVisible","parameter":{"value":{"name":"value","index":0,"type":"Boolean"}}},"setXAxisHeight":{"method":"setXAxisHeight","parameter":{"xAxisHeight":{"name":"xAxisHeight","index":0,"type":"Integer"}}},"setYAxisWidth":{"method":"setYAxisWidth","parameter":{"yAxisWidth":{"name":"yAxisWidth","index":0,"type":"Integer"}}}}
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