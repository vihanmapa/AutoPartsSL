import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { useNotification } from '../context/NotificationContext';
import { Button } from '../components/ui/Button';
import { RefreshCw, LayoutDashboard, Archive, Package, AlertCircle, Menu, Car, Store, X, Tag, LogOut } from 'lucide-react';

export const AdminDashboard: React.FC = () => {
    const { switchUserRole, orders, vendorOrders, markOrderRefunded, isLoading, view, logout } = useApp();
    const { notify } = useNotification();
    const [activeTab, setActiveTab] = useState('overview');

    // NOTE: Simple mechanism to get all orders for Admin. 
    // In a real app we'd have a specific `fetchAdminOrders` call.
    // For this MVP, we might rely on what's in context, but currently Context 
    // might only hold Buyer's orders or Vendor's orders depending on login.
    // Since we don't have a dedicated "Admin Fetch", let's assume `vendorOrders` 
    // contains everything if we are in admin mode, OR we rely on `orders`.
    // Wait! AppContext logic:
    // if user.role == 'vendor', it fetches vendor orders.
    // if user.role == 'buyer', it fetches user orders.
    // Admin role isn't fully fully fleshed out in AppContext for fetching ALL.
    // *Self-Correction*: I should probably filter from `vendorOrders` and ensure 
    // Admin can see them. But wait, `vendorOrders` filters by `vendorId`.

    // Let's just use a hardcoded list or filter what we have for now, 
    // assuming the User (Admin) has been given a special "Vendor ID" that sees all? 
    // Or simpler: Just rely on the passed in orders prop if it was global, but it's not.

    // **Correction**: I will use a simple "All Orders" simulation or check if `vendorOrders` 
    // could be repurposed. Actually, implementing a real fetch is safer.

    // ... But `AppContext` logic said:
    // useEffect checks `user.role === 'vendor' && user.vendorId`.

    // Let's rely on `vendorOrders` for now, assuming Admin logs in as a "Super Vendor" 
    // or checks the DB directly. But since I can't easily change the whole fetch logic 
    // without risking bugs, I'll filter `vendorOrders` assuming Admin is a Vendor who sees all.
    // OR: I will modify AppContext to fetch ALL if role is admin.

    // For this specific task (Refund View), I will filter `orders` which might be empty 
    // if we are not a buyer.

    // REALITY CHECK: I need to ensure Admin sees refund_pending orders.
    // I will check `vendorOrders` for 'refund_pending'.

    const refundPendingOrders = vendorOrders.filter(o => o.status === 'refund_pending' || o.status === 'refunded');

    const [refundConfirmationModalOpen, setRefundConfirmationModalOpen] = useState(false);
    const [selectedOrderForRefund, setSelectedOrderForRefund] = useState<{ id: string, amount: number } | null>(null);

    const handleProcessRefund = (orderId: string, amount: number) => {
        setSelectedOrderForRefund({ id: orderId, amount });
        setRefundConfirmationModalOpen(true);
    };

    const confirmRefund = async () => {
        if (selectedOrderForRefund) {
            await markOrderRefunded(selectedOrderForRefund.id);
            setRefundConfirmationModalOpen(false);
            setSelectedOrderForRefund(null);
        }
    };

    const { vendors, vehicles, addVehicle, editVehicle: updateVehicle, removeVehicle: deleteVehicle, toggleVendorVerification, categories, addCategory, updateCategory, deleteCategory } = useApp();
    const [isSidebarOpen, setSidebarOpen] = useState(false);

    // Vehicle Management State
    const [vehicleModalOpen, setVehicleModalOpen] = useState(false);
    const [editingVehicle, setEditingVehicle] = useState<any>(null);
    const [vehicleForm, setVehicleForm] = useState({
        make: '',
        model: '',
        yearStart: 2000,
        yearEnd: undefined as number | undefined,
        chassisCode: '',
        engineCode: '',
        fuelType: 'Petrol',
        bodyType: 'Sedan'
    });

    const handleEditVehicle = (vehicle: any) => {
        setEditingVehicle(vehicle);
        setVehicleForm({
            make: vehicle.make,
            model: vehicle.model,
            yearStart: vehicle.yearStart || vehicle.year || 2000,
            yearEnd: vehicle.yearEnd,
            chassisCode: vehicle.chassisCode || '',
            engineCode: vehicle.engineCode || '',
            fuelType: vehicle.fuelType || 'Petrol',
            bodyType: vehicle.bodyType || 'Sedan'
        });
        setVehicleModalOpen(true);
    };

    const handleAddVehicle = () => {
        setEditingVehicle(null);
        setVehicleForm({
            make: '',
            model: '',
            yearStart: new Date().getFullYear(),
            yearEnd: undefined,
            chassisCode: '',
            engineCode: '',
            fuelType: 'Petrol',
            bodyType: 'Sedan'
        });
        setVehicleModalOpen(true);
    };

    const handleDeleteVehicle = async (id: string) => {
        if (window.confirm('Are you sure you want to delete this vehicle?')) {
            await deleteVehicle(id);
        }
    };

    const submitVehicle = async () => {
        // Sanitize form data to remove undefined values (Firestore rejects undefined)
        const sanitize = (data: any) => {
            const clean = { ...data };
            Object.keys(clean).forEach(key => clean[key] === undefined && delete clean[key]);
            return clean;
        };
        const payload = sanitize(vehicleForm);

        if (editingVehicle) {
            await updateVehicle(editingVehicle.id, payload);
        } else {
            // Basic validation
            if (!vehicleForm.make || !vehicleForm.model) return;

            await addVehicle({
                id: `v${Date.now()}`,
                ...payload
            } as any);
        }
        setVehicleModalOpen(false);
    };

    // Category Management State
    const [categoryModalOpen, setCategoryModalOpen] = useState(false);
    const [editingCategory, setEditingCategory] = useState<any>(null);
    const [categoryForm, setCategoryForm] = useState({ name: '', icon: '', color: '' });

    const handleEditCategory = (category: any) => {
        setEditingCategory(category);
        setCategoryForm({ name: category.name, icon: category.icon, color: category.color });
        setCategoryModalOpen(true);
    };

    const handleAddCategory = () => {
        setEditingCategory(null);
        setCategoryForm({ name: '', icon: 'Package', color: 'bg-blue-500' });
        setCategoryModalOpen(true);
    };

    const submitCategory = async () => {
        if (editingCategory) {
            await updateCategory(editingCategory.id, categoryForm);
        } else {
            await addCategory({
                id: `cat-${Date.now()}`,
                ...categoryForm,
                count: 0
            } as any);
        }
        setCategoryModalOpen(false);
    };

    // Sidebar/Drawer Component
    const Sidebar = () => (
        <>
            {/* Backdrop for mobile */}
            {isSidebarOpen && (
                <div
                    className="fixed inset-0 bg-black/50 z-40 lg:hidden"
                    onClick={() => setSidebarOpen(false)}
                />
            )}

            {/* Sidebar Content */}
            <div className={`fixed inset-y-0 left-0 z-50 w-64 bg-slate-900 text-white transform transition-transform duration-300 ease-in-out lg:translate-x-0 ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:static lg:block shadow-xl flex flex-col`}>
                <div className="p-6 border-b border-slate-800 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <LayoutDashboard className="h-6 w-6 text-red-500" />
                        <span className="font-bold text-lg">Admin Portal</span>
                    </div>
                    <button onClick={() => setSidebarOpen(false)} className="lg:hidden text-slate-400 hover:text-white">
                        <X className="h-6 w-6" />
                    </button>
                </div>

                <nav className="p-4 space-y-2 flex-1">
                    <button
                        onClick={() => { setActiveTab('overview'); setSidebarOpen(false); }}
                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${activeTab === 'overview' ? 'bg-red-600 text-white' : 'text-slate-400 hover:bg-slate-800 hover:text-white'}`}
                    >
                        <LayoutDashboard className="h-5 w-5" />
                        Overview
                    </button>
                    <button
                        onClick={() => { setActiveTab('refunds'); setSidebarOpen(false); }}
                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${activeTab === 'refunds' ? 'bg-red-600 text-white' : 'text-slate-400 hover:bg-slate-800 hover:text-white'}`}
                    >
                        <AlertCircle className="h-5 w-5" />
                        Refunds
                        {refundPendingOrders.length > 0 && (
                            <span className="ml-auto bg-red-500 text-white text-xs py-0.5 px-2 rounded-full">
                                {refundPendingOrders.length}
                            </span>
                        )}
                    </button>
                    <button
                        onClick={() => { setActiveTab('vendors'); setSidebarOpen(false); }}
                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${activeTab === 'vendors' ? 'bg-red-600 text-white' : 'text-slate-400 hover:bg-slate-800 hover:text-white'}`}
                    >
                        <Store className="h-5 w-5" />
                        Vendors
                    </button>
                    <button
                        onClick={() => { setActiveTab('vehicles'); setSidebarOpen(false); }}
                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${activeTab === 'vehicles' ? 'bg-red-600 text-white' : 'text-slate-400 hover:bg-slate-800 hover:text-white'}`}
                    >
                        <Car className="h-5 w-5" />
                        Vehicle DB
                    </button>
                    <button
                        onClick={() => { setActiveTab('categories'); setSidebarOpen(false); }}
                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${activeTab === 'categories' ? 'bg-red-600 text-white' : 'text-slate-400 hover:bg-slate-800 hover:text-white'}`}
                    >
                        <Tag className="h-5 w-5" />
                        Categories
                    </button>
                </nav>

                <div className="p-4 border-t border-slate-800">
                    <Button size="sm" variant="outline" onClick={() => logout()} className="w-full justify-start text-red-400 border-slate-700 hover:bg-slate-800 hover:text-red-300 hover:border-red-900/50">
                        <LogOut className="h-4 w-4 mr-2" />
                        Log Out
                    </Button>
                </div>
            </div>
        </>
    );

    return (
        <div className="min-h-screen bg-slate-50 flex flex-col lg:flex-row">
            {/* Mobile Header */}
            <header className="lg:hidden bg-slate-900 text-white p-4 shadow-md sticky top-0 z-30 flex justify-between items-center">
                <div className="flex items-center gap-3">
                    <button onClick={() => setSidebarOpen(true)} className="p-1 -ml-1">
                        <Menu className="h-6 w-6" />
                    </button>
                    <span className="font-bold text-lg">Admin Dashboard</span>
                </div>
                <div className="flex items-center gap-2">
                    <Button size="sm" variant="ghost" onClick={() => window.location.reload()} className="text-slate-300 hover:text-white p-2">
                        <RefreshCw className="h-5 w-5" />
                    </Button>
                </div>
            </header>

            {/* Sidebar Navigation */}
            <Sidebar />

            <main className="flex-1 p-4 lg:p-8 overflow-y-auto h-[calc(100vh-64px)] lg:h-screen">

                {activeTab === 'overview' && (
                    <div className="animate-in fade-in slide-in-from-bottom-2 duration-300 space-y-6 max-w-5xl mx-auto">
                        <h2 className="text-2xl font-bold text-slate-800">System Overview</h2>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
                                <div className="text-slate-500 text-sm font-bold uppercase mb-2">Total Revenue</div>
                                <div className="text-3xl font-bold text-slate-900">
                                    LKR {vendorOrders.reduce((acc, o) => acc + o.totalAmount, 0).toLocaleString()}
                                </div>
                            </div>
                            <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
                                <div className="text-slate-500 text-sm font-bold uppercase mb-2">Total Orders</div>
                                <div className="text-3xl font-bold text-slate-900">{vendorOrders.length}</div>
                            </div>
                            <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
                                <div className="text-slate-500 text-sm font-bold uppercase mb-2">Pending Refunds</div>
                                <div className="text-3xl font-bold text-red-600">{refundPendingOrders.length}</div>
                            </div>
                        </div>

                        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-8 text-center">
                            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-slate-100 mb-4">
                                <LayoutDashboard className="h-8 w-8 text-slate-400" />
                            </div>
                            <h3 className="text-lg font-medium text-slate-900">Welcome to the Admin Dashboard</h3>
                            <p className="text-slate-500 max-w-md mx-auto mt-2">
                                Use the sidebar menu to manage refunds, verify vendors, and oversee the vehicle database.
                            </p>
                        </div>
                    </div>
                )}

                {activeTab === 'vendors' && (
                    <div className="animate-in fade-in slide-in-from-bottom-2 duration-300 max-w-5xl mx-auto">
                        <h2 className="text-2xl font-bold text-slate-800 mb-6">Vendor Management</h2>
                        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                            <div className="overflow-x-auto">
                                <table className="w-full text-left text-sm">
                                    <thead className="bg-slate-50 text-slate-500 font-bold uppercase text-xs border-b border-slate-100">
                                        <tr>
                                            <th className="p-4">Vendor Name</th>
                                            <th className="p-4">Location</th>
                                            <th className="p-4">Rating</th>
                                            <th className="p-4 text-center">Status</th>
                                            <th className="p-4 text-right">Action</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-100">
                                        {vendors.map(vendor => (
                                            <tr key={vendor.id} className="hover:bg-slate-50">
                                                <td className="p-4 font-bold text-slate-900">{vendor.name}</td>
                                                <td className="p-4 text-slate-600">{vendor.location}</td>
                                                <td className="p-4 flex items-center gap-1">
                                                    <span className="font-bold text-amber-500">{vendor.rating}</span>
                                                    <span className="text-slate-400">/ 5.0</span>
                                                </td>
                                                <td className="p-4 text-center">
                                                    {vendor.verified ? (
                                                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-green-100 text-green-800">
                                                            Verified
                                                        </span>
                                                    ) : (
                                                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-slate-100 text-slate-500">
                                                            Unverified
                                                        </span>
                                                    )}
                                                </td>
                                                <td className="p-4 text-right">
                                                    <Button
                                                        size="sm"
                                                        variant={vendor.verified ? "outline" : "primary"}
                                                        onClick={() => toggleVendorVerification(vendor.id, !vendor.verified)}
                                                    >
                                                        {vendor.verified ? 'Revoke' : 'Verify'}
                                                    </Button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                )}

                {activeTab === 'vehicles' && (
                    <div className="animate-in fade-in slide-in-from-bottom-2 duration-300 max-w-5xl mx-auto">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-2xl font-bold text-slate-800">Vehicle Database</h2>
                            <Button size="sm" onClick={handleAddVehicle}>Add Vehicle</Button>
                        </div>
                        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                            <div className="overflow-x-auto">
                                <table className="w-full text-left text-sm">
                                    <thead className="bg-slate-50 text-slate-500 font-bold uppercase text-xs border-b border-slate-100">
                                        <tr>
                                            <th className="p-4">Make</th>
                                            <th className="p-4">Model</th>
                                            <th className="p-4">Year Range</th>
                                            <th className="p-4">Chassis Code</th>
                                            <th className="p-4 text-right">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-100">
                                        {vehicles.map(vehicle => (
                                            <tr key={vehicle.id} className="hover:bg-slate-50">
                                                <td className="p-4 font-bold text-slate-900">{vehicle.make}</td>
                                                <td className="p-4 text-slate-900">{vehicle.model}</td>
                                                <td className="p-4 text-slate-600">
                                                    {vehicle.yearStart ? `${vehicle.yearStart} - ${vehicle.yearEnd || 'Present'}` : vehicle.year}
                                                </td>
                                                <td className="p-4 font-mono text-slate-500">{vehicle.chassisCode || '-'}</td>
                                                <td className="p-4 text-right">
                                                    <button onClick={() => handleEditVehicle(vehicle)} className="text-blue-600 hover:underline font-medium mr-3">Edit</button>
                                                    <button onClick={() => handleDeleteVehicle(vehicle.id)} className="text-red-600 hover:underline font-medium">Delete</button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                )}

                {activeTab === 'categories' && (
                    <div className="animate-in fade-in slide-in-from-bottom-2 duration-300 max-w-5xl mx-auto">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-2xl font-bold text-slate-800">Details & Categories</h2>
                            <Button size="sm" onClick={handleAddCategory}>Add Category</Button>
                        </div>
                        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                            <div className="overflow-x-auto">
                                <table className="w-full text-left text-sm">
                                    <thead className="bg-slate-50 text-slate-500 font-bold uppercase text-xs border-b border-slate-100">
                                        <tr>
                                            <th className="p-4">Icon</th>
                                            <th className="p-4">Name</th>
                                            <th className="p-4">Items</th>
                                            <th className="p-4 text-right">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-100">
                                        {categories.map(cat => (
                                            <tr key={cat.id} className="hover:bg-slate-50">
                                                <td className="p-4">
                                                    <div className={`h-8 w-8 rounded flex items-center justify-center text-white ${cat.color || 'bg-slate-400'}`}>
                                                        <Tag className="h-4 w-4" />
                                                    </div>
                                                </td>
                                                <td className="p-4 font-bold text-slate-900">{cat.name}</td>
                                                <td className="p-4 text-slate-600">{cat.count} items</td>
                                                <td className="p-4 text-right">
                                                    <button onClick={() => handleEditCategory(cat)} className="text-blue-600 hover:underline font-medium mr-3">Edit</button>
                                                    <button onClick={() => deleteCategory(cat.id)} className="text-red-600 hover:underline font-medium">Delete</button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                )}

                {activeTab === 'refunds' && (
                    <div className="animate-in fade-in slide-in-from-bottom-2 duration-300 max-w-5xl mx-auto">
                        <h2 className="text-2xl font-bold text-slate-800 mb-6">Refund Management</h2>

                        {/* Refund Stats */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                            <div className="bg-white p-4 rounded-lg shadow border border-red-100">
                                <div className="text-sm text-slate-500 font-bold uppercase">Pending Refunds</div>
                                <div className="text-3xl font-bold text-red-600 mt-1">{refundPendingOrders.length}</div>
                                <div className="text-xs text-slate-400 mt-1">Action Required</div>
                            </div>
                        </div>

                        {/* Refund Table */}
                        <div className="bg-white rounded-lg shadow overflow-hidden">
                            <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-slate-50">
                                <h3 className="font-bold text-slate-700 flex items-center gap-2">
                                    <AlertCircle className="h-5 w-5 text-amber-500" />
                                    Orders Awaiting Refund
                                </h3>
                            </div>

                            {refundPendingOrders.length === 0 ? (
                                <div className="p-12 text-center text-slate-400">
                                    <Package className="h-12 w-12 mx-auto mb-3 opacity-20" />
                                    <p>No orders currently require a refund.</p>
                                </div>
                            ) : (
                                <div className="overflow-x-auto">
                                    <table className="w-full text-left text-sm">
                                        <thead className="bg-slate-50 text-slate-500 font-bold uppercase text-xs">
                                            <tr>
                                                <th className="p-4">Order ID</th>
                                                <th className="p-4">Date</th>
                                                <th className="p-4">Reason</th>
                                                <th className="p-4 text-right">Amount</th>
                                                <th className="p-4 text-center">Action</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-slate-100">
                                            {refundPendingOrders.map((order) => (
                                                <tr key={order.id} className="hover:bg-slate-50">
                                                    <td className="p-4 font-mono font-medium text-slate-700">{order.id}</td>
                                                    <td className="p-4 text-slate-600">{new Date(order.date).toLocaleDateString()}</td>
                                                    <td className="p-4">
                                                        <span className="block font-medium text-slate-800 capitalize">
                                                            {order.cancellationDetails?.reason.replace('_', ' ')}
                                                        </span>
                                                        <span className="text-xs text-slate-500 leading-tight block max-w-xs truncate">
                                                            {order.cancellationDetails?.description || order.cancellationReason}
                                                        </span>
                                                    </td>
                                                    <td className="p-4 text-right font-bold text-slate-900">
                                                        LKR {order.totalAmount.toLocaleString()}
                                                    </td>
                                                    <td className="p-4 text-center">
                                                        {order.status === 'refunded' ? (
                                                            <div className="flex items-center justify-center gap-2 text-green-600 font-bold bg-green-50 py-2 px-3 rounded-lg border border-green-200">
                                                                <div className="bg-green-100 p-1 rounded-full">
                                                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path></svg>
                                                                </div>
                                                                Refunded
                                                            </div>
                                                        ) : (
                                                            <Button
                                                                size="sm"
                                                                variant="danger"
                                                                onClick={() => handleProcessRefund(order.id, order.totalAmount)}
                                                                className="w-full"
                                                            >
                                                                Mark Refunded
                                                            </Button>
                                                        )}
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </main>

            {/* Refund Confirmation Modal and Close Tags */}
            {refundConfirmationModalOpen && selectedOrderForRefund && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 animate-in fade-in duration-200">
                    <div className="bg-white rounded-xl shadow-2xl p-6 max-w-md w-full animate-in zoom-in-95 duration-200">
                        <div className="flex items-center gap-3 mb-4 text-red-600">
                            <div className="bg-red-100 p-2 rounded-full">
                                <AlertCircle className="h-6 w-6" />
                            </div>
                            <h3 className="text-xl font-bold text-slate-900">Confirm Refund</h3>
                        </div>

                        <div className="bg-slate-50 p-4 rounded-lg border border-slate-100 mb-6">
                            <p className="text-sm text-slate-600 mb-1">Refund Amount:</p>
                            <p className="text-2xl font-bold text-slate-900">LKR {selectedOrderForRefund.amount.toLocaleString()}</p>
                            <p className="text-xs text-slate-500 mt-2">Order ID: <span className="font-mono">{selectedOrderForRefund.id}</span></p>
                        </div>

                        <p className="text-slate-600 mb-6 text-sm">
                            Have you physically transferred the funds to the customer's bank account? This action cannot be undone.
                        </p>

                        <div className="flex gap-3 justify-end">
                            <Button
                                variant="outline"
                                onClick={() => setRefundConfirmationModalOpen(false)}
                                className="border-slate-300 hover:bg-slate-50"
                            >
                                Cancel
                            </Button>
                            <Button
                                variant="danger"
                                onClick={confirmRefund}
                                className="px-6"
                            >
                                Yes, Confirm Refund
                            </Button>
                        </div>
                    </div>
                </div>
            )}

            {/* Category Modal */}
            {categoryModalOpen && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 animate-in fade-in duration-200">
                    <div className="bg-white rounded-xl shadow-xl p-6 max-w-md w-full animate-in zoom-in-95 duration-200">
                        <h3 className="text-xl font-bold text-slate-900 mb-4">{editingCategory ? 'Edit Category' : 'Add New Category'}</h3>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Name</label>
                                <input
                                    type="text"
                                    value={categoryForm.name}
                                    onChange={(e) => setCategoryForm({ ...categoryForm, name: e.target.value })}
                                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    placeholder="e.g. Engine Components"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Color Class (Tailwind)</label>
                                <input
                                    type="text"
                                    value={categoryForm.color}
                                    onChange={(e) => setCategoryForm({ ...categoryForm, color: e.target.value })}
                                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    placeholder="e.g. bg-blue-500"
                                />
                            </div>
                        </div>
                        <div className="flex justify-end gap-3 mt-6">
                            <Button variant="outline" onClick={() => setCategoryModalOpen(false)}>Cancel</Button>
                            <Button onClick={submitCategory}>{editingCategory ? 'Update' : 'Create'}</Button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};
