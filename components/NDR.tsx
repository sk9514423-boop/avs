
import React, { useState, useMemo } from 'react';
import { 
  Search, RefreshCcw, AlertTriangle, User, Phone, 
  MapPin, CheckCircle2, XCircle, Clock, Zap, 
  AlertCircle, Info, X, ChevronRight 
} from 'lucide-react';

interface NDRItem {
  id: string;
  customer: string;
  phone: string;
  courier: string;
  awb: string;
  reason: string;
  attempts: number;
  status: 'Open' | 'Resolved' | 'RTO Initiated';
  lastAttempt: string;
}

const REASONS = [
  "Customer Not Available",
  "Address Incomplete / Incorrect",
  "Phone Unreachable / Switched Off",
  "Customer Refused Delivery",
  "COD Payment Issue",
  "Area Out of Delivery Zone",
  "Shipment Rescheduled by Customer"
];

export const NDR: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedNDR, setSelectedNDR] = useState<NDRItem | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [ndrData, setNdrData] = useState<NDRItem[]>([
    { 
      id: 'NDR-7701', 
      customer: 'Rahul Kumar', 
      phone: '9876543210', 
      courier: 'Delhivery', 
      awb: '306334112402',
      reason: 'Customer Not Available', 
      attempts: 1,
      status: 'Open', 
      lastAttempt: 'Today, 10:30 AM'
    },
    { 
      id: 'NDR-8802', 
      customer: 'Sneha Gupta', 
      phone: '9911223344', 
      courier: 'BlueDart', 
      awb: 'BD990211334',
      reason: 'Address Incomplete / Incorrect', 
      attempts: 2,
      status: 'Open', 
      lastAttempt: 'Yesterday, 04:15 PM'
    }
  ]);

  const filteredData = useMemo(() => {
    return ndrData.filter(item => 
      item.customer.toLowerCase().includes(searchTerm.toLowerCase()) || 
      item.awb.includes(searchTerm)
    );
  }, [ndrData, searchTerm]);

  const handleAction = (action: string) => {
    if (!selectedNDR) return;
    setNdrData(prev => prev.map(item => 
      item.id === selectedNDR.id 
        ? { ...item, status: action === 'Initiate RTO' ? 'RTO Initiated' : 'Resolved' } 
        : item
    ));
    setIsModalOpen(false);
    setSelectedNDR(null);
  };

  return (
    <div className="p-10 bg-[#060810] min-h-full font-sans text-slate-300">
      <div className="mb-10">
        <h2 className="text-3xl font-black text-white uppercase tracking-tighter flex items-center gap-4">
          <div className="p-3 bg-rose-600/10 text-rose-500 rounded-2xl border border-rose-500/20">
            <AlertTriangle size={28} />
          </div>
          Shipment NDR Hub
        </h2>
        <p className="text-slate-500 mt-2 text-xs font-black uppercase tracking-[0.3em]">Non-Delivery Resolution Center</p>
      </div>

      <div className="bg-[#111827] rounded-[2.5rem] border border-white/5 shadow-2xl overflow-hidden">
        <div className="p-6 border-b border-white/5 bg-black/20 flex gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600" size={18} />
            <input 
              type="text" 
              placeholder="Search by AWB or Customer..." 
              value={searchTerm} 
              onChange={e => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-[#0B1020] border border-white/5 rounded-xl text-xs font-bold text-white outline-none focus:border-brand-500" 
            />
          </div>
          <button className="p-3 bg-white/5 rounded-xl text-slate-500 hover:text-white transition-all border border-white/5"><RefreshCcw size={20}/></button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-black/40 text-slate-500 font-black text-[10px] uppercase tracking-widest border-b border-white/5">
              <tr>
                <th className="px-8 py-5">AWB / Courier</th>
                <th className="px-8 py-5">Customer</th>
                <th className="px-8 py-5">Reason</th>
                <th className="px-8 py-5">Attempts</th>
                <th className="px-8 py-5">Status</th>
                <th className="px-8 py-5 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {filteredData.map(item => (
                <tr key={item.id} className="hover:bg-white/5 transition-all">
                  <td className="px-8 py-8">
                    <div className="text-brand-400 font-black text-sm">{item.awb}</div>
                    <div className="text-[10px] text-slate-600 uppercase font-bold mt-1">{item.courier}</div>
                  </td>
                  <td className="px-8 py-8">
                    <div className="text-white font-black text-xs uppercase">{item.customer}</div>
                    <div className="text-[10px] text-slate-600 mt-1">{item.phone}</div>
                  </td>
                  <td className="px-8 py-8">
                    <div className="text-rose-400 font-bold text-[11px] uppercase max-w-[200px] leading-relaxed">{item.reason}</div>
                    <div className="text-[9px] text-slate-600 mt-1 font-medium">{item.lastAttempt}</div>
                  </td>
                  <td className="px-8 py-8 text-center">
                    <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center text-xs font-black border border-white/5">{item.attempts}</div>
                  </td>
                  <td className="px-8 py-8">
                    <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border ${
                      item.status === 'Open' ? 'bg-amber-900/20 text-amber-400 border-amber-500/20' : 
                      item.status === 'Resolved' ? 'bg-emerald-900/20 text-emerald-400 border-emerald-500/20' :
                      'bg-rose-900/20 text-rose-400 border-rose-500/20'
                    }`}>
                      {item.status}
                    </span>
                  </td>
                  <td className="px-8 py-8 text-right">
                    {item.status === 'Open' ? (
                      <button 
                        onClick={() => { setSelectedNDR(item); setIsModalOpen(true); }}
                        className="px-6 py-2 bg-brand-600 hover:bg-brand-700 text-white rounded-xl text-[9px] font-black uppercase tracking-widest shadow-lg transition-all active:scale-95"
                      >
                        Action Required
                      </button>
                    ) : (
                      <div className="text-[10px] font-black text-slate-700 uppercase italic">Processed</div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {isModalOpen && selectedNDR && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-6 bg-black/90 backdrop-blur-xl">
          <div className="bg-[#111827] w-full max-w-lg rounded-[3rem] border border-white/10 shadow-2xl overflow-hidden">
            <div className="p-8 border-b border-white/5 flex justify-between items-center bg-black/20">
              <h3 className="text-xl font-black text-white uppercase tracking-tighter">Resolve NDR Incident</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-500 hover:text-white"><X size={24} /></button>
            </div>
            
            <div className="p-8 space-y-8">
              <div className="bg-white/5 p-6 rounded-2xl border border-white/5">
                <div className="text-[10px] font-black text-slate-500 uppercase mb-3">Shipment Context</div>
                <div className="flex justify-between items-center">
                  <div className="text-sm font-black text-white uppercase">{selectedNDR.customer}</div>
                  <div className="text-xs font-mono text-brand-400">{selectedNDR.awb}</div>
                </div>
                <div className="mt-4 p-3 bg-rose-500/10 rounded-xl border border-rose-500/20">
                  <div className="text-[9px] font-black text-rose-400 uppercase mb-1">Failure Reason</div>
                  <div className="text-[11px] font-bold text-white uppercase">{selectedNDR.reason}</div>
                </div>
              </div>

              <div className="space-y-3">
                <div className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">Select Resolution Protocol</div>
                <button onClick={() => handleAction('Re-attempt')} className="w-full p-4 bg-[#0B1020] border border-white/5 rounded-2xl hover:border-emerald-500 group flex items-center justify-between transition-all">
                  <div className="flex items-center gap-4">
                    <div className="p-2 bg-emerald-500/10 text-emerald-400 rounded-lg group-hover:bg-emerald-500 group-hover:text-white transition-all"><RefreshCcw size={18} /></div>
                    <span className="text-xs font-black text-white uppercase">Re-attempt Delivery</span>
                  </div>
                  <ChevronRight size={16} className="text-slate-600" />
                </button>
                <button onClick={() => handleAction('Update Address')} className="w-full p-4 bg-[#0B1020] border border-white/5 rounded-2xl hover:border-brand-500 group flex items-center justify-between transition-all">
                  <div className="flex items-center gap-4">
                    <div className="p-2 bg-brand-500/10 text-brand-400 rounded-lg group-hover:bg-brand-500 group-hover:text-white transition-all"><MapPin size={18} /></div>
                    <span className="text-xs font-black text-white uppercase">Change Address / Phone</span>
                  </div>
                  <ChevronRight size={16} className="text-slate-600" />
                </button>
                <button onClick={() => handleAction('Initiate RTO')} className="w-full p-4 bg-[#0B1020] border border-white/5 rounded-2xl hover:border-rose-500 group flex items-center justify-between transition-all">
                  <div className="flex items-center gap-4">
                    <div className="p-2 bg-rose-500/10 text-rose-400 rounded-lg group-hover:bg-rose-500 group-hover:text-white transition-all"><XCircle size={18} /></div>
                    <span className="text-xs font-black text-white uppercase">Initiate RTO (Return)</span>
                  </div>
                  <ChevronRight size={16} className="text-slate-600" />
                </button>
              </div>
            </div>

            <div className="p-8 border-t border-white/5 bg-black/20 text-center">
              <p className="text-[10px] text-slate-500 font-bold uppercase">Actions are synchronized with carrier systems within 24 hours.</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
