
import React, { useState, useEffect } from 'react';
import { 
  X, 
  CreditCard, 
  Smartphone, 
  ShieldCheck, 
  Wallet, 
  QrCode, 
  Landmark,
  ArrowLeft,
  Loader2,
  ChevronRight,
  CheckCircle2
} from 'lucide-react';

interface RechargeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onRechargeSuccess?: (amount: number) => void;
}

export const RechargeModal: React.FC<RechargeModalProps> = ({ isOpen, onClose, onRechargeSuccess }) => {
  const [step, setStep] = useState(1);
  const [amount, setAmount] = useState('');
  const [selectedMethod, setSelectedMethod] = useState('upi');
  const [processing, setProcessing] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState('');
  
  const [cardDetails, setCardDetails] = useState({ number: '', name: '', expiry: '', cvv: '' });

  useEffect(() => {
    if (isOpen) {
        setStep(1);
        setProcessing(false);
        setOtpSent(false);
        setOtp('');
        setAmount('');
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const quickAmounts = ['1000', '2000', '5000', '10000', '20000'];

  const banks = [
      { name: 'HDFC', logo: 'https://upload.wikimedia.org/wikipedia/commons/2/28/HDFC_Bank_Logo.svg' },
      { name: 'SBI', logo: 'https://upload.wikimedia.org/wikipedia/commons/c/cc/SBI-logo.svg' },
      { name: 'ICICI', logo: 'https://upload.wikimedia.org/wikipedia/commons/1/12/ICICI_Bank_Logo.svg' },
      { name: 'Axis', logo: 'https://upload.wikimedia.org/wikipedia/commons/c/ce/Axis_Bank_logo.svg' }
  ];

  const handleProceed = () => {
    if (!amount || parseFloat(amount) <= 0) return;
    setStep(2);
  };

  const completeTransaction = () => {
      setProcessing(true);
      setTimeout(() => {
          setProcessing(false);
          if (onRechargeSuccess) {
              onRechargeSuccess(parseFloat(amount));
          }
          onClose();
      }, 1500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50">
          <h3 className="text-lg font-semibold text-slate-800">Add Funds to Wallet</h3>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 transition-colors">
             <X size={20} />
          </button>
        </div>

        {/* Step 1: Amount */}
        {step === 1 && (
            <div className="p-6 space-y-6">
                <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Enter Amount (₹)</label>
                    <div className="relative">
                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-bold text-xl">₹</span>
                        <input 
                            type="number" 
                            value={amount}
                            onChange={(e) => setAmount(e.target.value)}
                            placeholder="0.00"
                            className="w-full pl-10 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-xl text-2xl font-bold text-slate-800 focus:outline-none focus:border-brand-500 focus:ring-4 focus:ring-brand-500/5 transition-all"
                        />
                    </div>
                </div>

                <div className="grid grid-cols-3 gap-3">
                    {quickAmounts.map(val => (
                        <button 
                            key={val} 
                            onClick={() => setAmount(val)}
                            className={`py-2 text-sm font-bold rounded-lg border transition-all ${amount === val ? 'bg-brand-600 border-brand-600 text-white shadow-md' : 'bg-white border-slate-200 text-slate-600 hover:border-brand-500'}`}
                        >
                            +₹{val}
                        </button>
                    ))}
                </div>

                <button 
                    onClick={handleProceed}
                    disabled={!amount || parseFloat(amount) <= 0}
                    className="w-full py-4 bg-brand-600 hover:bg-brand-700 text-white font-bold rounded-xl shadow-lg shadow-brand-500/20 disabled:opacity-50 transition-all flex items-center justify-center gap-2"
                >
                    Proceed to Pay <ChevronRight size={20} />
                </button>
            </div>
        )}

        {/* Step 2: Payment Method */}
        {step === 2 && (
            <div className="p-6 space-y-4">
                <button onClick={() => setStep(1)} className="flex items-center gap-1 text-slate-500 text-xs font-bold hover:text-slate-800 transition-colors mb-2">
                    <ArrowLeft size={14} /> BACK TO AMOUNT
                </button>

                <div className="space-y-3">
                    {[
                        { id: 'upi', label: 'UPI / QR Code', icon: <QrCode size={18} /> },
                        { id: 'card', label: 'Credit / Debit Card', icon: <CreditCard size={18} /> },
                        { id: 'net', label: 'Netbanking', icon: <Landmark size={18} /> }
                    ].map(method => (
                        <div 
                            key={method.id}
                            onClick={() => setSelectedMethod(method.id)}
                            className={`p-4 border rounded-xl flex items-center justify-between cursor-pointer transition-all ${selectedMethod === method.id ? 'border-brand-500 bg-brand-50 shadow-sm' : 'border-slate-100 hover:border-slate-300'}`}
                        >
                            <div className="flex items-center gap-3">
                                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${selectedMethod === method.id ? 'bg-brand-100 text-brand-600' : 'bg-slate-100 text-slate-500'}`}>
                                    {method.icon}
                                </div>
                                <span className="font-semibold text-slate-700">{method.label}</span>
                            </div>
                            <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${selectedMethod === method.id ? 'border-brand-600 bg-brand-600' : 'border-slate-300'}`}>
                                {selectedMethod === method.id && <div className="w-2 h-2 rounded-full bg-white"></div>}
                            </div>
                        </div>
                    ))}
                </div>

                <button 
                    onClick={completeTransaction}
                    disabled={processing}
                    className="w-full py-4 bg-brand-600 hover:bg-brand-700 text-white font-bold rounded-xl shadow-lg disabled:opacity-50 transition-all flex items-center justify-center gap-2 mt-4"
                >
                    {processing ? <Loader2 size={20} className="animate-spin" /> : <ShieldCheck size={20} />}
                    Pay ₹{parseFloat(amount).toLocaleString()} Securely
                </button>
            </div>
        )}
      </div>
    </div>
  );
};
