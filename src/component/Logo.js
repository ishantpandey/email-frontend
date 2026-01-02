'use client';

export default function Logo({ size = "md", variant = "default", animate = true }) {
  const sizes = {
    xs: "w-6 h-6",
    sm: "w-8 h-8",
    md: "w-12 h-12",
    lg: "w-16 h-16",
    xl: "w-24 h-24",
    "2xl": "w-32 h-32"
  };

  const variants = {
    default: "text-blue-600",
    white: "text-white",
    dark: "text-gray-800",
    gradient: "bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent"
  };

  return (
    <div className={`${sizes[size]} relative flex items-center justify-center group cursor-pointer`}>
      {/* Outer circle with gradient and animation */}
      <div className={`
        absolute inset-0 
        bg-gradient-to-br from-blue-500 via-blue-600 to-indigo-600 
        rounded-2xl shadow-lg 
        ${animate ? 'transform rotate-3 group-hover:rotate-6 transition-transform duration-300' : ''}
        ${animate ? 'group-hover:shadow-xl group-hover:shadow-blue-500/30' : ''}
      `}></div>
      
      {/* Glow effect */}
      {animate && (
        <div className="absolute inset-0 bg-blue-400/20 rounded-2xl blur-md opacity-0 group-hover:opacity-100 transition-opacity duration-300 scale-110"></div>
      )}
      
      {/* Inner white background */}
      <div className={`
        absolute inset-1 
        bg-white rounded-xl
        ${animate ? 'group-hover:bg-blue-50 transition-colors duration-300' : ''}
      `}></div>
      
      {/* Email icon with flow animation */}
      <div className="relative z-10 flex items-center justify-center w-full h-full">
        <svg 
          className={`
            ${sizes[size]} ${variants[variant]} 
            p-2 transition-all duration-300
            ${animate ? 'group-hover:scale-110' : ''}
          `} 
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
          strokeWidth={1.8}
        >
          {/* Envelope base */}
          <path 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75"
            className={animate ? 'animate-pulse' : ''}
          />
        </svg>
        
        {/* Floating particles for premium feel */}
        {animate && (
          <>
            <div className="absolute top-1 right-1 w-1 h-1 bg-blue-400 rounded-full opacity-0 group-hover:opacity-100 animate-ping" style={{animationDelay: '0.5s'}}></div>
            <div className="absolute bottom-2 left-2 w-0.5 h-0.5 bg-indigo-400 rounded-full opacity-0 group-hover:opacity-100 animate-ping" style={{animationDelay: '1s'}}></div>
            <div className="absolute top-2 left-1 w-0.5 h-0.5 bg-blue-300 rounded-full opacity-0 group-hover:opacity-100 animate-ping" style={{animationDelay: '1.5s'}}></div>
          </>
        )}
      </div>
    </div>
  );
}