import React, { useState, useEffect, useRef } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Navbar } from './components/Navbar';
import { AuthModal } from './components/AuthModal';
import { DatabaseSeeder } from './components/DatabaseSeeder'; 
import { Marketplace } from './pages/Marketplace';
import { VendorDashboard } from './pages/VendorDashboard';
import { ProductDetails } from './pages/ProductDetails';
import { Checkout, OrderSuccess } from './pages/Checkout';
import { VendorStore } from './pages/VendorStore';
import { ShoppingCart as CartIcon, ArrowLeft, Lock, Mail, Store, MapPin, Phone, CheckCircle2, ShieldCheck, User, ShoppingBag, Bell, Camera, Facebook, AlertCircle, Package, ChevronRight, Truck, Clock, X } from 'lucide-react';
import { Button } from './components/ui/Button';
import { PRODUCTS } from './services/mockData';
import { Order } from './types';

// --- CONSTANTS FOR SOCIAL LOGIN ---
const GOOGLE_CLIENT_ID = "YOUR_GOOGLE_CLIENT_ID.apps.googleusercontent.com";
const FACEBOOK_APP_ID = "YOUR_FACEBOOK_APP_ID";

const CartView: React.FC = () => {
  const { cart, removeFromCart, setView } = useApp();
  
  const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <Button variant="outline" onClick={() => setView('marketplace')} className="mb-6">
        <ArrowLeft className="h-4 w-4" /> Back to Shop
      </Button>
      
      <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
        <CartIcon className="h-6 w-6 text-secondary" /> Your Cart
      </h2>

      {cart.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-xl shadow-sm">
          <p className="text-slate-500">Your cart is empty.</p>
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="divide-y divide-slate-100">
            {cart.map(item => (
              <div key={item.id} className="p-6 flex items-center gap-4">
                <img src={item.imageUrl} alt="" className="h-16 w-16 rounded object-cover bg-gray-100" />
                <div className="flex-1">
                  <h3 className="font-bold text-slate-900">{item.title}</h3>
                  <p className="text-sm text-slate-500">{item.quantity} x LKR {item.price.toLocaleString()}</p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-lg">LKR {(item.price * item.quantity).toLocaleString()}</p>
                  <button 
                    onClick={() => removeFromCart(item.id)}
                    className="text-sm text-red-500 hover:underline mt-1"
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))}
          </div>
          <div className="bg-slate-50 p-6 flex justify-between items-center border-t border-slate-200">
            <span className="text-lg font-semibold text-slate-700">Total Amount</span>
            <span className="text-2xl font-bold text-slate-900">LKR {total.toLocaleString()}</span>
          </div>
          <div className="p-6 text-right">
            <Button size="lg" variant="secondary" onClick={() => setView('checkout')}>Proceed to Checkout</Button>
          </div>
        </div>
      )}
    </div>
  );
};

const VendorLoginView: React.FC = () => {
  const { vendorLogin, setView, isLoading } = useApp();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (email && password) {
      await vendorLogin(email, password); 
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 flex flex-col md:flex-row">
      <div className="hidden md:flex w-1/2 items-center justify-center bg-gradient-to-br from-slate-800 to-slate-900 p-12 relative overflow-hidden">
        <div className="relative z-10 text-center text-white">
          <div className="flex justify-center mb-6">
            <div className="h-20 w-20 bg-secondary/20 rounded-2xl flex items-center justify-center backdrop-blur-sm border border-secondary/30">
              <Store className="h-10 w-10 text-secondary" />
            </div>
          </div>
          <h1 className="text-4xl font-bold mb-4">Vendor Portal</h1>
          <p className="text-slate-400 max-w-md mx-auto text-lg">
            Manage your inventory, track sales, and grow your automotive business with AutoPartsSL.
          </p>
        </div>
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
          <div className="absolute -top-20 -left-20 w-96 h-96 bg-secondary/5 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl"></div>
        </div>
      </div>

      <div className="w-full md:w-1/2 bg-white flex items-center justify-center p-8 md:p-16">
        <div className="w-full max-w-md">
          <div className="md:hidden flex items-center gap-2 mb-8 text-slate-900">
            <Store className="h-8 w-8 text-secondary" />
            <span className="text-2xl font-bold">AutoPartsSL</span>
          </div>

          <Button variant="outline" onClick={() => setView('register-vendor')} className="mb-8 border-none p-0 text-slate-500 hover:bg-transparent hover:text-slate-900 justify-start">
            <ArrowLeft className="h-4 w-4" /> Back to Registration
          </Button>

          <div className="mb-8">
            <h2 className="text-3xl font-bold text-slate-900 mb-2">Vendor Sign In</h2>
            <p className="text-slate-500">Enter your business credentials to access your dashboard.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Business Email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 h-5 w-5 text-slate-400" />
                <input
                  type="email"
                  value={email}
                  onClick={() => !email && setEmail('sales@nihalmotors.lk')}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 rounded-lg border border-slate-300 focus:ring-2 focus:ring-secondary focus:border-transparent transition-all bg-white text-slate-900"
                  placeholder="business@example.com"
                  title="Click to fill sample data"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-5 w-5 text-slate-400" />
                <input
                  type="password"
                  value={password}
                  onClick={() => !password && setPassword('vendorpass123')}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 rounded-lg border border-slate-300 focus:ring-2 focus:ring-secondary focus:border-transparent transition-all bg-white text-slate-900"
                  placeholder="••••••••"
                  title="Click to fill sample data"
                  required
                />
              </div>
              <div className="flex justify-end mt-1">
                <a href="#" className="text-sm text-secondary hover:underline">Forgot password?</a>
              </div>
            </div>

            <Button type="submit" className="w-full py-3 text-lg font-bold" variant="secondary" disabled={isLoading}>
              {isLoading ? 'Authenticating...' : 'Access Dashboard'}
            </Button>
          </form>

          <div className="mt-8 pt-6 border-t border-slate-100 text-center">
            <div className="flex items-center justify-center gap-2 text-slate-500 text-sm">
              <ShieldCheck className="h-4 w-4 text-green-600" />
              <span>Secure Seller Area</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// SIMPLIFIED VENDOR REGISTRATION VIEW
const VendorRegistrationView: React.FC = () => {
  const { registerVendor, setView, isLoading } = useApp();
  const [businessName, setBusinessName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [location, setLocation] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    registerVendor(email, password, businessName, phone, location);
  };

  const fillSample = () => {
    setBusinessName('Silva Auto Spares');
    setEmail('contact@silvaauto.com');
    setPhone('077 123 4567');
    setLocation('Panchikawatta, Colombo 10');
    setPassword('securepass123');
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-md p-8 w-full max-w-md border-2 border-blue-400">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-slate-900">Create Seller Account</h2>
          <Button variant="outline" onClick={fillSample} size="sm">Fill Sample</Button>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Business Name</label>
            <input 
              type="text" 
              value={businessName}
              onChange={(e) => setBusinessName(e.target.value)}
              className="w-full p-2 border border-slate-300 rounded bg-white text-slate-900"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Email</label>
            <input 
              type="email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-2 border border-slate-300 rounded bg-white text-slate-900"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Phone</label>
            <input 
              type="text" 
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full p-2 border border-slate-300 rounded bg-white text-slate-900"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Location</label>
            <input 
              type="text" 
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="w-full p-2 border border-slate-300 rounded bg-white text-slate-900"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Password</label>
            <input 
              type="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-2 border border-slate-300 rounded bg-white text-slate-900"
              required
            />
          </div>
          
          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? 'Creating Account...' : 'Register Now'}
          </Button>
        </form>

        <div className="mt-6 text-center">
          <button onClick={() => setView('marketplace')} className="text-sm text-slate-500 hover:underline">
            Back to Marketplace
          </button>
        </div>
      </div>
    </div>
  );
};

const SidebarNavigation: React.FC<{ active: 'account' | 'purchase' }> = ({ active }) => {
  const { currentUser, setView } = useApp();
  
  return (
    <div className="w-full md:w-64 shrink-0 space-y-6">
      {/* Profile Summary */}
      <div className="flex items-center gap-4 py-2">
        <div className="h-12 w-12 rounded-full bg-slate-200 flex items-center justify-center text-slate-600 font-bold text-xl border border-slate-300">
          {currentUser.name.charAt(0)}
        </div>
        <div className="overflow-hidden">
          <p className="font-bold text-slate-900 truncate">{currentUser.name}</p>
          <button className="text-xs text-slate-500 hover:text-secondary flex items-center gap-1">
            <User className="h-3 w-3" /> Edit Profile
          </button>
        </div>
      </div>

      {/* Navigation */}
      <div className="space-y-1">
        <div className="space-y-1">
          <button 
            onClick={() => setView('my-account')}
            className={`w-full flex items-center gap-3 px-2 py-2 rounded hover:bg-slate-50 transition-colors ${active === 'account' ? 'text-secondary font-medium' : 'text-slate-700'}`}
          >
            <div className="w-6 flex justify-center"><User className="h-5 w-5" /></div>
            <span>My Account</span>
          </button>
          {active === 'account' && (
            <div className="pl-11 space-y-2 text-sm text-slate-500">
              <button className="block hover:text-secondary text-secondary font-medium">Profile</button>
              <button className="block hover:text-secondary">Banks & Cards</button>
              <button className="block hover:text-secondary">Addresses</button>
              <button className="block hover:text-secondary">Change Password</button>
            </div>
          )}
        </div>

        <button 
          onClick={() => setView('my-purchase')}
          className={`w-full flex items-center gap-3 px-2 py-2 rounded hover:bg-slate-50 transition-colors ${active === 'purchase' ? 'text-teal-600 font-medium' : 'text-slate-700'}`}
        >
          <div className="w-6 flex justify-center"><ShoppingBag className="h-5 w-5" /></div>
          <span>My Purchase</span>
        </button>

        <button className="w-full flex items-center gap-3 px-2 py-2 rounded hover:bg-slate-50 text-slate-700 transition-colors">
          <div className="w-6 flex justify-center"><Bell className="h-5 w-5" /></div>
          <span>Notifications</span>
        </button>
      </div>
    </div>
  );
};

const MyAccountView: React.FC = () => {
  const { currentUser, updateUserProfile } = useApp();
  const [formData, setFormData] = useState({
    name: currentUser.name || '',
    phone: currentUser.phone || '',
  });
  const [isSaving, setIsSaving] = useState(false);

  // Helper to mask email like standard e-commerce apps
  const maskEmail = (email?: string) => {
    if (!email) return '';
    const [name, domain] = email.split('@');
    if (name.length <= 2) return email;
    return `${name.substring(0, 2)}***@${domain}`;
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    
    // Simulate API call
    setTimeout(() => {
      updateUserProfile({
        name: formData.name,
        phone: formData.phone
      });
      setIsSaving(false);
      alert('Profile updated successfully!');
    }, 800);
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <div className="flex flex-col md:flex-row gap-8">
        <SidebarNavigation active="account" />

        <div className="flex-1 bg-white shadow-sm rounded-lg border border-slate-200 overflow-hidden">
          <div className="p-6 border-b border-slate-100">
            <h2 className="text-xl font-bold text-slate-800">My Profile</h2>
            <p className="text-sm text-slate-500">Manage and protect your account</p>
          </div>

          <div className="p-8">
            <div className="flex flex-col-reverse md:flex-row gap-12">
              {/* Form Column */}
              <form onSubmit={handleSave} className="flex-1 space-y-6">
                <div className="grid grid-cols-3 gap-4 items-center">
                  <label className="text-right text-sm text-slate-600">Username</label>
                  <div className="col-span-2">
                     <p className="text-slate-900 font-medium">{currentUser.name.replace(/\s+/g, '').toLowerCase()}</p>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4 items-center">
                  <label className="text-right text-sm text-slate-600">Name</label>
                  <div className="col-span-2">
                    <input 
                      type="text" 
                      value={formData.name}
                      onClick={() => !formData.name && setFormData({...formData, name: 'Kasun Perera'})}
                      onChange={(e) => setFormData(prev => ({...prev, name: e.target.value}))}
                      className="w-full px-3 py-2 border border-slate-300 rounded focus:outline-none focus:border-slate-500 bg-white text-slate-900"
                      title="Click to fill sample data"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4 items-center">
                  <label className="text-right text-sm text-slate-600">Email</label>
                  <div className="col-span-2 flex items-center gap-2">
                     <span className="text-slate-900">{maskEmail(currentUser.email)}</span>
                     <button type="button" className="text-blue-500 text-sm underline hover:text-blue-600">Change</button>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4 items-center">
                  <label className="text-right text-sm text-slate-600">Phone Number</label>
                  <div className="col-span-2 flex items-center gap-2">
                     {currentUser.phone ? (
                        <span className="text-slate-900">{currentUser.phone}</span>
                     ) : (
                       <input 
                        type="text" 
                        placeholder="Add Phone Number"
                        value={formData.phone}
                        onClick={() => !formData.phone && setFormData({...formData, phone: '077 123 4567'})}
                        onChange={(e) => setFormData(prev => ({...prev, phone: e.target.value}))}
                        className="w-full px-3 py-2 border border-slate-300 rounded focus:outline-none focus:border-slate-500 bg-white text-slate-900"
                        title="Click to fill sample data"
                       />
                     )}
                     <button type="button" className="text-blue-500 text-sm underline hover:text-blue-600">
                       {currentUser.phone ? 'Change' : ''}
                     </button>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4 items-center pt-4">
                  <div></div>
                  <div className="col-span-2">
                    <Button type="submit" variant="secondary" disabled={isSaving} className="px-8">
                      {isSaving ? 'Saving...' : 'Save'}
                    </Button>
                  </div>
                </div>
              </form>

              {/* Avatar Column */}
              <div className="flex flex-col items-center justify-start border-l border-slate-100 pl-12 md:w-64">
                 <div className="h-24 w-24 rounded-full bg-slate-200 flex items-center justify-center text-slate-500 mb-4 border border-slate-300 overflow-hidden">
                    {currentUser.name ? (
                      <span className="text-3xl font-bold">{currentUser.name.charAt(0)}</span>
                    ) : (
                      <User className="h-10 w-10" />
                    )}
                 </div>
                 <button className="border border-slate-200 bg-white px-4 py-2 text-sm text-slate-600 rounded shadow-sm hover:bg-slate-50 transition-colors mb-2">
                   Select Image
                 </button>
                 <p className="text-xs text-slate-400 text-center leading-relaxed">
                   File size: max. 1MB<br/>
                   File extension: .JPEG, .PNG
                 </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const MyPurchaseView: React.FC = () => {
  const { orders } = useApp();

  const getStatusColor = (status: string) => {
    switch(status) {
      case 'delivered': return 'text-green-600 bg-green-50 border-green-200';
      case 'shipped': return 'text-blue-600 bg-blue-50 border-blue-200';
      case 'processing': return 'text-orange-600 bg-orange-50 border-orange-200';
      default: return 'text-slate-600 bg-slate-50 border-slate-200';
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <div className="flex flex-col md:flex-row gap-8">
        <SidebarNavigation active="purchase" />
        <div className="flex-1 space-y-6">
           {/* Filter Tabs */}
           <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-1 flex text-sm font-medium text-slate-500 overflow-x-auto">
             <button className="px-4 py-2 text-secondary border-b-2 border-secondary whitespace-nowrap">All</button>
             <button className="px-4 py-2 hover:text-slate-800 whitespace-nowrap">To Pay</button>
             <button className="px-4 py-2 hover:text-slate-800 whitespace-nowrap">To Ship</button>
             <button className="px-4 py-2 hover:text-slate-800 whitespace-nowrap">To Receive</button>
             <button className="px-4 py-2 hover:text-slate-800 whitespace-nowrap">Completed</button>
             <button className="px-4 py-2 hover:text-slate-800 whitespace-nowrap">Cancelled</button>
           </div>

           {orders.length === 0 ? (
             <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-12 text-center text-slate-500">
               <Package className="h-12 w-12 mx-auto mb-4 opacity-50" />
               <h3 className="text-lg font-semibold mb-2">No orders yet</h3>
               <p>Go to the marketplace and find some parts!</p>
             </div>
           ) : (
             orders.map(order => (
               <div key={order.id} className="bg-white shadow-sm rounded-lg border border-slate-200 overflow-hidden">
                 {/* Header */}
                 <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                   <div className="flex items-center gap-4 text-sm">
                      <span className="font-bold text-slate-700">{order.id}</span>
                      <span className="text-slate-400">|</span>
                      <span className="text-slate-500 flex items-center gap-1">
                        <Clock className="h-3 w-3" /> {new Date(order.date).toLocaleDateString()}
                      </span>
                   </div>
                   <div className={`px-3 py-1 rounded text-xs font-bold border uppercase ${getStatusColor(order.status)}`}>
                      {order.status}
                   </div>
                 </div>
                 
                 {/* Items */}
                 <div className="p-4 divide-y divide-slate-50">
                    {order.items.map((item, idx) => (
                      <div key={`${order.id}-item-${idx}`} className="flex gap-4 py-2">
                         <img src={item.imageUrl} alt="" className="h-20 w-20 object-cover rounded border border-slate-100 bg-slate-50" />
                         <div className="flex-1">
                            <h4 className="font-medium text-slate-900">{item.title}</h4>
                            <p className="text-sm text-slate-500 mb-1">Variation: Standard</p>
                            <span className="text-xs border border-slate-200 px-1 rounded text-slate-500">x{item.quantity}</span>
                         </div>
                         <div className="text-right">
                            <p className="font-medium text-slate-900">LKR {(item.price * item.quantity).toLocaleString()}</p>
                         </div>
                      </div>
                    ))}
                 </div>

                 {/* Footer */}
                 <div className="p-4 border-t border-slate-100 bg-slate-50/30 flex flex-col sm:flex-row justify-between items-center gap-4">
                    <div className="text-sm text-slate-500">
                       {order.items.length} items
                    </div>
                    <div className="flex items-center gap-4">
                       <div className="flex items-baseline gap-2">
                          <span className="text-slate-600 text-sm">Order Total:</span>
                          <span className="text-xl font-bold text-secondary">LKR {order.totalAmount.toLocaleString()}</span>
                       </div>
                       <div className="flex gap-2">
                          <Button size="sm" variant="outline" className="text-xs px-4">Track Order</Button>
                          <Button size="sm" className="text-xs px-4">Buy Again</Button>
                       </div>
                    </div>
                 </div>
               </div>
             ))
           )}
        </div>
      </div>
    </div>
  );
};

const AppContent: React.FC = () => {
  const { view } = useApp();
  // Only hide Navbar on the dedicated Vendor Login portal
  const hideNavbarViews = ['vendor-login'];

  return (
    <div className="min-h-screen bg-gray-50 font-sans text-slate-900 flex flex-col">
      {!hideNavbarViews.includes(view) && <Navbar />}
      <main className="flex-1 relative">
        <AuthModal />
        {view === 'marketplace' && <Marketplace />}
        {view === 'product-details' && <ProductDetails />}
        {view === 'vendor' && <VendorDashboard />}
        {view === 'cart' && <CartView />}
        {view === 'checkout' && <Checkout />}
        {view === 'order-success' && <OrderSuccess />}
        {view === 'vendor-login' && <VendorLoginView />}
        {view === 'register-vendor' && <VendorRegistrationView />}
        {view === 'my-account' && <MyAccountView />}
        {view === 'my-purchase' && <MyPurchaseView />}
        {view === 'vendor-store' && <VendorStore />}
      </main>
      {!hideNavbarViews.includes(view) && (
        <footer className="bg-slate-900 text-slate-400 py-8 mt-auto relative">
          <div className="container mx-auto px-4 text-center text-sm">
            <p>&copy; 2025 AutoPartsSL. All rights reserved.</p>
            <p className="mt-2">The #1 Auto Parts Marketplace in Sri Lanka.</p>
          </div>
          {/* DATABASE SEEDER BUTTON - REMOVE IN PRODUCTION */}
          <DatabaseSeeder />
        </footer>
      )}
    </div>
  );
};

const App: React.FC = () => {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
};

export default App;