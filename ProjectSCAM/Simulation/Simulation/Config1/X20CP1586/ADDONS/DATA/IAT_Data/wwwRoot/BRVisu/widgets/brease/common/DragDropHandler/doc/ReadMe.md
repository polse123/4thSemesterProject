# DragDropHandler
The <code>DragDropHandler</code> is the main class which should be used. This class defines which type of events should be used for Drag&Drop handling: Mouse, Pointer or Touch.

<code>DragDropBase</code> is the default class which is used by the <code>DragDropHandler</code> class and contains the main functionality.

<code>DragDropTouch</code> and <code>DragDropPointer</code> extend both the <code>DragDropBase</code> by the specific functionality for the corresponding event types.


## Basic usage

The <code>DragDropHandler</code> is working with "draggable" DOM elements and droppable" DOM elements.
The "draggables" are the elements which can be dragged and the "droppable" elements are mostly containers which allow dropping the "draggables" inside.

To be able to use the <code>DragDropHandler</code> you should register the "draggable" and "droppable" elements to the <code>DragDropHandler</code> 
with the specified settings (see <code>DraggableSettings</code> class and <code>DroppableSettings</code> class).

---
**NOTE**

Dont forget to add following CSS, so the dragItem is shown while dragging

```css
.drag-drop-item-clone {
            position: fixed;
            cursor: pointer;
            touch-action: none;
        }
```

---

A code example can be found here  
[example.html](example.html)  
[example.js](example.js)  



## Methods and Events

[dragDropBase.js](../libs/dragDropBase.js)  

Events dispatched on defined DragDropArea (default <code>body</code> Element)

| event                             |  Description                                 |
|-----------------------------------|----------------------------------------------|
| dragstarted                       | Called when user starts dragging             |
| dragended                         | Called when user stops dragging              |


Following Callback functions can be configured on each <code>Droppable</code> Object

| event                 |  Description                                                  |
|-----------------------|---------------------------------------------------------------|
| dragenter             | Called when user drags draggable inside droppable element     |
| dragleave             | Called when user drags draggable outside droppable element    |
| dragmove              | Called when user drags draggable over droppable element       |
| drop                  | Called when user drops a draggable inside a droppable element |
 


 