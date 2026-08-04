
/**
 * Send a chat message to backend and get streaming AI response
 * @param {string} message - User's message
 * @param {Array} conversationHistory - Previous messages in the conversation
 * @param {function} onChunk - Callback for each streamed chunk
 * @param {string} token - Optional authentication token
 * @returns {Promise<Object>} - Response with complete content and sources
 */
export async function sendChatMessageStreaming(message, conversationHistory = [], onChunk = null, token = null) {
  try {
    // Get token from localStorage if not provided
    const authToken = token || localStorage.getItem("authToken");
    
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
      stream: true, // Enable streaming
      history: conversationHistory.map((msg) => ({
        role: msg.role,
        content: msg.content,
      })),
    };

    // Send request to backend
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/chat/stream`, {
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

    // Handle streaming response from LangChain
    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    let fullContent = '';
    let sources = [];
    let buffer = '';

    while (true) {
      const { done, value } = await reader.read();
      
      if (done) break;
      
      // Decode the chunk and add to buffer
      buffer += decoder.decode(value, { stream: true });
      const lines = buffer.split('\n');
      
      // Keep the last incomplete line in the buffer
      buffer = lines.pop() || '';
      
      for (const line of lines) {
        if (!line.trim()) continue;
        
        // Handle SSE format: "data: ..."
        let data = line;
        if (line.startsWith('data: ')) {
          data = line.slice(6);
        }
        
        if (data === '[DONE]') continue;
        
        try {
          // Try to parse as JSON
          const parsed = JSON.parse(data);
          
          // Handle different response formats
          if (parsed.content) {
            // LangChain chunk format: { content: "text" }
            fullContent += parsed.content;
            if (onChunk) {
              onChunk(parsed.content);
            }
          } else if (parsed.type === 'content' && parsed.data) {
            // Alternative format: { type: "content", data: "text" }
            fullContent += parsed.data;
            if (onChunk) {
              onChunk(parsed.data);
            }
          } else if (parsed.type === 'sources' || parsed.sources) {
            // Sources at the end
            sources = parsed.sources || parsed.data || [];
          } else if (parsed.type === 'error') {
            throw new Error(parsed.message || 'Streaming error');
          } else if (typeof parsed === 'string') {
            // Plain string chunk
            fullContent += parsed;
            if (onChunk) {
              onChunk(parsed);
            }
          }
        } catch (e) {
          // If not JSON, treat as plain text chunk
          if (e instanceof SyntaxError) {
            fullContent += data;
            if (onChunk) {
              onChunk(data);
            }
          } else {
            throw e;
          }
        }
      }
    }

    // Process any remaining buffer
    if (buffer.trim()) {
      try {
        const parsed = JSON.parse(buffer);
        if (parsed.sources) {
          sources = parsed.sources;
        }
      } catch (e) {
        // Ignore parse errors for final buffer
      }
    }

    return {
      content: fullContent,
      sources: sources,
    };
  } catch (error) {
    console.error("Chat streaming error:", error);
    
    if (error.message.includes('fetch')) {
      throw new Error("Unable to connect to chat service. Please check your connection.");
    }
    
    throw new Error(error.message || "Failed to get AI response");
  }
}

export const sendMessage = sendChatMessageStreaming;
