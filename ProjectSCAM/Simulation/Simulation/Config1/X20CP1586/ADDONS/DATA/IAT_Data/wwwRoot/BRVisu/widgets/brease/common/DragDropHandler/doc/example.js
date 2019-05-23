require(['widgets/brease/common/DragDropHandler/libs/dragDropHandler',
    'widgets/brease/common/DragDropHandler/libs/draggableSettings',
    'widgets/brease/common/DragDropHandler/libs/droppableSettings'],
    function (DragDropHandler, DraggableSettings, DroppableSettings) {
        'use strict';

        var i = 0;

        var dragDropHandler = new DragDropHandler();

        // register Draggable
        var draggableItems = document.getElementsByClassName("draggableItem");
        for (i = 0; i < draggableItems.length; i = i + 1) {
            var draggableSettings = new DraggableSettings();
            // "clone" can be set to true, if the draggable item should not be modified for dragging
            // draggableSettings.clone = true;
            dragDropHandler.registerDraggable(draggableItems[i], draggableSettings);
        }

        // register Droppable
        var droppableItems = document.getElementsByClassName("droppableItem");
        for (i = 0; i < droppableItems.length; i = i + 1) {
            var droppableSettings = new DroppableSettings();
            // set Droppable event handler
            droppableSettings.dragEnter = function (e) {
                console.log(e.target.id + " dragEnter!");

                // Highlight hovered droppable
                e.target.classList.add("dragEntered");
            };

            droppableSettings.dragMove = _.throttle(function (e) {
                console.log(e.target.id + " dragMove!");
            }, 500);

            droppableSettings.dragLeave = function (e) {
                console.log(e.target.id + " dragLeave!");

                // Remove highlight hovered droppable
                e.target.classList.remove("dragEntered");
            };

            droppableSettings.drop = function (e) {
                console.log(e.target.id + " drop!");

                // Empty droppable container
                var droppable = dragDropHandler.getClosestDroppable(e.target);
                droppable.elem.innerHTML = "";
                // Add child element to droppable container
                droppable.elem.appendChild(e.dragItem.children[0].cloneNode(true));

                // Remove highlight hovered droppable
                droppable.elem.classList.remove("dragEntered");
            };

            dragDropHandler.registerDroppable(droppableItems[i], droppableSettings);
        }

        // listen to DragDropHandler events
        dragDropHandler.addEventListener("dragstarted", function (e) {
            console.log("dragstarted!");

            // Highlight droppable areas
            var droppables = document.getElementsByClassName("droppableItem");
            for (var i = 0; i < droppables.length; i = i + 1) {
                droppables[i].classList.add("dropPossible");
            }

            // set dragItem
            var clone = e.detail.target.cloneNode(true);
            var classList = ["border-class"];
            dragDropHandler.setDragItemClone(clone, classList);

        });
        dragDropHandler.addEventListener("dragended", function (e) {
            console.log("dragended!");

            // Remove highlight droppable areas
            var droppables = document.getElementsByClassName("droppableItem");
            for (var i = 0; i < droppables.length; i = i + 1) {
                droppables[i].classList.remove("dropPossible");
            }
        });
    });