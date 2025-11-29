
import React, { useState, useMemo, useRef, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { useNotification } from '../context/NotificationContext';
import { Product, Condition, Origin, Vendor, Order, CartItem, Vehicle, CompatibleVariant } from '../types';
import { Button } from '../components/ui/Button';
import { Plus, Package, DollarSign, Tag, Settings, BarChart3, Store, Camera, MapPin, Phone, Mail, Save, Loader2, Upload, Image as ImageIcon, Pencil, Trash2, Check, X, Search, Filter, AlertCircle, ChevronLeft, ChevronRight, MoreVertical, ClipboardList, Truck, Clock, User as UserIcon, Sparkles, RefreshCcw, Car, Calendar, ExternalLink, ArrowRight } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { suggestCompatibleVehicles } from '../services/gemini';

export const VendorDashboard: React.FC = () => {
  const { currentUser, updateUserProfile, updateVendorProfile, vendors, vehicles, products, addProduct, editProduct, removeProduct, vendorOrders, updateOrderStatus, issueRefund, isLoading } = useApp();
  const { notify } = useNotification();
  const [activeTab, setActiveTab] = useState<'listings' | 'add' | 'analytics' | 'profile' | 'orders'>('listings');
  const [isAddingProduct, setIsAddingProduct] = useState(false);
  const [isSavingProfile, setIsSavingProfile] = useState(false);
  const [editingProductId, setEditingProductId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);
  
  // Inventory Management State
  const [inventorySearch, setInventorySearch] = useState('');
  const [inventoryFilter, setInventoryFilter] = useState('all'); // all, low_stock, out_of_stock
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 10;

  const fileInputRef = useRef<HTMLInputElement>(null);
  const logoInputRef = useRef<HTMLInputElement>(null);
  const bannerInputRef = useRef<HTMLInputElement>(null);
  
  // AI Suggestion State
  const [isSuggestingVehicles, setIsSuggestingVehicles] = useState(false);

  // Vehicle Selector State
  const [vehicleSearchTerm, setVehicleSearchTerm] = useState('');
  const [pendingVehicle, setPendingVehicle] = useState<Vehicle | null>(null);

  // Shipping Tracking State
  const [trackingModalOpen, setTrackingModalOpen] = useState(false);
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);
  const [trackingNumber, setTrackingNumber] = useState('');
  const [courierName, setCourierName] = useState('');

  // Derived State: Filter global products for this vendor
  const vendorProducts = useMemo(() => {
    if (!currentUser.vendorId) return [];
    let filtered = products.filter(p => p.vendorId === currentUser.vendorId);

    // Apply Search
    if (inventorySearch) {
      const q = inventorySearch.toLowerCase();
      filtered = filtered.filter(p => 
        p.title.toLowerCase().includes(q) || 
        p.sku.toLowerCase().includes(q)
      );
    }

    // Apply Filter
    if (inventoryFilter === 'low_stock') {
      filtered = filtered.filter(p => p.stock > 0 && p.stock < 5);
    } else if (inventoryFilter === 'out_of_stock') {
      filtered = filtered.filter(p => p.stock === 0);
    }

    return filtered;
  }, [products, currentUser.vendorId, inventorySearch, inventoryFilter]);

  // Pagination Logic
  const totalPages = Math.ceil(vendorProducts.length / ITEMS_PER_PAGE);
  const paginatedProducts = vendorProducts.slice(
    (currentPage - 1) * ITEMS_PER_PAGE, 
    currentPage * ITEMS_PER_PAGE
  );

  // Derived State: Get current vendor details
  const currentVendor = useMemo(() => {
    return vendors.find(v => v.id === currentUser.vendorId);
  }, [vendors, currentUser.vendorId]);

  // Form State
  const [formData, setFormData] = useState<Partial<Product>>({
    title: '',
    price: 0,
    condition: Condition.New,
    origin: Origin.Japan,
    compatibleVehicles: [],
    category: 'General',
    imageUrl: '',
    stock: 1
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
    setFormData(prev => ({
      ...prev,
      [name]: name === 'price' || name === 'stock' ? parseFloat(value) : value
    }));
  };

  const handleProfileChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setProfileData(prev => ({ ...prev, [name]: value }));
  };

  // STEP 1: Select Vehicle (Sets Pending)
  const handleVehicleSelect = (vehicle: Vehicle) => {
    setPendingVehicle(vehicle);
    setVehicleSearchTerm(''); 
  };

  // STEP 2: Select Specific Year (Adds to List)
  const handleYearSelect = (year: number) => {
    if (!pendingVehicle) return;

    setFormData(prev => {
      const current = prev.compatibleVehicles || [];
      const searchKey = `${pendingVehicle.id}_${year}`;
      
      // Prevent duplicates
      if (current.some(cv => cv.searchKey === searchKey)) {
        notify('info', 'Vehicle already added.');
        return prev;
      }

      const newVariant: CompatibleVariant = {
        vehicleId: pendingVehicle.id,
        make: pendingVehicle.make,
        model: pendingVehicle.model,
        year: year,
        searchKey: searchKey
      };

      return { ...prev, compatibleVehicles: [...current, newVariant] };
    });
    
    // Keep the pending vehicle open to select more years, or user can cancel
    notify('success', `Added ${pendingVehicle.model} (${year})`);
  };

  const removeVariantFromSelection = (searchKey: string) => {
    setFormData(prev => ({
      ...prev,
      compatibleVehicles: (prev.compatibleVehicles || []).filter(v => v.searchKey !== searchKey)
    }));
  };
  
  const handleAiSuggestVehicles = async () => {
    if (!formData.title) {
        notify('warning', "Please enter a Product Title first.");
        return;
    }
    
    setIsSuggestingVehicles(true);
    try {
        const suggestedIds = await suggestCompatibleVehicles(
            formData.title,
            formData.category || 'General',
            vehicles
        );
        
        if (suggestedIds.length > 0) {
            const newVariants: CompatibleVariant[] = [];
            
            suggestedIds.forEach(id => {
                const vehicle = vehicles.find(v => v.id === id);
                if (vehicle) {
                    // For single year records, id points to a specific vehicle/year combo
                    newVariants.push({
                        vehicleId: vehicle.id,
                        make: vehicle.make,
                        model: vehicle.model,
                        year: vehicle.year!, // Non-null assertion as we know schema
                        searchKey: `${vehicle.id}_${vehicle.year}`
                    });
                }
            });

            // Filter duplicates
            const currentKeys = new Set((formData.compatibleVehicles || []).map(v => v.searchKey));
            const uniqueNewVariants = newVariants.filter(v => !currentKeys.has(v.searchKey));

            setFormData(prev => ({
                ...prev,
                compatibleVehicles: [...(prev.compatibleVehicles || []), ...uniqueNewVariants]
            }));
            
            notify('success', `AI found ${uniqueNewVariants.length} compatible variants!`);
        } else {
            notify('warning', "AI could not find exact matches in the database for this product.");
        }
    } catch (error) {
        console.error("AI suggestion failed", error);
        notify('error', "AI suggestion failed. Please try again.");
    } finally {
        setIsSuggestingVehicles(false);
    }
  };

  // Filter available vehicles for the search dropdown
  const filteredSearchVehicles = useMemo(() => {
    if (!vehicleSearchTerm) return [];
    const q = vehicleSearchTerm.toLowerCase();
    // In flat structure, we filter all vehicle records
    return vehicles.filter(v => {
       const text = `${v.make} ${v.model} ${v.chassisCode || ''} ${v.year}`.toLowerCase();
       return text.includes(q);
    }).slice(0, 10); // Limit to 10 results
  }, [vehicles, vehicleSearchTerm]);

  // Generate Year Array for Pending Vehicle
  const pendingVehicleYears = useMemo(() => {
      if (!pendingVehicle) return [];
      
      // Find all vehicles with same Make, Model, Chassis
      return vehicles
        .filter(v => 
            v.make === pendingVehicle.make && 
            v.model === pendingVehicle.model && 
            v.chassisCode === pendingVehicle.chassisCode
        )
        .map(v => v.year!)
        .sort((a,b) => a-b);
  }, [pendingVehicle, vehicles]);


  // Generic Image Handler with Compression
  const handleImageUpload = (
    e: React.ChangeEvent<HTMLInputElement>, 
    setter: (val: string) => void
  ) => {
    const file = e.target.files?.[0];
    if (file) {
      // Basic validation
      if (!file.type.startsWith('image/')) {
        notify('error', "Please upload a valid image file.");
        return;
      }

      const reader = new FileReader();
      reader.onload = (event) => {
        const img = new Image();
        img.onload = () => {
          // Resize logic using Canvas
          const canvas = document.createElement('canvas');
          const ctx = canvas.getContext('2d');
          
          // Max dimensions
          const MAX_WIDTH = 1024;
          const MAX_HEIGHT = 1024;
          
          let width = img.width;
          let height = img.height;

          if (width > height) {
            if (width > MAX_WIDTH) {
              height *= MAX_WIDTH / width;
              width = MAX_WIDTH;
            }
          } else {
            if (height > MAX_HEIGHT) {
              width *= MAX_HEIGHT / height;
              height = MAX_HEIGHT;
            }
          }

          canvas.width = width;
          canvas.height = height;
          ctx?.drawImage(img, 0, 0, width, height);

          // Compress to JPEG 0.7 quality
          const dataUrl = canvas.toDataURL('image/jpeg', 0.7);
          setter(dataUrl);
          notify('success', "Image uploaded and optimized!");
        };
        img.src = event.target?.result as string;
      };
      reader.readAsDataURL(file);
    }
  };

  const handleProductImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    handleImageUpload(e, (url) => setFormData(prev => ({ ...prev, imageUrl: url })));
  };

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    handleImageUpload(e, (url) => setProfileData(prev => ({ ...prev, logoUrl: url })));
  };

  const handleBannerUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    handleImageUpload(e, (url) => setProfileData(prev => ({ ...prev, bannerUrl: url })));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (editingProductId) {
       await editProduct(editingProductId, formData);
       setEditingProductId(null);
    } else {
       await addProduct(formData);
    }
    
    resetForm();
    setActiveTab('listings');
  };

  const handleSaveProfile = async () => {
    if (!currentUser.vendorId) return;
    setIsSavingProfile(true);
    try {
      await updateVendorProfile(currentUser.vendorId, profileData);
      // Success notification is handled by context
    } catch (error) {
      // Error notification handled by context, but we catch here to stop execution if needed
    } finally {
      setIsSavingProfile(false);
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      price: 0,
      condition: Condition.New,
      origin: Origin.Japan,
      compatibleVehicles: [],
      category: 'General',
      imageUrl: '',
      stock: 1
    });
    setEditingProductId(null);
    setIsAddingProduct(false);
    setVehicleSearchTerm('');
    setPendingVehicle(null);
  };

  const initiateEdit = (product: Product) => {
    setFormData({
      title: product.title,
      price: product.price,
      condition: product.condition,
      origin: product.origin,
      compatibleVehicles: product.compatibleVehicles || [], // Handle legacy
      category: product.category,
      imageUrl: product.imageUrl,
      stock: product.stock
    });
    setEditingProductId(product.id);
    setActiveTab('add');
  };

  const requestDelete = (e: React.MouseEvent, productId: string) => {
    e.stopPropagation();
    setConfirmDeleteId(productId);
  };

  const cancelDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    setConfirmDeleteId(null);
  };

  const executeDelete = async (e: React.MouseEvent, productId: string) => {
    e.stopPropagation();
    e.preventDefault();
    setDeletingId(productId);
    
    try {
      await removeProduct(productId);
      // Success handled by context
    } catch (error: any) {
      // Error handled by context
    } finally {
      setDeletingId(null);
      setConfirmDeleteId(null);
    }
  };

  const handleStatusChange = (orderId: string, newStatus: Order['status']) => {
    if (newStatus === 'shipped') {
      setSelectedOrderId(orderId);
      setTrackingModalOpen(true);
    } else {
      updateOrderStatus(orderId, newStatus);
    }
  };

  const submitTracking = async () => {
    if (selectedOrderId && trackingNumber && courierName) {
      await updateOrderStatus(selectedOrderId, 'shipped', { trackingNumber, courier: courierName });
      setTrackingModalOpen(false);
      setTrackingNumber('');
      setCourierName('');
      setSelectedOrderId(null);
    } else {
      notify('error', 'Please enter tracking number and courier');
    }
  };

  // Helper to calculate vendor specific total for an order
  const getVendorOrderTotal = (order: Order) => {
    const vendorItems = order.items.filter(item => item.vendorId === currentUser.vendorId);
    return vendorItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  };

  if (!currentUser.vendorId) return <div className="p-8 text-center">Loading Vendor Profile...</div>;

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* Sidebar */}
      <aside className="w-64 bg-slate-900 text-slate-300 hidden md:flex flex-col fixed h-full z-10">
        <div className="p-6 border-b border-slate-800">
          <div className="flex items-center gap-3 mb-2">
            <div className="h-10 w-10 rounded-lg bg-secondary flex items-center justify-center text-white font-bold text-xl">
               {currentVendor?.name?.charAt(0) || 'V'}
            </div>
            <div>
              <h2 className="font-bold text-white leading-tight">{currentVendor?.name || 'Vendor'}</h2>
              <span className="text-xs text-green-500 flex items-center gap-1">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div> Online
              </span>
            </div>
          </div>
        </div>

        <nav className="flex-1 p-4 space-y-2">
          <button 
            onClick={() => setActiveTab('listings')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${activeTab === 'listings' ? 'bg-secondary text-white' : 'hover:bg-slate-800'}`}
          >
            <Package className="h-5 w-5" /> My Inventory
          </button>
          <button 
            onClick={() => { resetForm(); setActiveTab('add'); }}>
            <div className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${activeTab === 'add' ? 'bg-secondary text-white' : 'hover:bg-slate-800'}`}>
              <Plus className="h-5 w-5" /> Add Product
            </div>
          </button>
          <button 
            onClick={() => setActiveTab('orders')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${activeTab === 'orders' ? 'bg-secondary text-white' : 'hover:bg-slate-800'}`}
          >
            <ClipboardList className="h-5 w-5" /> Orders
            {vendorOrders.some(o => o.status === 'pending') && (
               <span className="ml-auto bg-red-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">New</span>
            )}
          </button>
          <button 
            onClick={() => setActiveTab('analytics')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${activeTab === 'analytics' ? 'bg-secondary text-white' : 'hover:bg-slate-800'}`}
          >
            <BarChart3 className="h-5 w-5" /> Analytics
          </button>
          <button 
            onClick={() => setActiveTab('profile')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${activeTab === 'profile' ? 'bg-secondary text-white' : 'hover:bg-slate-800'}`}
          >
            <Store className="h-5 w-5" /> Store Profile
          </button>
        </nav>

        <div className="p-4 border-t border-slate-800">
           <button className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors">
              <Settings className="h-5 w-5" /> Settings
           </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 md:ml-64 p-8">
        
        {/* === INVENTORY TAB === */}
        {activeTab === 'listings' && (
          <div className="space-y-6 animate-in fade-in">
            {/* Stats Overview */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
                <p className="text-slate-500 text-sm font-medium">Total Products</p>
                <h3 className="text-3xl font-bold text-slate-900 mt-1">{vendorProducts.length}</h3>
              </div>
              <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
                <p className="text-slate-500 text-sm font-medium">Low Stock Items</p>
                <h3 className="text-3xl font-bold text-orange-500 mt-1">
                  {vendorProducts.filter(p => p.stock > 0 && p.stock < 5).length}
                </h3>
              </div>
              <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
                <p className="text-slate-500 text-sm font-medium">Out of Stock</p>
                <h3 className="text-3xl font-bold text-red-500 mt-1">
                   {vendorProducts.filter(p => p.stock === 0).length}
                </h3>
              </div>
            </div>

            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <h1 className="text-2xl font-bold text-slate-900">My Inventory</h1>
              
              <div className="flex gap-4 w-full md:w-auto">
                 <div className="relative flex-1 md:w-64">
                    <input 
                      type="text" 
                      placeholder="Search SKU or Name..." 
                      value={inventorySearch}
                      onChange={(e) => setInventorySearch(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-secondary focus:border-transparent bg-white text-slate-900"
                    />
                    <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                 </div>
                 
                 <select 
                    value={inventoryFilter}
                    onChange={(e) => setInventoryFilter(e.target.value)}
                    className="pl-4 pr-8 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-secondary bg-white text-slate-700"
                 >
                    <option value="all">All Items</option>
                    <option value="low_stock">Low Stock</option>
                    <option value="out_of_stock">Out of Stock</option>
                 </select>
              </div>

              <Button onClick={() => { resetForm(); setActiveTab('add'); }}>
                <Plus className="h-4 w-4 mr-2" /> Add Product
              </Button>
            </div>

            {/* Inventory Table */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
               {vendorProducts.length === 0 ? (
                  <div className="p-12 text-center text-slate-500">
                     <Package className="h-12 w-12 mx-auto mb-4 opacity-50" />
                     <h3 className="text-lg font-medium text-slate-900">No products found</h3>
                     <p className="mb-6">Try adjusting your search or add a new product.</p>
                     <Button onClick={() => { resetForm(); setActiveTab('add'); }}>Add Product</Button>
                  </div>
               ) : (
                  <>
                    <div className="overflow-x-auto">
                      <table className="w-full text-left">
                        <thead className="bg-slate-50 text-slate-600 text-xs uppercase tracking-wider font-semibold border-b border-slate-200">
                          <tr>
                            <th className="px-6 py-4">Product</th>
                            <th className="px-6 py-4">Price (LKR)</th>
                            <th className="px-6 py-4">Stock</th>
                            <th className="px-6 py-4">Status</th>
                            <th className="px-6 py-4 text-right">Actions</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                          {paginatedProducts.map(product => (
                            <tr key={product.id} className="hover:bg-slate-50 transition-colors group">
                              <td 
                                className="px-6 py-4 cursor-pointer"
                                onClick={() => initiateEdit(product)}
                                title="Click to Edit"
                              >
                                <div className="flex items-center gap-3">
                                  <div className="h-10 w-10 rounded bg-slate-100 border border-slate-200 overflow-hidden shrink-0">
                                    <img src={product.imageUrl} alt="" className="h-full w-full object-cover" />
                                  </div>
                                  <div>
                                    <p className="font-bold text-slate-900 group-hover:text-secondary transition-colors">{product.title}</p>
                                    <p className="text-xs text-slate-500">{product.condition}</p>
                                  </div>
                                </div>
                              </td>
                              <td className="px-6 py-4 font-medium text-slate-900">{product.price.toLocaleString()}</td>
                              <td className="px-6 py-4">
                                <div className="flex items-center gap-2">
                                  <div className="w-24 h-2 bg-slate-100 rounded-full overflow-hidden">
                                     <div 
                                        className={`h-full rounded-full ${product.stock < 5 ? 'bg-red-500' : 'bg-green-500'}`} 
                                        style={{ width: `${Math.min(product.stock * 10, 100)}%` }}
                                     ></div>
                                  </div>
                                  <span className="text-slate-900">{product.stock}</span>
                                </div>
                              </td>
                              <td className="px-6 py-4">
                                {product.stock > 0 ? (
                                  <span className="inline-flex items-center gap-1 text-xs font-bold text-green-600 bg-green-50 px-2 py-1 rounded-full">
                                    Active
                                  </span>
                                ) : (
                                  <span className="inline-flex items-center gap-1 text-xs font-bold text-slate-500 bg-slate-100 px-2 py-1 rounded-full">
                                    Out of Stock
                                  </span>
                                )}
                              </td>
                              <td className="px-6 py-4 text-right">
                                <div className="flex items-center justify-end gap-2">
                                  {confirmDeleteId === product.id ? (
                                    <>
                                        <span className="text-xs font-bold text-red-600 mr-2">Sure?</span>
                                        <button 
                                          className="p-1 bg-red-100 text-red-600 rounded hover:bg-red-200"
                                          onClick={(e) => executeDelete(e, product.id)}
                                          title="Confirm Delete"
                                        >
                                           {deletingId === product.id ? <Loader2 className="h-4 w-4 animate-spin"/> : <Check className="h-4 w-4" />}
                                        </button>
                                        <button 
                                          className="p-1 bg-slate-100 text-slate-600 rounded hover:bg-slate-200"
                                          onClick={cancelDelete}
                                          title="Cancel"
                                        >
                                           <X className="h-4 w-4" />
                                        </button>
                                    </>
                                  ) : (
                                    <>
                                        <button 
                                          className="p-2 text-slate-400 hover:text-secondary hover:bg-secondary/10 rounded-full transition-colors"
                                          onClick={(e) => { e.stopPropagation(); initiateEdit(product); }}
                                        >
                                          <Pencil className="h-4 w-4" />
                                        </button>
                                        <button 
                                          type="button"
                                          className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-colors"
                                          onClick={(e) => requestDelete(e, product.id)}
                                        >
                                          <Trash2 className="h-4 w-4" />
                                        </button>
                                    </>
                                  )}
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                    
                    {/* Pagination */}
                    {totalPages > 1 && (
                      <div className="px-6 py-4 border-t border-slate-200 flex justify-between items-center">
                        <span className="text-sm text-slate-500">Page {currentPage} of {totalPages}</span>
                        <div className="flex gap-2">
                          <Button 
                            variant="outline" size="sm" 
                            disabled={currentPage === 1}
                            onClick={() => setCurrentPage(prev => prev - 1)}
                          >
                            Previous
                          </Button>
                          <Button 
                            variant="outline" size="sm" 
                            disabled={currentPage === totalPages}
                            onClick={() => setCurrentPage(prev => prev + 1)}
                          >
                            Next
                          </Button>
                        </div>
                      </div>
                    )}
                  </>
               )}
            </div>
          </div>
        )}

        {/* === ADD / EDIT PRODUCT TAB === */}
        {activeTab === 'add' && (
          <div className="max-w-4xl mx-auto animate-in fade-in">
             <div className="mb-6 flex items-center justify-between">
                <h2 className="text-2xl font-bold text-slate-900">
                  {editingProductId ? 'Edit Product' : 'Add New Product'}
                </h2>
                <Button variant="outline" onClick={() => { resetForm(); setActiveTab('listings'); }}>
                   Cancel
                </Button>
             </div>

             <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 md:p-8 space-y-8">
                {/* Image Upload Section */}
                <div>
                   <label className="block text-sm font-bold text-slate-700 mb-2">Product Image</label>
                   <div className="flex items-start gap-6">
                      <div 
                        className={`w-40 h-40 rounded-lg border-2 border-dashed flex items-center justify-center cursor-pointer overflow-hidden relative ${formData.imageUrl ? 'border-secondary' : 'border-slate-300 hover:border-slate-400 bg-slate-50'}`}
                        onClick={() => fileInputRef.current?.click()}
                      >
                         {formData.imageUrl ? (
                            <>
                              <img src={formData.imageUrl} alt="Preview" className="w-full h-full object-cover" />
                              <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                                 <Camera className="h-8 w-8 text-white" />
                              </div>
                            </>
                         ) : (
                            <div className="text-center p-4">
                               <Upload className="h-8 w-8 text-slate-400 mx-auto mb-2" />
                               <span className="text-xs text-slate-500">Click to Upload</span>
                            </div>
                         )}
                         <input 
                           type="file" 
                           ref={fileInputRef} 
                           className="hidden" 
                           accept="image/*" 
                           onChange={handleProductImageUpload}
                         />
                      </div>
                      
                      <div className="flex-1">
                         <h4 className="font-bold text-slate-800 mb-1">Image Guidelines</h4>
                         <ul className="text-sm text-slate-500 space-y-1 list-disc pl-4">
                            <li>Use a clear, white background if possible.</li>
                            <li>Max file size: 5MB.</li>
                            <li>Supported formats: JPG, PNG.</li>
                            <li>We automatically optimize your images for fast loading.</li>
                         </ul>
                      </div>
                   </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                   <div className="md:col-span-2">
                      <label className="block text-sm font-bold text-slate-700 mb-1">Product Title</label>
                      <input 
                        type="text" 
                        name="title" 
                        value={formData.title} 
                        onChange={handleInputChange} 
                        className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-secondary focus:border-transparent bg-white text-slate-900" 
                        required 
                      />
                   </div>

                   <div>
                      <label className="block text-sm font-bold text-slate-700 mb-1">Price (LKR)</label>
                      <input 
                        type="number" 
                        name="price" 
                        value={formData.price || ''} 
                        onChange={handleInputChange} 
                        className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-secondary bg-white text-slate-900" 
                        required 
                      />
                   </div>

                   <div>
                      <label className="block text-sm font-bold text-slate-700 mb-1">Stock Quantity</label>
                      <input 
                        type="number" 
                        name="stock" 
                        value={formData.stock} 
                        onChange={handleInputChange} 
                        className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-secondary bg-white text-slate-900" 
                        required 
                      />
                   </div>

                   <div>
                      <label className="block text-sm font-bold text-slate-700 mb-1">Condition</label>
                      <select name="condition" value={formData.condition} onChange={handleInputChange} className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-secondary bg-white text-slate-900">
                         {Object.values(Condition).map(c => <option key={c} value={c}>{c}</option>)}
                      </select>
                   </div>

                   <div>
                      <label className="block text-sm font-bold text-slate-700 mb-1">Category</label>
                      <select name="category" value={formData.category} onChange={handleInputChange} className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-secondary bg-white text-slate-900">
                         <option>General</option>
                         <option>Engine & Drivetrain</option>
                         <option>Body Parts</option>
                         <option>Lighting</option>
                         <option>Suspension</option>
                         <option>Brakes</option>
                         <option>Interior</option>
                      </select>
                   </div>
                   
                   <div>
                       <label className="block text-sm font-bold text-slate-700 mb-1">Origin</label>
                       <input 
                         type="text" 
                         name="origin"
                         value={formData.origin}
                         onChange={handleInputChange}
                         className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-secondary bg-white text-slate-900"
                         list="origins"
                       />
                       <datalist id="origins">
                           {Object.values(Origin).map(o => <option key={o} value={o} />)}
                       </datalist>
                   </div>
                </div>

                {/* COMPATIBLE VEHICLES SECTION */}
                <div>
                   <div className="flex justify-between items-center mb-3">
                       <label className="block text-sm font-bold text-slate-700">Compatible Vehicles (Specific Year)</label>
                       <button
                         type="button"
                         onClick={handleAiSuggestVehicles}
                         disabled={isSuggestingVehicles}
                         className="flex items-center gap-1.5 text-xs font-bold text-indigo-600 hover:text-indigo-800 bg-indigo-50 hover:bg-indigo-100 px-3 py-1.5 rounded-full transition-colors disabled:opacity-50"
                       >
                         {isSuggestingVehicles ? (
                             <Loader2 className="h-3 w-3 animate-spin" />
                         ) : (
                             <Sparkles className="h-3 w-3 fill-current" />
                         )}
                         {isSuggestingVehicles ? 'Analyzing...' : 'AI Suggest'}
                       </button>
                   </div>

                   {/* Selected Vehicles Chips (New Structure) */}
                   <div className="mb-4 flex flex-wrap gap-2 bg-slate-50 p-4 rounded-lg border border-slate-100">
                     {formData.compatibleVehicles?.map(cv => (
                        <div key={cv.searchKey} className="bg-white border border-secondary/30 text-slate-700 rounded-full pl-3 pr-2 py-1 text-sm font-medium flex items-center gap-2 shadow-sm">
                           <span>{cv.make} {cv.model} <span className="text-secondary font-bold">({cv.year})</span></span>
                           <button 
                             type="button"
                             onClick={() => removeVariantFromSelection(cv.searchKey)}
                             className="text-slate-400 hover:text-red-500 transition-colors p-0.5 rounded-full hover:bg-red-50"
                           >
                              <X className="h-3 w-3" />
                           </button>
                        </div>
                     ))}
                     {(!formData.compatibleVehicles || formData.compatibleVehicles.length === 0) && (
                        <p className="text-sm text-slate-400 italic py-1 w-full text-center">No vehicles selected yet. Search below.</p>
                     )}
                   </div>

                   {/* Search & Select Interface */}
                   {!pendingVehicle ? (
                       <div className="relative">
                          <div className="relative">
                             <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                             <input 
                               type="text" 
                               placeholder="Search make, model, chassis..."
                               value={vehicleSearchTerm}
                               onChange={(e) => setVehicleSearchTerm(e.target.value)}
                               className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-secondary focus:border-transparent bg-white text-slate-900"
                             />
                          </div>
                          
                          {vehicleSearchTerm && (
                             <div className="absolute z-10 w-full mt-1 bg-white rounded-lg shadow-lg border border-slate-200 max-h-60 overflow-y-auto">
                                {filteredSearchVehicles.length > 0 ? (
                                   filteredSearchVehicles.map(v => (
                                      <button
                                        key={v.id}
                                        type="button"
                                        onClick={() => handleVehicleSelect(v)}
                                        className="w-full text-left px-4 py-2 hover:bg-slate-50 border-b border-slate-50 last:border-0 transition-colors flex items-center gap-3"
                                      >
                                         <div className="bg-slate-100 p-2 rounded-full">
                                            <Car className="h-4 w-4 text-slate-500" />
                                         </div>
                                         <div>
                                            <p className="font-bold text-sm text-slate-800">{v.make} {v.model} ({v.year})</p>
                                            <p className="text-xs text-slate-500">
                                               {v.chassisCode && <span className="bg-slate-100 px-1 rounded mr-2">{v.chassisCode}</span>}
                                               {v.engineCode && <span>{v.engineCode}</span>}
                                            </p>
                                         </div>
                                         <ChevronRight className="h-4 w-4 ml-auto text-slate-400" />
                                      </button>
                                   ))
                                ) : (
                                   <div className="p-4 text-center text-sm text-slate-500">
                                      No matching vehicles found.
                                   </div>
                                )}
                             </div>
                          )}
                       </div>
                   ) : (
                       /* Year Selection View */
                       <div className="bg-blue-50/50 border border-blue-100 rounded-lg p-4 animate-in fade-in slide-in-from-top-2">
                           <div className="flex justify-between items-center mb-3">
                               <div className="flex items-center gap-2">
                                   <button type="button" onClick={() => setPendingVehicle(null)} className="text-slate-400 hover:text-slate-600">
                                       <ChevronLeft className="h-5 w-5" />
                                   </button>
                                   <span className="font-bold text-slate-800">
                                       Select Year for {pendingVehicle.make} {pendingVehicle.model} ({pendingVehicle.chassisCode || 'N/A'})
                                   </span>
                               </div>
                               <button type="button" onClick={() => setPendingVehicle(null)} className="text-slate-400 hover:text-slate-600">
                                   <X className="h-4 w-4" />
                               </button>
                           </div>
                           
                           <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 gap-2">
                               {pendingVehicleYears.map(year => (
                                   <button
                                       key={year}
                                       type="button"
                                       onClick={() => handleYearSelect(year)}
                                       className="bg-white border border-slate-300 hover:border-secondary hover:text-secondary py-2 rounded text-sm font-medium transition-colors shadow-sm text-slate-800"
                                   >
                                       {year}
                                   </button>
                               ))}
                               {pendingVehicleYears.length === 0 && (
                                   <p className="col-span-full text-center text-sm text-slate-500">No specific years found in database.</p>
                               )}
                           </div>
                           <p className="text-xs text-slate-400 mt-2 text-center">Click a year to add it to the list.</p>
                       </div>
                   )}
                </div>

                <div className="flex justify-end gap-4 pt-4 border-t border-slate-100">
                   <Button type="button" variant="outline" onClick={() => { resetForm(); setActiveTab('listings'); }}>Cancel</Button>
                   <Button type="submit" variant="secondary" disabled={isLoading}>
                      {isLoading ? 'Saving...' : (editingProductId ? 'Save Changes' : 'Publish Product')}
                   </Button>
                </div>
             </form>
          </div>
        )}

        {/* ... (Orders and Analytics Tabs remain similar, ensure inputs there are also bg-white) ... */}
        {activeTab === 'orders' && (
           <div className="space-y-6 animate-in fade-in">
              <h1 className="text-2xl font-bold text-slate-900">Order Management</h1>

              {vendorOrders.length === 0 ? (
                 <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-12 text-center">
                    <ClipboardList className="h-12 w-12 text-slate-300 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-slate-900">No Orders Yet</h3>
                    <p className="text-slate-500">When you receive an order, it will appear here.</p>
                 </div>
              ) : (
                 <div className="grid grid-cols-1 gap-6">
                    {vendorOrders.map(order => {
                       // Filter items that belong to THIS vendor
                       const myItems = order.items.filter(i => i.vendorId === currentUser.vendorId);
                       const myTotal = myItems.reduce((acc, i) => acc + (i.price * i.quantity), 0);

                       return (
                         <div key={order.id} className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                            <div className="bg-slate-50 px-6 py-4 border-b border-slate-100 flex flex-col md:flex-row justify-between md:items-center gap-4">
                               <div className="flex items-center gap-4">
                                  <div>
                                     <p className="text-xs text-slate-500 uppercase font-bold">Order ID</p>
                                     <p className="text-sm font-bold text-slate-900">{order.id}</p>
                                  </div>
                                  <div>
                                     <p className="text-xs text-slate-500 uppercase font-bold">Date</p>
                                     <p className="text-sm text-slate-700">{new Date(order.date).toLocaleDateString()}</p>
                                  </div>
                                  <div>
                                     <p className="text-xs text-slate-500 uppercase font-bold">Your Revenue</p>
                                     <p className="text-sm font-bold text-green-600">LKR {myTotal.toLocaleString()}</p>
                                  </div>
                               </div>

                               <div className="flex items-center gap-2">
                                  {order.status === 'pending' && (
                                     <Button size="sm" onClick={() => handleStatusChange(order.id, 'processing')}>
                                        Mark Processing
                                     </Button>
                                  )}
                                  {order.status === 'processing' && (
                                     <Button size="sm" variant="secondary" onClick={() => handleStatusChange(order.id, 'shipped')}>
                                        <Truck className="h-3 w-3 mr-1" /> Ship Order
                                     </Button>
                                  )}
                                  {order.status === 'shipped' && (
                                     <span className="flex items-center gap-1 text-sm font-bold text-blue-600 bg-blue-50 px-3 py-1 rounded-full">
                                        <Truck className="h-3 w-3" /> Shipped
                                     </span>
                                  )}
                                  
                                  {order.status !== 'cancelled' && order.status !== 'delivered' && (
                                      <button 
                                          onClick={() => issueRefund(order.id)}
                                          className="text-xs text-red-500 hover:underline px-2"
                                      >
                                          Issue Refund
                                      </button>
                                  )}
                               </div>
                            </div>

                            <div className="p-6">
                               <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                                  <div>
                                     <h4 className="font-bold text-sm text-slate-900 mb-2 flex items-center gap-2">
                                        <MapPin className="h-4 w-4 text-slate-400" /> Shipping Details
                                     </h4>
                                     <p className="text-sm text-slate-600">{order.shippingAddress.fullName}</p>
                                     <p className="text-sm text-slate-600">{order.shippingAddress.addressLine1}</p>
                                     <p className="text-sm text-slate-600">{order.shippingAddress.city}, {order.shippingAddress.district}</p>
                                     <p className="text-sm text-slate-600">{order.shippingAddress.phone}</p>
                                  </div>
                                  <div>
                                     <h4 className="font-bold text-sm text-slate-900 mb-2 flex items-center gap-2">
                                        <Package className="h-4 w-4 text-slate-400" /> Items Ordered
                                     </h4>
                                     <ul className="space-y-2">
                                        {myItems.map((item, idx) => (
                                           <li key={idx} className="flex justify-between text-sm">
                                              <span className="text-slate-700">{item.quantity} x {item.title}</span>
                                              <span className="font-medium">LKR {(item.price * item.quantity).toLocaleString()}</span>
                                           </li>
                                        ))}
                                     </ul>
                                  </div>
                               </div>
                            </div>
                         </div>
                       );
                    })}
                 </div>
              )}

              {/* Tracking Modal */}
              {trackingModalOpen && (
                 <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-xl shadow-xl p-6 max-w-sm w-full animate-in zoom-in-95">
                       <h3 className="text-lg font-bold mb-4">Add Tracking Details</h3>
                       <div className="space-y-4">
                          <div>
                             <label className="text-sm font-bold text-slate-700">Courier Name</label>
                             <input 
                               type="text" 
                               value={courierName}
                               onChange={(e) => setCourierName(e.target.value)}
                               className="w-full border border-slate-300 bg-white text-slate-900 p-2 rounded"
                               placeholder="e.g. Prompt Xpress"
                             />
                          </div>
                          <div>
                             <label className="text-sm font-bold text-slate-700">Tracking Number</label>
                             <input 
                               type="text" 
                               value={trackingNumber}
                               onChange={(e) => setTrackingNumber(e.target.value)}
                               className="w-full border border-slate-300 bg-white text-slate-900 p-2 rounded"
                               placeholder="e.g. TRK123456789"
                             />
                          </div>
                          <div className="flex gap-2 justify-end pt-2">
                             <Button variant="outline" onClick={() => setTrackingModalOpen(false)}>Cancel</Button>
                             <Button onClick={submitTracking}>Confirm Shipment</Button>
                          </div>
                       </div>
                    </div>
                 </div>
              )}
           </div>
        )}

        {/* === ANALYTICS TAB === */}
        {activeTab === 'analytics' && (
           <div className="space-y-6 animate-in fade-in">
              <h1 className="text-2xl font-bold text-slate-900">Performance Analytics</h1>
              
              <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
                 <h3 className="font-bold text-slate-700 mb-6">Weekly Sales Overview</h3>
                 <div className="h-[300px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                       <BarChart data={analyticsData}>
                          <CartesianGrid strokeDasharray="3 3" vertical={false} />
                          <XAxis dataKey="name" tickLine={false} axisLine={false} />
                          <YAxis tickLine={false} axisLine={false} tickFormatter={(value) => `LKR ${value/1000}k`} />
                          <Tooltip 
                             contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                             formatter={(value: number) => [`LKR ${value.toLocaleString()}`, 'Sales']}
                          />
                          <Bar dataKey="Sales" fill="#f97316" radius={[4, 4, 0, 0]} />
                       </BarChart>
                    </ResponsiveContainer>
                 </div>
              </div>
           </div>
        )}

        {/* === STORE PROFILE TAB === */}
        {activeTab === 'profile' && (
           <div className="max-w-4xl mx-auto space-y-6 animate-in fade-in">
              <div className="flex justify-between items-center">
                 <h1 className="text-2xl font-bold text-slate-900">Store Profile</h1>
                 <Button onClick={handleSaveProfile} disabled={isSavingProfile}>
                    {isSavingProfile ? <Loader2 className="animate-spin h-4 w-4 mr-2"/> : <Save className="h-4 w-4 mr-2"/>}
                    Save Changes
                 </Button>
              </div>

              <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 md:p-8 space-y-8">
                 {/* Branding Section */}
                 <div>
                    <h3 className="text-lg font-bold text-slate-900 mb-4 border-b pb-2">Branding</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                       {/* Logo */}
                       <div className="flex flex-col items-center">
                          <label className="text-sm font-bold text-slate-700 mb-2">Store Logo</label>
                          <div 
                             className="h-32 w-32 rounded-full border-2 border-dashed border-slate-300 flex items-center justify-center overflow-hidden cursor-pointer hover:border-secondary relative group bg-slate-50"
                             onClick={() => logoInputRef.current?.click()}
                          >
                             {profileData.logoUrl ? (
                                <img src={profileData.logoUrl} alt="Logo" className="w-full h-full object-cover" />
                             ) : (
                                <Camera className="h-8 w-8 text-slate-400 group-hover:text-secondary" />
                             )}
                             <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                <span className="text-white text-xs font-bold">Change</span>
                             </div>
                             <input type="file" ref={logoInputRef} className="hidden" accept="image/*" onChange={handleLogoUpload} />
                          </div>
                          <p className="text-xs text-slate-400 mt-2">Rec: 500x500px</p>
                       </div>
                       
                       {/* Banner */}
                       <div className="md:col-span-2">
                          <label className="text-sm font-bold text-slate-700 mb-2">Store Banner</label>
                          <div 
                             className="h-32 w-full rounded-lg border-2 border-dashed border-slate-300 flex items-center justify-center overflow-hidden cursor-pointer hover:border-secondary relative group bg-slate-50"
                             onClick={() => bannerInputRef.current?.click()}
                          >
                             {profileData.bannerUrl ? (
                                <img src={profileData.bannerUrl} alt="Banner" className="w-full h-full object-cover" />
                             ) : (
                                <div className="text-center">
                                   <ImageIcon className="h-8 w-8 text-slate-400 group-hover:text-secondary mx-auto mb-1" />
                                   <span className="text-sm text-slate-500">Click to upload banner</span>
                                </div>
                             )}
                             <input type="file" ref={bannerInputRef} className="hidden" accept="image/*" onChange={handleBannerUpload} />
                          </div>
                          <p className="text-xs text-slate-400 mt-2">Rec: 1200x300px</p>
                       </div>
                    </div>
                 </div>

                 {/* Details Section */}
                 <div>
                    <h3 className="text-lg font-bold text-slate-900 mb-4 border-b pb-2">Business Details</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                       <div>
                          <label className="block text-sm font-bold text-slate-700 mb-1">Business Name</label>
                          <input type="text" name="name" value={profileData.name} onChange={handleProfileChange} className="w-full px-4 py-2 border border-slate-300 bg-white text-slate-900 rounded-lg focus:ring-2 focus:ring-secondary" />
                       </div>
                       <div>
                          <label className="block text-sm font-bold text-slate-700 mb-1">Primary Category</label>
                          <input type="text" name="category" value={profileData.category} onChange={handleProfileChange} className="w-full px-4 py-2 border border-slate-300 bg-white text-slate-900 rounded-lg focus:ring-2 focus:ring-secondary" />
                       </div>
                       <div className="md:col-span-2">
                          <label className="block text-sm font-bold text-slate-700 mb-1">About Us (Description)</label>
                          <textarea name="description" value={profileData.description} onChange={handleProfileChange} rows={4} className="w-full px-4 py-2 border border-slate-300 bg-white text-slate-900 rounded-lg focus:ring-2 focus:ring-secondary" />
                       </div>
                    </div>
                 </div>

                 {/* Contact Section */}
                 <div>
                    <h3 className="text-lg font-bold text-slate-900 mb-4 border-b pb-2">Contact Information</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                       <div>
                          <label className="block text-sm font-bold text-slate-700 mb-1">Phone Number</label>
                          <input type="text" name="phone" value={profileData.phone} onChange={handleProfileChange} className="w-full px-4 py-2 border border-slate-300 bg-white text-slate-900 rounded-lg focus:ring-2 focus:ring-secondary" />
                       </div>
                       <div>
                          <label className="block text-sm font-bold text-slate-700 mb-1">Email Address</label>
                          <input type="email" name="email" value={profileData.email} onChange={handleProfileChange} className="w-full px-4 py-2 border border-slate-300 bg-white text-slate-900 rounded-lg focus:ring-2 focus:ring-secondary" />
                       </div>
                       <div className="md:col-span-2">
                          <label className="block text-sm font-bold text-slate-700 mb-1">Physical Address</label>
                          <input type="text" name="address" value={profileData.address} onChange={handleProfileChange} className="w-full px-4 py-2 border border-slate-300 bg-white text-slate-900 rounded-lg focus:ring-2 focus:ring-secondary" />
                       </div>
                    </div>
                 </div>
              </div>
           </div>
        )}
      </main>
    </div>
  );
};
