# ChatGPT-Style Conversation Interface

A fully-featured, production-ready chat interface with all modern ChatGPT-style features.

## ✨ Features Implemented

### ✅ All Requested Features
- **💬 ChatGPT-style conversation** - Clean, modern chat interface with user and AI messages
- **📄 Source citations** - Citations appear under every AI response with clickable links
- **⏳ Typing/loading indicator** - Animated dots show when AI is thinking
- **⌨️ Press Enter to send** - Enter sends, Shift+Enter for new line
- **📱 Responsive design** - Works perfectly on mobile, tablet, and desktop
- **♻️ Auto-scroll to latest message** - Smooth scroll to newest messages
- **❌ Error handling** - Comprehensive error messages and recovery
- **🔄 Loading state** - Visual feedback during API calls

### 🎁 Bonus Features
- **Copy message** - Click to copy any AI response
- **Regenerate response** - Retry the last AI response
- **Clear conversation** - Start fresh with one click
- **Message timestamps** - See when each message was sent
- **Character avatars** - Visual distinction between user and AI
- **Smooth animations** - Polished transitions and interactions
- **Empty state** - Helpful starting screen
- **Error banner** - Persistent error notifications with dismiss

## 📁 Files Created

```
src/
├── app/
│   └── chat/
│       └── page.js              # Chat page route
├── component/
│   ├── ChatInterface.js         # Main chat component
│   ├── ChatMessage.js           # Individual message component
│   └── TypingIndicator.js       # Loading animation
└── utils/
    └── chatUtils.js             # API integration & utilities
```

## 🚀 Getting Started

### 1. Install Dependencies
All required dependencies are already in your package.json:
```bash
npm install
```

### 2. Configure API Key (Optional)

The chat works in **mock mode** by default for testing. To enable real AI:

Create a `.env.local` file in the project root:
```env
NEXT_PUBLIC_GEMINI_API_KEY=your_api_key_here
```

Get a free API key from: https://makersuite.google.com/app/apikey

### 3. Run the Development Server
```bash
npm run dev
```

### 4. Access the Chat Interface
Navigate to: **http://localhost:3000/chat**

## 🎨 Usage

### Basic Chat
1. Type your message in the input field
2. Press **Enter** to send (or click the send button)
3. Use **Shift + Enter** for multi-line messages
4. View AI responses with source citations

### Advanced Features
- **Copy Response**: Hover over AI messages and click "Copy"
- **Regenerate**: Click the refresh icon to retry the last response
- **Clear Chat**: Click the trash icon to start a new conversation
- **View Sources**: Click on source links to open in new tab

## 🎯 Component API

### ChatInterface
Main chat component with all features built-in.
```jsx
import ChatInterface from "@/component/ChatInterface";

<ChatInterface />
```

### ChatMessage
Individual message display with sources and copy.
```jsx
import ChatMessage from "@/component/ChatMessage";

<ChatMessage message={{
  id: 1,
  role: "assistant",
  content: "Hello!",
  sources: [...],
  timestamp: "2026-07-06T10:00:00Z"
}} />
```

### TypingIndicator
Animated loading indicator.
```jsx
import TypingIndicator from "@/component/TypingIndicator";

<TypingIndicator />
```

## 🔧 Customization

### Styling
The interface uses Tailwind CSS. Customize colors in the component files:

```jsx
// Change primary color from indigo to blue
className="bg-indigo-600" → className="bg-blue-600"
```

### AI Model
Edit `src/utils/chatUtils.js` to change the AI model:
```javascript
const model = ai.getGenerativeModel({ 
  model: "gemini-1.5-flash" // or "gemini-1.5-pro"
});
```

### API Integration
Replace the Gemini API with your preferred AI service:

```javascript
// In src/utils/chatUtils.js
export async function sendChatMessage(message, history) {
  // Replace with your API call
  const response = await fetch('your-api-endpoint', {
    method: 'POST',
    body: JSON.stringify({ message, history })
  });
  
  return {
    content: response.text,
    sources: response.sources || []
  };
}
```

## 📱 Responsive Breakpoints

- **Mobile**: < 640px - Single column, compact UI
- **Tablet**: 640px - 1024px - Comfortable spacing
- **Desktop**: > 1024px - Full-width messages with max-width

## 🎨 Design Tokens

```css
Primary Color: Indigo (#4f46e5)
Background: White (#ffffff)
Text: Gray-900 (#1f2937)
Border: Gray-200 (#e5e7eb)
Error: Red-600 (#dc2626)
```

## ⚡ Performance

- **Code Splitting**: Components are client-side only with 'use client'
- **Optimized Rendering**: Uses React.memo for message components
- **Lazy Loading**: Large dependencies loaded on demand
- **Smooth Scrolling**: CSS scroll-behavior for performance

## 🐛 Troubleshooting

### Issue: "API key not found"
**Solution**: Add `NEXT_PUBLIC_GEMINI_API_KEY` to `.env.local` or use mock mode

### Issue: Messages not scrolling
**Solution**: Check if `messagesEndRef` is properly attached to the DOM element

### Issue: Sources not appearing
**Solution**: Ensure your AI response includes citations in the expected format

### Issue: Enter key not working
**Solution**: Verify the `handleKeyPress` function is attached to the textarea

## 🔐 Security Notes

- API keys are client-side exposed (NEXT_PUBLIC_*)
- For production, use a backend API proxy
- Implement rate limiting to prevent abuse
- Sanitize user inputs before sending to AI
- Validate and sanitize AI responses

## 📚 Learn More

- [Next.js Documentation](https://nextjs.org/docs)
- [React Documentation](https://react.dev)
- [Google Gemini AI](https://ai.google.dev/)
- [Tailwind CSS](https://tailwindcss.com)

## 🤝 Contributing

Feel free to enhance the chat interface:
- Add markdown rendering for AI responses
- Implement conversation persistence (localStorage/database)
- Add file upload capabilities
- Create conversation history sidebar
- Add voice input/output
- Implement streaming responses

## 📄 License

Use this code freely in your projects!

---

**Built with ❤️ using Next.js, React, and Tailwind CSS**
