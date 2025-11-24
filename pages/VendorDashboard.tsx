
import React, { useState, useMemo, useRef, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { Product, Condition, Origin, Vendor } from '../types';
import { Button } from '../components/ui/Button';
import { Plus, Package, DollarSign, Tag, Settings, BarChart3, Store, Camera, MapPin, Phone, Mail, Save, Loader2, Upload, Image as ImageIcon } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

export const VendorDashboard: React.FC = () => {
  const { currentUser, updateUserProfile, updateVendorProfile, vendors, vehicles, products, addProduct, isLoading } = useApp();
  const [activeTab, setActiveTab] = useState<'listings' | 'add' | 'analytics' | 'profile'>('listings');
  const [isAddingProduct, setIsAddingProduct] = useState(false);
  const [isSavingProfile, setIsSavingProfile] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // Refs for Profile Images
  const logoInputRef = useRef<HTMLInputElement>(null);
  const bannerInputRef = useRef<HTMLInputElement>(null);

  // Derived State: Filter global products for this vendor
  const vendorProducts = useMemo(() => {
    if (!currentUser.vendorId) return [];
    return products.filter(p => p.vendorId === currentUser.vendorId);
  }, [products, currentUser.vendorId]);

  // Derived State: Get current vendor details
  const currentVendor = useMemo(() => {
    return vendors.find(v => v.id === currentUser.vendorId);
  }, [vendors, currentUser.vendorId]);

  // Mock adding state
  const [formData, setFormData] = useState<Partial<Product>>({
    title: '',
    price: 0,
    condition: Condition.New,
    origin: Origin.Japan,
    compatibleVehicleIds: [],
    category: 'General',
    imageUrl: ''
  });

  // Profile State
  const [profileData, setProfileData] = useState<Partial<Vendor>>({
    name: '',
    description: '',
    phone: '',
    email: '',
    address: '',
    category: 'General Auto Parts',
    logoUrl: '',
    bannerUrl: ''
  });

  // Populate profile form when tab changes or vendor loads
  useEffect(() => {
    if (currentVendor) {
      setProfileData({
        name: currentVendor.name || '',
        description: currentVendor.description || '',
        phone: currentVendor.phone || '',
        email: currentVendor.email || '',
        address: currentVendor.location || '',
        category: currentVendor.category || 'General Auto Parts',
        logoUrl: currentVendor.logoUrl || '',
        bannerUrl: currentVendor.bannerUrl || ''
      });
    }
  }, [currentVendor, activeTab]);

  // Mock Analytics Data
  const analyticsData = [
    { name: 'Mon', Sales: 40000 },
    { name: 'Tue', Sales: 30000 },
    { name: 'Wed', Sales: 20000 },
    { name: 'Thu', Sales: 27800 },
    { name: 'Fri', Sales: 18900 },
    { name: 'Sat', Sales: 93900 },
    { name: 'Sun', Sales: 54900 },
  ];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleProfileChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setProfileData(prev => ({ ...prev, [name]: value }));
  };

  const toggleVehicleCompatibility = (vehicleId: string) => {
    setFormData(prev => {
      const current = prev.compatibleVehicleIds || [];
      if (current.includes(vehicleId)) {
        return { ...prev, compatibleVehicleIds: current.filter(id => id !== vehicleId) };
      } else {
        return { ...prev, compatibleVehicleIds: [...current, vehicleId] };
      }
    });
  };

  // Generic Image Upload Handler
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>, field: 'logoUrl' | 'bannerUrl' | 'productImage') => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 1024 * 1024) {
        alert("Image size is too large. Please select an image under 1MB.");
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        if (field === 'productImage') {
            setFormData(prev => ({ ...prev, imageUrl: result }));
        } else {
            setProfileData(prev => ({ ...prev, [field]: result }));
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsAddingProduct(true);
    
    try {
      await addProduct({
        ...formData,
        price: Number(formData.price), // Ensure number
      });
      
      // Reset form
      setFormData({
        title: '',
        price: 0,
        condition: Condition.New,
        origin: Origin.Japan,
        compatibleVehicleIds: [],
        category: 'General',
        imageUrl: ''
      });
      
      setActiveTab('listings');
    } catch (error) {
      console.error("Failed to add product", error);
      alert("Failed to add product. Please try again.");
    } finally {
      setIsAddingProduct(false);
    }
  };

  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser.vendorId) return;

    setIsSavingProfile(true);
    try {
        await updateVendorProfile(currentUser.vendorId, {
            name: profileData.name,
            description: profileData.description,
            phone: profileData.phone,
            email: profileData.email,
            location: profileData.address,
            category: profileData.category,
            logoUrl: profileData.logoUrl,
            bannerUrl: profileData.bannerUrl
        });
        alert("Store profile updated successfully!");
    } catch (error) {
        alert("Failed to update profile.");
    } finally {
        setIsSavingProfile(false);
    }
  };

  // Sample fill helper for Product
  const fillSample = () => {
    if (!formData.title) {
      setFormData({
        ...formData,
        title: 'Honda Fit GP5 Brake Pads',
        price: 8500,
        category: 'Brakes'
      });
    }
  };

  // Sample fill helper for Profile
  const fillProfileSample = () => {
    if (!profileData.description) {
      setProfileData({
        ...profileData,
        name: 'Silva Auto Spares',
        description: 'Leading importer of reconditioned Japanese auto parts in Sri Lanka. We specialize in Toyota and Honda hybrid vehicle parts.',
        phone: '077 123 4567',
        email: 'sales@silvaauto.lk',
        address: 'No. 45, Sri Sangaraja Mawatha, Colombo 10',
        category: 'Body & Engine Parts'
      });
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row gap-8">
        {/* Sidebar */}
        <div className="w-full md:w-64 shrink-0">
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 sticky top-24">
            <div className="flex items-center gap-3 mb-8">
              <div className="h-12 w-12 bg-primary rounded-full flex items-center justify-center text-white font-bold text-xl overflow-hidden">
                {profileData.logoUrl ? (
                    <img src={profileData.logoUrl} alt="Logo" className="w-full h-full object-cover" />
                ) : (
                    currentUser.name.charAt(0)
                )}
              </div>
              <div>
                <h3 className="font-bold text-slate-800">{currentUser.name}</h3>
                <p className="text-xs text-slate-500 uppercase tracking-wider">Verified Seller</p>
              </div>
            </div>
            
            <nav className="space-y-2">
              <button 
                onClick={() => setActiveTab('listings')}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-colors ${activeTab === 'listings' ? 'bg-slate-100 text-secondary' : 'text-slate-600 hover:bg-slate-50'}`}
              >
                <Package className="h-5 w-5" /> My Listings
              </button>
              <button 
                onClick={() => setActiveTab('add')}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-colors ${activeTab === 'add' ? 'bg-slate-100 text-secondary' : 'text-slate-600 hover:bg-slate-50'}`}
              >
                <Plus className="h-5 w-5" /> Add New Product
              </button>
              <button 
                onClick={() => setActiveTab('analytics')}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-colors ${activeTab === 'analytics' ? 'bg-slate-100 text-secondary' : 'text-slate-600 hover:bg-slate-50'}`}
              >
                <BarChart3 className="h-5 w-5" /> Analytics
              </button>
              <button 
                onClick={() => setActiveTab('profile')}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-colors ${activeTab === 'profile' ? 'bg-slate-100 text-secondary' : 'text-slate-600 hover:bg-slate-50'}`}
              >
                <Store className="h-5 w-5" /> Store Profile
              </button>
              <button className="w-full flex items-center gap-3 px-4 py-3 rounded-lg font-medium text-slate-600 hover:bg-slate-50 transition-colors">
                <Settings className="h-5 w-5" /> Settings
              </button>
            </nav>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1">
          {activeTab === 'listings' && (
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
              <div className="p-6 border-b border-slate-100 flex justify-between items-center">
                <h2 className="text-xl font-bold text-slate-800">My Inventory</h2>
                <Button size="sm" onClick={() => setActiveTab('add')}>
                  <Plus className="h-4 w-4" /> Add Product
                </Button>
              </div>
              <div className="overflow-x-auto">
                {isLoading ? (
                  <div className="p-12 flex flex-col items-center justify-center text-slate-500">
                     <Loader2 className="h-8 w-8 animate-spin mb-2 text-secondary" />
                     <p>Loading inventory...</p>
                  </div>
                ) : vendorProducts.length > 0 ? (
                  <table className="w-full text-left">
                    <thead className="bg-slate-50 text-slate-600 text-xs uppercase font-semibold tracking-wider">
                      <tr>
                        <th className="px-6 py-4">Product</th>
                        <th className="px-6 py-4">Price (LKR)</th>
                        <th className="px-6 py-4">Condition</th>
                        <th className="px-6 py-4">Stock</th>
                        <th className="px-6 py-4">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {vendorProducts.map(product => (
                        <tr key={product.id} className="hover:bg-slate-50 transition-colors">
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-3">
                              <img src={product.imageUrl} alt="" className="h-10 w-10 rounded object-cover bg-slate-200" />
                              <span className="font-medium text-slate-900">{product.title}</span>
                            </div>
                          </td>
                          <td className="px-6 py-4 text-slate-600">{product.price.toLocaleString()}</td>
                          <td className="px-6 py-4">
                            <span className="px-2 py-1 rounded text-xs font-medium bg-slate-100 text-slate-700">
                              {product.condition}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-slate-600">{product.stock}</td>
                          <td className="px-6 py-4">
                            <span className="text-green-600 text-xs font-bold flex items-center gap-1">
                              <div className="h-2 w-2 bg-green-500 rounded-full"></div> Active
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                ) : (
                   <div className="p-12 text-center text-slate-500">
                      <p>No products found. Click "Add Product" to start selling.</p>
                   </div>
                )}
              </div>
            </div>
          )}

          {activeTab === 'add' && (
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 relative">
              <h2 className="text-xl font-bold text-slate-800 mb-6">Add New Product</h2>
              <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl">
                {isAddingProduct && (
                   <div className="absolute inset-0 bg-white/70 z-10 flex items-center justify-center rounded-xl">
                      <div className="flex flex-col items-center">
                         <Loader2 className="h-10 w-10 animate-spin text-secondary mb-2" />
                         <span className="font-medium text-slate-800">Saving Product...</span>
                      </div>
                   </div>
                )}

                {/* IMAGE UPLOAD SECTION */}
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-slate-700">Product Image</label>
                  <div className="flex items-start gap-4">
                    <div 
                      onClick={() => fileInputRef.current?.click()}
                      className="h-32 w-32 rounded-lg border-2 border-dashed border-slate-300 flex flex-col items-center justify-center text-slate-400 cursor-pointer hover:border-secondary hover:text-secondary hover:bg-slate-50 transition-colors overflow-hidden"
                    >
                      {formData.imageUrl ? (
                        <img src={formData.imageUrl} alt="Preview" className="w-full h-full object-cover" />
                      ) : (
                        <>
                          <Upload className="h-8 w-8 mb-1" />
                          <span className="text-xs">Upload Photo</span>
                        </>
                      )}
                    </div>
                    
                    <div className="flex-1 space-y-2">
                      <p className="text-xs text-slate-500">
                        Upload a clear image of your part. Supports JPG, PNG. Max 1MB.
                      </p>
                      <input 
                        type="file" 
                        ref={fileInputRef} 
                        onChange={(e) => handleFileUpload(e, 'productImage')} 
                        accept="image/*"
                        className="hidden" 
                      />
                      
                      {/* Optional URL Input Fallback */}
                      <div className="relative">
                        <ImageIcon className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                        <input 
                          type="text" 
                          name="imageUrl"
                          value={formData.imageUrl}
                          onChange={handleInputChange}
                          placeholder="Or paste image URL..."
                          className="w-full pl-9 p-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-secondary focus:border-transparent"
                        />
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-slate-700">Product Title</label>
                  <input 
                    type="text" 
                    name="title"
                    value={formData.title}
                    className="w-full p-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-secondary focus:border-transparent bg-white text-slate-900"
                    placeholder="e.g. Toyota Axio 2015 Headlight"
                    onClick={fillSample}
                    onChange={handleInputChange}
                    title="Click to fill sample data"
                    required
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-slate-700 flex items-center gap-2">
                      <DollarSign className="h-4 w-4" /> Price (LKR)
                    </label>
                    <input 
                      type="number" 
                      name="price"
                      value={formData.price || ''}
                      className="w-full p-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-secondary focus:border-transparent bg-white text-slate-900"
                      placeholder="0.00"
                      onClick={fillSample}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-slate-700 flex items-center gap-2">
                      <Tag className="h-4 w-4" /> Category
                    </label>
                    <select 
                      name="category" 
                      value={formData.category}
                      className="w-full p-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-secondary bg-white text-slate-900" 
                      onChange={handleInputChange}
                    >
                      <option>Engine & Drivetrain</option>
                      <option>Body Parts</option>
                      <option>Lighting</option>
                      <option>Suspension</option>
                      <option>Electrical</option>
                      <option>Brakes</option>
                      <option>General</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-slate-700">Condition</label>
                    <select 
                      name="condition" 
                      value={formData.condition}
                      className="w-full p-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-secondary bg-white text-slate-900" 
                      onChange={handleInputChange}
                    >
                      {Object.values(Condition).map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-slate-700">Origin</label>
                    <select 
                      name="origin" 
                      value={formData.origin}
                      className="w-full p-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-secondary bg-white text-slate-900" 
                      onChange={handleInputChange}
                    >
                      {Object.values(Origin).map(o => <option key={o} value={o}>{o}</option>)}
                    </select>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-slate-700">Vehicle Compatibility (Tag all that apply)</label>
                  <div className="p-4 border border-slate-300 rounded-lg h-48 overflow-y-auto bg-slate-50 grid grid-cols-1 md:grid-cols-2 gap-2">
                    {vehicles.map(v => (
                      <label key={v.id} className="flex items-center space-x-2 p-2 bg-white rounded border border-slate-200 hover:border-secondary cursor-pointer transition-colors">
                        <input 
                          type="checkbox" 
                          checked={formData.compatibleVehicleIds?.includes(v.id)}
                          onChange={() => toggleVehicleCompatibility(v.id)}
                          className="rounded text-secondary focus:ring-secondary bg-white border-slate-300"
                        />
                        <span className="text-sm text-slate-700">{v.make} {v.model} ({v.yearStart}-{v.yearEnd || 'Present'})</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div className="pt-4">
                  <Button type="submit" className="w-full md:w-auto" disabled={isAddingProduct}>
                     {isAddingProduct ? 'Publishing...' : 'Publish Listing'}
                  </Button>
                </div>

              </form>
            </div>
          )}

          {activeTab === 'analytics' && (
             <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
               <h2 className="text-xl font-bold text-slate-800 mb-6">Weekly Sales Overview</h2>
               <div className="h-[400px] w-full">
                 <ResponsiveContainer width="100%" height="100%">
                   <BarChart data={analyticsData}>
                     <CartesianGrid strokeDasharray="3 3" />
                     <XAxis dataKey="name" />
                     <YAxis />
                     <Tooltip />
                     <Legend />
                     <Bar dataKey="Sales" fill="#f97316" name="Revenue (LKR)" />
                   </BarChart>
                 </ResponsiveContainer>
               </div>
             </div>
          )}

          {activeTab === 'profile' && (
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 relative">
              <h2 className="text-xl font-bold text-slate-800 mb-2">Store Profile</h2>
              <p className="text-slate-500 mb-8">Manage your public store front and contact details.</p>

               {isSavingProfile && (
                   <div className="absolute inset-0 bg-white/70 z-10 flex items-center justify-center rounded-xl">
                      <div className="flex flex-col items-center">
                         <Loader2 className="h-10 w-10 animate-spin text-secondary mb-2" />
                         <span className="font-medium text-slate-800">Saving Changes...</span>
                      </div>
                   </div>
               )}
              
              <form onSubmit={handleProfileSubmit} className="space-y-8 max-w-3xl">
                
                {/* Branding Section */}
                <div className="space-y-4">
                   <h3 className="text-lg font-semibold text-slate-800 border-b border-slate-100 pb-2">Branding</h3>
                   
                   <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div className="md:col-span-1 flex flex-col items-center">
                        <label className="text-sm font-medium text-slate-700 mb-2">Store Logo</label>
                        <div 
                            onClick={() => logoInputRef.current?.click()}
                            className="h-32 w-32 bg-slate-100 rounded-full border-2 border-dashed border-slate-300 flex items-center justify-center text-slate-400 hover:border-secondary hover:text-secondary cursor-pointer transition-colors group relative overflow-hidden"
                        >
                           {profileData.logoUrl ? (
                               <img src={profileData.logoUrl} alt="Store Logo" className="w-full h-full object-cover" />
                           ) : (
                               <Camera className="h-8 w-8" />
                           )}
                        </div>
                        <input 
                            type="file" 
                            ref={logoInputRef} 
                            onChange={(e) => handleFileUpload(e, 'logoUrl')} 
                            accept="image/*"
                            className="hidden" 
                        />
                        <span className="text-xs text-slate-400 mt-2">Rec: 500x500px</span>
                      </div>

                      <div className="md:col-span-2">
                         <label className="text-sm font-medium text-slate-700 mb-2 block">Store Banner</label>
                         <div 
                             onClick={() => bannerInputRef.current?.click()}
                             className="h-32 w-full bg-slate-100 rounded-lg border-2 border-dashed border-slate-300 flex items-center justify-center text-slate-400 hover:border-secondary hover:text-secondary cursor-pointer transition-colors overflow-hidden relative"
                         >
                            {profileData.bannerUrl ? (
                                <img src={profileData.bannerUrl} alt="Store Banner" className="w-full h-full object-cover" />
                            ) : (
                                <div className="flex flex-col items-center gap-1">
                                    <Camera className="h-8 w-8" />
                                    <span className="text-xs">Click to upload banner</span>
                                </div>
                            )}
                         </div>
                         <input 
                            type="file" 
                            ref={bannerInputRef} 
                            onChange={(e) => handleFileUpload(e, 'bannerUrl')} 
                            accept="image/*"
                            className="hidden" 
                         />
                         <span className="text-xs text-slate-400 mt-2 block">Rec: 1200x300px</span>
                      </div>
                   </div>
                </div>

                {/* Basic Info Section */}
                <div className="space-y-4">
                   <h3 className="text-lg font-semibold text-slate-800 border-b border-slate-100 pb-2">Business Details</h3>
                   
                   <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Business Name</label>
                        <input 
                          type="text" 
                          name="name"
                          value={profileData.name}
                          onChange={handleProfileChange}
                          onClick={fillProfileSample}
                          className="w-full p-2 border border-slate-300 rounded-lg bg-white text-slate-900 focus:ring-2 focus:ring-secondary focus:border-transparent"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Primary Category</label>
                        <select 
                          name="category"
                          value={profileData.category}
                          onChange={handleProfileChange}
                          className="w-full p-2 border border-slate-300 rounded-lg bg-white text-slate-900 focus:ring-2 focus:ring-secondary"
                        >
                          <option>General Auto Parts</option>
                          <option>Hybrid Specialists</option>
                          <option>Body & Paint</option>
                          <option>Performance Parts</option>
                        </select>
                      </div>
                   </div>

                   <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">About Us (Description)</label>
                      <textarea 
                        name="description"
                        value={profileData.description}
                        onChange={handleProfileChange}
                        onClick={fillProfileSample}
                        rows={4}
                        className="w-full p-2 border border-slate-300 rounded-lg bg-white text-slate-900 focus:ring-2 focus:ring-secondary focus:border-transparent resize-none"
                        placeholder="Tell customers about your shop, expertise, and what you sell..."
                      ></textarea>
                   </div>
                </div>

                {/* Contact Section */}
                <div className="space-y-4">
                   <h3 className="text-lg font-semibold text-slate-800 border-b border-slate-100 pb-2">Contact Information</h3>
                   
                   <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                         <label className="block text-sm font-medium text-slate-700 mb-1">Public Phone Number</label>
                         <div className="relative">
                           <Phone className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                           <input 
                            type="text" 
                            name="phone"
                            value={profileData.phone}
                            onChange={handleProfileChange}
                            onClick={fillProfileSample}
                            className="w-full pl-9 p-2 border border-slate-300 rounded-lg bg-white text-slate-900 focus:ring-2 focus:ring-secondary focus:border-transparent"
                           />
                         </div>
                      </div>
                      <div>
                         <label className="block text-sm font-medium text-slate-700 mb-1">Public Email</label>
                         <div className="relative">
                           <Mail className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                           <input 
                            type="email" 
                            name="email"
                            value={profileData.email}
                            onChange={handleProfileChange}
                            onClick={fillProfileSample}
                            className="w-full pl-9 p-2 border border-slate-300 rounded-lg bg-white text-slate-900 focus:ring-2 focus:ring-secondary focus:border-transparent"
                           />
                         </div>
                      </div>
                   </div>

                   <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">Shop Address</label>
                      <div className="relative">
                           <MapPin className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                           <input 
                            type="text" 
                            name="address"
                            value={profileData.address}
                            onChange={handleProfileChange}
                            onClick={fillProfileSample}
                            className="w-full pl-9 p-2 border border-slate-300 rounded-lg bg-white text-slate-900 focus:ring-2 focus:ring-secondary focus:border-transparent"
                           />
                      </div>
                   </div>
                </div>

                <div className="pt-4 flex justify-end">
                  <Button type="submit" size="lg" disabled={isSavingProfile}>
                    <Save className="h-4 w-4 mr-2" /> {isSavingProfile ? 'Saving...' : 'Save Changes'}
                  </Button>
                </div>

              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
