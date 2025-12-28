import { Vehicle } from '../types';

interface DecodedVIN {
    make: string;
    model: string;
    year: number;
    bodyType: string;
}

// Mock database simulating external API
const MOCK_VIN_DB: Record<string, DecodedVIN> = {
    'JTE': { make: 'Toyota', model: 'Corolla', year: 2018, bodyType: 'Sedan' },
    'JM1': { make: 'Mazda', model: 'Axela', year: 2020, bodyType: 'Sedan' },
    'WBA': { make: 'BMW', model: '3 Series', year: 2019, bodyType: 'Sedan' },
    'SAL': { make: 'Land Rover', model: 'Defender', year: 2022, bodyType: 'SUV' },
    'KNA': { make: 'Kia', model: 'Sorento', year: 2021, bodyType: 'SUV' },
    // Add a specific mock for testing
    '12345678901234567': { make: 'Toyota', model: 'Premio', year: 2015, bodyType: 'Sedan' }
};

export const decodeVIN = async (vin: string): Promise<DecodedVIN | null> => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 800));

    const normalizedVIN = vin.toUpperCase().replace(/\s/g, '');

    // Check strict length in a real app (17 chars), but here we'll be lenient for demo
    if (normalizedVIN.length < 3) return null;

    // Direct match check (for full VINs)
    if (MOCK_VIN_DB[normalizedVIN]) {
        return MOCK_VIN_DB[normalizedVIN];
    }

    // Prefix match (WMI check)
    const wmi = normalizedVIN.substring(0, 3);
    if (MOCK_VIN_DB[wmi]) {
        // Return base model but maybe randomize year slightly for "realism" if we wanted
        return MOCK_VIN_DB[wmi];
    }

    // Default fallback for demo purposes if it looks like a valid VIN format
    if (normalizedVIN.length === 17) {
        return {
            make: 'Toyota',
            model: 'Generic',
            year: 2020,
            bodyType: 'Sedan'
        };
    }

    return null;
};
