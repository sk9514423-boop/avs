
import React, { useState, useEffect } from 'react';
import { 
  Terminal, Code2, ShieldCheck, Globe, Server, Copy, Check, Package, Truck, Wallet, AlertCircle, Zap, LayoutDashboard, AlertTriangle, Scale, FileText, Settings, Tags, BarChart3, ChevronRight, Database, CreditCard, Receipt, Download, FileJson, Loader2, RefreshCcw, Eye, EyeOff, Link2, Lock, Activity, Workflow, Key, ShieldAlert, Cpu, ArrowDownCircle, ArrowUpCircle
} from 'lucide-react';
import { useLocalStorage } from '../hooks/useLocalStorage';

type DocSection = 'auth' | 'implementation' | 'orders' | 'webhooks' | 'wallet' | 'health';

export const ApiDocs: React.FC = () => {
  const [activeSection, setActiveSection] = useState<DocSection>('implementation');
  const [activeLang, setActiveLang] = useState<'curl' | 'js'>('curl');
  const [copied, setCopied] = useState<string | null>(null);
  const [apiKey] = useLocalStorage('vas_live_api_key', 'VAS_LIVE_$(6772_KEY_9901_AUTH_771)');

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopied(id);
    setTimeout(() => setCopied(null), 2000);
  };

  const CodeSnippet = ({ id, curl, js, title }: { id: string, curl: string, js: string, title?: string }) => {
    const code = activeLang === 'curl' ? curl : js;
    return (
      <div className="mt-6 rounded-2xl overflow-hidden border border-[#1F2937] bg-[#020308] shadow-2xl group">
        <div className="flex items-center justify-between px-6 py-3 bg-[#111827] border-b border-[#1F2937]">
          <div className="flex items-center gap-6">
            <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">{title || 'Sample Request'}</span>
            <div className="flex gap-4">
                <button onClick={() => setActiveLang('curl')} className={`text-[10px] font-black uppercase tracking-widest transition-colors ${activeLang === 'curl' ? 'text-brand-400' : 'text-slate-500 hover:text-slate-300'}`}>cURL</button>
                <button onClick={() => setActiveLang('js')} className={`text-[10px] font-black uppercase tracking-widest transition-colors ${activeLang === 'js' ? 'text-brand-400' : 'text-slate-500 hover:text-slate-300'}`}>Node.js</button>
            </div>
          </div>
          <button onClick={() => copyToClipboard(code, id)} className="text-slate-500 hover:text-white flex items-center gap-2 text-[10px] font-bold uppercase transition-all">
            {copied === id ? <Check size={14} className="text-emerald-400" /> : <Copy size={14} />}
            {copied === id ? 'Copied' : 'Copy'}
          </button>
        </div>
        <pre className="p-6 text-[11px] font-mono text-slate-300 overflow-x-auto leading-relaxed bg-black/40">
          <code>{code}</code>
        </pre>
      </div>
    );
  };

  const menuItems = [
    { id: 'implementation', label: '1. Implementation Guide', icon: Code2 },
    { id: 'auth', label: '2. Authentication Key', icon: ShieldCheck },
    { id: 'orders', label: '3. Orders API Nexus', icon: Package },
    { id: 'wallet', label: '4. Wallet Settlement', icon: Wallet },
    { id: 'webhooks', label: '5. Webhook System', icon: Workflow },
    { id: 'health', label: '6. API Health Monitor', icon: Activity },
  ];

  return (
    <div className="p-8 bg-[#0B1020] min-h-full font-sans text-gray-300 pb-32">
      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-12">
        
        <div className="lg:w-80 shrink-0">
          <h2 className="text-3xl font-black text-white uppercase tracking-tighter mb-8 flex items-center gap-4">
             <div className="p-3 bg-brand-900/30 rounded-2xl text-brand-400 border border-brand-900/50">
                <ShieldAlert size={28} />
             </div>
             Developer API
          </h2>
          <div className="space-y-1 bg-[#111827]/50 p-2 rounded-[2rem] border border-[#1F2937]">
            {menuItems.map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveSection(item.id as any)}
                className={`w-full flex items-center justify-between px-6 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all group ${activeSection === item.id ? 'bg-brand-600 text-white' : 'text-slate-500 hover:bg-[#111827]'}`}
              >
                <div className="flex items-center gap-4"><item.icon size={16} /> {item.label}</div>
                <ChevronRight size={14} />
              </button>
            ))}
          </div>
        </div>

        <div className="flex-1 max-w-4xl">
           <div className="bg-[#111827]/60 border border-[#1F2937] rounded-[3.5rem] p-12 shadow-2xl relative min-h-[600px]">
              
              {activeSection === 'implementation' && (
                  <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
                      <div>
                          <h3 className="text-3xl font-black text-white uppercase tracking-tight">Backend Is Ready (Node.js)</h3>
                          <p className="text-slate-400 mt-4 leading-relaxed">Maine aapke liye <code>server.js</code> file generate kar di hai. Isme saara Wallet aur Order logic likha hua hai. Ab aapko sirf niche diye gaye steps lene hain:</p>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div className="p-8 bg-[#0B1020] rounded-3xl border border-[#374151] space-y-4">
                              <div className="p-3 bg-brand-600 rounded-xl w-fit text-white"><Database size={20}/></div>
                              <h4 className="text-sm font-black text-white uppercase">Hosting</h4>
                              <p className="text-[10px] text-slate-500 font-bold leading-relaxed uppercase">Deploy <code>server.js</code> to Vercel, Heroku, or AWS. Connect it to a MongoDB database for persistence.</p>
                          </div>
                          <div className="p-8 bg-[#0B1020] rounded-3xl border border-[#374151] space-y-4">
                              <div className="p-3 bg-emerald-600 rounded-xl w-fit text-white"><Link2 size={20}/></div>
                              <h4 className="text-sm font-black text-white uppercase">Integration</h4>
                              <p className="text-[10px] text-slate-500 font-bold leading-relaxed uppercase">Update <code>App.tsx</code> to fetch data from your new API URL instead of <code>localStorage</code>.</p>
                          </div>
                      </div>

                      <div className="p-10 bg-brand-950/20 border border-brand-500/20 rounded-[2.5rem] flex items-center gap-8">
                          <div className="w-16 h-16 bg-brand-600 rounded-2xl flex items-center justify-center text-white shrink-0"><Code2 size={32} /></div>
                          <div>
                              <div className="text-xs font-black text-white uppercase tracking-widest">Backend Command</div>
                              <div className="text-sm font-mono text-brand-400 mt-2 font-black tracking-widest">node server.js</div>
                              <p className="text-[9px] text-slate-500 mt-2 font-bold uppercase tracking-widest">Aap is file ko Node.js environment mein run kar sakte hain.</p>
                          </div>
                      </div>
                  </div>
              )}

              {activeSection === 'auth' && (
                  <div className="space-y-8">
                      <h3 className="text-2xl font-black text-white uppercase">Authentication Header</h3>
                      <p className="text-slate-400 text-sm">Pass the Merchant Secret in every single Request.</p>
                      <CodeSnippet id="auth" curl={`curl -H "Authorization: Bearer ${apiKey}" \\\n  https://api.yourdomain.com/v2/ping`} js={`const headers = { 'Authorization': 'Bearer ${apiKey}' };`} />
                  </div>
              )}

              {activeSection === 'wallet' && (
                  <div className="space-y-8 animate-in fade-in duration-500">
                      <h3 className="text-3xl font-black text-white uppercase tracking-tight flex items-center gap-3">
                        <Wallet className="text-brand-400" /> Wallet Logic (Server-Side)
                      </h3>
                      <p className="text-slate-400 leading-relaxed">
                        Ab <code>server.js</code> mein wallet balance calculate hota hai. Front-end se sirf Request jayegi.
                      </p>

                      <div className="space-y-6">
                        <h4 className="text-sm font-black text-white uppercase tracking-widest">1. Get Current Balance</h4>
                        <CodeSnippet 
                          id="wallet-bal" 
                          curl={`curl -H "Authorization: Bearer ${apiKey}" \\\n  https://your-api.com/api/v2/wallet/balance`} 
                          js={`const res = await axios.get('/api/v2/wallet/balance', { headers });`} 
                        />

                        <h4 className="text-sm font-black text-white uppercase tracking-widest mt-8">2. Debit Amount (Label Print)</h4>
                        <CodeSnippet 
                          id="wallet-debit" 
                          curl={`curl -X POST -H "Authorization: Bearer ${apiKey}" \\\n  -d '{"amount": 85.00, "description": "Shipping: ORD-101", "orderId": "ORD-101"}' \\\n  https://your-api.com/api/v2/wallet/debit`} 
                          js={`await api.post('/api/v2/wallet/debit', {\n  amount: 85.00,\n  description: 'Shipment Charge',\n  orderId: 'ORD-101'\n});`} 
                        />
                      </div>
                  </div>
              )}

              {/* ... Rest of the sections remain same or can be updated as needed ... */}

           </div>
        </div>
      </div>
    </div>
  );
};
