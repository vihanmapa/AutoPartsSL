
import { Product, Vehicle, Vendor, User, Order } from '../types';
import { auth, db } from './firebase';
import { 
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
  updateDoc
} from 'firebase/firestore';
import * as firebaseAuth from 'firebase/auth';

const { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  updateProfile 
} = firebaseAuth as any;

// Helper to Map Firestore Docs to Typed Objects
const mapDoc = (doc: any) => ({ id: doc.id, ...doc.data() });

export const api = {
  getVehicles: async (): Promise<Vehicle[]> => {
    const querySnapshot = await getDocs(collection(db, 'vehicles'));
    return querySnapshot.docs.map(doc => mapDoc(doc) as Vehicle);
  },

  getProducts: async (): Promise<Product[]> => {
    const querySnapshot = await getDocs(collection(db, 'products'));
    return querySnapshot.docs.map(doc => mapDoc(doc) as Product);
  },

  getVendors: async (): Promise<Vendor[]> => {
    const querySnapshot = await getDocs(collection(db, 'vendors'));
    return querySnapshot.docs.map(doc => mapDoc(doc) as Vendor);
  },

  getProductById: async (id: string): Promise<Product | undefined> => {
    const docRef = doc(db, 'products', id);
    const docSnap = await getDoc(docRef);
    return docSnap.exists() ? (mapDoc(docSnap) as Product) : undefined;
  },

  getProductsByVendor: async (vendorId: string): Promise<Product[]> => {
    const q = query(collection(db, 'products'), where("vendorId", "==", vendorId));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => mapDoc(doc) as Product);
  },

  // --- ORDERS ---

  createOrder: async (order: Order): Promise<void> => {
    // We use setDoc with the ID generated in the app to ensure consistency
    await setDoc(doc(db, 'orders', order.id), order);
  },

  subscribeToOrders: (userId: string, callback: (orders: Order[]) => void) => {
    // Note: To use orderBy with where, Firestore requires an index. 
    // For simplicity, we filter by user here and will sort client-side in the Context/Component 
    // if the index isn't ready, or use a simple query.
    const q = query(
      collection(db, 'orders'), 
      where('userId', '==', userId)
    );

    return onSnapshot(q, (snapshot) => {
      const orders = snapshot.docs.map(doc => doc.data() as Order);
      callback(orders);
    });
  },

  // --- AUTHENTICATION ---

  loginUser: async (email: string, password?: string): Promise<User> => {
    if (!password) throw new Error("Password is required for real authentication");
    
    // 1. Authenticate with Firebase Auth
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const firebaseUser = userCredential.user;

    // 2. Fetch extended user profile from Firestore 'users' collection
    const userDocRef = doc(db, 'users', firebaseUser.uid);
    const userDocSnap = await getDoc(userDocRef);

    if (userDocSnap.exists()) {
      return { id: firebaseUser.uid, ...userDocSnap.data() } as User;
    } else {
      // Fallback if firestore record missing
      return {
        id: firebaseUser.uid,
        name: firebaseUser.displayName || 'User',
        email: firebaseUser.email || '',
        role: 'buyer'
      };
    }
  },

  loginVendor: async (email: string, password?: string): Promise<User> => {
    if (!password) throw new Error("Password is required");

    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const firebaseUser = userCredential.user;

    const userDocRef = doc(db, 'users', firebaseUser.uid);
    const userDocSnap = await getDoc(userDocRef);

    if (!userDocSnap.exists()) {
       throw new Error("User profile not found.");
    }

    const userData = userDocSnap.data() as User;

    if (userData.role !== 'vendor') {
      throw new Error("This account is not authorized as a Vendor.");
    }

    return { id: firebaseUser.uid, ...userData };
  },

  registerVendor: async (email: string, password: string, businessName: string, phone: string, location: string): Promise<User> => {
    // 1. Create Auth User
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const firebaseUser = userCredential.user;

    // 2. Update Display Name
    await updateProfile(firebaseUser, { displayName: businessName });

    const vendorId = `vnd_${firebaseUser.uid}`;

    // 3. Create Vendor Profile in 'vendors' collection
    const newVendor: Vendor = {
        id: vendorId,
        name: businessName,
        location,
        rating: 5, // Default start rating
        verified: false
    };
    await setDoc(doc(db, 'vendors', vendorId), newVendor);

    // 4. Create User Profile in 'users' collection linked to vendor
    const newUser: User = {
        id: firebaseUser.uid,
        name: businessName,
        email,
        phone,
        role: 'vendor',
        vendorId: vendorId
    };
    await setDoc(doc(db, 'users', firebaseUser.uid), newUser);

    return newUser;
  },

  registerBuyer: async (data: { email: string, password: string, name: string, phone: string }): Promise<User> => {
    // 1. Create Auth User
    const userCredential = await createUserWithEmailAndPassword(auth, data.email, data.password);
    const firebaseUser = userCredential.user;

    // 2. Update Display Name
    await updateProfile(firebaseUser, { displayName: data.name });

    // 3. Create User Profile in 'users' collection
    const newUser: User = {
      id: firebaseUser.uid,
      email: data.email,
      name: data.name,
      phone: data.phone,
      role: 'buyer'
    };
    
    await setDoc(doc(db, 'users', firebaseUser.uid), newUser);

    return newUser;
  },

  // --- DATA MUTATION ---

  addProduct: async (productData: Product): Promise<void> => {
     // Use setDoc with the specific ID if provided, otherwise addDoc could be used but we generated ID in context
     await setDoc(doc(db, 'products', productData.id), productData);
  },

  updateVendor: async (vendorId: string, data: Partial<Vendor>): Promise<void> => {
    const vendorRef = doc(db, 'vendors', vendorId);
    await updateDoc(vendorRef, data);
  }
};
