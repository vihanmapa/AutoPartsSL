
import { Product, Vehicle, Vendor, User, Order, Category, FeedbackItem } from '../types';
import { MOCK_VEHICLES, MOCK_PRODUCTS, MOCK_VENDORS } from './mockData';
import { db, auth, storage } from './firebase';
import { collection, getDocs, getDoc, doc, setDoc, query, where, addDoc, onSnapshot, orderBy, updateDoc, deleteDoc, writeBatch, increment, serverTimestamp } from 'firebase/firestore';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, updateProfile, updateEmail, updatePassword, deleteUser } from 'firebase/auth';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';

const mapDoc = (doc: any) => ({ id: doc.id, ...doc.data() });

export const api = {
  getVehicles: async (): Promise<Vehicle[]> => {
    const querySnapshot = await getDocs(collection(db, 'vehicles'));
    return querySnapshot.docs.map((doc: any) => mapDoc(doc) as Vehicle);
  },

  getProducts: async (): Promise<Product[]> => {
    const querySnapshot = await getDocs(collection(db, 'products'));
    return querySnapshot.docs.map((doc: any) => mapDoc(doc) as Product);
  },

  getVendors: async (): Promise<Vendor[]> => {
    const querySnapshot = await getDocs(collection(db, 'vendors'));
    return querySnapshot.docs.map((doc: any) => mapDoc(doc) as Vendor);
  },

  getProductById: async (id: string): Promise<Product | undefined> => {
    const docRef = doc(db, 'products', id);
    const docSnap = await getDoc(docRef);
    return docSnap.exists() ? (mapDoc(docSnap) as Product) : undefined;
  },

  getProductsByVendor: async (vendorId: string): Promise<Product[]> => {
    const q = query(collection(db, 'products'), where("vendorId", "==", vendorId));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map((doc: any) => mapDoc(doc) as Product);
  },

  getAllUsers: async (): Promise<User[]> => {
    const querySnapshot = await getDocs(collection(db, 'users'));
    return querySnapshot.docs.map((doc: any) => mapDoc(doc) as User);
  },

  getAllOrders: async (): Promise<Order[]> => {
    const querySnapshot = await getDocs(collection(db, 'orders'));
    return querySnapshot.docs.map((doc: any) => mapDoc(doc) as Order);
  },

  getCategories: async (): Promise<Category[]> => {
    const querySnapshot = await getDocs(collection(db, 'categories'));
    return querySnapshot.docs.map((doc: any) => mapDoc(doc) as Category);
  },

  subscribeToCategories: (callback: (categories: Category[]) => void) => {
    console.log("Subscribing to categories collection...");
    return onSnapshot(collection(db, 'categories'), (snapshot) => {
      const categories = snapshot.docs.map((doc: any) => mapDoc(doc) as Category);
      console.log("Firestore subscription update:", categories.length, "categories found.");
      callback(categories);
    });
  },

  seedCategories: async (): Promise<void> => {
    const categories = [
      { id: '1', name: 'Brake System', count: 145, icon: 'Disc', color: 'text-red-500' },
      { id: '2', name: 'Engine Parts', count: 289, icon: 'Settings', color: 'text-slate-500' },
      { id: '3', name: 'Lighting', count: 167, icon: 'Lightbulb', color: 'text-yellow-500' },
      { id: '4', name: 'Suspension', count: 98, icon: 'Wrench', color: 'text-slate-400' },
      { id: '5', name: 'Electrical', count: 234, icon: 'Zap', color: 'text-yellow-400' },
      { id: '6', name: 'Exhaust System', count: 76, icon: 'Wind', color: 'text-slate-400' },
      { id: '7', name: 'Filters', count: 189, icon: 'Search', color: 'text-slate-500' },
      { id: '8', name: 'Body Parts', count: 312, icon: 'Car', color: 'text-red-600' },
      { id: '9', name: 'Interior', count: 156, icon: 'Armchair', color: 'text-amber-700' },
      { id: '10', name: 'Wheels & Tires', count: 203, icon: 'Circle', color: 'text-slate-900' },
    ];

    const batch = writeBatch(db);
    categories.forEach((cat: any) => {
      const ref = doc(db, 'categories', cat.id);
      batch.set(ref, cat);
    });
    await batch.commit();
    console.log("Seeded categories");
  },

  toggleVendorVerification: async (vendorId: string, verified: boolean): Promise<void> => {
    const ref = doc(db, 'vendors', vendorId);
    await updateDoc(ref, { verified });
  },

  addVehicle: async (vehicle: Vehicle): Promise<void> => {
    // For single adds (e.g. from a basic form if needed)
    await setDoc(doc(db, 'vehicles', vehicle.id), vehicle);
  },

  updateVehicle: async (vehicleId: string, data: Partial<Vehicle>): Promise<void> => {
    const ref = doc(db, 'vehicles', vehicleId);
    await updateDoc(ref, data);
  },

  // Complex Batch Operation for Admin Grouped View
  manageVehicleBatch: async (operations: {
    creates: Vehicle[];
    updates: { id: string, data: Partial<Vehicle> }[];
    deletes: string[];
  }): Promise<void> => {
    const batch = writeBatch(db);

    // 1. Creates
    operations.creates.forEach(v => {
      const ref = doc(db, 'vehicles', v.id);
      batch.set(ref, v);
    });

    // 2. Updates
    operations.updates.forEach(op => {
      const ref = doc(db, 'vehicles', op.id);
      batch.update(ref, op.data);
    });

    // 3. Deletes
    operations.deletes.forEach(id => {
      const ref = doc(db, 'vehicles', id);
      batch.delete(ref);
    });

    await batch.commit();
  },

  deleteVehicle: async (vehicleId: string): Promise<void> => {
    const ref = doc(db, 'vehicles', vehicleId);
    await deleteDoc(ref);
  },

  simulatePayment: async (amount: number, method: string): Promise<{ success: boolean; transactionId?: string; error?: string }> => {
    await new Promise(resolve => setTimeout(resolve, 1500));
    if (amount > 500000) return { success: false, error: "Transaction limit exceeded." };
    if (method !== 'cod' && Math.random() < 0.1) return { success: false, error: "Payment Gateway Timeout." };
    return { success: true, transactionId: `TXN - ${Date.now()} ` };
  },

  refundOrder: async (orderId: string): Promise<void> => {
    await new Promise(resolve => setTimeout(resolve, 1000));
    const orderRef = doc(db, 'orders', orderId);
    await updateDoc(orderRef, { paymentStatus: 'refunded' });
  },

  createOrder: async (order: Order): Promise<void> => {
    const batch = writeBatch(db);
    const vendorIds = Array.from(new Set(order.items.map(item => item.vendorId)));
    const orderWithVendors = { ...order, vendorIds };
    const orderRef = doc(db, 'orders', order.id);
    batch.set(orderRef, orderWithVendors);

    if (order.status !== 'cancelled' && order.paymentStatus !== 'failed') {
      for (const item of order.items) {
        const productRef = doc(db, 'products', item.id);
        batch.update(productRef, { stock: increment(-item.quantity) });
      }
    }
    await batch.commit();
  },

  subscribeToOrders: (userId: string, callback: (orders: Order[]) => void) => {
    const q = query(collection(db, 'orders'), where('userId', '==', userId));
    return onSnapshot(q, (snapshot: any) => {
      callback(snapshot.docs.map((doc: any) => doc.data() as Order));
    });
  },

  subscribeToVendorOrders: (vendorId: string, callback: (orders: Order[]) => void) => {
    const q = query(collection(db, 'orders'));
    return onSnapshot(q, (snapshot: any) => {
      const allOrders = snapshot.docs.map((doc: any) => doc.data() as Order);
      const vendorOrders = allOrders.filter(order =>
        (order.vendorIds && order.vendorIds.includes(vendorId)) ||
        order.items.some(item => item.vendorId === vendorId)
      );
      callback(vendorOrders);
    });
  },

  updateOrderStatus: async (orderId: string, status: Order['status'], trackingDetails?: { trackingNumber: string; courier: string }): Promise<void> => {
    const orderRef = doc(db, 'orders', orderId);
    const updateData: any = { status };
    if (trackingDetails) {
      updateData.trackingNumber = trackingDetails.trackingNumber;
      updateData.courier = trackingDetails.courier;
    }
    await updateDoc(orderRef, updateData);
  },

  verifyOrderFitment: async (orderId: string, status: 'verified' | 'failed'): Promise<void> => {
    const orderRef = doc(db, 'orders', orderId);
    const updates: any = {
      'vehicleDetails.verificationStatus': status
    };
    if (status === 'verified') {
      updates['vehicleDetails.verifiedAt'] = new Date().toISOString();
      updates['status'] = 'verified'; // Move order to verified bucket
    }
    await updateDoc(orderRef, updates);
  },

  cancelOrder: async (orderId: string, reason: string, description?: string): Promise<void> => {
    const orderRef = doc(db, 'orders', orderId);
    await updateDoc(orderRef, {
      status: 'refund_pending', // Waiting for Admin to refund
      // paymentStatus: 'refunded', // REMOVED: Now handled by Admin later
      cancellationReason: reason,
      cancellationDetails: {
        reason: reason as any,
        description: description || ''
      }
    });
  },

  markOrderRefunded: async (orderId: string, adminId: string): Promise<void> => {
    const orderRef = doc(db, 'orders', orderId);
    await updateDoc(orderRef, {
      status: 'refunded',
      paymentStatus: 'refunded',
      refundedAt: new Date().toISOString(),
      refundedBy: adminId
    });
  },

  subscribeToAllOrders: (callback: (orders: Order[]) => void) => {
    const q = query(collection(db, 'orders'));
    return onSnapshot(q, (snapshot) => {
      const orders = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Order));
      callback(orders);
    });
  },

  loginUser: async (email: string, password?: string): Promise<User> => {
    if (!password) throw new Error("Password required");
    // Removed hardcoded admin check. All users must be real Firebase users.
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const docRef = doc(db, 'users', userCredential.user.uid);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) return { id: userCredential.user.uid, ...docSnap.data() } as User;
    return { id: userCredential.user.uid, name: userCredential.user.displayName || 'User', email: userCredential.user.email || '', role: 'buyer' };
  },

  loginVendor: async (email: string, password?: string): Promise<User> => {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const docRef = doc(db, 'users', userCredential.user.uid);
    const docSnap = await getDoc(docRef);
    if (!docSnap.exists() || docSnap.data().role !== 'vendor') throw new Error("Not a vendor account");
    return { id: userCredential.user.uid, ...docSnap.data() } as User;
  },

  registerVendor: async (email: string, password: string, businessName: string, phone: string, location: string): Promise<User> => {
    const cred = await createUserWithEmailAndPassword(auth, email, password);
    await updateProfile(cred.user, { displayName: businessName });
    const vendorId = `vnd_${cred.user.uid} `;
    const newVendor: Vendor = { id: vendorId, name: businessName, location, rating: 5, verified: false };
    await setDoc(doc(db, 'vendors', vendorId), newVendor);
    const newUser: User = { id: cred.user.uid, name: businessName, email, phone, role: 'vendor', vendorId };
    await setDoc(doc(db, 'users', cred.user.uid), newUser);
    return newUser;
  },

  registerBuyer: async (data: any): Promise<User> => {
    const cred = await createUserWithEmailAndPassword(auth, data.email, data.password);
    await updateProfile(cred.user, { displayName: data.name });
    const newUser: User = { id: cred.user.uid, email: data.email, name: data.name, phone: data.phone, role: 'buyer' };
    await setDoc(doc(db, 'users', cred.user.uid), newUser);
    return newUser;
  },

  uploadImage: async (file: Blob, path: string): Promise<string> => {
    const storageRef = ref(storage, path);
    await uploadBytes(storageRef, file);
    return await getDownloadURL(storageRef);
  },

  addProduct: async (data: Product) => { await setDoc(doc(db, 'products', data.id), data); },
  updateProduct: async (id: string, data: Partial<Product>) => { await updateDoc(doc(db, 'products', id), data); },
  deleteProduct: async (id: string) => { await deleteDoc(doc(db, 'products', id)); },
  updateVendor: async (id: string, data: Partial<Vendor>) => { await updateDoc(doc(db, 'vendors', id), data); },
  updateUser: async (id: string, data: Partial<User>) => { await updateDoc(doc(db, 'users', id), data); },

  // Category management
  addCategory: async (category: Category) => {
    // Firestore rejects 'undefined', so we must sanitize
    const data = { ...category };
    if (data.parentId === undefined) delete data.parentId;
    await setDoc(doc(db, 'categories', category.id), data);
  },
  updateCategory: async (id: string, data: Partial<Category>) => {
    const cleanData = { ...data };
    if (cleanData.parentId === undefined) delete cleanData.parentId;
    await updateDoc(doc(db, 'categories', id), cleanData);
  },
  deleteCategory: async (id: string) => { await deleteDoc(doc(db, 'categories', id)); },

  submitFeedback: async (data: Omit<FeedbackItem, 'id' | 'createdAt'>): Promise<void> => {
    await addDoc(collection(db, 'feedback'), {
      ...data,
      createdAt: serverTimestamp()
    });
  },

  getAllFeedback: async (): Promise<FeedbackItem[]> => {
    const q = query(collection(db, 'feedback'), orderBy('createdAt', 'desc'));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map((doc: any) => ({
      id: doc.id,
      ...doc.data(),
      createdAt: doc.data().createdAt?.toDate() || new Date()
    })) as FeedbackItem[];
  },

  seedDatabase: async (onProgress?: (msg: string) => void) => {
    // Batch 1: Vehicles
    onProgress?.("Seeding vehicles (1/3)...");
    const batch1 = writeBatch(db);
    MOCK_VEHICLES.forEach(v => {
      batch1.set(doc(db, 'vehicles', v.id), v);
    });
    await batch1.commit();
    console.log("Seeded vehicles");

    // Batch 2: Products (Chunked)
    const chunkSize = 50;
    for (let i = 0; i < MOCK_PRODUCTS.length; i += chunkSize) {
      const chunk = MOCK_PRODUCTS.slice(i, i + chunkSize);
      const batch = writeBatch(db);
      const batchNum = Math.floor(i / chunkSize) + 1;
      const totalBatches = Math.ceil(MOCK_PRODUCTS.length / chunkSize);

      onProgress?.(`Seeding products(Batch ${batchNum} / ${totalBatches})...`);

      chunk.forEach(p => {
        batch.set(doc(db, 'products', p.id), p);
      });
      await batch.commit();
    }
    console.log("Seeded products");

    // Batch 3: Vendors
    onProgress?.("Seeding vendors...");
    const batch3 = writeBatch(db);
    MOCK_VENDORS.forEach(v => {
      batch3.set(doc(db, 'vendors', v.id), v);
    });
    await batch3.commit();
    console.log("Seeded vendors");

    // Batch 4: Categories
    onProgress?.("Seeding categories...");
    await api.seedCategories();
    console.log("Seeded categories");
  },

  testConnection: async (): Promise<boolean> => {
    try {
      // Attempt a simple read operation to check connection
      const snap = await getDoc(doc(db, 'test_collection', 'test_doc')); // Assuming 'test_collection' and 'test_doc' exist or can be created for a test
      console.log("Read test success:", snap.exists());
      return true;
    } catch (e) {
      console.error("Connection test failed:", e);
      throw e;
    }
  },

  // Auth Management
  updateUserEmail: async (newEmail: string): Promise<void> => {
    if (!auth.currentUser) throw new Error("No user logged in");
    await updateEmail(auth.currentUser, newEmail);
    // Sync to Firestore
    await updateDoc(doc(db, 'users', auth.currentUser.uid), { email: newEmail });
  },

  updateUserPassword: async (newPassword: string): Promise<void> => {
    if (!auth.currentUser) throw new Error("No user logged in");
    await updatePassword(auth.currentUser, newPassword);
  },

  deleteUserAccount: async (): Promise<void> => {
    if (!auth.currentUser) throw new Error("No user logged in");
    const uid = auth.currentUser.uid;
    // Delete from Auth
    await deleteUser(auth.currentUser);
    // Delete from Firestore (Optional: keep for records, or delete PII)
    // Here we delete the user document as requested "Online Account permanently deleted"
    await deleteDoc(doc(db, 'users', uid));
  }
};
