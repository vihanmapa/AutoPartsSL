import React from 'react';
import { WizardBrand, WizardModel, WizardYear } from '../../types';

// BRAND STEP
interface BrandStepProps {
    brands: WizardBrand[];
    onSelect: (brand: WizardBrand) => void;
}

export const BrandStep: React.FC<BrandStepProps> = ({ brands, onSelect }) => {
    return (
        <div className="flex gap-4 overflow-x-auto pb-6 px-2 snap-x scrollbar-hide">
            {brands.map((brand) => (
                <button
                    key={brand.id}
                    onClick={() => onSelect(brand)}
                    className="flex-shrink-0 snap-center min-w-[160px] w-[160px] h-[160px] flex flex-col items-center justify-center p-4 bg-white border border-slate-100 rounded-3xl shadow-sm hover:shadow-md hover:border-blue-500 hover:bg-blue-50/30 transition-all duration-200 group"
                >
                    <div className="w-20 h-20 mb-3 flex items-center justify-center p-2 bg-slate-50 rounded-full group-hover:bg-white transition-colors duration-300">
                        <img src={brand.logo} alt={brand.name} className="w-full h-full object-contain transform group-hover:scale-110 transition-transform duration-300" />
                    </div>
                    <span className="font-bold text-slate-900 text-lg">{brand.name}</span>
                </button>
            ))}
            {brands.length === 0 && (
                <div className="w-full text-center py-10 text-slate-400">
                    No brands found matching your search.
                </div>
            )}
        </div>
    );
};

// MODEL STEP
interface ModelStepProps {
    models: WizardModel[];
    onSelect: (model: WizardModel) => void;
}

export const ModelStep: React.FC<ModelStepProps> = ({ models, onSelect }) => {
    return (
        <div className="flex gap-4 overflow-x-auto pb-6 px-2 snap-x scrollbar-hide">
            {models.map((model) => (
                <button
                    key={model.id}
                    onClick={() => onSelect(model)}
                    className="flex-shrink-0 snap-center min-w-[260px] w-[260px] relative group overflow-hidden rounded-3xl bg-white border border-slate-100 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col"
                >
                    {/* Image Section */}
                    <div className="h-40 w-full bg-gradient-to-br from-slate-50 to-slate-100 relative overflow-hidden">
                        <div className="absolute inset-0 bg-blue-500/0 group-hover:bg-blue-500/5 transition-colors z-10" />
                        <img
                            src={model.image}
                            alt={model.name}
                            className="absolute inset-0 w-full h-full object-cover mix-blend-multiply p-4 group-hover:scale-110 transition-transform duration-500"
                        />
                    </div>

                    {/* Content Section */}
                    <div className="p-5 text-left bg-white relative z-20">
                        <div className="flex justify-between items-start mb-2">
                            <h3 className="text-xl font-bold text-slate-900 group-hover:text-blue-600 transition-colors line-clamp-1">{model.name}</h3>
                            <div className="bg-slate-100 text-slate-600 text-[10px] font-bold px-2 py-1 rounded-full uppercase tracking-wider group-hover:bg-blue-100 group-hover:text-blue-700 transition-colors">
                                {model.type}
                            </div>
                        </div>
                        <p className="text-xs font-medium text-slate-400">
                            {model.years[0]?.range || `${model.years.length} Model Years`}
                        </p>
                    </div>
                </button>
            ))}
            {models.length === 0 && (
                <div className="w-full text-center py-10 text-slate-400">
                    No models found matching your search.
                </div>
            )}
        </div>
    );
};

// YEAR STEP
interface YearStepProps {
    years: WizardYear[];
    onSelect: (year: WizardYear) => void;
}

export const YearStep: React.FC<YearStepProps> = ({ years, onSelect }) => {
    return (
        <div className="flex gap-3 overflow-x-auto pb-6 px-2 snap-x scrollbar-hide">
            {years.map((y) => (
                <button
                    key={y.id}
                    onClick={() => onSelect(y)}
                    className="flex-shrink-0 snap-center min-w-[100px] py-4 bg-white border border-slate-200 rounded-2xl text-xl font-bold text-slate-900 hover:bg-blue-600 hover:text-white hover:border-blue-600 hover:shadow-lg transition-all duration-200 transform hover:scale-105"
                >
                    {y.year}
                </button>
            ))}
            {years.length === 0 && (
                <div className="w-full text-center py-10 text-slate-400">
                    No years found matching your search.
                </div>
            )}
        </div>
    );
};
