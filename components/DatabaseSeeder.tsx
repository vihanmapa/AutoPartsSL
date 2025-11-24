
import React, { useState } from 'react';
import { db } from '../services/firebase';
import { doc, writeBatch } from 'firebase/firestore';
import { MOCK_PRODUCTS, MOCK_VEHICLES, MOCK_VENDORS } from '../services/mockData';
import { Button } from './ui/Button';
import { Database, CheckCircle, AlertTriangle, Loader2 } from 'lucide-react';

export const DatabaseSeeder: React.FC = () => {
  const [isUploading, setIsUploading] = useState(false);
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');

  const seedDatabase = async () => {
    if (!confirm('This will upload mock data to your Firebase Firestore. Continue?')) return;
    
    setIsUploading(true);
    setStatus('idle');
    setMessage('');

    try {
      const batch = writeBatch(db);

      // 1. Seed Vehicles
      MOCK_VEHICLES.forEach(vehicle => {
        const ref = doc(db, 'vehicles', vehicle.id);
        batch.set(ref, vehicle);
      });
      
      // 2. Seed Vendors
      MOCK_VENDORS.forEach(vendor => {
        const ref = doc(db, 'vendors', vendor.id);
        batch.set(ref, vendor);
      });

      // 3. Seed Products
      MOCK_PRODUCTS.forEach(product => {
        const ref = doc(db, 'products', product.id);
        batch.set(ref, product);
      });

      // Commit all changes in a single atomic transaction
      await batch.commit();

      setStatus('success');
      setMessage(`Successfully uploaded: ${MOCK_VEHICLES.length} vehicles, ${MOCK_VENDORS.length} vendors, ${MOCK_PRODUCTS.length} products.`);
      
      // Optional: Refresh page or notify app to reload data
      setTimeout(() => {
          window.location.reload();
      }, 2000);

    } catch (error: any) {
      console.error("Seeding failed:", error);
      setStatus('error');
      setMessage(`Failed to upload data: ${error.message}`);
    } finally {
      setIsUploading(false);
    }
  };

  if (status === 'success') {
      return (
          <div className="fixed bottom-4 right-4 bg-green-900 text-white p-4 rounded-lg shadow-xl flex items-center gap-3 z-50 animate-in slide-in-from-bottom-5">
              <CheckCircle className="h-6 w-6 text-green-400" />
              <div>
                  <h4 className="font-bold">Upload Complete</h4>
                  <p className="text-xs text-green-200">Refreshing app...</p>
              </div>
          </div>
      );
  }

  return (
    <div className="fixed bottom-4 right-4 z-50">
      {status === 'error' && (
          <div className="bg-red-600 text-white p-3 rounded mb-2 text-sm max-w-xs flex items-center gap-2">
              <AlertTriangle className="h-4 w-4" />
              {message}
          </div>
      )}
      
      <Button 
        onClick={seedDatabase} 
        variant="secondary" 
        className="shadow-2xl border-2 border-white"
        disabled={isUploading}
      >
        {isUploading ? (
            <>
                <Loader2 className="h-4 w-4 animate-spin" /> Uploading Mock Data...
            </>
        ) : (
            <>
                <Database className="h-4 w-4" /> Seed Firebase DB
            </>
        )}
      </Button>
    </div>
  );
};
