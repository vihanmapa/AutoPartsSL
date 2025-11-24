
import React, { useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { ProductCard } from '../components/ProductCard';
import { MapPin, Star, ShieldCheck, Search, FilterX, ArrowLeft } from 'lucide-react';
import { Button } from '../components/ui/Button';

export const VendorStore: React.FC = () => {
  const { selectedVendorPublic, products, setView, isLoading } = useApp();

  const vendorProducts = useMemo(() => {
    if (!selectedVendorPublic) return [];
    return products.filter(p => p.vendorId === selectedVendorPublic.id);
  }, [products, selectedVendorPublic]);

  if (!selectedVendorPublic) {
    return (
      <div className="container mx-auto px-4 py-12 text-center">
        <h2 className="text-2xl font-bold text-slate-800">Store Not Found</h2>
        <Button onClick={() => setView('marketplace')} className="mt-4">Return to Marketplace</Button>
      </div>
    );
  }

  const LoadingSkeleton = () => (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {[1, 2, 3, 4].map((i) => (
        <div key={i} className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden h-[350px] animate-pulse">
          <div className="h-48 bg-slate-200"></div>
          <div className="p-4 space-y-3">
            <div className="h-4 bg-slate-200 rounded w-1/4"></div>
            <div className="h-6 bg-slate-200 rounded w-3/4"></div>
            <div className="h-4 bg-slate-200 rounded w-1/2"></div>
          </div>
        </div>
      ))}
    </div>
  );

  return (
    <div className="min-h-screen pb-20 bg-gray-50">
      {/* Vendor Header / Banner */}
      <div className="bg-slate-900 text-white relative overflow-hidden">
        {/* Banner Image or Abstract Background */}
        {selectedVendorPublic.bannerUrl ? (
             <div className="absolute inset-0">
                 <img src={selectedVendorPublic.bannerUrl} alt="" className="w-full h-full object-cover opacity-50" />
                 <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/60 to-transparent"></div>
             </div>
        ) : (
            <div className="absolute inset-0 opacity-10">
                <div className="absolute -top-20 -left-20 w-96 h-96 bg-secondary rounded-full blur-3xl"></div>
                <div className="absolute bottom-0 right-0 w-96 h-96 bg-blue-500 rounded-full blur-3xl"></div>
            </div>
        )}
        
        <div className="container mx-auto px-4 py-8 relative z-10">
          <Button 
            variant="outline" 
            className="mb-6 border-slate-600 text-slate-300 hover:bg-slate-800 hover:text-white hover:border-white"
            onClick={() => setView('marketplace')}
          >
             <ArrowLeft className="h-4 w-4" /> Back to Marketplace
          </Button>

          <div className="flex flex-col md:flex-row items-center gap-6 md:gap-8">
            <div className="h-24 w-24 md:h-32 md:w-32 rounded-full bg-white p-1 shadow-2xl shrink-0">
               <div className="h-full w-full rounded-full bg-slate-100 flex items-center justify-center text-slate-700 text-4xl font-bold uppercase border-2 border-slate-200 overflow-hidden">
                  {selectedVendorPublic.logoUrl ? (
                      <img src={selectedVendorPublic.logoUrl} alt={selectedVendorPublic.name} className="w-full h-full object-cover" />
                  ) : (
                      selectedVendorPublic.name.charAt(0)
                  )}
               </div>
            </div>
            
            <div className="text-center md:text-left flex-1">
               <div className="flex flex-col md:flex-row items-center gap-2 md:gap-4 mb-2">
                 <h1 className="text-3xl font-bold tracking-tight">{selectedVendorPublic.name}</h1>
                 {selectedVendorPublic.verified && (
                   <span className="flex items-center gap-1 bg-green-500/20 text-green-400 px-2 py-0.5 rounded-full text-xs font-bold border border-green-500/30">
                     <ShieldCheck className="h-3 w-3" /> Verified Seller
                   </span>
                 )}
               </div>
               
               <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 text-slate-300 text-sm mb-4">
                  <div className="flex items-center gap-1">
                     <MapPin className="h-4 w-4" />
                     {selectedVendorPublic.location}
                  </div>
                  <div className="flex items-center gap-1 text-yellow-400">
                     <Star className="h-4 w-4 fill-current" />
                     <span className="font-bold">{selectedVendorPublic.rating}</span>
                     <span className="text-slate-400">(128 Reviews)</span>
                  </div>
                  {selectedVendorPublic.category && (
                      <span className="bg-slate-800 px-2 py-0.5 rounded text-xs border border-slate-700">
                          {selectedVendorPublic.category}
                      </span>
                  )}
               </div>

               <p className="max-w-2xl text-slate-400 text-sm">
                  {selectedVendorPublic.description || "Specialists in high-quality Japanese auto parts. We import directly to ensure you get the best genuine and OEM parts for your vehicle."}
               </p>
            </div>

            <div className="flex gap-3">
               <Button variant="secondary" className="px-6">Contact Seller</Button>
               <Button variant="outline" className="border-slate-500 text-white hover:bg-slate-800">Follow</Button>
            </div>
          </div>
        </div>
      </div>

      {/* Store Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
           <h2 className="text-2xl font-bold text-slate-800">All Products</h2>
           
           <div className="relative w-full max-w-xs hidden sm:block">
              <input 
                type="text" 
                placeholder="Search in this store..." 
                className="w-full pl-10 pr-4 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-secondary focus:border-transparent"
              />
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
           </div>
        </div>

        {isLoading ? (
          <LoadingSkeleton />
        ) : vendorProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {vendorProducts.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-20 text-slate-400 bg-white rounded-xl shadow-sm border border-slate-100">
            <FilterX className="h-16 w-16 mb-4 opacity-50" />
            <h3 className="text-xl font-semibold mb-2">No Products Found</h3>
            <p className="max-w-md text-center">
              This vendor hasn't listed any products yet.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
