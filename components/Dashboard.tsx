
import React from 'react';
import { 
  Package, Truck, CheckCircle2, Zap, ArrowRightLeft, 
  Wallet, ChevronRight, Activity, ShieldAlert, Store
} from 'lucide-react';
import { AppMode, Order } from '../types';

interface DashboardProps {
  onSearch?: (val: string) => void;
  setMode?: (mode: AppMode) => void;
  orders?: Order[];
}

const TabMetric: React.FC<{ label: string; value: number; icon: any; color: string; onClick?: () => void }> = ({ label, value, icon: Icon, color, onClick }) => (
    <div 
        onClick={onClick}
        className="bg-[#0B1020] border-2 border-white/5 p-8 rounded-[2.5rem] shadow-2xl relative overflow-hidden group cursor-pointer hover:border-brand-500/30 transition-all duration-500 active:scale-95"
    >
        <div className={`absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity ${color}`}><Icon size={120} /></div>
        <div className="relative z-10">
            <div className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] mb-4">{label}</div>
            <div className="flex items-center gap-6">
                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-white shadow-xl ${color}`}>
                    <Icon size={28} />
                </div>
                <div className="text-5xl font-black text-white tracking-tighter">{value}</div>
            </div>
        </div>
        <div className="mt-6 flex items-center gap-2 text-[9px] font-bold text-emerald-400 uppercase tracking-widest">
            <Zap size={10} fill="currentColor" className="animate-pulse" /> Live Feed Active
        </div>
    </div>
);

export const Dashboard: React.FC<DashboardProps> = ({ setMode, orders = [] }) => {
  const stats = {
    new: orders.filter(o => o.status === 'New').length,
    inTransit: orders.filter(o => o.status === 'In Transit').length,
    delivered: orders.filter(o => o.status === 'Delivered').length,
    rto: orders.filter(o => o.status === 'RTO').length
  };

  return (
    <div className="p-10 bg-[#060810] min-h-full font-sans text-slate-300">
      
      {/* Cinematic VAS Branding Hero Section */}
      <div className="mb-12 flex flex-col md:flex-row justify-between items-center md:items-end relative">
        <div className="absolute -top-10 -left-10 w-60 h-60 bg-brand-500/10 blur-[120px] pointer-events-none"></div>
        <div>
          <h2 className="text-6xl font-black text-white uppercase tracking-tighter flex items-baseline gap-4">
            VAS <span className="text-brand-400 drop-shadow-[0_0_15px_rgba(56,189,248,0.4)]">LOGISTICS</span>
          </h2>
          <p className="text-slate-500 mt-2 text-xs font-black uppercase tracking-[0.6em] ml-1 opacity-70">Integrated Fleet & Warehouse Command</p>
        </div>
        <div className="mt-8 md:mt-0 flex items-center gap-4 px-8 py-4 bg-brand-900/10 border border-brand-500/20 rounded-[2rem] shadow-2xl backdrop-blur-xl">
            <Activity size={24} className="text-brand-400 animate-pulse" />
            <div>
                <span className="block text-[10px] font-black text-brand-400 uppercase tracking-widest">Nexus Core Status</span>
                <span className="text-[10px] text-emerald-400 font-bold uppercase">All Nodes Operational</span>
            </div>
        </div>
      </div>

      {/* Main Tab-Style Stat Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
        <TabMetric label="New Packets" value={stats.new} icon={Package} color="bg-blue-600" onClick={() => setMode?.(AppMode.ORDERS)} />
        <TabMetric label="In Transit" value={stats.inTransit} icon={Truck} color="bg-indigo-600" onClick={() => setMode?.(AppMode.ORDERS)} />
        <TabMetric label="Delivered" value={stats.delivered} icon={CheckCircle2} color="bg-emerald-600" onClick={() => setMode?.(AppMode.ORDERS)} />
        <TabMetric label="Returns (RTO)" value={stats.rto} icon={ShieldAlert} color="bg-rose-600" onClick={() => setMode?.(AppMode.NDR)} />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8 pb-32">
          
          {/* Marketplace Neural Synergy Card */}
          <div className="xl:col-span-2 bg-[#0B1020] rounded-[4rem] border border-white/5 p-12 shadow-2xl relative overflow-hidden group">
              <div className="absolute inset-0 opacity-20 pointer-events-none">
                 <svg className="w-full h-full" viewBox="0 0 800 400" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M150 100 Q 400 200 650 100" stroke="url(#grad1)" strokeWidth="2" strokeDasharray="10 10" className="animate-dash-slide" />
                    <path d="M150 200 Q 400 200 650 200" stroke="url(#grad1)" strokeWidth="2" strokeDasharray="10 10" className="animate-dash-slide" />
                    <path d="M150 300 Q 400 200 650 300" stroke="url(#grad1)" strokeWidth="2" strokeDasharray="10 10" className="animate-dash-slide" />
                    <defs>
                      <linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="#38bdf8" />
                        <stop offset="100%" stopColor="#10b981" />
                      </linearGradient>
                    </defs>
                    <circle r="3" fill="#38bdf8"><animateMotion dur="3s" repeatCount="indefinite" path="M150 100 Q 400 200 650 100" /></circle>
                    <circle r="3" fill="#10b981"><animateMotion dur="2.5s" repeatCount="indefinite" path="M150 200 Q 400 200 650 200" /></circle>
                    <circle r="3" fill="#f59e0b"><animateMotion dur="4s" repeatCount="indefinite" path="M150 300 Q 400 200 650 300" /></circle>
                 </svg>
              </div>

              <div className="flex justify-between items-center mb-12 relative z-10">
                  <div>
                    <h3 className="text-3xl font-black text-white uppercase tracking-tight flex items-center gap-4">
                        <ArrowRightLeft size={28} className="text-brand-400" /> Marketplace Synergy
                    </h3>
                    <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest mt-2">Neural Bridge between Stores & Carriers</p>
                  </div>
                  <button onClick={() => setMode?.(AppMode.MARKETPLACE_HUB)} className="p-5 bg-white/5 hover:bg-brand-600 rounded-[2rem] text-slate-400 hover:text-white transition-all shadow-lg border border-white/5 group-hover:scale-105"><ChevronRight size={28}/></button>
              </div>

              <div className="flex flex-col md:flex-row items-center justify-between gap-12 py-8 relative z-10">
                  <div className="flex flex-col gap-8 w-full md:w-auto">
                      {['Amazon', 'Flipkart', 'Meesho'].map((p, i) => (
                          <div key={i} className="flex items-center gap-6 bg-black/60 p-5 rounded-3xl border border-white/5 hover:border-brand-500/50 transition-all shadow-xl group/item">
                              <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center text-black font-black text-xs shadow-lg group-hover/item:scale-110 transition-transform">{p[0]}</div>
                              <span className="text-[11px] font-black text-white uppercase tracking-wider">{p}</span>
                              <div className="ml-auto w-2 h-2 rounded-full bg-brand-400 animate-pulse"></div>
                          </div>
                      ))}
                  </div>
                  <div className="relative group">
                      <div className="absolute -inset-24 bg-brand-500/10 rounded-full blur-[120px] animate-pulse"></div>
                      <div className="relative w-56 h-56 bg-brand-600/10 border-2 border-brand-500/20 rounded-full flex items-center justify-center shadow-[0_0_100px_rgba(2,132,199,0.2)]">
                          <div className="w-40 h-40 bg-brand-600 rounded-full flex items-center justify-center shadow-[0_0_70px_rgba(2,132,199,0.5)] animate-pulse-slow">
                             <Zap size={80} className="text-white drop-shadow-[0_0_20px_rgba(255,255,255,0.6)]" fill="currentColor" />
                          </div>
                      </div>
                  </div>
                  <div className="flex flex-col gap-8 w-full md:w-auto">
                      {['BlueDart', 'Delhivery', 'DTDC'].map((c, i) => (
                          <div key={i} className="flex items-center gap-6 bg-black/60 p-5 rounded-3xl border border-white/5 hover:border-emerald-500/50 transition-all shadow-xl group/item">
                              <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center text-black font-black text-xs shadow-lg group-hover/item:scale-110 transition-transform">{c[0]}</div>
                              <span className="text-[11px] font-black text-white uppercase tracking-wider">{c}</span>
                              <CheckCircle2 size={16} className="ml-auto text-emerald-400" />
                          </div>
                      ))}
                  </div>
              </div>
          </div>

          {/* Quick Settlement Card */}
          <div className="bg-[#0B1020] rounded-[4rem] border border-white/5 p-12 shadow-2xl flex flex-col relative overflow-hidden">
              <div className="absolute top-0 right-0 p-12 opacity-5 pointer-events-none"><Wallet size={180} /></div>
              <h3 className="text-2xl font-black text-white uppercase tracking-tight flex items-center gap-4 mb-10">
                  <Wallet size={24} className="text-brand-400" /> Quick Settle
              </h3>
              <div className="flex-1 space-y-8">
                  {[
                      { label: 'Carrier Dues', value: '₹ 1,240.50', status: 'Pending', color: 'text-amber-400' },
                      { label: 'COD Remittance', value: '₹ 14,990.00', status: 'Processing', color: 'text-brand-400' },
                      { label: 'GSTR-1 Filling', value: 'Complete', status: 'Verified', color: 'text-emerald-400' }
                  ].map((it, i) => (
                      <div key={i} className="p-8 bg-black/40 rounded-[2.5rem] border border-white/5 hover:border-white/10 transition-all shadow-inner">
                          <div className="flex justify-between items-center mb-4">
                             <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{it.label}</span>
                             <span className={`text-[9px] font-black ${it.color} bg-white/5 px-4 py-1.5 rounded-xl uppercase tracking-widest border border-white/5`}>{it.status}</span>
                          </div>
                          <div className={`text-2xl font-black ${it.color} font-mono tracking-tighter`}>{it.value}</div>
                      </div>
                  ))}
              </div>
              <button onClick={() => setMode?.(AppMode.BILLING)} className="mt-12 w-full py-6 bg-brand-600 hover:bg-brand-700 text-white rounded-[2rem] text-[11px] font-black uppercase tracking-[0.4em] shadow-2xl transition-all active:scale-95">View Full Ledger</button>
          </div>
      </div>
    </div>
  );
};
