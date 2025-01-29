import React from "react";

const DragItem = ({ item }) => {
  const handleDragStart = (e) => {
    e.dataTransfer.setData("text/plain", item);
    window.draggedItem = item; // Store the dragged item globally
  };

  return (
    <div
      className="item"
      draggable
      onDragStart={handleDragStart}
      tabIndex="0"
      role="button"
      aria-label={`Draggable item: ${item}`}
    >
      {item}
    </div>
  );
};

export default DragItem;
