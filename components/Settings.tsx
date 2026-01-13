
import { Save, Printer, FileText, Upload, Shield, Globe, Bell, Truck, Zap, ChevronRight, Smartphone, Mail, MessageSquare, CheckCircle2, Search, MapPin, Clock, AlertTriangle, RefreshCcw, Heart, Package, Info, Scan, ClipboardList, Barcode, Hash } from 'lucide-react';
import { AppMode, Order } from '../types';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { generateGridLayoutHtml, commonCSS, generateInvoiceHtml, generateInsuranceLabelHtml } from '../utils/documentGenerator';
import React, { useRef, useState } from 'react';

interface SettingsProps {
  currentMode: AppMode;
  setMode?: (mode: AppMode) => void;
}

export const Settings: React.FC<SettingsProps> = ({ currentMode, setMode }) => {
  const [labelSettings, setLabelSettings] = useLocalStorage('vas_settings_label_config', {
    logo: true, customerPhone: true, dimensions: true, weight: true, paymentType: true, invoiceNumber: true, invoiceDate: true, companyName: true, companyGSTIN: true, pickupAddress: true, companyPhone: true, sku: true, productName: true, shippingCharges: true, insuranceCharge: true, prepaidAmount: true, codAmount: true, message: true
  });
  const [labelLayout, setLabelLayout] = useLocalStorage('vas_label_layout', 'Standard');
  const [brandLogo, setBrandLogo] = useLocalStorage<string | null>('vas_settings_brand_logo', null);

  const [invoiceSettings, setInvoiceSettings] = useLocalStorage('vas_settings_invoice_config', {
    logo: true, signature: true, companyName: true, companyPhone: true, companyGSTIN: true, paymentType: true, message: true
  });
  const [invoiceTitle, setInvoiceTitle] = useLocalStorage('vas_settings_invoice_title', 'TAX INVOICE');
  const [invoiceSig, setInvoiceSig] = useLocalStorage<string | null>('vas_settings_invoice_sig', null);

  // Notification Settings
  const [notifSettings, setNotifSettings] = useLocalStorage('vas_settings_notifications', {
    whatsapp: true, sms: false, email: true, orderPlaced: true, shipped: true, outForDelivery: true, delivered: true
  });

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setBrandLogo(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleSaveAll = () => {
    const btn = document.getElementById('global-save-settings');
    if (btn) {
      const originalText = btn.innerHTML;
      btn.innerHTML = 'Saving...';
      setTimeout(() => { 
        btn.innerHTML = 'Saved Successfully'; 
        setTimeout(() => btn.innerHTML = originalText, 2000); 
      }, 1000);
    }
  };

  const previewOrder: Order = {
    id: 'ORD-77201', date: '30 Nov 2025', type: 'Custom', category: 'Domestic', tag: 'Delhivery', awb: 'DEL88291044', status: 'Ready to Ship',
    products: [{ name: 'Cosmetic Premium Kit', sku: 'CPK-992', qty: 1, price: 12500 }], package: { dimensions: '15x15x10 CM', deadWt: '0.8kg', volumetric: '0.45kg' },
    payment: { invoice: '12500', method: 'Prepaid', status: 'Paid' }, 
    // Fix: Added country to shipping
    shipping: { name: 'Kunal Singh', phone: '9812345678', address: 'Plot 42, Model Town, Delhi', zip: '110027', country: 'India' }, pickup: 'VAS MAIN HUB',
    isInsured: true, insuranceFee: 250
  };

  // 1. Label Settings View
  if (currentMode === AppMode.SETTINGS_LABEL) {
    // Fix: generateGridLayoutHtml now correctly accepts the 4th argument in documentGenerator
    const html = generateGridLayoutHtml(previewOrder, labelSettings, brandLogo, labelLayout);
    const srcDoc = `<!DOCTYPE html><html><head><style>${commonCSS}</style></head><body><div style="display:flex; justify-content:center; padding:20px;">${html}</div></body></html>`;
    return (
      <div className="flex flex-col h-full bg-[#0B1020] p-8 animate-in fade-in duration-500">
        <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl font-black text-white uppercase flex items-center gap-3"><Printer size={28} className="text-brand-400" /> Label Setup</h2>
            <button id="global-save-settings" onClick={handleSaveAll} className="bg-brand-600 hover:bg-brand-700 text-white px-8 py-3 rounded-2xl text-xs font-black uppercase shadow-xl transition-all active:scale-95"><Save size={18} /> Save Config</button>
        </div>
        <div className="flex gap-10 h-full overflow-hidden">
            <div className="w-[26rem] space-y-6 overflow-y-auto custom-scrollbar pr-4">
                {/* Important Info Card (Hindi Refined) */}
                <div className="bg-amber-500/5 border-2 border-amber-500/30 p-8 rounded-[2.5rem] shadow-2xl relative overflow-hidden">
                   <div className="absolute top-0 right-0 p-4 opacity-10 pointer-events-none">
                      <AlertTriangle size={80} />
                   </div>
                   
                   <div className="flex items-center gap-3 text-amber-400 font-black uppercase text-xs tracking-widest mb-4">
                      <div className="p-2 bg-amber-500/10 rounded-lg"><AlertTriangle size={18} /></div>
                      महत्वपूर्ण सूचना
                   </div>
                   
                   <div className="space-y-4 relative z-10">
                      <div className="flex gap-3">
                         <div className="mt-1"><CheckCircle2 size={14} className="text-amber-500" /></div>
                         <p className="text-[11px] text-slate-200 font-bold leading-relaxed">
                           हर लेबल के लिए एक यूनिक AWB और एक यूनिक बारकोड जनरेट किया जाएगा।
                         </p>
                      </div>
                      <div className="flex gap-3">
                         <div className="mt-1"><CheckCircle2 size={14} className="text-amber-500" /></div>
                         <p className="text-[11px] text-slate-200 font-bold leading-relaxed">
                           एक बार जनरेट होने के बाद, बारकोड अपरिवर्तनीय (Non-Editable) रहेगा।
                         </p>
                      </div>
                      
                      <div className="pt-6 mt-2 border-t border-amber-500/20">
                        <div className="text-[9px] font-black text-amber-500/70 uppercase tracking-[0.2em] mb-4">यह फीचर निम्न स्थानों पर लागू रहेगा:</div>
                        <div className="grid grid-cols-2 gap-3">
                           {[
                             { label: 'शिपिंग लेबल', icon: <Printer size={12}/> },
                             { label: 'मैनिफेस्ट', icon: <FileText size={12}/> },
                             { label: 'पिकअप शीट', icon: <ClipboardList size={12}/> },
                             { label: 'हब स्कैनिंग', icon: <Scan size={12}/> },
                             { label: 'डिलीवरी स्कैनिंग', icon: <Truck size={12}/> },
                             { label: 'AWB बारकोड', icon: <Barcode size={12}/> },
                             { label: 'AWB नंबर', icon: <Hash size={12}/> }
                           ].map((item, i) => (
                             <div key={i} className="flex items-center gap-3 bg-[#0B1020]/50 px-4 py-3 rounded-xl border border-amber-500/10 hover:border-amber-500/30 transition-colors group/item">
                                <span className="text-amber-500 group-hover/item:scale-110 transition-transform">{item.icon}</span>
                                <span className="text-[9px] font-black text-slate-400 uppercase group-hover/item:text-slate-100 transition-colors">{item.label}</span>
                             </div>
                           ))}
                        </div>
                      </div>
                   </div>
                </div>

                <div onClick={() => fileInputRef.current?.click()} className="w-full h-32 border-2 border-dashed border-[#374151] rounded-[2rem] flex flex-col items-center justify-center text-center cursor-pointer hover:border-brand-500 transition-colors bg-[#111827]/50">
                    <Upload size={24} className="text-slate-600 mb-2" />
                    <div className="text-[10px] font-black text-slate-500 uppercase">Upload Brand Logo</div>
                    <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleLogoUpload} />
                </div>

                <div className="space-y-3 bg-[#111827] p-8 rounded-[2.5rem] border border-[#1F2937] shadow-xl">
                    <div className="text-[10px] font-black text-slate-400 uppercase mb-4 tracking-widest">Visibility Toggles</div>
                    <div className="grid grid-cols-1 gap-1">
                      {Object.keys(labelSettings).map(k => (
                          <label key={k} className="flex items-center justify-between group cursor-pointer py-2 px-3 hover:bg-[#0B1020] rounded-xl transition-colors">
                              <span className="text-[11px] font-bold text-slate-500 group-hover:text-slate-300 capitalize">{k.replace(/([A-Z])/g, ' $1').trim()}</span>
                              <input type="checkbox" checked={(labelSettings as any)[k]} onChange={() => setLabelSettings({ ...labelSettings, [k]: !(labelSettings as any)[k] })} className="w-4 h-4 rounded border-[#374151] bg-[#0B1020] text-brand-600" />
                          </label>
                      ))}
                    </div>
                </div>
            </div>
            <div className="flex-1 bg-[#111827] rounded-[3rem] overflow-hidden shadow-2xl border-4 border-[#1F2937]">
                <iframe title="Label Preview" srcDoc={srcDoc} className="w-full h-full border-none" />
            </div>
        </div>
      </div>
    );
  }

  // 2. Invoice Settings View
  if (currentMode === AppMode.SETTINGS_INVOICE) {
    const html = generateInvoiceHtml(previewOrder, invoiceSettings, brandLogo, invoiceSig, { title: invoiceTitle });
    const srcDoc = `<!DOCTYPE html><html><head><style>${commonCSS}</style></head><body><div style="background:#f1f5f9; padding: 40px 0;">${html}</div></body></html>`;
    return (
      <div className="flex flex-col h-full bg-[#0B1020] p-8 animate-in fade-in duration-500">
        <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl font-black text-white uppercase flex items-center gap-3"><FileText size={28} className="text-emerald-400" /> Invoice Branding</h2>
            <button id="global-save-settings" onClick={handleSaveAll} className="bg-brand-600 hover:bg-brand-700 text-white px-8 py-3 rounded-2xl text-xs font-black uppercase shadow-xl transition-all active:scale-95"><Save size={18} /> Save Invoice</button>
        </div>
        <div className="flex gap-10 h-full overflow-hidden">
            <div className="w-80 space-y-8 overflow-y-auto custom-scrollbar pr-4">
                <div className="space-y-4">
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Document Header Title</label>
                    <input type="text" value={invoiceTitle} onChange={(e)=>setInvoiceTitle(e.target.value)} className="w-full bg-[#111827] border border-[#374151] rounded-2xl px-6 py-4 text-white focus:border-brand-500 outline-none shadow-inner font-bold" />
                </div>
                <div className="space-y-3 bg-[#111827] p-8 rounded-[2.5rem] border border-[#1F2937] shadow-xl">
                    <div className="text-[10px] font-black text-slate-400 uppercase mb-4 tracking-widest">Active Components</div>
                    {Object.keys(invoiceSettings).map(k => (
                        <label key={k} className="flex items-center justify-between group cursor-pointer py-1">
                            <span className="text-[11px] font-bold text-slate-500 group-hover:text-slate-300 capitalize">{k.replace(/([A-Z])/g, ' $1').trim()}</span>
                            <input type="checkbox" checked={(invoiceSettings as any)[k]} onChange={() => setInvoiceSettings({ ...invoiceSettings, [k]: !(invoiceSettings as any)[k] })} className="w-4 h-4 rounded border-[#374151] bg-[#0B1020] text-emerald-600" />
                        </label>
                    ))}
                </div>
            </div>
            <div className="flex-1 bg-white rounded-[3rem] overflow-hidden shadow-2xl border-4 border-[#1F2937]">
                <iframe title="Invoice Preview" srcDoc={srcDoc} className="w-full h-full border-none" />
            </div>
        </div>
      </div>
    );
  }

  // 3. Insurance Label View
  if (currentMode === AppMode.SETTINGS_INSURANCE_LABEL) {
    const html = generateInsuranceLabelHtml(previewOrder, brandLogo);
    const srcDoc = `<!DOCTYPE html><html><head><style>${commonCSS}</style></head><body><div style="background:#f1f5f9; padding: 40px; min-height:100vh; display:flex; justify-content:center;">${html}</div></body></html>`;
    return (
      <div className="flex flex-col h-full bg-[#0B1020] p-8 animate-in fade-in duration-500">
        <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl font-black text-white uppercase flex items-center gap-3"><Shield size={28} className="text-indigo-400" /> Insurance Proof</h2>
            <button id="global-save-settings" onClick={handleSaveAll} className="bg-brand-600 hover:bg-brand-700 text-white px-8 py-3 rounded-2xl text-xs font-black uppercase shadow-xl transition-all active:scale-95"><Save size={18} /> Update Proof</button>
        </div>
        <div className="flex gap-10 h-full overflow-hidden">
            <div className="w-80 space-y-6">
                <div className="bg-brand-900/10 border border-brand-500/20 p-8 rounded-[2.5rem] shadow-xl">
                   <h4 className="text-sm font-black text-white uppercase tracking-tight mb-2">Policy Preview</h4>
                   <p className="text-[10px] text-slate-500 font-bold uppercase leading-relaxed">This document is auto-generated for shipments with active insurance coverage. It serves as a transit protection certificate.</p>
                </div>
            </div>
            <div className="flex-1 bg-[#111827] rounded-[3rem] overflow-hidden shadow-2xl border-4 border-[#1F2937]">
                <iframe title="Insurance Preview" srcDoc={srcDoc} className="w-full h-full border-none" />
            </div>
        </div>
      </div>
    );
  }

  // 4. Branded Tracking Page View
  if (currentMode === AppMode.SETTINGS_BRANDED_TRACKING) {
    return (
      <div className="flex flex-col h-full bg-[#0B1020] p-8 animate-in fade-in duration-500">
        <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl font-black text-white uppercase flex items-center gap-3"><Globe size={28} className="text-brand-400" /> Branded Tracking</h2>
            <button id="global-save-settings" onClick={handleSaveAll} className="bg-brand-600 hover:bg-brand-700 text-white px-8 py-3 rounded-2xl text-xs font-black uppercase shadow-xl transition-all active:scale-95"><Save size={18} /> Save Branding</button>
        </div>
        <div className="flex gap-10 h-full overflow-hidden">
            <div className="w-96 space-y-6 overflow-y-auto custom-scrollbar pr-4">
                <div className="bg-[#111827] p-8 rounded-[2.5rem] border border-[#1F2937] space-y-6 shadow-xl">
                    <div>
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 block">Subdomain Engine</label>
                        <div className="flex items-center bg-[#0B1020] border border-[#374151] rounded-xl px-4 py-3 overflow-hidden group focus-within:border-brand-500">
                            <input type="text" defaultValue="kds-logistics" className="bg-transparent border-none outline-none text-xs font-bold text-white flex-1" />
                            <span className="text-[10px] text-slate-600 font-black">.trackvas.in</span>
                        </div>
                    </div>
                    <div className="h-px bg-[#1F2937]"></div>
                    <div className="space-y-3">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block">Active Components</label>
                        {['Show Courier Name', 'Show Product Details', 'Show Customer Feedback', 'Show Maps View', 'Show Insurance Badge'].map(k => (
                            <label key={k} className="flex items-center justify-between group cursor-pointer py-1">
                                <span className="text-[11px] font-bold text-slate-500 group-hover:text-slate-300">{k}</span>
                                <input type="checkbox" defaultChecked className="w-4 h-4 rounded border-[#374151] bg-[#0B1020] text-brand-600" />
                            </label>
                        ))}
                    </div>
                </div>
                <div className="p-8 bg-brand-900/10 border border-brand-500/20 rounded-[2rem] shadow-xl">
                   <p className="text-[10px] text-slate-500 font-bold uppercase leading-relaxed text-center">Custom tracking pages increase customer trust by 45%. All text is set to Hindi by default for your region.</p>
                </div>
            </div>

            {/* PREVIEW CONTAINER */}
            <div className="flex-1 bg-[#f8fafc] rounded-[3rem] overflow-y-auto custom-scrollbar shadow-[inset_0_0_100px_rgba(0,0,0,0.05)] border-4 border-[#1F2937] p-10">
                <div className="max-w-2xl mx-auto space-y-10">
                    {/* Header */}
                    <div className="flex flex-col items-center text-center space-y-4">
                        {brandLogo ? <img src={brandLogo} className="max-h-16" /> : <div className="p-4 bg-brand-600 rounded-2xl text-white font-black">VAS</div>}
                        <h1 className="text-3xl font-black text-slate-800">ट्रैक योर ऑर्डर</h1>
                        <p className="text-slate-500 font-bold">अपने ऑर्डर की स्थिति तुरंत जानें</p>
                    </div>

                    {/* Search Sim */}
                    <div className="bg-white p-6 rounded-[2rem] shadow-xl border border-slate-100 space-y-4">
                        <p className="text-[11px] text-slate-500 font-bold text-center">अपना AWB नंबर / ऑर्डर ID दर्ज करें और अपने पार्सल की रियल-TIME स्थिति देखें।</p>
                        <div className="relative flex items-center">
                            <input readOnly value="DEL88291044" className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-6 py-4 text-slate-700 font-bold outline-none" />
                            <button className="absolute right-2 p-3 bg-brand-600 rounded-xl text-white"><Search size={18}/></button>
                        </div>
                    </div>

                    {/* Shipment Details */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="bg-white p-8 rounded-[2.5rem] shadow-lg border border-slate-100 space-y-4 relative overflow-hidden">
                            <div className="flex items-center gap-3 text-brand-600 font-black uppercase text-[10px] tracking-widest"><Package size={16}/> शिपमेंट विवरण</div>
                            <div className="space-y-3">
                                <div className="flex justify-between text-xs font-bold text-slate-400"><span>ऑर्डर ID:</span> <span className="text-slate-800">ORD-77201</span></div>
                                <div className="flex justify-between text-xs font-bold text-slate-400"><span>AWB नंबर:</span> <span className="text-slate-800">DEL88291044</span></div>
                                <div className="flex justify-between text-xs font-bold text-slate-400"><span>कूरियर पार्टनर:</span> <span className="text-brand-600">DELHIVERY</span></div>
                                <div className="flex justify-between text-xs font-bold text-slate-400"><span>बुकिंग तिथि:</span> <span className="text-slate-800">30 Nov 2025</span></div>
                                <div className="flex justify-between text-xs font-bold text-slate-400"><span>अनुमानित डिलीवरी:</span> <span className="text-emerald-600 font-black">04 Dec 2025</span></div>
                            </div>
                        </div>

                        <div className="bg-[#1e293b] p-8 rounded-[2.5rem] shadow-2xl text-white space-y-4 relative overflow-hidden">
                            <div className="flex items-center gap-3 text-brand-400 font-black uppercase text-[10px] tracking-widest"><Truck size={16}/> वर्तमान स्थिति</div>
                            <div className="text-2xl font-black text-emerald-400 uppercase tracking-tight">ट्रांजिट में</div>
                            <div className="space-y-3 pt-2">
                                <div className="flex items-start gap-3"><MapPin size={14} className="text-slate-400 mt-0.5" /> <div className="text-[10px] font-bold text-slate-300">अंतिम अपडेट: <span className="text-white">Gurugram Hub (Haryana)</span></div></div>
                                <div className="flex items-start gap-3"><Clock size={14} className="text-slate-400 mt-0.5" /> <div className="text-[10px] font-bold text-slate-300">अपडेट समय: <span className="text-white">Today, 04:12 PM</span></div></div>
                            </div>
                        </div>
                    </div>

                    {/* Stepper Movement */}
                    <div className="bg-white p-10 rounded-[3rem] shadow-lg border border-slate-100">
                        <div className="text-center space-y-2 mb-10">
                            <h3 className="text-xl font-black text-slate-800">🗺️ शिपमेंट मूवमेंट</h3>
                            <p className="text-[11px] text-slate-400 font-medium">आपका पार्सल सुरक्षित रूप से आगे बढ़ रहा है।</p>
                        </div>
                        <div className="relative pl-10 space-y-8 before:absolute before:left-3.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-100">
                            {[
                                { label: 'बुकिंग कन्फर्म', done: true },
                                { label: 'पिकअप हो गया', done: true },
                                { label: 'हब पर पहुँचा', done: true },
                                { label: 'ट्रांजिट में', active: true },
                                { label: 'डिलीवरी के लिए रवाना', pending: true },
                                { label: 'डिलीवर हो गया / डिलीवरी असफल', pending: true }
                            ].map((step, idx) => (
                                <div key={idx} className="relative flex items-center gap-6">
                                    <div className={`absolute -left-[31px] w-5 h-5 rounded-full border-4 ${step.done ? 'bg-emerald-500 border-emerald-100' : step.active ? 'bg-brand-600 border-brand-100 animate-pulse' : 'bg-slate-200 border-white'}`}></div>
                                    <span className={`text-[11px] font-black uppercase tracking-tight ${step.active ? 'text-brand-600' : step.done ? 'text-slate-800' : 'text-slate-400'}`}>{step.label}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Insurance & Support */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pb-20">
                        <div className="bg-indigo-50 border border-indigo-100 p-8 rounded-[2.5rem] space-y-4">
                            <div className="flex items-center gap-3 text-indigo-600 font-black uppercase text-[10px] tracking-widest"><Shield size={16}/> सुरक्षित और बीमित शिपमेंट</div>
                            <div className="space-y-2">
                                <div className="flex justify-between text-xs font-bold text-indigo-400"><span>बीमित मूल्य:</span> <span className="text-indigo-900">₹12,500</span></div>
                                <div className="flex justify-between text-xs font-bold text-indigo-400"><span>घोषित मूल्य:</span> <span className="text-indigo-900">₹12,500</span></div>
                            </div>
                        </div>
                        <div className="bg-amber-50 border border-amber-100 p-8 rounded-[2.5rem] space-y-4">
                            <div className="flex items-center gap-3 text-amber-600 font-black uppercase text-[10px] tracking-widest"><AlertTriangle size={16}/> जरूरी सूचना (NDR / देरी)</div>
                            <button className="w-full py-3 bg-white border border-amber-200 text-amber-700 text-[10px] font-black uppercase rounded-xl hover:bg-amber-100 transition-colors shadow-sm">डिलीवरी निर्देश अपडेट करें</button>
                            <p className="text-[9px] text-amber-500 font-bold text-center">📞 संपर्क नंबर: +91 97176 24831</p>
                        </div>
                    </div>

                    {/* Final Footer */}
                    <div className="text-center space-y-4 pb-20">
                        <div className="flex justify-center gap-4">
                            <div className="p-3 bg-white rounded-full shadow-sm"><Mail size={16} className="text-slate-400"/></div>
                            <div className="p-3 bg-white rounded-full shadow-sm"><Smartphone size={16} className="text-slate-400"/></div>
                        </div>
                        <p className="text-slate-400 font-bold text-[11px]">❤️ धन्यवाद। <span className="text-brand-600">VAS LOGISTICS</span> पर भरोसा करने के लिए।</p>
                        <p className="text-slate-300 font-black text-[9px] uppercase tracking-[0.2em]">Powered by VAS Sync Engine v2.5</p>
                    </div>
                </div>
            </div>
        </div>
      </div>
    );
  }

  // 5. Shipping Notification View
  if (currentMode === AppMode.SETTINGS_SHIPPING_NOTIFICATION) {
    return (
      <div className="flex flex-col h-full bg-[#0B1020] p-8 animate-in fade-in duration-500">
        <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl font-black text-white uppercase flex items-center gap-3"><Bell size={28} className="text-amber-400" /> Notifications</h2>
            <button id="global-save-settings" onClick={handleSaveAll} className="bg-brand-600 hover:bg-brand-700 text-white px-8 py-3 rounded-2xl text-xs font-black uppercase shadow-xl transition-all active:scale-95"><Save size={18} /> Save Preferences</button>
        </div>
        
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8 overflow-y-auto custom-scrollbar pb-20">
            {/* Channel Toggles */}
            <div className="space-y-6">
                <div className="bg-[#111827] p-8 rounded-[2.5rem] border border-[#1F2937] shadow-xl">
                    <div className="text-[10px] font-black text-slate-400 uppercase mb-6 tracking-widest">Active Channels</div>
                    <div className="space-y-4">
                        {[
                            { id: 'whatsapp', label: 'WhatsApp Messenger', icon: <MessageSquare size={18} />, color: 'text-emerald-400' },
                            { id: 'sms', label: 'SMS Gateway', icon: <Smartphone size={18} />, color: 'text-blue-400' },
                            { id: 'email', label: 'Email Alerts', icon: <Mail size={18} />, color: 'text-purple-400' }
                        ].map(ch => (
                            <div key={ch.id} className="flex items-center justify-between p-4 bg-[#0B1020] rounded-2xl border border-[#1F2937]">
                                <div className="flex items-center gap-3">
                                    <div className={ch.color}>{ch.icon}</div>
                                    <span className="text-xs font-bold text-gray-200">{ch.label}</span>
                                </div>
                                <button 
                                    onClick={() => setNotifSettings({...notifSettings, [ch.id]: !notifSettings[ch.id as keyof typeof notifSettings]})}
                                    className={`w-10 h-5 rounded-full relative transition-all ${notifSettings[ch.id as keyof typeof notifSettings] ? 'bg-brand-600' : 'bg-slate-700'}`}
                                >
                                    <div className={`absolute top-0.5 w-4 h-4 bg-white rounded-full transition-all ${notifSettings[ch.id as keyof typeof notifSettings] ? 'right-0.5' : 'left-0.5'}`}></div>
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Template Previews */}
            <div className="xl:col-span-2 space-y-6">
                <div className="bg-[#111827] p-8 rounded-[2.5rem] border border-[#1F2937] shadow-xl">
                    <div className="text-[10px] font-black text-slate-400 uppercase mb-6 tracking-widest">Event Templates (Hindi)</div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {[
                            { title: 'Order Dispatched', body: 'नमस्ते {{Customer_Name}}, आपका ऑर्डर {{Order_ID}} सफलतापूर्वक शिप कर दिया गया है।\n\nकूरियर: {{Courier_Name}}\nAWB: {{AWB_No}}\nलिंक: {{Tracking_Link}}' },
                            { title: 'Out For Delivery', body: 'नमस्ते {{Customer_Name}}, आपका पार्सल (AWB: {{AWB_No}}) आज डिलीवरी के लिए निकल चुका है। कृपया डिलीवरी के समय उपलब्ध रहें।' },
                            { title: 'Delivered', body: 'नमस्ते {{Customer_Name}}, आपका ऑर्डर {{Order_ID}} सफलतापूर्वक डिलीवर कर दिया गया है। हम पर भरोसा करने के लिए धन्यवाद।' },
                            { title: 'Delivery Delay', body: 'नमस्ते {{Customer_Name}}, आपके पार्सल (AWB: {{AWB_No}}) की डिलीवरी में तकनीकी कारणों से थोड़ी देरी हो रही है। असुविधा के लिए खेद है।' },
                            { title: 'NDR / Attempt Fail', body: 'नमस्ते {{Customer_Name}}, आपके पार्सल (AWB: {{AWB_No}}) की डिलीवरी प्रयास असफल रहा। कारण: {{NDR_Reason}}। निर्देश अपडेट करें: {{Tracking_Link}}' },
                            { title: 'RTO / Return', body: 'नमस्ते {{Customer_Name}}, आपका पार्सल (AWB: {{AWB_No}}) प्रेषक को वापस भेजा जा रहा है। सहायता: {{Support_Number}}' },
                            { title: 'Insurance Protected', body: 'नमस्ते {{Customer_Name}}, आपका बीमित पार्सल (AWB: {{AWB_No}}) सुरक्षित रूप से ट्रांजिट में है। घोषित मूल्य: ₹{{Invoice_Value}}। ट्रैक करें: {{Tracking_Link}}' }
                        ].map((t, idx) => (
                            <div key={idx} className="p-6 bg-[#0B1020] rounded-3xl border border-[#1F2937] group hover:border-brand-500/30 transition-all flex flex-col">
                                <div className="flex justify-between items-center mb-3">
                                    <span className="text-[10px] font-black text-brand-400 uppercase tracking-tight">{t.title}</span>
                                    <CheckCircle2 size={14} className="text-emerald-500" />
                                </div>
                                <p className="text-[11px] text-slate-300 font-medium leading-relaxed whitespace-pre-line">"{t.body}"</p>
                                <div className="mt-auto pt-4 flex gap-2">
                                   <div className="px-2 py-1 bg-brand-900/20 rounded text-[8px] font-black text-brand-400 uppercase">WhatsApp</div>
                                   {idx === 6 && <div className="px-2 py-1 bg-indigo-900/20 rounded text-[8px] font-black text-indigo-400 uppercase">Insured Only</div>}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
      </div>
    );
  }

  // Placeholder for others
  return (
    <div className="h-full flex items-center justify-center bg-[#0B1020] p-20">
        <div className="text-center space-y-6">
            <Zap size={64} className="mx-auto text-slate-800 animate-pulse" />
            <h3 className="text-2xl font-black text-slate-700 uppercase tracking-[0.4em]">Section Reverted</h3>
            <p className="text-slate-600 text-[10px] font-black uppercase tracking-[0.2em]">The selected configuration module is currently being refreshed.</p>
        </div>
    </div>
  );
};