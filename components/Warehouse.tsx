
import React, { useState } from 'react';
import { 
  Plus, 
  Upload, 
  Download, 
  RefreshCcw, 
  Settings, 
  Edit2, 
  MapPin, 
  Phone, 
  Mail,
  X,
  Save,
  CheckCircle2
} from 'lucide-react';

export const Warehouse: React.FC = () => {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const [warehouses, setWarehouses] = useState([
    {
      sno: 1,
      id: '91007',
      title: 'JASWINDER',
      contact: {
        name: 'JASWINDER SINGH',
        email: 'internationalvashu@gmail.com',
        phone: '8306108152'
      },
      pincode: '110008',
      address: '7/36 2nd floor sout patel nagar new delhi 110008',
      city: 'New Delhi',
      state: 'Delhi',
      createdBy: 'KDS',
      createdAt: '26 Nov 2025, 10:02 PM',
      status: 'Active'
    },
    {
      sno: 2,
      id: '89918',
      title: 'MANISH HASIJA',
      contact: {
        name: 'MANISH HASIJA',
        email: 'SONUSANDY97@GMAIL.COM',
        phone: '9717624831'
      },
      pincode: '110018',
      address: 'S/O. MADAN LAL HASIJA ,WZ-66B RAM NAGAR TILAK NAGAR',
      city: 'Delhi',
      state: 'Delhi',
      createdBy: 'KDS',
      createdAt: '20 Nov 2025, 04:45 PM',
      status: 'Active'
    },
    {
      sno: 3,
      id: '89142',
      title: 'IMRAN',
      contact: {
        name: 'IMRAN ANSARI',
        email: 'Sonusandy97@gmail.com',
        phone: '9871581526'
      },
      pincode: '400602',
      address: 'Br. Code M07,THANE BRANCH , SHOP.A, GROUND FLOOR,, ANAND KAVACH BUILDING',
      city: 'Greater Thane',
      state: 'Maharashtra',
      createdBy: 'KDS',
      createdAt: '17 Nov 2025, 01:11 PM',
      status: 'In-Active'
    },
    {
      sno: 4,
      id: '88689',
      title: 'HOUSE',
      contact: {
        name: 'MANISH HASIJA',
        email: 'Sonusandy97@gmail.com',
        phone: '9717624831'
      },
      pincode: '110018',
      address: 'S/O MADAN LAL HASIJA WZ66 B RAM NAGAR TILAK NAGAR, TILAK NAGAR NEW DELHI',
      city: 'Delhi',
      state: 'Delhi',
      createdBy: 'KDS',
      createdAt: '14 Nov 2025, 01:04 PM',
      status: 'Active'
    },
    {
      sno: 5,
      id: '87316',
      title: 'KDS',
      contact: {
        name: 'KDS',
        email: 'Sonusandy97@gmail.com',
        phone: '9717624831'
      },
      pincode: '110018',
      address: 'wz23 chowkhandi ext tialk nagar new delhi',
      city: 'Delhi',
      state: 'Delhi',
      createdBy: 'KDS',
      createdAt: '7 Nov 2025, 03:13 PM',
      status: 'Active'
    }
  ]);

  // Form State
  const [formData, setFormData] = useState({
    title: '',
    contactName: '',
    phone: '',
    email: '',
    address: '',
    pincode: '',
    city: '',
    state: ''
  });

  // Helper to detect Indian Pincode
  const lookupIndianPincode = (pincode: string) => {
    if (!/^\d{6}$/.test(pincode)) return null;
    
    const prefix2 = parseInt(pincode.substring(0, 2));

    if (prefix2 === 11) return { city: 'New Delhi', state: 'Delhi' };
    if (prefix2 >= 12 && prefix2 <= 13) return { city: 'Gurgaon', state: 'Haryana' };
    if (prefix2 >= 14 && prefix2 <= 16) return { city: 'Ludhiana', state: 'Punjab' };
    if (prefix2 === 17) return { city: 'Shimla', state: 'Himachal Pradesh' };
    if (prefix2 >= 18 && prefix2 <= 19) return { city: 'Srinagar', state: 'Jammu & Kashmir' };
    if (prefix2 >= 20 && prefix2 <= 28) return { city: 'Lucknow', state: 'Uttar Pradesh' };
    if (prefix2 >= 30 && prefix2 <= 34) return { city: 'Jaipur', state: 'Rajasthan' };
    if (prefix2 >= 36 && prefix2 <= 39) return { city: 'Ahmedabad', state: 'Gujarat' };
    if (prefix2 >= 40 && prefix2 <= 44) return { city: 'Mumbai', state: 'Maharashtra' };
    if (prefix2 >= 45 && prefix2 <= 48) return { city: 'Indore', state: 'Madhya Pradesh' };
    if (prefix2 >= 50 && prefix2 <= 53) return { city: 'Hyderabad', state: 'Telangana' };
    if (prefix2 >= 56 && prefix2 <= 59) return { city: 'Bangalore', state: 'Karnataka' };
    if (prefix2 >= 60 && prefix2 <= 64) return { city: 'Chennai', state: 'Tamil Nadu' };
    if (prefix2 >= 67 && prefix2 <= 69) return { city: 'Kochi', state: 'Kerala' };
    if (prefix2 >= 70 && prefix2 <= 74) return { city: 'Kolkata', state: 'West Bengal' };
    if (prefix2 >= 75 && prefix2 <= 77) return { city: 'Bhubaneswar', state: 'Odisha' };
    if (prefix2 === 78) return { city: 'Guwahati', state: 'Assam' };
    if (prefix2 === 79) return { city: 'Shillong', state: 'Meghalaya' };
    if (prefix2 >= 80 && prefix2 <= 85) return { city: 'Patna', state: 'Bihar' };
    
    return { city: 'Unknown City', state: 'Unknown State' };
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));

    if (name === 'pincode') {
        if (value.length === 6) {
            const details = lookupIndianPincode(value);
            if (details) {
                setFormData(prev => ({ 
                    ...prev, 
                    pincode: value, 
                    city: details.city, 
                    state: details.state 
                }));
            } else {
                setFormData(prev => ({ ...prev, pincode: value }));
            }
        } else {
             // Reset if incomplete
             if (formData.city && value.length < 6) {
                 setFormData(prev => ({ ...prev, pincode: value, city: '', state: '' }));
             }
        }
    }
  };

  const handleOpenAdd = () => {
      setEditingId(null);
      setFormData({
        title: '',
        contactName: '',
        phone: '',
        email: '',
        address: '',
        pincode: '',
        city: '',
        state: ''
      });
      setIsAddModalOpen(true);
  };

  const handleEdit = (warehouse: any) => {
      setEditingId(warehouse.id);
      
      // Try to auto-resolve city/state from pincode if not explicitly in data
      let location = lookupIndianPincode(warehouse.pincode);
      
      setFormData({
        title: warehouse.title,
        contactName: warehouse.contact.name,
        phone: warehouse.contact.phone,
        email: warehouse.contact.email,
        address: warehouse.address,
        pincode: warehouse.pincode,
        city: warehouse.city || location?.city || '',
        state: warehouse.state || location?.state || ''
      });
      setIsAddModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (editingId) {
        // Update Existing
        setWarehouses(prev => prev.map(w => w.id === editingId ? {
            ...w,
            title: formData.title,
            contact: {
                name: formData.contactName,
                email: formData.email,
                phone: formData.phone
            },
            pincode: formData.pincode,
            address: formData.address,
            city: formData.city,
            state: formData.state
        } : w));
    } else {
        // Add New
        const newWarehouse = {
            sno: warehouses.length + 1,
            id: Math.floor(Math.random() * 90000 + 10000).toString(),
            title: formData.title,
            contact: {
                name: formData.contactName,
                email: formData.email,
                phone: formData.phone
            },
            pincode: formData.pincode,
            address: formData.address,
            city: formData.city,
            state: formData.state,
            createdBy: 'Admin',
            createdAt: new Date().toLocaleString('en-GB', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }),
            status: 'Active'
        };
        setWarehouses([newWarehouse, ...warehouses]);
    }

    setIsAddModalOpen(false);
    setFormData({ title: '', contactName: '', phone: '', email: '', address: '', pincode: '', city: '', state: '' });
    setEditingId(null);
  };

  return (
    <div className="p-6 bg-[#0B1020] min-h-full font-sans text-gray-300">
      {/* Header */}
      <div className="bg-[#111827] p-4 rounded-xl border border-[#1F2937] shadow-sm mb-6 flex flex-col md:flex-row justify-between items-center gap-4">
        <h2 className="text-lg font-bold text-gray-100 flex items-center gap-2">
          <MapPin size={20} className="text-brand-400" /> Warehouse / Pick-up Addresses
        </h2>
        <div className="flex gap-3">
          <button className="px-4 py-2 border border-[#374151] text-gray-400 hover:bg-[#1F2937] hover:text-white rounded-lg text-sm font-medium transition-colors">
            Bulk Upload
          </button>
          <button 
            onClick={handleOpenAdd}
            className="px-4 py-2 bg-brand-600 hover:bg-brand-700 text-white rounded-lg text-sm font-medium transition-colors flex items-center gap-2 shadow-sm"
          >
            <Plus size={16} /> Add New
          </button>
        </div>
      </div>

      {/* Table Controls */}
      <div className="bg-[#111827] rounded-t-xl border border-[#1F2937] border-b-0 p-3 flex justify-end gap-2">
        <button className="p-2 bg-[#1F2937] hover:bg-[#374151] text-gray-400 hover:text-white rounded-lg transition-colors border border-[#374151]">
          <Download size={18} />
        </button>
        <button className="p-2 bg-[#1F2937] hover:bg-[#374151] text-gray-400 hover:text-white rounded-lg transition-colors border border-[#374151]">
          <RefreshCcw size={18} />
        </button>
        <button className="p-2 bg-[#1F2937] hover:bg-[#374151] text-gray-400 hover:text-white rounded-lg transition-colors border border-[#374151]">
          <Settings size={18} />
        </button>
      </div>

      {/* Table */}
      <div className="bg-[#111827] rounded-b-xl border border-[#1F2937] shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#0B1020] text-gray-400 font-bold border-b border-[#374151] uppercase">
              <tr>
                <th className="p-4 text-center w-16">S.No.</th>
                <th className="p-4 w-20">ID</th>
                <th className="p-4">Title</th>
                <th className="p-4 min-w-[200px]">Contact Details</th>
                <th className="p-4">Pincode</th>
                <th className="p-4 min-w-[300px]">Address</th>
                <th className="p-4">Created By</th>
                <th className="p-4 min-w-[150px]">Created At</th>
                <th className="p-4 text-center">Status</th>
                <th className="p-4 text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#374151]">
              {warehouses.map((item) => (
                <tr key={item.id} className="hover:bg-[#1F2937] transition-colors group">
                  <td className="p-4 text-center text-gray-500">{item.sno}</td>
                  <td className="p-4 font-bold text-gray-300">{item.id}</td>
                  <td className="p-4">
                    <span 
                        onClick={() => handleEdit(item)}
                        className="text-brand-400 font-bold uppercase cursor-pointer hover:underline"
                    >
                      {item.title}
                    </span>
                  </td>
                  <td className="p-4">
                    <div className="font-bold text-gray-200 uppercase text-[11px] mb-0.5">{item.contact.name}</div>
                    <div className="text-gray-500 text-[10px]">{item.contact.email}</div>
                    <div className="text-gray-500 text-[10px]">{item.contact.phone}</div>
                  </td>
                  <td className="p-4 text-gray-400">{item.pincode}</td>
                  <td className="p-4 text-gray-400 leading-relaxed max-w-xs uppercase text-[10px]">
                    {item.address}<br/>
                    <span className="text-gray-500 font-medium">{item.city}, {item.state}, India</span>
                  </td>
                  <td className="p-4 text-gray-400 font-medium">{item.createdBy}</td>
                  <td className="p-4 text-gray-500">{item.createdAt}</td>
                  <td className="p-4 text-center">
                    <span 
                      className={`
                        inline-block px-3 py-1 rounded-full text-[10px] font-bold text-white
                        ${item.status === 'Active' ? 'bg-emerald-600 border border-emerald-900' : 'bg-orange-600 border border-orange-900'}
                      `}
                    >
                      {item.status}
                    </span>
                  </td>
                  <td className="p-4 text-center">
                    <button 
                        onClick={() => handleEdit(item)}
                        className="p-1.5 text-brand-400 hover:bg-[#1F2937] rounded-lg transition-colors border border-transparent hover:border-[#374151]"
                        title="Edit Warehouse"
                    >
                      <Edit2 size={16} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {/* Pagination */}
        <div className="p-4 border-t border-[#374151] text-xs text-gray-500 flex justify-between items-center bg-[#111827]">
          <span>Showing 1 to {warehouses.length} of {warehouses.length}</span>
        </div>
      </div>

      {/* Add/Edit Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-[#111827] rounded-2xl w-full max-w-2xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200 border border-[#1F2937]">
                <div className="p-6 border-b border-[#374151] flex justify-between items-center bg-[#0B1020]">
                    <h3 className="text-lg font-bold text-gray-100">{editingId ? 'Edit Warehouse' : 'Add New Warehouse'}</h3>
                    <button onClick={() => setIsAddModalOpen(false)} className="text-gray-400 hover:text-white">
                        <X size={20} />
                    </button>
                </div>
                
                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                            <label className="text-xs font-semibold text-gray-400">Warehouse Title <span className="text-red-500">*</span></label>
                            <input 
                                required
                                name="title"
                                value={formData.title}
                                onChange={handleInputChange}
                                type="text" 
                                placeholder="e.g. Main Branch" 
                                className="w-full px-3 py-2 border border-[#374151] bg-[#0B1020] rounded-lg text-sm text-white focus:outline-none focus:border-brand-500 placeholder-gray-600" 
                            />
                        </div>
                        <div className="space-y-1.5">
                            <label className="text-xs font-semibold text-gray-400">Contact Person Name <span className="text-red-500">*</span></label>
                            <input 
                                required
                                name="contactName"
                                value={formData.contactName}
                                onChange={handleInputChange}
                                type="text" 
                                placeholder="Enter name" 
                                className="w-full px-3 py-2 border border-[#374151] bg-[#0B1020] rounded-lg text-sm text-white focus:outline-none focus:border-brand-500 placeholder-gray-600" 
                            />
                        </div>
                        <div className="space-y-1.5">
                            <label className="text-xs font-semibold text-gray-400">Phone Number <span className="text-red-500">*</span></label>
                            <input 
                                required
                                name="phone"
                                value={formData.phone}
                                onChange={handleInputChange}
                                type="tel" 
                                placeholder="Enter phone" 
                                className="w-full px-3 py-2 border border-[#374151] bg-[#0B1020] rounded-lg text-sm text-white focus:outline-none focus:border-brand-500 placeholder-gray-600" 
                            />
                        </div>
                        <div className="space-y-1.5">
                            <label className="text-xs font-semibold text-gray-400">Email ID <span className="text-red-500">*</span></label>
                            <input 
                                required
                                name="email"
                                value={formData.email}
                                onChange={handleInputChange}
                                type="email" 
                                placeholder="Enter email" 
                                className="w-full px-3 py-2 border border-[#374151] bg-[#0B1020] rounded-lg text-sm text-white focus:outline-none focus:border-brand-500 placeholder-gray-600" 
                            />
                        </div>
                    </div>

                    <div className="space-y-1.5">
                        <label className="text-xs font-semibold text-gray-400">Address <span className="text-red-500">*</span></label>
                        <textarea 
                            required
                            name="address"
                            value={formData.address}
                            onChange={handleInputChange}
                            placeholder="Full address (Building, Street, Area)" 
                            className="w-full px-3 py-2 border border-[#374151] bg-[#0B1020] rounded-lg text-sm text-white focus:outline-none focus:border-brand-500 resize-none h-20 placeholder-gray-600" 
                        />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="space-y-1.5">
                            <label className="text-xs font-semibold text-gray-400">Pincode <span className="text-red-500">*</span></label>
                            <div className="relative">
                                <input 
                                    required
                                    name="pincode"
                                    value={formData.pincode}
                                    onChange={handleInputChange}
                                    type="text" 
                                    placeholder="6 digit pincode" 
                                    maxLength={6}
                                    className={`w-full px-3 py-2 border border-[#374151] bg-[#0B1020] rounded-lg text-sm text-white focus:outline-none focus:border-brand-500 placeholder-gray-600 ${formData.city ? 'border-brand-500 ring-1 ring-brand-900' : ''}`} 
                                />
                                {formData.city && <CheckCircle2 size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-brand-500" />}
                            </div>
                        </div>
                        <div className="space-y-1.5">
                            <label className="text-xs font-semibold text-gray-400">City</label>
                            <input 
                                readOnly
                                name="city"
                                value={formData.city}
                                type="text" 
                                placeholder="Auto-detected" 
                                className="w-full px-3 py-2 border border-[#374151] bg-[#1F2937] rounded-lg text-sm text-gray-400 focus:outline-none font-medium cursor-not-allowed" 
                            />
                        </div>
                        <div className="space-y-1.5">
                            <label className="text-xs font-semibold text-gray-400">State</label>
                            <input 
                                readOnly
                                name="state"
                                value={formData.state}
                                type="text" 
                                placeholder="Auto-detected" 
                                className="w-full px-3 py-2 border border-[#374151] bg-[#1F2937] rounded-lg text-sm text-gray-400 focus:outline-none font-medium cursor-not-allowed" 
                            />
                        </div>
                    </div>

                    <div className="pt-4 border-t border-[#374151] flex justify-end gap-3 bg-[#0B1020] -mx-6 -mb-6 p-6 mt-2 rounded-b-2xl">
                        <button 
                            type="button" 
                            onClick={() => setIsAddModalOpen(false)}
                            className="px-6 py-2.5 border border-[#374151] text-gray-400 font-medium rounded-lg hover:bg-[#1F2937] hover:text-white transition-colors text-sm"
                        >
                            Cancel
                        </button>
                        <button 
                            type="submit"
                            className="px-6 py-2.5 bg-brand-600 hover:bg-brand-700 text-white font-medium rounded-lg transition-colors text-sm shadow-sm flex items-center gap-2"
                        >
                            <Save size={16} /> {editingId ? 'Update Warehouse' : 'Save Warehouse'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
      )}
    </div>
  );
};
