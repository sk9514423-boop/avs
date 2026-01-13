
import React, { useState } from 'react';
import { Calculator, List, MapPin, Target, Zap, Loader2, Cpu, ShieldCheck } from 'lucide-react';

export const Tools: React.FC = () => {
  const [activeTab, setActiveTab] = useState('Price List');
  const [isCalculating, setIsCalculating] = useState(false);

  return (
    <div className="flex flex-col h-full bg-[#060810] font-sans text-slate-300">
      <div className="bg-[#0B1020]/90 backdrop-blur-2xl border-b border-white/5 px-8 flex items-center gap-10 h-16 sticky top-0 z-50">
          {['Price List', 'Know Your Zone', 'Track Order', 'HSN Neural'].map((tab) => (
            <button key={tab} onClick={() => setActiveTab(tab)} className={`flex items-center gap-3 px-2 h-full text-[10px] font-black uppercase tracking-widest relative ${activeTab === tab ? 'text-brand-400' : 'text-slate-500'}`}>
              {tab} {activeTab === tab && <div className="absolute bottom-0 left-0 right-0 h-1 bg-brand-500 rounded-t-full" />}
            </button>
          ))}
      </div>

      <div className="flex-1 overflow-y-auto p-12 custom-scrollbar">
        {activeTab === 'Price List' && (
            <div className="max-w-4xl mx-auto space-y-12 animate-in fade-in slide-in-from-bottom-6 duration-700">
                <div className="bg-[#0B1020] rounded-[3.5rem] border border-white/5 shadow-2xl p-12 relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-12 opacity-5"><Calculator size={180} /></div>
                    <div className="flex items-center gap-6 mb-12">
                        <div className="p-4 bg-brand-600 rounded-[2rem] text-white animate-pulse-slow"><Calculator size={32} /></div>
                        <div><h2 className="text-3xl font-black text-white uppercase tracking-tighter">Quantum Rate Estimator</h2><p className="text-[10px] text-slate-500 font-black uppercase mt-1">Live Multi-Carrier Handshake Logic</p></div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-10 mb-10">
                        <div className="space-y-2"><label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Origin Node</label><div className="relative"><MapPin className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-600" size={20} /><input type="text" placeholder="PINCODE" className="w-full pl-16 pr-8 py-5 bg-black/40 border border-white/10 rounded-2xl text-white font-black focus:border-brand-500 outline-none" /></div></div>
                        <div className="space-y-2"><label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Destination Node</label><div className="relative"><Target className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-600" size={20} /><input type="text" placeholder="PINCODE" className="w-full pl-16 pr-8 py-5 bg-black/40 border border-white/10 rounded-2xl text-white font-black focus:border-brand-500 outline-none" /></div></div>
                    </div>
                    <button onClick={() => setIsCalculating(true)} className="w-full py-6 bg-brand-600 hover:bg-brand-700 text-white rounded-[2rem] text-xs font-black uppercase tracking-[0.3em] flex items-center justify-center gap-4 transition-all active:scale-95">
                       {isCalculating ? <Loader2 size={24} className="animate-spin" /> : <Zap size={24} fill="currentColor" />}{isCalculating ? 'Computing Energy Path...' : 'Get Live Quotes'}
                    </button>
                </div>
                <div className="bg-brand-600/10 border border-brand-500/20 rounded-[3rem] p-10 flex items-center gap-10 shadow-xl relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-8 opacity-[0.03]"><Cpu size={120} /></div>
                    <div className="w-20 h-20 bg-brand-600 rounded-3xl flex items-center justify-center text-white shadow-xl shadow-brand-900/30"><ShieldCheck size={36} /></div>
                    <div><h4 className="text-xl font-black text-white uppercase tracking-tight">Persistence Protocol v2.5</h4><p className="text-[10px] text-slate-500 mt-2 font-bold uppercase tracking-widest leading-relaxed">Our neural engine verifies over 27,000+ PIN nodes across 12 major carrier networks in real-time.</p></div>
                </div>
            </div>
        )}
      </div>
    </div>
  );
};
