// Backend API configuration
const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:5000";
const CHAT_ENDPOINT = "/api/chat";

/**
 * Get authentication token from localStorage
 * @returns {string|null} - Auth token
 */

/**
 * Send a chat message to backend and get AI response
 * @param {string} message - User's message
 * @param {Array} conversationHistory - Previous messages in the conversation
 * @param {string} token - Optional authentication token
 * @returns {Promise<Object>} - Response with content and sources
 */
export async function sendChatMessage(message, conversationHistory = [], token = null) {
  try {
    // Get token from localStorage if not provided
    const authToken = token 
    
    // Prepare request headers
    const headers = {
      "Content-Type": "application/json",
    };
    
    if (authToken) {
      headers["Authorization"] = `Bearer ${authToken}`;
    }

    // Prepare request body
    const requestBody = {
      question: message,
      // Include conversation history if your backend supports it
      history: conversationHistory.map((msg) => ({
        role: msg.role,
        content: msg.content,
      })),
    };

    // Send request to backend
    const response = await fetch(`${BACKEND_URL}${CHAT_ENDPOINT}`, {
      method: "POST",
      headers: headers,
      body: JSON.stringify(requestBody),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(
        errorData.message || 
        errorData.error || 
        `Server error: ${response.status} ${response.statusText}`
      );
    }

    const data = await response.json();

    // Check if response was successful
    if (!data.success) {
      throw new Error(data.message || data.error || "Failed to get response from AI");
    }

    // Format sources for the chat interface
    const formattedSources = (data.sources || []).map((source, index) => ({
      title: source.sourceName || `Source ${index + 1}`,
      url: source.url || null,
      snippet: `${source.sourceType || 'Document'} - Page ${source.page || 'N/A'} (Score: ${(source.score * 100).toFixed(1)}%)`,
      documentId: source.documentId,
      page: source.page,
      score: source.score,
    }));

    return {
      content: data.answer,
      sources: formattedSources,
    };
  } catch (error) {
    console.error("Chat API error:", error);
    
    // Handle network errors
    if (error.message.includes('fetch')) {
      throw new Error("Unable to connect to chat service. Please check your connection.");
    }
    
    throw new Error(error.message || "Failed to get AI response");
  }
}

/**
 * Format conversation history for API
 * @param {Array} messages - Array of message objects
 * @returns {Array} - Formatted history
 */
export function formatConversationHistory(messages) {
  return messages.map((msg) => ({
    role: msg.role,
    content: msg.content,
  }));
}

/**
 * Validate message before sending
 * @param {string} message - Message to validate
 * @returns {Object} - Validation result
 */
export function validateMessage(message) {
  if (!message || typeof message !== "string") {
    return { isValid: false, error: "Message must be a string" };
  }

  const trimmed = message.trim();
  
  if (trimmed.length === 0) {
    return { isValid: false, error: "Message cannot be empty" };
  }

  if (trimmed.length > 10000) {
    return { isValid: false, error: "Message is too long (max 10,000 characters)" };
  }

  return { isValid: true, message: trimmed };
}

/**
 * Mock function for testing without backend
 * Use this if backend is not available
 */
export async function sendChatMessageMock(message, conversationHistory = []) {
  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 1500));

  const mockResponses = [
    {
      answer: "I'm a mock AI assistant connected to your backend. I can help you with various tasks including answering questions, writing code, and providing information. How can I assist you today?",
      sources: [
        {
          sourceName: "System Documentation",
          sourceType: "document",
          page: 1,
          score: 0.95,
          documentId: "mock-doc-1",
        },
        {
          sourceName: "User Guide",
          sourceType: "text",
          page: 3,
          score: 0.87,
          documentId: "mock-doc-2",
        },
      ],
    },
    {
      answer: `You asked: "${message}"\n\nThis is a mock response. Your backend is configured at ${BACKEND_URL}${CHAT_ENDPOINT}. To use the real backend:\n\n1. Make sure your backend server is running\n2. The endpoint should accept POST requests with { question, history }\n3. It should return { success, answer, sources }\n\nThe chat interface is ready to connect!`,
      sources: [
        {
          sourceName: "API Documentation",
          sourceType: "document",
          page: 1,
          score: 0.92,
          documentId: "mock-doc-3",
        },
      ],
    },
  ];

  const mockData = mockResponses[Math.floor(Math.random() * mockResponses.length)];
  
  // Format sources
  const formattedSources = mockData.sources.map((source, index) => ({
    title: source.sourceName || `Source ${index + 1}`,
    url: source.url || null,
    snippet: `${source.sourceType || 'Document'} - Page ${source.page || 'N/A'} (Score: ${(source.score * 100).toFixed(1)}%)`,
    documentId: source.documentId,
    page: source.page,
    score: source.score,
  }));

  return {
    content: mockData.answer,
    sources: formattedSources,
  };
}

/**
 * Export the appropriate function based on environment
 * To use mock mode, change this to: export const sendMessage = sendChatMessageMock;
 */
export const sendMessage = sendChatMessage;
