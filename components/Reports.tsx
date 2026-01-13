
import React, { useState } from 'react';
import { 
  FileText, Download, Search, RefreshCcw, Loader2, BarChart3, 
  PieChart, ChevronRight, FileDown, Activity
} from 'lucide-react';

export const Reports: React.FC = () => {
  const [isRefreshing, setIsRefreshing] = useState(false);

  return (
    <div className="p-12 bg-[#060810] min-h-full font-sans text-slate-300">
      <div className="mb-12 flex justify-between items-end">
        <div>
          <h2 className="text-4xl font-black text-white uppercase tracking-tighter flex items-center gap-4">
            <div className="p-3 bg-emerald-600/20 text-emerald-500 rounded-2xl border border-emerald-500/20 shadow-xl">
               <BarChart3 size={32} />
            </div>
            Analytics Engine
          </h2>
          <p className="text-slate-500 mt-2 text-xs font-black uppercase tracking-[0.4em]">Logistics Intelligence & Monthly Ledgers</p>
        </div>
        <button onClick={() => { setIsRefreshing(true); setTimeout(() => setIsRefreshing(false), 1500); }} className="px-8 py-3 bg-[#0B1020] border border-white/5 rounded-2xl text-[10px] font-black text-slate-400 uppercase tracking-widest hover:text-white transition-all shadow-xl flex items-center gap-3">
          {isRefreshing ? <Loader2 size={16} className="animate-spin"/> : <RefreshCcw size={16}/>}
          Refresh Node
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
         {[
           { label: 'Avg TAT', value: '2.4 Days', icon: Activity, color: 'text-emerald-400' },
           { label: 'RTO Ratio', value: '8.2%', icon: PieChart, color: 'text-rose-400' },
           { label: 'Success Ratio', value: '91.8%', icon: BarChart3, color: 'text-brand-400' },
           { label: 'Network Coverage', value: '99.9%', icon: Activity, color: 'text-purple-400' }
         ].map((stat, i) => (
            <div key={i} className="bg-[#0B1020] border border-white/5 p-8 rounded-[2.5rem] shadow-2xl group">
               <div className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-4">{stat.label}</div>
               <div className="flex items-center justify-between">
                  <div className="text-3xl font-black text-white tracking-tighter">{stat.value}</div>
                  <stat.icon size={24} className={stat.color} />
               </div>
            </div>
         ))}
      </div>

      <div className="bg-[#0B1020] rounded-[3.5rem] border border-white/5 shadow-2xl overflow-hidden">
         <div className="p-10 border-b border-white/5 bg-black/20 flex justify-between items-center">
            <h3 className="text-xl font-black text-white uppercase tracking-tight flex items-center gap-3">
               <FileText size={20} className="text-brand-400" /> Available Archives
            </h3>
            <div className="relative w-64">
               <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-600" size={14} />
               <input type="text" placeholder="Search Archives..." className="w-full pl-12 pr-6 py-3 bg-black/40 border border-white/10 rounded-xl text-[10px] font-black text-white outline-none" />
            </div>
         </div>

         <div className="overflow-x-auto">
            <table className="w-full text-left">
                <thead className="bg-black/10 text-slate-600 font-black text-[9px] uppercase tracking-widest border-b border-white/5">
                   <tr>
                      <th className="px-10 py-6">Report Name</th>
                      <th className="px-10 py-6">Timeline</th>
                      <th className="px-10 py-6">Status</th>
                      <th className="px-10 py-6 text-right">Download</th>
                   </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                   {[
                     { name: 'Monthly Shipment Summary', date: 'November 2025', status: 'Ready' },
                     { name: 'RTO Analytics Report', date: 'October 2025', status: 'Ready' },
                     { name: 'Courier Performance Ledger', date: 'October 2025', status: 'Ready' }
                   ].map((it, i) => (
                      <tr key={i} className="hover:bg-white/5 transition-all group">
                         <td className="px-10 py-8">
                            <div className="text-white font-black text-sm uppercase tracking-tight">{it.name}</div>
                            <div className="text-[9px] text-slate-600 font-bold mt-1">ID: RPT-00{i+1} • Persistence V2</div>
                         </td>
                         <td className="px-10 py-8 text-slate-400 font-black text-[10px] uppercase">{it.date}</td>
                         <td className="px-10 py-8">
                            <span className="px-3 py-1 bg-emerald-900/20 text-emerald-400 border border-emerald-500/20 rounded-full text-[9px] font-black uppercase tracking-widest">Verified</span>
                         </td>
                         <td className="px-10 py-8 text-right">
                            <button className="p-3 bg-black/40 border border-white/5 rounded-xl text-slate-500 hover:text-brand-400 hover:border-brand-500/30 transition-all"><FileDown size={18}/></button>
                         </td>
                      </tr>
                   ))}
                </tbody>
            </table>
         </div>
      </div>
    </div>
  );
};
