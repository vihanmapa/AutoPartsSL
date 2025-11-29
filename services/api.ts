
import { Product, Vehicle, Vendor, User, Order } from '../types';
import { auth, db } from './firebase';
import * as firestore from 'firebase/firestore';
import * as firebaseAuth from 'firebase/auth';

const { 
  collection, 
  getDocs, 
  getDoc, 
  doc, 
  setDoc, 
  query, 
  where,
  addDoc,
  onSnapshot,
  orderBy,
  updateDoc,
  deleteDoc,
  writeBatch,
  increment
} = firestore as any;

const { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  updateProfile 
} = firebaseAuth as any;

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
    return { success: true, transactionId: `TXN-${Date.now()}` };
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

  loginUser: async (email: string, password?: string): Promise<User> => {
    if (!password) throw new Error("Password required");
    if (email === 'admin@autoparts.lk' && password === 'admin123') {
        await new Promise(r => setTimeout(r, 800));
        return { id: 'admin_user', name: 'System Administrator', email, role: 'admin' };
    }
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
    const vendorId = `vnd_${cred.user.uid}`;
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

  addProduct: async (data: Product) => { await setDoc(doc(db, 'products', data.id), data); },
  updateProduct: async (id: string, data: Partial<Product>) => { await updateDoc(doc(db, 'products', id), data); },
  deleteProduct: async (id: string) => { await deleteDoc(doc(db, 'products', id)); },
  updateVendor: async (id: string, data: Partial<Vendor>) => { await updateDoc(doc(db, 'vendors', id), data); },
  seedDatabase: async () => {}
};
