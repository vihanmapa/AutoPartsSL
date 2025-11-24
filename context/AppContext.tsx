
import React, { createContext, useContext, useState, useCallback, ReactNode, useEffect } from 'react';
import { CartItem, Product, User, UserRole, Vehicle, Vendor, Order, Address, PaymentMethod, Condition, Origin } from '../types';
import { api } from '../services/api';

interface AppState {
  currentUser: User;
  cart: CartItem[];
  products: Product[];
  vehicles: Vehicle[];
  vendors: Vendor[];
  selectedVehicle: Vehicle | null;
  selectedProduct: Product | null;
  selectedVendorPublic: Vendor | null;
  view: 'marketplace' | 'product-details' | 'vendor' | 'cart' | 'checkout' | 'order-success' | 'login' | 'vendor-login' | 'register-vendor' | 'my-account' | 'my-purchase' | 'vendor-store';
  searchQuery: string;
  isAuthModalOpen: boolean;
  authView: 'login' | 'register';
  authModalMode: 'login' | 'register';
  lastOrder: Order | null;
  orders: Order[];
  isLoading: boolean;
}

interface VendorRegistrationData {
  businessName: string;
  email: string;
  location: string;
  phone: string;
  password?: string;
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
  updateUserProfile: (data: Partial<User>) => void;
  updateVendorProfile: (vendorId: string, data: Partial<Vendor>) => Promise<void>;
  openAuthModal: (mode?: 'login' | 'register') => void;
  closeAuthModal: () => void;
  setAuthView: (view: 'login' | 'register') => void;
  placeOrder: (address: Address, paymentMethod: PaymentMethod) => Promise<void>;
  getVendor: (id: string) => Vendor | undefined;
}

const defaultUser: User = {
  id: 'u1',
  name: 'Guest Buyer',
  role: 'buyer'
};

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
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
  const [isLoading, setIsLoading] = useState(true);

  // Initial Data Fetch
  useEffect(() => {
    const fetchData = async () => {
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
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  // Real-time Orders Subscription
  useEffect(() => {
    if (user.id === 'u1') {
      setOrders([]);
      return;
    }

    const unsubscribe = api.subscribeToOrders(user.id, (fetchedOrders) => {
      // Sort orders client-side (newest first)
      const sortedOrders = fetchedOrders.sort((a, b) => 
        new Date(b.date).getTime() - new Date(a.date).getTime()
      );
      setOrders(sortedOrders);
    });

    return () => unsubscribe();
  }, [user.id]);

  const addToCart = useCallback((product: Product) => {
    setCart(prev => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) {
        return prev.map(item => 
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prev, { ...product, quantity: 1 }];
    });
  }, []);

  const removeFromCart = useCallback((productId: string) => {
    setCart(prev => prev.filter(item => item.id !== productId));
  }, []);

  const switchUserRole = useCallback(async (role: UserRole) => {
    setIsLoading(true);
    await new Promise(r => setTimeout(r, 500));
    
    if (role === 'vendor') {
      try {
          const vUser = await api.loginVendor('demo@vendor.com'); 
          setUser(vUser);
          setView('vendor');
      } catch(e) {
          setView('vendor-login'); 
      }
    } else {
      setUser(defaultUser);
      setView('marketplace');
    }
    setIsLoading(false);
  }, []);

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
      console.warn("Vendor not found:", vendorId);
    }
  }, [vendors]);

  const login = useCallback(async (email: string, password?: string) => {
    try {
      const loggedInUser = await api.loginUser(email, password);
      setUser(loggedInUser);
      setView('marketplace');
      setIsAuthModalOpen(false);
    } catch (error) {
      console.error(error);
      alert("Login failed. Check console for details.");
    }
  }, []);

  const vendorLogin = useCallback(async (email: string, password?: string) => {
    setIsLoading(true);
    try {
      const vUser = await api.loginVendor(email, password);
      setUser(vUser);
      setView('vendor');
    } catch (error: any) {
      console.error(error);
      alert(error.message || "Vendor login failed");
    } finally {
      setIsLoading(false);
    }
  }, []);

  const logout = useCallback(() => {
    setUser(defaultUser);
    setView('marketplace');
    setCart([]); 
    setOrders([]);
  }, []);

  // Re-implemented Context registerVendor
  const registerVendor = useCallback(async (email: string, password: string, businessName: string, phone: string, location: string) => {
    setIsLoading(true);
    try {
      console.log("Context: Calling API registerVendor...");
      // Call the API
      const newUser = await api.registerVendor(email, password, businessName, phone, location);
      
      console.log("Context: Registration successful for user:", newUser.id);
      setUser(newUser);
      
      setVendors(prev => [...prev, { 
          id: newUser.id, 
          name: businessName, 
          location: location, 
          rating: 5, 
          verified: false 
      }]);
      
      setView('vendor');
      alert("Registration Successful! Welcome to your Dashboard.");
      
    } catch (error: any) {
        console.error("Context Registration Error:", error);
        alert("Registration Failed: " + error.message);
    } finally {
        setIsLoading(false);
    }
  }, []);

  // Add registerBuyer to context
  const registerBuyer = useCallback(async (data: { email: string, password: string, name: string, phone: string }) => {
    setIsLoading(true);
    try {
      const newUser = await api.registerBuyer(data);
      setUser(newUser);
      setIsAuthModalOpen(false);
      alert("Registration Successful!");
    } catch (error: any) {
      console.error("Registration Error:", error);
      alert("Registration Failed: " + error.message);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const addProduct = useCallback(async (productData: Partial<Product>) => {
    setIsLoading(true);
    
    const newProduct: Product = {
      id: `p${Date.now()}`,
      vendorId: user.vendorId || 'vnd1', 
      title: productData.title || 'Untitled Product',
      price: productData.price || 0,
      sku: `SKU-${Date.now().toString().slice(-6)}`,
      condition: productData.condition || Condition.New,
      origin: productData.origin || Origin.Japan,
      compatibleVehicleIds: productData.compatibleVehicleIds || [],
      category: productData.category || 'General',
      // Use provided image URL or fallback to random placeholder
      imageUrl: productData.imageUrl || ('https://picsum.photos/400/300?random=' + Date.now()), 
      stock: 1,
      brand: 'Generic',
      ...productData 
    } as Product;

    try {
        await api.addProduct(newProduct);
        setProducts(prevProducts => [newProduct, ...prevProducts]);
    } catch (e) {
        console.error("Failed to add product", e);
        alert("Failed to add product");
    } finally {
        setIsLoading(false);
    }
  }, [user]);

  const updateUserProfile = useCallback((data: Partial<User>) => {
    setUser(prev => ({ ...prev, ...data }));
  }, []);

  const updateVendorProfile = useCallback(async (vendorId: string, data: Partial<Vendor>) => {
    setIsLoading(true);
    try {
      await api.updateVendor(vendorId, data);
      setVendors(prev => prev.map(v => v.id === vendorId ? { ...v, ...data } : v));
      // Optionally update current user name if business name changed
      if (data.name && user.vendorId === vendorId) {
        setUser(prev => ({ ...prev, name: data.name! }));
      }
    } catch (error) {
      console.error("Failed to update vendor profile", error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, [user.vendorId]);

  const openAuthModal = useCallback((mode: 'login' | 'register' = 'login') => {
    setAuthModalMode(mode);
    setAuthView(mode);
    setIsAuthModalOpen(true);
  }, []);
  
  const closeAuthModal = useCallback(() => setIsAuthModalOpen(false), []);

  const placeOrder = useCallback(async (address: Address, paymentMethod: PaymentMethod) => {
    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    
    const newOrder: Order = {
      id: `ORD-${Date.now().toString().slice(-6)}`,
      userId: user.id,
      items: [...cart],
      totalAmount: total,
      shippingAddress: address,
      paymentMethod,
      status: 'pending',
      date: new Date().toISOString()
    };

    try {
      await api.createOrder(newOrder);
      setLastOrder(newOrder);
      setCart([]); 
      setView('order-success');
    } catch (error) {
      console.error("Failed to place order:", error);
      alert("Failed to place order. Please try again.");
    }
  }, [cart, user.id]);

  const getVendor = useCallback((id: string) => {
    return vendors.find(v => v.id === id);
  }, [vendors]);

  const value = {
    currentUser: user,
    cart,
    products,
    vehicles,
    vendors,
    selectedVehicle,
    selectedProduct,
    selectedVendorPublic,
    view,
    searchQuery,
    isAuthModalOpen,
    authView,
    authModalMode,
    lastOrder,
    orders,
    isLoading,
    addToCart,
    removeFromCart,
    setSelectedVehicle,
    switchUserRole,
    setView,
    viewProduct,
    viewVendorStore,
    setSearchQuery,
    login,
    vendorLogin,
    logout,
    registerVendor,
    registerBuyer,
    addProduct,
    updateUserProfile,
    updateVendorProfile,
    openAuthModal,
    closeAuthModal,
    setAuthView,
    placeOrder,
    getVendor
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
