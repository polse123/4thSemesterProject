define(['widgets/brease/common/libs/BoxLayout'],
    function (BoxLayout) {

    'use strict';

    /**
    * @class widgets.redux.common.libs.view.ImageView.ImageView
    * View displaying an Image
    */

    var ImageView = function (props, parent) {
        this.render(props, parent);
    };

    var p = ImageView.prototype;

    /**
    * @method render
    * Renders the view
    * @param parent DOM element for the parent View
    * @param props Properties for the View
    * @param props.image Path to the image
    */
    p.render = function render(props, parent) {
        this.el = $(BoxLayout.createBox());
        this.el.addClass("ImageView");
        this.image = $('<img src=' + props.image + '>');
        this.el.append(this.image);
        parent.append(this.el);
    };

    p.dispose = function dispose() {
        this.image.remove();
        this.el.remove();
    };

    return ImageView;

});