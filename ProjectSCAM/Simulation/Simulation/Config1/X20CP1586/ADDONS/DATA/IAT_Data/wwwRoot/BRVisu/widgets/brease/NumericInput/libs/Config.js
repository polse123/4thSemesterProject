/*global define*/
define(['brease/enum/Enum'], function (Enum) {

    'use strict';

    /**
    * @class widgets.brease.NumericInput.Config
    * @extends core.javascript.Object
    * @override widgets.brease.NumericInput
    */

    /**
    * @cfg {brease.enum.Position} numpadPosition='right'
    * @iatStudioExposed
    * @iatCategory Appearance
    * Determines the position of the NumPad relative to the input field.
    */

    /**
    * @cfg {Boolean} submitOnChange=true
    * @iatStudioExposed
    * @iatCategory Data
    * Determines if changes, triggered by user input, should be sent immediately to the server.<br/>
    */
    /**
    * @cfg {Number} maxValue=100
    * @iatStudioExposed
    * @iatCategory Behavior
    * Sets the maximum value for the input. If value node binding is used for the value, then this property is overriden by OPC UA max value.
    */
    /**
    * @cfg {Number} minValue=0
    * @iatStudioExposed
    * @iatCategory Behavior
    * Sets the minimum value for the input. If value node binding is used for the value, then this property is overriden by OPC UA min value.
    */

    /**
    * @cfg {brease.config.MeasurementSystemUnit} unit=''  
    * @bindable
    * @iatStudioExposed
    * @iatCategory Appearance
    * unit code for every measurement system
    */

    /**
    * @cfg {brease.config.MeasurementSystemFormat} format={'metric':{ 'decimalPlaces' : 1, 'minimumIntegerDigits' : 1 }, 'imperial' :{ 'decimalPlaces' : 1, 'minimumIntegerDigits' : 1 }, 'imperial-us' :{ 'decimalPlaces' : 1, 'minimumIntegerDigits' : 1 }}  
    * @iatStudioExposed
    * @bindable
    * @iatCategory Appearance
    * brease.config.NumberFormat for every measurement system.
    * Read more about <a href="../FAQ/FormatNumber.html">Number Formats</a>
    */

    /**
    * @cfg {Boolean} useDigitGrouping=true  
    * @iatStudioExposed
    * @iatCategory Behavior
    * Determines if digit grouping should be used
    */

    /**
    * @cfg {Boolean} showUnit=true
    * @iatStudioExposed
    * @iatCategory Behavior
    * Determines if the unit should be displayed
    */
    /**
    * @cfg {brease.enum.ImageAlign} unitAlign = 'left'
    * @iatStudioExposed
    * @iatCategory Appearance
    * alignment of unit label; supported values ["left"/"right"]
    */
    /**
    * @cfg {Boolean} keyboard=true
    * @iatStudioExposed
    * @iatCategory Behavior
    * Determines if internal soft keyboard (=NumPad) should open
    */
    /**
    * @cfg {Number} value=0
    * @bindable
    * @iatStudioExposed
    * @iatCategory Data
    * @nodeRefId node
    * @editableBinding
    * Initial visible value of input field as a number
    */
    /**
    * @cfg {brease.datatype.Node} node=''
    * @bindable
    * @iatStudioExposed
    * @iatCategory Data
    * @editableBinding
    * Value with unit for node binding.
    */

    /**
    * @cfg {StyleReference} numPadStyle='default'
    * @iatStudioExposed
    * @iatCategory Appearance
    * @typeRefId widgets.brease.NumPad
    * Style of the related NumPad
    */

    /**
    * @cfg {Boolean} ellipsis=false
    * @iatStudioExposed
    * @iatCategory Behavior
    * If true, overflow of text is symbolized with an ellipsis.  
    */

    /**
    * @cfg {brease.enum.LimitViolationPolicy} limitViolationPolicy='noSubmit'
    * @iatStudioExposed
    * @iatCategory Behavior
    * Controls behavior in case of a limit violation.   
    */

    /**
    * @cfg {Size} unitWidth='0'
    * @iatStudioExposed
    * @iatCategory Appearance
    * Width of unit area.
    */

    var config = {
        numpadPosition: Enum.Position.right,
        submitOnChange: true,
        value: 0,
        maxValue: 100,
        minValue: 0,
        format: {
            default: {
                decimalPlaces: 1,
                minimumIntegerDigits: 1
            }
        },
        useDigitGrouping: true,
        unitAlign: Enum.ImageAlign.left,
        showUnit: true,
        keyboard: true,
        ellipsis: false,
        limitViolationPolicy: Enum.LimitViolationPolicy.NO_SUBMIT,
        unit: null,
        node: null,
        numPadStyle: 'default',
        unitWidth: "0"
    };

    return config;
});