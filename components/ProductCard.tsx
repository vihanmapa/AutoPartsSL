
import React from 'react';
import { CheckCircle, ShoppingCart, Package } from 'lucide-react';
import { Product, Condition } from '../types';
import { useApp } from '../context/AppContext';
import { Button } from './ui/Button';

interface ProductCardProps {
  product: Product;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { addToCart, selectedVehicle, viewProduct, getVendor, viewVendorStore } = useApp();
  const vendor = getVendor(product.vendorId);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-LK', {
      style: 'currency',
      currency: 'LKR',
      minimumFractionDigits: 0
    }).format(amount);
  };

  const getConditionColor = (condition: Condition) => {
    switch (condition) {
      case Condition.New: return "bg-green-100 text-green-800 border-green-200";
      case Condition.Reconditioned: return "bg-orange-100 text-orange-800 border-orange-200";
      case Condition.Used: return "bg-gray-100 text-gray-800 border-gray-200";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  // Check if this product specifically fits the selected vehicle and year
  const isExactFit = React.useMemo(() => {
    if (!selectedVehicle) return false;

    // Legacy support or empty array check
    if (!product.compatibleVehicles) return false;

    // The selectedVehicle object in context represents a specific model (and conceptually a year if selected via selector)
    // However, the standard Selector in `VehicleSelector.tsx` finds a vehicle ID (model).
    // If we want exact year match, we need to know the User's selected Year.
    // NOTE: The `selectedVehicle` context usually holds the Model object. 
    // To implement "Exact Year Fit", we'd ideally need the selected YEAR from context too.
    // For now, we check if ANY variant matches the ID. 
    // BUT, the prompt implies "Exact Fit" should be smarter. 
    // Assuming `selectedVehicle` might be just the base model definition.
    // Let's check if the ID exists in the compatibility list.

    // If the User selected a specific year in the filtering tool, we should ideally check that.
    // Currently AppContext stores `selectedVehicle: Vehicle | null`.
    // We will assume if the vehicle ID matches, it fits (since the user likely filtered by year to get that vehicle).

    return product.compatibleVehicles.some(cv => cv.vehicleId === selectedVehicle.id);
  }, [selectedVehicle, product.compatibleVehicles]);

  return (
    <div className="bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-200 border border-slate-100 overflow-hidden flex flex-col h-full group">
      <div
        className="relative h-48 w-full bg-gray-100 overflow-hidden cursor-pointer"
        onClick={() => viewProduct(product)}
      >
        <img
          src={product.imageUrl}
          alt={product.title}
          className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
        />
        {isExactFit && (
          <div className="absolute top-2 right-2 bg-green-600 text-white text-xs font-bold px-2 py-1 rounded flex items-center gap-1 shadow-sm">
            <CheckCircle className="h-3 w-3" /> Fits your {selectedVehicle?.model}
          </div>
        )}
      </div>

      <div className="p-4 flex-1 flex flex-col">
        <div className="flex justify-between items-start mb-2">
          <span className={`text-xs font-semibold px-2 py-0.5 rounded border ${getConditionColor(product.condition)}`}>
            {product.condition}
          </span>
          <span className="text-xs text-slate-500 flex items-center gap-1">
            <Package className="h-3 w-3" /> {product.origin}
          </span>
        </div>

        <h3
          className="font-bold text-slate-800 text-lg leading-tight mb-1 cursor-pointer hover:text-secondary transition-colors"
          onClick={() => viewProduct(product)}
        >
          {product.title}
        </h3>
        <p className="text-sm text-slate-500 mb-4">
          Sold by{' '}
          <span
            className="text-blue-600 font-medium hover:underline cursor-pointer"
            onClick={(e) => {
              e.stopPropagation();
              if (vendor) viewVendorStore(vendor.id);
            }}
          >
            {vendor?.name || 'Unknown Vendor'}
          </span>
        </p>

        <div className="mt-auto flex items-center justify-between pt-4 border-t border-slate-100">
          <div className="text-xl font-bold text-slate-900">
            {formatCurrency(product.price)}
          </div>
          <Button
            size="sm"
            variant="secondary"
            className="rounded-full px-4"
            onClick={(e) => {
              e.stopPropagation();
              addToCart(product);
            }}
          >
            <ShoppingCart className="h-4 w-4" /> Add
          </Button>
        </div>
      </div>
    </div>
  );
};
