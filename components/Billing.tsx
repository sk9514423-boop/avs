
import React, { useMemo } from 'react';
import { 
  Wallet, ArrowUp, ArrowDown, Search, RefreshCcw, Wifi, Landmark, 
  CreditCard, Zap, Receipt, FileDown, Activity
} from 'lucide-react';
import { Order } from '../types';

interface BillingProps {
    walletBalance: number;
}

export const Billing: React.FC<BillingProps> = ({ walletBalance }) => {
  return (
    <div className="p-12 bg-[#060810] min-h-full font-sans text-slate-300">
      <div className="mb-12 flex justify-between items-end">
        <div>
          <h2 className="text-4xl font-black text-white uppercase tracking-tighter flex items-center gap-4">
            <div className="p-3 bg-purple-600/20 text-purple-500 rounded-2xl border border-purple-500/20 shadow-xl">
               <Wallet size={32} />
            </div>
            Quantum Financials
          </h2>
          <p className="text-slate-500 mt-2 text-xs font-black uppercase tracking-[0.4em]">Real-Time Wallet Settlement & Ledger Engine</p>
        </div>
        <div className="flex items-center gap-4 px-6 py-3 bg-emerald-950/20 border border-emerald-500/20 rounded-2xl text-emerald-400 text-[10px] font-black uppercase tracking-[0.2em] shadow-xl">
            <Wifi size={16} className="animate-pulse" /> Live Settlement System
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          {[
            { label: 'Current Credit', value: `₹${walletBalance.toFixed(2)}`, icon: Wallet, color: 'bg-brand-600' },
            { label: 'COD Remittance', value: '₹14,990.00', icon: ArrowUp, color: 'bg-emerald-600' },
            { label: 'Freight Dues', value: '₹1,240.50', icon: ArrowDown, color: 'bg-rose-600' }
          ].map((card, i) => (
             <div key={i} className="bg-[#0B1020] border border-white/5 p-10 rounded-[3rem] shadow-2xl relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-10 opacity-5 group-hover:opacity-10 transition-opacity"><card.icon size={150} /></div>
                <div className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] mb-4">{card.label}</div>
                <div className="flex items-center gap-8 relative z-10">
                   <div className={`w-16 h-16 rounded-3xl ${card.color} text-white flex items-center justify-center shadow-2xl`}>
                      <card.icon size={30} />
                   </div>
                   <div className="text-4xl font-black text-white font-mono tracking-tighter">{card.value}</div>
                </div>
                <div className="mt-8 flex items-center gap-2 text-[9px] font-bold text-emerald-400 uppercase tracking-widest">
                   <Zap size={10} fill="currentColor" className="animate-pulse" /> Real-time Node Sync
                </div>
             </div>
          ))}
      </div>

      <div className="bg-[#0B1020] rounded-[3.5rem] border border-white/5 shadow-2xl overflow-hidden relative">
         <div className="p-10 border-b border-white/5 bg-black/20 flex justify-between items-center">
            <h3 className="text-xl font-black text-white uppercase tracking-tight flex items-center gap-3">
               <Activity size={20} className="text-brand-400" /> Transaction Ledger
            </h3>
            <div className="flex gap-4">
               <button className="px-6 py-3 bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white rounded-xl text-[10px] font-black uppercase tracking-widest transition-all">Export XLS</button>
               <button className="px-6 py-3 bg-brand-600 hover:bg-brand-700 text-white rounded-xl text-[10px] font-black uppercase tracking-widest shadow-xl transition-all active:scale-95">Add Credit</button>
            </div>
         </div>

         <div className="overflow-x-auto">
            <table className="w-full text-left">
                <thead className="bg-black/10 text-slate-600 font-black text-[9px] uppercase tracking-[0.3em] border-b border-white/5">
                   <tr>
                      <th className="px-10 py-6">Reference ID</th>
                      <th className="px-10 py-6">Description</th>
                      <th className="px-10 py-6 text-center">Impact</th>
                      <th className="px-10 py-6 text-right">Balance</th>
                   </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                   {[
                     { id: 'RECH-7729', desc: 'Wallet Recharge (UPI)', type: 'credit', amt: '₹5,000.00', bal: '₹5,000.00', date: 'Just Now' },
                     { id: 'SHIP-1002', desc: 'Shipment Charge: VAS-1029', type: 'debit', amt: '₹85.00', bal: '₹4,915.00', date: 'Today, 04:12 PM' }
                   ].map((it, i) => (
                      <tr key={i} className="hover:bg-white/5 transition-all group">
                         <td className="px-10 py-8">
                            <div className="text-brand-400 font-black text-sm uppercase font-mono">{it.id}</div>
                            <div className="text-[9px] text-slate-600 font-bold mt-1 uppercase">{it.date}</div>
                         </td>
                         <td className="px-10 py-8 text-white font-black text-xs uppercase">{it.desc}</td>
                         <td className={`px-10 py-8 text-center font-black font-mono ${it.type === 'credit' ? 'text-emerald-400' : 'text-rose-500'}`}>
                            {it.type === 'credit' ? '+' : '-'} {it.amt}
                         </td>
                         <td className="px-10 py-8 text-right text-slate-400 font-black font-mono">{it.bal}</td>
                      </tr>
                   ))}
                </tbody>
            </table>
         </div>
      </div>
    </div>
  );
};
