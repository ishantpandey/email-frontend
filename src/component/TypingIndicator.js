"use client";
import { MdSmartToy } from "react-icons/md";

export default function TypingIndicator() {
  return (
    <div className="flex gap-4 justify-start">
      <div className="flex-shrink-0">
        <div className="w-8 h-8 rounded-full bg-orange-100 flex items-center justify-center">
          <MdSmartToy className="w-4 h-4 text-white" />
        </div>
      </div>

      <div className="flex flex-col">
        <div className="bg-gray-100 rounded-2xl px-4 py-3 shadow-sm">
          <div className="flex items-center gap-1.5">
            <div className="flex gap-1">
              <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "0ms" }}></div>
              <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "150ms" }}></div>
              <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "300ms" }}></div>
            </div>
            <span className="text-xs text-gray-500 ml-1">AI is typing...</span>
          </div>
        </div>
      </div>
    </div>
  );
}
