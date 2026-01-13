
import React, { useState } from 'react';
import { 
  Link2, 
  Plus, 
  CheckCircle2,
  ArrowRight,
  X,
  Globe,
  ShieldCheck,
  RefreshCcw,
  Loader2,
  Trash2,
  Terminal,
  Zap,
  Store,
  Wifi,
  LayoutGrid,
  Activity,
  Lock,
  Share2,
  ExternalLink,
  ChevronRight,
  Database
} from 'lucide-react';
import { AppMode, Order } from '../types';
import { useLocalStorage } from '../hooks/useLocalStorage';

interface IntegrationsProps {
  currentMode: AppMode;
  onOrderSynced?: (order: Order) => void;
}

interface ChannelType {
    id: string;
    name: string;
    logo: string | React.ReactNode;
    description: string;
    fields: { id: string; label: string; placeholder: string; type: string }[];
}

interface ConnectedAccount {
    instanceId: string;
    platformId: string;
    displayName: string;
    lastSync: string;
    ordersSynced: number;
    status: 'Active' | 'Error';
    webhookUrl?: string;
    reverseTracking?: boolean;
}

export const Integrations: React.FC<IntegrationsProps> = ({ currentMode, onOrderSynced }) => {
  const [activeInternalTab, setActiveInternalTab] = useState<'connected' | 'add_new'>('connected');
  const [connectedAccounts, setConnectedAccounts] = useLocalStorage<ConnectedAccount[]>('vas_connected_multi_accounts', []);
  const [syncLogs, setSyncLogs] = useState<any[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedPlatform, setSelectedPlatform] = useState<ChannelType | null>(null);
  const [isConnecting, setIsConnecting] = useState(false);
  const [isSyncingId, setIsSyncingId] = useState<string | null>(null);
  const [globalSyncing, setGlobalSyncing] = useState(false);
  
  const [formData, setFormData] = useState<Record<string, any>>({ displayName: '', reverseTracking: true });

  const platforms: ChannelType[] = [
    { 
        id: 'amazon', 
        name: 'Amazon India', 
        logo: 'https://cdn.worldvectorlogo.com/logos/amazon-icon-1.svg', 
        description: 'Connect Seller Central via SP-API V2 for automated order pulling.',
        fields: [
            { id: 'seller_id', label: 'Seller ID', placeholder: 'A1B2C3D4E5FG6H', type: 'text' },
            { id: 'client_id', label: 'LWA Client ID', placeholder: 'amzn1.application-oa2-client...', type: 'text' }
        ] 
    },
    { 
        id: 'flipkart', 
        name: 'Flipkart Seller', 
        logo: 'https://cdn.worldvectorlogo.com/logos/flipkart.svg', 
        description: 'Link Flipkart Marketplace via V2 API to sync labels and orders.',
        fields: [
            { id: 'app_id', label: 'Application ID', placeholder: 'FK-APP-1029', type: 'text' },
            { id: 'app_secret', label: 'Application Secret', placeholder: '••••••••', type: 'password' }
        ] 
    },
    { 
        id: 'meesho', 
        name: 'Meesho', 
        logo: 'https://upload.wikimedia.org/wikipedia/commons/8/80/Meesho_Logo_Full.png', 
        description: 'Sync Meesho orders directly via Auth Token for fast dispatch.',
        fields: [
            { id: 'auth_key', label: 'Meesho Auth Key', placeholder: 'eyJhbGciOiJIUzI1...', type: 'password' }
        ] 
    },
    { 
        id: 'custom_web', 
        name: 'Custom Web / Website', 
        logo: <div className="w-full h-full bg-brand-600 rounded-2xl flex items-center justify-center text-white"><Globe size={32} /></div>, 
        description: 'Connect your own PHP/Node/React/WooCommerce site via API & Webhooks.',
        fields: [
            { id: 'api_endpoint', label: 'Orders API Endpoint', placeholder: 'https://mysite.com/api/orders', type: 'text' },
            { id: 'webhook_url', label: 'Tracking Webhook URL', placeholder: 'https://mysite.com/api/vas-webhook', type: 'text' },
            { id: 'api_key', label: 'Secret API Key', placeholder: 'VAS_AUTH_TOKEN_...', type: 'password' }
        ] 
    }
  ];

  const addLog = (msg: string, status: 'info' | 'success' | 'error' = 'info') => {
    const log = { id: Date.now(), msg, status, time: new Date().toLocaleTimeString() };
    setSyncLogs(prev => [log, ...prev].slice(0, 15));
  };

  const startSync = (instance: ConnectedAccount) => {
    setIsSyncingId(instance.instanceId);
    addLog(`Initiating handshake with ${instance.displayName}...`, 'info');

    setTimeout(() => {
      const newOrder: Order = {
        id: `${instance.platformId.substring(0,2).toUpperCase()}-${Math.floor(100000 + Math.random() * 900000)}`,
        date: new Date().toLocaleString('en-GB'),
        type: 'Synced',
        category: 'Domestic',
        tag: instance.displayName,
        sourcePlatform: (instance.platformId === 'custom_web' ? 'Custom Web' : instance.platformId.charAt(0).toUpperCase() + instance.platformId.slice(1)) as any,
        status: 'Ready to Ship',
        courier: 'Delhivery Air',
        awb: `AWB${Math.floor(100000000 + Math.random() * 900000000)}`,
        products: [{ name: `${instance.platformId.toUpperCase()} Synced Product`, sku: 'SKU-SYNC', qty: 1, price: 999 }],
        package: { dimensions: '10x10x10', deadWt: '0.5kg', volumetric: '0.2kg' },
        payment: { invoice: '₹ 999', method: 'Prepaid', status: 'Paid' },
        // Fix: Added country to shipping
        shipping: { name: 'Marketplace Customer', phone: '9000011111', address: 'B-Block, Green Park, Delhi', zip: '110016', country: 'India' },
        pickup: 'VAS MAIN HUB',
        shippingCost: 85
      };

      if (onOrderSynced) onOrderSynced(newOrder);

      if (instance.reverseTracking && instance.webhookUrl) {
          addLog(`Auto-Pushing Tracking ID ${newOrder.awb} to ${instance.webhookUrl}`, 'success');
      }

      setConnectedAccounts(prev => prev.map(acc => 
        acc.instanceId === instance.instanceId 
        ? { ...acc, lastSync: new Date().toLocaleString(), ordersSynced: acc.ordersSynced + 1 } 
        : acc
      ));

      addLog(`Pulling Finished: 1 Order synced from ${instance.displayName}.`, 'success');
      setIsSyncingId(null);
    }, 2000);
  };

  const handleGlobalSync = () => {
    setGlobalSyncing(true);
    addLog("Pulling orders from all marketplaces (15min Interval Simulated)...", "info");
    connectedAccounts.forEach((acc, idx) => {
        setTimeout(() => startSync(acc), idx * 1000);
    });
    setTimeout(() => setGlobalSyncing(false), (connectedAccounts.length * 1000) + 2000);
  };

  const addNewAccount = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.displayName || !selectedPlatform) return;

    setIsConnecting(true);
    addLog(`Establishing bridge for ${selectedPlatform.name}...`, 'info');

    setTimeout(() => {
        const newAcc: ConnectedAccount = {
            instanceId: `BRG-${Date.now()}`,
            platformId: selectedPlatform.id,
            displayName: formData.displayName,
            lastSync: 'Just Now',
            ordersSynced: 0,
            status: 'Active',
            webhookUrl: formData.webhook_url,
            reverseTracking: formData.reverseTracking
        };
        setConnectedAccounts(prev => [newAcc, ...prev]);
        setIsConnecting(false);
        setIsModalOpen(false);
        setFormData({ displayName: '', reverseTracking: true });
        addLog(`Marketplace Connected: ${formData.displayName} is now LIVE.`, 'success');
        setActiveInternalTab('connected');
    }, 2000);
  };

  const disconnectAccount = (id: string) => {
    if(confirm("Are you sure you want to remove this store link? Automatic order pulling will stop.")) {
        setConnectedAccounts(prev => prev.filter(a => a.instanceId !== id));
        addLog("Marketplace Bridge disconnected.", "error");
    }
  };

  return (
    <div className="p-8 bg-[#0B1020] min-h-full font-sans text-gray-300 pb-32">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 gap-8">
        <div>
          <h2 className="text-4xl font-black text-white uppercase tracking-tighter flex items-center gap-4">
             <div className="p-3 bg-brand-900/30 rounded-2xl text-brand-400 border-brand-900/50 shadow-inner">
                <Store size={32} />
             </div>
             Marketplace Hub
          </h2>
          <p className="text-xs text-slate-500 font-black uppercase mt-2 tracking-widest ml-1 opacity-60">Marketplace Connectors & API Webhook Engine</p>
        </div>

        <div className="flex bg-[#111827] p-1.5 rounded-[1.5rem] border border-[#1F2937] shadow-2xl">
           <button onClick={() => setActiveInternalTab('connected')} className={`px-6 py-3 text-[10px] font-black uppercase tracking-widest rounded-xl transition-all flex items-center gap-2 ${activeInternalTab === 'connected' ? 'bg-brand-600 text-white shadow-lg' : 'text-slate-500 hover:text-slate-300'}`}>
              <CheckCircle2 size={14} /> Connected Stores ({connectedAccounts.length})
           </button>
           <button onClick={() => setActiveInternalTab('add_new')} className={`px-6 py-3 text-[10px] font-black uppercase tracking-widest rounded-xl transition-all flex items-center gap-2 ${activeInternalTab === 'add_new' ? 'bg-brand-600 text-white shadow-lg' : 'text-slate-500 hover:text-slate-300'}`}>
              <Plus size={14} /> Link New Store
           </button>
        </div>
      </div>

      {/* --- CONNECTED ACCOUNTS VIEW --- */}
      {activeInternalTab === 'connected' && (
          <div className="animate-in fade-in slide-in-from-bottom-6 duration-700 space-y-12">
              
              <div className="bg-[#111827] p-8 rounded-[2.5rem] border border-[#1F2937] shadow-2xl flex flex-col md:flex-row justify-between items-center gap-6 relative overflow-hidden">
                  <div className="absolute top-0 right-0 p-8 opacity-[0.03] pointer-events-none"><Activity size={100} /></div>
                  <div className="relative z-10">
                      <h3 className="text-xl font-black text-white uppercase tracking-tight flex items-center gap-3"><Wifi size={20} className="text-emerald-400 animate-pulse"/> Store Bridge Status</h3>
                      <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mt-1">Automatic order pulling every 15 minutes</p>
                  </div>
                  <div className="flex gap-4 relative z-10">
                      <button 
                        onClick={handleGlobalSync}
                        disabled={globalSyncing || connectedAccounts.length === 0}
                        className="px-10 py-4 bg-brand-600 hover:bg-brand-700 text-white rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] shadow-xl flex items-center gap-3 transition-all disabled:opacity-30"
                      >
                        {globalSyncing ? <Loader2 size={18} className="animate-spin" /> : <RefreshCcw size={18} />}
                        Pull All Orders
                      </button>
                  </div>
              </div>

              {connectedAccounts.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                      {connectedAccounts.map((acc) => {
                          const platform = platforms.find(p => p.id === acc.platformId);
                          const syncing = isSyncingId === acc.instanceId;

                          return (
                              <div key={acc.instanceId} className="bg-[#111827] rounded-[3rem] border border-[#1F2937] p-8 hover:border-brand-500/40 transition-all duration-500 shadow-2xl relative group overflow-hidden">
                                  <div className="flex justify-between items-start mb-8">
                                      <div className="w-16 h-16 bg-white rounded-2xl p-3 flex items-center justify-center shadow-xl">
                                          {typeof platform?.logo === 'string' ? <img src={platform.logo} className="max-w-full max-h-full object-contain" /> : platform?.logo}
                                      </div>
                                      <div className="text-right">
                                          <div className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border ${acc.status === 'Active' ? 'bg-emerald-950/30 border-emerald-500/30 text-emerald-400 shadow-[0_0_15px_rgba(16,185,129,0.2)]' : 'bg-red-950/20 border-red-500/30 text-red-400'}`}>
                                              {platform?.name} - {acc.status}
                                          </div>
                                          <div className="text-[9px] text-slate-500 font-bold uppercase mt-2">Bridge: {acc.instanceId}</div>
                                      </div>
                                  </div>

                                  <h4 className="text-xl font-black text-white uppercase tracking-tight mb-2 truncate">{acc.displayName}</h4>
                                  
                                  <div className="bg-[#0B1020] rounded-2xl p-5 border border-[#1F2937] space-y-3 mb-8">
                                      <div className="flex justify-between items-center">
                                          <span className="text-[9px] font-black text-slate-500 uppercase">Synced Orders</span>
                                          <span className="text-xs font-black text-brand-400">{acc.ordersSynced}</span>
                                      </div>
                                      <div className="flex justify-between items-center">
                                          <span className="text-[9px] font-black text-slate-500 uppercase">Last Handshake</span>
                                          <span className="text-[9px] font-bold text-slate-300">{acc.lastSync}</span>
                                      </div>
                                      {acc.webhookUrl && (
                                          <div className="pt-2 border-t border-[#1F2937] flex flex-col gap-1">
                                              <span className="text-[8px] font-black text-slate-600 uppercase">Webhook Engine</span>
                                              <span className="text-[9px] text-emerald-400 font-mono truncate">{acc.webhookUrl}</span>
                                          </div>
                                      )}
                                  </div>

                                  <div className="flex gap-3">
                                      <button 
                                        onClick={() => startSync(acc)}
                                        disabled={syncing}
                                        className="flex-1 py-4 bg-brand-600/10 hover:bg-brand-600 text-brand-400 hover:text-white rounded-2xl text-[10px] font-black uppercase flex items-center justify-center gap-2 transition-all border border-brand-500/20 hover:border-transparent"
                                      >
                                          {syncing ? <Loader2 size={14} className="animate-spin" /> : <Zap size={14} />} 
                                          {syncing ? 'Pulling...' : 'Sync Now'}
                                      </button>
                                      <button 
                                        onClick={() => disconnectAccount(acc.instanceId)}
                                        className="p-4 bg-red-950/10 text-red-500 rounded-2xl border border-red-950/20 hover:bg-red-600 hover:text-white transition-all"
                                      >
                                          <Trash2 size={18} />
                                      </button>
                                  </div>
                              </div>
                          );
                      })}
                  </div>
              ) : (
                  <div className="py-32 text-center bg-[#111827] rounded-[4rem] border-4 border-dashed border-[#1F2937] shadow-inner">
                      <Store size={64} className="mx-auto text-slate-700 mb-6 opacity-40" />
                      <h3 className="text-xl font-black text-slate-600 uppercase tracking-widest">No Store Connections</h3>
                      <p className="text-slate-600 mt-2 text-sm">Click "Link New Store" to connect Amazon, Flipkart, or your Website.</p>
                      <button onClick={() => setActiveInternalTab('add_new')} className="mt-8 px-10 py-4 bg-brand-600 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-xl">Get Started</button>
                  </div>
              )}

              {/* LOGS FEED */}
              <div className="bg-[#111827] rounded-[3rem] border border-[#1F2937] shadow-2xl overflow-hidden">
                  <div className="px-8 py-6 border-b border-[#1F2937] flex items-center gap-4 bg-[#0B1020]/50">
                      <Terminal size={20} className="text-brand-400" />
                      <div>
                          <h4 className="text-sm font-black text-white uppercase tracking-widest">Marketplace Bridge Logs</h4>
                          <p className="text-[9px] text-slate-500 font-bold uppercase tracking-tight">Real-time order pulling and tracking push events</p>
                      </div>
                  </div>
                  <div className="p-8 max-h-[300px] overflow-y-auto custom-scrollbar font-mono text-[11px] space-y-4">
                      {syncLogs.map(log => (
                          <div key={log.id} className="flex gap-4 items-start border-l-2 border-[#1F2937] pl-4 hover:border-brand-500 transition-colors">
                              <span className="text-slate-600 shrink-0">[{log.time}]</span>
                              <span className={`font-bold shrink-0 uppercase ${log.status === 'success' ? 'text-emerald-400' : log.status === 'error' ? 'text-red-500' : 'text-brand-400'}`}>{log.status}</span>
                              <span className="text-slate-400">{log.msg}</span>
                          </div>
                      ))}
                      {syncLogs.length === 0 && <div className="text-center py-10 text-slate-700 font-black uppercase tracking-[0.3em]">Listening for store events...</div>}
                  </div>
              </div>
          </div>
      )}

      {/* --- ADD NEW CHANNEL VIEW --- */}
      {activeInternalTab === 'add_new' && (
          <div className="animate-in fade-in slide-in-from-right-6 duration-700 space-y-12">
              <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                  {platforms.map(platform => (
                      <div 
                        key={platform.id}
                        onClick={() => { setSelectedPlatform(platform); setIsModalOpen(true); }}
                        className="bg-[#111827] border border-[#1F2937] rounded-[2.5rem] p-8 flex flex-col items-center text-center group cursor-pointer hover:border-brand-500 hover:shadow-brand-500/10 hover:shadow-2xl transition-all duration-500 active:scale-[0.98]"
                      >
                          <div className="w-20 h-20 bg-white rounded-3xl p-4 mb-6 shadow-xl transition-transform group-hover:scale-110">
                              {typeof platform.logo === 'string' ? <img src={platform.logo} className="max-w-full max-h-full object-contain" /> : platform.logo}
                          </div>
                          <h4 className="text-lg font-black text-white uppercase tracking-tight mb-2">{platform.name}</h4>
                          <p className="text-[10px] text-slate-500 font-medium leading-relaxed mb-8">{platform.description}</p>
                          <div className="mt-auto px-6 py-3 bg-[#0B1020] border border-[#1F2937] rounded-xl text-[10px] font-black uppercase tracking-widest text-slate-400 group-hover:text-brand-400 group-hover:border-brand-500 transition-all flex items-center gap-2">
                             Connect <ArrowRight size={14} />
                          </div>
                      </div>
                  ))}
              </div>

              <div className="max-w-4xl mx-auto bg-brand-950/20 border border-brand-500/20 p-10 rounded-[3rem] flex items-center gap-8 shadow-2xl relative overflow-hidden">
                  <div className="absolute top-0 right-0 p-8 opacity-[0.05] pointer-events-none"><ShieldCheck size={120} /></div>
                  <div className="p-5 bg-brand-600 rounded-3xl text-white shadow-xl"><Lock size={40} /></div>
                  <div>
                      <h4 className="text-xl font-black text-white uppercase tracking-tighter">Automatic Reverse Tracking</h4>
                      <p className="text-sm text-slate-400 mt-2 leading-relaxed">
                          Once connected, VAS Logistics will automatically push the <b>Courier Name</b> and <b>AWB Number</b> back to your store as soon as a label is generated.
                      </p>
                  </div>
              </div>
          </div>
      )}

      {/* --- ADD CHANNEL MODAL --- */}
      {isModalOpen && selectedPlatform && (
          <div className="fixed inset-0 z-[150] flex items-center justify-center p-4 bg-black/95 backdrop-blur-3xl animate-in fade-in duration-300">
              <div className="bg-[#111827] w-full max-w-2xl rounded-[4rem] border border-[#1F2937] shadow-[0_0_150px_rgba(0,0,0,0.9)] overflow-hidden flex flex-col max-h-[90vh]">
                  <div className="p-10 border-b border-[#1F2937] bg-[#0B1020]/50 flex justify-between items-center">
                      <div className="flex items-center gap-8">
                          <div className="w-16 h-16 p-3 bg-white rounded-2xl shadow-xl flex items-center justify-center">
                            {typeof selectedPlatform.logo === 'string' ? <img src={selectedPlatform.logo} className="max-w-full max-h-full object-contain" /> : selectedPlatform.logo}
                          </div>
                          <div>
                            <h3 className="text-2xl font-black text-white uppercase tracking-tighter">Connect {selectedPlatform.name}</h3>
                            <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest mt-1">Marketplace API Integration</p>
                          </div>
                      </div>
                      <button onClick={() => setIsModalOpen(false)} className="p-3 text-slate-600 hover:text-white transition-colors bg-[#1F2937] rounded-full"><X size={24} /></button>
                  </div>

                  <form onSubmit={addNewAccount} className="p-10 space-y-8 overflow-y-auto custom-scrollbar">
                      <div className="space-y-6">
                          <div className="space-y-2 group">
                              <label className="text-[10px] font-black text-brand-400 uppercase tracking-widest ml-1">Store / Account Label *</label>
                              <input 
                                  required
                                  type="text"
                                  value={formData.displayName}
                                  onChange={e => setFormData({...formData, displayName: e.target.value})}
                                  placeholder="e.g. Amazon India Main"
                                  className="w-full px-6 py-4 bg-[#0B1020] border border-[#374151] rounded-2xl text-base text-white font-bold outline-none focus:border-brand-500 focus:ring-8 focus:ring-brand-500/5 transition-all shadow-inner"
                              />
                          </div>

                          {selectedPlatform.fields.map((field) => (
                              <div key={field.id} className="space-y-2 group">
                                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1 group-focus-within:text-brand-400 transition-colors">{field.label} *</label>
                                  <input 
                                      required
                                      type={field.type}
                                      value={formData[field.id] || ''}
                                      onChange={e => setFormData({...formData, [field.id]: e.target.value})}
                                      placeholder={field.placeholder}
                                      className="w-full px-6 py-4 bg-[#0B1020] border border-[#374151] rounded-2xl text-base text-white font-bold outline-none focus:border-brand-500 transition-all shadow-inner"
                                  />
                              </div>
                          ))}

                          <div className="p-6 bg-[#0B1020] rounded-3xl border border-[#374151] flex items-center justify-between">
                             <div className="flex items-center gap-4">
                                <Share2 size={24} className="text-brand-400" />
                                <div>
                                    <div className="text-xs font-black text-white uppercase">Reverse Tracking Sync</div>
                                    <div className="text-[9px] text-slate-500 font-bold uppercase tracking-tight">Auto-Update AWB on Storefront</div>
                                </div>
                             </div>
                             <button 
                                type="button"
                                onClick={() => setFormData({...formData, reverseTracking: !formData.reverseTracking})}
                                className={`w-12 h-6 rounded-full relative transition-all ${formData.reverseTracking ? 'bg-brand-600' : 'bg-slate-700'}`}
                             >
                                <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${formData.reverseTracking ? 'right-1' : 'left-1'}`}></div>
                             </button>
                          </div>
                      </div>

                      <div className="pt-6 border-t border-[#1F2937] flex gap-4">
                        <button 
                            type="button" 
                            onClick={() => setIsModalOpen(false)}
                            className="flex-1 py-5 text-[10px] font-black uppercase text-slate-600 hover:text-white transition-all"
                        >
                            Cancel
                        </button>
                        <button 
                            type="submit" 
                            disabled={isConnecting}
                            className="flex-[2] py-5 bg-brand-600 hover:bg-brand-700 text-white rounded-2xl font-black text-[11px] uppercase tracking-widest shadow-2xl active:scale-[0.98] transition-all flex items-center justify-center gap-4 disabled:opacity-30"
                        >
                            {isConnecting ? <Loader2 size={18} className="animate-spin" /> : <Link2 size={18} />} 
                            {isConnecting ? 'Linking Store...' : 'Establish Connection'}
                        </button>
                      </div>
                  </form>
              </div>
          </div>
      )}

    </div>
  );
};