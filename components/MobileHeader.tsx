import React from 'react';
import { Bell, Menu, Search, ShoppingCart, ArrowLeft, Car, User } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { isNativeApp } from '../utils/platform';
import { Sidebar } from './Sidebar';

export const MobileHeader: React.FC = () => {
    const { view, setView, cart } = useApp();
    const isNative = isNativeApp();
    // Use CSS env variables for robust safe area handling on all platforms (PWA, Native, Web)
    const safePaddingStyle = { paddingTop: 'calc(env(safe-area-inset-top) + 1rem)' };

    const [isSidebarOpen, setSidebarOpen] = React.useState(false);

    // Common Branded Header Component
    const BrandedHeader = ({ showSearch = false }) => (
        <div className="bg-slate-900 text-white px-4 pb-4 sticky top-0 z-40" style={safePaddingStyle}>
            <div className={`flex justify-between items-center ${showSearch ? 'mb-4' : ''}`}>
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
                {/* Right side for User Profile */}
                <button onClick={() => setView('my-account')} className="p-2 -mr-2 text-slate-300 hover:text-white">
                    <User className="h-6 w-6" />
                </button>
            </div>

            {showSearch && (
                <div className="relative">
                    <input
                        type="text"
                        placeholder="Search parts by name..."
                        className="w-full bg-white text-slate-900 rounded-lg pl-10 pr-4 py-2.5 text-base focus:outline-none"
                    />
                    <Search className="absolute left-3 top-2.5 h-5 w-5 text-slate-400" />
                </div>
            )}
        </div>
    );

    // Apply strict consistency for main tab views
    if (['marketplace', 'categories', 'garage', 'my-account', 'cart', 'analyze'].includes(view)) {
        return (
            <>
                <Sidebar isOpen={isSidebarOpen} onClose={() => setSidebarOpen(false)} />
                <BrandedHeader showSearch={view === 'marketplace'} />
            </>
        );
    }

    if (view === 'contact-us') {
        return (
            <header className="bg-white border-b border-slate-200 sticky top-0 z-40">
                <div className="flex items-center h-14 px-4">
                    <button onClick={() => setView('my-account')} className="p-2 -ml-2 mr-2">
                        <ArrowLeft className="h-6 w-6 text-slate-700" />
                    </button>
                    <h1 className="text-lg font-bold text-slate-900">Contact Us</h1>
                </div>
            </header>
        );
    }

    if (view === 'faq') {
        return (
            <header className="bg-white border-b border-slate-200 sticky top-0 z-40">
                <div className="flex items-center h-14 px-4">
                    <button onClick={() => setView('my-account')} className="p-2 -ml-2 mr-2">
                        <ArrowLeft className="h-6 w-6 text-slate-700" />
                    </button>
                    <h1 className="text-lg font-bold text-slate-900">FAQ & Support</h1>
                </div>
            </header>
        );
    }

    if (view === 'privacy-policy') {
        return (
            <header className="bg-white border-b border-slate-200 sticky top-0 z-40">
                <div className="flex items-center h-14 px-4">
                    <button onClick={() => setView('my-account')} className="p-2 -ml-2 mr-2">
                        <ArrowLeft className="h-6 w-6 text-slate-700" />
                    </button>
                    <h1 className="text-lg font-bold text-slate-900">Privacy Policy</h1>
                </div>
            </header>
        );
    }

    if (view === 'terms') {
        return (
            <header className="bg-white border-b border-slate-200 sticky top-0 z-40">
                <div className="flex items-center h-14 px-4">
                    <button onClick={() => setView('my-account')} className="p-2 -ml-2 mr-2">
                        <ArrowLeft className="h-6 w-6 text-slate-700" />
                    </button>
                    <h1 className="text-lg font-bold text-slate-900">Terms of Service</h1>
                </div>
            </header>
        );
    }

    if (view === 'feedback') {
        return (
            <header className="bg-white border-b border-slate-200 sticky top-0 z-40">
                <div className="flex items-center h-14 px-4">
                    <button onClick={() => setView('my-account')} className="p-2 -ml-2 mr-2">
                        <ArrowLeft className="h-6 w-6 text-slate-700" />
                    </button>
                    <h1 className="text-lg font-bold text-slate-900">Feedback</h1>
                </div>
            </header>
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



    if (view === 'profile-details') {
        return (
            <div className="bg-slate-900 text-white px-4 pb-4 sticky top-0 z-40 flex items-center gap-4 shadow-md" style={safePaddingStyle}>
                <button onClick={() => setView('my-account')} className="p-1 -ml-1 rounded-full hover:bg-slate-800">
                    <ArrowLeft className="h-6 w-6" />
                </button>
                <h1 className="text-lg font-bold">Profile</h1>
            </div>
        );
    }

    return null;
};
