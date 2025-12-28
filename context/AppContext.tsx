import React, { createContext, useContext, useState, useCallback, ReactNode, useEffect } from 'react';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { auth, db } from '../services/firebase';
import { doc, getDoc, onSnapshot } from 'firebase/firestore';
import { CartItem, Product, User, UserRole, Vehicle, Vendor, Order, Address, PaymentMethod, Condition, Origin, Category, AIAnalysisState } from '../types';
import { api } from '../services/api';
import { useNotification } from './NotificationContext';

interface AppState {
  currentUser: User | null;
  cart: CartItem[];
  products: Product[];
  vehicles: Vehicle[];
  vendors: Vendor[];
  categories: Category[];
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
  loadingMessage: string;
  isVehicleSelectorOpen: boolean;
  vehicleSelectorMode: 'select' | 'add-to-garage';
  aiScanState: AIAnalysisState;
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
  updateUserEmail: (email: string) => Promise<void>;
  updateUserPassword: (password: string) => Promise<void>;
  deleteUserAccount: () => Promise<void>;
  openAuthModal: (mode?: 'login' | 'register') => void;
  closeAuthModal: () => void;
  setAuthView: (view: 'login' | 'register') => void;
  setVehicleSelectorOpen: (isOpen: boolean) => void;
  setVehicleSelectorMode: (mode: 'select' | 'add-to-garage') => void;
  addToGarage: (vehicle: Vehicle) => Promise<void>;
  removeFromGarage: (vehicleId: string) => Promise<void>;
  placeOrder: (address: Address, paymentMethod: PaymentMethod, vehicleDetails?: { vinNumber: string }) => Promise<void>;
  updateOrderStatus: (orderId: string, status: Order['status'], tracking?: { trackingNumber: string, courier: string }) => Promise<void>;
  issueRefund: (orderId: string) => Promise<void>;
  verifyOrderFitment: (orderId: string, status: 'verified' | 'failed') => Promise<void>;
  cancelOrder: (orderId: string, reason: string, description?: string) => Promise<void>;
  markOrderRefunded: (orderId: string) => Promise<void>;
  getVendor: (id: string) => Vendor | undefined;
  toggleVendorVerification: (vendorId: string, verified: boolean) => Promise<void>;
  seedDatabase: () => Promise<void>;
  addVehicle: (vehicleData: Partial<Vehicle>) => Promise<void>;
  editVehicle: (vehicleId: string, data: Partial<Vehicle>) => Promise<void>;
  removeVehicle: (vehicleId: string) => Promise<void>;
  manageVehicleBatch: (ops: { creates: Vehicle[], updates: any[], deletes: string[] }) => Promise<void>;
  selectedCategory: string | null;
  setSelectedCategory: (category: string | null) => void;
  saveAIScan: (state: AIAnalysisState) => void;
}

const defaultUser: User = { id: 'u1', name: 'Guest Buyer', role: 'buyer' };

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { notify } = useNotification();
  const [user, setUser] = useState<User>(() => {
    try {
      const local = localStorage.getItem('autoparts_user');
      return local ? JSON.parse(local) : defaultUser;
    } catch { return defaultUser; }
  });
  const [cart, setCart] = useState<CartItem[]>(() => {
    try {
      const local = localStorage.getItem('autoparts_guest_cart');
      return local ? JSON.parse(local) : [];
    } catch { return []; }
  });
  const [aiScanState, setAIScanState] = useState<AIAnalysisState>(() => {
    try {
      const local = localStorage.getItem('autoparts_guest_scan');
      return local ? JSON.parse(local) : { image: null, result: null, isAnalyzing: false };
    } catch { return { image: null, result: null, isAnalyzing: false }; }
  });
  const [products, setProducts] = useState<Product[]>([]);
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedVehicle, _setSelectedVehicle] = useState<Vehicle | null>(() => {
    try {
      const local = localStorage.getItem('autoparts_selected_vehicle');
      return local ? JSON.parse(local) : null;
    } catch { return null; }
  });
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedVendorPublic, setSelectedVendorPublic] = useState<Vendor | null>(null);
  const [view, setView] = useState<AppState['view']>(() => {
    try {
      // Priority 1: Check user role from storage
      const localUserStr = localStorage.getItem('autoparts_user');
      if (localUserStr) {
        const localUser = JSON.parse(localUserStr);
        if (localUser.role === 'admin') return 'admin-dashboard';
        if (localUser.role === 'vendor') return 'vendor';
      }
      // Priority 2: Last saved view
      const local = localStorage.getItem('autoparts_view');
      return (local as any) || 'marketplace';
    } catch { return 'marketplace'; }
  });
  const [searchQuery, setSearchQuery] = useState('');
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authView, setAuthView] = useState<'login' | 'register'>('login');
  const [authModalMode, setAuthModalMode] = useState<'login' | 'register'>('login');
  const [lastOrder, setLastOrder] = useState<Order | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [vendorOrders, setVendorOrders] = useState<Order[]>([]);
  const [isVehicleSelectorOpen, setVehicleSelectorOpen] = useState(false);
  const [vehicleSelectorMode, setVehicleSelectorMode] = useState<'select' | 'add-to-garage'>('select');
  const [loadingMessage, setLoadingMessage] = useState('');
  const [authLoading, setAuthLoading] = useState(true);
  const [dataLoading, setDataLoading] = useState(true);
  const [isLoading, setIsLoading] = useState(true); // Derived or kept for backward compatibility

  console.log("AppProvider Render:", { user, authLoading, dataLoading, isLoading });

  // Update main isLoading based on both
  useEffect(() => {
    setIsLoading(authLoading || dataLoading);
  }, [authLoading, dataLoading]);


  // PERSISTENCE EFFECT
  useEffect(() => {
    if (user && user.id !== 'u1') { // Don't save guest/default user unless we want to, but 'u1' is default
      localStorage.setItem('autoparts_user', JSON.stringify(user));
    } else {
      // If user logged out or is default, maybe clear? 
      // Actually, if we are in guest mode, we don't want to clear if we are just initializing.
      // But for explicit logout, we handle it in logout()
    }
  }, [user]);

  useEffect(() => {
    if (view) {
      localStorage.setItem('autoparts_view', view);
    }
  }, [view]);

  const checkInternetConnection = async () => {
    try {
      if (navigator.onLine === false) return false;
      // Simple fetch check
      const online = await Promise.race([
        fetch('https://www.google.com/favicon.ico', { mode: 'no-cors' }),
        new Promise((_, reject) => setTimeout(() => reject(new Error('timeout')), 5000))
      ]);
      return true;
    } catch (e) {
      console.error("Internet check failed:", e);
      return false; // Assume offline if check fails
    }
  };

  const fetchData = useCallback(async () => {
    setDataLoading(true);
    console.log("Starting fetchData...");

    try {
      // Check for early init errors
      console.log("Importing firebase...");
      const { initError } = await import('../services/firebase');
      if (initError) {
        console.error("EARLY FIREBASE INIT ERROR:", initError);
        notify('error', 'Firebase failed to initialize. Check logs.');
        setDataLoading(false);
        return;
      }

      console.log("Checking internet...");
      const isOnline = await checkInternetConnection();
      if (!isOnline) {
        console.warn("No internet connection.");
        setDataLoading(false);
        notify('error', 'No internet connection detected.');
        return;
      }

      console.log("Fetching initial data from API...");
      // Fetch data in parallel but handle failures individually
      const [productsResult, vehiclesResult, vendorsResult] = await Promise.allSettled([
        api.getProducts(),
        api.getVehicles(),
        api.getVendors(),
      ]);

      if (productsResult.status === 'fulfilled') {
        console.log("Products fetched:", productsResult.value.length);
        setProducts(productsResult.value);
      } else {
        console.error("Failed to fetch products:", productsResult.reason);
        notify('error', 'Failed to load products');
      }

      if (vehiclesResult.status === 'fulfilled') {
        console.log("Vehicles fetched:", vehiclesResult.value.length);
        setVehicles(vehiclesResult.value);
      } else {
        console.error("Failed to fetch vehicles:", vehiclesResult.reason);
        notify('error', 'Failed to load vehicles');
      }

      if (vendorsResult.status === 'fulfilled') {
        console.log("Vendors fetched:", vendorsResult.value.length);
        setVendors(vendorsResult.value);
      } else {
        console.error("Failed to fetch vendors:", vendorsResult.reason);
        notify('error', 'Failed to load vendors');
      }



    } catch (error: any) {
      console.error("Critical error in fetchData", error);
      notify('error', `Data load failed: ${error.message}`);
    } finally {
      console.log("fetchData finished, setting dataLoading to false");
      setDataLoading(false);
    }
  }, [notify]);

  useEffect(() => {
    console.log("Setting up Auth Listener...");
    let unsubscribe: any;
    try {
      unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
        console.log("Auth state changed:", firebaseUser ? "User logged in" : "User logged out");
        if (firebaseUser) {
          const docRef = doc(db, 'users', firebaseUser.uid);
          // Real-time listener for user profile changes
          unsubscribe = onSnapshot(docRef, async (docSnap) => {
            if (docSnap.exists()) {
              const userData = docSnap.data() as any;

              // Normalize Legacy Address Data
              if (!userData.address && (userData.city || userData.district || userData.postalCode)) {
                userData.address = {
                  fullName: userData.fullName || userData.name || '',
                  phone: userData.phone || '',
                  addressLine1: userData.addressLine1 || '',
                  city: userData.city || '',
                  district: userData.district || '',
                  postalCode: userData.postalCode || ''
                };
              }

              let userCart = userData.cart || [];

              // CART MERGE LOGIC
              const guestCartStr = localStorage.getItem('autoparts_guest_cart');
              if (guestCartStr) {
                try {
                  const guestCart = JSON.parse(guestCartStr);
                  if (guestCart.length > 0) {
                    console.log("Merging guest cart with user cart...");
                    const merged = [...userCart];
                    guestCart.forEach((gItem: CartItem) => {
                      const existing = merged.find(m => m.id === gItem.id);
                      if (existing) existing.quantity += gItem.quantity;
                      else merged.push(gItem);
                    });
                    userCart = merged;

                    // Clear guest cart from storage to prevent re-merging
                    localStorage.removeItem('autoparts_guest_cart');

                    // Sync merged cart to Firestore
                    await api.updateUser(firebaseUser.uid, { cart: userCart });
                  } else {
                    localStorage.removeItem('autoparts_guest_cart');
                  }
                } catch (e) {
                  console.error("Error merging carts:", e);
                  localStorage.removeItem('autoparts_guest_cart');
                }
              }

              // AI SCAN MERGE/LOAD LOGIC
              let userScan = userData.savedScan || { image: null, result: null, isAnalyzing: false };
              const guestScanStr = localStorage.getItem('autoparts_guest_scan');

              if (guestScanStr) {
                try {
                  const guestScan = JSON.parse(guestScanStr);
                  // If guest has result, it takes precedence (assuming recent activity)
                  if (guestScan.image || guestScan.result) {
                    console.log("Merging guest AI scan...");
                    userScan = guestScan;
                    // Sync to Firestore
                    // NOTE: Limit base64 image size or maybe fail silently for large images in sync, 
                    // but keep local state active

                    // We try to sync. If it fails due to size, just keep local.
                    // Ideally we upload to storage, but for quick fix:
                    try {
                      await api.updateUser(firebaseUser.uid, { savedScan: userScan });
                    } catch (e) { console.warn("Could not sync large scan to DB, but keeping locally"); }

                    localStorage.removeItem('autoparts_guest_scan');
                  } else {
                    localStorage.removeItem('autoparts_guest_scan');
                  }
                } catch (e) { localStorage.removeItem('autoparts_guest_scan'); }
              }
              setAIScanState(userScan);
              // Ensure local cache matches DB for persistence reliability
              localStorage.setItem('autoparts_guest_scan', JSON.stringify(userScan));


              // VEHICLE MERGE LOGIC (User Saved vs Guest Selection)
              if (userData.savedVehicleId) {
                // User has a saved vehicle preference
                // We resolve it in the existing useEffect for savedVehicleId below
                // But we can preemptively set it if we have vehicles loaded? 
                // The useEffect [user, vehicles] handles it well.
              } else {
                // User has NO saved vehicle. Check if we have a local guest selection to adopt?
                const localVehicleStr = localStorage.getItem('autoparts_selected_vehicle');
                if (localVehicleStr) {
                  try {
                    const localVehicle = JSON.parse(localVehicleStr);
                    if (localVehicle) {
                      console.log("Adopting guest vehicle for new user session...");
                      // Adopt it
                      api.updateUser(firebaseUser.uid, { savedVehicleId: localVehicle.id });
                      // And set user state so logic picks it up
                      userData.savedVehicleId = localVehicle.id;
                    }
                  } catch (e) { }
                }
              }

              // Sync Firestore cart to Local State
              setCart(userCart);

              // Use userData which serves as the source of truth, merging with ID
              const hydratedUser = { id: firebaseUser.uid, ...userData } as User;
              setUser(hydratedUser);

              // Presist Admin/Vendor View on Refresh
              console.log("DEBUG: Hydrated User Role:", hydratedUser.role);
              if (hydratedUser.role === 'admin') {
                console.log("DEBUG: Redirecting to Admin Dashboard");
                setView('admin-dashboard');
              } else if (hydratedUser.role === 'vendor') {
                console.log("DEBUG: Redirecting to Vendor Dashboard");
                setView('vendor');
              }
            } else {
              // User logged in but no Firestore doc? Create placeholder
              console.log("DEBUG: User logged in but no Firestore doc found for:", firebaseUser.uid);
              const isGenericAdmin = firebaseUser.email === 'admin@autoparts.lk';
              console.log("DEBUG: Is Generic Admin Email?", isGenericAdmin);

              const newUser = {
                id: firebaseUser.uid,
                name: firebaseUser.displayName || 'User',
                email: firebaseUser.email || '',
                role: isGenericAdmin ? 'admin' : 'buyer'
              } as User;

              setUser(newUser);

              if (isGenericAdmin) {
                console.log("DEBUG: Force-setting view to admin-dashboard for generic admin");
                setView('admin-dashboard');
              }
            }
            setAuthLoading(false);
          });
        } else {
          // CHECK FOR LOCAL ADMIN (which is not in Firebase)
          const localUserStr = localStorage.getItem('autoparts_user');
          let preservedAdmin = false;
          if (localUserStr) {
            try {
              const localUser = JSON.parse(localUserStr);
              if (localUser && localUser.id === 'admin_user') {
                console.log("DEBUG: Preserving Local Admin Session despite no Firebase User.");
                setUser(localUser); // Ensure state matches persistence
                preservedAdmin = true;
              }
            } catch (e) { }
          }

          if (!preservedAdmin) {
            console.log("DEBUG: No Firebase User found and no Local Admin. Setting defaultUser.");
            setUser(defaultUser);
          }
          setAuthLoading(false);
        }
      });
    } catch (e) {
      console.error("Failed to setup auth listener:", e);
      setAuthLoading(false);
    }

    fetchData();

    // Subscribe to Categories
    const unsubscribeCategories = api.subscribeToCategories((cats) => {
      console.log("AppContext received categories update:", cats);
      setCategories(cats);
    });

    return () => {
      if (unsubscribe) unsubscribe();
      unsubscribeCategories();
    };
  }, [fetchData]);

  useEffect(() => {
    if (user && user.role === 'buyer' && user.id !== 'u1') {
      const unsubscribe = api.subscribeToOrders(user.id, (fetchedOrders) => {
        setOrders(fetchedOrders.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()));
      });
      return () => unsubscribe();
    } else { setOrders([]); }
  }, [user]);

  // Sync Saved Vehicle from User Profile
  // We prioritize the saved vehicle ID if it exists, effectively overwriting any guest selection
  useEffect(() => {
    if (user && user.savedVehicleId && vehicles.length > 0) {
      // 1. Try simple find (if ID matches raw DB ID) - Backward compatibility
      const exactMatch = vehicles.find(v => v.id === user.savedVehicleId);
      if (exactMatch) {
        // Prevent infinite loops if already selected
        if (selectedVehicle?.id !== exactMatch.id) {
          console.log("Restoring saved vehicle selection (Legacy):", exactMatch.model);
          _setSelectedVehicle(exactMatch);
        }
        return;
      }

      // 2. Search in Wizard Hierarchy (for synthetic IDs like brand-model-year)
      import('../services/vehicleTransformer').then(({ transformVehiclesToWizardData }) => {
        const hierarchy = transformVehiclesToWizardData(vehicles);
        let found = false;

        for (const brand of hierarchy) {
          for (const model of brand.models) {
            for (const year of model.years) {
              const generatedId = `${brand.id}-${model.id}-${year.id}`;
              if (generatedId === user.savedVehicleId) {
                // Only update if different to avoid re-renders/loops
                if (selectedVehicle?.id !== generatedId) {
                  console.log("Restoring saved vehicle selection:", `${brand.name} ${model.name} ${year.year}`);
                  _setSelectedVehicle({
                    id: generatedId,
                    make: brand.name,
                    model: model.name,
                    year: year.year,
                    bodyType: model.type as any
                  });
                  notify('info', `Restored vehicle: ${brand.name} ${model.name}`);
                }
                found = true;
                break;
              }
            }
            if (found) break;
          }
          if (found) break;
        }

        if (!found) {
          console.warn("Saved vehicle ID not found in current vehicle list:", user.savedVehicleId);
        }
      });
    }
  }, [user, vehicles, notify]); // Removed selectedVehicle to avoid unnecessary runs, added checks inside

  useEffect(() => {
    console.log("DEBUG: vendor/admin orders useEffect running. User:", user);
    if (user && (user.role === 'vendor' && user.vendorId)) {
      console.log("DEBUG: Subscribing to Vendor Orders for:", user.vendorId);
      const unsubscribe = api.subscribeToVendorOrders(user.vendorId, (fetchedOrders) => {
        setVendorOrders(fetchedOrders.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()));
      });
      return () => unsubscribe();
    } else if (user && user.role === 'admin') {
      console.log("DEBUG: User is Admin. Subscribing to ALL orders.");
      // Better approach: Admin just needs to see 'refund_pending' orders.
      // Let's use a new subscription in API.
      const unsubscribe = api.subscribeToAllOrders((fetchedOrders) => {
        console.log("DEBUG: Admin received all orders:", fetchedOrders.length);
        // Admin gets EVERYTHING to calculate total revenue/orders.
        // Filtering for specific tabs (like Refunds) happens in the UI.
        setVendorOrders(fetchedOrders.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()));
      });
      return () => unsubscribe();
    } else { setVendorOrders([]); }
  }, [user]);

  const saveAIScan = useCallback(async (state: AIAnalysisState) => {
    const stateWithTimestamp = { ...state, timestamp: Date.now() };
    setAIScanState(stateWithTimestamp);

    // ALWAYS save to localStorage as a fallback/cache (handles refresh for large images that fail DB sync)
    // We use the same key 'autoparts_guest_scan' effectively acting as 'current_session_scan'
    try {
      localStorage.setItem('autoparts_guest_scan', JSON.stringify(stateWithTimestamp));
    } catch (e) { console.error("Storage limit exceeded for scan", e); }

    if (user && user.id !== 'u1') {
      // Sync to User Profile
      try {
        await api.updateUser(user.id, { savedScan: stateWithTimestamp });
      } catch (e) {
        console.error("Failed to sync AI scan to cloud (likely size limit)", e);
        notify('warning', 'Scan saved locally only (Image too large for cloud sync)');
      }
    }
  }, [user, notify]);

  const setSelectedVehicle = useCallback((vehicle: Vehicle | null) => {
    _setSelectedVehicle(vehicle);

    // Always persist to local storage for guest/refresh persistence
    if (vehicle) {
      localStorage.setItem('autoparts_selected_vehicle', JSON.stringify(vehicle));
    } else {
      localStorage.removeItem('autoparts_selected_vehicle');
    }

    // Persist if logged in user
    if (vehicle && user && user.role === 'buyer' && user.id !== 'u1') {
      console.log("Persisting vehicle selection:", vehicle.id);
      api.updateUser(user.id, { savedVehicleId: vehicle.id }).catch(err => console.error("Failed to persist vehicle", err));
      // Update local user object too so it stays in sync without reload
      setUser(prev => ({ ...prev, savedVehicleId: vehicle.id }));
    }
  }, [user]);

  // Guest Cart Persistence
  useEffect(() => {
    if (!user || user.id === 'u1') {
      localStorage.setItem('autoparts_guest_cart', JSON.stringify(cart));
    }
  }, [cart, user]);

  const addToCart = useCallback(async (product: Product) => {
    let newCart: CartItem[] = [];
    setCart(prev => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) {
        newCart = prev.map(item => item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item);
        notify('success', 'Cart quantity updated');
      } else {
        newCart = [...prev, { ...product, quantity: 1 }];
        notify('success', 'Added to cart');
      }
      return newCart;
    });

    // Sync to Firestore if logged in
    if (user && user.id !== 'u1') {
      try {
        // Build the newCart manually to ensure we have the latest version for API
        // relying on state updater result is tricky, so we reconstruct logic or just use the local 'newCart' var calc
        // Since setState is async/batched, 'cart' in closure is old, but 'newCart' calculated inside is correct?
        // Wait, I can't extract 'newCart' easily from inside setState updater to outside scope in one go without refs or recalculating.
        // Recalculating is safer.
        const existing = cart.find(item => item.id === product.id);
        const cartToSave = existing
          ? cart.map(item => item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item)
          : [...cart, { ...product, quantity: 1 }];

        await api.updateUser(user.id, { cart: cartToSave });
      } catch (e) {
        console.error("Failed to sync cart", e);
      }
    }
  }, [cart, user, notify]);

  const removeFromCart = useCallback(async (productId: string) => {
    const newCart = cart.filter(item => item.id !== productId);
    setCart(newCart);
    notify('info', 'Item removed from cart');

    if (user && user.id !== 'u1') {
      try {
        await api.updateUser(user.id, { cart: newCart });
      } catch (e) {
        console.error("Failed to sync cart", e);
      }
    }
  }, [cart, user, notify]);

  const switchUserRole = useCallback(async (role: UserRole) => {
    setIsLoading(true);
    await new Promise(r => setTimeout(r, 500));
    if (role === 'vendor') {
      try {
        const vUser = await api.loginVendor('demo@vendor.com');
        setUser(vUser);
        setView('vendor');
        notify('success', 'Switched to Vendor Mode');
      } catch (e) { setView('vendor-login'); }
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



  const logout = useCallback(async () => {
    try {
      await signOut(auth);
      // Local state reset will happen via onAuthStateChanged or we force it here to be snappy
      setUser(defaultUser);
      setView('marketplace');
      setCart([]); setOrders([]); setVendorOrders([]);
      // Start fresh for guest
      localStorage.removeItem('autoparts_guest_cart');
      localStorage.removeItem('autoparts_guest_scan');
      localStorage.removeItem('autoparts_selected_vehicle');

      // CRITICAL: Clear Persist Keys
      localStorage.removeItem('autoparts_user');
      localStorage.removeItem('autoparts_view');

      notify('success', 'Logged out successfully');
    } catch (error) {
      console.error("Logout failed", error);
      notify('error', 'Logout failed');
    }
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
    } catch (e) { notify('error', 'Failed to add vehicle'); }
    finally { setIsLoading(false); }
  }, [notify]);

  const editVehicle = useCallback(async (id: string, data: Partial<Vehicle>) => {
    setIsLoading(true);
    try {
      await api.updateVehicle(id, data);
      setVehicles(prev => prev.map(v => v.id === id ? { ...v, ...data } : v));
      notify('success', 'Vehicle updated');
    } catch (e) { notify('error', 'Failed to update vehicle'); }
    finally { setIsLoading(false); }
  }, [notify]);

  const removeVehicle = useCallback(async (id: string) => {
    try {
      await api.deleteVehicle(id);
      setVehicles(prev => prev.filter(v => v.id !== id));
      notify('success', 'Vehicle deleted');
    } catch (e) { notify('error', 'Failed to delete vehicle'); }
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

  const updateUserProfile = useCallback(async (data: Partial<User>) => {
    if (!user || !user.id) return;
    setIsLoading(true);
    try {
      // Optimistic update
      setUser(prev => ({ ...prev, ...data }));

      await api.updateUser(user.id, data);
      notify('success', 'Profile updated');
    } catch (e: any) {
      // Revert optionally, or just notify
      notify('error', 'Failed to update profile: ' + e.message);
      // Ideally fetch fresh data here to revert
    } finally {
      setIsLoading(false);
    }
  }, [user, notify]);

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
    } catch (e) { notify('error', 'Failed to update status'); }
  }, [notify]);

  const verifyOrderFitment = useCallback(async (orderId: string, status: 'verified' | 'failed') => {
    try {
      await api.verifyOrderFitment(orderId, status);
      // Optimistically update local state for vendors
      setVendorOrders(prev => prev.map(o => {
        if (o.id === orderId && o.vehicleDetails) {
          const updates: any = {
            vehicleDetails: {
              ...o.vehicleDetails,
              verificationStatus: status,
              verifiedAt: status === 'verified' ? new Date().toISOString() : undefined
            }
          };

          if (status === 'verified') {
            updates.status = 'verified';
          }

          return { ...o, ...updates };
        }
        return o;
      }));
      notify('success', status === 'verified' ? 'Fitment Verified!' : 'Marked as Fitment Issue');
    } catch (e) {
      console.error(e);
      notify('error', 'Failed to update fitment status');
    }
  }, [notify]);

  const cancelOrder = useCallback(async (orderId: string, reason: string, description?: string) => {
    console.log("AppContext: cancelOrder called", { orderId, reason, description });
    try {
      await api.cancelOrder(orderId, reason, description);
      console.log("AppContext: api.cancelOrder success");
      setVendorOrders(prev => prev.map(o => {
        if (o.id === orderId) {
          return {
            ...o,
            status: 'refund_pending',
            // paymentStatus: 'refunded', // Removed
            cancellationReason: reason,
            cancellationDetails: {
              reason: reason as any,
              description: description || ''
            }
          };
        }
        return o;
      }));
      notify('success', 'Cancellation Requested. Pending Admin Refund.');
    } catch (e) {
      console.error(e);
      notify('error', 'Failed to cancel order');
    }
  }, [notify]);

  const markOrderRefunded = useCallback(async (orderId: string) => {
    try {
      await api.markOrderRefunded(orderId, user.id);
      // Update local state (Admin might see all orders, so update generic 'orders' or 'vendorOrders' if reused)
      // For Admin dashboard we might need a separate 'allOrders' or 'adminOrders' state, 
      // but for now let's assume we update any lists we have.

      const updateList = (list: Order[]) => list.map(o => o.id === orderId ? { ...o, status: 'refunded' as const, paymentStatus: 'refunded' as const, refundedAt: new Date().toISOString(), refundedBy: user.id } : o);

      setOrders(prev => updateList(prev));
      setVendorOrders(prev => updateList(prev));

      notify('success', 'Refund Processed & Recorded');
    } catch (e) {
      console.error(e);
      notify('error', 'Failed to mark as refunded');
    }
  }, [user.id, notify]);

  const openAuthModal = useCallback((mode: 'login' | 'register' = 'login') => {
    setAuthModalMode(mode); setAuthView(mode); setIsAuthModalOpen(true);
  }, []);
  const closeAuthModal = useCallback(() => setIsAuthModalOpen(false), []);

  const placeOrder = useCallback(async (address: Address, paymentMethod: PaymentMethod, vehicleDetails?: { vinNumber: string }) => {
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
        paymentStatus: paymentMethod === 'cod' ? 'paid' : 'paid', // Assuming paid for non-COD after simulation
        date: new Date().toISOString(),
        ...(vehicleDetails && { vehicleDetails })
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

  // Category Management Wrappers
  const addCategory = useCallback(async (category: Category) => {
    try {
      await api.addCategory(category);
      // setCategories handled by subscription
      notify('success', 'Category added');
    } catch (e) {
      console.error("Add Category Failed:", e);
      notify('error', 'Failed to add category');
      throw e; // Rethrow so component knows
    }
  }, [notify]);

  const updateCategory = useCallback(async (id: string, data: Partial<Category>) => {
    try {
      await api.updateCategory(id, data);
      // setCategories handled by subscription
      notify('success', 'Category updated');
    } catch (e) {
      console.error("Update Category Failed:", e);
      notify('error', 'Failed to update category');
      throw e;
    }
  }, [notify]);

  const deleteCategory = useCallback(async (id: string) => {
    try {
      await api.deleteCategory(id);
      // setCategories handled by subscription
      notify('success', 'Category deleted');
    } catch (e) {
      console.error("Delete Category Failed:", e);
      notify('error', 'Failed to delete category');
      throw e;
    }
  }, [notify]);

  const getVendor = useCallback((id: string) => vendors.find(v => v && v.id === id), [vendors]);

  const seedDatabase = useCallback(async () => {
    setIsLoading(true);
    try {
      // Race between the actual seed operation and a 15-second timeout
      await Promise.race([
        api.seedDatabase((msg) => setLoadingMessage(msg)),
        new Promise((_, reject) => setTimeout(() => reject(new Error("Operation timed out")), 60000))
      ]);

      notify('success', 'Database seeded successfully! Reloading...');
      setLoadingMessage('Reloading...');
      setTimeout(() => window.location.reload(), 1500);
    } catch (error: any) {
      console.error(error);
      notify('error', error.message || 'Failed to seed database');
    } finally {
      setIsLoading(false);
      setLoadingMessage('');
    }
  }, [notify]);

  const updateUserEmail = useCallback(async (email: string) => {
    setIsLoading(true);
    try {
      await api.updateUserEmail(email);
      setUser(prev => ({ ...prev, email }));
      notify('success', 'Email updated successfully');
    } catch (e: any) {
      notify('error', 'Failed to update email: ' + e.message);
      throw e;
    } finally { setIsLoading(false); }
  }, [notify]);

  const updateUserPassword = useCallback(async (password: string) => {
    setIsLoading(true);
    try {
      await api.updateUserPassword(password);
      notify('success', 'Password updated successfully');
    } catch (e: any) {
      notify('error', 'Failed to update password: ' + e.message);
      throw e;
    } finally { setIsLoading(false); }
  }, [notify]);

  const deleteUserAccount = useCallback(async () => {
    setIsLoading(true);
    try {
      await api.deleteUserAccount();
      notify('success', 'Account deleted successfully');
      // Force logout cleanup
      setUser(defaultUser);
    } catch (e: any) {
      notify('error', 'Failed to delete account: ' + e.message);
      throw e;
    } finally { setIsLoading(false); }
  }, [notify]);

  const addToGarage = useCallback(async (vehicle: Vehicle) => {
    if (!user || user.id === 'u1') {
      // Guest: Save to local storage only? Or just prompt login?
      // For now, let's allow guests to have a ephemeral garage in state? 
      // Actually, let's enforce login for persistence, but allow local state update.
      setUser(prev => ({ ...prev, garage: [...(prev.garage || []), vehicle] }));
      notify('success', 'Added to your garage (Guest)');
      return;
    }

    const currentGarage = user.garage || [];
    if (currentGarage.some(v => v.id === vehicle.id)) {
      notify('info', 'Vehicle already in garage');
      return;
    }

    const newGarage = [...currentGarage, vehicle];
    setUser(prev => ({ ...prev, garage: newGarage })); // Optimistic update

    try {
      await api.updateUser(user.id, { garage: newGarage });
      notify('success', 'Vehicle saved to garage');
    } catch (e) {
      console.error("Failed to sync garage", e);
      notify('error', 'Failed to save vehicle');
    }
  }, [user, notify]);

  const removeFromGarage = useCallback(async (vehicleId: string) => {
    if (!user) return;

    const currentGarage = user.garage || [];
    const newGarage = currentGarage.filter(v => v.id !== vehicleId);

    setUser(prev => ({ ...prev, garage: newGarage })); // Optimistic

    if (user.id !== 'u1') {
      try {
        await api.updateUser(user.id, { garage: newGarage });
        notify('info', 'Vehicle removed from garage');
      } catch (e) {
        console.error("Failed to sync garage removal", e);
      }
    }
  }, [user, notify]);

  const value = {
    currentUser: user,
    cart,
    products,
    vehicles,
    vendors,
    categories,
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
    vendorOrders,
    isLoading,
    loadingMessage,
    isVehicleSelectorOpen,
    vehicleSelectorMode,
    aiScanState,
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
    editProduct,
    removeProduct,
    updateUserProfile,
    updateVendorProfile,
    updateUserEmail,
    updateUserPassword,
    deleteUserAccount,
    openAuthModal,
    closeAuthModal,
    setAuthView,
    setVehicleSelectorOpen,
    setVehicleSelectorMode,
    addToGarage,
    removeFromGarage,
    placeOrder,
    updateOrderStatus,
    issueRefund,
    verifyOrderFitment,
    cancelOrder,
    markOrderRefunded,
    getVendor: (id: string) => vendors.find(v => v.id === id),
    toggleVendorVerification,
    seedDatabase,
    addVehicle,
    editVehicle,
    removeVehicle,
    manageVehicleBatch,
    selectedCategory,
    setSelectedCategory,
    saveAIScan
  };

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
