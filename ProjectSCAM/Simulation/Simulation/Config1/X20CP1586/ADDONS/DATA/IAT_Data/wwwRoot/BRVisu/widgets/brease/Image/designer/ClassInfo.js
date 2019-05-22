/*global define*/
define(["brease/core/designer/BaseWidget/ClassInfo"], function (superClassInfo, classExtension) {
	"use strict";
	var classInfo = {
		meta: {
			className: "widgets.brease.Image", 
			parents: ["*"],
			children: [],
			inheritance: ["widgets.brease.Image","brease.core.BaseWidget"],
			actions: {"SetEnable":{"method":"setEnable","parameter":{"value":{"name":"value","index":0,"type":"Boolean"}}},"SetImage":{"method":"setImage","parameter":{"image":{"name":"image","index":0,"type":"ImagePath"}}},"setSizeMode":{"method":"setSizeMode","parameter":{"sizeMode":{"name":"sizeMode","index":0,"type":"brease.enum.SizeMode"}}},"SetStyle":{"method":"setStyle","parameter":{"value":{"name":"value","index":0,"type":"StyleReference"}}},"SetVisible":{"method":"setVisible","parameter":{"value":{"name":"value","index":0,"type":"Boolean"}}}}
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