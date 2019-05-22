/*global define*/
define(['brease/enum/IAT_Enum'], function (IAT_Enum) {

    'use strict';

    var Enum = {};

    function _defineEnum(name, members) {
        Object.defineProperty(Enum, name, { enumerable: true, configurable: false, writable: false, value: new IAT_Enum(members) });
    }

    /** 
    * @enum {String} brease.enum.TextAlign  
    * @iatMeta studio:visible
    * true
    */
    /** 
    * @property {String} left='left'
    * @iatStudioExposed
    * left alignment of text
    */
    /** 
    * @property {String} right='right'
    * @iatStudioExposed
    * right alignment of text
    */
    /** 
    * @property {String} center='center'
    * @iatStudioExposed
    * center alignment of text
    */
    _defineEnum('TextAlign', {
        center: 'center',
        left: 'left',
        right: 'right'
    });

    /** 
    * @enum {String} brease.enum.Floating   
    * @iatMeta studio:visible
    * true
    */
    /** 
    * @property {String} left='left'
    * @iatStudioExposed
    * left alignment of text
    */
    /** 
    * @property {String} right='right'
    * @iatStudioExposed
    * right alignment of text
    */
    _defineEnum('Floating', {
        left: 'left',
        right: 'right'
    });

    /** 
    * @enum {String} brease.enum.Orientation  
    * @iatMeta studio:visible
    * true
    */
    /** 
    * @property {String} RTL='RightToLeft'
    * @iatStudioExposed
    * right to left
    */
    /** 
    * @property {String} LTR='LeftToRight'
    * @iatStudioExposed
    * left to right
    */
    /** 
    * @property {String} BTT='BottomToTop'
    * @iatStudioExposed
    * bottom to top
    */
    /** 
    * @property {String} TTB='TopToBottom'
    * @iatStudioExposed
    * top to bottom
    */
    _defineEnum('Orientation', {
        RTL: 'RightToLeft',
        LTR: 'LeftToRight',
        BTT: 'BottomToTop',
        TTB: 'TopToBottom'
    });

    /** 
    * @enum {String} brease.enum.Direction  
    * @iatMeta studio:visible
    * true
    */
    /** 
    * @property {String} horizontal='horizontal'
	* @iatStudioExposed
    */
    /** 
    * @property {String} vertical='vertical'
	* @iatStudioExposed
    */
    _defineEnum('Direction', {
        horizontal: 'horizontal',
        vertical: 'vertical'
    });

    /** 
    * @enum {String} brease.enum.LabelPosition 
    */
    /** 
    * @property {String} inside='inside'
    */
    /** 
    * @property {String} outside='outside'
    */
    _defineEnum('LabelPosition', {
        inside: 'inside',
        outside: 'outside'
    });

    /** 
    * @enum {Number} brease.enum.WidgetState
    * @iatMeta studio:visible
    * false
    */
    /**
    * @property {Number} ABORTED=-3 
    */
    /**
    * @property {Number} FAILED=-2 
    */
    /**
    * @property {Number} NON_EXISTENT=-1 
    */
    /**
    * @property {Number} IN_QUEUE=0  
    */
    /**
    * @property {Number} IN_PARSE_QUEUE=0.5  
    */
    /** 
    * @property {Number} INITIALIZED=1  
    */
    /** 
    * @property {Number} READY=2   
    */
    /**
    * @property {Number} SUSPENDED=3 
    */
    _defineEnum('WidgetState', {
        ABORTED: -3,
        FAILED: -2,
        NON_EXISTENT: -1,
        IN_QUEUE: 0,
        IN_PARSE_QUEUE: 0.5,
        INITIALIZED: 1,
        READY: 2,
        SUSPENDED: 3
    });

    /** 
    * @enum {Integer} brease.enum.Dependency
    * @iatMeta studio:visible
    * false
    */
    /**
    * @property {Integer} INACTIVE=-1 
    */
    /**
    * @property {Integer} SUSPENDED=0  
    */
    /** 
    * @property {Integer} ACTIVE=1  
    */
    _defineEnum('Dependency', {
        INACTIVE: -1,
        SUSPENDED: 0,
        ACTIVE: 1
    });

    /** 
    * @enum {String} brease.enum.MessageBoxIcon 
    * @iatMeta studio:visible
    * true
    */
    /**
    * @property {String} ASTERISK='Asterisk' 
    * @iatStudioExposed
    */
    /** 
    * @property {String} ERROR='Error'
    * @iatStudioExposed
    */
    /** 
    * @property {String} EXCLAMATION='Exclamation'
    * @iatStudioExposed
    */
    /** 
    * @property {String} HAND='Hand'
    * @iatStudioExposed
    */
    /** 
    * @property {String} INFORMATION='Information'
    * @iatStudioExposed
    */
    /** 
    * @property {String} NONE='None'
    * @iatStudioExposed
    */
    /** 
    * @property {String} QUESTION='Question'
    * @iatStudioExposed
    */
    /** 
    * @property {String} STOP='Stop'
    * @iatStudioExposed
    */
    /** 
    * @property {String} WARNING='Warning'
    * @iatStudioExposed
    */
    _defineEnum('MessageBoxIcon', {
        ASTERISK: 'Asterisk',
        ERROR: 'Error',
        EXCLAMATION: 'Exclamation',
        HAND: 'Hand',
        INFORMATION: 'Information',
        NONE: 'None',
        QUESTION: 'Question',
        STOP: 'Stop',
        WARNING: 'Warning'
    });

    /** 
    * @enum {Number} brease.enum.MessageBoxState
    * @iatMeta studio:visible
    * false
    */
    /**
    * @property {Number} YES=0x0001  
    * @iatStudioExposed
   * show 'yes' button
    */
    /** 
    * @property {Number} NO=0x0002
    * @iatStudioExposed
   * show 'no' button
    */
    /** 
    * @property {Number} OK=0x0004   
    * @iatStudioExposed
   * show 'ok' button
    */
    /** 
    * @property {Number} CANCEL=0x0008 
    * @iatStudioExposed
   * show 'cancel' button
    */
    /** 
   * @property {Number} ABORT=0x0010 
   * @iatStudioExposed
   * show 'abort' button
   */
    /** 
   * @property {Number} RETRY=0x0020 
   * @iatStudioExposed
   * show 'retry' button
   */
    /** 
   * @property {Number} IGNORE=0x0040 
   * @iatStudioExposed
   * show 'ignore' button
   */
    _defineEnum('MessageBoxState', {
        YES: 0x0001,
        NO: 0x0002,
        OK: 0x0004,
        CANCEL: 0x0008,
        ABORT: 0x0010,
        RETRY: 0x0020,
        IGNORE: 0x0040
    });

    /** 
   * @enum {String} brease.enum.MessageBoxType
   * @iatMeta studio:visible
   * true
   */
    /**
    * @property {String} AbortRetryIgnore='AbortRetryIgnore'  
    * @iatStudioExposed
   * show buttons 'Abort', 'Retry' and 'Ignore'
    */
    /** 
    * @property {String} OK='OK'  
    * @iatStudioExposed
   * show button 'OK'
    */
    /** 
    * @property {String} OKCancel='OKCancel'   
    * @iatStudioExposed
   * show buttons 'OK' and 'Cancel'
    */
    /** 
    * @property {String} RetryCancel='RetryCancel'  
    * @iatStudioExposed
   * show buttons 'Retry' and 'Cancel'
    */
    /** 
   * @property {String} YesNo='YesNo'  
   * @iatStudioExposed
   * show buttons 'Yes' and 'No'
   */
    /** 
   * @property {String} YesNoCancel='YesNoCancel'  
   * @iatStudioExposed
   * show buttons 'Yes', 'No' and 'Cancel'
   */

    _defineEnum('MessageBoxType', {
        AbortRetryIgnore: "AbortRetryIgnore",
        OK: "OK",
        OKCancel: "OKCancel",
        RetryCancel: "RetryCancel",
        YesNo: "YesNo",
        YesNoCancel: "YesNoCancel"
    });

    /** 
    * @enum {String} brease.enum.DialogMode
    * @iatMeta studio:visible
    * true
    */
    /**
    * @property {String} MODAL='modal'  
    * @iatStudioExposed
    */
    /** 
    * @property {String} MODELESS='modeless'  
    * @iatStudioExposed
    */

    _defineEnum('DialogMode', {
        MODAL: 'modal',
        MODELESS: 'modeless'
    });

    /** 
    * @enum {String} brease.enum.NoSelectionPolicy
    * @iatMeta studio:visible
    * false
    */
    /**
    * @property {String} selectFirst='selectFirst'
    * @iatStudioExposed
    * If no entry is selected, first entry is visible
    */
    /**
    * @property {String} showPrompt='showPrompt'
    * @iatStudioExposed
    * If no entry is selected, prompt is visible
    */
    _defineEnum('NoSelectionPolicy', {
        selectFirst: 'selectFirst',
        showPrompt: 'showPrompt'
    });

    /** 
    * @enum {String} brease.enum.LimitViolationPolicy 
    * @iatMeta studio:visible
    * true
    */
    /** 
    * @property {String} NO_SUBMIT='noSubmit' Nothing happens (NumPad is not closed)
    * @iatStudioExposed
    */
    /** 
    * @property {String} NO_SUBMIT_AND_CLOSE='noSubmitAndClose' NumPad closes without submitting the value
    * @iatStudioExposed
    */
    /** 
    * @property {String} SUBMIT_ALL='submitAll' Any entered value is submitted and NumPad is closed
    * @iatStudioExposed
    */
    /** 
    * @property {String} SET_TO_LIMIT='setToLimit' The value is set to the nearest limit (NumPad is not closed); the user can now submit the limit value, with another click on the enter button.
    * @iatStudioExposed
    */
    /** 
    * @property {String} SET_TO_LIMIT_AND_SUBMIT='setToLimitAndSubmit' The value is set to the nearest limit and is submitted (NumPad is closed)
    * @iatStudioExposed
    */
    _defineEnum('LimitViolationPolicy', {
        NO_SUBMIT: 'noSubmit',
        NO_SUBMIT_AND_CLOSE: 'noSubmitAndClose',
        SUBMIT_ALL: 'submitAll',
        SET_TO_LIMIT: 'setToLimit',
        SET_TO_LIMIT_AND_SUBMIT: 'setToLimitAndSubmit'
    });

    /** 
    * @enum {String} brease.enum.SortDirection
    */
    /** 
    * @property {String} ASC='ascending'
    * @iatStudioExposed
    * ascending sort direction
    */
    /** 
    * @property {String} DESC='descending'
    * @iatStudioExposed
    * descending sort direction
    */
    _defineEnum('SortDirection', {
        ASC: 'ascending',
        DESC: 'descending'
    });

    /** 
    * @enum {String} brease.enum.SortFunction
    * @iatMeta studio:visible
    * false
    */
    /** 
    * @property {String} STRING='string'
    * @iatStudioExposed
    * Sort in alphabetical order. Function is case sensitive.
    */
    /** 
    * @property {String} STRING_INS='string-ins'
    * @iatStudioExposed
    * Sort in alphabetical order. Function is case insensitive.
    */
    /** 
    * @property {String} INT='int'
    * @iatStudioExposed
    * Sort in numerical order. Entries are converted to Integers.
    */
    /** 
    * @property {String} NUMBER='number'
    * @iatStudioExposed
    * Sort in numerical order.
    */
    /** 
    * @property {String} DATE='date'
    * @iatStudioExposed
    * Sort by date. Entries are converted with <a href="http://developer.mozilla.org/en/JavaScript/Reference/Global_Objects/Date/parse" target="_blank">Date.parse</a>
    */
    _defineEnum('SortFunction', {
        STRING: 'string',
        STRING_INS: 'string-ins',
        NUMBER: 'number',
        INT: 'int',
        DATE: 'date'
    });

    /** 
    * @enum {String} brease.enum.ImageAlign 
    * @iatMeta studio:visible
    * true
    */
    /** 
    * @property {String} left='left'
    * @iatStudioExposed
    */
    /** 
    * @property {String} right='right'
    * @iatStudioExposed
    */
    /** 
    * @property {String} bottom='bottom'
    * @iatStudioExposed
    */
    /** 
    * @property {String} top='top'
    * @iatStudioExposed
    */
    _defineEnum('ImageAlign', {
        left: 'left',
        right: 'right',
        top: 'top',
        bottom: 'bottom'
    });

    /** 
    * @enum {String} brease.enum.TabPosition 
    * @iatMeta studio:visible
    * true
    */
    /** 
    * @property {String} left='left'
    * @iatStudioExposed
    */
    /** 
    * @property {String} right='right'
    * @iatStudioExposed
    */
    /** 
    * @property {String} bottom='bottom'
    * @iatStudioExposed
    */
    /** 
    * @property {String} top='top'
    * @iatStudioExposed
    */
    _defineEnum('TabPosition', {
        left: 'left',
        right: 'right',
        top: 'top',
        bottom: 'bottom'
    });

    /** 
    * @enum {String} brease.enum.ImagePosition 
    * @iatMeta studio:visible
    * true
    */
    /** 
    * @property {String} left='left'
    * @iatStudioExposed
    */
    /** 
    * @property {String} right='right'
    * @iatStudioExposed
    */
    _defineEnum('ImagePosition', {
        left: 'left',
        right: 'right'
    });


    /** 
    * @enum {String} brease.enum.BackgroundPosition
    * @iatMeta studio:visible
    * true
    */
    /** 
    * @property {String} left_top='left top'
    * @iatStudioExposed
    */
    /** 
    * @property {String} left_center='left center'
    * @iatStudioExposed
    */
    /** 
    * @property {String} left_bottom='left bottom'
    * @iatStudioExposed
    */
    /** 
    * @property {String} center_top='center top'
    * @iatStudioExposed
    */
    /** 
    * @property {String} center_center='center center'
    * @iatStudioExposed
    */
    /** 
    * @property {String} center_bottom='center bottom'
    * @iatStudioExposed
    */
    /** 
    * @property {String} right_top='right top'
    * @iatStudioExposed
    */
    /** 
    * @property {String} right_center='right center'
    * @iatStudioExposed
    */
    /** 
    * @property {String} right_bottom='right bottom'
    * @iatStudioExposed
    */
    _defineEnum('BackgroundPosition', {
        'left_top': 'left top',
        'left_center': 'left center',
        'left_bottom': 'left bottom',
        'center_top': 'center top',
        'center_center': 'center center',
        'center_bottom': 'center bottom',
        'right_top': 'right top',
        'right_center': 'right center',
        'right_bottom': 'right bottom'
    });

    /** 
    * @enum {String} brease.enum.TextAlignmentAll
    * @iatMeta studio:visible
    * true
    */
    /** 
    * @property {String} left_top='left top'
    * @iatStudioExposed
    */
    /** 
    * @property {String} left_center='left'
    * @iatStudioExposed
    */
    /** 
    * @property {String} left_bottom='left bottom'
    * @iatStudioExposed
    */
    /** 
    * @property {String} center_top='center top'
    * @iatStudioExposed
    */
    /** 
    * @property {String} center_center='center'
    * @iatStudioExposed
    */
    /** 
    * @property {String} center_bottom='center bottom'
    * @iatStudioExposed
    */
    /** 
    * @property {String} right_top='right top'
    * @iatStudioExposed
    */
    /** 
    * @property {String} right_center='right'
    * @iatStudioExposed
    */
    /** 
    * @property {String} right_bottom='right bottom'
    * @iatStudioExposed
    */

    _defineEnum('TextAlignmentAll', {
        'left_top': 'left top',
        'left_center': 'left',
        'left_bottom': 'left bottom',
        'center_top': 'center top',
        'center_center': 'center',
        'center_bottom': 'center bottom',
        'right_top': 'right top',
        'right_center': 'right',
        'right_bottom': 'right bottom'
    });

    /** 
    * @enum {String} brease.enum.InterpolationType
    * @iatMeta studio:visible
    * false
    */
    /** 
    * @property {String} NONE='none'
    * @iatStudioExposed
    * Values are drawn as dots and not connected
    */
    /** 
    * @property {String} STEP='step'
    * @iatStudioExposed
    * Each value starts a horizontal line, which is connected to the next value with a vertical line
    */
    /** 
    * @property {String} LINEAR='linear'
    * @iatStudioExposed
    * Values are connected with linear lines
    */
    _defineEnum('InterpolationType', {
        NONE: 'none',
        STEP: 'step',
        LINEAR: 'linear'
    });

    /** 
    * @enum {String} brease.enum.Position 
    * @iatMeta studio:visible
    * true
    */
    /** 
    * @property {String} left='left'
    * @iatStudioExposed
    */
    /** 
    * @property {String} center='center'
    * @iatStudioExposed
    */
    /** 
    * @property {String} right='right'
    * @iatStudioExposed
    */
    /** 
    * @property {String} top='top'
    * @iatStudioExposed
    */
    /** 
    * @property {String} middle='middle'
    * @iatStudioExposed
    */
    /** 
    * @property {String} bottom='bottom'
    * @iatStudioExposed
    */
    _defineEnum('Position', {
        left: 'left',
        center: 'center',
        right: 'right',
        top: 'top',
        middle: 'middle',
        bottom: 'bottom'
    });

    /** 
    * @enum {String} brease.enum.PointOfOrigin
    * @iatMeta studio:visible
    * false
    */
    /** 
    * @property {String} APP='application'
    * @iatStudioExposed
    * position specifications are relative to the application, i.e. the browser window
    */
    /** 
    * @property {String} CONTAINER='container'
    * @iatStudioExposed
    * position specifications are relative to the HTML-container of the positioned widget
    */
    _defineEnum('PointOfOrigin', {
        APP: 'application',
        CONTAINER: 'container',
        ELEMENT: 'element'
    });

    /** 
    * @enum {String} brease.enum.PromptType
    */
    /** 
    * @property {String} image='image'
    * @iatStudioExposed
    */
    /** 
    * @property {String} text='text'
    * @iatStudioExposed
    */
    /** 
    * @property {String} all='all'
    * @iatStudioExposed
    */
    _defineEnum('PromptType', {
        image: 'image',
        text: 'text',
        all: 'all'
    });

    /** 
    * @enum {String} brease.enum.ChildPositioning 
    * @iatMeta studio:visible
    * true
    */
    /** 
    * @property {String} absolute='absolute'
    * @iatStudioExposed
    * Child widgets are positioned absolute (with left/top values) in relation to the container (e.g. GroupBox) element (left upper corner)
    */
    /** 
    * @property {String} relative='relative'
    * @iatStudioExposed
    * Child widgets are positioned relative (with left/top values), that means they are positioned relative to their normal position according to the normal flow of the page.
    */
    _defineEnum('ChildPositioning', {
        absolute: 'absolute',
        relative: 'relative'
    });

    /** 
    * @enum {String} brease.enum.LoadPolicy 
    * @iatMeta studio:visible
    * true
    */
    /** 
    * @property {String} ONDEMAND='onDemand'
    * @iatStudioExposed
    */
    /** 
    * @property {String} IMMEDIATE='immediate'
    * @iatStudioExposed
    */
    _defineEnum('LoadPolicy', {
        ONDEMAND: 'onDemand',
        IMMEDIATE: 'immediate'
    });

    /** 
    * @enum {String} brease.enum.InputType
    */
    /** 
    * @property {String} text='text'
    * @iatStudioExposed
    */
    /** 
    * @property {String} password='password'
    * @iatStudioExposed
    */
    _defineEnum('InputType', {
        text: 'text',
        password: 'password'
    });

    /** 
    * @enum {String} brease.enum.CachePolicy 
    * @iatMeta studio:visible
    * true
    */
    /** 
    * @property {String} CACHE='cache'
    * @iatStudioExposed
    */
    /** 
    * @property {String} NO_CACHE='noCache'
    * @iatStudioExposed
    */
    _defineEnum('CachePolicy', {
        CACHE: 'cache',
        NO_CACHE: 'noCache'
    });

    /** 
    * @enum {String} brease.enum.SelectMode
    */
    /** 
    * @property {String} STANDARD='standard'
    * @iatStudioExposed
    */
    /** 
    * @property {String} ADVANCED='advanced'
    * @iatStudioExposed
    */
    /** 
    * @property {String} QUICK='quick'
    * @iatStudioExposed
    */
    _defineEnum('SelectMode', {
        STANDARD: 'standard',
        ADVANCED: 'advanced',
        QUICK: 'quick'
    });

    /** 
    * @enum {String} brease.enum.SizeMode 
    * @iatMeta studio:visible
    * true
    */
    /** 
    * @property {String} COVER='cover'
    * @iatStudioExposed
    * Scale the image as small as possible, such that widget area is covered completely. Aspect ratio is maintained.  
    * {@img sizemode_cover.png}
    */
    /** 
    * @property {String} CONTAIN='contain'
    * @iatStudioExposed
    * Scale the image as large as possible, such that both, its width and its height, can fit inside the widget area. Aspect ratio is maintained.  
    * {@img sizemode_contain.png}
    */
    /** 
    * @property {String} FILL='fill'
    * @iatStudioExposed
    * Stretch the image to completely cover the widget area. Aspect ratio is NOT maintained.  
    * {@img sizemode_fill.png}
    */
    _defineEnum('SizeMode', {
        COVER: 'cover',
        CONTAIN: 'contain',
        FILL: 'fill'
    });

    Object.defineProperty(Enum.SizeMode, 'convertToCSS', {
        value: function (mode) {
            var statement = 'contain';
            if (mode === Enum.SizeMode.CONTAIN) {
                statement = 'contain';
            } else if (mode === Enum.SizeMode.COVER) {
                statement = 'cover';
            } else if (mode === Enum.SizeMode.FILL) {
                statement = '100% 100%';
            }
            return statement;
        },
        enumerable: false,
        configurable: false,
        writable: false
    });

    /** 
   * @enum {String} brease.enum.TickStyle 
    * @iatMeta studio:visible
    * true
   */
    /** 
    * @property {String} NONE='none'
    * @iatStudioExposed
    * no scale
    */
    /** 
    * @property {String} TOP='top'
    * @iatStudioExposed
    * Show Scale on top
    */
    /** 
   * @property {String} BOTTOM='bottom'
    * @iatStudioExposed
    * Show Scale on bottom
    */
    /** 
    * @property {String} TOPBOTTOM='topbottom'
    * @iatStudioExposed
    * Show Scale on top and bottom
    */
    _defineEnum('TickStyle', {
        NONE: 'none',
        TOP: 'top',
        BOTTOM: 'bottom',
        LEFT: 'left',
        RIGHT: 'right',
        TOPBOTTOM: 'topbottom'
    });

    /** 
    * @enum {String} brease.enum.ChartType
    * @iatMeta studio:visible
    * false
    */
    /** 
    * @property {String} LINE_CHART='linechart'
    * @iatStudioExposed
    */
    /** 
    * @property {String} BAR_CHART='barchart'
    * @iatStudioExposed
    */
    /** 
    * @property {String} PIE_CHART='piechart'
    * @iatStudioExposed
    */
    _defineEnum('ChartType', {
        LINE_CHART: 'linechart',
        BAR_CHART: 'barchart',
        PIE_CHART: 'piechart'
    });

    /** 
    * @enum {String} brease.enum.VerticalAlign 
    * @iatMeta studio:visible
    * true
    */
    /** 
    * @property {String} bottom='bottom'
    * @iatStudioExposed
    */
    /** 
    * @property {String} top='top'
    * @iatStudioExposed
    */
    _defineEnum('VerticalAlign', {
        top: 'top',
        bottom: 'bottom'
    });

    /** 
    * @enum {String} brease.enum.HorizontalAlign 
    * @iatMeta studio:visible
    * true
    */
    /** 
    * @property {String} left='left'
    * @iatStudioExposed
    */
    /** 
    * @property {String} right='right'
    * @iatStudioExposed
    */
    _defineEnum('HorizontalAlign', {
        left: 'left',
        right: 'right'
    });

    /** 
    * @enum {String} brease.enum.MeasurementSystem
    * @iatMeta studio:visible
    * true
    */
    /**
    * @property {String} METRIC='metric'  
    * @iatStudioExposed
    */
    /** 
    * @property {String} IMPERIAL='imperial'  
    * @iatStudioExposed
    */
    /** 
    * @property {String} IMPERIAL_US='imperial-us'  
    * @iatStudioExposed
    */
    _defineEnum('MeasurementSystem', {
        METRIC: 'metric',
        IMPERIAL: 'imperial',
        IMPERIAL_US: 'imperial-us'
    });

    /** 
    * @enum {String} brease.enum.HorizontalPosition  
    * @iatMeta studio:visible
    * true
    */
    /** 
    * @property {String} left='left'
    * @iatStudioExposed
    */
    /** 
    * @property {String} right='right'
    * @iatStudioExposed
    */
    /** 
    * @property {String} center='center'
    * @iatStudioExposed
    */
    _defineEnum('HorizontalPosition', {
        left: 'left',
        center: 'center',
        right: 'right'
    });

    /** 
    * @enum {String} brease.enum.VerticalPosition  
    * @iatMeta studio:visible
    * true
    */
    /** 
    * @property {String} top='top'
    * @iatStudioExposed
    */
    /** 
    * @property {String} middle='middle'
    * @iatStudioExposed
    */
    /** 
    * @property {String} bottom='bottom'
    * @iatStudioExposed
    */
    _defineEnum('VerticalPosition', {
        top: 'top',
        middle: 'middle',
        bottom: 'bottom'
    });

    /** 
    * @enum {String} brease.enum.ShowData  
    * @iatMeta studio:visible
    * true
    */
    /** 
    * @property {String} percentage='percentage'
    * @iatStudioExposed
    */
    /** 
    * @property {String} value='value'
    * @iatStudioExposed
    */
    /** 
    * @property {String} none='none'
    * @iatStudioExposed
    */
    _defineEnum('ShowData', {
        'percentage': 'percentage',
        'value': 'value',
        'none': 'none'
    });


    /**
    * @enum {String} brease.enum.AlarmListItemType
    * @alternateClassName AlarmListItemType
    * @iatMeta studio:visible
    * true
    */
    /** 
    * @property {String} ad1='additionalInfo1'
    * @iatStudioExposed
    */
    /** 
    * @property {String} ad2='additionalInfo2'
    * @iatStudioExposed
    */
    /** 
    * @property {String} cod='code'
    * @iatStudioExposed
    */
    /** 
    * @property {String} ins='instanceId'
    * @iatStudioExposed
    */
    /** 
    * @property {String} mes='message'
    * @iatStudioExposed
    */
    /** 
    * @property {String} nam='name'
    * @iatStudioExposed
    */
    /** 
    * @property {String} sco='scope'
    * @iatStudioExposed
    */
    /** 
    * @property {String} sev='severity'
    * @iatStudioExposed
    */
    /** 
    * @property {String} sta='state'
    * @iatStudioExposed
    */
    /** 
    * @property {String} tim='timestamp'
    * @iatStudioExposed
    */
    _defineEnum('AlarmListItemType', {
        ad1: 'additionalInfo1',
        ad2: 'additionalInfo2',
        cod: 'code',
        ins: 'instanceId',
        mes: 'message',
        nam: 'name',
        sco: 'scope',
        sev: 'severity',
        sta: 'state',
        tim: 'timestamp'
    });

    /**
    * @enum {String} brease.enum.AlarmHistoryItemType
    * @alternateClassName AlarmHistoryItemType
    * @iatMeta studio:visible
    * true
    */
    /** 
    * @property {String} ad1='additionalInfo1'
    * @iatStudioExposed
    */
    /** 
    * @property {String} ad2='additionalInfo2'
    * @iatStudioExposed
    */
    /** 
    * @property {String} cod='code'
    * @iatStudioExposed
    */
    /** 
    * @property {String} ins='instanceId'
    * @iatStudioExposed
    */
    /** 
    * @property {String} mes='message'
    * @iatStudioExposed
    */
    /** 
    * @property {String} nam='name'
    * @iatStudioExposed
    */
    /** 
    * @property {String} sco='scope'
    * @iatStudioExposed
    */
    /** 
    * @property {String} sev='severity'
    * @iatStudioExposed
    */
    /** 
    * @property {String} stn='new state'
    * @iatStudioExposed
    */
    /** 
    * @property {String} sto='old state'
    * @iatStudioExposed
    */
    /** 
    * @property {String} tim='timestamp'
    * @iatStudioExposed
    */
    _defineEnum('AlarmHistoryItemType', {
        ad1: 'additionalInfo1',
        ad2: 'additionalInfo2',
        cod: 'code',
        ins: 'instanceId',
        mes: 'message',
        nam: 'name',
        sco: 'scope',
        sev: 'severity',
        stn: 'new state',
        sto: 'old state',
        tim: 'timestamp'
    });

    /**
    * @enum {String} brease.enum.CropToParent
    * @alternateClassName CropToParent
    * @iatMeta studio:visible
    * true
    */
    /** 
    * @property {String} none='none'
    * @iatStudioExposed
    */
    /** 
    * @property {String} height='height'
    * @iatStudioExposed
    */
    /** 
    * @property {String} width='width'
    * @iatStudioExposed
    */
    /** 
    * @property {String} both='both'
    * @iatStudioExposed
    */
    _defineEnum('CropToParent', {
        none: 'none',
        height: 'height',
        width: 'width',
        both: 'both'
    });

    /**
    * @enum {String} brease.enum.VideoPlayerPreload
    * @alternateClassName VideoPlayerPreload
    * @iatMeta studio:visible
    * true
    */
    /** 
    * @property {String} auto='auto'
    * @iatStudioExposed
    */
    /** 
    * @property {String} metadata='metadata'
    * @iatStudioExposed
    */
    /** 
    * @property {String} none='none'
    * @iatStudioExposed
    */
    _defineEnum('VideoPlayerPreload', {
        auto: 'auto',
        metadata: 'metadata',
        none: 'none'
    });

    /**
    * @enum {String} brease.enum.DropDownDisplaySettings
    * @alternateClassName DropDownDisplaySettings
    * @iatMeta studio:visible
    * true
    */
    /** 
    * @property {String} default='default'
    * @iatStudioExposed
    */
    /** 
    * @property {String} image='image'
    * @iatStudioExposed
    */
    /** 
    * @property {String} text='text'
    * @iatStudioExposed
    */
    /** 
    * @property {String} imageAndText='imageAndText'
    * @iatStudioExposed
    */
    _defineEnum('DropDownDisplaySettings', {
        'default': 'default',
        image: 'image',
        text: 'text',
        imageAndText: 'imageAndText'
    });

    /** 
    * @enum {String} brease.enum.AuditListItemType 
    * @alternateClassName AuditListItemType 
    * @iatMeta studio:visible 
    * true 
    */
    /** 
    * @property {String} idx='id' 
    * @iatStudioExposed 
    */
    /** 
    * @property {String} opn='operator name' 
    * @iatStudioExposed 
    */
    /** 
    * @property {String} tex='text' 
    * @iatStudioExposed 
    */
    /** 
    * @property {String} tim='timestamp' 
    * @iatStudioExposed 
    */
    /** 
    * @property {String} typ='type' 
    * @iatStudioExposed 
    */
    _defineEnum('AuditListItemType', {
        idx: 'id',
        opn: 'operator name',
        tex: 'text',
        tim: 'timestamp',
        typ: 'type'
    });

    /** 
    * @enum {String} brease.enum.ChartZoomType 
    * @alternateClassName ChartZoomType 
    * @iatMeta studio:visible 
    * true 
    */
    /** 
    * @property {String} none='none' 
    * @iatStudioExposed 
    */
    /** 
    * @property {String} x='x' 
    * @iatStudioExposed 
    */
    /** 
    * @property {String} y='y' 
    * @iatStudioExposed 
    */
    /** 
    * @property {String} xy='xy' 
    * @iatStudioExposed 
    */
    _defineEnum('ChartZoomType', {
        none: 'none',
        x: 'x',
        y: 'y',
        xy: 'xy'
    });

    /** 
    * @enum {String} brease.enum.ChartInterpolationType 
    * @alternateClassName ChartInterpolationType 
    * @iatMeta studio:visible 
    * true 
    */
    /** 
    * @property {String} linear='linear' 
    * @iatStudioExposed 
    */
    /** 
    * @property {String} stepBefore='step-before' 
    * @iatStudioExposed 
    */
    /** 
    * @property {String} stepAfter='step-after' 
    * @iatStudioExposed 
    */
    /** 
    * @property {String} cardinal='cardinal' 
    * @iatStudioExposed 
    */
    /** 
    * @property {String} monotone='monotone' 
    * @iatStudioExposed 
    */
    _defineEnum('ChartInterpolationType', {
            linear: 'linear',
            stepBefore: 'step-before',
            stepAfter: 'step-after',
            cardinal: 'cardinal',
            monotone: 'monotone'
    });

    _defineEnum('EventLoggerFacility', {
        IAT: 193
    });

    _defineEnum('EventLoggerId', {
        CLIENT_START_OK: 32000, //OFF
        CLIENT_START_FAIL: 32001, //OFF
        // CLIENT_DEINITIALIZE_OK: 32002
        NO_FURTHER_SESSION: 32003, //OFF
        MAX_CLIENTS: 32004, //OFF
        NOT_ENOUGH_LICENSES: 32005, //OFF
        NO_LICENSE: 32006, //OFF
        CLIENT_SCRIPT_FAIL: 32010, //LOW
        CLIENT_MODULELOADER_FAIL: 32011, //LOW
        CLIENT_PARSE_ERROR: 32012, //LOW
        CLIENT_BINDING_ATTACH_OK: 32020, //LOW
        CLIENT_BINDING_ATTACH_FAIL: 32021, //LOW
        CLIENT_BINDING_ID_NOTFOUND: 32022, //LOW
        CLIENT_BINDING_DETACH_OK: 32030, //LOW
        CLIENT_BINDING_DETACH_FAIL: 32031, //LOW
        CLIENT_USER_AUTHENTICATE_OK: 32040,//OFF
        CLIENT_USER_AUTHENTICATE_FAIL: 32041,//OFF
        CLIENT_USER_SETUSER_OK: 32050,//OFF
        CLIENT_USER_SETUSER_FAIL: 32051,//OFF
        CLIENT_USER_USERCHANGE: 32052,//OFF
        CLIENT_VISU_NOT_FOUND: 32060, //LOW
        CLIENT_INCORRECT_VISU: 32061, //LOW
        CLIENT_NO_PAGES_FOUND: 32062, //LOW
        CLIENT_NO_LAYOUTS_FOUND: 32063, //LOW
        CLIENT_PAGE_NOT_FOUND: 32064, //LOW
        CLIENT_CONTENT_NOT_FOUND: 32065, //LOW
        CLIENT_LAYOUT_NOT_FOUND: 32066, //LOW
        CLIENT_DIALOG_NOT_FOUND: 32067, //LOW
        CLIENT_AREA_NOT_FOUND: 32068, //LOW
        CLIENT_THEME_NOT_FOUND: 32069, //LOW
        CLIENT_PAGE_NOT_CURRENT: 32070, //LOW
        CLIENT_CONTENT_IS_ACTIVE: 32071 //LOW
    });

    _defineEnum('EventLoggerVerboseLevel', {
        OFF: 0,
        LOW: 1,
        HIGH: 2,
        ALL: 255
    });

    _defineEnum('EventLoggerSeverity', {
        SUCCESS: 0,
        INFORMATIONAL: 1,
        WARNING: 2,
        ERROR: 3
    });

    _defineEnum('EventLoggerCustomer', {
        CUSTOMER: 1,
        BUR: 0
    });

    return Enum;
});