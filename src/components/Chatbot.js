"use client";
import { useState, useEffect, useRef } from 'react';
import { MessageCircle, X, Send, Loader2 } from 'lucide-react';
import Link from 'next/link';

// Component to render a product card when AI mentions [PRODUCT:id]
const ProductMiniCard = ({ id }) => {
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_API_URL || "https://ezzywalk-b.vercel.app"}/api/products/${id}`)
      .then(res => res.json())
      .then(data => {
        if (!data.error) setProduct(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [id]);

  if (loading) return <div className="p-2 border rounded-md my-2 flex items-center justify-center bg-gray-50"><Loader2 className="animate-spin w-4 h-4 text-blue-500" /></div>;
  if (!product) return null;

  return (
    <Link href={`/products/${product.id}`} className="block border border-gray-200 rounded-lg p-2 my-2 bg-white hover:border-blue-300 hover:shadow-sm transition-all group">
      <div className="flex items-center space-x-3">
        <div className="w-16 h-16 bg-gray-100 rounded-md flex-shrink-0 overflow-hidden flex items-center justify-center">
          <img src={product.imageUrl || "/categories/sneaker.png"} alt={product.name} className="w-full h-full object-contain" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-[10px] text-blue-600 font-bold uppercase tracking-wider">{product.brand || 'EZZYWALK'}</p>
          <h4 className="font-bold text-gray-900 text-sm truncate group-hover:text-blue-600">{product.name}</h4>
          <p className="font-bold text-gray-900 text-sm mt-1">Rs {product.price}</p>
        </div>
      </div>
    </Link>
  );
};

export default function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { role: 'assistant', content: 'Assalam o Alaikum! 👋 Welcome to Ezzywalk. Main aapki shopping mein kaise madad kar sakta hoon?' }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) scrollToBottom();
  }, [messages, isOpen]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim() || isTyping) return;

    const userMsg = { role: 'user', content: input.trim() };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "https://ezzywalk-b.vercel.app"}/api/ai/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [...messages, userMsg].map(m => ({ role: m.role, content: m.content }))
        })
      });
      
      const data = await response.json();
      if (data.reply) {
        setMessages(prev => [...prev, { role: 'assistant', content: data.reply }]);
      }
    } catch (error) {
      setMessages(prev => [...prev, { role: 'assistant', content: 'Maazrat, abhi connection mein kuch masla hai. Thori der baad koshish karein.' }]);
    } finally {
      setIsTyping(false);
    }
  };

  // Function to parse [PRODUCT:id] tags and render components
  const renderMessageContent = (content) => {
    const regex = /\[PRODUCT:([a-zA-Z0-9]+)\]/g;
    const parts = content.split(regex);
    
    return parts.map((part, index) => {
      // The split regex leaves capture groups at odd indices
      if (index % 2 === 1) {
        return <ProductMiniCard key={index} id={part} />;
      }
      return <span key={index}>{part}</span>;
    });
  };

  return (
    <>
      {/* Floating Button */}
      <button 
        onClick={() => setIsOpen(true)}
        className={`fixed bottom-6 right-6 w-16 h-16 rounded-full flex items-center justify-center transition-all duration-500 z-50 ${isOpen ? 'scale-0 opacity-0' : 'scale-100 opacity-100 hover:scale-110 shadow-[0_0_20px_rgba(139,92,246,0.5)]'}`}
        style={{
          background: 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)',
        }}
      >
        <MessageCircle className="w-8 h-8 text-white drop-shadow-md" />
        <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full border-2 border-white animate-pulse"></span>
      </button>

      {/* Premium Glassmorphic Chat Window */}
      <div className={`fixed bottom-6 right-6 w-[380px] h-[600px] max-h-[85vh] rounded-3xl flex flex-col overflow-hidden transition-all duration-500 z-50 origin-bottom-right ${isOpen ? 'scale-100 opacity-100 shadow-[0_20px_50px_-12px_rgba(0,0,0,0.5)]' : 'scale-50 opacity-0 pointer-events-none'}`}
           style={{
             background: 'rgba(255, 255, 255, 0.9)',
             backdropFilter: 'blur(20px)',
             border: '1px solid rgba(255, 255, 255, 0.5)',
           }}>
        
        {/* Dynamic Header */}
        <div className="relative px-6 py-5 flex justify-between items-center text-white overflow-hidden shrink-0"
             style={{ background: 'linear-gradient(135deg, #1e1b4b 0%, #4338ca 100%)' }}>
          <div className="absolute top-0 left-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
          <div className="relative z-10 flex items-center gap-3">
            <div className="relative">
              <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center backdrop-blur-sm border border-white/30">
                <span className="text-xl">✨</span>
              </div>
              <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-400 rounded-full border-2 border-[#4338ca]"></div>
            </div>
            <div>
              <h3 className="font-bold text-lg tracking-wide shadow-sm">Ezzywalk AI</h3>
              <p className="text-xs text-indigo-200 uppercase tracking-widest font-semibold">Premium Assistant</p>
            </div>
          </div>
          <button onClick={() => setIsOpen(false)} className="relative z-10 p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors backdrop-blur-sm">
            <X className="w-5 h-5 text-white" />
          </button>
        </div>

        {/* Chat Area */}
        <div className="flex-1 overflow-y-auto p-5 space-y-5 bg-gradient-to-b from-gray-50/50 to-white/50 scroll-smooth">
          {messages.map((msg, idx) => (
            <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} animate-in slide-in-from-bottom-2 duration-300 ease-out`}>
              <div className={`max-w-[85%] rounded-2xl px-5 py-3.5 text-[15px] leading-relaxed shadow-sm ${msg.role === 'user' ? 'bg-gradient-to-r from-indigo-600 to-blue-600 text-white rounded-br-sm shadow-indigo-200' : 'bg-white border border-gray-100 text-gray-800 rounded-bl-sm shadow-gray-200'}`}>
                {msg.role === 'user' ? msg.content : renderMessageContent(msg.content)}
              </div>
            </div>
          ))}
          {isTyping && (
            <div className="flex justify-start animate-in fade-in duration-300">
              <div className="bg-white border border-gray-100 rounded-2xl rounded-bl-sm px-5 py-4 shadow-sm flex gap-1.5 items-center">
                <div className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                <div className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                <div className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <form onSubmit={handleSend} className="p-4 bg-white/80 backdrop-blur-md border-t border-gray-100/50 shrink-0">
          <div className="relative flex items-center bg-gray-50/80 rounded-full border border-gray-200 shadow-inner focus-within:border-indigo-400 focus-within:ring-2 focus-within:ring-indigo-100 transition-all p-1">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask anything..."
              className="flex-1 bg-transparent text-gray-700 text-sm px-4 py-2.5 focus:outline-none"
            />
            <button 
              type="submit" 
              disabled={!input.trim() || isTyping}
              className="w-10 h-10 rounded-full flex items-center justify-center transition-all disabled:opacity-40 disabled:scale-95 shrink-0"
              style={{ background: input.trim() ? 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)' : '#e5e7eb' }}
            >
              <Send className={`w-4 h-4 ml-0.5 ${input.trim() ? 'text-white' : 'text-gray-400'}`} />
            </button>
          </div>
        </form>
      </div>
    </>
  );
}
