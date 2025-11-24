
import { Vehicle, Product, Vendor, Condition, Origin, User } from '../types';

// --- RAW DATA CONSTANTS (Internal use / Types) ---

const VEHICLES: Vehicle[] = [
  { id: 'v1', make: 'Toyota', model: 'Axio (NKE165)', yearStart: 2012, yearEnd: 2019 },
  { id: 'v2', make: 'Toyota', model: 'Allion (NZT260)', yearStart: 2007, yearEnd: 2021 },
  { id: 'v3', make: 'Suzuki', model: 'Wagon R (Stingray)', yearStart: 2017, yearEnd: 2023 },
  { id: 'v4', make: 'Honda', model: 'Fit (GP5)', yearStart: 2013, yearEnd: 2020 },
  { id: 'v5', make: 'Honda', model: 'Vezel (RU1/RU3)', yearStart: 2013, yearEnd: 2021 },
  { id: 'v6', make: 'Nissan', model: 'Leaf (ZE1)', yearStart: 2017, yearEnd: 2024 },
];

const VENDORS: Vendor[] = [
  { id: 'vnd1', name: 'Nihal Motors', location: 'Panchikawatta', rating: 4.8, verified: true },
  { id: 'vnd2', name: 'Lanka Hybrid Solutions', location: 'Nugegoda', rating: 4.9, verified: true },
  { id: 'vnd3', name: 'City Auto Parts', location: 'Kurunegala', rating: 4.5, verified: false },
];

export const MOCK_BUYER: User = {
  id: 'u3',
  name: 'Kasun Perera',
  role: 'buyer',
  email: 'kasun@autoparts.lk',
  phone: '077 123 4567'
};

export const PRODUCTS: Product[] = [
  {
    id: 'p1',
    title: 'Hybrid Battery Pack (Reconditioned)',
    price: 185000,
    rrp: 220000,
    sku: 'TOY-AXIO-BAT-001',
    brand: 'Panasonic / Primearth',
    condition: Condition.Reconditioned,
    origin: Origin.Japan,
    vendorId: 'vnd2',
    compatibleVehicleIds: ['v1', 'v4'], 
    category: 'Engine & Drivetrain',
    imageUrl: 'https://picsum.photos/400/300?random=1',
    stock: 3,
    longDescription: 'Fully reconditioned hybrid battery pack suitable for Toyota Axio NKE165 and Honda Fit GP5. Cells have been balanced and tested to ensure 90% capacity. Comes with a 6-month warranty from Lanka Hybrid Solutions.',
    specifications: {
      'Voltage': '144V',
      'Capacity': '6.5Ah',
      'Chemistry': 'NiMH',
      'Weight': '32kg',
      'Warranty': '6 Months'
    },
    hazards: ['High Voltage', 'Corrosive Material', 'Heavy Object']
  },
  {
    id: 'p2',
    title: 'Front Bumper Assembly',
    price: 45000,
    sku: 'SUZ-WAGR-BUMP-F',
    condition: Condition.Used,
    origin: Origin.Japan,
    vendorId: 'vnd1',
    compatibleVehicleIds: ['v3'],
    category: 'Body Parts',
    imageUrl: 'https://picsum.photos/400/300?random=2',
    stock: 1,
  },
  {
    id: 'p3',
    title: 'Headlight Unit (Left)',
    price: 32000,
    sku: 'TOY-AXIO-HL-L',
    condition: Condition.New,
    origin: Origin.TaiwanChina,
    vendorId: 'vnd3',
    compatibleVehicleIds: ['v1'],
    category: 'Lighting',
    imageUrl: 'https://picsum.photos/400/300?random=3',
    stock: 10,
  },
  {
    id: 'p4',
    title: 'Oil Filter (Genuine)',
    price: 3500,
    rrp: 4200,
    sku: '90915-YZZE1',
    brand: 'Toyota Genuine Parts',
    condition: Condition.New,
    origin: Origin.Japan,
    vendorId: 'vnd1',
    compatibleVehicleIds: ['v1', 'v2', 'v3', 'v4', 'v5'],
    category: 'Maintenance',
    imageUrl: 'https://picsum.photos/400/300?random=4',
    stock: 50,
    longDescription: 'Original Toyota oil filter designed to remove contaminants from engine oil. Ensures longevity of the engine and optimal performance. Compatible with most Toyota NZ and ZZ series engines.',
    specifications: {
      'Filter Type': 'Spin-on',
      'Thread Size': '3/4-16 UNF',
      'Height': '85mm',
      'Outside Diameter': '65mm'
    },
    hazards: []
  },
  {
    id: 'p5',
    title: 'Shock Absorber Set (Rear)',
    price: 28000,
    sku: 'HON-VEZ-SHK-R',
    condition: Condition.New,
    origin: Origin.OEM,
    vendorId: 'vnd2',
    compatibleVehicleIds: ['v4', 'v5'],
    category: 'Suspension',
    imageUrl: 'https://picsum.photos/400/300?random=5',
    stock: 8,
  },
  {
    id: 'p6',
    title: 'Brake Pad Set',
    price: 8500,
    sku: 'TOY-ALL-BP-F',
    condition: Condition.New,
    origin: Origin.Japan,
    vendorId: 'vnd1',
    compatibleVehicleIds: ['v1', 'v2'],
    category: 'Brakes',
    imageUrl: 'https://picsum.photos/400/300?random=6',
    stock: 20,
  },
];

// --- ASYNC API SIMULATION ---

const NETWORK_DELAY = 1000; // 1 second delay

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const api = {
  getVehicles: async (): Promise<Vehicle[]> => {
    await delay(NETWORK_DELAY);
    return [...VEHICLES];
  },

  getProducts: async (): Promise<Product[]> => {
    await delay(NETWORK_DELAY);
    return [...PRODUCTS];
  },

  getVendors: async (): Promise<Vendor[]> => {
    await delay(NETWORK_DELAY);
    return [...VENDORS];
  },

  getProductById: async (id: string): Promise<Product | undefined> => {
    await delay(NETWORK_DELAY);
    return PRODUCTS.find(p => p.id === id);
  },

  getProductsByVendor: async (vendorId: string): Promise<Product[]> => {
    await delay(NETWORK_DELAY);
    return PRODUCTS.filter(p => p.vendorId === vendorId);
  },

  // Simulate auth
  loginUser: async (email: string): Promise<User> => {
    await delay(NETWORK_DELAY);
    // Return mock buyer but with the provided email
    return { ...MOCK_BUYER, email };
  },
  
  // Simulate vendor login
  loginVendor: async (email: string): Promise<User> => {
      await delay(NETWORK_DELAY);
      return {
        id: 'u2',
        name: 'Nihal Motors',
        role: 'vendor',
        vendorId: 'vnd1',
        email
      };
  }
};

// Legacy export for static types if needed, but prefer API calls
export const MOCK_PRODUCTS = PRODUCTS;
export const MOCK_VEHICLES = VEHICLES;
export const MOCK_VENDORS = VENDORS;
