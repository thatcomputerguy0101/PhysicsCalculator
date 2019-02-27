var pointers = []

if (!window.PointerEvent) { //detection if pointer events are supported
    var pointerEvent, idShift;
    var typeConversion = {start: "down", end: "up", move: "move"}, buttons = 0;
  
    window.addEventListener("mousedown", simulatePointer, {capture: true});
    window.addEventListener("mouseup", simulatePointer, {capture: true});
    window.addEventListener("mousemove", simulatePointer, {capture: true});
    window.addEventListener("touchstart", simulateTouchPointer, {capture: true, passive: false});
    window.addEventListener("touchend", simulateTouchPointer, {capture: true});
    window.addEventListener("touchmove", simulateTouchPointer, {capture: true});
    window.addEventListener("touchcancel", simulateTouchPointer, {capture: true});
}

function simulatePointer(event) { //pointer event creation for mice
    if (event.type == "mousedown") buttons = 1; else if (event.type == "mouseup") buttons = 0;
    if (event.button == 0) {
        pointerEvent = new MouseEvent("pointer" + event.type.slice(5), event);
        pointerEvent.buttons = buttons;
        pointerEvent.path = event.path || event.composedPath();
        pointerEvent.isPrimary = true;
        pointerEvent.pointerId = 1;
        pointerEvent.pointerType = "mouse";
        event.target.dispatchEvent(pointerEvent);
    }
}
function simulateTouchPointer(event) { //pointer event creation for touches
    if (event.touches.length === 0 && pointers.some(val => Boolean((val || {}).buttons) && val.type != "mouse")) 
    pointers.filter(val => Boolean((val || {}).buttons) && val.type != "mouse").forEach(evt => evt.buttons = 0);
    idShift = idShift || event.changedTouches[0].identifier - 2;
    if (event.type == "touchstart") event.preventDefault();
    Array.from(event.changedTouches).forEach(touch => {
        pointerEvent = new MouseEvent("pointer" + typeConversion[event.type.slice(5)], Object.assign({}, event, event.changedTouches[0], {buttons:Number(event.type != "touchend" && event.type != "touchcancel")}));
        pointerEvent.buttons = Number(event.type != "touchend" && event.type != "touchcancel");
        pointerEvent.path = event.path || event.composedPath();
        pointerEvent.pointerId = touch.identifier - idShift;
        pointerEvent.isPrimary = pointers.length > pointerEvent.pointerId ? pointers[pointerEvent.pointerId].isPrimary : !pointers.some(val => Boolean((val || {}).buttons));
        pointerEvent.pointerType = touch.touchType == "stylus" ? "pen" : "touch";
        event.target.dispatchEvent(pointerEvent);
        if ((event.type == "touchend" || event.type == "touchcancel") && pointerEvent.isPrimary) {
            pointerEvent = new MouseEvent("click", touch);
            pointerEvent.type = "touch";
            event.target.dispatchEvent(pointerEvent);
        }
    });
    if (event.changedTouches[0].touchType == "stylus" && event.type == "touchstart") {
        Array.from(document.querySelectorAll("[onclick]")).some(node => {
            if (node.contains(event.changedTouches[0].target) || node == event.changedTouches[0].target)
                event.preventDefault();
        }, this);
    }
    else if (event.changedTouches[0].touchType == "stylus" && event.type == "touchend") {
        Array.from(document.querySelectorAll("[onclick]")).some(node => {
            if (node.contains(event.changedTouches[0].target) || node == event.changedTouches[0].target)
                node.dispatchEvent(new MouseEvent("click", {clientX:event.changedTouches[0].clientX, clientY:event.changedTouches[0].clientY}));
        }, this);
    }
}