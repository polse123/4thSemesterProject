/*global define*/
define(["widgets/brease/Window/designer/ClassInfo"], function (superClassInfo, classExtension) {
	"use strict";
	var classInfo = {
		meta: {
			className: "widgets.brease.MessageBox", 
			parents: ["*"],
			children: [],
			inheritance: ["widgets.brease.MessageBox","widgets.brease.Window","brease.core.BaseWidget"],
			actions: {"setContent":{"method":"setContent"},"setEnable":{"method":"setEnable","parameter":{"value":{"name":"value","index":0,"type":"Boolean"}}},"setIcon":{"method":"setIcon"},"setStyle":{"method":"setStyle","parameter":{"value":{"name":"value","index":0,"type":"StyleReference"}}},"setVisible":{"method":"setVisible","parameter":{"value":{"name":"value","index":0,"type":"Boolean"}}}}
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