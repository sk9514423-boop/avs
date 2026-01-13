
import React, { useState } from 'react';
import { Shield, Zap, Truck, AlertCircle, Package, User, MapPin } from 'lucide-react';
import { Order } from '../types';

interface AddOrderFormProps {
  onOrderAdded: (order: any) => void;
  onCancel?: () => void;
  initialOrder?: Order | null;
}

export const AddOrderForm: React.FC<AddOrderFormProps> = ({ onOrderAdded, onCancel, initialOrder }) => {
  const [orderId, setOrderId] = useState(initialOrder?.id || `ORD-${Math.floor(100000 + Math.random() * 900000)}`);
  const [declaredValue, setDeclaredValue] = useState('1000');
  const [isInsured, setIsInsured] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('Prepaid');
  
  const [receiver, setReceiver] = useState({ 
    name: initialOrder?.shipping.name || '', 
    phone: initialOrder?.shipping.phone || '', 
    address: initialOrder?.shipping.address || '', 
    zip: initialOrder?.shipping.zip || '', 
    country: 'India' 
  });
  const [pkg, setPkg] = useState({ 
    wt: initialOrder?.package.deadWt.replace('kg', '') || '0.5', 
    l: '10', w: '10', h: '10' 
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!receiver.name || !receiver.address || receiver.phone.length < 10) {
        alert("Please complete receiver details.");
        return;
    }

    const payload = {
        id: orderId,
        declaredValue: parseFloat(declaredValue),
        isInsured,
        paymentMethod,
        shipping: receiver,
        package: {
            deadWt: `${pkg.wt}kg`,
            dimensions: `${pkg.l}x${pkg.w}x${pkg.h}`,
            volumetric: '0.2kg'
        },
        products: [{ name: 'Commercial Goods', sku: 'CG-01', qty: 1, price: parseFloat(declaredValue) }],
        tag: 'Aggregator Panel',
        category: 'Domestic',
        pickup: 'VAS LOGISTICS MAIN HUB'
    };

    onOrderAdded(payload);
  };

  return (
    <div className="p-8 bg-[#0B1020] min-h-full pb-32">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-3xl font-black text-white uppercase tracking-tighter mb-10 flex items-center gap-4">
            <div className="p-3 bg-brand-900/30 rounded-2xl text-brand-400 border border-brand-900/50 shadow-inner"><Truck size={32} /></div>
            New Dispatch Request
        </h2>

        <form onSubmit={handleSubmit} className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Section: Identity */}
                <div className="bg-[#111827] p-8 rounded-[2.5rem] border border-white/5 shadow-2xl space-y-6">
                    <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-widest border-b border-white/5 pb-4">Order Metadata</h3>
                    <div className="space-y-4">
                        <div className="space-y-1">
                            <label className="text-[9px] font-black text-slate-400 uppercase ml-1">Reference ID</label>
                            <input value={orderId} onChange={e => setOrderId(e.target.value)} className="w-full bg-[#0B1020] border border-white/10 rounded-xl px-5 py-3 text-white font-bold outline-none focus:border-brand-500" />
                        </div>
                        <div className="space-y-1">
                            <label className="text-[9px] font-black text-slate-400 uppercase ml-1">Payment Mode</label>
                            <select value={paymentMethod} onChange={e => setPaymentMethod(e.target.value)} className="w-full bg-[#0B1020] border border-white/10 rounded-xl px-5 py-3 text-white font-bold outline-none">
                                <option value="Prepaid">PREPAID</option>
                                <option value="COD">CASH ON DELIVERY (COD)</option>
                            </select>
                        </div>
                        <div className="space-y-1">
                            <label className="text-[9px] font-black text-slate-400 uppercase ml-1">Declared Value (₹)</label>
                            <input type="number" value={declaredValue} onChange={e => setDeclaredValue(e.target.value)} className="w-full bg-[#0B1020] border border-white/10 rounded-xl px-5 py-3 text-white font-bold outline-none" />
                        </div>
                        <div className="flex items-center justify-between p-4 bg-brand-900/10 border border-brand-500/20 rounded-2xl">
                           <div className="flex items-center gap-3">
                              <Shield size={16} className="text-brand-400" />
                              <span className="text-[10px] font-black text-white uppercase">Insurance Required</span>
                           </div>
                           <button type="button" onClick={() => setIsInsured(!isInsured)} className={`w-12 h-6 rounded-full relative transition-all ${isInsured ? 'bg-brand-600' : 'bg-slate-700'}`}>
                              <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${isInsured ? 'right-1' : 'left-1'}`}></div>
                           </button>
                        </div>
                    </div>
                </div>

                {/* Section: Consignee */}
                <div className="bg-[#111827] p-8 rounded-[2.5rem] border border-white/5 shadow-2xl space-y-4">
                    <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-widest border-b border-white/5 pb-4">Receiver Details</h3>
                    <input placeholder="Customer Name" value={receiver.name} onChange={e => setReceiver({...receiver, name: e.target.value})} className="w-full bg-[#0B1020] border border-white/10 rounded-xl px-5 py-3 text-white text-sm outline-none" />
                    <input placeholder="Contact Phone" value={receiver.phone} onChange={e => setReceiver({...receiver, phone: e.target.value})} className="w-full bg-[#0B1020] border border-white/10 rounded-xl px-5 py-3 text-white text-sm outline-none" />
                    <textarea placeholder="Full Shipping Address" value={receiver.address} onChange={e => setReceiver({...receiver, address: e.target.value})} className="w-full bg-[#0B1020] border border-white/10 rounded-xl px-5 py-3 text-white text-sm outline-none h-24 resize-none" />
                    <input placeholder="Pincode" value={receiver.zip} onChange={e => setReceiver({...receiver, zip: e.target.value})} className="w-full bg-[#0B1020] border border-white/10 rounded-xl px-5 py-3 text-white text-sm outline-none" />
                </div>
            </div>

            <div className="fixed bottom-0 left-0 right-0 bg-[#111827]/80 backdrop-blur-xl border-t border-white/5 p-6 flex justify-center items-center z-50">
               <div className="max-w-4xl w-full flex justify-between items-center px-8">
                 <button type="button" onClick={onCancel} className="text-slate-500 font-black uppercase text-xs hover:text-white">Discard Changes</button>
                 <button type="submit" className="bg-brand-600 hover:bg-brand-700 text-white px-14 py-4 rounded-2xl font-black uppercase text-xs tracking-widest shadow-2xl flex items-center gap-3 transition-all active:scale-95">
                    <Zap size={18} fill="currentColor" /> Generate AWB & Label
                 </button>
               </div>
            </div>
        </form>
      </div>
    </div>
  );
};
