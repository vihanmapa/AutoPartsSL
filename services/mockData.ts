
import { Vehicle, Product, Vendor, Condition, Origin, User } from '../types';

// --- RAW DATA CONSTANTS (Internal use / Types) ---

const VEHICLES: Vehicle[] = [
  // --- TOYOTA ---
  { 
    id: 'v1', 
    make: 'Toyota', 
    model: 'Axio', 
    yearStart: 2012, 
    yearEnd: 2019, 
    chassisCode: 'NKE165', 
    engineCode: '1NZ-FXE', 
    fuelType: 'Hybrid', 
    bodyType: 'Sedan' 
  },
  { 
    id: 'v2', 
    make: 'Toyota', 
    model: 'Allion', 
    yearStart: 2007, 
    yearEnd: 2021, 
    chassisCode: 'NZT260', 
    engineCode: '1NZ-FE', 
    fuelType: 'Petrol', 
    bodyType: 'Sedan' 
  },
  { 
    id: 'v7', 
    make: 'Toyota', 
    model: 'Premio', 
    yearStart: 2007, 
    yearEnd: 2021, 
    chassisCode: 'NZT260', 
    engineCode: '1NZ-FE', 
    fuelType: 'Petrol', 
    bodyType: 'Sedan' 
  },
  { 
    id: 'v8', 
    make: 'Toyota', 
    model: 'Vitz', 
    yearStart: 2014, 
    yearEnd: 2019, 
    chassisCode: 'KSP130', 
    engineCode: '1KR-FE', 
    fuelType: 'Petrol', 
    bodyType: 'Hatchback' 
  },
  { 
    id: 'v9', 
    make: 'Toyota', 
    model: 'Aqua', 
    yearStart: 2011, 
    yearEnd: 2021, 
    chassisCode: 'NHP10', 
    engineCode: '1NZ-FXE', 
    fuelType: 'Hybrid', 
    bodyType: 'Hatchback' 
  },
  {
    id: 'v14',
    make: 'Toyota',
    model: 'Corolla',
    yearStart: 2000,
    yearEnd: 2006,
    chassisCode: 'NZE121',
    engineCode: '1NZ-FE',
    fuelType: 'Petrol',
    bodyType: 'Sedan'
  },
  {
    id: 'v15',
    make: 'Toyota',
    model: 'Corolla',
    yearStart: 2007,
    yearEnd: 2013,
    chassisCode: 'NZE141',
    engineCode: '1NZ-FE',
    fuelType: 'Petrol',
    bodyType: 'Sedan'
  },
  {
    id: 'v16',
    make: 'Toyota',
    model: 'Prius',
    yearStart: 2009,
    yearEnd: 2015,
    chassisCode: 'ZVW30',
    engineCode: '2ZR-FXE',
    fuelType: 'Hybrid',
    bodyType: 'Hatchback'
  },
  {
    id: 'v17',
    make: 'Toyota',
    model: 'CH-R',
    yearStart: 2016,
    yearEnd: 2023,
    chassisCode: 'NGX50',
    engineCode: '8NR-FTS',
    fuelType: 'Petrol',
    bodyType: 'Crossover'
  },
  {
    id: 'v18',
    make: 'Toyota',
    model: 'Land Cruiser Prado',
    yearStart: 2009,
    yearEnd: 2023,
    chassisCode: 'TRJ150',
    engineCode: '2TR-FE',
    fuelType: 'Petrol',
    bodyType: 'SUV'
  },

  // --- HONDA ---
  { 
    id: 'v4', 
    make: 'Honda', 
    model: 'Fit', 
    yearStart: 2013, 
    yearEnd: 2020, 
    chassisCode: 'GP5', 
    engineCode: 'LEB', 
    fuelType: 'Hybrid', 
    bodyType: 'Hatchback' 
  },
  { 
    id: 'v5', 
    make: 'Honda', 
    model: 'Vezel', 
    yearStart: 2013, 
    yearEnd: 2021, 
    chassisCode: 'RU3', 
    engineCode: 'LEB', 
    fuelType: 'Hybrid', 
    bodyType: 'SUV' 
  },
  { 
    id: 'v10', 
    make: 'Honda', 
    model: 'Civic', 
    yearStart: 2016, 
    yearEnd: 2021, 
    chassisCode: 'FC1', 
    engineCode: 'L15B7', 
    fuelType: 'Petrol', 
    bodyType: 'Sedan' 
  },
  {
    id: 'v19',
    make: 'Honda',
    model: 'Grace',
    yearStart: 2014,
    yearEnd: 2020,
    chassisCode: 'GM4',
    engineCode: 'LEB',
    fuelType: 'Hybrid',
    bodyType: 'Sedan'
  },
  {
    id: 'v20',
    make: 'Honda',
    model: 'Insight',
    yearStart: 2009,
    yearEnd: 2014,
    chassisCode: 'ZE2',
    engineCode: 'LDA',
    fuelType: 'Hybrid',
    bodyType: 'Hatchback'
  },
  {
    id: 'v21',
    make: 'Honda',
    model: 'CR-V',
    yearStart: 2017,
    yearEnd: 2022,
    chassisCode: 'RW1',
    engineCode: 'L15BE',
    fuelType: 'Petrol',
    bodyType: 'SUV'
  },

  // --- SUZUKI ---
  { 
    id: 'v3', 
    make: 'Suzuki', 
    model: 'Wagon R', 
    yearStart: 2017, 
    yearEnd: 2023, 
    chassisCode: 'MH55S', 
    engineCode: 'R06A', 
    fuelType: 'Hybrid', 
    bodyType: 'Hatchback' 
  },
  { 
    id: 'v11', 
    make: 'Suzuki', 
    model: 'Alto', 
    yearStart: 2014, 
    yearEnd: 2021, 
    chassisCode: 'K10', 
    engineCode: 'K10B', 
    fuelType: 'Petrol', 
    bodyType: 'Hatchback' 
  },
  {
    id: 'v22',
    make: 'Suzuki',
    model: 'Swift',
    yearStart: 2017,
    yearEnd: 2023,
    chassisCode: 'ZC13S',
    engineCode: 'K10C',
    fuelType: 'Petrol',
    bodyType: 'Hatchback'
  },
  {
    id: 'v23',
    make: 'Suzuki',
    model: 'Spacia',
    yearStart: 2017,
    yearEnd: 2023,
    chassisCode: 'MK53S',
    engineCode: 'R06A',
    fuelType: 'Hybrid',
    bodyType: 'Van'
  },
  {
    id: 'v24',
    make: 'Suzuki',
    model: 'Every',
    yearStart: 2015,
    yearEnd: 2024,
    chassisCode: 'DA17V',
    engineCode: 'R06A',
    fuelType: 'Petrol',
    bodyType: 'Van'
  },

  // --- NISSAN ---
  { 
    id: 'v6', 
    make: 'Nissan', 
    model: 'Leaf', 
    yearStart: 2017, 
    yearEnd: 2024, 
    chassisCode: 'ZE1', 
    engineCode: 'EM57', 
    fuelType: 'Electric', 
    bodyType: 'Hatchback' 
  },
  { 
    id: 'v12', 
    make: 'Nissan', 
    model: 'X-Trail', 
    yearStart: 2013, 
    yearEnd: 2021, 
    chassisCode: 'HT32', 
    engineCode: 'MR20DD', 
    fuelType: 'Hybrid', 
    bodyType: 'SUV' 
  },
  {
    id: 'v25',
    make: 'Nissan',
    model: 'Sunny',
    yearStart: 2000,
    yearEnd: 2006,
    chassisCode: 'FB15',
    engineCode: 'QG15DE',
    fuelType: 'Petrol',
    bodyType: 'Sedan'
  },
  
  // --- MITSUBISHI ---
  {
      id: 'v13',
      make: 'Mitsubishi',
      model: 'Montero Sport',
      yearStart: 2015,
      yearEnd: 2024,
      chassisCode: 'KR1W',
      engineCode: '4N15',
      fuelType: 'Diesel',
      bodyType: 'SUV'
  },
  {
      id: 'v26',
      make: 'Mitsubishi',
      model: 'Lancer EX',
      yearStart: 2007,
      yearEnd: 2017,
      chassisCode: 'CY4A',
      engineCode: '4B11',
      fuelType: 'Petrol',
      bodyType: 'Sedan'
  },

  // --- KIA/HYUNDAI/MICRO ---
  {
      id: 'v27',
      make: 'Kia',
      model: 'Sorento',
      yearStart: 2010,
      yearEnd: 2015,
      chassisCode: 'XM',
      engineCode: 'D4HB',
      fuelType: 'Diesel',
      bodyType: 'SUV'
  },
  {
      id: 'v28',
      make: 'Micro',
      model: 'Panda',
      yearStart: 2011,
      yearEnd: 2016,
      chassisCode: 'GC7',
      engineCode: 'LC1',
      fuelType: 'Petrol',
      bodyType: 'Hatchback'
  }
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

// Helper to create mock compatible variants for existing mock data
const createCompat = (vehicleId: string, year: number) => {
    const v = VEHICLES.find(v => v.id === vehicleId);
    if (!v) return { vehicleId, make: 'Unknown', model: 'Unknown', year, searchKey: `${vehicleId}_${year}` };
    return {
        vehicleId,
        make: v.make,
        model: v.model,
        year: year,
        searchKey: `${vehicleId}_${year}`
    };
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
    compatibleVehicles: [
        createCompat('v1', 2014),
        createCompat('v1', 2015),
        createCompat('v4', 2015),
        createCompat('v9', 2013)
    ],
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
    compatibleVehicles: [
        createCompat('v3', 2018),
        createCompat('v3', 2019)
    ],
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
    compatibleVehicles: [
        createCompat('v1', 2016),
        createCompat('v14', 2005)
    ],
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
    compatibleVehicles: [
        createCompat('v1', 2015),
        createCompat('v2', 2015),
        createCompat('v15', 2010)
    ],
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
    compatibleVehicles: [
        createCompat('v5', 2015),
        createCompat('v19', 2016)
    ],
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
    compatibleVehicles: [
        createCompat('v2', 2012),
        createCompat('v7', 2012)
    ],
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
