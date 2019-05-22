define(function (require) {

    'use strict';

    var SuperClass = require('brease/core/BaseWidget'),
        BreaseEvent = require('brease/events/BreaseEvent'),
        Renderer = require('widgets/brease/Paper/libs/Renderer'),

    /**
    * @class widgets.brease.Paper
    * #Description
	* This widget allows the displaying and modification of svg contents at runtime.
    * @extends brease.core.BaseWidget
    *
    * @iatMeta category:Category
	* Drawing
	* @iatMeta description:short
	* SVG display and modification
	* @iatMeta description:de
	* Ermöglicht die Darstellung und Modifikation von SVG-Inhalten zur Laufzeit.
	* @iatMeta description:en
	* Allows the displaying and modification of svg contents at runtime.
	*/

    /**
    * @cfg {ColorList} colorList='#FFCC66,#FF8800,#FFCC99,#993333'
    * @iatStudioExposed
    * @iatCategory Appearance
    * List of possible colors to apply to svg elements.
    */

    /**
    * @cfg {UInteger} transitionTime=500
    * @iatStudioExposed
    * @bindable
    * @iatCategory Behavior
    * Default execution time of any svg transformation.
    */

    /**
    * @cfg {ImagePath} svgFilePath=''
    * @iatStudioExposed
    * @bindable
    * @iatCategory Data
    * Path to a .svg file which should be displayed on the widget.
    */

    /**
    * @cfg {String} svgContent=''
    * @iatStudioExposed
    * @bindable
    * @iatCategory Data
    * Additional svg string content to display on the widget.
    */

    /**
    * @cfg {String} transform=''
    * @iatStudioExposed
    * @bindable
    * @not_projectable
    * @iatCategory Data
    * Array of strings which contains commands to modify the existings svg elements.
    */

    /**
	* @cfg {UNumber} minZoomLevel=20
	* @iatStudioExposed
    * @iatCategory Behavior
	* Defines in percentage the lower limit of the zoom in the Paper area (100 means no zoom level applied)
	*/

    /**
	* @cfg {UNumber} maxZoomLevel=500
	* @iatStudioExposed
    * @iatCategory Behavior
	* Defines in percentage the upper limit of the zoom in the Paper area (100 means no zoom level applied)
	*/

	defaultSettings = {
	    svgFilePath: '',
	    svgContent: '',
	    transform: '',
	    colorList: '#FFCC66,#FF8800,#FFCC99,#993333',
	    transitionTime: 500,
	    minZoomLevel: 20,
	    maxZoomLevel: 500
	},

	WidgetClass = SuperClass.extend(function Paper() {
	    SuperClass.apply(this, arguments);
	}, defaultSettings),

    p = WidgetClass.prototype;

    p.init = function () {
        this.el.addClass('breasePaper');

        var elemWidth = parseInt($('#' + this.elem.id).css('width'));
        var elemHeigth = parseInt($('#' + this.elem.id).css('height'));
        $(this.el.children('svg.breasePaperSVGContainer')).attr("viewBox", "0 0 " + elemWidth + " " + elemHeigth);

        this.elem.addEventListener(BreaseEvent.WIDGET_READY, this._bind('_widgetReadyHandler'));
        this.settings.colorList = this._parseColorList(this.settings.colorList);
        this.renderer = new Renderer(this, this.settings);
        if (brease.config.editMode) {
            _addPlaceholderImage(this);
        } else {
            this.setSvgFilePath(this.settings.svgFilePath);
            this.setSvgContent(this.settings.svgContent);
        }


        SuperClass.prototype.init.apply(this, arguments);
    };

    /**
    * @method setColorList
    * Sets the list of possible colors to be used for svg element modification.
    * @param {ColorList} colorList
    */
    p.setColorList = function (colorList) {
        this.settings.colorList = this._parseColorList(colorList);
        this.renderer.updateColorList(this.settings.colorList);
    };

    /**
    * @method getColorList
    * Gets the list of possible colors.
    * @return {ColorList} 
    */
    p.getColorList = function () {
        return this.settings.colorList;
    };

    /**
    * @method setTransitionTime
    * Sets the execution time for a svg element transition.
    * @param {UInteger} transitionTime
    */
    p.setTransitionTime = function (transitionTime) {
        this.settings.transitionTime = transitionTime;
        this.renderer.updateTransitionTime(this.settings.transitionTime);
    };

    /**
    * @method getTransitionTime
    * Gets the execution time for a svg element transition
    * @return {UInteger} 
    */
    p.getTransitionTime = function () {
        return this.settings.transitionTime;
    };

    /**
    * @method setSvgFilePath
    * Sets the path to an .svg file which should be displayed.
    * @param {ImagePath} svgFilePath
    */
    p.setSvgFilePath = function (svgFilePath) {
        this.settings.svgFilePath = svgFilePath;
        if (!brease.config.editMode) {
            this.renderer.updateSVG("file", svgFilePath);
        }
    };

    /**
    * @method getSvgFilePath
    * Gets the path to the .svg file.
    * @return {ImagePath}
    */
    p.getSvgFilePath = function () {
        return this.settings.svgFilePath;
    };

    /**
    * @method setSvgContent
    * Set additional svg content to be displayed.
    * @param {String} svgContent
    */
    p.setSvgContent = function (svgContent) {
        this.settings.svgContent = svgContent;
        if (!brease.config.editMode) {
            this.renderer.updateSVG("content", svgContent);
        }
    };

    /**
    * @method getSvgContent
    * Get the additionally added svg content.
    * @return {String}
    */
    p.getSvgContent = function () {
        return this.settings.svgContent;
    };

    /**
    * @method setTransform
    * Sets the String array used to modify the existing svg elements.
    * @param {String} transform
    */
    p.setTransform = function (transform) {
        if (transform) {
            this.settings.transform = transform;
            this.data = JSON.parse(transform.replace(/\'/g, '"'));

            this.renderer.evalTransform(this.data);
        }
    };

    /**
    * @method getTransform
    * Get the string array used to modify the existing svg elements.
    * @return {String} 
    */
    p.getTransform = function () {
        return this.settings.transform;
    };

    /**
    * @method setMinZoomLevel
    * Sets minZoomLevel
    * @param {UNumber} minZoomLevel
    */
    p.setMinZoomLevel = function (minZoomLevel) {
        this.settings.minZoomLevel = minZoomLevel;
    };

    /**
	* @method getMinZoomLevel 
	* Returns minZoomLevel.
	* @return {UNumber}
	*/
    p.getMinZoomLevel = function () {
        return this.settings.minZoomLevel;
    };


    /**
	* @method setMaxZoomLevel
	* Sets maxZoomLevel
	* @param {UNumber} maxZoomLevel
	*/
    p.setMaxZoomLevel = function (maxZoomLevel) {
        this.settings.maxZoomLevel = maxZoomLevel;
    };

    /**
	* @method getMaxZoomLevel 
	* Returns maxZoomLevel
	* @return {UNumber}
	*/
    p.getMaxZoomLevel = function () {
        return this.settings.maxZoomLevel;
    };

    /**
    * @method zoomIn
	* @iatStudioExposed
    * Zoom into the Paper
    */
    p.zoomIn = function () {
        this.renderer.executeActionZoom(1);
    };

    /**
    * @method zoomOut
	* @iatStudioExposed
    * Zoom out of the Paper
    */
    p.zoomOut = function () {
        this.renderer.executeActionZoom(-1);
    };

    /**
    * @method zoomReset
	* @iatStudioExposed
    * Reset the zoom level to 100%
    */
    p.zoomReset = function () {
        this.renderer.executeActionZoom(0);
    };

    p._widgetReadyHandler = function () {
        return false;
    };

    p._parseColorList = function (colorList) {
        return colorList.match(/(((rgba\((((25[0-5])|(2[01234][0-9])|([01][0-9][0-9])|([0-9]{1,2})),(\s)?){3}((0\.[0-9]{1,2})|1(.0)?|0)\)))|([\#]([a-fA-F\d]{6}|[a-fA-F\d]{3})))/g);
    };

    p._customClickHandler = function (e) {
        // _customClickHandler will trigger the click event as regular clicks are not detected on moving elements anymore.
        if (this.isDisabled) {
            return;
        }

        var svgClickPoint = _createSVGPointFromClick(this, e);

        var eventArgs = {
            x: svgClickPoint.x,
            y: svgClickPoint.y,
            origin: brease.uiController.parentWidgetId(e.target),
            elementId: "noElementClicked"
        };

        var clickedElement;

        if (e.type === "vmousedown") {
            clickedElement = document.elementFromPoint(e.clientX, e.clientY);
        }

        if (clickedElement && clickedElement.ownerSVGElement && clickedElement.hasAttribute("id")) {
            eventArgs.elementId = "#" + clickedElement.getAttribute("id");
        }

        /**
       * @event Click
       * @param {Integer} x
       * @param {Integer} y
       * @param {String} origin id of widget that triggered this event
       * @param {String} elementId id of a clicked svg element
       * @iatStudioExposed
       * Fired when widget is clicked
       */
        var clickEv = this.createEvent("Click", eventArgs);
        clickEv.dispatch();
    };

    // overwrite base click handler to prevent it from firing the click event. _mouseUpHandler will do this.
    p._clickHandler = function (e) {
    };

    p._triggerTransformDoneEvent = function (originalSelect) {

        /**
       * @event TransformDone
       * @param {String} select
       * @iatStudioExposed
       * Fired when a transform command has finished execution.
       */

        var ev = this.createEvent('TransformDone', { select: originalSelect });
        ev.dispatch();
    };

    p.dispose = function () {
        this.elem.removeEventListener(BreaseEvent.WIDGET_READY, this._bind('_widgetReadyHandler'));
        clearTimeout(this.renderer.timeout);
        SuperClass.prototype.dispose.apply(this, arguments);
    };


    function _createSVGPointFromClick(widget, e) {
        var svgContainer = $('#' + widget.elem.id + ' svg.breasePaperSVGContainer')[0],
            point = svgContainer.createSVGPoint(),
            widgetWidth = parseInt(widget.el.css("width")),
            widgetHeight = parseInt(widget.el.css("height"));


        if (e.type === "vmousedown") {
            point.x = e.clientX;
            point.y = e.clientY;

            point = point.matrixTransform(svgContainer.getScreenCTM().inverse());

            if (point.x < 0) {
                point.x = 0;
            } else if (point.x > widgetWidth) {
                point.x = widgetWidth;
            }

            if (point.y < 0) {
                point.y = 0;
            } else if (point.y > widgetHeight) {
                point.y = widgetHeight;
            }
        }

        return point;
    }

    function _addPlaceholderImage(widget) {
        widget.el.css('background-image', 'url("widgets/brease/Paper/assets/PaperPlaceholder.svg")');
        widget.el.css('background-repeat', 'no-repeat');
        widget.el.css('background-position', 'center center');
    }

    return WidgetClass;
});
