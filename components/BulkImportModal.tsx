
import React, { useRef, useState } from 'react';
import { X, Upload, FileSpreadsheet, Download, Loader2, AlertCircle } from 'lucide-react';
import { Order } from '../types';

interface BulkImportModalProps {
  isOpen: boolean;
  onClose: () => void;
  onImport: (orders: Order[]) => void;
}

export const BulkImportModal: React.FC<BulkImportModalProps> = ({ isOpen, onClose, onImport }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file) return;

      setIsProcessing(true);
      setError(null);

      const reader = new FileReader();
      reader.onload = (event) => {
          try {
              const text = event.target?.result as string;
              const rows = text.split('\n').filter(row => row.trim().length > 0);
              
              if (rows.length < 2) throw new Error("File is empty or invalid format.");

              const importedOrders: Order[] = [];
              // Skip header row
              for (let i = 1; i < rows.length; i++) {
                  const cols = rows[i].split(',').map(c => c.trim());
                  if (cols.length < 5) continue;

                  const order: Order = {
                      id: `IMP-${cols[0] || Date.now() + i}`,
                      date: new Date().toLocaleString(),
                      type: 'Bulk',
                      category: 'Domestic',
                      tag: 'Imported',
                      status: 'New',
                      products: [{ name: cols[8] || 'Product', sku: cols[9] || 'SKU', qty: 1, price: parseFloat(cols[11]) || 0 }],
                      package: { dimensions: '10x10x10', deadWt: '0.5kg', volumetric: '0.2kg' },
                      // Fix: Cast method to correct type and added country to shipping
                      payment: { invoice: `₹ ${cols[11] || 0}`, method: (cols[2] as 'Prepaid' | 'COD') || 'Prepaid', status: 'Unpaid' },
                      shipping: { name: cols[3], phone: cols[5], address: cols[6], zip: cols[7], country: 'India' },
                      pickup: 'VAS MAIN HUB'
                  };
                  importedOrders.push(order);
              }

              setTimeout(() => {
                  onImport(importedOrders);
                  setIsProcessing(false);
              }, 1500);

          } catch (err: any) {
              setError(err.message);
              setIsProcessing(false);
          }
      };
      reader.readAsText(file);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
      <div className="bg-[#111827] rounded-3xl w-full max-w-lg shadow-2xl border border-[#1F2937] overflow-hidden">
        <div className="px-8 py-6 border-b border-[#374151] flex justify-between items-center bg-[#0B1020]">
          <h3 className="text-xl font-black text-white uppercase tracking-tighter">Bulk Order Import</h3>
          <button onClick={onClose} className="text-slate-400 hover:text-white"><X size={24} /></button>
        </div>

        <div className="p-8 space-y-6">
           <div 
              onClick={() => !isProcessing && fileInputRef.current?.click()}
              className={`border-2 border-dashed rounded-[2rem] p-12 flex flex-col items-center justify-center text-center cursor-pointer transition-all ${isProcessing ? 'border-brand-500 bg-brand-900/10' : 'border-[#374151] hover:border-brand-500'}`}
           >
               <input type="file" ref={fileInputRef} className="hidden" accept=".csv" onChange={handleFileUpload} />
               {isProcessing ? (
                   <Loader2 size={48} className="text-brand-500 animate-spin" />
               ) : (
                   <>
                       <Upload size={48} className="text-slate-500 mb-4" />
                       <h4 className="text-white font-bold">Click to Upload CSV</h4>
                       <p className="text-xs text-slate-500 mt-2">Download our sample format before uploading.</p>
                   </>
               )}
           </div>
           {error && <div className="p-4 bg-red-900/20 text-red-400 rounded-xl flex items-center gap-2 text-xs font-bold"><AlertCircle size={16} /> {error}</div>}
        </div>
        <div className="px-8 py-6 bg-[#0B1020] border-t border-[#374151] flex justify-end">
            <button onClick={onClose} className="px-6 py-2 text-slate-500 font-bold uppercase text-xs">Cancel</button>
        </div>
      </div>
    </div>
  );
};