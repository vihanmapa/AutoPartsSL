

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
  year?: number; // Strict single year (Optional)
  yearStart?: number; // Range start
  yearEnd?: number; // Range end
  years?: number[]; // List of years
  chassisCode?: string;
  engineCode?: string;
  fuelType?: 'Petrol' | 'Diesel' | 'Hybrid' | 'Electric' | 'PHEV';
  bodyType?: 'Sedan' | 'Hatchback' | 'SUV' | 'Van' | 'Truck' | 'Crossover';
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

export interface CompatibleVariant {
  vehicleId: string;
  make: string;
  model: string;
  year: number;
  searchKey: string;
}

export interface Product {
  id: string;
  title: string;
  price: number;
  rrp?: number;
  sku: string;
  brand?: string;
  condition: Condition;
  origin: Origin;
  vendorId: string;
  compatibleVehicles: CompatibleVariant[];
  category: string;
  imageUrl: string;
  additionalImages?: string[];
  stock: number;
  longDescription?: string;
  specifications?: Record<string, string>;
  hazards?: string[];
}

export type UserRole = 'buyer' | 'vendor' | 'admin';

export interface User {
  id: string;
  name: string;
  role: UserRole;
  vendorId?: string;
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
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  paymentStatus: 'pending' | 'paid' | 'failed' | 'refunded';
  trackingNumber?: string;
  courier?: string;
  date: string;
  vendorIds?: string[];
}

export interface AppState {
  view: 'marketplace' | 'product-details' | 'vendor' | 'cart' | 'checkout' | 'order-success' | 'login' | 'vendor-login' | 'register-vendor' | 'my-account' | 'my-purchase' | 'vendor-store' | 'analyze' | 'admin-dashboard';
}

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