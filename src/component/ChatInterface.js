"use client";
import { useState, useRef, useEffect, useCallback } from "react";
import { useSelector } from "react-redux";
import { HiOutlinePaperAirplane } from "react-icons/hi2";
import { MdRefresh, MdDelete } from "react-icons/md";
import ChatMessage from "./ChatMessage";
import TypingIndicator from "./TypingIndicator";
import { sendMessage } from "@/utils/chatUtils";
import MobileNavigation from "./MobileNavigation";

export default function ChatInterface() {
  const { token } = useSelector((state) => state.auth);
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [error, setError] = useState(null);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);
  const chatContainerRef = useRef(null);

  // Auto-scroll to the latest message
  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping, scrollToBottom]);

  // Focus input on mount
  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  // Handle sending messages
  const handleSend = useCallback(async () => {
    if (!inputValue.trim() || isLoading) return;

    const userMessage = {
      id: Date.now(),
      role: "user",
      content: inputValue.trim(),
      timestamp: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputValue("");
    setIsLoading(true);
    setIsTyping(true);
    setError(null);

    try {
      // Simulate typing delay for realistic UX
      await new Promise((resolve) => setTimeout(resolve, 500));

      const response = await sendMessage(inputValue.trim(), messages, token);

      const assistantMessage = {
        id: Date.now() + 1,
        role: "assistant",
        content: response.content,
        sources: response.sources || [],
        timestamp: new Date().toISOString(),
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch (err) {
      console.error("Chat error:", err);
      setError(err.message || "Failed to send message. Please try again.");
      
      // Add error message to chat
      const errorMessage = {
        id: Date.now() + 1,
        role: "assistant",
        content: "I apologize, but I encountered an error processing your request. Please try again.",
        isError: true,
        timestamp: new Date().toISOString(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
      setIsTyping(false);
      inputRef.current?.focus();
    }
  }, [inputValue, isLoading, messages, token]);

  // Handle Enter key press
  const handleKeyPress = useCallback(
    (e) => {
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        handleSend();
      }
    },
    [handleSend]
  );

  // Clear conversation
  const handleClear = useCallback(() => {
    if (window.confirm("Are you sure you want to clear the conversation?")) {
      setMessages([]);
      setError(null);
      inputRef.current?.focus();
    }
  }, []);

  // Regenerate last response
  const handleRegenerate = useCallback(async () => {
    if (messages.length < 2 || isLoading) return;

    // Find the last user message
    const lastUserMessageIndex = messages.findLastIndex((m) => m.role === "user");
    if (lastUserMessageIndex === -1) return;

    const lastUserMessage = messages[lastUserMessageIndex];
    
    // Remove messages after the last user message
    const trimmedMessages = messages.slice(0, lastUserMessageIndex + 1);
    setMessages(trimmedMessages);
    setIsLoading(true);
    setIsTyping(true);
    setError(null);

    try {
      await new Promise((resolve) => setTimeout(resolve, 500));

      const response = await sendMessage(
        lastUserMessage.content,
        trimmedMessages.slice(0, -1),
        token
      );

      const assistantMessage = {
        id: Date.now(),
        role: "assistant",
        content: response.content,
        sources: response.sources || [],
        timestamp: new Date().toISOString(),
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch (err) {
      console.error("Regenerate error:", err);
      setError(err.message || "Failed to regenerate response.");
    } finally {
      setIsLoading(false);
      setIsTyping(false);
    }
  }, [messages, isLoading, token]);

  return (
    <div className="flex flex-col h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Header */}
      <MobileNavigation />

      {/* Error Banner */}
      {error && (
        <div className="bg-red-50 border-b border-red-200 px-4 py-3">
          <div className="max-w-4xl mx-auto flex items-start gap-3">
            <div className="flex-shrink-0 text-red-500 mt-0.5">⚠️</div>
            <div className="flex-1">
              <p className="text-sm text-red-800">{error}</p>
            </div>
            <button
              onClick={() => setError(null)}
              className="flex-shrink-0 text-red-500 hover:text-red-700"
            >
              ✕
            </button>
          </div>
        </div>
      )}

      {/* Messages Container */}
      <div
        ref={chatContainerRef}
        className="flex-1 overflow-y-auto px-4 py-6 space-y-6"
      >
        <div className="max-w-4xl mx-auto">
          {messages.length === 0 ? (
            <div className="text-center py-12">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-orange-600 mb-4">
                <span className="text-3xl">💬</span>
              </div>
              <h2 className="text-xl font-semibold text-gray-900 mb-2">
                Start a conversation
              </h2>
              <p className="text-gray-600 max-w-md mx-auto">
                Ask me anything related to our application.
              </p>
            </div>
          ) : (
            messages.map((message) => (
              <ChatMessage key={message.id} message={message} />
            ))
          )}

          {isTyping && <TypingIndicator />}

          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input Area */}
      <div className="bg-white border-t border-gray-200 px-4 py-4 sm:px-6 shadow-lg">
        <div className="max-w-4xl mx-auto">
          <div className="relative flex items-end gap-3">
            <div className="flex-1 relative">
              <textarea
                ref={inputRef}
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={handleKeyPress}
                placeholder="Type your message... (Press Enter to send)"
                disabled={isLoading}
                rows={1}
                className="w-full px-4 py-3 pr-12 rounded-xl border border-gray-300 
                         focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 
                         resize-none disabled:bg-gray-50 disabled:cursor-not-allowed
                         transition-all duration-200 text-gray-900 placeholder-gray-400
                         max-h-32 overflow-y-auto"
                style={{
                  minHeight: "48px",
                  height: "auto",
                }}
                onInput={(e) => {
                  e.target.style.height = "auto";
                  e.target.style.height = e.target.scrollHeight + "px";
                }}
              />
              {inputValue.trim() && (
                <button
                  onClick={handleSend}
                  disabled={isLoading}
                  className="absolute right-2 bottom-2 p-2 rounded-lg bg-indigo-600 
                           text-white hover:bg-indigo-700 disabled:opacity-50 
                           disabled:cursor-not-allowed transition-colors shadow-md
                           hover:shadow-lg transform hover:scale-105 active:scale-95"
                  title="Send message"
                >
                  <HiOutlinePaperAirplane className="w-5 h-5" />
                </button>
              )}
            </div>
          </div>

          {/* Helper Text */}
          <div className="mt-2 flex items-center justify-between text-xs text-gray-500">
            <span>Press Enter to send, Shift + Enter for new line</span>
            {isLoading && (
              <span className="text-white font-medium">Thinking...</span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
