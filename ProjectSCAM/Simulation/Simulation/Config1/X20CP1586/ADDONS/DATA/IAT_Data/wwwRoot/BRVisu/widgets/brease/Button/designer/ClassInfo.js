/*global define*/
define(["brease/core/designer/BaseWidget/ClassInfo"], function (superClassInfo, classExtension) {
	"use strict";
	var classInfo = {
		meta: {
			className: "widgets.brease.Button", 
			parents: ["*"],
			children: [],
			inheritance: ["widgets.brease.Button","brease.core.BaseWidget"],
			actions: {"RemoveImage":{"method":"removeImage"},"RemoveMouseDownText":{"method":"removeMouseDownText"},"RemoveText":{"method":"removeText"},"setBreakWord":{"method":"setBreakWord","parameter":{"breakWord":{"name":"breakWord","index":0,"type":"Boolean"}}},"setEllipsis":{"method":"setEllipsis","parameter":{"ellipsis":{"name":"ellipsis","index":0,"type":"Boolean"}}},"SetEnable":{"method":"setEnable","parameter":{"value":{"name":"value","index":0,"type":"Boolean"}}},"SetImage":{"method":"setImage","parameter":{"image":{"name":"image","index":0,"type":"ImagePath"}}},"setImageAlign":{"method":"setImageAlign","parameter":{"imageAlign":{"name":"imageAlign","index":0,"type":"brease.enum.ImageAlign"}}},"SetMouseDownImage":{"method":"setMouseDownImage","parameter":{"mouseDownImage":{"name":"mouseDownImage","index":0,"type":"ImagePath"}}},"SetMouseDownText":{"method":"setMouseDownText","parameter":{"text":{"name":"text","index":0,"type":"String"},"keepKey":{"name":"keepKey","index":1,"type":"Boolean"}}},"setMouseDownTextKey":{"method":"setMouseDownTextKey","parameter":{"key":{"name":"key","index":0,"type":"String"}}},"setMultiLine":{"method":"setMultiLine","parameter":{"multiLine":{"name":"multiLine","index":0,"type":"Boolean"}}},"SetStyle":{"method":"setStyle","parameter":{"value":{"name":"value","index":0,"type":"StyleReference"}}},"SetText":{"method":"setText","parameter":{"text":{"name":"text","index":0,"type":"String"},"keepKey":{"name":"keepKey","index":1,"type":"Boolean"}}},"setTextKey":{"method":"setTextKey","parameter":{"key":{"name":"key","index":0,"type":"String"}}},"SetVisible":{"method":"setVisible","parameter":{"value":{"name":"value","index":0,"type":"Boolean"}}},"setWordWrap":{"method":"setWordWrap","parameter":{"wordWrap":{"name":"wordWrap","index":0,"type":"Boolean"}}}}
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