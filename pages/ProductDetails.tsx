
import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Button } from '../components/ui/Button';
import { isNativeApp } from '../utils/platform';
import {
  ArrowLeft,
  ShoppingCart,
  ShieldCheck,
  Truck,
  Store,
  CreditCard,
  Share2,
  Heart,
  Package,
  Flame,
  CheckCircle,
  Zap
} from 'lucide-react';
import { Condition } from '../types';

export const ProductDetails: React.FC = () => {
  const { selectedProduct, setView, addToCart, getVendor, viewVendorStore } = useApp();
  const [activeTab, setActiveTab] = useState<'description' | 'specs' | 'hazards'>('description');
  const [postcode, setPostcode] = useState('');
  const [deliveryStatus, setDeliveryStatus] = useState<string | null>(null);

  if (!selectedProduct) {
    return (
      <div className="container mx-auto px-4 py-12 text-center">
        <h2 className="text-2xl font-bold text-slate-800">Product Not Found</h2>
        <Button onClick={() => setView('marketplace')} className="mt-4">Return to Shop</Button>
      </div>
    );
  }

  const vendor = getVendor(selectedProduct.vendorId);
  const savings = selectedProduct.rrp ? selectedProduct.rrp - selectedProduct.price : 0;
  const savingsPercent = selectedProduct.rrp ? Math.round((savings / selectedProduct.rrp) * 100) : 0;

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-LK', {
      style: 'currency',
      currency: 'LKR',
      minimumFractionDigits: 0
    }).format(amount);
  };

  const checkDelivery = () => {
    if (postcode.length < 4) return;
    setDeliveryStatus("Checking...");
    setTimeout(() => {
      setDeliveryStatus("Available for delivery to this area (2-3 Days)");
    }, 1000);
  };

  const handleBuyNow = () => {
    addToCart(selectedProduct);
    setView('checkout');
  };

  return (
    <div className="bg-white min-h-screen pb-12">
      {/* Breadcrumb & Header */}
      <div className={`bg-slate-50 border-b border-slate-200 sticky top-0 ${isNativeApp() ? 'pt-20' : 'pt-16'} z-30`}>
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center gap-2 text-sm text-slate-500 mb-2">
            <button onClick={() => setView('marketplace')} className="hover:text-secondary">Home</button>
            <span>/</span>
            <span className="hover:text-secondary cursor-pointer">{selectedProduct.category}</span>
            <span>/</span>
            <span className="text-slate-900 font-medium truncate max-w-[200px]">{selectedProduct.title}</span>
          </div>
          <button
            onClick={() => setView('marketplace')}
            className="flex items-center gap-1 text-secondary font-medium text-sm hover:underline"
          >
            <ArrowLeft className="h-4 w-4" /> Back to Results
          </button>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

          {/* LEFT: Images (5 cols) */}
          <div className="lg:col-span-5">
            <div className="sticky top-32 space-y-4">
              <div className="aspect-square bg-gray-100 rounded-xl overflow-hidden border border-slate-200 relative group">
                <img
                  src={selectedProduct.imageUrl}
                  alt={selectedProduct.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                {selectedProduct.brand && (
                  <div className="absolute top-4 right-4 bg-white/90 backdrop-blur px-3 py-1 rounded-full text-xs font-bold text-slate-800 shadow-sm">
                    {selectedProduct.brand}
                  </div>
                )}
              </div>
              {/* Thumbnail strip would go here */}
            </div>
          </div>

          {/* MIDDLE: Product Info (4 cols) */}
          <div className="lg:col-span-4 space-y-6">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-slate-900 leading-tight mb-2">
                {selectedProduct.title}
              </h1>
              <div className="flex items-center gap-3 text-sm">
                <span className="bg-slate-100 text-slate-600 px-2 py-1 rounded font-mono border border-slate-200">
                  SKU: {selectedProduct.sku}
                </span>
                {vendor && (
                  <button
                    onClick={() => viewVendorStore(vendor.id)}
                    className="text-blue-600 font-medium flex items-center gap-1 hover:underline hover:text-blue-700"
                  >
                    <Store className="h-3 w-3" /> {vendor.name}
                  </button>
                )}
              </div>
            </div>

            {/* Condition & Origin Badges */}
            <div className="flex flex-wrap gap-2">
              <div className={`inline - flex items - center gap - 1 px - 3 py - 1 rounded - full text - sm font - medium border ${selectedProduct.condition === Condition.New
                ? 'bg-green-50 text-green-700 border-green-200'
                : 'bg-orange-50 text-orange-700 border-orange-200'
                } `}>
                <Package className="h-3 w-3" />
                {selectedProduct.condition}
              </div>
              <div className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium bg-slate-50 text-slate-700 border border-slate-200">
                <ShieldCheck className="h-3 w-3" />
                {selectedProduct.origin}
              </div>
            </div>

            {/* Tabs: Description / Specs / Hazards */}
            <div className="border-t border-slate-200 pt-6">
              <div className="flex gap-6 border-b border-slate-200 mb-4">
                <button
                  className={`pb - 2 font - medium text - sm transition - colors relative ${activeTab === 'description' ? 'text-secondary' : 'text-slate-500 hover:text-slate-800'} `}
                  onClick={() => setActiveTab('description')}
                >
                  Description
                  {activeTab === 'description' && <div className="absolute bottom-0 left-0 w-full h-0.5 bg-secondary"></div>}
                </button>
                <button
                  className={`pb - 2 font - medium text - sm transition - colors relative ${activeTab === 'specs' ? 'text-secondary' : 'text-slate-500 hover:text-slate-800'} `}
                  onClick={() => setActiveTab('specs')}
                >
                  Specifications
                  {activeTab === 'specs' && <div className="absolute bottom-0 left-0 w-full h-0.5 bg-secondary"></div>}
                </button>
                {selectedProduct.hazards && selectedProduct.hazards.length > 0 && (
                  <button
                    className={`pb - 2 font - medium text - sm transition - colors relative ${activeTab === 'hazards' ? 'text-red-600' : 'text-slate-500 hover:text-red-600'} `}
                    onClick={() => setActiveTab('hazards')}
                  >
                    Hazards
                    {activeTab === 'hazards' && <div className="absolute bottom-0 left-0 w-full h-0.5 bg-red-600"></div>}
                  </button>
                )}
              </div>

              <div className="min-h-[200px]">
                {activeTab === 'description' && (
                  <div className="prose prose-sm text-slate-600 max-w-none">
                    <p>{selectedProduct.longDescription || "No detailed description available for this product."}</p>
                    <ul className="mt-4 space-y-1 list-disc pl-4">
                      <li>Genuine quality parts</li>
                      <li>Direct fit for compatible models</li>
                      <li>Tested for durability</li>
                    </ul>
                  </div>
                )}

                {activeTab === 'specs' && (
                  <div>
                    {selectedProduct.specifications ? (
                      <table className="w-full text-sm">
                        <tbody className="divide-y divide-slate-100">
                          {Object.entries(selectedProduct.specifications).map(([key, value]) => (
                            <tr key={key}>
                              <td className="py-2 text-slate-500 font-medium w-1/3">{key}</td>
                              <td className="py-2 text-slate-900">{value}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    ) : (
                      <p className="text-slate-500 text-sm italic">No specific technical data available.</p>
                    )}
                  </div>
                )}

                {activeTab === 'hazards' && (
                  <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                    <div className="flex items-start gap-3">
                      <div className="p-2 bg-white border-2 border-red-500 rounded transform rotate-45 shrink-0 mt-1">
                        <Flame className="h-6 w-6 text-slate-900 transform -rotate-45" />
                      </div>
                      <div>
                        <h4 className="font-bold text-red-800 mb-1">Hazard Warning</h4>
                        <p className="text-sm text-red-700 mb-2">
                          This product contains chemicals or materials that require careful handling.
                        </p>
                        <ul className="list-disc list-inside text-sm text-red-800 font-medium">
                          {selectedProduct.hazards?.map(h => <li key={h}>{h}</li>)}
                        </ul>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* RIGHT: Buy Box (3 cols) */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-xl shadow-lg border border-slate-200 p-6 sticky top-32">
              {/* Price Section */}
              <div className="mb-6">
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl font-bold text-slate-900">{formatCurrency(selectedProduct.price)}</span>
                  {selectedProduct.rrp && (
                    <span className="text-sm text-slate-400 line-through">{formatCurrency(selectedProduct.rrp)}</span>
                  )}
                </div>
                {selectedProduct.rrp && (
                  <p className="text-sm text-green-600 font-bold mt-1">
                    Save {formatCurrency(savings)} ({savingsPercent}%)
                  </p>
                )}
                <div className="flex items-center gap-2 mt-3 p-2 bg-blue-50 rounded text-xs text-blue-800 border border-blue-100">
                  <CreditCard className="h-3 w-3" />
                  <span>Pay in 3 interest-free payments of {formatCurrency(selectedProduct.price / 3)}</span>
                </div>
              </div>

              {/* Stock Status */}
              <div className="mb-6">
                {selectedProduct.stock > 0 ? (
                  <div className="flex items-center gap-2 text-green-700 font-medium text-sm mb-1">
                    <div className="h-2.5 w-2.5 rounded-full bg-green-500 animate-pulse"></div>
                    In Stock ({selectedProduct.stock} available)
                  </div>
                ) : (
                  <div className="flex items-center gap-2 text-red-600 font-medium text-sm mb-1">
                    <div className="h-2.5 w-2.5 rounded-full bg-red-500"></div>
                    Out of Stock
                  </div>
                )}
                <p className="text-xs text-slate-500">Order within 4 hrs 30 mins for dispatch today.</p>
              </div>

              {/* Action Buttons */}
              <div className="space-y-3 mb-6">
                <div className="flex flex-col gap-3">
                  <Button
                    size="lg"
                    className="w-full text-lg h-12"
                    variant="primary"
                    onClick={handleBuyNow}
                    disabled={selectedProduct.stock === 0}
                  >
                    <Zap className="mr-2 h-5 w-5 fill-current" /> Buy Now
                  </Button>
                  <Button
                    size="lg"
                    className="w-full text-lg h-12"
                    variant="secondary"
                    onClick={() => addToCart(selectedProduct)}
                    disabled={selectedProduct.stock === 0}
                  >
                    <ShoppingCart className="mr-2 h-5 w-5" /> Add to Basket
                  </Button>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <Button variant="outline" size="sm" className="w-full text-xs">
                    <Heart className="mr-1 h-3 w-3" /> Save
                  </Button>
                  <Button variant="outline" size="sm" className="w-full text-xs">
                    <Share2 className="mr-1 h-3 w-3" /> Share
                  </Button>
                </div>
              </div>

              {/* Delivery Checker */}
              <div className="border-t border-slate-100 pt-4">
                <h4 className="font-semibold text-sm mb-2 flex items-center gap-2">
                  <Truck className="h-4 w-4 text-slate-400" /> Delivery & Collection
                </h4>
                <div className="flex gap-2 mb-2">
                  <input
                    type="text"
                    placeholder="Postcode"
                    className="w-full border border-slate-300 rounded px-2 py-1 text-base uppercase bg-white text-slate-900"
                    value={postcode}
                    onClick={() => !postcode && setPostcode('10250')}
                    onChange={(e) => setPostcode(e.target.value)}
                    maxLength={5}
                    title="Click to fill sample data"
                  />
                  <Button size="sm" variant="outline" onClick={checkDelivery}>Check</Button>
                </div>
                {deliveryStatus && (
                  <p className="text-xs text-green-600 font-medium flex items-center gap-1 animate-in fade-in slide-in-from-top-1">
                    <CheckCircle className="h-3 w-3" /> {deliveryStatus}
                  </p>
                )}
                <div className="mt-3 space-y-2">
                  <div className="flex items-center gap-2 text-xs text-slate-600">
                    <Truck className="h-3 w-3" /> Standard Delivery: <span className="font-bold">LKR 450</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-slate-600">
                    <Store className="h-3 w-3" /> Click & Collect: <span className="font-bold text-green-600">FREE</span>
                  </div>
                </div>
              </div>

            </div>
          </div>

        </div>
      </div>
    </div>
  );
};