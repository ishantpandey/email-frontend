'use client';
import { useState } from 'react';

export default function AnimatedButton({ 
  children, 
  variant = "primary", 
  size = "md", 
  className = "", 
  onClick,
  disabled = false,
  loading = false,
  icon,
  iconPosition = "left",
  ...props 
}) {
  const [isPressed, setIsPressed] = useState(false);

  const variants = {
    primary: "bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-lg hover:shadow-xl hover:shadow-blue-500/25 focus:ring-4 focus:ring-blue-300",
    secondary: "bg-white/90 backdrop-blur-sm text-gray-700 border border-gray-200 hover:bg-white hover:shadow-xl hover:border-gray-300 focus:ring-4 focus:ring-gray-200",
    ghost: "text-blue-600 hover:bg-blue-50 border border-transparent hover:border-blue-200 focus:ring-4 focus:ring-blue-100",
    danger: "bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white shadow-lg hover:shadow-xl hover:shadow-red-500/25 focus:ring-4 focus:ring-red-300",
    success: "bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white shadow-lg hover:shadow-xl hover:shadow-green-500/25 focus:ring-4 focus:ring-green-300"
  };

  const sizes = {
    xs: "px-3 py-1.5 text-xs",
    sm: "px-4 py-2 text-sm",
    md: "px-6 py-3 text-base",
    lg: "px-8 py-4 text-lg",
    xl: "px-10 py-5 text-xl"
  };

  const disabledStyles = "opacity-50 cursor-not-allowed transform-none hover:scale-100";
  
  const handleMouseDown = () => setIsPressed(true);
  const handleMouseUp = () => setIsPressed(false);
  const handleMouseLeave = () => setIsPressed(false);

  return (
    <button
      className={`
        ${variants[variant]} 
        ${sizes[size]} 
        rounded-xl font-medium 
        ${disabled || loading ? disabledStyles : 'transform hover:scale-[1.02] active:scale-[0.98]'}
        ${isPressed ? 'scale-[0.98]' : ''}
        transition-all duration-200 ease-out
        relative overflow-hidden 
        group
        focus:outline-none
        inline-flex items-center justify-center gap-2
        ${className}
      `}
      onClick={onClick}
      disabled={disabled || loading}
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseLeave}
      {...props}
    >
      {/* Shine effect */}
      {!disabled && !loading && (
        <div className="absolute inset-0 -top-full bg-gradient-to-b from-transparent via-white/20 to-transparent transform -skew-x-12 transition-all duration-700 group-hover:top-full"></div>
      )}
      
      {/* Ripple effect */}
      {!disabled && !loading && (
        <div className="absolute inset-0 opacity-0 group-active:opacity-100 bg-white/10 transition-opacity duration-150"></div>
      )}
      
      {/* Button content */}
      <span className="relative z-10 flex items-center gap-2">
        {loading && (
          <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
        )}
        {icon && iconPosition === "left" && !loading && (
          <span className="w-4 h-4">{icon}</span>
        )}
        {children}
        {icon && iconPosition === "right" && !loading && (
          <span className="w-4 h-4">{icon}</span>
        )}
      </span>
    </button>
  );
}