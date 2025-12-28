import React, { useState, useMemo } from 'react';
import { transformVehiclesToWizardData } from '../../services/vehicleTransformer';

import { WizardBrand, WizardModel, WizardYear } from '../../types';
import { SmartSearch } from './SmartSearch';
import { BrandStep, ModelStep, YearStep } from './StepViews';
import { SelectionCarousel } from './SelectionCarousel';
import { PartsDashboard } from './PartsDashboard';
import { ChevronRight, RotateCcw } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const VehicleWizard: React.FC = () => {
    const { setSelectedVehicle, selectedVehicle, vehicles, setVehicleSelectorOpen, vehicleSelectorMode, addToGarage } = useApp();

    // Internal Wizard State
    const [step, setStep] = useState<'BRAND' | 'MODEL' | 'YEAR' | 'DASHBOARD'>('BRAND');
    const [selectedBrand, setSelectedBrand] = useState<WizardBrand | null>(null);
    const [selectedModel, setSelectedModel] = useState<WizardModel | null>(null);
    const [selectedYear, setSelectedYear] = useState<WizardYear | null>(null);
    const [filterQuery, setFilterQuery] = useState('');

    // VIN State
    const [vinMode, setVinMode] = useState(false);
    const [vin, setVin] = useState('');
    const [isDecoding, setIsDecoding] = useState(false);
    const [decodingError, setDecodingError] = useState('');
    const [decodedVehicle, setDecodedVehicle] = useState<{ id: string, make: string, model: string, year: number, bodyType: any } | null>(null);

    const hierarchy = useMemo(() => {
        if (vehicles.length === 0) return [];
        return transformVehiclesToWizardData(vehicles);
    }, [vehicles]);

    // Sync internal state with global selectedVehicle on mount/update
    React.useEffect(() => {
        if (selectedVehicle && hierarchy.length > 0 && step === 'BRAND' && !vinMode) {
            const brand = hierarchy.find(b => b.name === selectedVehicle.make);
            if (!brand) return;

            const model = brand.models.find(m => m.name === selectedVehicle.model);
            if (!model) return;

            const yearObj = model.years.find(y => y.year === selectedVehicle.year);
            if (!yearObj) return;

            setSelectedBrand(brand);
            setSelectedModel(model);
            setSelectedYear(yearObj);
            setStep('DASHBOARD');
        }
    }, [selectedVehicle, hierarchy, step]);

    // Derived Data for Current View
    const filteredBrands = useMemo(() => {
        if (!filterQuery) return hierarchy;
        return hierarchy.filter(b => b.name.toLowerCase().includes(filterQuery.toLowerCase()));
    }, [hierarchy, filterQuery]);

    const filteredModels = useMemo(() => {
        if (!selectedBrand) return [];
        if (!filterQuery) return selectedBrand.models;
        return selectedBrand.models.filter(m => m.name.toLowerCase().includes(filterQuery.toLowerCase()));
    }, [selectedBrand, filterQuery]);

    const filteredYears = useMemo(() => {
        if (!selectedModel) return [];
        if (!filterQuery) return selectedModel.years;
        // Years are numbers/strings, simple includes check
        return selectedModel.years.filter(y => y.year.toString().includes(filterQuery));
    }, [selectedModel, filterQuery]);

    // Handlers
    const handleBrandSelect = (brand: WizardBrand) => {
        setSelectedBrand(brand);
        setStep('MODEL');
        setFilterQuery('');
    };

    const handleModelSelect = (model: WizardModel) => {
        setSelectedModel(model);
        setStep('YEAR');
        setFilterQuery('');
    };

    const handleYearSelect = (year: WizardYear) => {
        setSelectedYear(year);
        setStep('DASHBOARD');
        setFilterQuery('');

        // Sync with Global App Context
        if (selectedBrand && selectedModel) {
            const vehicleData = {
                id: `${selectedBrand.id}-${selectedModel.id}-${year.id}`,
                make: selectedBrand.name,
                model: selectedModel.name,
                year: year.year,
                bodyType: selectedModel.type as any
            };

            if (vehicleSelectorMode === 'add-to-garage') {
                addToGarage(vehicleData);
            } else {
                setSelectedVehicle(vehicleData);
            }
            // Close the wizard modal if open
            setVehicleSelectorOpen(false);
        }
    };

    const handleDirectJump = (brand: WizardBrand, model: WizardModel) => {
        setSelectedBrand(brand);
        setSelectedModel(model);
        setStep('YEAR');
        setFilterQuery('');
    };

    const handleReset = () => {
        setStep('BRAND');
        setSelectedBrand(null);
        setSelectedModel(null);
        setSelectedYear(null);
        setSelectedVehicle(null);
        setVinMode(false);
        setVin('');
        setDecodingError('');
        setDecodedVehicle(null);
    };

    const goBackToBrand = () => {
        setStep('BRAND');
        setSelectedModel(null);
        setSelectedYear(null);
    };

    const goBackToModel = () => {
        setStep('MODEL');
        setSelectedYear(null);
    };

    // VIN Handlers
    const handleVinSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsDecoding(true);
        setDecodingError('');

        try {
            // Dynamic import to avoid circular dep issues if any, or just clean separation
            const { decodeVIN } = await import('../../services/vinDecoder');
            const result = await decodeVIN(vin);

            if (result) {
                const vehicleData = {
                    id: `vin-${vin}`, // Unique ID for VIN added vehicles
                    make: result.make,
                    model: result.model,
                    year: result.year,
                    bodyType: result.bodyType as any
                };
                setDecodedVehicle(vehicleData);
            } else {
                setDecodingError('Could not decode this VIN. Please try standard selection.');
            }
        } catch (error) {
            setDecodingError('Error decoding VIN.');
        } finally {
            setIsDecoding(false);
        }
    };

    const confirmVehicleAddition = () => {
        if (!decodedVehicle) return;

        if (vehicleSelectorMode === 'add-to-garage') {
            addToGarage(decodedVehicle);
        } else {
            setSelectedVehicle(decodedVehicle);
        }
        setVehicleSelectorOpen(false);
    };

    // Determine Step Index for Carousel
    const getStepIndex = () => {
        switch (step) {
            case 'BRAND': return 0;
            case 'MODEL': return 1;
            case 'YEAR': return 2;
            case 'DASHBOARD': return 3; // Though dashboard replaces content usually
            default: return 0;
        }
    };

    // If Dashboard, show pure dashboard
    if (step === 'DASHBOARD' && selectedBrand && selectedModel && selectedYear) {
        return (
            <div className="bg-white rounded-3xl shadow-xl p-6 max-w-4xl mx-auto my-8 border border-slate-100">
                <PartsDashboard
                    brand={selectedBrand}
                    model={selectedModel}
                    year={selectedYear}
                    onReset={handleReset}
                />
            </div>
        );
    }

    return (
        <div className="bg-white rounded-3xl shadow-xl p-6 pb-12 max-w-4xl mx-auto my-8 border border-slate-100 overflow-hidden relative min-h-[600px] flex flex-col">

            {/* Header / Breadcrumbs */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 px-2">
                <div className="flex items-center gap-2">
                    <h1 className="text-2xl font-black text-slate-900 tracking-tight">Select Vehicle</h1>

                    {!vinMode && selectedBrand && (
                        <div className="flex items-center gap-2 ml-4 animate-in fade-in slide-in-from-left">
                            <ChevronRight className="w-5 h-5 text-slate-300" />
                            <button
                                onClick={goBackToBrand}
                                className="flex items-center gap-2 bg-slate-50 hover:bg-slate-100 px-3 py-1.5 rounded-full transition-colors"
                            >
                                <img src={selectedBrand.logo} className="w-5 h-5 object-contain" alt="" />
                                <span className="font-bold text-sm text-slate-700">{selectedBrand.name}</span>
                            </button>
                        </div>
                    )}

                    {!vinMode && selectedModel && (
                        <div className="flex items-center gap-2 ml-1 animate-in fade-in slide-in-from-left">
                            <ChevronRight className="w-5 h-5 text-slate-300" />
                            <button
                                onClick={goBackToModel}
                                className="flex items-center gap-2 bg-slate-50 hover:bg-slate-100 px-3 py-1.5 rounded-full transition-colors"
                            >
                                <span className="font-bold text-sm text-slate-700">{selectedModel.name}</span>
                            </button>
                        </div>
                    )}
                </div>

                {/* Toggle Mode */}
                <div className="bg-slate-100 p-1 rounded-xl flex items-center self-start md:self-auto">
                    <button
                        onClick={() => setVinMode(false)}
                        className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${!vinMode ? 'bg-white shadow-sm text-slate-900' : 'text-slate-500 hover:text-slate-900'}`}
                    >
                        By Model
                    </button>
                    <button
                        onClick={() => setVinMode(true)}
                        className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${vinMode ? 'bg-white shadow-sm text-slate-900' : 'text-slate-500 hover:text-slate-900'}`}
                    >
                        By VIN
                    </button>
                </div>
            </div>

            {vinMode ? (
                <div className="flex-1 flex flex-col items-center justify-center p-8 animate-in fade-in slide-in-from-bottom-4 duration-300">
                    <div className="w-full max-w-md text-center">
                        <div className="h-16 w-16 bg-blue-50 rounded-2xl flex items-center justify-center mx-auto mb-6 text-2xl">
                            📝
                        </div>
                        <h2 className="text-xl font-bold text-slate-900 mb-2">Enter Vehicle VIN</h2>
                        <p className="text-slate-500 mb-8">We'll decode your VIN to identify your exact vehicle configuration.</p>

                        {!decodedVehicle ? (
                            <form onSubmit={handleVinSubmit}>
                                <input
                                    type="text"
                                    value={vin}
                                    onChange={(e) => setVin(e.target.value)}
                                    placeholder="Enter 17-character VIN"
                                    className="w-full py-4 px-6 text-center text-xl tracking-widest uppercase border-2 border-slate-200 rounded-2xl focus:border-blue-500 focus:ring-4 focus:ring-blue-50 outline-none transition-all mb-4 font-mono"
                                    maxLength={17}
                                />

                                {decodingError && (
                                    <div className="text-red-500 text-sm mb-4 bg-red-50 p-3 rounded-lg flex items-center gap-2 justify-center">
                                        ⚠️ {decodingError}
                                    </div>
                                )}

                                <button
                                    type="submit"
                                    disabled={isDecoding || vin.length < 3}
                                    className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-slate-300 text-white font-bold py-4 rounded-xl transition-all shadow-lg shadow-blue-200 disabled:shadow-none"
                                >
                                    {isDecoding ? 'Decoding...' : 'Find My Vehicle'}
                                </button>
                            </form>
                        ) : (
                            <div className="bg-slate-50 p-6 rounded-2xl animate-in fade-in zoom-in-95 duration-300">
                                <div className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-4">Vehicle Found</div>
                                <h3 className="text-2xl font-black text-slate-900 mb-1">{decodedVehicle.make} {decodedVehicle.model}</h3>
                                <p className="text-lg text-slate-600 mb-6">{decodedVehicle.year} • {decodedVehicle.bodyType}</p>

                                <div className="flex gap-3">
                                    <button
                                        onClick={() => setDecodedVehicle(null)}
                                        className="flex-1 py-3 px-4 rounded-xl border-2 border-slate-200 font-bold text-slate-600 hover:bg-slate-100 transition-colors"
                                    >
                                        Back
                                    </button>
                                    <button
                                        onClick={confirmVehicleAddition}
                                        className="flex-[2] py-3 px-4 rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-bold shadow-lg shadow-orange-200 transition-all"
                                    >
                                        Confirm & Add
                                    </button>
                                </div>
                            </div>
                        )}

                        {!decodedVehicle && (
                            <div className="mt-8 pt-8 border-t border-slate-100">
                                <p className="text-xs text-slate-400">Supported Regions: JDM, EU, US</p>
                            </div>
                        )}
                    </div>
                </div>
            ) : (
                <>
                    {/* Smart Omnibox */}
                    <SmartSearch
                        step={step as any}
                        placeholder={
                            step === 'BRAND' ? "Search Make (e.g. BMW, Toyota)..." :
                                step === 'MODEL' ? `Search ${selectedBrand?.name} Model...` :
                                    "Search Year..."
                        }
                        data={
                            step === 'BRAND' ? hierarchy :
                                step === 'MODEL' ? (selectedBrand?.models || []) :
                                    []
                        }
                        globalData={hierarchy}
                        onSearch={setFilterQuery}
                        onDirectJump={handleDirectJump}
                    />

                    {/* Animated Content Area */}
                    <div className="flex-1 relative">
                        <SelectionCarousel stepIndex={getStepIndex()}>
                            {/* Slide 1: Brands */}
                            <div className="w-full">
                                <BrandStep brands={filteredBrands} onSelect={handleBrandSelect} />
                            </div>

                            {/* Slide 2: Models */}
                            <div className="w-full">
                                <ModelStep models={filteredModels} onSelect={handleModelSelect} />
                            </div>

                            {/* Slide 3: Years */}
                            <div className="w-full">
                                <YearStep years={filteredYears} onSelect={handleYearSelect} />
                            </div>
                        </SelectionCarousel>
                    </div>

                    {/* Progress Indicators */}
                    <div className="absolute bottom-6 left-0 right-0 flex justify-center gap-2">
                        {['BRAND', 'MODEL', 'YEAR'].map((s, i) => (
                            <div
                                key={s}
                                className={`h-1.5 rounded-full transition-all duration-300 ${i === getStepIndex() ? 'w-8 bg-blue-600' : 'w-2 bg-slate-200'
                                    }`}
                            />
                        ))}
                    </div>
                </>
            )}
        </div>
    );
};
