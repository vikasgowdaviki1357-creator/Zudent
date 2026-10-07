import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Bot,
  Send,
  Sparkles,
  CalendarDays,
  BookOpen,
  BriefcaseBusiness,
  ClipboardCheck,
  Bus,
  GraduationCap,
  User,
  RotateCcw,
  RefreshCw,
} from "lucide-react";
import { sendMessage as sendAiMessage } from "../../services/aiService";

const suggestions = [
  {
    icon: CalendarDays,
    label: "Today's Classes",
    prompt: "What classes do I have today?",
  },
  {
    icon: ClipboardCheck,
    label: "Attendance",
    prompt: "Show my attendance",
  },
  {
    icon: BookOpen,
    label: "Find Notes",
    prompt: "Find Python notes",
  },
  {
    icon: BriefcaseBusiness,
    label: "Placements",
    prompt: "Show placement opportunities",
  },
  {
    icon: GraduationCap,
    label: "Assignments",
    prompt: "What assignments are pending?",
  },
  {
    icon: Bus,
    label: "Bus",
    prompt: "Show college bus information",
  },
];

const initialMessages = [
  {
    id: 1,
    role: "assistant",
    content:
      "Hello! I'm JIT AI Assistant. I can help you with academics, attendance, timetable, resources, placements, events and campus services.",
  },
];

function AIAssistant() {
  const navigate = useNavigate();
  const messagesEndRef = useRef(null);

  const [messages, setMessages] = useState(initialMessages);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, loading, error]);

  const generateAction = (text) => {
    if (!text) return null;
    const lowerText = text.toLowerCase();
    
    if (lowerText.includes("attendance")) return { action: "View Attendance", route: "/student/academics" };
    if (lowerText.includes("timetable") || lowerText.includes("schedule") || lowerText.includes("class")) return { action: "Open Timetable", route: "/student/academics" };
    if (lowerText.includes("resource") || lowerText.includes("notes") || lowerText.includes("paper")) return { action: "Open Resources", route: "/student/resources" };
    if (lowerText.includes("placement") || lowerText.includes("job") || lowerText.includes("internship")) return { action: "View Placements", route: "/student/placements" };
    if (lowerText.includes("event") || lowerText.includes("fest") || lowerText.includes("hackathon")) return { action: "Explore Events", route: "/student/events" };
    if (lowerText.includes("market") || lowerText.includes("buy") || lowerText.includes("sell")) return { action: "Open Marketplace", route: "/student/marketplace" };
    if (lowerText.includes("bus") || lowerText.includes("transport") || lowerText.includes("campus") || lowerText.includes("leave")) return { action: "Open Campus Hub", route: "/student/campus" };

    return null;
  };

  const handleSendMessage = async (customMessage) => {
    const messageText = (customMessage || input).trim();
    if (!messageText || loading) return;

    setError(false);
    
    const userMessage = {
      id: Date.now(),
      role: "user",
      content: messageText,
    };

    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    setInput("");
    setLoading(true);

    try {
      // API payload expects { role, content }
      const conversationHistory = newMessages.map(m => ({ role: m.role, content: m.content }));
      const reply = await sendAiMessage(conversationHistory);

      const actionData = generateAction(reply);

      const assistantMessage = {
        id: Date.now() + 1,
        role: "assistant",
        content: reply,
        ...actionData,
      };

      setMessages((current) => [...current, assistantMessage]);
    } catch (err) {
      console.error(err);
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  const handleRetry = () => {
    if (messages.length > 0 && messages[messages.length - 1].role === "user") {
      const lastUserMessage = messages[messages.length - 1].content;
      setMessages((current) => current.slice(0, -1));
      handleSendMessage(lastUserMessage);
    }
  };

  const handleKeyDown = (event) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      handleSendMessage();
    }
  };

  const clearChat = () => {
    setMessages(initialMessages);
    setError(false);
  };

  return (
    <div className="ai-page">
      <div className="module-heading">
        <div>
          <p className="page-eyebrow">JIT INTELLIGENCE</p>
          <h1>AI Assistant</h1>
          <p>
            Your intelligent assistant for academics and campus life.
          </p>
        </div>

        <div className="ai-status">
          <span />
          AI Assistant Online
        </div>
      </div>

      <div className="ai-layout">
        <aside className="ai-sidebar">
          <div className="ai-sidebar-heading">
            <Sparkles size={17} />
            <div>
              <strong>Quick Actions</strong>
              <span>Ask about JIT</span>
            </div>
          </div>

          <div className="ai-suggestions">
            {suggestions.map((suggestion) => {
              const Icon = suggestion.icon;

              return (
                <button
                  key={suggestion.label}
                  onClick={() => handleSendMessage(suggestion.prompt)}
                  disabled={loading}
                >
                  <div>
                    <Icon size={16} />
                  </div>

                  <span>{suggestion.label}</span>
                </button>
              );
            })}
          </div>

          <div className="ai-help-card">
            <Bot size={23} />

            <strong>What can I do?</strong>

            <p>
              Ask questions or use me to quickly navigate through
              your College Super App.
            </p>
          </div>
        </aside>

        <section className="ai-chat">
          <div className="ai-chat-header">
            <div className="ai-bot-profile">
              <div>
                <Bot size={21} />
              </div>

              <section>
                <strong>JIT AI</strong>
                <span>College Assistant</span>
              </section>
            </div>

            <button
              className="clear-chat"
              onClick={clearChat}
              title="Clear conversation"
              disabled={loading}
            >
              <RotateCcw size={16} />
              Clear
            </button>
          </div>

          <div className="ai-messages">
            {messages.map((message) => (
              <Message
                key={message.id}
                message={message}
                navigate={navigate}
              />
            ))}
            
            {loading && (
              <div className="ai-message-row assistant">
                <div className="message-avatar">
                  <Bot size={17} />
                </div>
                <div className="message-bubble typing-indicator">
                  <span>.</span><span>.</span><span>.</span>
                </div>
              </div>
            )}

            {error && (
              <div className="ai-message-row assistant">
                <div className="message-avatar">
                  <Bot size={17} />
                </div>
                <div>
                  <div className="message-bubble error-bubble" style={{ color: 'var(--danger, #EF4444)' }}>
                    Failed to reach JIT AI. Please try again.
                  </div>
                  <button className="ai-message-action" onClick={handleRetry}>
                    <RefreshCw size={14} style={{ marginRight: 6, display: 'inline' }} />
                    Retry
                  </button>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          <div className="ai-input-area">
            <div className="ai-input-box">
              <textarea
                rows="1"
                value={input}
                onChange={(event) => setInput(event.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Ask JIT AI anything..."
                disabled={loading}
              />

              <button
                onClick={() => handleSendMessage()}
                disabled={!input.trim() || loading}
              >
                <Send size={17} />
              </button>
            </div>

            <span>
              JIT AI can access Super App information once the
              backend is connected.
            </span>
          </div>
        </section>
      </div>
    </div>
  );
}

function Message({ message, navigate }) {
  return (
    <div
      className={`ai-message-row ${
        message.role === "user" ? "user" : "assistant"
      }`}
    >
      <div className="message-avatar">
        {message.role === "assistant" ? (
          <Bot size={17} />
        ) : (
          <User size={17} />
        )}
      </div>

      <div>
        <div className="message-bubble">
          {message.content}
        </div>

        {message.action && (
          <button
            className="ai-message-action"
            onClick={() => navigate(message.route)}
          >
            {message.action}
          </button>
        )}
      </div>
    </div>
  );
}

export default AIAssistant;