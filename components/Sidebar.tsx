
import React, { useState, useEffect } from 'react';
import { 
  LayoutDashboard, ShoppingCart, AlertTriangle, CreditCard, Wrench, 
  FileText, Settings, Scale, ChevronDown, ChevronRight, Truck,
  Landmark, Globe, Printer, Bell, Zap, Store, Tags
} from 'lucide-react';
import { AppMode } from '../types';
import { useLocalStorage } from '../hooks/useLocalStorage';

interface SidebarProps {
  currentMode: AppMode;
  setMode: (mode: AppMode) => void;
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ currentMode, setMode, isOpen, setIsOpen }) => {
  const [isFlying, setIsFlying] = useState(false);

  const triggerFlyAnimation = () => {
    setIsFlying(true);
    setTimeout(() => setIsFlying(false), 12000);
  };

  const menuItems = [
    { mode: AppMode.DASHBOARD, label: 'Dashboard', icon: <LayoutDashboard size={18} />, colorClass: 'text-cyan-400' },
    { mode: AppMode.ORDERS, label: 'Orders', icon: <ShoppingCart size={18} />, colorClass: 'text-emerald-400' },
    { mode: AppMode.NDR, label: 'NDR Center', icon: <AlertTriangle size={18} />, colorClass: 'text-orange-400' },
    { mode: AppMode.BILLING, label: 'Billing', icon: <CreditCard size={18} />, colorClass: 'text-purple-400' },
    { mode: AppMode.TOOLS, label: 'Tools', icon: <Wrench size={18} />, colorClass: 'text-pink-400' },
    { mode: AppMode.OTHERS, label: 'Regulatory', icon: <Landmark size={18} />, colorClass: 'text-amber-400' },
  ];

  return (
    <>
      {isOpen && <div className="fixed inset-0 bg-black/80 z-20 md:hidden backdrop-blur-md" onClick={() => setIsOpen(false)} />}
      <div className={`fixed inset-y-0 left-0 z-30 w-64 bg-[#0B1020] border-r border-white/5 text-gray-300 transform transition-transform duration-300 ease-in-out md:translate-x-0 md:static flex flex-col ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="h-auto py-8 flex flex-col items-center justify-center px-6 border-b border-white/5 bg-[#060810]/50">
          <div className="flex flex-col items-center gap-2 text-white w-full relative">
             <div onClick={triggerFlyAnimation} className={`w-14 h-14 transition-all duration-300 cursor-pointer ${isFlying ? 'z-50 animate-fly-across' : 'hover:scale-110'}`}>
                <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full drop-shadow-[0_0_15px_rgba(56,189,248,0.4)]">
                    <ellipse cx="50" cy="50" rx="40" ry="45" fill="#1e293b" stroke="#3b82f6" strokeWidth="3" />
                    <circle cx="35" cy="40" r="14" fill="white" stroke="#3b82f6" strokeWidth="2" />
                    <circle cx="65" cy="40" r="14" fill="white" stroke="#3b82f6" strokeWidth="2" />
                    <circle cx="35" cy="40" r="8" fill="#0f172a" /><circle cx="65" cy="40" r="8" fill="#0f172a" />
                </svg>
             </div>
             <div className="font-black text-xl tracking-tighter uppercase mt-2 text-white">VAS <span className="text-brand-400">LOGISTICS</span></div>
             <div className="text-[8px] font-black text-slate-500 uppercase tracking-[0.4em]">Core v2.5</div>
          </div>
        </div>
        <div className="flex-1 overflow-y-auto py-6 custom-scrollbar px-4 space-y-1">
            {menuItems.map((item) => (
              <button key={item.mode} onClick={() => { setMode(item.mode); setIsOpen(false); }} className={`w-full flex items-center gap-4 px-4 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all duration-300 group ${currentMode === item.mode ? 'bg-brand-600/10 text-brand-400 border border-brand-500/20' : 'text-slate-500 hover:bg-white/5 hover:text-slate-200'}`}>
                <span className={`${currentMode === item.mode ? 'text-brand-400' : item.colorClass} group-hover:scale-110 transition-transform`}>{item.icon}</span>
                <span>{item.label}</span>
              </button>
            ))}
            <div className="h-px bg-white/5 mx-4 my-6"></div>
            <button onClick={() => { setMode(AppMode.MARKETPLACE_HUB); setIsOpen(false); }} className={`w-full flex items-center gap-4 px-4 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all ${currentMode === AppMode.MARKETPLACE_HUB ? 'bg-brand-600/10 text-amber-400 border border-amber-500/20' : 'text-slate-500 hover:text-slate-200'}`}>
              <Store size={18} className="text-amber-500" /><span>Marketplace Hub</span>
            </button>
            <button onClick={() => { setMode(AppMode.AI_SUPPORT); setIsOpen(false); }} className={`w-full flex items-center gap-4 px-4 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all ${currentMode === AppMode.AI_SUPPORT ? 'bg-brand-600/10 text-brand-400 border border-brand-500/20' : 'text-slate-500 hover:text-slate-200'}`}>
              <Zap size={18} className="text-brand-400" /><span>AI Specialist</span>
            </button>
        </div>
        <div className="p-6 border-t border-white/5 bg-[#060810]/30 text-center">
          <p className="text-[10px] text-slate-600 font-black uppercase tracking-[0.4em]">PERSISTENCE v2.5</p>
        </div>
      </div>
    </>
  );
};
