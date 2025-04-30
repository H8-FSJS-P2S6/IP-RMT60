import { useState, useEffect, useRef } from 'react';
import api from '../utils/api';
import '../styles/chatbot.css'; // Kita akan buat file CSS ini

export default function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      sender: 'bot',
      text: 'Halo! Saya SNS Assistant. Ada yang bisa saya bantu tentang kursus NDT?',
      timestamp: new Date()
    }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [sessionId, setSessionId] = useState('');
  const messagesEndRef = useRef(null);

  // Generate session ID saat komponen dimount
  useEffect(() => {
    setSessionId(`user-${Date.now()}-${Math.floor(Math.random() * 1000)}`);
  }, []);

  // Auto-scroll ke pesan terbaru
  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen]);

  const handleToggleChat = () => {
    setIsOpen(!isOpen);
  };

  const handleInputChange = (e) => {
    setInput(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!input.trim()) return;
    
    const userMessage = {
      sender: 'user',
      text: input,
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setLoading(true);
    
    try {
      const response = await api.post('/chatbot/send', {
        message: userMessage.text,
        sessionId
      });
      
      // Tambahkan respons bot
      setMessages(prev => [
        ...prev,
        {
          sender: 'bot',
          text: response.data.text,
          courses: response.data.courses, // Jika ada data kursus
          timestamp: new Date()
        }
      ]);
    } catch (error) {
      console.error('Error sending message to chatbot:', error);
      setMessages(prev => [
        ...prev,
        {
          sender: 'bot',
          text: 'Maaf, saya mengalami kendala teknis. Silakan coba lagi nanti.',
          timestamp: new Date()
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const formatTime = (date) => {
    return new Date(date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="chatbot-container">
      {/* Tombol untuk membuka/menutup chatbot */}
      <button 
        className={`chatbot-toggle ${isOpen ? 'active' : ''}`}
        onClick={handleToggleChat}
      >
        {isOpen ? (
          <i className="bi bi-x-lg"></i>
        ) : (
          <>
            <i className="bi bi-chat-dots-fill"></i>
            <span className="chat-notification"></span>
          </>
        )}
      </button>
      
      {/* Chat window */}
      <div className={`chatbot-box ${isOpen ? 'open' : ''}`}>
        <div className="chatbot-header">
          <div className="chatbot-title">
            <img 
              src="/technical-support.png" 
              alt="SNS NDT" 
              className="chatbot-avatar"
            />
            <div>
              <h5>SNS Assistant</h5>
              <span className="chatbot-status">Online</span>
            </div>
          </div>
          <button 
            className="chatbot-close" 
            onClick={handleToggleChat}
          >
            <i className="bi bi-x"></i>
          </button>
        </div>
        
        <div className="chatbot-messages">
          {messages.map((msg, index) => (
            <div 
              key={index} 
              className={`message-container ${msg.sender === 'user' ? 'user-message' : 'bot-message'}`}
            >
              {msg.sender === 'bot' && (
                <div className="bot-avatar">
                  <img src="/technical-support.png" alt="Bot" />
                </div>
              )}
              
              <div className="message-content">
                <div className="message-bubble">
                  <p>{msg.text}</p>
                  <span className="message-time">{formatTime(msg.timestamp)}</span>
                </div>
                
                {/* Tampilkan course cards jika ada */}
                {msg.courses && msg.courses.length > 0 && (
                  <div className="course-cards">
                    {msg.courses.map(course => (
                      <div key={course.id} className="course-card">
                        <h6>{course.technique}</h6>
                        <p>{course.name}</p>
                        <p className="course-price">
                          {new Intl.NumberFormat('id-ID', {
                            style: 'currency',
                            currency: 'IDR',
                            maximumFractionDigits: 0
                          }).format(course.price)}
                        </p>
                        <a 
                          href={`/courses/${course.id}`}
                          className="btn btn-sm btn-primary"
                        >
                          Lihat Detail
                        </a>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
          
          {/* Loading indicator */}
          {loading && (
            <div className="message-container bot-message">
              <div className="bot-avatar">
                <img src="/technical-support.png" alt="Bot" />
              </div>
              <div className="message-content">
                <div className="message-bubble typing">
                  <span></span>
                  <span></span>
                  <span></span>
                </div>
              </div>
            </div>
          )}
        </div>
        
        <form className="chatbot-input-form" onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Tulis pesan..."
            value={input}
            onChange={handleInputChange}
            disabled={loading}
          />
          <button 
            type="submit" 
            disabled={!input.trim() || loading}
          >
            <i className="bi bi-send-fill"></i>
          </button>
        </form>
      </div>
    </div>
  );
}