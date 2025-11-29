
import React, { useState, useEffect, useRef } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { NotificationProvider, useNotification } from './context/NotificationContext';
import { ToastContainer } from './components/ui/Toast';
import { Navbar } from './components/Navbar';
import { AuthModal } from './components/AuthModal';
import { Marketplace } from './pages/Marketplace';
import { VendorDashboard } from './pages/VendorDashboard';
import { ProductDetails } from './pages/ProductDetails';
import { Checkout, OrderSuccess } from './pages/Checkout';
import { VendorStore } from './pages/VendorStore';
import { ImageAnalysis } from './pages/ImageAnalysis'; 
import { AdminDashboard } from './pages/AdminDashboard';
import { ShoppingCart as CartIcon, ArrowLeft, Lock, Mail, Store, MapPin, Phone, CheckCircle2, ShieldCheck, User, ShoppingBag, Bell, Camera, Facebook, AlertCircle, Package, ChevronRight, Truck, Clock, X } from 'lucide-react';
import { Button } from './components/ui/Button';
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
  const { notify } = useNotification();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (email && password) {
      await vendorLogin(email, password); 
    }
  };

  const fillDemoCredentials = () => {
    setEmail('sales@nihalmotors.lk');
    setPassword('vendorpass123');
    notify('info', 'Demo credentials filled');
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="bg-white p-8 rounded-xl shadow-lg border border-slate-100 max-w-md w-full animate-in zoom-in-95 duration-300">
         <div className="text-center mb-8">
            <div className="h-16 w-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
               <Store className="h-8 w-8 text-secondary" />
            </div>
            <h2 className="text-2xl font-bold text-slate-900">Vendor Portal</h2>
            <p className="text-slate-500">Sign in to manage your inventory</p>
         </div>

         <form onSubmit={handleSubmit} className="space-y-6">
            <div>
               <label className="block text-sm font-medium text-slate-700 mb-1">Email Address</label>
               <div className="relative">
                  <Mail className="absolute left-3 top-2.5 h-5 w-5 text-slate-400" />
                  <input 
                    type="email" 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg bg-white text-slate-900 focus:ring-2 focus:ring-secondary focus:border-transparent transition-shadow"
                    placeholder="store@example.com"
                  />
               </div>
            </div>

            <div>
               <div className="flex justify-between mb-1">
                 <label className="block text-sm font-medium text-slate-700">Password</label>
                 <a href="#" className="text-sm text-secondary font-medium hover:underline">Forgot password?</a>
               </div>
               <div className="relative">
                  <Lock className="absolute left-3 top-2.5 h-5 w-5 text-slate-400" />
                  <input 
                    type="password" 
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg bg-white text-slate-900 focus:ring-2 focus:ring-secondary focus:border-transparent transition-shadow"
                    placeholder="••••••••"
                  />
               </div>
            </div>

            <Button type="submit" className="w-full py-2.5" disabled={isLoading}>
               {isLoading ? 'Authenticating...' : 'Login to Dashboard'}
            </Button>
            
            <div className="flex justify-center">
                <Button type="button" variant="outline" size="sm" onClick={fillDemoCredentials} className="text-xs">
                    Auto-fill Demo: sales@nihalmotors.lk
                </Button>
            </div>
         </form>
         
         <div className="mt-8 pt-6 border-t border-slate-100 text-center">
            <p className="text-slate-600 mb-4">Don't have a seller account?</p>
            <button onClick={() => setView('register-vendor')} className="text-secondary font-bold hover:underline block w-full mb-4">Register your store</button>
            <button onClick={() => setView('marketplace')} className="text-sm text-slate-400 hover:text-slate-600 flex items-center justify-center gap-1 mx-auto">
               <ArrowLeft className="h-4 w-4" /> Back to Marketplace
            </button>
         </div>
      </div>
    </div>
  );
};

const VendorRegistrationView: React.FC = () => {
  const { registerVendor, setView, isLoading } = useApp();
  const [formData, setFormData] = useState({
    businessName: '',
    email: '',
    phone: '',
    location: '',
    password: '',
    confirmPassword: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      alert("Passwords do not match");
      return;
    }
    await registerVendor(
      formData.email,
      formData.password,
      formData.businessName,
      formData.phone,
      formData.location
    );
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
       <div className="bg-white rounded-2xl shadow-xl overflow-hidden max-w-4xl w-full flex flex-col md:flex-row">
          <div className="w-full md:w-5/12 bg-slate-900 p-12 text-white flex flex-col justify-between relative overflow-hidden">
             <div className="relative z-10">
                <Store className="h-12 w-12 text-secondary mb-6" />
                <h2 className="text-3xl font-bold mb-4">Start Selling Today</h2>
                <ul className="space-y-4">
                   <li className="flex items-start gap-3">
                      <CheckCircle2 className="h-6 w-6 text-green-400 shrink-0" />
                      <span className="text-slate-300">Reach thousands of vehicle owners island-wide.</span>
                   </li>
                   <li className="flex items-start gap-3">
                      <CheckCircle2 className="h-6 w-6 text-green-400 shrink-0" />
                      <span className="text-slate-300">Manage inventory and orders easily.</span>
                   </li>
                   <li className="flex items-start gap-3">
                      <CheckCircle2 className="h-6 w-6 text-green-400 shrink-0" />
                      <span className="text-slate-300">AI-powered listing tools.</span>
                   </li>
                </ul>
             </div>
             
             <div className="absolute top-0 left-0 w-full h-full opacity-10">
                 <div className="absolute top-[-50%] left-[-50%] w-[200%] h-[200%] bg-[radial-gradient(circle,rgba(249,115,22,0.8)_0%,rgba(15,23,42,0)_70%)]"></div>
             </div>
          </div>

          <div className="w-full md:w-7/12 p-12">
             <div className="flex justify-between items-center mb-8">
                <h2 className="text-2xl font-bold text-slate-900">Create Seller Account</h2>
                <button onClick={() => setView('vendor-login')} className="text-sm text-secondary font-medium hover:underline">Already have an account?</button>
             </div>

             <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                   <label className="block text-sm font-medium text-slate-700 mb-1">Business Name</label>
                   <div className="relative">
                      <Store className="absolute left-3 top-2.5 h-5 w-5 text-slate-400" />
                      <input 
                        type="text" 
                        name="businessName"
                        value={formData.businessName}
                        onChange={handleChange}
                        className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg bg-white text-slate-900 focus:ring-2 focus:ring-secondary focus:border-transparent"
                        placeholder="Nihal Motors"
                        required
                      />
                   </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                   <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">Email</label>
                      <div className="relative">
                         <Mail className="absolute left-3 top-2.5 h-5 w-5 text-slate-400" />
                         <input 
                           type="email" 
                           name="email"
                           value={formData.email}
                           onChange={handleChange}
                           className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg bg-white text-slate-900 focus:ring-2 focus:ring-secondary focus:border-transparent"
                           placeholder="contact@shop.lk"
                           required
                         />
                      </div>
                   </div>
                   <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">Phone</label>
                      <div className="relative">
                         <Phone className="absolute left-3 top-2.5 h-5 w-5 text-slate-400" />
                         <input 
                           type="text" 
                           name="phone"
                           value={formData.phone}
                           onChange={handleChange}
                           className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg bg-white text-slate-900 focus:ring-2 focus:ring-secondary focus:border-transparent"
                           placeholder="077xxxxxxx"
                           required
                         />
                      </div>
                   </div>
                </div>

                <div>
                   <label className="block text-sm font-medium text-slate-700 mb-1">City / Location</label>
                   <div className="relative">
                      <MapPin className="absolute left-3 top-2.5 h-5 w-5 text-slate-400" />
                      <input 
                        type="text" 
                        name="location"
                        value={formData.location}
                        onChange={handleChange}
                        className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg bg-white text-slate-900 focus:ring-2 focus:ring-secondary focus:border-transparent"
                        placeholder="Panchikawatta"
                        required
                      />
                   </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                   <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">Password</label>
                      <div className="relative">
                         <Lock className="absolute left-3 top-2.5 h-5 w-5 text-slate-400" />
                         <input 
                           type="password" 
                           name="password"
                           value={formData.password}
                           onChange={handleChange}
                           className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg bg-white text-slate-900 focus:ring-2 focus:ring-secondary focus:border-transparent"
                           placeholder="••••••••"
                           required
                         />
                      </div>
                   </div>
                   <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">Confirm Password</label>
                      <div className="relative">
                         <Lock className="absolute left-3 top-2.5 h-5 w-5 text-slate-400" />
                         <input 
                           type="password" 
                           name="confirmPassword"
                           value={formData.confirmPassword}
                           onChange={handleChange}
                           className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg bg-white text-slate-900 focus:ring-2 focus:ring-secondary focus:border-transparent"
                           placeholder="••••••••"
                           required
                         />
                      </div>
                   </div>
                </div>

                <div className="pt-4">
                   <Button type="submit" className="w-full py-3" disabled={isLoading}>
                      {isLoading ? 'Creating Account...' : 'Create Account'}
                   </Button>
                </div>
             </form>
          </div>
       </div>
       
       <button onClick={() => setView('marketplace')} className="absolute top-6 left-6 text-slate-500 hover:text-slate-900 flex items-center gap-2">
          <ArrowLeft className="h-5 w-5" /> Back to Shop
       </button>
    </div>
  );
};

const MyAccountView: React.FC = () => {
  const { currentUser, setView, updateUserProfile } = useApp();
  const [name, setName] = useState(currentUser.name);
  const [phone, setPhone] = useState(currentUser.phone || '');

  const handleSave = () => {
    updateUserProfile({ name, phone });
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      <h1 className="text-2xl font-bold mb-6">My Account</h1>
      
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
         <div className="flex items-center gap-4 mb-6">
            <div className="h-16 w-16 bg-slate-200 rounded-full flex items-center justify-center text-slate-500 text-2xl font-bold">
               {currentUser.name.charAt(0)}
            </div>
            <div>
               <h2 className="text-xl font-bold text-slate-900">{currentUser.name}</h2>
               <p className="text-slate-500">{currentUser.email}</p>
            </div>
         </div>
         
         <div className="space-y-4">
            <div>
               <label className="block text-sm font-medium text-slate-700 mb-1">Full Name</label>
               <input 
                 type="text" 
                 value={name}
                 onChange={(e) => setName(e.target.value)}
                 className="w-full border border-slate-300 rounded px-3 py-2 bg-white text-slate-900"
               />
            </div>
            <div>
               <label className="block text-sm font-medium text-slate-700 mb-1">Phone Number</label>
               <input 
                 type="text" 
                 value={phone}
                 onChange={(e) => setPhone(e.target.value)}
                 className="w-full border border-slate-300 rounded px-3 py-2 bg-white text-slate-900"
                 placeholder="Not Set"
               />
            </div>
            
            <div className="pt-4">
               <Button onClick={handleSave}>Save Changes</Button>
            </div>
         </div>
      </div>
    </div>
  );
};

const MyPurchaseView: React.FC = () => {
  const { orders } = useApp();

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <h1 className="text-2xl font-bold mb-6">My Orders</h1>
      
      {orders.length === 0 ? (
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-12 text-center">
           <ShoppingBag className="h-12 w-12 text-slate-300 mx-auto mb-4" />
           <p className="text-slate-500">You haven't placed any orders yet.</p>
        </div>
      ) : (
        <div className="space-y-6">
          {orders.map(order => (
            <div key={order.id} className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
               <div className="bg-slate-50 p-4 border-b border-slate-100 flex flex-col md:flex-row justify-between md:items-center gap-4">
                  <div>
                     <p className="text-xs text-slate-500 uppercase font-bold">Order Placed</p>
                     <p className="text-sm font-medium">{new Date(order.date).toLocaleDateString()}</p>
                  </div>
                  <div>
                     <p className="text-xs text-slate-500 uppercase font-bold">Total</p>
                     <p className="text-sm font-medium">LKR {order.totalAmount.toLocaleString()}</p>
                  </div>
                  <div>
                     <p className="text-xs text-slate-500 uppercase font-bold">Order #</p>
                     <p className="text-sm font-medium">{order.id}</p>
                  </div>
                  <div className="md:ml-auto">
                     <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase ${
                        order.status === 'delivered' ? 'bg-green-100 text-green-700' : 
                        order.status === 'cancelled' ? 'bg-red-100 text-red-700' :
                        'bg-blue-100 text-blue-700'
                     }`}>
                        {order.status}
                     </span>
                  </div>
               </div>
               
               <div className="p-4">
                  {order.items.map((item, idx) => (
                     <div key={idx} className="flex gap-4 mb-4 last:mb-0">
                        <img src={item.imageUrl} alt="" className="h-20 w-20 object-cover rounded bg-slate-100" />
                        <div>
                           <h4 className="font-bold text-slate-900">{item.title}</h4>
                           <p className="text-sm text-slate-500">Qty: {item.quantity}</p>
                           <p className="text-sm font-medium text-slate-700">LKR {item.price.toLocaleString()}</p>
                        </div>
                     </div>
                  ))}
               </div>

               {order.status === 'shipped' && order.trackingNumber && (
                 <div className="bg-blue-50 p-4 border-t border-blue-100 flex items-start gap-3">
                    <Truck className="h-5 w-5 text-blue-600 mt-0.5" />
                    <div>
                       <p className="text-sm font-bold text-blue-900">Package Shipped</p>
                       <p className="text-sm text-blue-700">
                          Courier: {order.courier} &bull; Tracking #: <span className="font-mono">{order.trackingNumber}</span>
                       </p>
                    </div>
                 </div>
               )}

               <div className="p-4 bg-slate-50 border-t border-slate-100 text-right">
                  <p className="text-xs text-slate-500">
                    Payment Status: <span className="font-bold uppercase">{order.paymentStatus}</span> ({order.paymentMethod})
                  </p>
               </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};


// --- MAIN APP COMPONENT ---
const AppContent: React.FC = () => {
  const { view, isLoading } = useApp();

  if (isLoading && view === 'marketplace') {
    return (
       <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-secondary mb-4"></div>
          <p className="text-slate-500 animate-pulse">Loading AutoPartsSL...</p>
       </div>
    );
  }

  // Views that don't need Navbar
  if (view === 'login' || view === 'vendor-login' || view === 'register-vendor' || view === 'admin-dashboard') {
    switch (view) {
      case 'vendor-login': return <VendorLoginView />;
      case 'register-vendor': return <VendorRegistrationView />;
      case 'admin-dashboard': return <AdminDashboard />;
      default: return null;
    }
  }

  return (
    <div className="min-h-screen flex flex-col font-sans text-slate-900 bg-slate-50">
      <Navbar />
      <AuthModal />
      <ToastContainer />
      
      <main className="flex-grow">
        {view === 'marketplace' && <Marketplace />}
        {view === 'product-details' && <ProductDetails />}
        {view === 'cart' && <CartView />}
        {view === 'checkout' && <Checkout />}
        {view === 'order-success' && <OrderSuccess />}
        {view === 'vendor' && <VendorDashboard />}
        {view === 'vendor-store' && <VendorStore />}
        {view === 'my-account' && <MyAccountView />}
        {view === 'my-purchase' && <MyPurchaseView />}
        {view === 'analyze' && <ImageAnalysis />}
      </main>

      <footer className="bg-slate-900 text-slate-400 py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-4 text-white">
                <Package className="h-6 w-6 text-secondary" />
                <span className="text-lg font-bold">AutoPartsSL</span>
              </div>
              <p className="text-sm">
                Sri Lanka's #1 marketplace for genuine and reconditioned auto parts. Connecting buyers with trusted sellers island-wide.
              </p>
            </div>
            
            <div>
              <h4 className="text-white font-bold mb-4">Shop</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="hover:text-secondary">All Parts</a></li>
                <li><a href="#" className="hover:text-secondary">Toyota Parts</a></li>
                <li><a href="#" className="hover:text-secondary">Honda Parts</a></li>
                <li><a href="#" className="hover:text-secondary">Hybrid Batteries</a></li>
              </ul>
            </div>

            <div>
              <h4 className="text-white font-bold mb-4">Support</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="hover:text-secondary">Help Center</a></li>
                <li><a href="#" className="hover:text-secondary">Selling on AutoPartsSL</a></li>
                <li><a href="#" className="hover:text-secondary">Return Policy</a></li>
                <li><a href="#" className="hover:text-secondary">Contact Us</a></li>
              </ul>
            </div>

            <div>
              <h4 className="text-white font-bold mb-4">Contact</h4>
              <ul className="space-y-2 text-sm">
                <li className="flex items-center gap-2"><Phone className="h-4 w-4" /> 011 2 345 678</li>
                <li className="flex items-center gap-2"><Mail className="h-4 w-4" /> support@autoparts.lk</li>
                <li className="flex items-center gap-2"><MapPin className="h-4 w-4" /> Colombo 10, Sri Lanka</li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-slate-800 pt-8 flex flex-col md:flex-row justify-between items-center text-sm">
            <p>&copy; 2025 AutoPartsSL. All rights reserved.</p>
            <div className="flex gap-4 mt-4 md:mt-0">
               <a href="#" className="hover:text-white">Privacy Policy</a>
               <a href="#" className="hover:text-white">Terms of Service</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

const App: React.FC = () => {
  return (
    <NotificationProvider>
      <AppProvider>
        <AppContent />
      </AppProvider>
    </NotificationProvider>
  );
};

export default App;
