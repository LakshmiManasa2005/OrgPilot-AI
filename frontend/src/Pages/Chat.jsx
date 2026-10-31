
import { useState, useEffect, useRef } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import "../styles/chat.css";

function Chat() {
    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(false);

    // Identify the logged-in user
    const userEmail = localStorage.getItem("orgpilotUser") || "guest";
    const chatStorageKey = `orgpilotChat_${userEmail}`;

    // Load previous chat messages when opening this module
    const [messages, setMessages] = useState(() => {
        try {
            const savedMessages = localStorage.getItem(chatStorageKey);

            return savedMessages
                ? JSON.parse(savedMessages)
                : [
                    {
                        sender: "ai",
                        text: "Hello! I'm OrgPilot AI. Ask me anything about programming, technology, documents or your studies."
                    }
                ];
        } catch {
            return [
                {
                    sender: "ai",
                    text: "Hello! I'm OrgPilot AI. Ask me anything about programming, technology, documents or your studies."
                }
            ];
        }
    });

    const chatEndRef = useRef(null);

    // Automatically save chat messages
    useEffect(() => {
        localStorage.setItem(chatStorageKey, JSON.stringify(messages));
    }, [messages, chatStorageKey]);

    // Scroll to the latest message
    useEffect(() => {
        chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages, loading]);

    async function sendMessage() {
        const question = message.trim();

        if (!question || loading) return;

        setMessages(previous => [
            ...previous,
            { sender: "user", text: question }
        ]);

        setMessage("");
        setLoading(true);

        try {
            const response = await fetch("http://localhost:8080/api/ai/chat", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ question })
            });

            if (!response.ok) {
                throw new Error(`Server error: ${response.status}`);
            }

            const data = await response.json();

            setMessages(previous => [
                ...previous,
                {
                    sender: "ai",
                    text: data.answer || "I couldn't generate an answer. Please try again."
                }
            ]);
        } catch (error) {
            setMessages(previous => [
                ...previous,
                {
                    sender: "ai",
                    text: "Sorry, I couldn't connect to the AI service. Please check your backend and try again."
                }
            ]);
        } finally {
            setLoading(false);
        }
    }

    function startNewChat() {
        if (loading) return;

        setMessages([
            {
                sender: "ai",
                text: "Hello! I'm OrgPilot AI. What would you like to explore today?"
            }
        ]);

        setMessage("");
    }

    return (
        <div className="chat-page">
            <header className="chat-topbar">
                <div className="chat-brand">
                    <div className="chat-brand-icon">✦</div>
                    <div>
                        <h1>OrgPilot AI</h1>
                        <span><i /> AI ASSISTANT</span>
                    </div>
                </div>

                <button
                    className="new-chat-btn"
                    onClick={startNewChat}
                    disabled={loading}
                >
                    + New Chat
                </button>
            </header>

            <main className="chat-main">
                {messages.length === 1 && (
                    <div className="chat-welcome">
                        <span className="welcome-label">YOUR AI WORKSPACE</span>
                        <h2>What can I help you with?</h2>
                        <p>Ask a question and let's work through it together.</p>

                        <div className="suggestion-list">
                            {[
                                "Explain Java in simple terms",
                                "Give me 5 SQL interview questions",
                                "Explain object-oriented programming"
                            ].map((item, index) => (
                                <button
                                    key={index}
                                    onClick={() => setMessage(item)}
                                >
                                    <span>✧</span> {item} <span>↗</span>
                                </button>
                            ))}
                        </div>
                    </div>
                )}

                <div className="chat-messages">
                    {messages.map((msg, index) => (
                        <div
                            className={`chat-message ${msg.sender}`}
                            key={index}
                        >
                            {msg.sender === "ai" && (
                                <div className="message-avatar">✦</div>
                            )}

                            <div className="message-content">
                                <span className="message-sender">
                                    {msg.sender === "ai" ? "OrgPilot AI" : "You"}
                                </span>

                                <div className="message-bubble">
                                    {msg.sender === "ai" ? (
                                        <ReactMarkdown remarkPlugins={[remarkGfm]}>
                                            {msg.text}
                                        </ReactMarkdown>
                                    ) : (
                                        <p>{msg.text}</p>
                                    )}
                                </div>
                            </div>

                            {msg.sender === "user" && (
                                <div className="message-avatar user-avatar">Y</div>
                            )}
                        </div>
                    ))}

                    {loading && (
                        <div className="chat-message ai">
                            <div className="message-avatar">✦</div>

                            <div className="message-content">
                                <span className="message-sender">OrgPilot AI</span>

                                <div className="message-bubble typing-bubble">
                                    <span className="typing-dot" />
                                    <span className="typing-dot" />
                                    <span className="typing-dot" />
                                    <span className="typing-label">Thinking...</span>
                                </div>
                            </div>
                        </div>
                    )}

                    <div ref={chatEndRef} />
                </div>
            </main>

            <footer className="chat-composer">
                <div className="composer-box">
                    <textarea
                        placeholder="Message OrgPilot AI..."
                        value={message}
                        rows={1}
                        onChange={event => setMessage(event.target.value)}
                        onKeyDown={event => {
                            if (event.key === "Enter" && !event.shiftKey) {
                                event.preventDefault();
                                sendMessage();
                            }
                        }}
                        disabled={loading}
                    />

                    <button
                        className="send-btn"
                        onClick={sendMessage}
                        disabled={loading || !message.trim()}
                        aria-label="Send message"
                    >
                        {loading ? "..." : "↑"}
                    </button>
                </div>

                <p>AI can make mistakes. Verify important information.</p>
            </footer>
        </div>
    );
}

export default Chat;
