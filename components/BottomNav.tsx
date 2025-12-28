import React from 'react';
import { Home, Grid, Camera, ShoppingCart, Car } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { isNativeApp } from '../utils/platform';

export const BottomNav: React.FC = () => {
    const { view, setView, cart } = useApp();

    const navItems = [
        { id: 'marketplace', icon: Home, label: 'Home' },
        { id: 'categories', icon: Grid, label: 'Categories' },
        { id: 'analyze', icon: Camera, label: 'AI Scan', isPrimary: true },
        { id: 'garage', icon: Car, label: 'My Garage' },
        { id: 'cart', icon: ShoppingCart, label: 'Cart', badge: cart.length },
    ];

    return (
        <div className={`fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 ${isNativeApp() ? 'pb-safe' : 'pb-0'} z-50`}>
            <div className="flex justify-between items-end px-2 py-2">
                {navItems.map((item) => {
                    const isActive = view === item.id;

                    if (item.isPrimary) {
                        return (
                            <button
                                key={item.id}
                                onClick={() => setView(item.id)}
                                className="flex flex-col items-center gap-1 -mt-8"
                            >
                                <div className="h-14 w-14 rounded-full bg-orange-500 flex items-center justify-center shadow-lg border-4 border-slate-50">
                                    <item.icon className="h-6 w-6 text-white" />
                                </div>
                                <span className={`text-[10px] font-medium ${isActive ? 'text-orange-500' : 'text-slate-400'}`}>
                                    {item.label}
                                </span>
                            </button>
                        );
                    }

                    return (
                        <button
                            key={item.id}
                            onClick={() => setView(item.id)}
                            className={`flex flex-col items-center gap-1 flex-1 py-1 ${isActive ? 'text-orange-500' : 'text-slate-400'}`}
                        >
                            <div className="relative">
                                <item.icon className="h-6 w-6" />
                                {item.badge ? (
                                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[9px] font-bold h-4 w-4 flex items-center justify-center rounded-full">
                                        {item.badge}
                                    </span>
                                ) : null}
                            </div>
                            <span className="text-[10px] font-medium">{item.label}</span>
                        </button>
                    );
                })}
            </div>
        </div>
    );
};
