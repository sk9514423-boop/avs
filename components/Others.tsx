
import React, { useState } from 'react';
import { 
  FileText, Landmark, Receipt, Calendar, RefreshCcw, ChevronDown, 
  Download, Filter, Search, Printer, FileDown, ShieldCheck, Zap, Layers,
  CreditCard, Activity, ArrowRight, Verified, CheckCircle2, Clock, Scale
} from 'lucide-react';
import { useLocalStorage } from '../hooks/useLocalStorage';

export const Others: React.FC = () => {
  const [activeTab, setActiveTab] = useState('GST Invoices');
  const tabs = ['GST Invoices', 'Credit Notes', 'Weight Audit', 'Cod Settlements', 'KYC Documents'];
  const [kycStatus] = useLocalStorage('vas_kyc_status', 'Verified');

  const TableHeader = ({ cols }: { cols: string[] }) => (
    <thead className="text-slate-500 font-black uppercase text-[10px] tracking-widest border-b border-[#1F2937] bg-[#0B1020]/30">
        <tr>{cols.map((c, i) => <th key={i} className="px-6 py-4">{c}</th>)}</tr>
    </thead>
  );

  return (
    <div className="p-8 bg-[#0B1020] min-h-full font-sans text-gray-300">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 gap-8">
        <div>
          <h2 className="text-3xl font-black text-white flex items-center gap-4 uppercase tracking-tighter">
             <div className="p-3 bg-brand-900/30 rounded-2xl text-brand-400 border border-brand-900/50 shadow-inner">
                <Landmark size={28} />
             </div>
             Administrative Hub
          </h2>
          <p className="text-[10px] text-slate-500 font-black uppercase tracking-[0.3em] mt-2 ml-1 opacity-60">Compliance & Regulatory Document Ledger</p>
        </div>
        
        <div className="flex bg-[#111827] p-1.5 rounded-[1.5rem] border border-[#1F2937] shadow-2xl overflow-x-auto no-scrollbar">
           {tabs.map((tab) => (
             <button 
                key={tab} 
                onClick={() => setActiveTab(tab)} 
                className={`px-6 py-3 text-[10px] font-black uppercase tracking-widest rounded-xl transition-all whitespace-nowrap ${activeTab === tab ? 'bg-brand-600 text-white shadow-lg' : 'text-slate-500 hover:text-slate-300'}`}
             >
                {tab}
             </button>
           ))}
        </div>
      </div>

      <div className="bg-[#111827] rounded-[3.5rem] border border-[#1F2937] shadow-2xl overflow-hidden ring-1 ring-white/5">
         <div className="p-8 border-b border-[#1F2937] bg-[#0B1020]/50 flex flex-wrap gap-6 items-center justify-between">
            <div className="flex items-center gap-4 bg-[#0B1020] px-6 py-3 rounded-2xl border border-[#374151] shadow-inner group focus-within:border-brand-500 transition-all">
                <Search size={18} className="text-slate-600 group-focus-within:text-brand-400" />
                <input type="text" placeholder="Search Records..." className="bg-transparent border-none outline-none text-xs font-bold text-white w-48 placeholder-slate-700" />
            </div>
            <button className="flex items-center gap-3 px-8 py-3 bg-brand-600 hover:bg-brand-700 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-xl transition-all active:scale-95"><Download size={18}/> Export CSV</button>
         </div>

         <div className="p-10">
            {activeTab === 'GST Invoices' && (
                <div className="animate-in fade-in duration-500 overflow-x-auto">
                    <table className="w-full text-left text-sm">
                        <TableHeader cols={['Invoice #', 'Billing Month', 'GSTR Status', 'Download']} />
                        <tbody className="divide-y divide-[#1F2937]">
                            {[
                                { id: 'GST-NOV-25-01', month: 'November 2025', status: 'Filed' },
                                { id: 'GST-OCT-25-01', month: 'October 2025', status: 'Filed' }
                            ].map(inv => (
                                <tr key={inv.id} className="hover:bg-[#0B1020]/30 transition-colors">
                                    <td className="px-6 py-6 font-black text-white">{inv.id}</td>
                                    <td className="px-6 py-6 text-slate-400 font-bold">{inv.month}</td>
                                    <td className="px-6 py-6"><span className="px-3 py-1 bg-emerald-950/20 text-emerald-400 border border-emerald-500/20 rounded-full text-[9px] font-black uppercase">Verified</span></td>
                                    <td className="px-6 py-6"><button className="p-2 text-slate-500 hover:text-brand-400 transition-all"><FileDown size={20}/></button></td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {activeTab === 'Weight Audit' && (
                <div className="animate-in slide-in-from-right-4 duration-500">
                    <table className="w-full text-left text-sm">
                        <TableHeader cols={['Audit ID', 'AWB Number', 'Expected', 'Billed', 'Difference']} />
                        <tbody className="divide-y divide-[#1F2937]">
                            <tr className="hover:bg-[#0B1020]/30 transition-colors">
                                <td className="px-6 py-6 font-black text-brand-400">WD-10291</td>
                                <td className="px-6 py-6 font-mono text-slate-400">DEL12345678</td>
                                <td className="px-6 py-6 text-slate-300">0.50 KG</td>
                                <td className="px-6 py-6 text-red-400 font-bold">1.25 KG</td>
                                <td className="px-6 py-6 font-black text-white">+0.75 KG</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            )}

            {activeTab === 'Cod Settlements' && (
                <div className="animate-in fade-in duration-500">
                    <table className="w-full text-left text-sm">
                        <TableHeader cols={['Batch ID', 'Date', 'Amount Settled', 'UTR / Ref', 'Status']} />
                        <tbody className="divide-y divide-[#1F2937]">
                            <tr className="hover:bg-[#0B1020]/30 transition-colors">
                                <td className="px-6 py-6 font-black text-white">SET-8821</td>
                                <td className="px-6 py-6 text-slate-400">28 Nov 2025</td>
                                <td className="px-6 py-6 text-emerald-400 font-black">₹ 14,500.00</td>
                                <td className="px-6 py-6 font-mono text-slate-500">UTR122930111</td>
                                <td className="px-6 py-6"><span className="px-3 py-1 bg-emerald-950/20 text-emerald-400 border border-emerald-500/20 rounded-full text-[9px] font-black uppercase">Transferred</span></td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            )}

            {activeTab === 'KYC Documents' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 animate-in zoom-in-95 duration-500">
                    <div className="p-10 bg-[#0B1020] rounded-[3rem] border border-[#1F2937] flex flex-col items-center text-center shadow-inner">
                        <div className="w-24 h-24 bg-brand-900/20 text-brand-400 rounded-3xl flex items-center justify-center mb-8 shadow-xl"><Verified size={48} /></div>
                        <h4 className="text-xl font-black text-white uppercase mb-2">Merchant KYC: {kycStatus}</h4>
                        <p className="text-[10px] text-slate-500 font-bold uppercase mb-10 tracking-widest">Your identity and business records are fully compliant with GSTR-1 norms.</p>
                        <div className="w-full flex gap-4">
                            <button className="flex-1 py-4 bg-[#111827] border border-[#374151] rounded-2xl text-[9px] font-black uppercase text-slate-300 hover:text-white transition-all">View Identity</button>
                            <button className="flex-1 py-4 bg-[#111827] border border-[#374151] rounded-2xl text-[9px] font-black uppercase text-slate-300 hover:text-white transition-all">Download Tax ID</button>
                        </div>
                    </div>
                </div>
            )}

            {activeTab === 'Credit Notes' && <div className="py-32 text-center text-slate-700 font-black uppercase tracking-[0.4em]">No Credit Adjustments Pending</div>}
         </div>
      </div>
    </div>
  );
};
