import React, { useState } from 'react';
import { Edit2, Search, Zap, Droplet, Disc, Cog, Wrench, ChevronRight, Settings, Lightbulb, Wind, Car, Armchair, Circle, HelpCircle } from 'lucide-react';
import { WizardBrand, WizardModel, WizardYear } from '../../types';
import { useApp } from '../../context/AppContext';

interface PartsDashboardProps {
    brand: WizardBrand;
    model: WizardModel;
    year: WizardYear;
    onReset: () => void;
}

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

export const PartsDashboard: React.FC<PartsDashboardProps> = ({ brand, model, year, onReset }) => {
    const { setView, setSelectedCategory, categories } = useApp();
    const [searchQuery, setSearchQuery] = useState('');

    return (
        <div className="animate-in slide-in-from-bottom duration-500 fade-in">
            {/* Vehicle Summary Bar */}
            <button
                onClick={onReset}
                className="w-full bg-slate-900 hover:bg-slate-800 text-white p-4 rounded-xl flex items-center justify-between group transition-all shadow-lg mb-6"
            >
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-white rounded-lg flex items-center justify-center p-2">
                        <img src={brand.logo} alt={brand.name} className="w-full h-full object-contain" />
                    </div>
                    <div className="text-left">
                        <h2 className="font-bold text-lg leading-tight">{brand.name} {model.name}</h2>
                        <p className="text-slate-400 text-sm">{year.year} • {model.type}</p>
                    </div>
                </div>
                <div className="bg-slate-700/50 p-2 rounded-full group-hover:bg-blue-600 transition-colors">
                    <Edit2 className="w-4 h-4" />
                </div>
            </button>

            {/* Contextual Search */}
            <div className="relative mb-8">
                <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder={`Search parts for ${model.name}...`}
                    className="w-full bg-white border border-slate-200 rounded-xl py-3 pl-12 pr-4 shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                />
                <Search className="absolute left-4 top-3.5 w-5 h-5 text-slate-400" />
            </div>

            {/* Categories */}
            <div>
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wider">Categories</h3>
                    <button
                        onClick={() => setView('categories')}
                        className="text-xs font-semibold text-blue-600 flex items-center hover:underline"
                    >
                        See All <ChevronRight className="h-3 w-3 ml-1" />
                    </button>
                </div>
                <div className="grid grid-cols-3 gap-3">
                    {categories.filter(c => !c.parentId).slice(0, 6).map((cat) => {
                        const IconComponent = iconMap[cat.icon] || Cog; // Default to Cog if missing
                        return (
                            <button
                                key={cat.id}
                                onClick={() => {
                                    setSelectedCategory(cat.name);
                                    setView('marketplace');
                                }}
                                className={`flex flex-col items-center justify-center p-4 rounded-xl border border-transparent hover:border-slate-200 hover:shadow-md transition-all ${cat.color.replace('text-', 'bg-').replace('500', '50')} bg-opacity-50`}
                            >
                                <IconComponent className={`w-6 h-6 mb-2 ${cat.color}`} />
                                <span className="text-xs font-bold text-slate-700 text-center">{cat.name}</span>
                            </button>
                        );
                    })}
                </div>
            </div>

            <div className="mt-8 p-4 bg-blue-50 rounded-xl border border-blue-100">
                <p className="text-center text-blue-700 text-sm font-medium">
                    Browsing parts specifically fit for your <strong>{year.year} {brand.name} {model.name}</strong>.
                </p>
            </div>
        </div>
    );
};
