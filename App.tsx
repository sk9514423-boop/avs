
import React, { useState, useEffect } from 'react';
import { Menu, Wifi, Loader2, Zap } from 'lucide-react';
import { Sidebar } from './components/Sidebar';
import { Dashboard } from './components/Dashboard';
import { Orders } from './components/Orders';
import { AddOrderForm } from './components/AddOrderForm';
import { Billing } from './components/Billing';
import { ChatInterface } from './components/ChatInterface';
import { FloatingChat } from './components/FloatingChat';
import { Login } from './components/Login';
import { AppMode, Order } from './types';

// Updated: Pointing to Laravel Production-Ready API
const API_BASE_URL = 'http://localhost:8000/api/v1'; 
const AUTH_KEY = 'Bearer VAS_LIVE_$(6772_KEY_9901_AUTH_771)';

const App: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentMode, setCurrentMode] = useState<AppMode>(AppMode.DASHBOARD);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isApiOnline, setIsApiOnline] = useState<boolean | null>(null);
  const [isSyncing, setIsSyncing] = useState(false);
  
  const [orders, setOrders] = useState<Order[]>([]);
  const [walletBalance, setWalletBalance] = useState(0);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error'; id: number } | null>(null);

  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
      const id = Date.now();
      setToast({ message, type, id });
      setTimeout(() => setToast(curr => curr?.id === id ? null : curr), 5000);
  };

  const syncState = async () => {
      setIsSyncing(true);
      try {
          // Fetch Orders from Laravel
          const res = await fetch(`${API_BASE_URL}/orders`, { 
            headers: { 
              'Authorization': AUTH_KEY, 
              'Accept': 'application/json' 
            } 
          });
          if (!res.ok) throw new Error();
          const data = await res.json();
          setOrders(data.data || []);
          
          // Fetch Wallet Balance from Laravel
          const wRes = await fetch(`${API_BASE_URL}/wallet/balance`, { 
            headers: { 
              'Authorization': AUTH_KEY, 
              'Accept': 'application/json' 
            } 
          });
          const wData = await wRes.json();
          setWalletBalance(wData.balance);
          
          setIsApiOnline(true);
      } catch (e) {
          setIsApiOnline(false);
      } finally {
          setIsSyncing(false);
      }
  };

  useEffect(() => {
    if (isAuthenticated) syncState();
  }, [isAuthenticated]);

  const handleCreateShipment = async (orderData: any) => {
      setIsSyncing(true);
      try {
          const res = await fetch(`${API_BASE_URL}/orders`, {
              method: 'POST',
              headers: { 
                'Content-Type': 'application/json', 
                'Authorization': AUTH_KEY,
                'Accept': 'application/json'
              },
              body: JSON.stringify(orderData)
          });
          const result = await res.json();
          if (res.ok) {
              showToast(`AWB Generated: ${result.order.awb}`);
              syncState();
              setCurrentMode(AppMode.ORDERS);
          } else {
              showToast(result.message || 'Request Failed', 'error');
          }
      } catch (e) {
          showToast('Laravel Backend Connection Failed', 'error');
      } finally {
          setIsSyncing(false);
      }
  };

  if (!isAuthenticated) return <Login onLogin={() => setIsAuthenticated(true)} />;

  return (
    <div className="flex h-screen bg-[#060810] text-slate-200 overflow-hidden font-sans">
      <Sidebar currentMode={currentMode} setMode={setCurrentMode} isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />
      
      <main className="flex-1 flex flex-col relative min-w-0">
        <header className="bg-[#0B1020]/90 backdrop-blur-2xl border-b border-white/5 h-16 flex items-center justify-between px-8 sticky top-0 z-50">
          <div className="flex items-center gap-6">
             <button onClick={() => setIsSidebarOpen(true)} className="md:hidden text-slate-400 hover:text-white"><Menu /></button>
             <div className="flex items-center gap-3 px-4 py-2 bg-black/40 rounded-2xl border border-white/5">
                {isSyncing ? <Loader2 size={12} className="animate-spin text-brand-400" /> : <div className={`w-2 h-2 rounded-full ${isApiOnline ? 'bg-emerald-500 animate-pulse' : 'bg-rose-500'}`}></div>}
                <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                    {isApiOnline ? 'Laravel v1: Synchronized' : 'Laravel v1: Offline'}
                </span>
             </div>
          </div>

          <div className="flex items-center gap-8">
             <div className="text-right border-r border-white/5 pr-5">
                <span className="block text-[8px] font-black text-slate-500 uppercase tracking-widest">Active Credit</span>
                <span className="text-sm font-black text-brand-400 font-mono tracking-tighter">₹ {walletBalance.toFixed(2)}</span>
             </div>
             <div className="w-10 h-10 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-brand-400 text-xs font-black">KD</div>
          </div>
        </header>

        <div className="flex-1 overflow-auto bg-[#060810] custom-scrollbar relative">
          {currentMode === AppMode.DASHBOARD && <Dashboard orders={orders} setMode={setCurrentMode} />}
          {currentMode === AppMode.ORDERS && (
              <Orders 
                orders={orders} 
                onAddOrder={() => setCurrentMode(AppMode.ADD_ORDER)}
                onShowToast={showToast}
                updateOrderStatus={()=>{}} onEditOrder={()=>{}} onShipOrder={()=>{}}
                onMoveToManifest={()=>{}} onMoveToPickup={()=>{}} onGenerateDummyOrders={()=>{}}
                onGeneratePickup={()=>{}} onConfirmPickup={()=>{}} onCancelPickup={()=>{}}
                onMarkOutForDelivery={()=>{}} onCancelShipment={()=>{}} onCloneOrder={()=>{}}
                onDeleteOrder={()=>{}} onMarkRTO={()=>{}} updateOrder={()=>{}}
              />
          )}
          {currentMode === AppMode.ADD_ORDER && <AddOrderForm onOrderAdded={handleCreateShipment} onCancel={() => setCurrentMode(AppMode.ORDERS)} />}
          {currentMode === AppMode.BILLING && <Billing walletBalance={walletBalance} />}
          {currentMode === AppMode.AI_SUPPORT && <ChatInterface />}
        </div>
        <FloatingChat />
      </main>

      {toast && (
        <div className={`fixed top-20 right-8 z-[100] px-6 py-4 rounded-2xl shadow-2xl border flex items-center gap-4 animate-in slide-in-from-right-10 duration-300 ${toast.type === 'success' ? 'bg-emerald-900/90 border-emerald-500 text-emerald-100' : 'bg-rose-900/90 border-rose-500 text-rose-100'}`}>
            <Zap size={20} className={toast.type === 'success' ? 'text-emerald-400' : 'text-rose-400'} />
            <span className="text-xs font-black uppercase tracking-widest">{toast.message}</span>
        </div>
      )}
    </div>
  );
};

export default App;
