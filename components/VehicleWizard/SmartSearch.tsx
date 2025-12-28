import React, { useState, useEffect, useRef } from 'react';
import { Search, X, ChevronRight } from 'lucide-react';
import { WizardBrand, WizardModel } from '../../types';

interface SmartSearchProps {
    step: 'BRAND' | 'MODEL' | 'YEAR';
    placeholder: string;
    data: (WizardBrand | WizardModel)[]; // Depends on context
    globalData: WizardBrand[]; // For global "Direct Jump"
    onSearch: (query: string) => void;
    onDirectJump: (brand: WizardBrand, model: WizardModel) => void;
}

export const SmartSearch: React.FC<SmartSearchProps> = ({
    step,
    placeholder,
    data,
    globalData,
    onSearch,
    onDirectJump
}) => {
    const [query, setQuery] = useState('');
    const [isFocused, setIsFocused] = useState(false);
    const [suggestions, setSuggestions] = useState<{ brand: WizardBrand, model: WizardModel }[]>([]);
    const inputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        onSearch(query);

        // Global Direct Jump Logic
        if (step === 'BRAND' && query.length > 1) {
            const results: { brand: WizardBrand, model: WizardModel }[] = [];
            globalData.forEach(brand => {
                brand.models.forEach(model => {
                    if (
                        model.name.toLowerCase().includes(query.toLowerCase()) ||
                        brand.name.toLowerCase().includes(query.toLowerCase())
                    ) {
                        results.push({ brand, model });
                    }
                });
            });
            // Sort results by model name for consistency
            results.sort((a, b) => a.model.name.localeCompare(b.model.name));
            setSuggestions(results.slice(0, 10)); // Limit to 10
        } else {
            setSuggestions([]);
        }
    }, [query, step, globalData, onSearch]);

    const handleClear = () => {
        setQuery('');
        onSearch('');
        inputRef.current?.focus();
    };

    return (
        <div className="relative w-full max-w-2xl mx-auto mb-6 z-50">
            <div className={`relative flex items-center bg-white rounded-2xl border transition-all duration-300 ${isFocused ? 'shadow-lg border-blue-500 ring-4 ring-blue-50' : 'shadow-sm border-slate-200'
                }`}>
                <div className="pl-4 text-slate-400">
                    <Search className="w-5 h-5" />
                </div>
                <input
                    ref={inputRef}
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    onFocus={() => setIsFocused(true)}
                    onBlur={() => setTimeout(() => setIsFocused(false), 200)}
                    placeholder={placeholder}
                    className="w-full py-4 px-3 bg-transparent text-lg text-slate-900 placeholder-slate-400 focus:outline-none rounded-2xl"
                />
                {query && (
                    <button
                        onClick={handleClear}
                        className="pr-4 text-slate-400 hover:text-slate-600 transition-colors"
                    >
                        <X className="w-5 h-5" />
                    </button>
                )}
            </div>

            {/* Direct Jump Suggestions Dropdown */}
            {isFocused && suggestions.length > 0 && query.length > 1 && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl shadow-xl border border-slate-100 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
                    <div className="px-4 py-2 bg-slate-50 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                        Direct Jump
                    </div>
                    {suggestions.map(({ brand, model }) => (
                        <button
                            key={`${brand.id}-${model.id}`}
                            onClick={() => onDirectJump(brand, model)}
                            className="w-full text-left px-4 py-3 flex items-center justify-between hover:bg-blue-50 transition-colors group"
                        >
                            <div className="flex items-center gap-3">
                                <img src={brand.logo} alt={brand.name} className="w-6 h-6 object-contain" />
                                <div>
                                    <span className="font-bold text-slate-900">{brand.name}</span>
                                    <span className="text-slate-600"> {model.name}</span>
                                </div>
                            </div>
                            <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-blue-500" />
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
};
