
import React, { useState, useRef, useEffect } from 'react';
import { Send, Image as ImageIcon, X, Loader2, Bot, User, HelpCircle } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { ChatMessage, Role } from '../types';
import { streamChatResponse } from '../services/geminiService';

export const ChatInterface: React.FC = () => {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      role: Role.MODEL,
      text: "Hello! I am the VAS LOGISTICS Support Assistant powered by Gemini. How can I help you with your orders today?"
    }
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setSelectedFiles(prev => [...prev, ...Array.from(e.target.files!)]);
    }
  };

  const removeFile = (index: number) => {
    setSelectedFiles(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if ((!input.trim() && selectedFiles.length === 0) || isLoading) return;

    const userText = input.trim();
    const currentFiles = [...selectedFiles];
    
    setInput('');
    setSelectedFiles([]);
    if (fileInputRef.current) fileInputRef.current.value = '';

    const imagePreviews: string[] = [];
    for (const file of currentFiles) {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      await new Promise<void>((resolve) => {
        reader.onload = () => {
          imagePreviews.push(reader.result as string);
          resolve();
        };
      });
    }

    const userMsgId = Date.now().toString();
    const userMessage: ChatMessage = {
      id: userMsgId,
      role: Role.USER,
      text: userText,
      images: imagePreviews,
    };

    setMessages(prev => [...prev, userMessage]);

    const botMsgId = (Date.now() + 1).toString();
    const botMessage: ChatMessage = {
      id: botMsgId,
      role: Role.MODEL,
      text: '',
    };
    setMessages(prev => [...prev, botMessage]);
    setIsLoading(true);

    try {
      const history = messages.map(m => ({
        role: m.role,
        parts: [{ text: m.text }] 
      }));

      const stream = streamChatResponse(userText, currentFiles, history);

      let accumulatedText = '';

      for await (const chunk of stream) {
        if (chunk) {
          accumulatedText += chunk;
          setMessages(prev => 
            prev.map(msg => 
              msg.id === botMsgId ? { ...msg, text: accumulatedText } : msg
            )
          );
        }
      }

    } catch (error) {
      console.error(error);
      setMessages(prev => 
        prev.map(msg => 
          msg.id === botMsgId ? { ...msg, text: "I'm sorry, I encountered an error. Please try again later.", isError: true } : msg
        )
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full bg-[#0B1020] text-gray-300">
      {/* Header */}
      <div className="bg-[#111827] border-b border-[#1F2937] p-4 flex items-center justify-between shadow-lg">
        <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-brand-900/30 flex items-center justify-center text-brand-400 border border-brand-900/50">
                <Bot size={18} />
            </div>
            <div>
                <h2 className="font-semibold text-gray-100">Seller Support AI</h2>
                <p className="text-xs text-green-400 flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></span>
                    Online
                </p>
            </div>
        </div>
        <button className="text-gray-400 hover:text-white transition-colors">
            <HelpCircle size={20} />
        </button>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-6 custom-scrollbar">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex gap-3 ${msg.role === Role.USER ? 'flex-row-reverse' : 'flex-row'} max-w-3xl mx-auto w-full`}
          >
            <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 border shadow-sm ${
              msg.role === Role.USER ? 'bg-indigo-900/30 text-indigo-400 border-indigo-900/50' : 'bg-brand-900/30 text-brand-400 border-brand-900/50'
            }`}>
              {msg.role === Role.USER ? <User size={16} /> : <Bot size={16} />}
            </div>

            <div className={`flex flex-col gap-2 max-w-[80%] ${msg.role === Role.USER ? 'items-end' : 'items-start'}`}>
              
              {msg.images && msg.images.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-2">
                  {msg.images.map((img, idx) => (
                    <img 
                      key={idx} 
                      src={img} 
                      alt="uploaded" 
                      className="max-w-[200px] max-h-[200px] rounded-lg border border-[#374151] object-cover shadow-sm" 
                    />
                  ))}
                </div>
              )}

              <div className={`px-4 py-3 rounded-2xl shadow-sm text-sm ${
                msg.role === Role.USER 
                  ? 'bg-brand-600 text-white rounded-tr-none' 
                  : msg.isError 
                    ? 'bg-red-900/20 border border-red-900/50 text-red-400 rounded-tl-none' 
                    : 'bg-[#1F2937] border border-[#374151] text-gray-200 rounded-tl-none'
              }`}>
                {msg.text ? (
                   <ReactMarkdown 
                    className="prose prose-sm max-w-none prose-invert"
                   >
                     {msg.text}
                   </ReactMarkdown>
                ) : (
                  <span className="flex items-center gap-2 text-gray-400 italic">
                    <Loader2 className="animate-spin h-3 w-3" /> Thinking...
                  </span>
                )}
              </div>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="p-4 bg-[#111827] border-t border-[#1F2937]">
        <div className="max-w-3xl mx-auto">
          {selectedFiles.length > 0 && (
             <div className="flex gap-3 mb-3 overflow-x-auto pb-2">
                {selectedFiles.map((file, i) => (
                  <div key={i} className="relative group shrink-0">
                    <div className="w-16 h-16 rounded-md bg-[#1F2937] border border-[#374151] flex items-center justify-center overflow-hidden">
                       <span className="text-[10px] text-gray-400 text-center px-1 truncate w-full">{file.name}</span>
                    </div>
                    <button 
                      onClick={() => removeFile(i)}
                      className="absolute -top-2 -right-2 bg-[#1F2937] border border-[#374151] shadow-sm rounded-full p-1 text-gray-400 hover:text-red-400 transition-colors"
                    >
                      <X size={10} />
                    </button>
                  </div>
                ))}
             </div>
          )}

          <form onSubmit={handleSubmit} className="relative flex items-end gap-2 bg-[#0B1020] p-2 rounded-xl border border-[#1F2937] focus-within:border-brand-500 focus-within:ring-1 focus-within:ring-brand-900 transition-all">
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileSelect}
              accept="image/*"
              multiple
              className="hidden"
            />
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="p-3 text-gray-400 hover:text-brand-400 hover:bg-[#1F2937] rounded-lg transition-colors"
            >
              <ImageIcon size={20} />
            </button>
            
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSubmit(e);
                }
              }}
              placeholder="Type your message..."
              className="flex-1 bg-transparent text-gray-200 placeholder-gray-500 focus:outline-none p-3 max-h-32 resize-none text-sm"
              rows={1}
            />

            <button
              type="submit"
              disabled={isLoading || (!input.trim() && selectedFiles.length === 0)}
              className="p-3 bg-brand-600 hover:bg-brand-700 disabled:opacity-50 disabled:hover:bg-brand-600 text-white rounded-lg transition-colors shadow-lg"
            >
              {isLoading ? <Loader2 size={18} className="animate-spin" /> : <Send size={18} />}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
