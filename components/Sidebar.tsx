import React from 'react';
import { X, ChevronRight, Car, Grid, User, LogOut, LogIn, ShoppingBag } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { isNativeApp } from '../utils/platform';

interface SidebarProps {
    isOpen: boolean;
    onClose: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
    const { setView, currentUser, logout, openAuthModal, selectedVehicle, setVehicleSelectorOpen } = useApp();
    const isNative = isNativeApp();

    if (!isOpen) return null;

    const handleNavigation = (view: any) => {
        setView(view);
        onClose();
    };

    const handleVehicleSelect = () => {
        setVehicleSelectorOpen(true);
        onClose();
    };

    return (
        <>
            {/* Backdrop */}
            <div
                className="fixed inset-0 bg-black/50 z-[60] animate-in fade-in duration-200"
                onClick={onClose}
            />

            {/* Sidebar */}
            <div
                className="fixed top-0 left-0 bottom-0 w-[80%] max-w-xs bg-white z-[70] shadow-xl flex flex-col animate-in slide-in-from-left duration-300"
                style={{ paddingTop: 'calc(env(safe-area-inset-top) + 1rem)' }}
            >
                {/* Header */}
                <div className="p-4 border-b border-slate-100 flex justify-between items-center">
                    <div className="flex items-center gap-2 text-slate-900">
                        <Car className="h-6 w-6 text-secondary" />
                        <span className="font-bold text-lg">AutoPartsSL</span>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-slate-50 rounded-full">
                        <X className="h-6 w-6 text-slate-500" />
                    </button>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto py-4">
                    <div className="px-4 mb-6">
                        <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Menu</p>
                        <div className="space-y-1">
                            <button
                                onClick={() => handleNavigation('marketplace')}
                                className="w-full flex items-center gap-3 p-3 hover:bg-slate-50 rounded-lg text-slate-700"
                            >
                                <ShoppingBag className="h-5 w-5" />
                                <span className="font-medium">All Products</span>
                            </button>
                            <button
                                onClick={() => handleNavigation('categories')}
                                className="w-full flex items-center gap-3 p-3 hover:bg-slate-50 rounded-lg text-slate-700"
                            >
                                <Grid className="h-5 w-5" />
                                <span className="font-medium">Categories</span>
                            </button>
                        </div>
                    </div>

                    <div className="px-4 mb-6">
                        <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Vehicle</p>
                        <button
                            onClick={handleVehicleSelect}
                            className="w-full flex items-center justify-between p-3 bg-slate-50 hover:bg-slate-100 rounded-lg border border-slate-200"
                        >
                            <div className="flex items-center gap-3">
                                <Car className="h-5 w-5 text-secondary" />
                                <div className="text-left">
                                    <span className="block font-medium text-slate-900">
                                        {selectedVehicle ? `${selectedVehicle.make} ${selectedVehicle.model}` : 'Select Vehicle'}
                                    </span>
                                    {selectedVehicle && (
                                        <span className="text-xs text-slate-500">{selectedVehicle.year}</span>
                                    )}
                                </div>
                            </div>
                            <ChevronRight className="h-4 w-4 text-slate-400" />
                        </button>
                    </div>

                    <div className="px-4">
                        <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Account</p>
                        <button
                            onClick={() => handleNavigation('my-account')}
                            className="w-full flex items-center gap-3 p-3 hover:bg-slate-50 rounded-lg text-slate-700"
                        >
                            <User className="h-5 w-5" />
                            <span className="font-medium">My Account</span>
                        </button>
                    </div>
                </div>

                {/* Footer */}
                <div className="p-4 border-t border-slate-100">
                    {currentUser && currentUser.id !== 'u1' ? (
                        <button
                            onClick={() => { logout(); onClose(); }}
                            className="w-full flex items-center justify-center gap-2 p-3 text-red-600 hover:bg-red-50 rounded-lg font-medium"
                        >
                            <LogOut className="h-5 w-5" />
                            Log Out
                        </button>
                    ) : (
                        <div className="space-y-3">
                            <button
                                onClick={() => { openAuthModal(); onClose(); }}
                                className="w-full flex items-center justify-center gap-2 p-3 bg-slate-900 text-white hover:bg-slate-800 rounded-lg font-medium"
                            >
                                <LogIn className="h-5 w-5" />
                                Log In
                            </button>
                            <button
                                onClick={() => { setView('vendor-login'); onClose(); }}
                                className="w-full flex items-center justify-center gap-2 p-3 text-slate-600 hover:bg-slate-50 rounded-lg font-medium border border-slate-200"
                            >
                                <Store className="h-5 w-5" />
                                Seller Login
                            </button>
                        </div>
                    )}
                </div >
            </div >
        </>
    );
};
