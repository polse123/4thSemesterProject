/*global define*/
define(["widgets/brease/NumericInput/designer/ClassInfo"], function (superClassInfo, classExtension) {
	"use strict";
	var classInfo = {
		meta: {
			className: "widgets.brease.NumericOutput", 
			parents: ["*"],
			children: [],
			inheritance: ["widgets.brease.NumericOutput","widgets.brease.NumericInput","brease.core.BaseWidget"],
			actions: {"setEllipsis":{"method":"setEllipsis","parameter":{"ellipsis":{"name":"ellipsis","index":0,"type":"Boolean"}}},"SetEnable":{"method":"setEnable","parameter":{"value":{"name":"value","index":0,"type":"Boolean"}}},"setFormat":{"method":"setFormat","parameter":{"format":{"name":"format","index":0,"type":"brease.config.MeasurementSystemFormat"}}},"setKeyboard":{"method":"setKeyboard","parameter":{"keyboard":{"name":"keyboard","index":0,"type":"Boolean"}}},"setLimitViolationPolicy":{"method":"setLimitViolationPolicy","parameter":{"limitViolationPolicy":{"name":"limitViolationPolicy","index":0,"type":"brease.enum.LimitViolationPolicy"}}},"setMaxValue":{"method":"setMaxValue","parameter":{"maxValue":{"name":"maxValue","index":0,"type":"Number"}}},"setMinValue":{"method":"setMinValue","parameter":{"minValue":{"name":"minValue","index":0,"type":"Number"}}},"setNode":{"method":"setNode","parameter":{"node":{"name":"node","index":0,"type":"brease.datatype.Node"}}},"setNumPadStyle":{"method":"setNumPadStyle","parameter":{"numPadStyle":{"name":"numPadStyle","index":0,"type":"String"}}},"setNumpadPosition":{"method":"setNumpadPosition","parameter":{"numpadPosition":{"name":"numpadPosition","index":0,"type":"brease.enum.Position"}}},"setReadonly":{"method":"setReadonly","parameter":{"value":{"name":"value","index":0,"type":"Boolean"}}},"setShowUnit":{"method":"setShowUnit","parameter":{"showUnit":{"name":"showUnit","index":0,"type":"Boolean"}}},"SetStyle":{"method":"setStyle","parameter":{"value":{"name":"value","index":0,"type":"StyleReference"}}},"setSubmitOnChange":{"method":"setSubmitOnChange","parameter":{"submitOnChange":{"name":"submitOnChange","index":0,"type":"Boolean"}}},"setUnit":{"method":"setUnit","parameter":{"unit":{"name":"unit","index":0,"type":"brease.config.MeasurementSystemUnit"}}},"setUnitAlign":{"method":"setUnitAlign","parameter":{"unitAlign":{"name":"unitAlign","index":0,"type":"brease.enum.ImageAlign"}}},"setUnitWidth":{"method":"setUnitWidth","parameter":{"value":{"name":"value","index":0,"type":"Size"}}},"setUseDigitGrouping":{"method":"setUseDigitGrouping","parameter":{"useDigitGrouping":{"name":"useDigitGrouping","index":0,"type":"Boolean"}}},"SetValue":{"method":"setValue","parameter":{"value":{"name":"value","index":0,"type":"Number"}}},"SetVisible":{"method":"setVisible","parameter":{"value":{"name":"value","index":0,"type":"Boolean"}}}}
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