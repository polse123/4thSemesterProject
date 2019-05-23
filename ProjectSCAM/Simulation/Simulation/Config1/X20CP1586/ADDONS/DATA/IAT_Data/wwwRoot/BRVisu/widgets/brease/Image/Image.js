/*global define,brease,console,CustomEvent,_*/
define(function (require) {

    'use strict';

    var SuperClass = require('brease/core/BaseWidget'),
		Enum = require('brease/enum/Enum'),
        Types = require('brease/core/Types'),

    /**
    * @class widgets.brease.Image
    * #Description
    * Widget for displaying an image
	* @breaseNote 
    * @extends brease.core.BaseWidget
    *
    * @iatMeta category:Category
    * Image
    * @iatMeta description:short
    * Grafikobjekt
    * @iatMeta description:de
    * Zeigt eine Grafik an
    * @iatMeta description:en
    * Displays a graphic image
    */



    /**
    * @htmltag examples
    * ##Configuration examples:  
	*
    *
    *     <div id="Image01" data-brease-widget="widgets/brease/Image" data-brease-options="{'image':'projects/TestProject/assets/bild1.jpg', 'width':120, 'height':120, 'sizeMode':'cover'}"></div>
    *
    */

    /**
    * @cfg {ImagePath} image=''
    * @iatStudioExposed
    * @iatCategory Appearance
    * @bindable
    * Path to image file
    * <br>When svg - graphics are used, be sure that in your *.svg-file height and width attributes are specified on the &lt;svg&gt; element.
    * For more detailed information see https://www.w3.org/TR/SVG/struct.html (chapter 5.1.2)
    */
    /**
    * @cfg {brease.enum.SizeMode} sizeMode='contain'
    * @iatStudioExposed
    * @iatCategory Behavior
    * Size of image relative to box size.  
    */

    defaultSettings = {
        image: undefined,
        sizeMode: Enum.SizeMode.CONTAIN
    },

    WidgetClass = SuperClass.extend(function Image() {
        SuperClass.apply(this, arguments);
    }, defaultSettings),

    p = WidgetClass.prototype;

    p.init = function () {
        if (this.settings.omitClass !== true) {
            this.addInitialClass('breaseImage');
        }
        if (brease.config.editMode === true) {
            this.addInitialClass('iatd-outline');
        }
        this.settings.sizeMode = Types.parseValue(this.settings.sizeMode, 'Enum', { IAT_Enum: Enum.SizeMode, default: defaultSettings.sizeMode });
        this._showImage();

        SuperClass.prototype.init.call(this);

    };


    /**
    * @method setImage
    * @iatStudioExposed
    * Sets image
    * @param {ImagePath} image
    */
    p.setImage = function (image) {
        this.settings.image = image;
        this._showImage();
    };


    /**
	* @method getImage 
	* Returns image.
	* @return {ImagePath}
	*/
    p.getImage = function () {
        return this.settings.image;
    };


    /**
    * @method setSizeMode
    * Sets sizeMode
    * @param {brease.enum.SizeMode} sizeMode
    */
    p.setSizeMode = function (sizeMode) {
        this.settings.sizeMode = Types.parseValue(sizeMode, 'Enum', { IAT_Enum: Enum.SizeMode, default: defaultSettings.sizeMode });
        this._showImage();
    };




    /**
	* @method getSizeMode 
	* Returns sizeMode.
	* @return {brease.enum.SizeMode}
	*/
    p.getSizeMode = function () {

        return this.settings.sizeMode;

    };


    p._showImage = function () {
        
        

        if (this.settings.image !== undefined) {
            this.el.css({ "background-image": "url(" + this.settings.image + ")", "background-repeat": "no-repeat", "background-size": Enum.SizeMode.convertToCSS(this.settings.sizeMode) });
        }

        if (brease.config.editMode === true) {
            var widget = this;
            
            if (this.settings.image !== "") {

                this.imageEl = $('<img src="' + this.settings.image + '"/>');
                this.imageEl.error(function () {
                    if ((widget.el.children().length) === 0) {
                        (widget.imageEl).appendTo(widget.el);
                    }
                });
                this.imageEl.load(function () {
                    $("#"+widget.elem.id+" img").remove();
                });
            }
           
        }
    };

    return WidgetClass;

});