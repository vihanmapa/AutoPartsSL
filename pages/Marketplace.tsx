import React, { useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { ProductCard } from '../components/ProductCard';
import { VehicleSelector } from '../components/VehicleSelector';
import { FilterX, Loader2 } from 'lucide-react';

export const Marketplace: React.FC = () => {
  const { selectedVehicle, searchQuery, products, isLoading } = useApp();

  const filteredProducts = useMemo(() => {
    let filtered = products;

    // Filter by search query
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      filtered = filtered.filter(p => p.title.toLowerCase().includes(q));
    }

    // Filter by vehicle compatibility
    if (selectedVehicle) {
      filtered = filtered.filter(p => {
        // Handle legacy or undefined compatibility
        if (!p.compatibleVehicles) return false;

        // Check if any variant matches the selected vehicle ID
        return p.compatibleVehicles.some(cv => cv && cv.vehicleId === selectedVehicle.id);
      });
    }

    return filtered.filter(p => p !== null);
  }, [selectedVehicle, searchQuery, products]);

  const LoadingSkeleton = () => (
    <div className="space-y-4">
      {[1, 2, 3, 4].map((i) => (
        <div key={i} className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden h-[300px] animate-pulse">
          <div className="h-48 bg-slate-200"></div>
          <div className="p-4 space-y-3">
            <div className="h-4 bg-slate-200 rounded w-1/4"></div>
            <div className="h-6 bg-slate-200 rounded w-3/4"></div>
          </div>
        </div>
      ))}
    </div>
  );

  return (
    <div className="min-h-screen pb-24 bg-slate-50">
      <VehicleSelector />

      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-slate-900">
            {selectedVehicle ? 'Compatible Parts' : 'Featured Products'}
          </h2>
          <span className="text-slate-500 text-xs">
            {isLoading ? 'Updating...' : `Showing ${filteredProducts.length} results`}
          </span>
        </div>

        {isLoading ? (
          <LoadingSkeleton />
        ) : filteredProducts.length > 0 ? (
          <div className="space-y-4">
            {filteredProducts.map(product => (
              product && <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-20 text-slate-400">
            <FilterX className="h-16 w-16 mb-4 opacity-50" />
            <h3 className="text-xl font-semibold mb-2">No Parts Found</h3>
            <p className="max-w-md text-center text-sm">
              We couldn't find any parts matching your criteria. Try adjusting your search or vehicle filters.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
