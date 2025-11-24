
import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { Address, PaymentMethod } from '../types';
import { Button } from '../components/ui/Button';
import { ArrowLeft, MapPin, CreditCard, Truck, CheckCircle, Wallet } from 'lucide-react';

export const Checkout: React.FC = () => {
  const { cart, currentUser, placeOrder, setView, openAuthModal } = useApp();
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
    }
  }, [currentUser, openAuthModal]);

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
  };

  const handleNextStep = () => {
    if (step === 1) {
      // Basic validation
      if (!address.addressLine1 || !address.city || !address.phone) {
        alert("Please fill in all required address fields.");
        return;
      }
      setStep(2);
    } else if (step === 2) {
      setStep(3);
    }
  };

  const handleConfirmOrder = () => {
    setIsProcessing(true);
    setTimeout(() => {
      placeOrder(address, paymentMethod);
      setIsProcessing(false);
    }, 2000);
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
                  <label className={`flex items-center p-4 border rounded-lg cursor-pointer transition-all ${paymentMethod === 'card' ? 'border-secondary bg-orange-50' : 'border-slate-200 hover:bg-slate-50'}`}>
                    <input 
                      type="radio" 
                      name="payment" 
                      checked={paymentMethod === 'card'} 
                      onChange={() => setPaymentMethod('card')}
                      className="h-4 w-4 text-secondary focus:ring-secondary" 
                    />
                    <div className="ml-3 flex items-center gap-3 flex-1">
                      <CreditCard className="h-5 w-5 text-slate-600" />
                      <span className="font-medium text-slate-900">Credit / Debit Card</span>
                    </div>
                    <div className="flex gap-2">
                       <div className="h-6 w-10 bg-slate-200 rounded"></div>
                       <div className="h-6 w-10 bg-slate-200 rounded"></div>
                    </div>
                  </label>

                  <label className={`flex items-center p-4 border rounded-lg cursor-pointer transition-all ${paymentMethod === 'cod' ? 'border-secondary bg-orange-50' : 'border-slate-200 hover:bg-slate-50'}`}>
                    <input 
                      type="radio" 
                      name="payment" 
                      checked={paymentMethod === 'cod'} 
                      onChange={() => setPaymentMethod('cod')}
                      className="h-4 w-4 text-secondary focus:ring-secondary" 
                    />
                    <div className="ml-3 flex items-center gap-3 flex-1">
                      <Truck className="h-5 w-5 text-slate-600" />
                      <span className="font-medium text-slate-900">Cash On Delivery</span>
                    </div>
                  </label>

                  <label className={`flex items-center p-4 border rounded-lg cursor-pointer transition-all ${paymentMethod === 'koko' ? 'border-secondary bg-orange-50' : 'border-slate-200 hover:bg-slate-50'}`}>
                    <input 
                      type="radio" 
                      name="payment" 
                      checked={paymentMethod === 'koko'} 
                      onChange={() => setPaymentMethod('koko')}
                      className="h-4 w-4 text-secondary focus:ring-secondary" 
                    />
                    <div className="ml-3 flex items-center gap-3 flex-1">
                      <Wallet className="h-5 w-5 text-slate-600" />
                      <span className="font-medium text-slate-900">Koko - Pay in 3</span>
                    </div>
                    <span className="text-xs bg-slate-100 px-2 py-1 rounded">Bnpl</span>
                  </label>
                </div>

                {paymentMethod === 'card' && (
                  <div className="mt-6 p-4 bg-slate-50 rounded-lg border border-slate-200 animate-in fade-in">
                    <div className="space-y-3">
                      <input type="text" placeholder="Card Number" className="w-full p-3 border border-slate-300 rounded bg-white" />
                      <div className="grid grid-cols-2 gap-3">
                        <input type="text" placeholder="MM/YY" className="w-full p-3 border border-slate-300 rounded bg-white" />
                        <input type="text" placeholder="CVC" className="w-full p-3 border border-slate-300 rounded bg-white" />
                      </div>
                    </div>
                  </div>
                )}

                <div className="mt-6 flex justify-end gap-3">
                  <Button variant="outline" onClick={() => setStep(1)}>Back</Button>
                  <Button onClick={handleNextStep} className="px-8">Review Order</Button>
                </div>
              </div>
            ) : step === 3 ? (
               <div className="p-6 bg-slate-50/50 text-sm text-slate-600">
                 {paymentMethod === 'cod' && <span className="flex items-center gap-2"><Truck className="h-4 w-4"/> Cash On Delivery</span>}
                 {paymentMethod === 'card' && <span className="flex items-center gap-2"><CreditCard className="h-4 w-4"/> Visa ending in 4242</span>}
                 {paymentMethod === 'koko' && <span className="flex items-center gap-2"><Wallet className="h-4 w-4"/> Koko PayLater</span>}
               </div>
            ) : null}
          </div>

          {/* STEP 3: Review Items */}
          {step === 3 && (
             <div className="bg-white rounded-xl shadow-sm border border-secondary ring-1 ring-secondary transition-all duration-300 overflow-hidden mb-6 animate-in slide-in-from-top-2">
               <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50">
                  <h2 className="text-lg font-bold flex items-center gap-3 text-slate-800">
                    <div className="h-8 w-8 rounded-full flex items-center justify-center text-sm bg-secondary text-white">3</div>
                    Order Summary
                  </h2>
               </div>
               <div className="divide-y divide-slate-100">
                 {cart.map(item => (
                   <div key={item.id} className="p-4 flex gap-4">
                     <img src={item.imageUrl} className="h-16 w-16 object-cover rounded bg-slate-100" alt="" />
                     <div className="flex-1">
                       <h4 className="font-medium text-slate-900">{item.title}</h4>
                       <p className="text-sm text-slate-500">Qty: {item.quantity}</p>
                     </div>
                     <div className="font-bold text-slate-800">LKR {(item.price * item.quantity).toLocaleString()}</div>
                   </div>
                 ))}
               </div>
             </div>
          )}

        </div>

        {/* RIGHT: Summary Sidebar */}
        <div className="w-full lg:w-96 shrink-0">
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 sticky top-24">
            <h3 className="font-bold text-lg text-slate-800 mb-4">Total Summary</h3>
            
            <div className="space-y-3 text-sm text-slate-600 mb-6 border-b border-slate-100 pb-6">
              <div className="flex justify-between">
                <span>Subtotal ({cart.reduce((a,c) => a+c.quantity,0)} items)</span>
                <span>LKR {total.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span>Delivery Fee</span>
                <span>LKR {shippingCost.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-green-600">
                <span>Discount</span>
                <span>- LKR 0</span>
              </div>
            </div>

            <div className="flex justify-between items-end mb-6">
              <span className="font-bold text-slate-800">Total Payable</span>
              <span className="font-bold text-2xl text-secondary">LKR {grandTotal.toLocaleString()}</span>
            </div>

            {step === 3 ? (
              <Button 
                onClick={handleConfirmOrder} 
                className="w-full py-4 text-lg" 
                disabled={isProcessing}
              >
                {isProcessing ? 'Processing...' : 'Place Order'}
              </Button>
            ) : (
              <div className="bg-slate-50 p-3 rounded text-xs text-center text-slate-500">
                Complete steps to place order
              </div>
            )}

            <div className="mt-4 flex items-center justify-center gap-2 text-xs text-slate-400">
              <CheckCircle className="h-3 w-3" /> Secure Checkout
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export const OrderSuccess: React.FC = () => {
  const { lastOrder, setView } = useApp();

  if (!lastOrder) return null;

  return (
    <div className="container mx-auto px-4 py-16 max-w-2xl text-center animate-in zoom-in-95">
      <div className="h-24 w-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
        <CheckCircle className="h-12 w-12 text-green-600" />
      </div>
      <h1 className="text-3xl font-bold text-slate-900 mb-2">Order Placed Successfully!</h1>
      <p className="text-slate-500 mb-8">Thank you for shopping with AutoPartsSL. Your order has been confirmed.</p>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 text-left mb-8">
        <div className="flex justify-between mb-4 pb-4 border-b border-slate-100">
           <span className="text-slate-500">Order Number</span>
           <span className="font-bold text-slate-900">{lastOrder.id}</span>
        </div>
        <div className="flex justify-between mb-4 pb-4 border-b border-slate-100">
           <span className="text-slate-500">Date</span>
           <span className="font-bold text-slate-900">{new Date(lastOrder.date).toLocaleDateString()}</span>
        </div>
        <div className="flex justify-between mb-4 pb-4 border-b border-slate-100">
           <span className="text-slate-500">Payment Method</span>
           <span className="font-bold text-slate-900 uppercase">{lastOrder.paymentMethod}</span>
        </div>
        <div className="flex justify-between">
           <span className="text-slate-500">Total Amount</span>
           <span className="font-bold text-xl text-secondary">LKR {lastOrder.totalAmount.toLocaleString()}</span>
        </div>
      </div>

      <div className="flex gap-4 justify-center">
        <Button onClick={() => setView('marketplace')} variant="outline">Continue Shopping</Button>
        <Button onClick={() => setView('my-purchase')}>View My Orders</Button>
      </div>
    </div>
  );
};
