import React, { useState, useMemo } from 'react';
import { Car, Search, X, ChevronRight, ArrowLeft, Check, Database, Wifi } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { api } from '../services/api';
import { Button } from './ui/Button';
import { Vehicle } from '../types';

type Step = 'MAKE' | 'MODEL' | 'YEAR' | 'VARIANT';

export const VehicleSelector: React.FC = () => {
  const { selectedVehicle, setSelectedVehicle, vehicles, isLoading, seedDatabase } = useApp();

  const [isOpen, setIsOpen] = useState(false);
  const [step, setStep] = useState<Step>('MAKE');

  // Temporary selection state
  const [tempMake, setTempMake] = useState<string>('');
  const [tempModel, setTempModel] = useState<string>('');
  const [tempYear, setTempYear] = useState<number | null>(null);

  // --- DERIVED DATA ---

  // 1. Unique Makes
  const availableMakes = useMemo(() => {
    return Array.from(new Set(vehicles.map(v => v.make))).sort();
  }, [vehicles]);

  // 2. Models for selected Make
  const availableModels = useMemo(() => {
    if (!tempMake) return [];
    return Array.from(new Set(
      vehicles
        .filter(v => v.make === tempMake)
        .map(v => v.model)
    )).sort();
  }, [vehicles, tempMake]);

  // 3. Years for selected Make + Model
  const availableYears = useMemo(() => {
    if (!tempMake || !tempModel) return [];
    const relevantVehicles = vehicles.filter(v => v.make === tempMake && v.model === tempModel);

    const yearsSet = new Set<number>();
    relevantVehicles.forEach(v => {
      if (v.year) yearsSet.add(v.year);
      if (v.years) v.years.forEach(y => yearsSet.add(y));
      if (v.yearStart) {
        const end = v.yearEnd || new Date().getFullYear();
        for (let y = v.yearStart; y <= end; y++) {
          yearsSet.add(y);
        }
      }
    });
    return Array.from(yearsSet).sort((a, b) => b - a);
  }, [vehicles, tempMake, tempModel]);

  // 4. Variants for selected Make + Model + Year
  const availableVariants = useMemo(() => {
    if (!tempMake || !tempModel || !tempYear) return [];
    return vehicles.filter(v => {
      if (v.make !== tempMake || v.model !== tempModel) return false;

      // Check year compatibility
      if (v.year === tempYear) return true;
      if (v.years && v.years.includes(tempYear)) return true;
      if (v.yearStart) {
        const end = v.yearEnd || new Date().getFullYear();
        if (tempYear >= v.yearStart && tempYear <= end) return true;
      }
      return false;
    });
  }, [vehicles, tempMake, tempModel, tempYear]);

  // --- HANDLERS ---

  const handleOpen = () => {
    setIsOpen(true);
    resetFlow();
  };

  const handleClose = () => {
    setIsOpen(false);
    resetFlow();
  };

  const resetFlow = () => {
    setStep('MAKE');
    setTempMake('');
    setTempModel('');
    setTempYear(null);
  };

  const selectMake = (make: string) => {
    setTempMake(make);
    setStep('MODEL');
  };

  const selectModel = (model: string) => {
    setTempModel(model);
    setStep('YEAR');
  };

  const selectYear = (year: number) => {
    setTempYear(year);
    // Check if we need to select a variant
    // We need to see how many vehicles match this Make/Model/Year
    // Note: availableVariants depends on state, but state updates are async.
    // So we calculate it here immediately.
    const variants = vehicles.filter(v => {
      if (v.make !== tempMake || v.model !== tempModel) return false;
      if (v.year === year) return true;
      if (v.years && v.years.includes(year)) return true;
      if (v.yearStart) {
        const end = v.yearEnd || new Date().getFullYear();
        if (year >= v.yearStart && year <= end) return true;
      }
      return false;
    });

    if (variants.length === 1) {
      // Exact match found
      setSelectedVehicle(variants[0]);
      setIsOpen(false);
    } else if (variants.length > 1) {
      // Multiple variants (e.g. different engines/chassis)
      setStep('VARIANT');
    } else {
      // No match (shouldn't happen if logic is correct)
      console.warn("No vehicle found for selection");
    }
  };

  const selectVariant = (vehicle: Vehicle) => {
    setSelectedVehicle(vehicle);
    setIsOpen(false);
  };

  const goBack = () => {
    if (step === 'MODEL') setStep('MAKE');
    else if (step === 'YEAR') setStep('MODEL');
    else if (step === 'VARIANT') setStep('YEAR');
  };

  const handleResetSelection = (e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedVehicle(null);
  };

  // --- RENDERERS ---

  if (isLoading) {
    return (
      <div className="bg-white p-4 animate-pulse">
        <div className="h-24 bg-slate-100 rounded-xl"></div>
      </div>
    );
  }

  // Handle Empty DB State
  if (vehicles.length === 0 && !isLoading) {
    return (
      <div className="bg-white p-6 m-4 rounded-xl shadow-sm border border-slate-100 text-center">
        <h2 className="text-lg font-bold mb-2 text-slate-900">No Vehicles Found</h2>
        <p className="text-slate-500 mb-4 text-sm">The vehicle database is currently empty.</p>
        <Button onClick={seedDatabase} variant="secondary" className="w-full">
          <Database className="h-4 w-4 mr-2" />
          Seed Database
        </Button>
      </div>
    );
  }

  return (
    <>
      {/* MAIN ENTRY CARD */}
      <div className="bg-white px-4 py-6 shadow-sm border-b border-slate-100">
        <div className="container mx-auto">
          <div className="flex items-start gap-4 mb-4">
            <div className="h-12 w-12 bg-orange-100 rounded-full flex items-center justify-center shrink-0">
              <Car className="h-6 w-6 text-orange-600" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900 leading-tight">Find Parts for your Vehicle</h2>
              <p className="text-slate-500 text-sm mt-1">Select your vehicle to ensure fitment</p>
            </div>
          </div>

          <button
            onClick={handleOpen}
            className="w-full bg-slate-50 border border-slate-200 rounded-xl p-4 flex items-center justify-between group hover:border-orange-500 hover:shadow-sm transition-colors"
          >
            <div className="flex items-center gap-3">
              {selectedVehicle ? (
                <div className="text-left">
                  <p className="text-xs text-slate-500 font-medium uppercase tracking-wider">My Vehicle</p>
                  <p className="text-lg font-bold text-slate-900">
                    {selectedVehicle.year && <span className="text-slate-500 mr-1">{selectedVehicle.year}</span>}
                    {selectedVehicle.make} {selectedVehicle.model}
                  </p>
                  {selectedVehicle.chassisCode && (
                    <span className="inline-block mt-1 bg-slate-200 text-slate-600 text-[10px] font-bold px-1.5 py-0.5 rounded">
                      {selectedVehicle.chassisCode}
                    </span>
                  )}
                </div>
              ) : (
                <span className="text-slate-500 font-medium">Select your vehicle...</span>
              )}
            </div>

            {selectedVehicle ? (
              <div onClick={handleResetSelection} className="p-2 -mr-2 text-slate-400 hover:text-red-500">
                <X className="h-5 w-5" />
              </div>
            ) : (
              <div className="h-8 w-8 bg-orange-500 rounded-full flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform">
                <Search className="h-4 w-4 text-white" />
              </div>
            )}
          </button>
        </div>
      </div>

      {/* FULL SCREEN MODAL */}
      {isOpen && (
        <div className="fixed inset-0 z-[100] bg-white flex flex-col animate-in slide-in-from-bottom duration-300">
          {/* Header */}
          <div className="px-4 py-4 pt-12 border-b border-slate-100 flex items-center gap-4 bg-white sticky top-0 z-10">
            <button onClick={step === 'MAKE' ? handleClose : goBack} className="p-2 -ml-2 text-slate-600 hover:bg-slate-50 rounded-full">
              {step === 'MAKE' ? <X className="h-6 w-6" /> : <ArrowLeft className="h-6 w-6" />}
            </button>
            <div className="flex-1">
              <h2 className="text-lg font-bold text-slate-900">
                {step === 'MAKE' && 'Select Make'}
                {step === 'MODEL' && 'Select Model'}
                {step === 'YEAR' && 'Select Year'}
                {step === 'VARIANT' && 'Select Version'}
              </h2>
              <p className="text-xs text-slate-500">
                {step !== 'MAKE' && `${tempMake}`}
                {step !== 'MAKE' && step !== 'MODEL' && ` • ${tempModel}`}
                {step === 'VARIANT' && ` • ${tempYear}`}
              </p>
            </div>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto p-4">
            {/* STEP 1: MAKE */}
            {step === 'MAKE' && (
              <div className="grid grid-cols-2 gap-3">
                {availableMakes.map(make => (
                  <button
                    key={make}
                    onClick={() => selectMake(make)}
                    className="flex flex-col items-center justify-center p-6 bg-slate-50 border border-slate-100 rounded-xl hover:border-orange-500 hover:bg-orange-50 transition-all"
                  >
                    {/* Placeholder Icon - In real app, map make to logo */}
                    <Car className="h-8 w-8 text-slate-400 mb-2" />
                    <span className="font-bold text-slate-900">{make}</span>
                  </button>
                ))}
              </div>
            )}

            {/* STEP 2: MODEL */}
            {step === 'MODEL' && (
              <div className="space-y-2">
                {availableModels.map(model => (
                  <button
                    key={model}
                    onClick={() => selectModel(model)}
                    className="w-full flex items-center justify-between p-4 bg-white border border-slate-100 rounded-xl hover:border-orange-500 hover:shadow-sm transition-all text-left"
                  >
                    <span className="font-medium text-slate-900">{model}</span>
                    <ChevronRight className="h-5 w-5 text-slate-300" />
                  </button>
                ))}
              </div>
            )}

            {/* STEP 3: YEAR */}
            {step === 'YEAR' && (
              <div className="grid grid-cols-3 gap-3">
                {availableYears.map(year => (
                  <button
                    key={year}
                    onClick={() => selectYear(year)}
                    className="flex items-center justify-center py-4 bg-slate-50 border border-slate-100 rounded-xl hover:border-orange-500 hover:bg-orange-50 transition-all font-bold text-slate-900"
                  >
                    {year}
                  </button>
                ))}
              </div>
            )}

            {/* STEP 4: VARIANT */}
            {step === 'VARIANT' && (
              <div className="space-y-3">
                <p className="text-sm text-slate-500 mb-2">We found multiple versions for this year. Please select yours:</p>
                {availableVariants.map(v => (
                  <button
                    key={v.id}
                    onClick={() => selectVariant(v)}
                    className="w-full p-4 bg-white border border-slate-200 rounded-xl hover:border-orange-500 hover:shadow-md transition-all text-left relative overflow-hidden"
                  >
                    <div className="flex justify-between items-start mb-2">
                      <span className="font-bold text-slate-900">{v.bodyType || 'Standard'}</span>
                      {v.fuelType && (
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${v.fuelType === 'Hybrid' ? 'bg-green-100 text-green-700' :
                          v.fuelType === 'Electric' ? 'bg-blue-100 text-blue-700' :
                            'bg-slate-100 text-slate-700'
                          }`}>
                          {v.fuelType}
                        </span>
                      )}
                    </div>
                    <div className="text-sm text-slate-600 space-y-1">
                      {v.chassisCode && <p>Chassis: <span className="font-mono font-bold">{v.chassisCode}</span></p>}
                      {v.engineCode && <p>Engine: <span className="font-mono">{v.engineCode}</span></p>}
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
};
