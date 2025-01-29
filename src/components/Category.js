import React, { useState } from "react";

const Category = ({ category, onDrop }) => {
  const [isFocused, setIsFocused] = useState(false);

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const item = e.dataTransfer.getData("text/plain");
    onDrop(item);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      const item = window.draggedItem; // Use a global variable to track the dragged item
      if (item) {
        onDrop(item);
      }
    }
  };

  const handleFocus = () => {
    setIsFocused(true);
  };

  const handleBlur = () => {
    setIsFocused(false);
  };

  return (
    <div
      className={`category ${isFocused ? "focused" : ""}`}
      onDragOver={handleDragOver}
      onDrop={handleDrop}
      onKeyDown={handleKeyDown}
      onFocus={handleFocus}
      onBlur={handleBlur}
      tabIndex="0"
      role="region"
      aria-label={`Drop area for category: ${category.name}`}
    >
      <h3>{category.name}</h3>
    </div>
  );
};

export default Category;
