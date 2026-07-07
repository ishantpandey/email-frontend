"use client";
import { useState } from "react";
import { MdPerson, MdSmartToy, MdContentCopy, MdCheck } from "react-icons/md";
import { BiLink } from "react-icons/bi";
import { useSelector } from "react-redux";

export default function ChatMessage({ message }) {
    const { user } = useSelector((state) => state.auth);
  const [copied, setCopied] = useState(false);
  const isUser = message.role === "user";
  const isError = message.isError;

  // Format timestamp
  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
    });
  };

  // Copy message content
  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(message.content);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  return (
    <div
      className={`flex gap-4 ${isUser ? "justify-end" : "justify-start"} group`}
    >
      {!isUser && (
        <div className="flex-shrink-0">
          <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
            isError ? "bg-red-100" : "bg-orange-600"
          }`}>
            <MdSmartToy className={`w-4 h-4 ${isError ? "text-red-600" : "text-white"}`} />
          </div>
        </div>
      )}

      <div className={`flex flex-col max-w-[80%] sm:max-w-[70%] ${isUser ? "items-end" : "items-start"}`}>
        {/* Message Bubble */}
        <div
          className={`rounded-2xl px-4 py-2 ${
            isUser
              ? "bg-orange-500 text-white"
              : isError
              ? "bg-red-50 text-red-900 border border-red-200"
              : "bg-gray-100 text-gray-900"
          } shadow-sm`}
        >
          <div className="text-xs sm:text-xs whitespace-pre-wrap break-words">
            {message.content}
          </div>

          {/* Copy Button (for assistant messages) */}
          {!isUser && (
            <button
              onClick={handleCopy}
              className={`mt-2 flex items-center gap-1.5 text-xs ${
                isError ? "text-red-600 hover:text-red-700" : "text-gray-600 hover:text-gray-900"
              } opacity-0 group-hover:opacity-100 transition-opacity`}
              title="Copy message"
            >
              {copied ? (
                <>
                  <MdCheck className="w-3.5 h-3.5" />
                  <span>Copied!</span>
                </>
              ) : (
                <>
                  <MdContentCopy className="w-3.5 h-3.5" />
                  <span>Copy</span>
                </>
              )}
            </button>
          )}
        </div>

        {/* Source Citations */}
        {/* {!isUser && message.sources && message.sources.length > 0 && (
          <div className="mt-2 space-y-1.5 w-full">
            <div className="text-xs font-medium text-gray-600 flex items-center gap-1">
              <BiLink className="w-3.5 h-3.5" />
              Sources:
            </div>
            <div className="space-y-1">
              {message.sources.map((source, index) => (
                <div
                  key={index}
                  className="bg-white border border-gray-200 rounded-lg p-2.5 hover:border-indigo-300 hover:shadow-sm transition-all group/source"
                >
                  <div className="flex items-start gap-2">
                    <span className="flex-shrink-0 w-5 h-5 rounded-full bg-indigo-100 text-indigo-600 text-xs font-semibold flex items-center justify-center">
                      {index + 1}
                    </span>
                    <div className="flex-1 min-w-0">
                      {source.url ? (
                        <a
                          href={source.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-xs sm:text-sm text-indigo-600 hover:text-indigo-800 font-medium truncate block hover:underline"
                        >
                          {source.title || source.url}
                        </a>
                      ) : (
                        <span className="text-xs sm:text-sm text-gray-900 font-medium">
                          {source.title}
                        </span>
                      )}
                      {source.snippet && (
                        <p className="text-xs text-gray-600 mt-0.5 line-clamp-2">
                          {source.snippet}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )} */}

        {/* Timestamp */}
        <div className="mt-1 text-xs text-gray-500 px-1">
          {formatTime(message.timestamp)}
        </div>
      </div>

      {isUser && (
        <div className="flex-shrink-0">
          <div className="w-6 h-6 rounded-full bg-gray-200 flex items-center justify-center">
           {user?.profileImage ? (
             <img src={user?.profileImage} alt="Profile" className="w-6 h-6 rounded-full" />
           ) : (
             <MdPerson className="w-5 h-5 text-gray-600" />
           )}       
          </div>
        </div>
      )}
    </div>
  );
}
