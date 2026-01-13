
import React, { useState, useEffect } from 'react';
import { Menu, Wifi, Loader2, Zap } from 'lucide-react';
import { Sidebar } from './Sidebar';
import { Dashboard } from './Dashboard';
import { Orders } from './Orders';
import { AddOrderForm } from './AddOrderForm';
import { Billing } from './Billing';
import { ChatInterface } from './ChatInterface';
import { FloatingChat } from './FloatingChat';
import { Login } from './Login';
import { NDR } from './NDR';
import { AppMode, Order } from '../types';

const INITIAL_ORDERS: Order[] = [
  {
    id: 'ORD-77201',
    date: '30 Nov 2025 | 14:22',
    status: 'Ready to Ship',
    awb: 'DEL88291044',
    category: 'Domestic',
    tag: 'Priority',
    products: [{ name: 'Premium Wireless Buds', sku: 'W-BUDS-01', qty: 1, price: 2499 }],
    package: { dimensions: '10x10x5 cm', deadWt: '0.5kg', volumetric: '0.2kg' },
    shipping: { name: 'Rahul Sharma', phone: '9876543210', address: 'B-42, Sector 62, Noida', zip: '201301', country: 'India' },
    payment: { method: 'Prepaid', status: 'Paid', invoice: '₹ 2,499.00' },
    pickup: 'VAS MAIN HUB'
  },
  {
    id: 'ORD-77202',
    date: '01 Dec 2025 | 10:15',
    status: 'New',
    category: 'Domestic',
    tag: 'Standard',
    products: [{ name: 'Ergonomic Mouse', sku: 'E-MSE-04', qty: 2, price: 1299 }],
    package: { dimensions: '12x8x6 cm', deadWt: '0.3kg', volumetric: '0.1kg' },
    shipping: { name: 'Sneha Gupta', phone: '9911223344', address: 'Flat 201, Sunrise Apts, Mumbai', zip: '400001', country: 'India' },
    payment: { method: 'COD', status: 'Pending', invoice: '₹ 2,598.00' },
    pickup: 'VAS MAIN HUB'
  }
];

const App: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentMode, setCurrentMode] = useState<AppMode>(AppMode.DASHBOARD);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  
  const [orders, setOrders] = useState<Order[]>(() => {
    const saved = localStorage.getItem('vas_orders_v2');
    return saved ? JSON.parse(saved) : INITIAL_ORDERS;
  });

  const [walletBalance, setWalletBalance] = useState(5000.00);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error'; id: number } | null>(null);

  useEffect(() => {
    localStorage.setItem('vas_orders_v2', JSON.stringify(orders));
  }, [orders]);

  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
      const id = Date.now();
      setToast({ message, type, id });
      setTimeout(() => setToast(curr => curr?.id === id ? null : curr), 5000);
  };

  const handleCreateShipment = (orderData: any) => {
      const newOrder: Order = {
          ...orderData,
          status: 'Ready to Ship',
          awb: `VAS${Math.floor(10000000 + Math.random() * 90000000)}`,
          date: new Date().toLocaleString('en-GB')
      };
      setOrders([newOrder, ...orders]);
      showToast(`AWB Generated: ${newOrder.awb}`);
      setCurrentMode(AppMode.ORDERS);
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
                <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
                <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                    VAS CORE: ONLINE
                </span>
             </div>
          </div>

          <div className="flex items-center gap-8">
             <div className="text-right border-r border-white/5 pr-5">
                <span className="block text-[8px] font-black text-slate-500 uppercase tracking-widest">Wallet Balance</span>
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
                updateOrderStatus={(id, status) => setOrders(prev => prev.map(o => o.id === id ? {...o, status} : o))} 
                onEditOrder={()=>{}} 
                onShipOrder={(id, courier, rate, awb) => {
                  setOrders(prev => prev.map(o => o.id === id ? {...o, status: 'Ready to Ship', courier, awb} : o));
                  setWalletBalance(prev => prev - rate);
                }}
                onMoveToManifest={()=>{}} onMoveToPickup={()=>{}} onGenerateDummyOrders={()=>{}}
                onGeneratePickup={()=>{}} onConfirmPickup={()=>{}} onCancelPickup={()=>{}}
                onMarkOutForDelivery={()=>{}} onCancelShipment={()=>{}} onCloneOrder={()=>{}}
                onDeleteOrder={()=>{}} onMarkRTO={()=>{}} updateOrder={()=>{}}
              />
          )}
          {currentMode === AppMode.ADD_ORDER && <AddOrderForm onOrderAdded={handleCreateShipment} onCancel={() => setCurrentMode(AppMode.ORDERS)} />}
          {currentMode === AppMode.NDR && <NDR />}
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
