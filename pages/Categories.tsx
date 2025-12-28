import React from 'react';
import { ChevronRight, Disc, Settings, Lightbulb, Wrench, Zap, Wind, Search, Car, Armchair, Circle, HelpCircle } from 'lucide-react';
import { useApp } from '../context/AppContext';

const iconMap: { [key: string]: React.ElementType } = {
    'Disc': Disc,
    'Settings': Settings,
    'Lightbulb': Lightbulb,
    'Wrench': Wrench,
    'Zap': Zap,
    'Wind': Wind,
    'Search': Search,
    'Car': Car,
    'Armchair': Armchair,
    'Circle': Circle
};

export const Categories: React.FC = () => {
    const { categories, setView, setSelectedCategory, products, selectedVehicle } = useApp();

    return (
        <div className="bg-white min-h-screen pb-24">
            <div className="divide-y divide-slate-100">
                {categories.length === 0 ? (
                    <div className="p-8 text-center text-slate-500">
                        <p>Loading categories...</p>
                    </div>
                ) : (
                    categories
                        .filter(c => !c.parentId)
                        .map((category) => {
                            const IconComponent = iconMap[category.icon] || HelpCircle;

                            return (
                                <button
                                    key={category.id}
                                    onClick={() => {
                                        setSelectedCategory(category.name);
                                        setView('marketplace');
                                    }}
                                    className="w-full flex items-center justify-between p-4 hover:bg-slate-50 transition-colors"
                                >
                                    <div className="flex items-center gap-4">
                                        <div className="h-10 w-10 rounded-full bg-slate-50 flex items-center justify-center">
                                            <IconComponent className={`h-6 w-6 ${category.color}`} />
                                        </div>
                                        <div className="text-left">
                                            <h3 className="font-medium text-slate-900">{category.name}</h3>
                                            <p className="text-xs text-slate-500">
                                                {products.filter(p => {
                                                    if (p.category !== category.name) return false;
                                                    if (selectedVehicle) {
                                                        if (!p.compatibleVehicles) return false;
                                                        return p.compatibleVehicles.some(cv =>
                                                            cv.make.toLowerCase() === selectedVehicle.make.toLowerCase() &&
                                                            cv.model.toLowerCase() === selectedVehicle.model.toLowerCase() &&
                                                            (selectedVehicle.year ? cv.year === selectedVehicle.year : true)
                                                        );
                                                    }
                                                    return true;
                                                }).length} items
                                            </p>
                                        </div>
                                    </div>
                                    <ChevronRight className="h-5 w-5 text-slate-300" />
                                </button>
                            );
                        })
                )}
            </div>
        </div>
    );
};
