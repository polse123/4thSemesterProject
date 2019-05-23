/*global define*/
define(["brease/core/designer/ContainerWidget/ClassInfo"], function (superClassInfo, classExtension) {
	"use strict";
	var classInfo = {
		meta: {
			className: "widgets.brease.FlexBox", 
			parents: ["*"],
			children: ["widgets.brease.FlexBoxItem"],
			inheritance: ["widgets.brease.FlexBox","brease.core.ContainerWidget","brease.core.BaseWidget"],
			actions: {"setAlignment":{"method":"setAlignment","parameter":{"alignment":{"name":"alignment","index":0,"type":"brease.enum.Direction"}}},"SetEnable":{"method":"setEnable","parameter":{"value":{"name":"value","index":0,"type":"Boolean"}}},"SetStyle":{"method":"setStyle","parameter":{"value":{"name":"value","index":0,"type":"StyleReference"}}},"SetVisible":{"method":"setVisible","parameter":{"value":{"name":"value","index":0,"type":"Boolean"}}}}
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