import React from 'react';
import { Bell, Menu, Search, ShoppingCart, ArrowLeft, Car } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { isNativeApp } from '../utils/platform';
import { Sidebar } from './Sidebar';

export const MobileHeader: React.FC = () => {
    const { view, setView, cart } = useApp();
    const isNative = isNativeApp();
    // Use CSS env variables for robust safe area handling on all platforms (PWA, Native, Web)
    const safePaddingStyle = { paddingTop: 'calc(env(safe-area-inset-top) + 1rem)' };

    const [isSidebarOpen, setSidebarOpen] = React.useState(false);

    if (view === 'marketplace') {
        return (
            <>
                <Sidebar isOpen={isSidebarOpen} onClose={() => setSidebarOpen(false)} />
                <div className="bg-slate-900 text-white px-4 pb-4 sticky top-0 z-40" style={safePaddingStyle}>
                    <div className="flex justify-between items-center mb-4">
                        <div className="flex items-center gap-4">
                            <button onClick={() => setSidebarOpen(true)}>
                                <Menu className="h-6 w-6" />
                            </button>
                            <div className="flex items-center gap-2">
                                <Car className="h-8 w-8 text-secondary" />
                                <div>
                                    <h1 className="font-bold text-lg leading-none">AutoPartsSL</h1>
                                    <p className="text-[10px] text-slate-400 tracking-wider">SRI LANKA</p>
                                </div>
                            </div>
                        </div>
                        {/* Right side empty or for other icons if needed, currently requested to remove bell */}
                        <div className="w-6"></div>
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
            </>
        );
    }

    if (view === 'cart') {
        return (
            <div className="bg-slate-900 text-white px-4 pb-4 sticky top-0 z-40 flex items-center gap-4 shadow-md" style={safePaddingStyle}>
                <button onClick={() => setView('marketplace')} className="p-1 -ml-1 rounded-full hover:bg-slate-800">
                    <ArrowLeft className="h-6 w-6" />
                </button>
                <h1 className="text-lg font-bold">Your Cart</h1>
            </div>
        );
    }

    if (view === 'my-purchase') {
        return (
            <div className="bg-slate-900 text-white px-4 pb-4 sticky top-0 z-40 flex items-center gap-4 shadow-md" style={safePaddingStyle}>
                <button onClick={() => setView('my-account')} className="p-1 -ml-1 rounded-full hover:bg-slate-800">
                    <ArrowLeft className="h-6 w-6" />
                </button>
                <h1 className="text-lg font-bold">My Orders</h1>
            </div>
        );
    }

    if (view === 'analyze') {
        return (
            <div className="bg-slate-900 text-white px-4 pb-4 sticky top-0 z-40 flex items-center gap-4 shadow-md" style={safePaddingStyle}>
                <button onClick={() => setView('marketplace')} className="p-1 -ml-1 rounded-full hover:bg-slate-800">
                    <ArrowLeft className="h-6 w-6" />
                </button>
                <h1 className="text-lg font-bold">AI Damage Assessment</h1>
            </div>
        );
    }

    if (view === 'categories') {
        return (
            <div className="bg-slate-900 text-white px-4 pb-4 sticky top-0 z-40 shadow-md" style={safePaddingStyle}>
                <h1 className="text-lg font-bold">Categories</h1>
            </div>
        );
    }

    if (view === 'my-account') {
        return (
            <div className="bg-slate-900 text-white px-4 pb-4 sticky top-0 z-40 shadow-md" style={safePaddingStyle}>
                <h1 className="text-lg font-bold">Profile</h1>
            </div>
        );
    }

    return null;
};
