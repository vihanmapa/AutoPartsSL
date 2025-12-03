import React from 'react';
import { Bell, Menu, Search, ShoppingCart, ArrowLeft } from 'lucide-react';
import { useApp } from '../context/AppContext';

export const MobileHeader: React.FC = () => {
    const { view, setView, cart } = useApp();

    if (view === 'marketplace') {
        return (
            <div className="bg-slate-900 text-white p-4 pt-20 sticky top-0 z-40">
                <div className="flex justify-between items-center mb-4">
                    <div className="flex items-center gap-2">
                        <div className="h-8 w-8 bg-orange-500 rounded-lg flex items-center justify-center">
                            <span className="font-bold text-lg">!</span>
                        </div>
                        <div>
                            <h1 className="font-bold text-lg leading-none">AutoPartsSL</h1>
                            <p className="text-[10px] text-slate-400 tracking-wider">SRI LANKA</p>
                        </div>
                    </div>
                    <div className="flex gap-4">
                        <button className="relative">
                            <Bell className="h-6 w-6" />
                            <span className="absolute top-0 right-0 h-2 w-2 bg-red-500 rounded-full border border-slate-900"></span>
                        </button>
                        <button>
                            <Menu className="h-6 w-6" />
                        </button>
                    </div>
                </div>

                <div className="relative">
                    <input
                        type="text"
                        placeholder="Search parts by name..."
                        className="w-full bg-white text-slate-900 rounded-lg pl-10 pr-4 py-2.5 text-base focus:outline-none"
                    />
                    <Search className="absolute left-3 top-2.5 h-5 w-5 text-slate-400" />
                </div>
            </div>
        );
    }

    if (view === 'cart') {
        return (
            <div className="bg-slate-900 text-white p-4 pt-12 sticky top-0 z-40 flex items-center gap-4 shadow-md">
                <button onClick={() => setView('marketplace')} className="p-1 -ml-1 rounded-full hover:bg-slate-800">
                    <ArrowLeft className="h-6 w-6" />
                </button>
                <h1 className="text-lg font-bold">Your Cart</h1>
            </div>
        );
    }

    if (view === 'my-purchase') {
        return (
            <div className="bg-slate-900 text-white p-4 pt-12 sticky top-0 z-40 flex items-center gap-4 shadow-md">
                <button onClick={() => setView('my-account')} className="p-1 -ml-1 rounded-full hover:bg-slate-800">
                    <ArrowLeft className="h-6 w-6" />
                </button>
                <h1 className="text-lg font-bold">My Orders</h1>
            </div>
        );
    }

    if (view === 'analyze') {
        return (
            <div className="bg-slate-900 text-white p-4 pt-12 sticky top-0 z-40 flex items-center gap-4 shadow-md">
                <button onClick={() => setView('marketplace')} className="p-1 -ml-1 rounded-full hover:bg-slate-800">
                    <ArrowLeft className="h-6 w-6" />
                </button>
                <h1 className="text-lg font-bold">AI Damage Assessment</h1>
            </div>
        );
    }

    if (view === 'categories') {
        return (
            <div className="bg-slate-900 text-white p-4 pt-12 sticky top-0 z-40 shadow-md">
                <h1 className="text-lg font-bold">Categories</h1>
            </div>
        );
    }

    if (view === 'my-account') {
        return (
            <div className="bg-slate-900 text-white p-4 pt-12 sticky top-0 z-40 shadow-md">
                <h1 className="text-lg font-bold">Profile</h1>
            </div>
        );
    }

    return null;
};
