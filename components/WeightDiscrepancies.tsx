
import React, { useState, useRef, useEffect } from 'react';
import { 
  Search, 
  ShoppingCart, 
  Truck, 
  CheckCircle, 
  XCircle, 
  AlertCircle, 
  X, 
  Upload, 
  Trash2,
  Check,
  Clock,
  ChevronDown,
  ExternalLink,
  Image as ImageIcon,
  History,
  ShieldCheck,
  ArrowRight,
  Gavel,
  Scale,
  AlertTriangle,
  RefreshCcw,
  CheckCircle2,
  Plus
} from 'lucide-react';
import { DateFilter } from './DateFilter';

interface WeightDiscrepanciesProps {
    // Fix: Updated return type to Promise<boolean>
    onWalletTransaction?: (amount: number, description: string, type: 'CREDIT' | 'DEBIT') => Promise<boolean>;
    onShowToast?: (message: string, type: 'success' | 'error') => void;
}

const getPastDate = (days: number) => {
    const d = new Date();
    d.setDate(d.getDate() - days);
    return d.toISOString();
};

export const WeightDiscrepancies: React.FC<WeightDiscrepanciesProps> = ({ onWalletTransaction, onShowToast }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeStatus, setActiveStatus] = useState('Pending'); 
  const [startDate, setStartDate] = useState('2025-11-01');
  const [endDate, setEndDate] = useState('2025-12-31');

  const [isDisputeModalOpen, setIsDisputeModalOpen] = useState(false);
  const [selectedDisputeId, setSelectedDisputeId] = useState<number | null>(null);
  const [disputeRemark, setDisputeRemark] = useState('');
  const [evidencePreviews, setEvidencePreviews] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [disputes, setDisputes] = useState([
    {
      id: 1,
      createdAt: getPastDate(1),
      date: '17/12/2025, 16:43:59',
      orderId: '40386SM7701180622',
      customerName: 'Rahul Kumar',
      phone: '9876543210',
      orderStatus: 'Scheduled',
      courierName: 'Delhivery B2B',
      awb: '30633411240223',
      trackingStatus: 'Delivered',
      entered: { applied: '39kg', charge: '₹658.5' },
      courier: { charged: '43.14kg', newCharge: '₹717.2', images: ['https://images.unsplash.com/photo-1590247813693-5541d1c609fd?auto=format&fit=crop&q=80&w=300'] },
      excess: { wt: '4.14kg', charge: '58.7' },
      status: 'Action Required',
      category: 'Pending',
      statusColor: 'bg-blue-600',
      isPaid: false,
      autoAcceptDays: 3
    },
    {
      id: 2,
      createdAt: getPastDate(3),
      date: '15/12/2025, 16:43:59',
      orderId: '40386SM0535556905',
      customerName: 'Sneha Gupta',
      phone: '9988776655',
      orderStatus: 'Scheduled',
      courierName: 'Delhivery Surface',
      awb: '22784711157553',
      trackingStatus: 'Delivered',
      entered: { applied: '10kg', charge: '₹342.2' },
      courier: { charged: '11.5kg', newCharge: '₹398.84', images: ['https://images.unsplash.com/photo-1590247813693-5541d1c609fd?auto=format&fit=crop&q=80&w=300'] },
      excess: { wt: '1.5kg', charge: '56.64' },
      status: 'Action Required',
      category: 'Pending',
      statusColor: 'bg-orange-600',
      isPaid: false,
      autoAcceptDays: 1
    },
    {
      id: 3,
      createdAt: getPastDate(10),
      date: '01/12/2025, 12:20:15',
      orderId: '40386SM9123456789',
      customerName: 'Vikram Singh',
      phone: '9123456789',
      orderStatus: 'Delivered',
      courierName: 'BlueDart Air',
      awb: 'BD123456789',
      trackingStatus: 'Delivered',
      entered: { applied: '0.5kg', charge: '₹100' },
      courier: { charged: '1.0kg', newCharge: '₹150', images: ['https://images.unsplash.com/photo-1590247813693-5541d1c609fd?auto=format&fit=crop&q=80&w=300'] },
      excess: { wt: '0.5kg', charge: '50.0' },
      status: 'Accepted & Paid',
      category: 'Accepted',
      statusColor: 'bg-emerald-600',
      isPaid: true,
      autoAcceptDays: 0
    }
  ]);

  // Fix: handleAcceptDiscrepancy is now async to handle the Promise return of onWalletTransaction
  const handleAcceptDiscrepancy = async (id: number) => {
      const dispute = disputes.find(d => d.id === id);
      if (!dispute) return;
      
      const chargeValue = parseFloat(dispute.excess.charge);
      
      if (confirm(`Accept Weight Discrepancy?\nAmount ₹${chargeValue} will be deducted from your wallet for Order ${dispute.orderId}.`)) {
          const success = await onWalletTransaction?.(chargeValue, `Weight Discrepancy Payment: ${dispute.orderId}`, 'DEBIT');
          
          if (success) {
              setDisputes(prev => prev.map(d => d.id === id ? { 
                ...d, 
                category: 'Accepted', 
                status: 'Accepted & Paid', 
                statusColor: 'bg-emerald-600', 
                isPaid: true,
                autoAcceptDays: 0
              } : d));
              onShowToast?.(`Payment of ₹${chargeValue} successful.`, "success");
          }
      }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      // Explicitly cast Array.from result to File[] to avoid 'unknown' type errors
      const files = Array.from(e.target.files) as File[];
      files.forEach(file => {
        const reader = new FileReader();
        reader.onloadend = () => {
          setEvidencePreviews(prev => [...prev, reader.result as string].slice(0, 3));
        };
        reader.readAsDataURL(file);
      });
    }
  };

  const handleSubmitDispute = () => {
      if (!disputeRemark.trim()) { alert("Remark is mandatory."); return; }
      if (evidencePreviews.length === 0) { alert("Photo proof is required."); return; }

      setDisputes(prev => prev.map(d => d.id === selectedDisputeId ? { 
        ...d, 
        category: 'Rejected', 
        status: 'Dispute Raised', 
        statusColor: 'bg-purple-600',
        autoAcceptDays: 0,
        remarks: disputeRemark
      } : d));
      
      setIsDisputeModalOpen(false);
      setDisputeRemark('');
      setEvidencePreviews([]);
      onShowToast?.("Dispute Raised for review.", "success");
  };

  const filteredDisputes = disputes.filter(item => {
    const term = searchTerm.toLowerCase();
    const matchesSearch = item.orderId.toLowerCase().includes(term) || item.awb.includes(term);
    const matchesFilter = activeStatus === 'All' || item.category === activeStatus;
    return matchesSearch && matchesFilter;
  });

  const stats = [
    { label: 'TOTAL DISPUTES', value: disputes.length, icon: <ShoppingCart size={24} />, bg: 'bg-blue-600/20', iconColor: 'text-blue-500', filter: 'All' },
    { label: 'PENDING ACTION', value: disputes.filter(d => d.category === 'Pending').length, icon: <Truck size={24} />, bg: 'bg-orange-600/20', iconColor: 'text-orange-500', filter: 'Pending' },
    { label: 'ACCEPTED / PAID', value: disputes.filter(d => d.category === 'Accepted').length, icon: <CheckCircle size={24} />, bg: 'bg-emerald-600/20', iconColor: 'text-emerald-500', filter: 'Accepted' },
    { label: 'DISPUTED / REJECTED', value: disputes.filter(d => d.category === 'Rejected').length, icon: <XCircle size={24} />, bg: 'bg-purple-600/20', iconColor: 'text-purple-500', filter: 'Rejected' },
  ];

  return (
    <div className="p-8 bg-[#0B1020] min-h-full font-sans text-slate-300 pb-32">
      <div className="flex flex-col md:flex-row justify-between items-start mb-10 gap-6">
        <div>
          <h2 className="text-3xl font-black text-white uppercase tracking-tighter flex items-center gap-4">
             <Scale size={32} className="text-brand-400" />
             Weight Discrepancy Manager
          </h2>
          <p className="text-sm text-slate-500 mt-2 font-medium max-w-2xl">
             Review shipment weight audits and resolve discrepancies.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10">
        {stats.map((stat, idx) => (
          <div key={idx} onClick={() => setActiveStatus(stat.filter)} className={`bg-[#111827] p-8 rounded-[2.5rem] border-2 flex flex-col items-center justify-center text-center gap-4 cursor-pointer transition-all duration-500 ${activeStatus === stat.filter ? `border-brand-500 ring-8 ring-brand-500/5 bg-[#0B1020]` : 'border-[#1F2937] hover:border-slate-700'}`}>
            <div className={`w-14 h-14 rounded-2xl ${stat.bg} flex items-center justify-center ${stat.iconColor}`}>{stat.icon}</div>
            <div>
              <div className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{stat.label}</div>
              <div className="text-4xl font-black text-white mt-1 tracking-tighter">{stat.value}</div>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-[#111827] rounded-3xl border border-[#1F2937] flex items-center px-6 mb-8 focus-within:border-brand-500 transition-all shadow-inner">
        <Search size={22} className="text-slate-600" />
        <input type="text" placeholder="Search Order ID or AWB..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full bg-transparent border-none focus:ring-0 text-base py-5 px-4 text-white font-medium" />
      </div>

      <div className="bg-[#111827] rounded-[3rem] border border-[#1F2937] shadow-2xl overflow-hidden ring-1 ring-white/5">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-[#0B1020]/90 text-slate-500 font-black text-[10px] uppercase tracking-[0.2em] border-b border-[#1F2937]">
              <tr>
                <th className="px-10 py-6">Timeline</th>
                <th className="px-10 py-6">Shipment Details</th>
                <th className="px-10 py-6">Comparison</th>
                <th className="px-10 py-6">Impact</th>
                <th className="px-10 py-6">Status</th>
                <th className="px-10 py-6 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1F2937]">
              {filteredDisputes.map((item) => (
                <tr key={item.id} className="hover:bg-[#0B1020]/40 transition-all group">
                  <td className="px-10 py-10">
                    <div className="text-xs font-bold text-slate-400">{item.date}</div>
                    {item.isPaid && <div className="mt-2 text-[10px] font-black text-emerald-400 uppercase">Paid</div>}
                  </td>
                  <td className="px-10 py-10">
                    <div className="text-brand-400 font-black text-base">{item.orderId}</div>
                    <div className="text-[10px] text-slate-500 font-mono mt-1">{item.awb}</div>
                    <div className="text-[10px] text-slate-600 font-bold uppercase mt-2">{item.courierName}</div>
                  </td>
                  <td className="px-10 py-10">
                    <div className="text-[11px] font-bold text-slate-500">YOU: {item.entered.applied}</div>
                    <div className="text-[11px] font-black text-red-400 mt-1">COURIER: {item.courier.charged}</div>
                  </td>
                  <td className="px-10 py-10 text-rose-500 font-black tracking-tighter">₹{item.excess.charge}</td>
                  <td className="px-10 py-10">
                    <span className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase border ${item.statusColor} bg-opacity-20 text-white`}>{item.status}</span>
                  </td>
                  <td className="px-10 py-10 text-center">
                    <div className="flex flex-col gap-2 max-w-[150px] mx-auto">
                      {item.category === 'Pending' && (
                          <>
                            <button onClick={() => handleAcceptDiscrepancy(item.id)} className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-[10px] font-black uppercase tracking-widest transition-all">Accept & Pay</button>
                            <button onClick={() => { setSelectedDisputeId(item.id); setIsDisputeModalOpen(true); }} className="w-full py-3 bg-[#0B1020] border border-[#374151] hover:border-purple-500 text-slate-400 hover:text-white rounded-xl text-[10px] font-black uppercase tracking-widest transition-all">Dispute</button>
                          </>
                      )}
                      {item.category !== 'Pending' && <div className="text-[10px] font-black uppercase text-slate-600 italic">No Actions</div>}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {isDisputeModalOpen && (
          <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-black/90 backdrop-blur-xl animate-in fade-in duration-300">
              <div className="bg-[#111827] rounded-[3rem] w-full max-w-lg border border-[#1F2937] shadow-2xl overflow-hidden flex flex-col">
                  <div className="p-8 border-b border-[#1F2937] flex justify-between items-center bg-[#0B1020]/50">
                      <h3 className="text-xl font-black text-white uppercase tracking-tighter">Billing Dispute</h3>
                      <button onClick={() => setIsDisputeModalOpen(false)} className="p-2 text-slate-500 hover:text-white"><X size={24} /></button>
                  </div>
                  <div className="p-8 space-y-6">
                      <textarea value={disputeRemark} onChange={(e) => setDisputeRemark(e.target.value)} placeholder="Provide evidence description..." className="w-full p-6 bg-[#0B1020] border border-[#374151] rounded-2xl text-sm text-white focus:border-brand-500 outline-none h-32 resize-none" />
                      <div className="grid grid-cols-3 gap-4">
                        {evidencePreviews.map((src, i) => <div key={i} className="aspect-square bg-black rounded-xl overflow-hidden border border-[#374151]"><img src={src} className="w-full h-full object-cover" /></div>)}
                        {evidencePreviews.length < 3 && <div onClick={() => fileInputRef.current?.click()} className="aspect-square border-2 border-dashed border-[#374151] rounded-xl flex items-center justify-center cursor-pointer hover:border-purple-500"><Plus size={24} className="text-slate-600" /></div>}
                      </div>
                      <input type="file" multiple accept="image/*" className="hidden" ref={fileInputRef} onChange={handleFileChange} />
                  </div>
                  <div className="p-8 border-t border-[#1F2937] flex gap-4">
                      <button onClick={() => setIsDisputeModalOpen(false)} className="flex-1 py-4 text-[10px] font-black text-slate-500 uppercase">Cancel</button>
                      <button onClick={handleSubmitDispute} className="flex-1 py-4 bg-purple-600 text-white rounded-xl text-[10px] font-black uppercase shadow-xl">Submit Dispute</button>
                  </div>
              </div>
          </div>
      )}
    </div>
  );
};
