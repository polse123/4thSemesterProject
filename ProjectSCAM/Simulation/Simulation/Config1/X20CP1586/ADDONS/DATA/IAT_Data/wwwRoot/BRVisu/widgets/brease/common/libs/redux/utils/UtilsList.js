define(function () {

    'use strict';

    var UtilsList = {};

    UtilsList.parseJSONtoObject = function parseJSONtoObject(dataProvider) {
        var data = [];
        dataProvider.map(function (item) {
            if (typeof item === "string") {
                try {
                    return data.push(JSON.parse(item));
                }
                catch (err) {
                    return [];
                }
            }
            else if (typeof item === "object") {
                data.push(item);
            }
        });
        return data;
    };

    UtilsList.getItemsFromItems = function getItemsFromItems(itemsArray, selectedIndex) {
        var itemList = [], i;
        for (i = 0; i < itemsArray.length; i = i + 1) {
            itemList.push({
                imageId: i.toString(),
                textId: i.toString(),
                value: itemsArray[i].value,
                selected: i === selectedIndex
            });
        }
        return itemList;
    };

    UtilsList.getSelectedValueFromItems = function getSelectedValueFromItems(itemsArray, selectedIndex) {
        if (itemsArray[selectedIndex] !== undefined) {
            return itemsArray[selectedIndex].value;
        } else {
            return '';
        }
    };

    UtilsList.calculateListHeight = function calculateListHeight(fitHeight2Items, numberOfItems, maxVisibleEntries, itemHeight) {
        var itemsToShow = (maxVisibleEntries > numberOfItems || fitHeight2Items) ? numberOfItems : maxVisibleEntries,
            listHeight = itemsToShow * itemHeight;
        return listHeight;
    };

    return UtilsList;

});