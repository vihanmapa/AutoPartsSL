

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

export interface DamageAnalysisResult {
  damageDetected: boolean;
  overallAssessment: string;
  identifiedParts: {
    partName: string;
    damageDescription: string;
    confidenceLevel: 'High' | 'Medium' | 'Low';
    searchQuery: string;
  }[];
}

export interface AIAnalysisState {
  image: string | null;
  result: DamageAnalysisResult | null;
  isAnalyzing: boolean;
  timestamp?: number;
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
  requiresVin?: boolean;
}

export type UserRole = 'buyer' | 'vendor' | 'admin';

export interface User {
  id: string;
  name: string;
  role: UserRole;
  vendorId?: string;
  email?: string;
  phone?: string;
  savedVehicleId?: string;
  address?: Address;
  preferences?: {
    promotions: boolean;
    mail: boolean;
  };
  cart?: CartItem[];
  savedScan?: AIAnalysisState;
  garage?: Vehicle[];
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
  status: 'pending' | 'processing' | 'verified' | 'shipped' | 'delivered' | 'cancelled' | 'refund_pending' | 'refunded';
  paymentStatus: 'pending' | 'paid' | 'failed' | 'refunded';
  trackingNumber?: string;
  courier?: string;
  date: string;
  vendorIds?: string[];
  vehicleDetails?: {
    vinNumber: string;
    verificationStatus?: 'pending' | 'verified' | 'failed';
    verifiedAt?: string; // ISO Date string
  };
  cancellationReason?: string;
  cancellationDetails?: {
    reason: 'vin_mismatch' | 'stock_issue' | 'other';
    description?: string;
  };
  refundedAt?: string; // ISO Date string
  refundedBy?: string; // Admin User ID
}

export interface AppState {
  view: 'marketplace' | 'product-details' | 'vendor' | 'cart' | 'checkout' | 'order-success' | 'login' | 'vendor-login' | 'register-vendor' | 'my-account' | 'profile-details' | 'my-purchase' | 'vendor-store' | 'analyze' | 'admin-dashboard' | 'categories' | 'garage' | 'contact-us' | 'faq' | 'privacy-policy' | 'terms' | 'feedback';
}

export interface FeedbackItem {
  id: string;
  userId: string;
  userName: string;
  type: 'feedback' | 'rating';
  content: string | number;
  createdAt: Date;
}

export interface Category {
  id: string;
  name: string;
  icon: string;
  color: string;
  count: number;
  parentId?: string;
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

// Wizard Specific Types
export interface WizardYear {
  id: string;
  year: number;
  range?: string;
}

export interface WizardModel {
  id: string;
  name: string;
  type: string; // Sedan, SUV, etc.
  image: string;
  years: WizardYear[];
}

export interface WizardBrand {
  id: string;
  name: string;
  logo: string;
  color: string;
  models: WizardModel[];
}