import React, { useState, useRef, useEffect } from 'react';
import { ShoppingCart, Wrench, LogOut, UserCircle, Search, LogIn, Store } from 'lucide-react';
import { useApp } from '../context/AppContext';

export const Navbar: React.FC = () => {
  const { currentUser, cart, switchUserRole, setView, searchQuery, setSearchQuery, view, logout, openAuthModal, viewVendorStore } = useApp();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const cartCount = cart.reduce((acc, item) => acc + item.quantity, 0);
  const isGuest = currentUser.id === 'u1' && currentUser.role === 'buyer';
  const isBuyer = currentUser.role === 'buyer';

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <nav className="bg-primary text-white shadow-lg sticky top-0 z-50">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between gap-4">
          {/* Logo */}
          <div 
            className="flex items-center gap-2 cursor-pointer" 
            onClick={() => setView('marketplace')}
          >
            <Wrench className="h-8 w-8 text-secondary" />
            <div className="flex flex-col leading-tight">
              <span className="text-xl font-bold tracking-tight">AutoPartsSL</span>
              <span className="text-xs text-gray-400 uppercase tracking-widest">Sri Lanka</span>
            </div>
          </div>

          {/* Search Bar (Only for Marketplace) */}
          {view === 'marketplace' && (
            <div className="hidden md:flex flex-1 max-w-xl mx-4 relative">
              <input
                type="text"
                placeholder="Search parts by name..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 rounded-full bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-secondary border-transparent placeholder:text-slate-500"
              />
              <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-500" />
            </div>
          )}

          {/* Actions */}
          <div className="flex items-center gap-4">
            {isBuyer ? (
              <>
                {/* Cart - Always visible for buyers */}
                <button 
                  onClick={() => setView('cart')}
                  className="relative p-2 hover:bg-slate-800 rounded-full transition-colors"
                >
                  <ShoppingCart className="h-6 w-6" />
                  {cartCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-secondary text-white text-xs font-bold h-5 w-5 flex items-center justify-center rounded-full">
                      {cartCount}
                    </span>
                  )}
                </button>

                {isGuest ? (
                  <>
                    {/* Guest View */}
                    <button
                      onClick={() => setView('vendor-login')}
                      className="hidden md:flex items-center gap-2 text-sm font-medium text-gray-300 hover:text-white mr-2"
                    >
                      Seller Login
                    </button>
                    <button
                      onClick={() => setView('register-vendor')}
                      className="hidden md:flex items-center gap-2 text-sm font-medium text-gray-300 hover:text-white mr-2"
                    >
                      Become a Seller
                    </button>
                    
                    <div className="hidden md:flex items-center gap-2">
                       <button
                        onClick={() => openAuthModal('register')}
                        className="text-sm font-medium text-white hover:text-secondary transition-colors"
                      >
                        Sign Up
                      </button>
                      <div className="h-4 w-px bg-slate-600 mx-1"></div>
                      <button
                        onClick={() => openAuthModal('login')}
                        className="text-sm font-bold text-white hover:text-secondary transition-colors"
                      >
                        Login
                      </button>
                    </div>
                    
                    {/* Mobile specific menu items */}
                    <button
                       onClick={() => switchUserRole('vendor')}
                       className="md:hidden text-gray-400"
                    >
                      <Store className="h-6 w-6" />
                    </button>
                  </>
                ) : (
                  /* Logged In Buyer View with Dropdown */
                  <div className="relative" ref={dropdownRef}>
                    <button 
                      onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                      className="flex items-center gap-3 focus:outline-none group"
                    >
                      <div className="h-9 w-9 rounded-full bg-slate-700 border-2 border-slate-600 flex items-center justify-center text-white font-bold shadow-sm group-hover:border-secondary transition-colors overflow-hidden">
                         {currentUser.name.charAt(0)}
                      </div>
                      <span className="hidden sm:inline font-medium text-sm group-hover:text-gray-200">{currentUser.name}</span>
                    </button>

                    {isDropdownOpen && (
                      <div className="absolute right-0 mt-3 w-56 bg-white rounded-lg shadow-xl py-2 z-50 text-slate-800 animate-in fade-in zoom-in-95 duration-150 origin-top-right">
                        {/* Pointer */}
                        <div className="absolute -top-2 right-3 w-4 h-4 bg-white transform rotate-45"></div>
                        
                        <div className="relative bg-white rounded-lg overflow-hidden">
                          <div className="px-4 py-3 border-b border-slate-100 bg-slate-50">
                             <p className="text-xs text-slate-500 font-medium">Signed in as</p>
                             <p className="text-sm font-bold text-slate-900 truncate">{currentUser.name}</p>
                          </div>

                          <button 
                            className="w-full text-left px-4 py-3 hover:bg-slate-50 font-semibold text-slate-700 text-sm transition-colors"
                            onClick={() => {
                              setView('my-account');
                              setIsDropdownOpen(false);
                            }}
                          >
                            My Account
                          </button>
                          
                          <button 
                            className="w-full text-left px-4 py-3 hover:bg-slate-50 font-bold text-teal-500 text-sm transition-colors"
                            onClick={() => {
                              setView('my-purchase');
                              setIsDropdownOpen(false);
                            }}
                          >
                            My Purchase
                          </button>

                          <div className="border-t border-slate-100 my-1"></div>
                          
                          <button 
                            onClick={() => {
                              setIsDropdownOpen(false);
                              logout();
                            }}
                            className="w-full text-left px-4 py-3 hover:bg-slate-50 font-semibold text-slate-700 text-sm transition-colors"
                          >
                            Logout
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </>
            ) : (
              // Vendor View
              <div className="flex items-center gap-4">
                <button 
                  onClick={() => setView('vendor')}
                  className="flex items-center gap-2 text-secondary font-medium hover:text-white transition-colors"
                >
                  <Store className="h-5 w-5" />
                  <span>{currentUser.name}</span>
                </button>
                <div className="h-4 w-px bg-slate-700 mx-1"></div>
                <button
                  onClick={() => switchUserRole('buyer')}
                  className="flex items-center gap-2 text-sm text-gray-400 hover:text-white"
                >
                  <LogOut className="h-4 w-4" />
                  Exit Vendor Mode
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};