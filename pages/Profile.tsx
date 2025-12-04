import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Package, Heart, User, Settings, HelpCircle, ChevronRight, LogOut } from 'lucide-react';
import { Button } from '../components/ui/Button';

export const Profile: React.FC = () => {
    const { currentUser, setView, logout } = useApp();

    const menuItems = [
        { icon: Package, label: 'My Orders', badge: 3, action: () => setView('my-purchase') },
        { icon: Heart, label: 'Wishlist', badge: 12, action: () => { } },
        { icon: User, label: 'Account Details', action: () => setView('my-account') },
        { icon: Settings, label: 'Settings', action: () => { } },
        { icon: HelpCircle, label: 'Help & Support', action: () => { } },
    ];

    return (
        <div className="bg-slate-50 min-h-screen pb-32 px-4 pt-4">
            {/* Profile Card */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 mb-4 text-center">
                <div className="h-20 w-20 bg-orange-500 rounded-full flex items-center justify-center text-white text-3xl font-bold mx-auto mb-3">
                    {currentUser?.name ? currentUser.name.charAt(0) : 'U'}
                </div>
                <h2 className="text-lg font-bold text-slate-900">{currentUser?.name || 'Guest User'}</h2>
                <p className="text-sm text-slate-500">{currentUser?.email || 'Sign in to view profile'}</p>

                <div className="grid grid-cols-3 gap-4 mt-6 border-t border-slate-100 pt-6">
                    <div className="text-center">
                        <h3 className="font-bold text-slate-900">23</h3>
                        <p className="text-xs text-slate-500">Orders</p>
                    </div>
                    <div className="text-center border-l border-r border-slate-100">
                        <h3 className="font-bold text-slate-900">12</h3>
                        <p className="text-xs text-slate-500">Wishlist</p>
                    </div>
                    <div className="text-center">
                        <h3 className="font-bold text-slate-900">5</h3>
                        <p className="text-xs text-slate-500">Reviews</p>
                    </div>
                </div>
            </div>

            {/* Menu Items */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden mb-4">
                <div className="divide-y divide-slate-100">
                    {menuItems.map((item, index) => (
                        <button
                            key={index}
                            onClick={item.action}
                            className="w-full flex items-center justify-between p-4 hover:bg-slate-50 transition-colors"
                        >
                            <div className="flex items-center gap-3">
                                <item.icon className="h-5 w-5 text-slate-500" />
                                <span className="text-sm font-medium text-slate-700">{item.label}</span>
                            </div>
                            <div className="flex items-center gap-2">
                                {item.badge && (
                                    <span className="bg-orange-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">
                                        {item.badge}
                                    </span>
                                )}
                                <ChevronRight className="h-4 w-4 text-slate-300" />
                            </div>
                        </button>
                    ))}
                </div>
            </div>

            {/* Seller Banner */}
            <div className="bg-orange-500 rounded-2xl p-6 text-white mb-4">
                <h3 className="font-bold text-lg mb-1">Become a Seller</h3>
                <p className="text-orange-100 text-sm mb-4">Start selling auto parts and grow your business</p>
                <button
                    onClick={() => setView('vendor-login')}
                    className="bg-white text-orange-600 px-4 py-2 rounded-lg text-sm font-bold"
                >
                    Learn More
                </button>
            </div>

            {/* Logout */}
            <button
                onClick={logout}
                className="w-full bg-white border border-red-100 text-red-500 font-medium py-3 rounded-xl flex items-center justify-center gap-2 hover:bg-red-50 transition-colors"
            >
                <LogOut className="h-5 w-5" /> Logout
            </button>
        </div>
    );
};
