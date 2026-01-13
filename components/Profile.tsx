
import React, { useState } from 'react';
import { 
  User, FileText, Lock, Smartphone, Mail, Building2, 
  Verified, FileDigit, Hash, FileCheck, RefreshCcw, Clock, XCircle
} from 'lucide-react';
import { useLocalStorage } from '../hooks/useLocalStorage';

export const Profile: React.FC = () => {
  const [kycStatus] = useLocalStorage<'Pending' | 'Verified' | 'Rejected'>('vas_kyc_status', 'Pending');
  const sellerName = "KDS Logistics Pvt Ltd";

  const SectionHeader = ({ title, description, icon: Icon, colorClass = "text-brand-400" }: { title: string; description: string; icon: any; colorClass?: string }) => (
    <div className="mb-8">
      <div className="flex items-center gap-4 mb-2">
        <div className={`p-3 bg-[#0B1020] rounded-2xl border border-[#1F2937] shadow-inner ${colorClass}`}><Icon size={24} /></div>
        <div>
          <h3 className="text-xl font-black text-white uppercase tracking-tighter">{title}</h3>
          <p className="text-sm text-slate-500 font-medium">{description}</p>
        </div>
      </div>
    </div>
  );

  const InputGroup = ({ label, value, type = "text", readOnly = false, icon: Icon }: { label: string; value: string; type?: string; readOnly?: boolean; icon: any }) => (
    <div className="group space-y-2">
      <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.15em] flex items-center gap-2 ml-1 group-focus-within:text-brand-400 transition-colors"><Icon size={12} /> {label}</label>
      <div className="relative">
        <input type={type} defaultValue={value} readOnly={readOnly} className={`w-full px-5 py-4 bg-[#0B1020] border border-[#1F2937] rounded-2xl text-base font-bold text-white focus:outline-none focus:border-brand-500 transition-all ${readOnly ? 'opacity-60 cursor-not-allowed bg-[#090d1a]' : 'hover:border-[#374151]'}`} />
        {readOnly && <Lock size={14} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-600" />}
      </div>
    </div>
  );

  return (
    <div className="p-10 bg-[#0B1020] min-h-full font-sans text-slate-300 pb-32">
      <div className="max-w-5xl mx-auto space-y-12">
        
        {/* Profile Information */}
        <div className="bg-[#111827] rounded-[2.5rem] border border-[#1F2937] p-10 shadow-2xl relative overflow-hidden group">
          <SectionHeader icon={User} title="1. Profile Information" description="Manage your primary business identification and contact details." />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <InputGroup icon={Building2} label="Seller Name" value={sellerName} />
            <InputGroup icon={Mail} label="Registered Email" value="sonusandy97@gmail.com" />
            <InputGroup icon={Smartphone} label="Mobile Number" value="+91 97176 24831" />
          </div>
        </div>

        {/* Business & KYC Details */}
        <div className="bg-[#111827] rounded-[2.5rem] border border-[#1F2937] p-10 shadow-2xl relative overflow-hidden group">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
            <SectionHeader icon={FileCheck} colorClass="text-emerald-400" title="2. Business & KYC Details" description="Verification documents for compliance." />
            <div className={`px-6 py-2.5 rounded-2xl text-xs font-black uppercase flex items-center gap-3 border ${kycStatus === 'Verified' ? 'bg-emerald-950/20 text-emerald-400 border-emerald-500/30' : kycStatus === 'Pending' ? 'bg-orange-950/20 text-orange-400 border-orange-500/30' : 'bg-red-950/20 text-red-400 border-red-500/30'}`}>
              {kycStatus === 'Verified' ? <Verified size={18} /> : kycStatus === 'Pending' ? <Clock size={18} className="animate-pulse" /> : <XCircle size={18} />} Status: {kycStatus}
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <InputGroup icon={FileDigit} label="PAN Number" value="ABCDE1234F" readOnly />
            <InputGroup icon={Hash} label="GST Number" value="07AAAAA0000A1Z5" readOnly />
          </div>
        </div>
      </div>
    </div>
  );
};
