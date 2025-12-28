import React, { useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { ProductCard } from '../components/ProductCard';
import { VehicleWizardModal } from '../components/VehicleWizard/VehicleWizardModal';
import { Breadcrumbs } from '../components/Breadcrumbs';
import { FilterX, Loader2, SlidersHorizontal, ArrowLeft } from 'lucide-react';

import { StickyVehicleBar } from '../components/VehicleWizard/StickyVehicleBar';

export const Marketplace: React.FC = () => {
  const { selectedVehicle, searchQuery, products, isLoading, selectedCategory, setSelectedCategory } = useApp();

  const [isFilterOpen, setIsFilterOpen] = React.useState(false);
  const [sortBy, setSortBy] = React.useState<'price-asc' | 'price-desc' | null>(null);
  const [filterCondition, setFilterCondition] = React.useState<string | null>(null);

  const filteredProducts = useMemo(() => {
    let filtered = products;

    // Filter by search query
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      filtered = filtered.filter(p => p.title.toLowerCase().includes(q));
    }

    // Filter by category
    if (selectedCategory) {
      filtered = filtered.filter(p => p.category === selectedCategory);
    }

    // Filter by vehicle compatibility
    if (selectedVehicle) {
      filtered = filtered.filter(p => {
        if (!p.compatibleVehicles) return false;
        return p.compatibleVehicles.some(cv =>
          cv.make.toLowerCase() === selectedVehicle.make.toLowerCase() &&
          cv.model.toLowerCase() === selectedVehicle.model.toLowerCase() &&
          // Only check year if selectedVehicle has a specific one
          (selectedVehicle.year ? cv.year === selectedVehicle.year : true)
        );
      });
    }

    // Filter by Condition
    if (filterCondition) {
      filtered = filtered.filter(p => p.condition === filterCondition);
    }

    // Sort
    if (sortBy === 'price-asc') {
      filtered = [...filtered].sort((a, b) => a.price - b.price);
    } else if (sortBy === 'price-desc') {
      filtered = [...filtered].sort((a, b) => b.price - a.price);
    }

    return filtered.filter(p => p !== null);
  }, [selectedVehicle, searchQuery, products, selectedCategory, sortBy, filterCondition]);

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
    <div className="min-h-screen pb-24 bg-slate-50 relative">
      <StickyVehicleBar />


      <VehicleWizardModal />

      {/* Filter Overlay */}
      {isFilterOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 flex justify-end">
          <div className="w-80 bg-white h-full p-6 shadow-2xl animate-in slide-in-from-right duration-300">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold">Filters</h2>
              <button onClick={() => setIsFilterOpen(false)}><FilterX className="h-6 w-6 text-slate-500" /></button>
            </div>

            <div className="space-y-6">
              <div>
                <h3 className="font-semibold mb-3">Sort By</h3>
                <div className="space-y-2">
                  <button
                    onClick={() => setSortBy('price-asc')}
                    className={`w-full text-left px-4 py-2 rounded ${sortBy === 'price-asc' ? 'bg-blue-50 text-blue-600 font-medium' : 'hover:bg-slate-50'}`}
                  >
                    Price: Low to High
                  </button>
                  <button
                    onClick={() => setSortBy('price-desc')}
                    className={`w-full text-left px-4 py-2 rounded ${sortBy === 'price-desc' ? 'bg-blue-50 text-blue-600 font-medium' : 'hover:bg-slate-50'}`}
                  >
                    Price: High to Low
                  </button>
                </div>
              </div>

              <div>
                <h3 className="font-semibold mb-3">Condition</h3>
                <div className="space-y-2">
                  {['Brand New', 'Reconditioned (Panchikawatta Spec)', 'Used'].map(c => (
                    <button
                      key={c}
                      onClick={() => setFilterCondition(filterCondition === c ? null : c)}
                      className={`w-full text-left px-4 py-2 rounded ${filterCondition === c ? 'bg-blue-50 text-blue-600 font-medium' : 'hover:bg-slate-50'}`}
                    >
                      {c}
                    </button>
                  ))}
                </div>
              </div>

              <button
                onClick={() => { setSortBy(null); setFilterCondition(null); }}
                className="w-full mt-8 border border-slate-200 py-3 rounded-lg text-slate-600 hover:bg-slate-50"
              >
                Reset All Filters
              </button>

              <button
                onClick={() => setIsFilterOpen(false)}
                className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700"
              >
                Show Results
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="container mx-auto px-4 py-4">
        <Breadcrumbs
          onHomeClick={() => setSelectedCategory(null)}
          items={selectedCategory ? [{ label: selectedCategory, active: true }] : []}
          className="mb-4"
        />

        <div className="flex flex-col gap-2 mb-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-slate-900">
              {selectedCategory ? `${selectedCategory}` :
                selectedVehicle ? 'Compatible Parts' : 'Featured Products'}
            </h2>
            <div className="flex items-center">
              <span className="text-slate-500 text-xs mr-2">
                {isLoading ? 'Updating...' : `Showing ${filteredProducts.length} results`}
              </span>
              <button onClick={() => setIsFilterOpen(true)} className="p-2 hover:bg-slate-100 rounded-full transition-colors relative">
                <SlidersHorizontal className="h-5 w-5 text-slate-700" />
                {(sortBy || filterCondition) && <span className="absolute top-1 right-1 h-2 w-2 bg-blue-600 rounded-full"></span>}
              </button>
            </div>
          </div>

          {selectedCategory && (
            <button
              onClick={() => setSelectedCategory(null)}
              className="self-start flex items-center gap-1 text-xs bg-slate-200 text-slate-700 px-2 py-1 rounded-full hover:bg-slate-300 transition-colors"
            >
              Filter: {selectedCategory} <FilterX className="h-3 w-3" />
            </button>
          )}
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
            <button onClick={() => { setSortBy(null); setFilterCondition(null); }} className="mt-4 text-blue-600 underline">Clear Filters</button>
          </div>
        )}
      </div>
    </div>
  );
};
