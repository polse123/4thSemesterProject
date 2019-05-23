/*global define,brease,console,Promise,CustomEvent,_,$*/
define(['brease/core/BaseWidget',
    'brease/decorators/LanguageDependency',
    'brease/decorators/MeasurementSystemDependency',
    'brease/enum/Enum',
    'brease/core/Types',
    'brease/datatype/Node',
    'widgets/brease/NumPad/NumPad',
    'brease/events/BreaseEvent',
    'brease/config/NumberFormat',
    'widgets/brease/NumericInput/libs/Config',
    'brease/core/Utils',
    'widgets/brease/common/libs/BoxLayout'],
    function (SuperClass,
        languageDependency,
        measurementSystemDependency,
        Enum,
        Types,
        Node,
        NumPad,
        BreaseEvent,
        NumberFormat,
        Config,
        Utils,
        BoxLayout) {
        'use strict';

        /**
        * @class widgets.brease.NumericInput
        * #Description
        * Input field for numeric values  
        * To edit values, an window for numeric input (=NumPad) will be shown  
        *
        * @extends brease.core.BaseWidget
        * @requires widgets.brease.NumPad
        *
        * @aside example numinout
        *
        * @iatMeta category:Category
        * Numeric
        * @iatMeta description:short
        * Eingabe eines Wertes
        * @iatMeta description:de
        * Ermöglicht dem Benutzer einen numerischen Wert einzugeben
        * @iatMeta description:en
        * Enables the user to enter a numeric value
        */

        /**
        * @htmltag examples
        * ##Configuration examples:
        *
        * Enabled:
        *
        *     <div id="numInput01" data-brease-widget="widgets/brease/NumericInput" data-brease-options="{'numpadPosition':'right'}"></div>
        *
        * Disabled:
        *
        *     <div id="numInput02" data-brease-widget="widgets/brease/NumericInput" data-brease-options="{'enable':false}"></div>
        *
        */

        var DEFAULT_UNIT_EDIT_MODE = "unit";

        var defaultSettings = Config;

        var WidgetClass = SuperClass.extend(function NumericInput() {
            SuperClass.apply(this, arguments);
        }, defaultSettings);

        var p = WidgetClass.prototype;

        p.init = function () {
            if (this.settings.omitClass !== true) {
                this.addInitialClass('breaseNumericInput');
            }

            var separators = brease.user.getSeparators();

            // Add deferred objects
            this.measurementSystemChangePromise = null;
            this.unitChangePromise = null;
            this.nodeChangeResolve = null;
            this.numPadReadyResolve = null;

            // extend settings
            this.settings.tabIndex = 1;
            this.settings.regexp = new RegExp("^\\s*(\\+|-)?((\\d+(\\" + separators.dsp + "\\d+)?)|(\\d+(\\" +
                separators.dsp + ")?))\\s*$");
            this.settings.unitSymbol = "";
            this.settings.nodeObject = _createNodeObject(this, this.settings.node);
            this.settings.unitObject = _parseObject(this, this.settings.unit);
            this.settings.formatObject = _parseObject(this, this.settings.format);
            this.settings.readonly = Types.parseValue(this.settings.readonly, 'Boolean', { default: false });

            _initDom(this);
            _initEventHandler(this);

            // apply settings
            _renderUnitAlign(this);
            _updateUnitAndValue(this);
            _updateLangDependency(this);


            SuperClass.prototype.init.call(this);
        };

        //#region getter / setter

        /**
        * Sets value with unit for node binding.
        * @method setNode
        * @param {brease.datatype.Node} node The node to be set
        */
        p.setNode = function (node) {
            if (Utils.isObject(node)) {

                // Update nodeObject
                if (!this.settings.nodeObject) {
                    this.settings.nodeObject = _createNodeObject(this, node);
                }
                else {
                    // round value to decimal places of format
                    var roundValue = _roundValue(this, node.value);

                    this.settings.nodeObject.setValue(roundValue);
                    this.settings.nodeObject.setMinValue(node.minValue);
                    this.settings.nodeObject.setMaxValue(node.maxValue);
                    this.settings.nodeObject.setUnit(node.unit);
                }

                // If unit of node is not configured unit, request new value for node,
                //  otherwise resolve node change
                var currentUnit = _getUnitCommonCode(this);
                if (this.settings.nodeObject.unit && currentUnit && this.settings.nodeObject.unit !== currentUnit) {
                    this.sendNodeChange({
                        attribute: "node",
                        nodeAttribute: "unit",
                        value: currentUnit
                    });
                }
                else if (this.nodeChangeResolve) {
                    this.nodeChangeResolve();
                }
            }
            else {
                this.settings.nodeObject = null;
            }
            _renderValue(this);
        };

        /**
        * Returns value with unit of node binding.
        * @method getNode 
        * @return {brease.datatype.Node} The current node of the widget
        */
        p.getNode = function () {
            if (!this.settings.nodeObject) {
                // A&P 574960:  OneWayToSource-Binding with node doesn't work
                // Always send a node back to the server, even if server does not set the node in the widget.
                return new Node(this.getValue(),
                    _getUnitCommonCode(this), this.getMinValue(), this.getMaxValue());
                // END A&P 574960
            }
            return this.settings.nodeObject;
        };


        /**
        * @method setValue
        * @iatStudioExposed
        * Sets value which is displayed in the widget.
        * @param {Number} value The value to be set
        */
        p.setValue = function (value) {
            // A&P 512985:  NumericOutput does not update BOOL value binding, value always 0
            if (typeof value === "boolean") {
                value = Number(value);
            }
            // END_A&P 512985: NumericOutput does not update BOOL value binding, value always 0

            // round value to decimal places of format
            var roundValue = _roundValue(this, value);

            // set value
            var nodeObj = this.settings.nodeObject;
            if (nodeObj) {
                nodeObj.setValue(roundValue);
            }
            else {
                this.settings.value = roundValue;
            }

            // render value
            _renderValue(this);
        };

        /**
        * Gets value which is displayed in the widget.
        * @method getValue
        * @return {Number} value
        */
        p.getValue = function () {
            if (this.settings.nodeObject) {
                if (this.settings.nodeObject.getValue() !== null) {
                    return this.settings.nodeObject.getValue();
                }
                return brease.settings.noValueString;
            }
            return this.settings.value;
        };

        /**
       * Sets the minimum permissible value for value binding. 
       * @method setMinValue
       * @param {Number} minValue The minValue to be set
       */
        p.setMinValue = function (minValue) {
            var nodeObj = this.settings.nodeObject;
            if (nodeObj) {
                nodeObj.setMinValue(minValue);
            }
            else {
                this.settings.minValue = minValue;
            }
        };

        /**
        * Gets the minimum permissible value for value binding.
        * @method getMinValue 
        * @return {Number} minValue
        */
        p.getMinValue = function () {
            if (this.settings.nodeObject) {
                return this.settings.nodeObject.getMinValue();
            }

            return this.settings.minValue;
        };

        /**
        * @method setMaxValue
        * Sets the maximum permissible value for value binding. 
        * @param {Number} maxValue
        */
        p.setMaxValue = function (maxValue) {
            var nodeObj = this.settings.nodeObject;
            if (nodeObj) {
                nodeObj.setMaxValue(maxValue);
            }
            else {
                this.settings.maxValue = maxValue;
            }
        };

        /**
        * @method getMaxValue 
        * Gets the maximum permissible value for value binding.
        * @return {Number}
        */
        p.getMaxValue = function () {
            if (this.settings.nodeObject) {
                return this.settings.nodeObject.getMaxValue();
            }

            return this.settings.maxValue;
        };


        /**
        * @method setEllipsis
        * Sets if a text that is too long should be symbolized using ellipsis points.
        * @param {Boolean} ellipsis
        */
        p.setEllipsis = function (ellipsis) {
            this.settings.ellipsis = Types.parseValue(ellipsis, 'Boolean', { default: false });
            _renderEllipsis(this);
        };

        /**
        * @method getEllipsis 
        * Gets if a text that is too long should be symbolized using ellipsis points.
        * @return {Boolean}
        */
        p.getEllipsis = function () {
            return this.settings.ellipsis;
        };


        /**
        * @method setFormat
        * Sets the number format for the widget.
        * @param {brease.config.MeasurementSystemFormat} format
        */
        p.setFormat = function (format) {

            if (format) {
                this.settings.format = format;
                this.settings.formatObject = _parseObject(this, format);
                _renderValue(this);
            }
            _updateLangDependency(this);
        };

        /**
        * @method getFormat 
        * Gets the number format for the widget.
        * @return {brease.config.MeasurementSystemFormat}
        */
        p.getFormat = function () {
            return this.settings.format;
        };


        /**
        * @method setKeyboard
        * Sets if the standard keyboard is used for entries.
        * @param {Boolean} keyboard
        */
        p.setKeyboard = function (keyboard) {
            this.settings.keyboard = keyboard;
            if (keyboard) {
                // dispose hardware keyboard events
                _removeKeyboardEventHandler(this);
                // init numpad
                var self = this;
                _createNumPadAsync(this).then(function () {
                    self.numPadReadyResolve = null;
                });
            }
            else {
                // dispose numpad
                _disposeNumPad(this);
                // init hardware keyboard
                _initKeyboardEventHandler(this);
            }
        };

        /**
        * @method getKeyboard 
        * Gets if the standard keyboard is used for entries.
        * @return {Boolean}
        */
        p.getKeyboard = function () {
            return this.settings.keyboard;
        };


        /**
        * @method setLimitViolationPolicy
        * Sets the behavior in case of a value range violation
        * @param {brease.enum.LimitViolationPolicy} limitViolationPolicy
        */
        p.setLimitViolationPolicy = function (limitViolationPolicy) {
            this.settings.limitViolationPolicy = limitViolationPolicy;
        };

        /**
        * @method getLimitViolationPolicy 
        * Returns the behavior in case of a value range violation.
        * @return {brease.enum.LimitViolationPolicy}
        */
        p.getLimitViolationPolicy = function () {
            return this.settings.limitViolationPolicy;
        };


        /**
        * @method setNumPadStyle
        * Sets reference to a customizable numeric pad style.
        * @param {String} numPadStyle
        */
        p.setNumPadStyle = function (numPadStyle) {
            this.settings.numPadStyle = numPadStyle;
        };

        /**
        * @method getNumPadStyle 
        * Gets reference to a customizable numeric pad style..
        * @return {String}
        */
        p.getNumPadStyle = function () {
            return this.settings.numPadStyle;
        };


        /**
        * @method setNumpadPosition
        * Sets the position of the number pad, relative to the widget.
        * @param {brease.enum.Position} numpadPosition
        */
        p.setNumpadPosition = function (numpadPosition) {
            this.settings.numpadPosition = numpadPosition;

        };

        /**
        * @method getNumpadPosition 
        * Returns the position of the number pad, relative to the widget.
        * @return {brease.enum.Position}
        */
        p.getNumpadPosition = function () {
            return this.settings.numpadPosition;
        };


        /**
        * @method setShowUnit
        * Sets whether the unit should be displayed.
        * @param {Boolean} showUnit
        */
        p.setShowUnit = function (showUnit) {
            this.settings.showUnit = showUnit;
            _renderShowUnit(this);
        };

        /**
        * @method getShowUnit 
        * Gets whether the unit should be displayed.
        * @return {Boolean}
        */
        p.getShowUnit = function () {
            return this.settings.showUnit;
        };


        /**
        * Sets if changes, such as entry of a different value, should be submitted to the server immediately.
        * @method setSubmitOnChange
        * @param {Boolean} submitOnChange The submitOnChange value to be set
        */
        p.setSubmitOnChange = function (submitOnChange) {
            this.settings.submitOnChange = submitOnChange;
        };

        /**
        * Gets if changes, such as entry of a different value, should be submitted to the server immediately.
        * @method getSubmitOnChange 
        * @return {Boolean} Current submitOnChange value
        */
        p.getSubmitOnChange = function () {
            return this.settings.submitOnChange;
        };


        /**
        * Sets the unit format for the widget.
        * @method setUnit
        * @param {brease.config.MeasurementSystemUnit} unit The unit value to be set
        */
        p.setUnit = function (unit) {
            this.settings.unit = unit;
            this.settings.unitObject = _parseObject(this, unit);
            _updateLangDependency(this);

            var self = this;
            self.unitChangePromise = _processUnitChangeAsync(this);
            self.unitChangePromise.then(function () {
                self.unitChangePromise = null;
            });
        };

        /**
        * Returns the unit format for the widget.
        * @method getUnit 
        * @return {brease.config.MeasurementSystemUnit} Current unit value
        */
        p.getUnit = function () {
            return this.settings.unit;
        };

        /**
        * Sets the position of the unit.
        * @method setUnitAlign
        * @param {brease.enum.ImageAlign} unitAlign The unitAlign value to be set
        */
        p.setUnitAlign = function (unitAlign) {
            this.settings.unitAlign = unitAlign;
            _renderUnitAlign(this);
            _renderUnitWidth(this);
        };

        /**
        * Gets the position of the unit.
        * @method getUnitAlign 
        * @return {brease.enum.ImageAlign} Current unitAlign value
        */
        p.getUnitAlign = function () {
            return this.settings.unitAlign;
        };


        /**
        * Sets the minimum width of the unit's area.
        * @method setUnitWidth 
         * @param {Size} value The unitWidth value to be set
        */
        p.setUnitWidth = function (value) {
            this.settings.unitWidth = value;
            _renderUnitWidth(this);
        };

        /**
        * Gets the minimum width of the unit's area.
        * @method getUnitWidth 
        * @return {Size} Current unitWidth value
        */
        p.getUnitWidth = function () {
            return this.settings.unitWidth;
        };

        /**
        * Sets whether number grouping should take place.
        * @method setUseDigitGrouping
        * @param {Boolean} useDigitGrouping The useDigitGrouping value to be set
        */
        p.setUseDigitGrouping = function (useDigitGrouping) {
            this.settings.useDigitGrouping = useDigitGrouping;
            _renderValue(this);
        };

        /**
        * Gets whether number grouping should take place.
        * @method getUseDigitGrouping 
        * @return {Boolean} Current useDigitGrouping value
        */
        p.getUseDigitGrouping = function () {
            return this.settings.useDigitGrouping;
        };

        /**
        * Sets whether the widget is readonly or not.
        * @method setReadonly
        * @param {Boolean} value The readonly value to be set
        */
        p.setReadonly = function (value) {
            this.settings.readonly = value;
            if (value) {
                // dispose hardware keyboard listener and NumPad
                this.inputEl.off('focusin', this._bind('_onFocusIn'));
                this.inputEl.off('focusout', this._bind('_onFocusOut'));
                _disposeNumPad(this);
            }
            else {
                this.setKeyboard(this.getKeyboard());
            }
        };

        /**
        * Gets whether the widget is readonly or not.
        * @method getReadonly 
        * @return {Boolean} Current readonly value
        */
        p.getReadonly = function () {
            return this.settings.readonly;
        };

        //#endregion getter / setter

        //#region Actions

        /**
        * @method submitChange
        * @iatStudioExposed
        * Send value to the server, if binding for this widget exists.  
        * Usage of this method will only make sense, if submitOnChange=false, as otherwise changes are submitted automatically.
        */
        p.submitChange = function () {
            // A&P 574960:  OneWayToSource-Binding with node doesn't work
            // Always send a node back to the server, even if server does not set the node in the widget.
            var nodeObject = this.settings.nodeObject ? this.settings.nodeObject : new Node(this.getValue(),
                _getUnitCommonCode(this), this.getMinValue(), this.getMaxValue());
            // END A&P 574960
            this.sendValueChange({
                value: this.getValue(),
                node: nodeObject
            });
            /**
            * @event ValueChanged
            * @param {Number} value
            * @iatStudioExposed
            * Fired when index changes.
            */
            var ev = this.createEvent('ValueChanged', { value: this.getValue() });
            ev.dispatch();
        };

        //#endregion Actions

        //#region Events
        function _dispatchChangeEvent(widget) {
            /**
            * @event change
            * Fired when value is changed by user    
            * @param {Number} value
            * See at {@link brease.events.BreaseEvent#static-property-CHANGE BreaseEvent.CHANGE} for event type  
            * @eventComment
            */
            widget.dispatchEvent(new CustomEvent(BreaseEvent.CHANGE, { detail: { value: widget.getValue() } }));
        }
        //#endregion Events

        //#region overriden methods

        p.setEditable = function (editable, metaData) {
            if (metaData !== undefined && metaData.refAttribute !== undefined) {
                var refAttribute = metaData.refAttribute;
                if (refAttribute === 'value' || refAttribute === 'node') {
                    this.settings.editable = editable;
                    this._internalEnable();
                }
            }
        };

        p.disable = function () {
            if (this.getKeyboard() === false || this.getReadonly()) {
                this.inputEl.attr('tabindex', -1);
            }
            SuperClass.prototype.disable.apply(this, arguments);
        };

        p.enable = function () {
            if (this.getKeyboard() === false && this.getReadonly() === false) {
                this.inputEl.attr('tabindex', this.settings.tabIndex);
            }
            SuperClass.prototype.enable.apply(this, arguments);
        };

        p._clickHandler = function (e) {
            this._handleEvent(e);
            if (!this.isDisabled && !this.getReadonly() && this.getKeyboard() && brease.config.editMode !== true) {
                this._showNumPad(this);
            }
            SuperClass.prototype._clickHandler.call(this, e);
        };

        p.dispose = function () {
            _disposeNumPad(this);
            this.inputEl.off();
            this.inputEl.off('change', this._bind('_inputChangeHandler'));
            $(document).off(BreaseEvent.CLICK, this._bind('_documentClickHandler'));
            SuperClass.prototype.dispose.apply(this, arguments);
        };

        //#endregion overrides methods

        //#region decorator functions

        p.langChangeHandler = function (e) {
            _updateUnitAndValue(this);
        };

        p.measurementSystemChangeHandler = function () {
            var self = this;
            self.measurementSystemChangePromise = _processUnitChangeAsync(this);
            self.measurementSystemChangePromise.then(function () {
                self.measurementSystemChangePromise = null;
            });
        };

        //#endregion decorator functions

        //#region promise helper functions

        p.isMeasurementSystemChangeDone = function () {
            if (!this.measurementSystemChangePromise) {
                return true;
            }
            return false;
        };

        p.isUnitChangeDone = function () {
            if (!this.unitChangePromise) {
                return true;
            }
            return false;
        };

        //#endregion promise helper functions

        //#region legacy public functions

        p.writeUnit = function (symbol) {
            this.settings.unitSymbol = symbol;
            _renderUnitSymbol(this);
        };

        p.showValue = function () {
            _renderValue(this);
        };

        p.showUnit = function () {
            _updateUnitAndValue(this);
        };

        p.processMeasurementSystemUpdate = function () {
            this.measurementSystemChangeHandler();
        };

        /**
        * Reset value to the value given by the server.<br/>This will only make sense, if submitOnChange=false
        * @method resetValue
        */
        p.resetValue = function () {
            this.setValue(this.settings.nodeObject.getValue());
        };

        //#endregion legacy public functions

        //#region hardware keyboard functions

        p._onFocusIn = function (e) {
            if (this.isDisabled === true) {
                this.inputEl.blur();
            } else {
                $(document).on(BreaseEvent.CLICK, this._bind('_documentClickHandler'));

                this.inputEl[0].focus();
                this.inputEl[0].addEventListener('keypress', this._bind('_onKeyPress'));
                this.inputEl[0].addEventListener('keyup', this._bind('_onKeyUp'));
                this.el.addClass('active');
            }
        };

        p._onFocusOut = function (e) {

            var newValue = brease.formatter.parseFloat(this.inputEl.val(), brease.user.getSeparators());

            newValue = _validateValue(this, newValue, this.getValue());

            this.setValue(newValue);
            _dispatchChangeEvent(this);
            if (this.getSubmitOnChange() === true || this.forceSend === true) {
                this.submitChange();
            }
            this.forceSend = false;
            this.removeFocus();
        };

        p._onKeyUp = function (e) {
            var pattern = new RegExp("\\" + brease.user.getSeparators().gsp, "g");
            var newValue = this.inputEl.val().replace(pattern, '');
            if (newValue !== '' && newValue !== '-' && newValue !== '+' && this.settings.regexp !== undefined &&
                this.settings.regexp.test(newValue) === false) {
                this.inputEl.val(this.oldValue);
            }
        };

        p._onKeyPress = function (e) {
            var code = e.keyCode || e.which;
            if (code === 13) { // 13 Enter keycode
                this.forceSend = true;
                this.inputEl.blur();
                return;
            }
            this.oldValue = this.inputEl.val();
        };

        p._documentClickHandler = function (e) {
            if ($.containsOrEquals(this.elem, e.target) === false) {
                this.inputEl.blur();
            }
        };

        p.removeFocus = function () {
            this.inputEl[0].removeEventListener('keypress', this._bind('_onKeyPress'));
            this.inputEl[0].removeEventListener('keyup', this._bind('_onKeyUp'));
            $(document).off(BreaseEvent.CLICK, this._bind('_documentClickHandler'));
            this.el.removeClass('active');
        };

        //#endregion hardware keyboard functions

        //#region NumPad functions

        p._showNumPad = function () {
            if (_isNumPadReady(this)) {
                this._generateNumPadSettings();
                _initNumPadEvents(this);
                this.numPad.show(this.numPadSettings, this.elem);
                this.el.addClass('active');
            }
        };

        p._hideNumPad = function () {
            if (_isNumPadReady(this)) {
                this.numpad.hide();
            }
        };

        p._generateNumPadSettings = function () {
            this.numPadSettings = {
                minValue: this.getMinValue(),
                maxValue: this.getMaxValue(),
                value: this.getValue(),
                useDigitGrouping: this.getUseDigitGrouping(),
                limitViolationPolicy: this.getLimitViolationPolicy(),
                position: {
                    horizontal: this.getNumpadPosition(),
                    vertical: this.getNumpadPosition()
                },
                pointOfOrigin: 'element',
                arrow: {
                    position: (this.getNumpadPosition() === 'left') ? 'right' : 'left'
                },
                header: this.settings.header,
                format: this.settings.formatObject
            };

            if (this.settings.numPadStyle) {
                this.numPadSettings.style = this.settings.numPadStyle;
            }
        };

        p.numPadReadyHandler = function (e) {
            if (e.target.id === 'breaseNumPad') {
                document.body.removeEventListener(BreaseEvent.WIDGET_READY, this._bind('numPadReadyHandler'));
                if (this.numPadReadyResolve) {
                    this.numPadReadyResolve();
                }
            }
        };

        p._onNumPadClose = function () {
            _removeNumPadEvents(this);
            this.el.removeClass('active');
        };

        p._onNumPadSubmit = function (event) {
            this.setValue(event.detail.value);
            _dispatchChangeEvent(this);
            if (this.getSubmitOnChange()) {
                this.submitChange();
            }
        };

        //#endregion NumPad functions

        //#region Event handler

        p._inputChangeHandler = function (e) {
            e.stopPropagation();
        };

        //#endregion Event handler

        //#region protected methods
        p._createInputEl = function () {
            var inputOptions = {
                value: '',
                type: 'text',
                autocomplete: 'off',
                tabindex: (this.getKeyboard() === false && this.getReadonly() === false) ? this.settings.tabIndex : -1
            };
            if (this.getKeyboard() || this.getReadonly()) {
                inputOptions.readonly = 'readonly';
            }

            var inputEl = $('<input/>').attr(inputOptions);

            if (this.getKeyboard() !== true) {
                inputEl.addClass('keyboard');
            }

            return inputEl;
        };

        p._createUnitEl = function () {
            return $('<span></span>')
                .addClass('breaseNumericInput_unit');
        };
        //#endregion protected methods

        //#region private methods

        function _initDom(widget) {

            widget.inputEl = widget._createInputEl();

            widget.unitEl = widget._createUnitEl();

            // Create boxes
            widget.inputBox = BoxLayout.createBox();
            widget.inputBox.classList.add("box-input");

            widget.unitBox = BoxLayout.createBox();
            widget.unitBox.classList.add("box-unit");

            // Add items to boxes
            widget.inputBox.appendChild(widget.inputEl.get(0));
            widget.unitBox.appendChild(widget.unitEl.get(0));

            widget.boxContainer = BoxLayout.createBoxContainer();
            widget.boxContainer.appendChild(widget.inputBox);
            widget.boxContainer.appendChild(widget.unitBox);

            widget.setShowUnit(widget.getShowUnit());
            widget.setEllipsis(widget.getEllipsis());
            widget.setKeyboard(widget.getKeyboard());

            // Add items to widget
            widget.elem.appendChild(widget.boxContainer);
        }

        function _initEventHandler(widget) {
            widget.inputEl.on('change', widget._bind('_inputChangeHandler'));
        }

        function _initKeyboardEventHandler(widget) {
            widget.inputEl.on('focusin', widget._bind('_onFocusIn'));
            widget.inputEl.on('focusout', widget._bind('_onFocusOut'));
        }

        function _removeKeyboardEventHandler(widget) {
            widget.inputEl.off('focusin', widget._bind('_onFocusIn'));
            widget.inputEl.off('focusout', widget._bind('_onFocusOut'));
        }

        function _createNodeObject(widget, nodeJson) {
            if (nodeJson) {
                // round value to decimal places of format
                var roundValue = _roundValue(widget, nodeJson.value);
                return new Node(roundValue, nodeJson.unit, nodeJson.minValue, nodeJson.maxValue, nodeJson.id);
            }
            return null;
        }

        //#region render functions

        function _renderValue(widget) {
            var value = widget.getValue();
            var numberFormat = _getNumberFormat(widget);
            if (numberFormat.decimalPlaces !== undefined && Utils.isNumeric(value)) {
                widget.inputEl.val(brease.formatter.formatNumber(value, numberFormat,
                    widget.getUseDigitGrouping(), brease.user.getSeparators()));
            }
            else {
                widget.inputEl.val(brease.settings.noValueString);
            }
        }

        function _renderUnitSymbol(widget) {
            if (brease.config.editMode && !$.isEmptyObject(widget.settings.unitObject)) {
                widget.unitEl.text(DEFAULT_UNIT_EDIT_MODE);
            }
            else {
                widget.unitEl.text(widget.settings.unitSymbol || "");
            }
            _renderUnitWidth(widget);
        }

        function _renderShowUnit(widget) {
            if (widget.settings.showUnit === false) {
                widget.unitBox.style.display = 'none';
            }
            else {
                widget.unitBox.style.display = 'flex';
            }
            _renderUnitWidth(widget);
        }

        function _renderEllipsis(widget) {
            if (widget.settings.ellipsis) {
                widget.el.addClass('ellipsis');
            }
            else {
                widget.el.removeClass('ellipsis');
            }
        }

        function _renderUnitAlign(widget) {
            widget.el.removeClass('unitAlign-left');
            widget.el.removeClass('unitAlign-right');
            widget.el.removeClass("unitAlign-top");
            widget.el.removeClass("unitAlign-bottom");
            switch (widget.settings.unitAlign) {
                case Enum.ImageAlign.right:
                    BoxLayout.setOrientation(widget.boxContainer, Enum.Orientation.LTR);
                    widget.el.addClass("unitAlign-right");
                    break;
                case Enum.ImageAlign.top:
                    BoxLayout.setOrientation(widget.boxContainer, Enum.Orientation.BTT);
                    widget.el.addClass("unitAlign-top");
                    break;
                case Enum.ImageAlign.bottom:
                    BoxLayout.setOrientation(widget.boxContainer, Enum.Orientation.TTB);
                    widget.el.addClass("unitAlign-bottom");
                    break;
                default:
                    BoxLayout.setOrientation(widget.boxContainer, Enum.Orientation.RTL);
                    widget.el.addClass("unitAlign-left");
                    break;
            }
        }

        function _renderUnitWidth(widget) {
            var unitWidth = widget.getUnitWidth();
            if (!_setUnitWidthAllowed(widget, unitWidth)) {
                widget.inputBox.style.width = "";
                widget.unitBox.style.flex = "";
                return;
            }

            var inputValue = "";
            var unitFlexValue = "";
            var unitWidthValue = unitWidth;

            if (unitWidth !== undefined && unitWidth !== "") {
                if (!isNaN(unitWidth)) {
                    unitWidthValue = unitWidth + "px";
                }
                else if (unitWidth.endsWith("%")) {
                    // Set input width according to 100% - [unit width]
                    var percentValue = unitWidth.substring(0, unitWidth.length - 1);
                    if (!isNaN(percentValue)) {
                        inputValue = 100 - parseFloat(percentValue);
                        if (inputValue < 0) {
                            inputValue = 0;
                        }
                        inputValue = inputValue + "%";
                    }
                }
                unitFlexValue = "0 0 " + unitWidthValue;
            }

            widget.inputBox.style.width = inputValue;
            widget.unitBox.style.flex = unitFlexValue;
        }

        //#endregion render functions

        function _validateValue(self, newValue, oldValue) {

            if (isNaN(newValue)) {
                newValue = oldValue;
            }

            if (newValue > self.getMaxValue() || newValue < self.getMinValue()) {
                switch (self.getLimitViolationPolicy()) {
                    case Enum.LimitViolationPolicy.SET_TO_LIMIT:
                    case Enum.LimitViolationPolicy.SET_TO_LIMIT_AND_SUBMIT: {
                        if (newValue > self.getMaxValue()) {
                            newValue = self.getMaxValue();
                        }
                        if (newValue < self.getMinValue()) {
                            newValue = self.getMinValue();
                        }
                        break;
                    }
                    case Enum.LimitViolationPolicy.SUBMIT_ALL:
                        break;
                    default: {
                        newValue = oldValue;
                        break;
                    }
                }
            }
            return newValue;
        }

        function _setUnitWidthAllowed(widget, unitWidth) {
            if (widget.getShowUnit() === false ||
                !widget.unitEl.text() ||
                widget.getUnitAlign() === Enum.ImageAlign.top ||
                widget.getUnitAlign() === Enum.ImageAlign.bottom ||
                unitWidth <= 0) {
                return false;
            }
            return true;
        }

        function _getNumberFormat(widget) {
            var numberFormat = null;
            var mms = brease.measurementSystem.getCurrentMeasurementSystem();
            if (widget.settings.formatObject) {
                numberFormat = NumberFormat.getFormat(widget.settings.formatObject, mms);
            }
            else {
                numberFormat = NumberFormat.getFormat({}, mms);
            }

            return numberFormat;
        }

        function _roundValue(widget, value) {
            var numberFormat = _getNumberFormat(widget);
            var roundValue = value;
            if (Utils.isNumeric(value)) {
                roundValue = Math.roundTo(value, numberFormat.decimalPlaces);
            }
            else {
                roundValue = brease.settings.noValueString;
            }
            return roundValue;
        }

        function _getUnitCommonCode(widget) {
            var unitObj = widget.settings.unitObject;
            if (unitObj) {
                return unitObj[brease.measurementSystem.getCurrentMeasurementSystem()];
            }
            return null;
        }

        function _parseObject(widget, variable) {
            if (Utils.isObject(variable) || variable === null) {
                return variable;
            } else if (brease.language.isKey(variable)) {
                try {
                    var unitTextKey = brease.language.parseKey(variable);
                    return JSON.parse(brease.language.getTextByKey(unitTextKey).replace(/\'/g, '"'));
                } catch (error) {
                    console.iatWarn(widget.elem.id + ': String "' + variable + '" is invalid!');
                }
            } else if (Utils.isString(variable)) {
                try {
                    return JSON.parse(variable.replace(/\'/g, '"'));
                } catch (error) {
                    console.iatWarn(widget.elem.id + ': String "' + variable + '" is invalid!');
                }
            }
            return null;
        }

        function _updateLangDependency(widget) {
            if (brease.language.isKey(widget.getUnit()) || brease.language.isKey(widget.getFormat())) {
                widget.setLangDependency(true);
            }
            else {
                widget.setLangDependency(false);
            }
        }

        function _updateUnitAndValue(widget) {
            _getUnitSymbolAsync(widget).then(function () {
                _renderUnitSymbol(widget);
                _renderValue(widget);
            });
        }

        function _createNumPadAsync(widget) {
            if (!widget.numPad) {
                widget.numPad = new NumPad();
            }

            var numPadReadyPromise = new Promise(function (resolve, reject) {
                widget.numPadReadyResolve = resolve;
                if (_isNumPadReady(widget)) {
                    widget.numPadReadyResolve();
                } else {
                    document.body.addEventListener(BreaseEvent.WIDGET_READY, widget._bind('numPadReadyHandler'));
                }
            });

            return numPadReadyPromise;
        }

        function _isNumPadReady(widget) {
            if (widget.numPad && widget.numPad.state === Enum.WidgetState.READY) {
                return true;
            }
            return false;
        }

        function _initNumPadEvents(widget) {
            widget.numPad.addEventListener(BreaseEvent.CLOSED, widget._bind('_onNumPadClose'));
            widget.numPad.addEventListener(BreaseEvent.SUBMIT, widget._bind('_onNumPadSubmit'));
        }

        function _removeNumPadEvents(widget) {
            widget.numPad.removeEventListener(BreaseEvent.CLOSED, widget._bind('_onNumPadClose'));
            widget.numPad.removeEventListener(BreaseEvent.SUBMIT, widget._bind('_onNumPadSubmit'));
        }

        function _disposeNumPad(widget) {
            if (widget.numPad && widget.numPad.elem) {
                _removeNumPadEvents(widget);
                widget.numPad = null;
            }
        }

        //#region async methods
        function _processUnitChangeAsync(widget) {
            var getUnitSymbolPromise = _getUnitSymbolAsync(widget);
            var nodeChangePromise = _sendNodeChangeAsync(widget);

            var promiseArray = [
                getUnitSymbolPromise,
                nodeChangePromise
            ];

            return Promise.all(promiseArray)
                .then(function (values) {
                    widget.nodeChangeResolve = null;
                    getUnitSymbolPromise = null;

                    _renderUnitSymbol(widget);
                    _renderValue(widget);
                });
        }

        function _sendNodeChangeAsync(widget) {
            return new Promise(function (resolve, reject) {
                widget.nodeChangeResolve = resolve;
                // Update node value for new unit
                var nodeObj = widget.settings.nodeObject;
                var unitCommonCode = _getUnitCommonCode(widget);
                if (nodeObj && nodeObj.getUnit() && unitCommonCode && nodeObj.getUnit() !== unitCommonCode) {
                    // setting node.unit is neccassary, because changing measurement system when widget is suspended and "wake"
                    //  is called  again, the binding controller is calling "getNode" method to determine current unit of
                    //  new measurement system
                    widget.settings.nodeObject.unit = unitCommonCode;
                    widget.sendNodeChange({
                        attribute: "node",
                        nodeAttribute: "unit",
                        value: unitCommonCode
                    });
                } else {
                    resolve();
                }
            });

        }

        function _getUnitSymbolAsync(widget) {
            return new Promise(function (resolve, reject) {
                var unitCommonCode = _getUnitCommonCode(widget);
                if (unitCommonCode) {
                    brease.language.pipeAsyncUnitSymbol(unitCommonCode, function (symbol) {
                        widget.settings.unitSymbol = symbol;
                        resolve(symbol);
                    });
                }
                else {
                    widget.settings.unitSymbol = "";
                    resolve("");
                }
            });
        }
        //#endregion async methods

        //#endregion private methods

        return measurementSystemDependency.decorate(languageDependency.decorate(WidgetClass, false), true);

    });