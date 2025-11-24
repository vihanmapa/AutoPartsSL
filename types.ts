
export enum Condition {
  New = "Brand New",
  Reconditioned = "Reconditioned (Panchikawatta Spec)",
  Used = "Used"
}

export enum Origin {
  Japan = "Genuine Japan",
  TaiwanChina = "Taiwan/China",
  OEM = "OEM",
  Local = "Local Manufacture"
}

export interface Vehicle {
  id: string;
  make: string;
  model: string;
  yearStart: number;
  yearEnd?: number; // If undefined, still in production
}

export interface Vendor {
  id: string;
  name: string;
  location: string;
  rating: number;
  verified: boolean;
  logoUrl?: string;
  bannerUrl?: string;
  description?: string;
  email?: string;
  phone?: string;
  category?: string;
  address?: string;
}

export interface Product {
  id: string;
  title: string;
  price: number;
  rrp?: number; // Recommended Retail Price for savings calculation
  sku: string; // Must have for mechanics
  brand?: string;
  condition: Condition;
  origin: Origin;
  vendorId: string;
  compatibleVehicleIds: string[]; // IDs of vehicles this part fits
  category: string;
  imageUrl: string;
  additionalImages?: string[];
  stock: number;
  longDescription?: string;
  specifications?: Record<string, string>;
  hazards?: string[]; // e.g., "Flammable", "Irritant"
}

export type UserRole = 'buyer' | 'vendor';

export interface User {
  id: string;
  name: string;
  role: UserRole;
  vendorId?: string; // If role is vendor
  email?: string;
  phone?: string;
}

export interface CartItem extends Product {
  quantity: number;
}

export interface Address {
  fullName: string;
  phone: string;
  addressLine1: string;
  city: string;
  district: string;
  postalCode: string;
}

export type PaymentMethod = 'cod' | 'card' | 'koko' | 'mintpay';

export interface Order {
  id: string;
  userId: string;
  items: CartItem[];
  totalAmount: number;
  shippingAddress: Address;
  paymentMethod: PaymentMethod;
  status: 'pending' | 'processing' | 'shipped' | 'delivered';
  date: string;
}

// Global Type Augmentation for Social SDKs
declare global {
  interface Window {
    google?: {
      accounts: {
        id: {
          initialize: (config: any) => void;
          renderButton: (parent: HTMLElement, options: any) => void;
          prompt: (momentListener?: any) => void;
        };
      };
    };
    fbAsyncInit?: () => void;
    FB?: {
      init: (options: any) => void;
      login: (callback: (response: any) => void, options?: { scope: string }) => void;
      api: (path: string, paramsOrCallback: any, callback?: (response: any) => void) => void;
      getLoginStatus: (callback: (response: any) => void) => void;
    };
  }
}
