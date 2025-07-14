import { useState, useEffect, useRef } from 'react';
import api from '../utils/api';
import '../styles/chatbot.css';
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/Card";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/Sheet";
import { Badge } from "@/components/ui/Badge";
import { MessageSquare, Send, X, Loader2, Bot, User, Clock, HelpCircle, DollarSign, BookOpen, Phone } from "lucide-react";

export default function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      sender: 'bot',
      text: 'Hello! I am SNS Assistant 🤖\n\nI am ready to help you with information about:\n• NDT courses and prices\n• Training schedules\n• ASNT certifications\n• Registration process\n\nHow can I help you today?',
      timestamp: new Date(),
      type: 'welcome'
    }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  // Quick reply options
  const quickReplies = [
    { text: "Lihat daftar kursus", icon: BookOpen },
    { text: "Tanya harga kursus", icon: DollarSign },
    { text: "Info pendaftaran", icon: HelpCircle },
    { text: "Hubungi admin", icon: Phone }
  ];

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

  const handleQuickReply = (replyText) => {
    setInput(replyText);
    handleSubmit(null, replyText);
  };

  const handleSubmit = async (e, quickReplyText = null) => {
    if (e) e.preventDefault();
    
    const messageText = quickReplyText || input.trim();
    if (!messageText) return;
    
    const userMessage = {
      sender: 'user',
      text: messageText,
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setLoading(true);
    setIsTyping(true);
    
    try {
      // Simulate typing delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const response = await api.post('/chatbot/send', {
        message: messageText,
      });
      
      setIsTyping(false);
      
      // Simulate gradual message appearance
      const botResponse = response.data.text;
      setMessages(prev => [
        ...prev,
        {
          sender: 'bot',
          text: botResponse,
          timestamp: new Date()
        }
      ]);
    } catch (error) {
      console.error('Error sending message to chatbot:', error);
      setIsTyping(false);
      setMessages(prev => [
        ...prev,
        {
          sender: 'bot',
          text: 'Maaf, saya sedang mengalami gangguan teknis. Silakan coba lagi nanti atau hubungi admin kami untuk bantuan langsung.',
          timestamp: new Date(),
          type: 'error'
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const formatTime = (date) => {
    return new Date(date).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });
  };

  const renderMessage = (msg) => {
    const isUser = msg.sender === 'user';
    const isWelcome = msg.type === 'welcome';
    const isError = msg.type === 'error';
    
    return (
      <div className={`flex items-start gap-3 ${isUser ? 'flex-row-reverse chat-message-user' : 'chat-message-bot'}`}>
        {/* Avatar */}
        <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
          isUser ? 'bg-blue-500' : 'bg-primary'
        }`}>
          {isUser ? (
            <User className="w-4 h-4 text-white" />
          ) : (
            <Bot className="w-4 h-4 text-white" />
          )}
        </div>
        
        {/* Message bubble */}
        <div className={`max-w-[75%] ${isUser ? 'items-end' : 'items-start'} flex flex-col gap-1`}>
          <div className={`px-4 py-3 rounded-2xl ${
            isUser 
              ? 'bg-blue-500 text-white rounded-tr-md' 
              : isWelcome
                ? 'chat-welcome text-white rounded-tl-md'
                : isError
                  ? 'bg-red-50 border border-red-200 text-red-800 rounded-tl-md'
                  : 'bg-white border shadow-sm rounded-tl-md'
          }`}>
            <div className="text-sm whitespace-pre-wrap break-words">
              {msg.text}
            </div>
          </div>
          
          {/* Timestamp */}
          <div className={`flex items-center gap-1 text-xs text-gray-500 ${isUser ? 'flex-row-reverse' : ''}`}>
            <Clock className="w-3 h-3" />
            <span>{formatTime(msg.timestamp)}</span>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="fixed bottom-4 right-4 z-[1000]">
      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        <SheetTrigger asChild>
          <Button
            variant="default"
            size="lg"
            className="rounded-full w-16 h-16 shadow-xl bg-gradient-to-r from-primary to-blue-600 hover:from-primary/90 hover:to-blue-600/90 flex flex-col items-center justify-center group transition-all duration-300 hover:scale-105"
            onClick={handleToggleChat}
          >
            <MessageSquare className="h-7 w-7 transition-transform group-hover:scale-110" />
            <span className="sr-only">Buka Chat Assistant</span>
            
            {/* Notification dot */}
            <div className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full flex items-center justify-center notification-dot">
              <span className="text-xs text-white font-bold">!</span>
            </div>
          </Button>
        </SheetTrigger>
        
        <SheetContent side="right" className="flex flex-col w-full max-w-md p-0 sm:max-w-md">
          <Card className="flex flex-col flex-1 border-none shadow-none rounded-none h-full">
            {/* Header */}
            <CardHeader className="bg-gradient-to-r from-primary to-blue-600 text-white p-4 flex flex-row items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center">
                  <img 
                    src="/technical-support.png" 
                    alt="SNS NDT" 
                    className="w-8 h-8 rounded-full"
                  />
                </div>
                <div>
                  <CardTitle className="text-lg font-semibold">SNS Assistant</CardTitle>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                    <CardDescription className="text-white/90 text-sm">
                      Online - Siap membantu
                    </CardDescription>
                  </div>
                </div>
              </div>
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={handleToggleChat} 
                className="text-white hover:bg-white/20 rounded-full"
              >
                <X className="h-5 w-5" />
                <span className="sr-only">Tutup chat</span>
              </Button>
            </CardHeader>
            
            {/* Messages */}
            <CardContent className="flex-1 p-4 overflow-y-auto space-y-4 bg-gray-50 min-h-0 chat-messages">
              {messages.map((msg, index) => (
                <div key={index}>
                  {renderMessage(msg)}
                </div>
              ))}
              
              {/* Typing indicator */}
              {isTyping && (
                <div className="flex items-start gap-3 chat-typing">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary flex items-center justify-center">
                    <Bot className="w-4 h-4 text-white" />
                  </div>
                  <div className="bg-white border shadow-sm rounded-2xl rounded-tl-md px-4 py-3 flex items-center gap-2">
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                    </div>
                    <span className="text-xs text-gray-500 ml-2">SNS Assistant sedang mengetik...</span>
                  </div>
                </div>
              )}
              
              <div ref={messagesEndRef} />
            </CardContent>
            
            {/* Quick replies */}
            {messages.length === 1 && !loading && (
              <div className="p-4 bg-white border-t">
                <p className="text-sm text-gray-600 mb-3">Pilihan cepat:</p>
                <div className="grid grid-cols-2 gap-2">
                  {quickReplies.map((reply, index) => {
                    const IconComponent = reply.icon;
                    return (
                      <Button
                        key={index}
                        variant="outline"
                        size="sm"
                        onClick={() => handleQuickReply(reply.text)}
                        className="flex items-center gap-2 text-xs h-auto py-2 px-3 hover:bg-blue-50 hover:border-blue-300"
                      >
                        <IconComponent className="w-3 h-3" />
                        <span className="truncate">{reply.text}</span>
                      </Button>
                    );
                  })}
                </div>
              </div>
            )}
            
            {/* Input form */}
            <form onSubmit={handleSubmit} className="p-4 border-t bg-white">
              <div className="flex items-center space-x-2">
                <Input
                  type="text"
                  placeholder="Ketik pesan Anda..."
                  value={input}
                  onChange={handleInputChange}
                  disabled={loading}
                  className="flex-1 rounded-full border-gray-300 focus:border-primary focus:ring-primary"
                />
                <Button 
                  type="submit" 
                  disabled={!input.trim() || loading} 
                  size="icon"
                  className="rounded-full bg-primary hover:bg-primary/90 disabled:opacity-50"
                >
                  {loading ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Send className="h-4 w-4" />
                  )}
                  <span className="sr-only">Kirim pesan</span>
                </Button>
              </div>
              
              {/* Footer info */}
              <div className="mt-2 text-center">
                <p className="text-xs text-gray-500">
                  Powered by SNS NDT Academy • Respons otomatis dengan AI
                </p>
              </div>
            </form>
          </Card>
        </SheetContent>
      </Sheet>
    </div>
  );
}
