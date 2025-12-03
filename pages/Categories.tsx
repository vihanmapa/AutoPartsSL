import React from 'react';
import { ChevronRight, Disc, Settings, Lightbulb, Wrench, Zap, Wind, Search, Car, Armchair, Circle } from 'lucide-react';

export const Categories: React.FC = () => {
    const categories = [
        { id: 1, name: 'Brake System', count: 145, icon: Disc, color: 'text-red-500' },
        { id: 2, name: 'Engine Parts', count: 289, icon: Settings, color: 'text-slate-500' },
        { id: 3, name: 'Lighting', count: 167, icon: Lightbulb, color: 'text-yellow-500' },
        { id: 4, name: 'Suspension', count: 98, icon: Wrench, color: 'text-slate-400' },
        { id: 5, name: 'Electrical', count: 234, icon: Zap, color: 'text-yellow-400' },
        { id: 6, name: 'Exhaust System', count: 76, icon: Wind, color: 'text-slate-400' },
        { id: 7, name: 'Filters', count: 189, icon: Search, color: 'text-slate-500' },
        { id: 8, name: 'Body Parts', count: 312, icon: Car, color: 'text-red-600' },
        { id: 9, name: 'Interior', count: 156, icon: Armchair, color: 'text-amber-700' },
        { id: 10, name: 'Wheels & Tires', count: 203, icon: Circle, color: 'text-slate-900' },
    ];

    return (
        <div className="bg-white min-h-screen pb-24">
            <div className="divide-y divide-slate-100">
                {categories.map((category) => (
                    <button
                        key={category.id}
                        className="w-full flex items-center justify-between p-4 hover:bg-slate-50 transition-colors"
                    >
                        <div className="flex items-center gap-4">
                            <div className="h-10 w-10 rounded-full bg-slate-50 flex items-center justify-center">
                                <category.icon className={`h-6 w-6 ${category.color}`} />
                            </div>
                            <div className="text-left">
                                <h3 className="font-medium text-slate-900">{category.name}</h3>
                                <p className="text-xs text-slate-500">{category.count} items</p>
                            </div>
                        </div>
                        <ChevronRight className="h-5 w-5 text-slate-300" />
                    </button>
                ))}
            </div>
        </div>
    );
};
