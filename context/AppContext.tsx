
import React, { createContext, useContext, useState, useCallback, ReactNode, useEffect } from 'react';
import { CartItem, Product, User, UserRole, Vehicle, Vendor, Order, Address, PaymentMethod, Condition, Origin } from '../types';
import { api } from '../services/api';
import { useNotification } from './NotificationContext';

interface AppState {
  currentUser: User;
  cart: CartItem[];
  products: Product[];
  vehicles: Vehicle[];
  vendors: Vendor[];
  selectedVehicle: Vehicle | null;
  selectedProduct: Product | null;
  selectedVendorPublic: Vendor | null;
  view: 'marketplace' | 'product-details' | 'vendor' | 'cart' | 'checkout' | 'order-success' | 'login' | 'vendor-login' | 'register-vendor' | 'my-account' | 'my-purchase' | 'vendor-store' | 'analyze' | 'admin-dashboard';
  searchQuery: string;
  isAuthModalOpen: boolean;
  authView: 'login' | 'register';
  authModalMode: 'login' | 'register';
  lastOrder: Order | null;
  orders: Order[];
  vendorOrders: Order[];
  isLoading: boolean;
}

interface AppContextType extends AppState {
  addToCart: (product: Product) => void;
  removeFromCart: (productId: string) => void;
  setSelectedVehicle: (vehicle: Vehicle | null) => void;
  switchUserRole: (role: UserRole) => void;
  setView: (view: AppState['view']) => void;
  viewProduct: (product: Product) => void;
  viewVendorStore: (vendorId: string) => void;
  setSearchQuery: (query: string) => void;
  login: (email: string, password?: string) => Promise<void>;
  vendorLogin: (email: string, password?: string) => Promise<void>;
  logout: () => void;
  registerVendor: (email: string, password: string, businessName: string, phone: string, location: string) => Promise<void>;
  registerBuyer: (data: { email: string, password: string, name: string, phone: string }) => Promise<void>;
  addProduct: (productData: Partial<Product>) => Promise<void>;
  editProduct: (productId: string, productData: Partial<Product>) => Promise<void>;
  removeProduct: (productId: string) => Promise<void>;
  updateUserProfile: (data: Partial<User>) => void;
  updateVendorProfile: (vendorId: string, data: Partial<Vendor>) => Promise<void>;
  openAuthModal: (mode?: 'login' | 'register') => void;
  closeAuthModal: () => void;
  setAuthView: (view: 'login' | 'register') => void;
  placeOrder: (address: Address, paymentMethod: PaymentMethod) => Promise<void>;
  updateOrderStatus: (orderId: string, status: Order['status'], tracking?: {trackingNumber: string, courier: string}) => Promise<void>;
  issueRefund: (orderId: string) => Promise<void>;
  getVendor: (id: string) => Vendor | undefined;
  toggleVendorVerification: (vendorId: string, verified: boolean) => Promise<void>;
  seedDatabase: () => Promise<void>;
  addVehicle: (vehicleData: Partial<Vehicle>) => Promise<void>;
  editVehicle: (vehicleId: string, data: Partial<Vehicle>) => Promise<void>;
  removeVehicle: (vehicleId: string) => Promise<void>;
  manageVehicleBatch: (ops: { creates: Vehicle[], updates: any[], deletes: string[] }) => Promise<void>;
}

const defaultUser: User = { id: 'u1', name: 'Guest Buyer', role: 'buyer' };

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { notify } = useNotification();
  const [user, setUser] = useState<User>(defaultUser);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | null>(null);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [selectedVendorPublic, setSelectedVendorPublic] = useState<Vendor | null>(null);
  const [view, setView] = useState<AppState['view']>('marketplace');
  const [searchQuery, setSearchQuery] = useState('');
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authView, setAuthView] = useState<'login' | 'register'>('login');
  const [authModalMode, setAuthModalMode] = useState<'login' | 'register'>('login');
  const [lastOrder, setLastOrder] = useState<Order | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [vendorOrders, setVendorOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchData = useCallback(async () => {
    setIsLoading(true);
    try {
      const [fetchedProducts, fetchedVehicles, fetchedVendors] = await Promise.all([
        api.getProducts(),
        api.getVehicles(),
        api.getVendors()
      ]);
      setProducts(fetchedProducts);
      setVehicles(fetchedVehicles);
      setVendors(fetchedVendors);
    } catch (error) {
      console.error("Failed to fetch initial data", error);
      notify('error', 'Failed to load initial data');
    } finally {
      setIsLoading(false);
    }
  }, [notify]);

  useEffect(() => { fetchData(); }, [fetchData]);

  useEffect(() => {
    if (user.role === 'buyer' && user.id !== 'u1') {
      const unsubscribe = api.subscribeToOrders(user.id, (fetchedOrders) => {
        setOrders(fetchedOrders.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()));
      });
      return () => unsubscribe();
    } else { setOrders([]); }
  }, [user.id, user.role]);

  useEffect(() => {
    if (user.role === 'vendor' && user.vendorId) {
      const unsubscribe = api.subscribeToVendorOrders(user.vendorId, (fetchedOrders) => {
        setVendorOrders(fetchedOrders.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()));
      });
      return () => unsubscribe();
    } else { setVendorOrders([]); }
  }, [user.vendorId, user.role]);

  const addToCart = useCallback((product: Product) => {
    setCart(prev => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) {
        notify('success', 'Cart quantity updated');
        return prev.map(item => item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item);
      }
      notify('success', 'Added to cart');
      return [...prev, { ...product, quantity: 1 }];
    });
  }, [notify]);

  const removeFromCart = useCallback((productId: string) => {
    setCart(prev => prev.filter(item => item.id !== productId));
    notify('info', 'Item removed from cart');
  }, [notify]);

  const switchUserRole = useCallback(async (role: UserRole) => {
    setIsLoading(true);
    await new Promise(r => setTimeout(r, 500));
    if (role === 'vendor') {
      try {
          const vUser = await api.loginVendor('demo@vendor.com'); 
          setUser(vUser);
          setView('vendor');
          notify('success', 'Switched to Vendor Mode');
      } catch(e) { setView('vendor-login'); }
    } else {
      setUser(defaultUser);
      setView('marketplace');
      notify('success', 'Switched to Buyer Mode');
    }
    setIsLoading(false);
  }, [notify]);

  const viewProduct = useCallback((product: Product) => {
    setSelectedProduct(product);
    setView('product-details');
  }, []);

  const viewVendorStore = useCallback((vendorId: string) => {
    const vendor = vendors.find(v => v.id === vendorId);
    if (vendor) {
      setSelectedVendorPublic(vendor);
      setView('vendor-store');
    } else {
      notify('error', 'Vendor profile not found');
    }
  }, [vendors, notify]);

  const login = useCallback(async (email: string, password?: string) => {
    try {
      const loggedInUser = await api.loginUser(email, password);
      setUser(loggedInUser);
      if (loggedInUser.role === 'admin') {
          setView('admin-dashboard');
          notify('success', `Welcome, Administrator.`);
      } else {
          setView('marketplace');
          notify('success', `Welcome back, ${loggedInUser.name}!`);
      }
      setIsAuthModalOpen(false);
    } catch (error: any) {
      notify('error', "Login failed. Please check your credentials.");
    }
  }, [notify]);

  const vendorLogin = useCallback(async (email: string, password?: string) => {
    setIsLoading(true);
    try {
      const vUser = await api.loginVendor(email, password);
      setUser(vUser);
      setView('vendor');
      notify('success', 'Vendor Login Successful');
    } catch (error: any) {
      notify('error', error.message || "Vendor login failed");
    } finally {
      setIsLoading(false);
    }
  }, [notify]);

  const logout = useCallback(() => {
    setUser(defaultUser);
    setView('marketplace');
    setCart([]); setOrders([]); setVendorOrders([]);
    notify('info', 'Logged out successfully');
  }, [notify]);

  const registerVendor = useCallback(async (email: string, password: string, businessName: string, phone: string, location: string) => {
    setIsLoading(true);
    try {
      const newUser = await api.registerVendor(email, password, businessName, phone, location);
      setUser(newUser);
      setVendors(prev => [...prev, { id: newUser.id, name: businessName, location: location, rating: 5, verified: false }]);
      setView('vendor');
      notify('success', "Registration Successful!");
    } catch (error: any) {
        notify('error', "Registration Failed: " + error.message);
    } finally {
        setIsLoading(false);
    }
  }, [notify]);

  const registerBuyer = useCallback(async (data: { email: string, password: string, name: string, phone: string }) => {
    setIsLoading(true);
    try {
      const newUser = await api.registerBuyer(data);
      setUser(newUser);
      setIsAuthModalOpen(false);
      notify('success', "Registration Successful!");
    } catch (error: any) {
      notify('error', "Registration Failed: " + error.message);
    } finally {
      setIsLoading(false);
    }
  }, [notify]);

  const addProduct = useCallback(async (productData: Partial<Product>) => {
    setIsLoading(true);
    const newProduct: Product = {
      id: `p${Date.now()}`,
      vendorId: user.vendorId || 'vnd1', 
      title: productData.title || 'Untitled',
      price: productData.price || 0,
      sku: `SKU-${Date.now().toString().slice(-6)}`,
      condition: productData.condition || Condition.New,
      origin: productData.origin || Origin.Japan,
      compatibleVehicles: productData.compatibleVehicles || [],
      category: productData.category || 'General',
      imageUrl: productData.imageUrl || '', 
      stock: 1,
      brand: 'Generic',
      ...productData 
    } as Product;

    try {
        await api.addProduct(newProduct);
        setProducts(prev => [newProduct, ...prev]);
        notify('success', 'Product listed successfully');
    } catch (e) {
        notify('error', "Failed to add product");
    } finally {
        setIsLoading(false);
    }
  }, [user, notify]);

  const editProduct = useCallback(async (productId: string, productData: Partial<Product>) => {
    setIsLoading(true);
    try {
      await api.updateProduct(productId, productData);
      setProducts(prev => prev.map(p => p.id === productId ? { ...p, ...productData } : p));
      notify('success', 'Product updated successfully');
    } catch (e) {
      notify('error', 'Failed to update product');
    } finally {
      setIsLoading(false);
    }
  }, [notify]);

  const removeProduct = useCallback(async (productId: string) => {
    try {
      await api.deleteProduct(productId);
      setProducts(prev => prev.filter(p => p.id !== productId));
      notify('success', 'Product deleted');
    } catch (e) {
      notify('error', 'Failed to delete product');
    }
  }, [notify]);

  // VEHICLE CRUD
  const addVehicle = useCallback(async (data: Partial<Vehicle>) => {
    setIsLoading(true);
    try {
        const v = { id: `v${Date.now()}`, ...data } as Vehicle;
        await api.addVehicle(v);
        setVehicles(prev => [...prev, v]);
        notify('success', 'Vehicle added');
    } catch(e) { notify('error', 'Failed to add vehicle'); }
    finally { setIsLoading(false); }
  }, [notify]);

  const editVehicle = useCallback(async (id: string, data: Partial<Vehicle>) => {
    setIsLoading(true);
    try {
        await api.updateVehicle(id, data);
        setVehicles(prev => prev.map(v => v.id === id ? { ...v, ...data } : v));
        notify('success', 'Vehicle updated');
    } catch(e) { notify('error', 'Failed to update vehicle'); }
    finally { setIsLoading(false); }
  }, [notify]);

  const removeVehicle = useCallback(async (id: string) => {
    try {
        await api.deleteVehicle(id);
        setVehicles(prev => prev.filter(v => v.id !== id));
        notify('success', 'Vehicle deleted');
    } catch(e) { notify('error', 'Failed to delete vehicle'); }
  }, [notify]);

  const manageVehicleBatch = useCallback(async (ops: { creates: Vehicle[], updates: any[], deletes: string[] }) => {
    setIsLoading(true);
    try {
      await api.manageVehicleBatch(ops);
      // Refresh local state logic
      setVehicles(prev => {
        let next = [...prev];
        // removes
        const delSet = new Set(ops.deletes);
        next = next.filter(v => !delSet.has(v.id));
        // updates
        const upMap = new Map(ops.updates.map(u => [u.id, u.data]));
        next = next.map(v => upMap.has(v.id) ? { ...v, ...upMap.get(v.id) } : v);
        // creates
        next = [...next, ...ops.creates];
        return next;
      });
      notify('success', 'Changes saved successfully');
    } catch (e) {
      console.error(e);
      notify('error', 'Batch update failed');
    } finally {
      setIsLoading(false);
    }
  }, [notify]);

  const updateUserProfile = useCallback((data: Partial<User>) => {
    setUser(prev => ({ ...prev, ...data }));
    notify('success', 'Profile updated');
  }, [notify]);

  const updateVendorProfile = useCallback(async (id: string, data: Partial<Vendor>) => {
    setIsLoading(true);
    try {
      await api.updateVendor(id, data);
      setVendors(prev => prev.map(v => v.id === id ? { ...v, ...data } : v));
      if (data.name && user.vendorId === id) setUser(prev => ({ ...prev, name: data.name! }));
      notify('success', 'Store profile updated');
    } catch (e) { notify('error', 'Failed to update profile'); }
    finally { setIsLoading(false); }
  }, [user.vendorId, notify]);

  const toggleVendorVerification = useCallback(async (id: string, verified: boolean) => {
    try {
        await api.toggleVendorVerification(id, verified);
        setVendors(prev => prev.map(v => v.id === id ? { ...v, verified } : v));
        notify('success', `Vendor ${verified ? 'Verified' : 'Unverified'}`);
    } catch(e) { notify('error', 'Failed to update status'); }
  }, [notify]);

  const openAuthModal = useCallback((mode: 'login' | 'register' = 'login') => {
    setAuthModalMode(mode); setAuthView(mode); setIsAuthModalOpen(true);
  }, []);
  const closeAuthModal = useCallback(() => setIsAuthModalOpen(false), []);

  const placeOrder = useCallback(async (address: Address, paymentMethod: PaymentMethod) => {
    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0) + 450;
    try {
      const res = await api.simulatePayment(total, paymentMethod);
      if (!res.success) throw new Error(res.error);
      
      const newOrder: Order = {
        id: `ORD-${Date.now().toString().slice(-6)}`,
        userId: user.id,
        items: [...cart],
        totalAmount: total,
        shippingAddress: address,
        paymentMethod,
        status: 'pending',
        paymentStatus: paymentMethod === 'cod' ? 'pending' : 'paid',
        date: new Date().toISOString()
      };
      await api.createOrder(newOrder);
      setLastOrder(newOrder);
      setCart([]); 
      setView('order-success');
      notify('success', 'Order placed successfully!');
    } catch (error: any) {
      notify('error', error.message || "Payment failed");
      throw error;
    }
  }, [cart, user.id, notify]);

  const updateOrderStatus = useCallback(async (id: string, status: Order['status'], tracking?: any) => {
    try {
      await api.updateOrderStatus(id, status, tracking);
      setVendorOrders(prev => prev.map(o => o.id === id ? { ...o, status, ...(tracking && { trackingNumber: tracking.trackingNumber, courier: tracking.courier }) } : o));
      notify('success', `Status updated to ${status}`);
    } catch (e) { notify('error', "Failed to update status"); }
  }, [notify]);

  const issueRefund = useCallback(async (id: string) => {
    try {
      await api.refundOrder(id);
      setVendorOrders(prev => prev.map(o => o.id === id ? { ...o, paymentStatus: 'refunded' } : o));
      notify('success', 'Refund processed');
    } catch (e) { notify('error', 'Refund failed'); }
  }, [notify]);

  const getVendor = useCallback((id: string) => vendors.find(v => v.id === id), [vendors]);
  const seedDatabase = useCallback(async () => {}, []);

  const value = {
    currentUser: user, cart, products, vehicles, vendors, selectedVehicle, selectedProduct, selectedVendorPublic, view, searchQuery, isAuthModalOpen, authView, authModalMode, lastOrder, orders, vendorOrders, isLoading,
    addToCart, removeFromCart, setSelectedVehicle, switchUserRole, setView, viewProduct, viewVendorStore, setSearchQuery, login, vendorLogin, logout, registerVendor, registerBuyer, addProduct, editProduct, removeProduct, updateUserProfile, updateVendorProfile, openAuthModal, closeAuthModal, setAuthView, placeOrder, updateOrderStatus, issueRefund, getVendor, toggleVendorVerification, seedDatabase,
    addVehicle, editVehicle, removeVehicle, manageVehicleBatch
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (context === undefined) throw new Error('useApp must be used within an AppProvider');
  return context;
};
