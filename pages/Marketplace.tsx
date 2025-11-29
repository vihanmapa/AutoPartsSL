
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
        // Note: Ideally we check YEAR too, but selectedVehicle from context is the Model object.
        // The filtering logic in VehicleSelector ensures we only pick a valid model for that year.
        return p.compatibleVehicles.some(cv => cv.vehicleId === selectedVehicle.id);
      });
    }

    return filtered;
  }, [selectedVehicle, searchQuery, products]);

  const LoadingSkeleton = () => (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
        <div key={i} className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden h-[350px] animate-pulse">
          <div className="h-48 bg-slate-200"></div>
          <div className="p-4 space-y-3">
            <div className="h-4 bg-slate-200 rounded w-1/4"></div>
            <div className="h-6 bg-slate-200 rounded w-3/4"></div>
            <div className="h-4 bg-slate-200 rounded w-1/2"></div>
            <div className="flex justify-between pt-4">
               <div className="h-6 bg-slate-200 rounded w-1/3"></div>
               <div className="h-8 bg-slate-200 rounded w-1/4"></div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );

  return (
    <div className="min-h-screen pb-20">
      <VehicleSelector />
      
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-slate-800">
            {selectedVehicle ? 'Compatible Parts' : 'Featured Products'}
          </h2>
          <span className="text-slate-500 text-sm">
            {isLoading ? 'Updating...' : `Showing ${filteredProducts.length} results`}
          </span>
        </div>

        {isLoading ? (
          <LoadingSkeleton />
        ) : filteredProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredProducts.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-20 text-slate-400">
            <FilterX className="h-16 w-16 mb-4 opacity-50" />
            <h3 className="text-xl font-semibold mb-2">No Parts Found</h3>
            <p className="max-w-md text-center">
              We couldn't find any parts matching your criteria. Try adjusting your search or vehicle filters.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
