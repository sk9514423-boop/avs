
import React, { useState, useRef, useEffect, useMemo } from 'react';
import { 
  Search, Filter, Download, Printer, Ship, 
  Trash2, Copy, RefreshCcw, MoreHorizontal, 
  FileText, CheckSquare, XSquare, Truck, 
  Package, AlertTriangle, ChevronDown, Plus,
  MapPin, Phone, User, Calendar, Box, ArrowRight,
  ShieldCheck, AlertCircle, PlayCircle, Eye,
  Siren, Archive, ClipboardList, CheckCircle2,
  FileCheck,
  Edit,
  ExternalLink,
  Clock,
  X,
  Shield,
  FileSpreadsheet,
  FileDown,
  Zap,
  Star,
  Target,
  ChevronRight,
  Check as CheckIcon,
  Loader2,
  Plane,
  Tag,
  Layers
} from 'lucide-react';
import { Order } from '../types';
// Fixed: Removed non-existent printBulkLabels from imports
import { printLabel, printManifest, printInvoice, printBulkInvoices, printInsuranceLabel, printLabelsGrid } from '../utils/documentGenerator';
import { useLocalStorage } from '../hooks/useLocalStorage';

interface OrdersProps {
  orders: Order[];
  initialGlobalSearch?: string;
  immediateShipId?: string | null;
  onClearImmediateShip?: () => void;
  updateOrderStatus: (id: string, status: string) => void;
  onAddOrder: () => void;
  onEditOrder: (order: Order | null) => void;
  onGenerateDummyOrders: (status: string, category?: 'Domestic' | 'International') => void;
  onShipOrder: (id: string, courier: string, rate: number, awb: string) => void;
  onMoveToManifest: (ids: string[]) => void;
  onMoveToPickup: (ids: string[]) => void;
  onGeneratePickup: (id: string) => void;
  onConfirmPickup: (id: string) => void;
  onCancelPickup: (id: string) => void;
  onMarkOutForDelivery: (id: string) => void;
  onCancelShipment: (id: string) => void;
  onCloneOrder: (order: Order) => void;
  onDeleteOrder: (id: string) => void;
  onShowToast: (msg: string, type: 'success' | 'error') => void;
  onMarkRTO: (id: string) => void;
  updateOrder: (id: string, updates: Partial<Order>) => void;
}

const MenuItem = ({ icon: Icon, title, desc, onClick, isDestructive = false, colorClass = '' }: { icon: any, title: string, desc: string, onClick: () => void, isDestructive?: boolean, colorClass?: string }) => (
    <button onClick={(e) => { e.stopPropagation(); onClick(); }} className={`w-full text-left px-4 py-3 hover:bg-[#1F2937] flex items-start gap-3 transition-colors border-b border-[#1F2937] last:border-0 group`}>
        <div className={`mt-0.5 transition-colors ${isDestructive ? 'text-red-400 group-hover:text-red-500' : (colorClass || 'text-gray-400 group-hover:text-brand-400')}`}><Icon size={16} /></div>
        <div>
            <div className={`text-xs font-bold transition-colors ${isDestructive ? 'text-red-400 group-hover:text-red-500' : (colorClass ? 'text-gray-200' : 'text-gray-200 group-hover:text-brand-400')}`}>{title}</div>
            <div className="text-[10px] text-gray-500 leading-tight mt-0.5">{desc}</div>
        </div>
    </button>
);

export const Orders: React.FC<OrdersProps> = ({ 
  orders, 
  initialGlobalSearch = '',
  immediateShipId,
  onClearImmediateShip,
  updateOrderStatus, 
  onAddOrder, 
  onEditOrder, 
  onShipOrder, 
  onMoveToManifest, 
  onMoveToPickup, 
  onGeneratePickup, 
  onShowToast, 
  onCancelShipment,
  onDeleteOrder,
  onCloneOrder,
  onConfirmPickup,
  onCancelPickup,
  onMarkOutForDelivery,
  onMarkRTO,
  updateOrder,
  onGenerateDummyOrders
}) => {
  const [activeTab, setActiveTab] = useState('New');
  const [referenceIdSearch, setReferenceIdSearch] = useState(initialGlobalSearch);
  const [selectedOrders, setSelectedOrders] = useState<Set<string>>(new Set());
  const [isProcessing, setIsProcessing] = useState(false);
  const [isGridOptionsOpen, setIsGridOptionsOpen] = useState(false);
  
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);
  const [menuPosition, setMenuPosition] = useState<{ top?: number, bottom?: number, right: number } | null>(null);

  const [isShipModalOpen, setIsShipModalOpen] = useState(false);
  const [orderToShip, setOrderToShip] = useState<Order | null>(null);
  const [selectedCourierId, setSelectedCourierId] = useState<string | null>(null);

  const [labelSettings] = useLocalStorage('vas_settings_label_config', {
    logo: true, customerPhone: true, dimensions: true, weight: true, 
    paymentType: true, invoiceNumber: true, invoiceDate: true, 
    companyName: true, companyGSTIN: true, pickupAddress: true, 
    companyPhone: true, sku: true, productName: true, 
    shippingCharges: true, prepaidAmount: true, codAmount: true, message: true
  });
  const [invoiceSettings] = useLocalStorage('vas_settings_invoice_config', { logo: true, signature: true, companyName: true, companyPhone: true, companyGSTIN: true, paymentType: true, message: true });
  const [brandLogo] = useLocalStorage<string | null>('vas_settings_brand_logo', null);

  const tabs = ['All', 'New', 'Ready to Ship', 'Manifest / Pickup', 'In-Transit', 'Out For Delivery', 'Delivered', 'RTO'];

  const COURIERS = [
      { id: 'c0e', name: 'PREMIUM COURIER (E-Series)', logo: 'https://upload.wikimedia.org/wikipedia/commons/e/e0/DTDC_Logo.png', rate: 62, type: 'Air', awbPrefix: 'E' },
      { id: 'c0v', name: 'PREMIUM COURIER (V-Series)', logo: 'https://upload.wikimedia.org/wikipedia/commons/e/e0/DTDC_Logo.png', rate: 75, type: 'Air', awbPrefix: 'V' },
      { id: 'c3', name: 'DELHIVERY EXPRESS AIR', logo: 'https://upload.wikimedia.org/wikipedia/commons/b/b3/Delhivery_Logo.png', rate: 85, type: 'Air', awbPrefix: '1' },
      { id: 'c4', name: 'DELHIVERY SURFACE', logo: 'https://upload.wikimedia.org/wikipedia/commons/b/b3/Delhivery_Logo.png', rate: 38, type: 'Surface', awbPrefix: '3' },
      { id: 'c5', name: 'DTDC EXPRESS AIR', logo: 'https://upload.wikimedia.org/wikipedia/commons/e/e0/DTDC_Logo.png', rate: 55, type: 'Air', awbPrefix: '7X' },
      { id: 'c6', name: 'DTDC EXPRESS SURFACE', logo: 'https://upload.wikimedia.org/wikipedia/commons/e/e0/DTDC_Logo.png', rate: 42, type: 'Surface', awbPrefix: '7D' },
      { id: 'c1', name: 'BLUE DART APEX AIR', logo: 'https://upload.wikimedia.org/wikipedia/commons/4/4b/Blue_Dart_Logo.svg', rate: 125, type: 'Air', awbPrefix: '9' },
      { id: 'c2', name: 'BLUE DART SURFACE', logo: 'https://upload.wikimedia.org/wikipedia/commons/4/4b/Blue_Dart_Logo.svg', rate: 58, type: 'Surface', awbPrefix: '1' },
      { id: 'c12', name: 'SHREE MARUTI AIR', logo: 'https://upload.wikimedia.org/wikipedia/commons/4/4b/Blue_Dart_Logo.svg', rate: 80, type: 'Air', awbPrefix: 'SMC1' },
      { id: 'c13', name: 'SHREE MARUTI SURFACE', logo: 'https://upload.wikimedia.org/wikipedia/commons/4/4b/Blue_Dart_Logo.svg', rate: 45, type: 'Surface', awbPrefix: 'SMC2' },
      { id: 'c10', name: 'PROFESSIONAL COURIER AIR', logo: 'https://upload.wikimedia.org/wikipedia/commons/4/4b/Blue_Dart_Logo.svg', rate: 75, type: 'Air', awbPrefix: 'DEL1' },
      { id: 'c11', name: 'PROFESSIONAL COURIER SURFACE', logo: 'https://upload.wikimedia.org/wikipedia/commons/4/4b/Blue_Dart_Logo.svg', rate: 48, type: 'Surface', awbPrefix: 'DEL2' },
      { id: 'c_amz_sf', name: 'AMAZON FAST-TRACK', logo: 'https://cdn.worldvectorlogo.com/logos/amazon-icon-1.svg', rate: 40, type: 'Surface', awbPrefix: '23' }
  ];

  useEffect(() => {
    if (immediateShipId) {
        const order = orders.find(o => o.id === immediateShipId);
        if (order) {
            setOrderToShip(order);
            setIsShipModalOpen(true);
            setSelectedCourierId(null);
        }
        if (onClearImmediateShip) onClearImmediateShip();
    }
  }, [immediateShipId, orders, onClearImmediateShip]);

  const handleMenuClick = (e: React.MouseEvent<HTMLButtonElement>, orderId: string) => {
      e.stopPropagation();
      const rect = e.currentTarget.getBoundingClientRect();
      setMenuPosition({ top: rect.bottom, right: window.innerWidth - rect.right });
      setOpenMenuId(orderId);
  };

  const handleSelectOrder = (id: string) => {
      const next = new Set(selectedOrders);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      setSelectedOrders(next);
  };

  const handleSelectAll = () => {
      if (selectedOrders.size === filteredOrders.length) setSelectedOrders(new Set());
      else setSelectedOrders(new Set(filteredOrders.map(o => o.id)));
  };

  const filteredOrders = useMemo(() => {
    return orders.filter(order => {
      if (activeTab !== 'All') {
          if (activeTab === 'New' && order.status !== 'New') return false;
          if (activeTab === 'Ready to Ship' && order.status !== 'Ready to Ship') return false;
          if (activeTab === 'Manifest / Pickup' && !['Manifest', 'Pickup Scheduled'].includes(order.status)) return false;
          if (activeTab === 'In-Transit' && order.status !== 'In Transit') return false;
          if (activeTab === 'Out For Delivery' && order.status !== 'Out For Delivery') return false;
          if (activeTab === 'Delivered' && order.status !== 'Delivered') return false;
          if (activeTab === 'RTO' && order.status !== 'RTO') return false;
      }
      if (referenceIdSearch) {
          const term = referenceIdSearch.toLowerCase();
          const matches = order.id.toLowerCase().includes(term) || 
                         order.awb?.toLowerCase().includes(term) || 
                         order.shipping.name.toLowerCase().includes(term);
          return matches;
      }
      return true;
    });
  }, [orders, activeTab, referenceIdSearch]);

  const handleConfirmShip = () => {
      if (!orderToShip || !selectedCourierId) return;
      const courier = COURIERS.find(c => c.id === selectedCourierId);
      if (!courier) return;

      const isCod = orderToShip.payment.method === 'COD';
      const codSurcharge = isCod ? 50 : 0;
      const totalRate = courier.rate + codSurcharge;
      const awb = `${courier.awbPrefix}${Math.floor(100000000 + Math.random() * 900000000)}`;
      
      onShipOrder(orderToShip.id, courier.name, totalRate, awb);
      setIsShipModalOpen(false);
      setOrderToShip(null);
      setSelectedCourierId(null);
      onShowToast(`Order ${orderToShip.id} shipped successfully via ${courier.name}.`, 'success');
  };

  const handleGeneratePickupBulk = () => {
    if (selectedOrders.size === 0) return;
    setIsProcessing(true);
    setTimeout(() => {
        onMoveToPickup(Array.from(selectedOrders));
        setSelectedOrders(new Set());
        setIsProcessing(false);
        onShowToast(`${selectedOrders.size} orders moved to pickup.`, 'success');
    }, 1000);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'New': return 'bg-blue-900/30 text-blue-400 border-blue-900/50';
      case 'Ready to Ship': return 'bg-yellow-900/30 text-yellow-400 border-yellow-900/50';
      case 'Delivered': return 'bg-emerald-900/30 text-emerald-400 border-emerald-900/50';
      case 'In Transit': return 'bg-indigo-900/30 text-indigo-400 border-indigo-900/50';
      case 'Out For Delivery': return 'bg-sky-900/30 text-sky-400 border-sky-900/50';
      case 'Manifest':
      case 'Pickup Scheduled': return 'bg-orange-900/30 text-orange-400 border-orange-500/30';
      default: return 'bg-[#1F2937] text-gray-400 border-[#374151]';
    }
  };

  const activeMenuOrder = orders.find(o => o.id === openMenuId);

  return (
    <div className="p-6 bg-[#0B1020] min-h-full font-sans text-gray-300 relative">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-black text-white uppercase tracking-tighter flex items-center gap-3">
            <Truck size={28} className="text-brand-400" /> Logistics Hub
        </h2>
        <button onClick={onAddOrder} className="bg-brand-600 hover:bg-brand-700 text-white px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest shadow-xl shadow-brand-900/20 flex items-center gap-2 active:scale-95 transition-all">
            <Plus size={16} /> Create Order
        </button>
      </div>

      <div className="flex overflow-x-auto bg-[#111827] border-b border-[#1F2937] mb-6 rounded-2xl p-1 no-scrollbar shadow-2xl">
        {tabs.map(tab => (
          <button key={tab} onClick={() => { setActiveTab(tab); setSelectedOrders(new Set()); }} className={`px-6 py-3 text-[10px] font-black uppercase tracking-widest whitespace-nowrap transition-all rounded-xl relative ${activeTab === tab ? 'text-brand-400 bg-brand-900/20 border border-brand-500/20' : 'text-gray-500 hover:text-gray-300 hover:bg-[#1F2937]'}`}>
            {tab}
          </button>
        ))}
      </div>

      <div className="bg-[#111827] p-4 rounded-2xl border border-[#1F2937] mb-6 flex gap-4 shadow-xl">
        <div className="relative flex-1 max-w-md">
            <input type="text" placeholder="Search by AWB, ID or Customer..." value={referenceIdSearch} onChange={(e) => setReferenceIdSearch(e.target.value)} className="pl-12 pr-4 py-3 bg-[#0B1020] border border-[#374151] rounded-xl text-xs focus:outline-none focus:border-brand-500 text-white w-full shadow-inner" />
            <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600" />
        </div>
      </div>

      <div className="bg-[#111827] rounded-3xl border border-[#1F2937] overflow-hidden min-h-[400px] shadow-2xl relative">
        <table className="w-full text-xs text-left">
            <thead className="bg-[#0B1020] text-slate-500 font-black border-b border-[#1F2937] uppercase tracking-[0.2em] text-[10px]">
                <tr>
                    <th className="p-5 text-center w-12">
                        <input type="checkbox" onChange={handleSelectAll} checked={selectedOrders.size === filteredOrders.length && filteredOrders.length > 0} className="w-4 h-4 rounded border-[#374151] bg-[#111827]" />
                    </th>
                    <th className="p-5">Order Reference</th>
                    <th className="p-5">Client Info</th>
                    <th className="p-5">Billing</th>
                    <th className="p-5">Courier Details</th>
                    <th className="p-5">Status</th>
                    <th className="p-5 text-center">Engine / Print</th>
                </tr>
            </thead>
            <tbody className="divide-y divide-[#1F2937]">
                {filteredOrders.map(order => (
                    <tr key={order.id} className={`hover:bg-[#0B1020]/40 transition-all group ${selectedOrders.has(order.id) ? 'bg-brand-900/5' : ''}`}>
                        <td className="p-5 text-center">
                            <input type="checkbox" checked={selectedOrders.has(order.id)} onChange={() => handleSelectOrder(order.id)} className="w-4 h-4 rounded border-[#374151] bg-[#111827] text-brand-600" />
                        </td>
                        <td className="p-5">
                            <div className="font-black text-brand-400 text-sm">{order.id}</div>
                            <div className="text-[10px] text-slate-600 mt-1 uppercase font-bold tracking-widest">{order.date}</div>
                        </td>
                        <td className="p-5">
                            <div className="text-white font-black text-xs uppercase">{order.shipping.name}</div>
                            <div className="text-slate-500 text-[10px] mt-1">{order.shipping.phone}</div>
                        </td>
                        <td className="p-5">
                            <div className="font-black text-white text-xs">{order.payment.invoice}</div>
                            <div className="text-[9px] text-slate-600 font-bold uppercase mt-1">Mode: {order.payment.method}</div>
                        </td>
                        <td className="p-5">
                            {order.courier ? (
                                <>
                                    <div className="text-white font-black text-[10px] uppercase tracking-tighter">{order.courier}</div>
                                    <div className="text-[9px] text-brand-500/70 font-mono mt-1">{order.awb}</div>
                                </>
                            ) : (
                                <span className="text-slate-700 italic font-bold">Unassigned</span>
                            )}
                        </td>
                        <td className="p-5">
                            <span className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase border tracking-widest ${getStatusColor(order.status)}`}>{order.status}</span>
                        </td>
                        <td className="p-5 text-center">
                            <div className="flex items-center justify-center gap-2">
                                {['Ready to Ship', 'Manifest', 'Pickup Scheduled', 'In Transit', 'Out For Delivery', 'Delivered'].includes(order.status) ? (
                                    <>
                                        <button 
                                            onClick={(e) => { e.stopPropagation(); printLabel(order, labelSettings, brandLogo); }}
                                            className="p-2.5 bg-[#0B1020] border border-[#374151] rounded-xl text-emerald-500 hover:text-emerald-400 hover:border-emerald-500 transition-all shadow-lg"
                                            title="Print Label"
                                        >
                                            <Printer size={16} />
                                        </button>
                                        <button 
                                            onClick={(e) => { e.stopPropagation(); printInvoice(order, invoiceSettings, brandLogo); }}
                                            className="p-2.5 bg-[#0B1020] border border-[#374151] rounded-xl text-brand-500 hover:text-brand-400 hover:border-brand-500 transition-all shadow-lg"
                                            title="Print Invoice"
                                        >
                                            <FileText size={16} />
                                        </button>
                                        {order.status === 'Ready to Ship' && (
                                            <button 
                                                onClick={(e) => { e.stopPropagation(); onEditOrder(order); }}
                                                className="p-2.5 bg-[#0B1020] border border-[#374151] rounded-xl text-yellow-500 hover:text-yellow-400 hover:border-yellow-500 transition-all shadow-lg"
                                                title="Edit Order"
                                            >
                                                <Edit size={16} />
                                            </button>
                                        )}
                                    </>
                                ) : order.status === 'New' ? (
                                    <button 
                                        onClick={(e) => { e.stopPropagation(); setOrderToShip(order); setSelectedCourierId(null); setIsShipModalOpen(true); }}
                                        className="p-2.5 bg-brand-600 border border-brand-500 rounded-xl text-white hover:bg-brand-700 transition-all shadow-lg"
                                        title="Ship Shipment"
                                    >
                                        <Ship size={16} />
                                    </button>
                                ) : null}
                                <button onClick={(e) => handleMenuClick(e, order.id)} className="p-2.5 bg-[#0B1020] border border-[#374151] rounded-xl text-slate-500 hover:text-white transition-all shadow-lg"><MoreHorizontal size={16} /></button>
                            </div>
                        </td>
                    </tr>
                ))}
                {filteredOrders.length === 0 && (
                    <tr>
                        <td colSpan={7} className="p-32 text-center">
                            <div className="w-20 h-20 bg-[#0B1020] border border-[#1F2937] rounded-3xl flex items-center justify-center mx-auto mb-6 text-slate-800 shadow-inner"><Box size={40}/></div>
                            <div className="text-slate-700 font-black uppercase tracking-[0.4em] text-xl">No Packets Detected</div>
                        </td>
                    </tr>
                )}
            </tbody>
        </table>
      </div>

      {/* Floating Action Bar */}
      {selectedOrders.size > 0 && (
          <div className="fixed bottom-10 left-1/2 -translate-x-1/2 z-[100] bg-[#111827] border-2 border-brand-500 p-4 rounded-[2.5rem] shadow-[0_0_80px_rgba(14,165,233,0.3)] flex items-center gap-6 animate-in slide-in-from-bottom-10 duration-500 px-8">
              <div className="flex flex-col">
                  <span className="text-lg font-black text-white tracking-tighter">{selectedOrders.size} SELECTED</span>
              </div>
              <div className="flex gap-2 relative">
                  <div className="relative group">
                    <button 
                      onClick={() => setIsGridOptionsOpen(!isGridOptionsOpen)}
                      className="p-3 bg-[#0B1020] border border-[#374151] rounded-2xl text-emerald-400 hover:text-emerald-300 hover:border-emerald-500 transition-all flex items-center gap-2"
                      title="Grid Label Options"
                    >
                        <Printer size={20} />
                        <ChevronDown size={14} />
                    </button>
                    {isGridOptionsOpen && (
                        <div className="absolute bottom-full left-0 mb-3 w-48 bg-[#111827] border border-[#374151] rounded-2xl shadow-2xl overflow-hidden animate-in fade-in slide-in-from-bottom-2 z-[110]">
                            <div className="p-3 border-b border-[#1F2937] text-[9px] font-black text-slate-500 uppercase tracking-widest text-center">Grid Layout Selection</div>
                            <button onClick={() => { setIsGridOptionsOpen(false); printLabelsGrid(orders.filter(o => selectedOrders.has(o.id)), 2, labelSettings, brandLogo); }} className="w-full px-4 py-3 text-[10px] font-black uppercase text-white hover:bg-brand-600/10 flex items-center gap-3 transition-colors border-b border-[#1F2937]">
                                <Layers size={14} className="text-brand-400" /> 2 Labels / Page
                            </button>
                            <button onClick={() => { setIsGridOptionsOpen(false); printLabelsGrid(orders.filter(o => selectedOrders.has(o.id)), 3, labelSettings, brandLogo); }} className="w-full px-4 py-3 text-[10px] font-black uppercase text-white hover:bg-brand-600/10 flex items-center gap-3 transition-colors border-b border-[#1F2937]">
                                <Layers size={14} className="text-emerald-400" /> 3 Labels / Page
                            </button>
                            <button onClick={() => { setIsGridOptionsOpen(false); printLabelsGrid(orders.filter(o => selectedOrders.has(o.id)), 4, labelSettings, brandLogo); }} className="w-full px-4 py-3 text-[10px] font-black uppercase text-white hover:bg-brand-600/10 flex items-center gap-3 transition-colors">
                                <Layers size={14} className="text-orange-400" /> 4 Labels / Page
                            </button>
                        </div>
                    )}
                  </div>
                  
                  <button 
                    onClick={() => {
                        const selected = orders.filter(o => selectedOrders.has(o.id));
                        printBulkInvoices(selected, invoiceSettings, brandLogo);
                    }} 
                    className="p-3 bg-[#0B1020] border border-[#374151] rounded-2xl text-brand-400 hover:text-brand-300 hover:border-brand-500 transition-all"
                    title="Bulk Invoices"
                  >
                      <FileText size={20} />
                  </button>
                  <button 
                    onClick={handleGeneratePickupBulk}
                    disabled={isProcessing}
                    className="flex items-center gap-3 px-8 bg-brand-600 hover:bg-brand-700 text-white rounded-2xl font-black uppercase text-[10px] tracking-widest shadow-xl transition-all active:scale-95 disabled:opacity-30"
                  >
                      {isProcessing ? <Loader2 size={18} className="animate-spin" /> : <Truck size={18} />} 
                      Pickup
                  </button>
              </div>
              <button onClick={() => setSelectedOrders(new Set())} className="p-3 text-slate-600 hover:text-white transition-colors"><X size={20}/></button>
          </div>
      )}

      {/* Menu Portal */}
      {openMenuId && activeMenuOrder && menuPosition && (
          <>
            <div className="fixed inset-0 z-[110]" onClick={() => setOpenMenuId(null)}></div>
            <div className="fixed z-[120] w-60 bg-[#111827] border border-[#374151] shadow-[0_20px_50px_rgba(0,0,0,0.8)] rounded-2xl py-2 animate-in fade-in zoom-in-95 duration-100 ring-1 ring-white/10" style={{ top: menuPosition.top, right: menuPosition.right }}>
                {['Ready to Ship', 'Manifest', 'Pickup Scheduled', 'In Transit', 'Out For Delivery', 'Delivered'].includes(activeMenuOrder.status) && (
                    <>
                      <MenuItem icon={Printer} title="Print Label" desc="Shipping label for package" onClick={() => { setOpenMenuId(null); printLabel(activeMenuOrder, labelSettings, brandLogo); }} />
                      <MenuItem icon={FileText} title="Print Invoice" desc="GST Tax Invoice copy" onClick={() => { setOpenMenuId(null); printInvoice(activeMenuOrder, invoiceSettings, brandLogo); }} />
                      {activeMenuOrder.isInsured && (
                          <MenuItem icon={Shield} title="Insurance Label" desc="Digital protection cert" colorClass="text-indigo-400" onClick={() => { setOpenMenuId(null); printInsuranceLabel(activeMenuOrder, brandLogo); }} />
                      )}
                      <div className="h-px bg-[#1F2937] my-1 mx-2"></div>
                    </>
                )}
                {['New', 'Ready to Ship'].includes(activeMenuOrder.status) && (
                    <MenuItem icon={Edit} title="Edit Packet" desc="Modify order details" onClick={() => { setOpenMenuId(null); onEditOrder(activeMenuOrder); }} />
                )}
                <MenuItem icon={Copy} title="Duplicate Packet" desc="Create identical order" onClick={() => { setOpenMenuId(null); onCloneOrder(activeMenuOrder); }} />
                <div className="h-px bg-[#1F2937] my-1 mx-2"></div>
                <MenuItem 
                    icon={XSquare} 
                    title="Cancel Packet" 
                    desc={['Manifest', 'Pickup Scheduled', 'In Transit', 'Out For Delivery'].includes(activeMenuOrder.status) ? "No refund after pickup" : "API order cancellation"} 
                    onClick={() => { setOpenMenuId(null); onCancelShipment(activeMenuOrder.id); }} 
                    isDestructive 
                />
            </div>
          </>
      )}

      {/* Shipping Engine Modal */}
      {isShipModalOpen && orderToShip && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/95 backdrop-blur-3xl animate-in fade-in duration-300">
              <div className="bg-[#111827] w-full max-w-2xl rounded-[4rem] border border-[#1F2937] shadow-[0_0_150px_rgba(14,165,233,0.2)] overflow-hidden flex flex-col">
                  <div className="p-10 border-b border-[#1F2937] bg-[#0B1020]/50 flex justify-between items-center">
                      <div className="flex items-center gap-6">
                          <div className="p-4 bg-brand-600 rounded-3xl text-white shadow-xl shadow-brand-900/30"><Ship size={32} /></div>
                          <div>
                            <h3 className="text-2xl font-black text-white uppercase tracking-tighter">Shipping Engine</h3>
                            <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest mt-1">Full System Courier Network for {orderToShip.id}</p>
                          </div>
                      </div>
                      <button onClick={() => { setIsShipModalOpen(false); setOrderToShip(null); setSelectedCourierId(null); }} className="p-3 text-slate-600 hover:text-white transition-colors bg-[#1F2937] rounded-full"><X size={24} /></button>
                  </div>

                  <div className="p-6 space-y-3 max-h-[55vh] overflow-y-auto custom-scrollbar bg-[#0B1020]/30">
                      {COURIERS.map(courier => (
                          <div 
                            key={courier.id} 
                            onClick={() => setSelectedCourierId(courier.id)}
                            className={`p-5 bg-[#0B1020] border-2 rounded-[1.8rem] transition-all flex justify-between items-center cursor-pointer active:scale-[0.99] ${selectedCourierId === courier.id ? 'border-brand-500 ring-4 ring-brand-500/10' : 'border-[#1F2937] hover:border-slate-700'}`}
                          >
                              <div className="flex items-center gap-5">
                                  <div className="w-14 h-10 bg-white rounded-xl p-2 flex items-center justify-center">
                                      <img src={courier.logo} className="max-w-full max-h-full object-contain" />
                                  </div>
                                  <div>
                                      <div className="text-[12px] font-black text-white uppercase tracking-tight">{courier.name}</div>
                                      <div className="text-[8px] font-bold text-slate-500 uppercase tracking-widest mt-1">Mode: {courier.type} • TAT: 1-3 Days</div>
                                  </div>
                              </div>
                              <div className="flex items-center gap-4">
                                  <div className="text-right">
                                      <div className="text-xl font-black text-brand-400 font-mono tracking-tighter">₹{courier.rate.toFixed(2)}</div>
                                  </div>
                                  <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all ${selectedCourierId === courier.id ? 'bg-brand-600 border-brand-500' : 'border-slate-700'}`}>
                                      {selectedCourierId === courier.id && <CheckIcon size={12} className="text-white" />}
                                  </div>
                              </div>
                          </div>
                      ))}
                  </div>

                  <div className="p-10 border-t border-[#1F2937] bg-[#0B1020]/50 flex items-center justify-between gap-6">
                     <div className="flex-1">
                        {selectedCourierId && (
                           <div className="animate-in fade-in slide-in-from-left-2 duration-300">
                              <div className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Selected Carrier</div>
                              <div className="text-sm font-black text-brand-400 uppercase">{COURIERS.find(c => c.id === selectedCourierId)?.name}</div>
                           </div>
                        )}
                     </div>
                     <button 
                        disabled={!selectedCourierId}
                        onClick={handleConfirmShip}
                        className={`px-12 py-5 rounded-[1.5rem] font-black uppercase text-xs tracking-[0.2em] transition-all flex items-center gap-3 shadow-2xl active:scale-95 ${selectedCourierId ? 'bg-brand-600 text-white hover:bg-brand-700 shadow-brand-900/30' : 'bg-[#1F2937] text-slate-700 cursor-not-allowed border border-[#374151]'}`}
                     >
                        <Zap size={18} fill="currentColor" />
                        SHIP NOW
                     </button>
                  </div>
              </div>
          </div>
      )}
    </div>
  );
};
