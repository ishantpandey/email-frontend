"use client";
import { useState, useRef } from "react";
import { IoClose } from "react-icons/io5";

export default function CustomChips({ 
  value = [], 
  onChange, 
  placeholder = "Enter emails...", 
  className = "" 
}) {
  const [inputValue, setInputValue] = useState("");
  const inputRef = useRef(null);

  // Ensure value is always an array
  const safeValue = Array.isArray(value) ? value : [];

  const addChip = (chipValue) => {
    const trimmedValue = chipValue.trim();
    if (trimmedValue && !safeValue.includes(trimmedValue)) {
      onChange([...safeValue, trimmedValue]);
    }
    setInputValue("");
  };

  const removeChip = (index) => {
    const newValue = safeValue.filter((_, i) => i !== index);
    onChange(newValue);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" || e.key === "," || e.key === " ") {
      e.preventDefault();
      addChip(inputValue);
    } else if (e.key === "Backspace" && !inputValue && safeValue.length > 0) {
      removeChip(safeValue.length - 1);
    }
  };

  const handleInputBlur = () => {
    if (inputValue.trim()) {
      addChip(inputValue);
    }
  };

  const handleContainerClick = () => {
    inputRef.current?.focus();
  };

  return (
    <div
      className={`flex flex-wrap items-start gap-1 px-3 pt-1.5  border border-gray-300 rounded focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-100  cursor-text min-h-[32px] ${className}`}
      onClick={handleContainerClick}
    >
      {safeValue.map((chip, index) => (
        <div
          key={index}
          className="inline-flex items-center justify-center  bg-orange-500 text-white rounded-lg px-2 py-0 text-xs h-5 leading-5"
        >
          <span className="max-w-[100px] truncate">{chip}</span>
          <button
            onClick={(e) => {
              e.stopPropagation();
              removeChip(index);
            }}
            className="ml-1 hover:bg-orange-200 rounded-full p-0.5 flex items-center justify-center"
            type="button"
          >
            <IoClose className="w-3 h-3" />
          </button>
        </div>
      ))}
      <input
        ref={inputRef}
        type="text"
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        onKeyDown={handleKeyDown}
        onBlur={handleInputBlur}
        placeholder={safeValue.length === 0 ? placeholder : ""}
        className="flex-1 min-w-[100px] outline-none border-none bg-transparent px-1 focus:outline-none focus:ring-0 flex items-center"
        style={{ 
          fontSize: "1rem", 
          fontWeight: "450", 
          fontFamily: "Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif",
          lineHeight: "1.5",
          height: "20px",
          outline: "none", 
          border: "none", 
          boxShadow: "none" 
        }}
      />
    </div>
  );
}