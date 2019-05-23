define(function (require) {

    'use strict';

    var UtilsImage = {};

    UtilsImage.createImageList = function createImageList(itemsNumber) {
        var imageList = [], i = 0;
        for (i = 0; i < itemsNumber; i = i + 1) {
            imageList.push(i.toString() + '.png');
        }
        return imageList;
    };

    UtilsImage.createImageElements = function createImageElements(imageList, imagePath) {
        var imageElements = {}, i = 0;
        for (i = 0; i < imageList.length; i = i + 1) {
            var id = i.toString();
            imageElements[id] = {};
            imageElements[id].id = id;
            if (imagePath !== undefined && imagePath !== '') {
                imageElements[id].imagePath = imagePath + imageList[i];
            } else {
                imageElements[id].imagePath = undefined;
            }
        }
        return imageElements;
    };

    return UtilsImage;

});