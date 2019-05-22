/*global define*/
define(["brease/core/designer/BaseWidget/ClassInfo"], function (superClassInfo, classExtension) {
	"use strict";
	var classInfo = {
		meta: {
			className: "widgets.brease.Label", 
			parents: ["*"],
			children: [],
			inheritance: ["widgets.brease.Label","brease.core.BaseWidget"],
			actions: {"setAutoScroll":{"method":"setAutoScroll","parameter":{"value":{"name":"value","index":0,"type":"Boolean"}}},"setBreakWord":{"method":"setBreakWord","parameter":{"breakWord":{"name":"breakWord","index":0,"type":"Boolean"}}},"setEllipsis":{"method":"setEllipsis","parameter":{"ellipsis":{"name":"ellipsis","index":0,"type":"Boolean"}}},"SetEnable":{"method":"setEnable","parameter":{"value":{"name":"value","index":0,"type":"Boolean"}}},"setMultiLine":{"method":"setMultiLine","parameter":{"multiLine":{"name":"multiLine","index":0,"type":"Boolean"}}},"SetStyle":{"method":"setStyle","parameter":{"value":{"name":"value","index":0,"type":"StyleReference"}}},"SetText":{"method":"setText","parameter":{"text":{"name":"text","index":0,"type":"String"}}},"setTextKey":{"method":"setTextKey","parameter":{"key":{"name":"key","index":0,"type":"String"}}},"SetVisible":{"method":"setVisible","parameter":{"value":{"name":"value","index":0,"type":"Boolean"}}},"setWordWrap":{"method":"setWordWrap","parameter":{"wordWrap":{"name":"wordWrap","index":0,"type":"Boolean"}}}}
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