
import React, { useState, useMemo } from 'react';
import { 
  Tags, Plane, Truck, CheckCircle, MapPin, Scale, ChevronDown, 
  Activity, Zap, Hash, Power, AlertCircle
} from 'lucide-react';
import { useLocalStorage } from '../hooks/useLocalStorage';

const COURIER_DATA: Record<string, any> = {
  'DELHIVERY': {
    id: 'c3',
    name: 'Delhivery Express',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/b/b3/Delhivery_Logo.png',
    airDesc: 'EXPRESS AIR • 500 GM BASE',
    surfaceDesc: 'ECONOMY SURFACE • 1 KG BASE',
    airRates: [
      { slab: 'BASE 500G', zones: ['₹45', '₹60', '₹65', '₹80', '₹110'] },
      { slab: 'ADDL 500G', zones: ['₹20', '₹25', '₹30', '₹35', '₹45'] },
    ]
  },
  'BLUEDART': {
    id: 'c1',
    name: 'BlueDart Apex',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/4/4b/Blue_Dart_Logo.svg',
    airDesc: 'PREMIUM AIR NETWORK • 500 GM',
    surfaceDesc: 'SURFACE NOT AVAILABLE',
    airRates: [
      { slab: 'BASE 500G', zones: ['₹125', '₹140', '₹165', '₹190', '₹250'] },
      { slab: 'ADDL 500G', zones: ['₹45', '₹55', '₹65', '₹75', '₹95'] },
    ]
  },
  'DTDC': {
    id: 'c5',
    name: 'DTDC Premium',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/e/e0/DTDC_Logo.png',
    airDesc: 'V-SERIES / E-SERIES AIR',
    surfaceDesc: 'D-SERIES SURFACE',
    airRates: [
      { slab: 'BASE 500G', zones: ['₹62', '₹78', '₹88', '₹110', '₹145'] },
      { slab: 'ADDL 500G', zones: ['₹28', '₹38', '₹45', '₹55', '₹75'] },
    ]
  }
};

export const RateCard: React.FC = () => {
  const [selectedCourier, setSelectedCourier] = useState('DELHIVERY');
  const courier = COURIER_DATA[selectedCourier];

  return (
    <div className="p-12 bg-[#060810] min-h-full font-sans text-slate-300">
      <div className="mb-12 flex justify-between items-center">
        <div>
          <h2 className="text-4xl font-black text-white uppercase tracking-tighter flex items-center gap-4">
            <div className="p-3 bg-brand-900/30 text-brand-400 rounded-2xl border border-brand-500/20 shadow-xl">
               <Tags size={32} />
            </div>
            Carrier Rate Matrix
          </h2>
          <p className="text-slate-500 mt-2 text-xs font-black uppercase tracking-[0.4em]">Official Freight & Slab Configuration</p>
        </div>
        <select 
            value={selectedCourier}
            onChange={(e) => setSelectedCourier(e.target.value)}
            className="px-8 py-4 bg-[#0B1020] border border-white/5 rounded-2xl text-xs font-black text-brand-400 uppercase tracking-widest outline-none shadow-2xl focus:border-brand-500"
        >
            <option value="DELHIVERY">DELHIVERY EXPRESS</option>
            <option value="BLUEDART">BLUEDART APEX</option>
            <option value="DTDC">DTDC PREMIUM</option>
        </select>
      </div>

      <div className="bg-[#0B1020] rounded-[3.5rem] border border-white/5 p-12 shadow-2xl mb-12 relative overflow-hidden group">
         <div className="absolute top-0 right-0 p-12 opacity-5 pointer-events-none group-hover:opacity-10 transition-opacity"><Truck size={200} /></div>
         <div className="flex flex-col md:flex-row items-center gap-12 relative z-10">
            <div className="w-40 h-24 bg-white rounded-3xl p-6 flex items-center justify-center shadow-2xl shadow-black/50">
                <img src={courier.logo} className="max-w-full max-h-full object-contain" />
            </div>
            <div className="flex-1">
               <h3 className="text-3xl font-black text-white uppercase tracking-tight">{courier.name}</h3>
               <div className="flex gap-6 mt-3">
                  <div className="flex items-center gap-2 text-[10px] font-black text-brand-400 uppercase tracking-widest">
                     <Zap size={14} fill="currentColor"/> {courier.airDesc}
                  </div>
                  <div className="flex items-center gap-2 text-[10px] font-black text-slate-500 uppercase tracking-widest">
                     <Hash size={14}/> PIN Coverage: 27,000+
                  </div>
               </div>
            </div>
            <button className="px-10 py-5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-[1.5rem] text-[10px] font-black uppercase tracking-[0.2em] shadow-2xl transition-all">
                Channel Active
            </button>
         </div>

         <div className="mt-12 overflow-x-auto">
            <table className="w-full text-left">
               <thead className="bg-black/20 text-slate-500 font-black text-[10px] uppercase tracking-[0.3em] border-b border-white/5">
                  <tr>
                     <th className="px-10 py-6">Weight Slab</th>
                     <th className="px-6 py-6 text-center">Zone A</th>
                     <th className="px-6 py-6 text-center">Zone B</th>
                     <th className="px-6 py-6 text-center">Zone C</th>
                     <th className="px-6 py-6 text-center">Zone D</th>
                     <th className="px-6 py-6 text-center">Zone E</th>
                  </tr>
               </thead>
               <tbody className="divide-y divide-white/5">
                  {courier.airRates.map((row: any, i: number) => (
                    <tr key={i} className="hover:bg-white/5 transition-all group">
                       <td className="px-10 py-8 text-slate-400 font-black uppercase tracking-widest group-hover:text-brand-400 transition-colors">{row.slab}</td>
                       {row.zones.map((price: string, j: number) => (
                          <td key={j} className="px-6 py-8 text-center text-white font-black font-mono">{price}</td>
                       ))}
                    </tr>
                  ))}
               </tbody>
            </table>
         </div>
      </div>
    </div>
  );
};
