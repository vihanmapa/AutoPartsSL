import React from 'react';
import { Box, ShoppingCart, BarChart2, Store } from 'lucide-react';

interface VendorBottomNavProps {
    activeTab: string;
    onTabChange: (tab: string) => void;
}

export const VendorBottomNav: React.FC<VendorBottomNavProps> = ({ activeTab, onTabChange }) => {
    return (
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 px-6 py-2 md:hidden z-50 pb-safe">
            <div className="flex justify-between items-center">
                <button
                    onClick={() => onTabChange('listings')}
                    className={`flex flex-col items-center gap-1 ${activeTab === 'listings' ? 'text-orange-500' : 'text-slate-400'}`}
                >
                    <Box className="h-6 w-6" />
                    <span className="text-[10px] font-medium">Inventory</span>
                </button>

                <button
                    onClick={() => onTabChange('orders')}
                    className={`flex flex-col items-center gap-1 relative ${activeTab === 'orders' ? 'text-orange-500' : 'text-slate-400'}`}
                >
                    <div className="relative">
                        <ShoppingCart className="h-6 w-6" />
                        <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[8px] font-bold px-1 rounded-full">NEW</span>
                    </div>
                    <span className="text-[10px] font-medium">Orders</span>
                </button>

                <button
                    onClick={() => onTabChange('analytics')}
                    className={`flex flex-col items-center gap-1 ${activeTab === 'analytics' ? 'text-orange-500' : 'text-slate-400'}`}
                >
                    <BarChart2 className="h-6 w-6" />
                    <span className="text-[10px] font-medium">Analytics</span>
                </button>

                <button
                    onClick={() => onTabChange('profile')}
                    className={`flex flex-col items-center gap-1 ${activeTab === 'profile' ? 'text-orange-500' : 'text-slate-400'}`}
                >
                    <Store className="h-6 w-6" />
                    <span className="text-[10px] font-medium">Store</span>
                </button>
            </div>
        </div>
    );
};
