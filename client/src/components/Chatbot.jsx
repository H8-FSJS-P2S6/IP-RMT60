import { useState, useEffect, useRef } from 'react';
import api from '../utils/api';
import '../styles/chatbot.css';
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { AnimatePresence, motion } from 'framer-motion';
import { MessageSquare, Send, X, Loader2, Bot, User, Clock, HelpCircle, DollarSign, BookOpen, Phone, ChevronDown } from "lucide-react";

const Chatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const quickReplies = [
    { text: "View course list", icon: <BookOpen className="w-4 h-4" /> },
    { text: "Ask course price", icon: <DollarSign className="w-4 h-4" /> },
    { text: "Registration info", icon: <HelpCircle className="w-4 h-4" /> },
    { text: "Contact admin", icon: <Phone className="w-4 h-4" /> }
  ];

  useEffect(() => {
    if (messages.length === 0) {
      const timer = setTimeout(() => {
        setMessages([
          {
            sender: 'bot',
            text: 'Hello! I am SNS Assistant 🤖\n\nI am ready to help you with information about:\n• NDT courses and prices\n• Training schedules\n• ASNT certifications\n• Registration process\n\nHow can I help you today?',
            timestamp: new Date(),
          }
        ]);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [messages.length]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  const handleToggleChat = () => setIsOpen(!isOpen);

  const handleQuickReply = (text) => {
    sendMessage(text);
  };

  const sendMessage = async (messageText) => {
    if (!messageText.trim()) return;

    const userMessage = { sender: 'user', text: messageText, timestamp: new Date() };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setLoading(true);

    try {
      const response = await api.post('/chatbot/send', { message: messageText });
      const botMessage = { sender: 'bot', text: response.data.text, timestamp: new Date() };
      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      const errorMessage = {
        sender: 'bot',
        text: 'Maaf, saya sedang mengalami gangguan teknis. Silakan coba lagi nanti.',
        timestamp: new Date(),
        isError: true
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    sendMessage(input);
  };

  return (
    <>
      <div className="chatbot-container">
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.95 }}
              transition={{ duration: 0.3, ease: 'easeOut' }}
              className="chat-window"
            >
              <header className="chat-header">
                <div className="flex items-center gap-3">
                  <div className="avatar-container">
                    <img src="/technical-support.png" alt="SNS NDT" className="avatar-img" />
                    <span className="status-indicator" />
                  </div>
                  <div>
                    <h3 className="font-bold text-base text-gray-800">SNS Assistant</h3>
                    <p className="text-xs text-gray-500">Online</p>
                  </div>
                </div>
                <button onClick={handleToggleChat} className="close-button">
                  <ChevronDown className="w-5 h-5" />
                </button>
              </header>

              <main className="chat-body">
                {messages.map((msg, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.2 }}
                    className={`message-container ${msg.sender === 'user' ? 'user-message' : 'bot-message'}`}
                  >
                    <div className={`message-bubble ${msg.isError ? 'error-bubble' : ''}`}>
                      <p className="text-sm whitespace-pre-wrap">{msg.text}</p>
                    </div>
                    <span className="timestamp">{new Date(msg.timestamp).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}</span>
                  </motion.div>
                ))}
                {loading && (
                  <div className="message-container bot-message">
                    <div className="message-bubble typing-indicator">
                      <div /><div /><div />
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </main>

              {messages.length <= 1 && !loading && (
                <section className="quick-replies-section">
                  <div className="quick-replies-container">
                    {quickReplies.map((reply) => (
                      <button key={reply.text} onClick={() => handleQuickReply(reply.text)} className="quick-reply-chip">
                        {reply.icon}
                        <span>{reply.text}</span>
                      </button>
                    ))}
                  </div>
                </section>
              )}

              <footer className="chat-footer">
                <form onSubmit={handleSubmit} className="input-form">
                  <Input
                    type="text"
                    placeholder="Ketik pesan Anda..."
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    disabled={loading}
                    className="chat-input"
                    autoComplete="off"
                  />
                  <Button type="submit" disabled={!input.trim() || loading} className="send-button">
                    {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                  </Button>
                </form>
                <p className="footer-text">
                  Powered by SNS NDT Academy
                </p>
              </footer>
            </motion.div>
          )}
        </AnimatePresence>

        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.5, type: 'spring', stiffness: 500, damping: 30 }}
        >
          <Button onClick={handleToggleChat} className="chat-toggle-button">
            <AnimatePresence>
              {isOpen ? (
                <motion.div key="close" initial={{ rotate: 45, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: -45, opacity: 0 }}>
                  <X className="w-6 h-6" />
                </motion.div>
              ) : (
                <motion.div key="open" initial={{ rotate: -45, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 45, opacity: 0 }}>
                  <MessageSquare className="w-6 h-6" />
                </motion.div>
              )}
            </AnimatePresence>
          </Button>
        </motion.div>
      </div>
    </>
  );
};

export default Chatbot;