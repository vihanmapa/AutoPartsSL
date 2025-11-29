
import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { useNotification } from '../context/NotificationContext';
import { Address, PaymentMethod } from '../types';
import { Button } from '../components/ui/Button';
import { ArrowLeft, MapPin, CreditCard, Truck, CheckCircle, Wallet, AlertTriangle } from 'lucide-react';

export const Checkout: React.FC = () => {
  const { cart, currentUser, placeOrder, setView, openAuthModal } = useApp();
  const { notify } = useNotification();
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [address, setAddress] = useState<Address>({
    fullName: currentUser.name !== 'Guest Buyer' ? currentUser.name : '',
    phone: currentUser.phone || '',
    addressLine1: '',
    city: '',
    district: '',
    postalCode: ''
  });
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('cod');
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentError, setPaymentError] = useState<string | null>(null);

  // Redirect empty cart
  useEffect(() => {
    if (cart.length === 0) {
      setView('marketplace');
    }
  }, [cart, setView]);

  // Guest protection
  useEffect(() => {
    if (currentUser.id === 'u1') { // If Guest
      openAuthModal();
      notify('info', 'Please login to checkout');
    }
  }, [currentUser, openAuthModal, notify]);

  const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const shippingCost = 450;
  const grandTotal = total + shippingCost;

  const handleAddressChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setAddress(prev => ({ ...prev, [name]: value }));
  };

  const fillSampleAddress = () => {
    setAddress({
      fullName: currentUser.name,
      phone: '077 123 4567',
      addressLine1: 'No. 45, Temple Road',
      city: 'Nugegoda',
      district: 'Colombo',
      postalCode: '10250'
    });
    notify('info', 'Sample address filled');
  };

  const handleNextStep = () => {
    if (step === 1) {
      // Address Validation
      if (!address.fullName.trim()) return notify('error', 'Full Name is required');
      if (!address.phone.trim()) return notify('error', 'Phone number is required');
      if (!address.addressLine1.trim()) return notify('error', 'Address Line 1 is required');
      if (!address.city.trim()) return notify('error', 'City is required');
      if (!address.district.trim()) return notify('error', 'District is required');
      
      setStep(2);
    } else if (step === 2) {
      setStep(3);
    }
  };

  const handleConfirmOrder = async () => {
    setIsProcessing(true);
    setPaymentError(null);
    try {
      await placeOrder(address, paymentMethod);
      // Success is handled by context (redirects to order-success)
    } catch (error: any) {
      setPaymentError(error.message || "Payment Failed");
      setIsProcessing(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <Button variant="outline" onClick={() => setView('cart')} className="mb-6 border-none p-0 hover:bg-transparent hover:text-secondary justify-start">
        <ArrowLeft className="h-4 w-4" /> Back to Cart
      </Button>

      <h1 className="text-3xl font-bold text-slate-900 mb-8">Checkout</h1>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* LEFT: Steps */}
        <div className="flex-1">
          
          {/* STEP 1: Delivery Address */}
          <div className={`bg-white rounded-xl shadow-sm border transition-all duration-300 overflow-hidden mb-6 ${step === 1 ? 'border-secondary ring-1 ring-secondary' : 'border-slate-200'}`}>
            <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50">
              <h2 className="text-lg font-bold flex items-center gap-3 text-slate-800">
                <div className={`h-8 w-8 rounded-full flex items-center justify-center text-sm ${step >= 1 ? 'bg-secondary text-white' : 'bg-slate-200 text-slate-500'}`}>1</div>
                Delivery Address
              </h2>
              {step > 1 && (
                <button onClick={() => setStep(1)} className="text-sm text-secondary hover:underline">Edit</button>
              )}
            </div>
            
            {step === 1 ? (
              <div className="p-6 animate-in slide-in-from-top-2">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-700">Full Name</label>
                    <input 
                      type="text" 
                      name="fullName" 
                      value={address.fullName} 
                      onChange={handleAddressChange}
                      onClick={() => !address.fullName && fillSampleAddress()}
                      className="w-full p-3 border border-slate-300 rounded-lg bg-white text-slate-900 focus:ring-2 focus:ring-secondary focus:border-transparent"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-700">Phone Number</label>
                    <input 
                      type="tel" 
                      name="phone" 
                      value={address.phone} 
                      onChange={handleAddressChange}
                      className="w-full p-3 border border-slate-300 rounded-lg bg-white text-slate-900 focus:ring-2 focus:ring-secondary focus:border-transparent"
                    />
                  </div>
                  <div className="md:col-span-2 space-y-2">
                    <label className="text-sm font-medium text-slate-700">Address Line 1</label>
                    <input 
                      type="text" 
                      name="addressLine1" 
                      value={address.addressLine1} 
                      onChange={handleAddressChange}
                      placeholder="House No, Street Name"
                      className="w-full p-3 border border-slate-300 rounded-lg bg-white text-slate-900 focus:ring-2 focus:ring-secondary focus:border-transparent"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-700">City</label>
                    <input 
                      type="text" 
                      name="city" 
                      value={address.city} 
                      onChange={handleAddressChange}
                      className="w-full p-3 border border-slate-300 rounded-lg bg-white text-slate-900 focus:ring-2 focus:ring-secondary focus:border-transparent"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-700">District</label>
                    <select 
                      name="district" 
                      value={address.district} 
                      onChange={handleAddressChange}
                      className="w-full p-3 border border-slate-300 rounded-lg bg-white text-slate-900 focus:ring-2 focus:ring-secondary focus:border-transparent"
                    >
                      <option value="">Select District</option>
                      <option value="Colombo">Colombo</option>
                      <option value="Gampaha">Gampaha</option>
                      <option value="Kandy">Kandy</option>
                      <option value="Galle">Galle</option>
                      {/* Add more districts */}
                    </select>
                  </div>
                </div>
                <div className="mt-6 flex justify-end">
                  <Button onClick={handleNextStep} className="px-8">Continue to Payment</Button>
                </div>
              </div>
            ) : (
              <div className="p-6 bg-slate-50/50 text-sm text-slate-600">
                <p className="font-bold text-slate-900">{address.fullName}</p>
                <p>{address.addressLine1}, {address.city}</p>
                <p>{address.district} - {address.phone}</p>
              </div>
            )}
          </div>

          {/* STEP 2: Payment Method */}
          <div className={`bg-white rounded-xl shadow-sm border transition-all duration-300 overflow-hidden mb-6 ${step === 2 ? 'border-secondary ring-1 ring-secondary' : 'border-slate-200'}`}>
            <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50">
              <h2 className="text-lg font-bold flex items-center gap-3 text-slate-800">
                <div className={`h-8 w-8 rounded-full flex items-center justify-center text-sm ${step >= 2 ? 'bg-secondary text-white' : 'bg-slate-200 text-slate-500'}`}>2</div>
                Payment Method
              </h2>
              {step > 2 && (
                <button onClick={() => setStep(2)} className="text-sm text-secondary hover:underline">Edit</button>
              )}
            </div>

            {step === 2 ? (
              <div className="p-6 animate-in slide-in-from-top-2">
                <div className="space-y-3">
                  <label className={`flex items-center p-4 border rounded-lg cursor-pointer transition-all ${paymentMethod === 'cod' ? 'border-secondary bg-blue-50' : 'border-slate-200 hover:border-slate-300'}`}>
                    <input 
                      type="radio" 
                      name="payment" 
                      value="cod" 
                      checked={paymentMethod === 'cod'} 
                      onChange={() => setPaymentMethod('cod')}
                      className="h-4 w-4 text-secondary focus:ring-secondary border-gray-300"
                    />
                    <div className="ml-4 flex-1">
                      <div className="flex items-center gap-2 font-bold text-slate-900">
                        <Wallet className="h-5 w-5 text-slate-600" /> Cash on Delivery
                      </div>
                      <p className="text-sm text-slate-500 mt-0.5">Pay with cash when your items arrive.</p>
                    </div>
                  </label>

                  <label className={`flex items-center p-4 border rounded-lg cursor-pointer transition-all ${paymentMethod === 'card' ? 'border-secondary bg-blue-50' : 'border-slate-200 hover:border-slate-300'}`}>
                    <input 
                      type="radio" 
                      name="payment" 
                      value="card" 
                      checked={paymentMethod === 'card'} 
                      onChange={() => setPaymentMethod('card')}
                      className="h-4 w-4 text-secondary focus:ring-secondary border-gray-300"
                    />
                    <div className="ml-4 flex-1">
                       <div className="flex items-center gap-2 font-bold text-slate-900">
                        <CreditCard className="h-5 w-5 text-slate-600" /> Credit / Debit Card
                      </div>
                      <p className="text-sm text-slate-500 mt-0.5">Secure payment via Visa or Mastercard.</p>
                    </div>
                    <div className="flex gap-2">
                      <div className="h-6 w-10 bg-slate-200 rounded"></div>
                      <div className="h-6 w-10 bg-slate-200 rounded"></div>
                    </div>
                  </label>

                   <label className={`flex items-center p-4 border rounded-lg cursor-pointer transition-all ${paymentMethod === 'koko' ? 'border-secondary bg-blue-50' : 'border-slate-200 hover:border-slate-300'}`}>
                    <input 
                      type="radio" 
                      name="payment" 
                      value="koko" 
                      checked={paymentMethod === 'koko'} 
                      onChange={() => setPaymentMethod('koko')}
                      className="h-4 w-4 text-secondary focus:ring-secondary border-gray-300"
                    />
                    <div className="ml-4 flex-1">
                      <div className="font-bold text-slate-900">Koko Pay</div>
                      <p className="text-sm text-slate-500 mt-0.5">Pay in 3 installments.</p>
                    </div>
                  </label>
                </div>

                <div className="mt-6 flex justify-end">
                  <Button onClick={handleNextStep} className="px-8">Review Order</Button>
                </div>
              </div>
            ) : (
              step > 2 && (
                <div className="p-6 bg-slate-50/50 text-sm text-slate-600 flex items-center gap-2">
                   {paymentMethod === 'cod' && <Wallet className="h-4 w-4" />}
                   {paymentMethod === 'card' && <CreditCard className="h-4 w-4" />}
                   <span className="font-bold text-slate-900 uppercase">{paymentMethod === 'cod' ? 'Cash on Delivery' : paymentMethod}</span>
                </div>
              )
            )}
          </div>
          
           {/* STEP 3: Review */}
           {step === 3 && (
            <div className="bg-white rounded-xl shadow-sm border border-secondary ring-1 ring-secondary overflow-hidden animate-in slide-in-from-top-2">
              <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50">
                <h2 className="text-lg font-bold flex items-center gap-3 text-slate-800">
                  <div className="h-8 w-8 rounded-full flex items-center justify-center text-sm bg-secondary text-white">3</div>
                  Review & Confirm
                </h2>
              </div>
              <div className="p-6">
                <div className="space-y-4 mb-6">
                   {cart.map(item => (
                     <div key={item.id} className="flex justify-between items-center">
                        <div className="flex items-center gap-3">
                           <div className="h-12 w-12 rounded bg-slate-100 border border-slate-200 overflow-hidden">
                              <img src={item.imageUrl} alt="" className="h-full w-full object-cover" />
                           </div>
                           <div>
                              <p className="font-bold text-slate-900 text-sm">{item.title}</p>
                              <p className="text-xs text-slate-500">Qty: {item.quantity}</p>
                           </div>
                        </div>
                        <p className="font-medium text-slate-900">LKR {(item.price * item.quantity).toLocaleString()}</p>
                     </div>
                   ))}
                </div>
                
                {paymentError && (
                  <div className="mb-4 bg-red-50 text-red-600 p-3 rounded-lg flex items-center gap-2 text-sm border border-red-200">
                    <AlertTriangle className="h-4 w-4" />
                    {paymentError}
                  </div>
                )}

                <div className="border-t border-slate-100 pt-4 flex justify-end">
                  <Button 
                    onClick={handleConfirmOrder} 
                    className="w-full md:w-auto px-8 py-3 text-lg"
                    disabled={isProcessing}
                  >
                    {isProcessing ? 'Processing Payment...' : `Pay LKR ${grandTotal.toLocaleString()}`}
                  </Button>
                </div>
              </div>
            </div>
           )}

        </div>

        {/* RIGHT: Summary */}
        <div className="w-full lg:w-96 shrink-0">
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 sticky top-24">
            <h3 className="text-lg font-bold text-slate-900 mb-4">Order Summary</h3>
            
            <div className="space-y-3 mb-6">
              <div className="flex justify-between text-slate-600">
                <span>Subtotal ({cart.reduce((a, b) => a + b.quantity, 0)} items)</span>
                <span>LKR {total.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Delivery Fee</span>
                <span>LKR {shippingCost.toLocaleString()}</span>
              </div>
              <div className="border-t border-slate-100 pt-3 flex justify-between font-bold text-lg text-slate-900">
                <span>Total</span>
                <span>LKR {grandTotal.toLocaleString()}</span>
              </div>
            </div>

            <div className="bg-green-50 text-green-700 text-xs p-3 rounded-lg flex items-start gap-2">
              <CheckCircle className="h-4 w-4 shrink-0 mt-0.5" />
              <p>Your order is eligible for free returns within 7 days if the part doesn't fit.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export const OrderSuccess: React.FC = () => {
  const { lastOrder, setView } = useApp();

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full text-center border border-slate-100 animate-in zoom-in-95 duration-300">
        <div className="h-20 w-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <CheckCircle className="h-10 w-10 text-green-600" />
        </div>
        
        <h1 className="text-2xl font-bold text-slate-900 mb-2">Order Confirmed!</h1>
        <p className="text-slate-500 mb-6">
          Thank you for your purchase. Your order <span className="font-bold text-slate-900">#{lastOrder?.id}</span> has been placed successfully.
        </p>

        <div className="bg-slate-50 rounded-lg p-4 mb-6 text-left">
          <div className="flex justify-between mb-2">
            <span className="text-sm text-slate-500">Amount Paid</span>
            <span className="font-bold text-slate-900">LKR {lastOrder?.totalAmount.toLocaleString()}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-sm text-slate-500">Payment Method</span>
            <span className="font-medium text-slate-900 uppercase">{lastOrder?.paymentMethod}</span>
          </div>
        </div>

        <div className="space-y-3">
          <Button onClick={() => setView('my-purchase')} className="w-full" variant="secondary">
            View My Orders
          </Button>
          <Button onClick={() => setView('marketplace')} className="w-full" variant="outline">
            Continue Shopping
          </Button>
        </div>
      </div>
    </div>
  );
};
