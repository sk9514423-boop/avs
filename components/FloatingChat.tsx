
import React, { useState, useRef, useEffect } from 'react';
import { 
  MessageCircle, X, Send, Loader2, Bot, Minimize2, Maximize2, 
  Headphones, Ticket, Plus, ChevronLeft, User, Truck, ShieldCheck, Zap, Mail, ShieldAlert
} from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { streamChatResponse } from '../services/geminiService';
import { ChatMessage, Role } from '../types';
import { useLocalStorage } from '../hooks/useLocalStorage';

interface SupportTicket {
  id: string;
  subject: string;
  category: string;
  status: 'Open' | 'Resolved';
  lastMessage: string;
  messages: TicketMessage[];
}

interface TicketMessage {
  id: string;
  sender: 'User' | 'CRM' | 'Courier' | 'System' | 'Admin';
  text: string;
  timestamp: string;
}

export const FloatingChat: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [activeTab, setActiveTab] = useState<'ai' | 'support'>('ai');
  const [aiInput, setAiInput] = useState('');
  const [aiLoading, setAiLoading] = useState(false);
  const [aiMessages, setAiMessages] = useState<ChatMessage[]>([
    { id: 'welcome', role: Role.MODEL, text: "Hi! I'm your VAS AI. Ask me about tracking, pricing, or account help!" }
  ]);

  // Persistent shared storage for Admin Inbox
  const [tickets, setTickets] = useLocalStorage<SupportTicket[]>('vas_support_tickets', []);
  const [view, setView] = useState<'list' | 'create' | 'chat'>('list');
  const [activeTicketId, setActiveTicketId] = useState<string | null>(null);
  const [newTicketSubject, setNewTicketSubject] = useState('');
  const [supportInput, setSupportInput] = useState('');
  
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [aiMessages, tickets, isOpen, activeTicketId]);

  const handleAiSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!aiInput.trim() || aiLoading) return;
    const userText = aiInput.trim();
    setAiInput('');
    const userMsgId = Date.now().toString();
    setAiMessages(prev => [...prev, { id: userMsgId, role: Role.USER, text: userText }]);
    setAiLoading(true);
    const botMsgId = (Date.now() + 1).toString();
    setAiMessages(prev => [...prev, { id: botMsgId, role: Role.MODEL, text: '' }]);
    try {
      const history = aiMessages.map(m => ({ role: m.role, parts: [{ text: m.text }] }));
      const stream = streamChatResponse(userText, [], history);
      let accumulatedText = '';
      for await (const chunk of stream) {
        if (chunk) {
          accumulatedText += chunk;
          setAiMessages(prev => prev.map(msg => msg.id === botMsgId ? { ...msg, text: accumulatedText } : msg));
        }
      }
    } catch (error) {
      setAiMessages(prev => prev.map(msg => msg.id === botMsgId ? { ...msg, text: "Connection error.", isError: true } : msg));
    } finally {
      setAiLoading(false);
    }
  };

  const createTicket = () => {
    if (!newTicketSubject.trim()) return;
    const newTkt: SupportTicket = {
      id: `TKT-${Math.floor(1000 + Math.random() * 9000)}`,
      subject: newTicketSubject,
      category: 'Support Request',
      status: 'Open',
      lastMessage: 'User created ticket',
      messages: [{ id: Date.now().toString(), sender: 'User', text: newTicketSubject, timestamp: new Date().toLocaleTimeString() }]
    };
    setTickets([newTkt, ...tickets]);
    setNewTicketSubject('');
    setActiveTicketId(newTkt.id);
    setView('chat');
  };

  const sendSupportMsg = (e: React.FormEvent) => {
    e.preventDefault();
    if (!supportInput.trim() || !activeTicketId) return;
    const text = supportInput;
    setSupportInput('');
    setTickets(prev => prev.map(t => t.id === activeTicketId ? {
      ...t,
      lastMessage: text,
      messages: [...t.messages, { id: Date.now().toString(), sender: 'User', text, timestamp: new Date().toLocaleTimeString() }]
    } : t));
  };

  if (!isOpen) return (
    <button onClick={() => setIsOpen(true)} className="fixed bottom-6 right-6 w-14 h-14 bg-brand-600 text-white rounded-full shadow-2xl flex items-center justify-center hover:scale-110 transition-transform z-50 animate-in zoom-in">
      <MessageCircle size={28} />
    </button>
  );

  return (
    <div className={`fixed bottom-6 right-6 z-50 flex flex-col bg-[#111827] rounded-3xl shadow-2xl border border-[#1F2937] overflow-hidden transition-all duration-300 ${isMinimized ? 'w-72 h-14' : 'w-80 sm:w-96 h-[550px]'}`}>
      <div className="bg-brand-600 p-4 flex justify-between items-center cursor-pointer" onClick={() => setIsMinimized(!isMinimized)}>
        <div className="flex items-center gap-3">
          <Bot size={20} className="text-white" />
          <h3 className="font-bold text-white text-sm">VAS Seller Support</h3>
        </div>
        <div className="flex gap-2 text-white/80">
          <button onClick={(e) => { e.stopPropagation(); setIsMinimized(!isMinimized); }}>{isMinimized ? <Maximize2 size={14}/> : <Minimize2 size={14}/>}</button>
          <button onClick={(e) => { e.stopPropagation(); setIsOpen(false); }}><X size={18}/></button>
        </div>
      </div>
      {!isMinimized && (
        <>
          <div className="flex bg-[#0B1020] border-b border-[#1F2937]">
            <button onClick={() => setActiveTab('ai')} className={`flex-1 py-3 text-[10px] font-black uppercase ${activeTab === 'ai' ? 'text-brand-400 border-b-2 border-brand-400' : 'text-slate-500'}`}>AI Chat</button>
            <button onClick={() => setActiveTab('support')} className={`flex-1 py-3 text-[10px] font-black uppercase ${activeTab === 'support' ? 'text-brand-400 border-b-2 border-brand-400' : 'text-slate-500'}`}>Support Inbox</button>
          </div>
          {activeTab === 'ai' ? (
            <div className="flex-1 flex flex-col overflow-hidden bg-[#0B1020]">
              <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar">
                {aiMessages.map(m => (
                  <div key={m.id} className={`flex ${m.role === Role.USER ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-[85%] px-4 py-2.5 rounded-2xl text-xs ${m.role === Role.USER ? 'bg-brand-600 text-white' : 'bg-[#1F2937] text-slate-300'}`}>
                      {m.text || <Loader2 size={12} className="animate-spin" />}
                    </div>
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </div>
              <form onSubmit={handleAiSubmit} className="p-4 bg-[#111827] border-t border-[#1F2937] flex gap-2">
                <input value={aiInput} onChange={e => setAiInput(e.target.value)} placeholder="Ask Gemini..." className="flex-1 bg-[#0B1020] text-sm text-white px-4 py-2 rounded-xl outline-none" />
                <button type="submit" className="p-2 bg-brand-600 text-white rounded-xl"><Send size={18}/></button>
              </form>
            </div>
          ) : (
            <div className="flex-1 flex flex-col overflow-hidden bg-[#0B1020]">
              {view === 'list' && (
                <div className="flex-1 p-4 space-y-4 overflow-y-auto custom-scrollbar">
                  <button onClick={() => setView('create')} className="w-full py-4 border-2 border-dashed border-[#374151] rounded-2xl text-slate-500 hover:text-white flex items-center justify-center gap-2 text-xs font-bold uppercase"><Plus size={16}/> New Ticket</button>
                  {tickets.map(t => (
                    <div key={t.id} onClick={() => { setActiveTicketId(t.id); setView('chat'); }} className="p-4 bg-[#111827] border border-[#1F2937] rounded-2xl cursor-pointer hover:border-brand-500 transition-all">
                      <div className="flex justify-between items-center mb-1"><span className="text-xs font-bold text-white">{t.subject}</span><span className="text-[9px] text-emerald-400 uppercase font-black">{t.status}</span></div>
                      <div className="text-[10px] text-slate-500 truncate">{t.lastMessage}</div>
                    </div>
                  ))}
                  {tickets.length === 0 && <div className="text-center py-10 text-slate-600 text-[10px] uppercase font-black">No active tickets</div>}
                </div>
              )}
              {view === 'create' && (
                <div className="p-6 space-y-4">
                  <h4 className="text-sm font-bold text-white">Describe your issue</h4>
                  <textarea value={newTicketSubject} onChange={e => setNewTicketSubject(e.target.value)} className="w-full h-32 bg-[#111827] border border-[#374151] rounded-2xl p-4 text-white text-sm outline-none" placeholder="e.g. Order #123 is delayed..." />
                  <div className="flex gap-2">
                    <button onClick={() => setView('list')} className="flex-1 py-3 text-slate-500 font-bold uppercase text-[10px]">Cancel</button>
                    <button onClick={createTicket} className="flex-[2] py-3 bg-brand-600 text-white rounded-xl font-bold uppercase text-[10px]">Submit to Admin</button>
                  </div>
                </div>
              )}
              {view === 'chat' && activeTicketId && (
                <div className="flex-1 flex flex-col h-full">
                  <div className="p-3 border-b border-[#1F2937] bg-[#111827] flex items-center gap-3">
                    <button onClick={() => setView('list')}><ChevronLeft size={20} className="text-slate-400"/></button>
                    <span className="text-[10px] font-black text-white uppercase">{activeTicketId}</span>
                  </div>
                  <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar">
                    {tickets.find(t => t.id === activeTicketId)?.messages.map(m => (
                      <div key={m.id} className={`flex ${m.sender === 'User' ? 'justify-end' : 'justify-start'}`}>
                        <div className={`max-w-[85%] px-4 py-2 rounded-xl text-xs ${m.sender === 'User' ? 'bg-brand-600 text-white' : 'bg-[#1F2937] text-slate-300'}`}>
                          <div className="text-[8px] font-black uppercase opacity-50 mb-1">{m.sender}</div>
                          {m.text}
                        </div>
                      </div>
                    ))}
                    <div ref={messagesEndRef} />
                  </div>
                  <form onSubmit={sendSupportMsg} className="p-4 border-t border-[#1F2937] flex gap-2">
                    <input value={supportInput} onChange={e => setSupportInput(e.target.value)} placeholder="Reply..." className="flex-1 bg-[#0B1020] text-sm text-white px-4 py-2 rounded-xl outline-none" />
                    <button type="submit" className="p-2 bg-brand-600 text-white rounded-xl"><Send size={18}/></button>
                  </form>
                </div>
              )}
            </div>
          )}
        </>
      )}
    </div>
  );
};
