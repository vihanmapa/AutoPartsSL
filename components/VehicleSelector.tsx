
import React, { useState, useEffect, useMemo } from 'react';
import { Car, Filter, X, Database } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { Button } from './ui/Button';

export const VehicleSelector: React.FC = () => {
  const { selectedVehicle, setSelectedVehicle, vehicles, isLoading } = useApp();
  
  const [year, setYear] = useState<string>('');
  const [make, setMake] = useState<string>('');
  const [model, setModel] = useState<string>('');

  // 1. Get Unique Years from flat database
  const years = useMemo(() => {
    if (isLoading) return [];
    const allYears = new Set<number>();
    vehicles.forEach(v => {
      if (v.year) {
        allYears.add(v.year);
      } else if (v.years && v.years.length > 0) {
        v.years.forEach(y => allYears.add(y));
      } else if (v.yearStart) {
        const start = v.yearStart;
        const end = v.yearEnd || new Date().getFullYear();
        for (let y = start; y <= end; y++) {
          allYears.add(y);
        }
      }
    });
    return Array.from(allYears).sort((a, b) => b - a);
  }, [vehicles, isLoading]);

  // 2. Filter Makes based on Selected Year
  const availableMakes = useMemo(() => {
    if (!year) return [];
    const y = parseInt(year);
    const validVehicles = vehicles.filter(v => {
      if (v.year) return v.year === y;
      if (v.years && v.years.length > 0) return v.years.includes(y);
      const end = v.yearEnd || new Date().getFullYear();
      return v.yearStart !== undefined && y >= v.yearStart && y <= end;
    });
    return Array.from(new Set(validVehicles.map(v => v.make))).sort();
  }, [year, vehicles]);

  // 3. Filter Models based on Year and Make
  const availableModels = useMemo(() => {
    if (!year || !make) return [];
    const y = parseInt(year);
    // Returns array of objects to keep ID
    return vehicles
      .filter(v => {
        if (v.make !== make) return false;
        if (v.year) return v.year === y;
        if (v.years && v.years.length > 0) return v.years.includes(y);
        const end = v.yearEnd || new Date().getFullYear();
        return v.yearStart !== undefined && y >= v.yearStart && y <= end;
      })
      .sort((a, b) => a.model.localeCompare(b.model));
  }, [year, make, vehicles]);

  const handleFindParts = () => {
    // If model is selected, we have the ID directly from the select value
    if (model) {
      const vehicle = vehicles.find(v => v.id === model);
      setSelectedVehicle(vehicle || null);
    }
  };

  const handleReset = () => {
    setYear('');
    setMake('');
    setModel('');
    setSelectedVehicle(null);
  };

  // Sync local state if global state changes
  useEffect(() => {
    if (!selectedVehicle) {
      // Optional reset logic if needed
    }
  }, [selectedVehicle]);

  if (isLoading) {
    return (
       <div className="bg-gradient-to-br from-slate-800 to-slate-900 text-white py-8 px-4 shadow-2xl h-[120px] flex items-center justify-center">
          <div className="animate-pulse flex items-center gap-3">
             <div className="h-6 w-6 bg-slate-600 rounded-full"></div>
             <div className="h-4 w-48 bg-slate-600 rounded"></div>
          </div>
       </div>
    );
  }

  // Handle Empty DB State
  if (vehicles.length === 0 && !isLoading) {
    return (
      <div className="bg-gradient-to-br from-slate-800 to-slate-900 text-white py-8 px-4 shadow-2xl">
        <div className="container mx-auto max-w-4xl text-center">
            <h2 className="text-xl font-bold mb-2">No Vehicles Found</h2>
            <p className="text-slate-400 mb-4">The vehicle database is currently empty.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-br from-slate-800 to-slate-900 text-white py-8 px-4 shadow-2xl">
      <div className="container mx-auto max-w-4xl">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          
          <div className="flex items-center gap-3 mb-4 md:mb-0">
            <div className="p-3 bg-secondary rounded-full">
              <Car className="h-6 w-6 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold">Find Parts for your Vehicle</h2>
              <p className="text-slate-400 text-sm">Select Year, Make, and Model to ensure fitment.</p>
            </div>
          </div>

          <div className="flex flex-col md:flex-row gap-3 w-full md:w-auto">
            {/* Year Select */}
            <select 
              className="bg-white border border-slate-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-secondary text-slate-900"
              value={year}
              onChange={(e) => { setYear(e.target.value); setMake(''); setModel(''); }}
            >
              <option value="">Select Year</option>
              {years.map(y => <option key={y} value={y}>{y}</option>)}
            </select>

            {/* Make Select */}
            <select 
              className="bg-white border border-slate-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-secondary text-slate-900 disabled:opacity-50 disabled:bg-slate-200"
              value={make}
              onChange={(e) => { setMake(e.target.value); setModel(''); }}
              disabled={!year}
            >
              <option value="">Select Make</option>
              {availableMakes.map(m => <option key={m} value={m}>{m}</option>)}
            </select>

            {/* Model Select */}
            <select 
              className="bg-white border border-slate-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-secondary text-slate-900 disabled:opacity-50 disabled:bg-slate-200"
              value={model}
              onChange={(e) => setModel(e.target.value)}
              disabled={!make}
            >
              <option value="">Select Model</option>
              {availableModels.map(v => (
                <option key={v.id} value={v.id}>
                  {v.model} {v.chassisCode ? `(${v.chassisCode})` : ''}
                </option>
              ))}
            </select>

            <div className="flex gap-2">
              <Button 
                onClick={handleFindParts} 
                disabled={!model}
                variant="secondary"
              >
                <Filter className="h-4 w-4" /> Find
              </Button>
              {selectedVehicle && (
                <Button 
                  onClick={handleReset} 
                  variant="outline"
                  className="bg-transparent border-slate-500 text-slate-300 hover:bg-slate-700 hover:text-white hover:border-white"
                >
                  <X className="h-4 w-4" />
                </Button>
              )}
            </div>
          </div>
        </div>

        {selectedVehicle && (
          <div className="mt-4 bg-green-900/30 border border-green-500/30 p-3 rounded text-green-300 text-sm flex flex-col md:flex-row items-center justify-center gap-2 md:gap-4">
            <div>
               <span className="font-semibold text-green-200">Selected:</span> 
               <span className="ml-2 font-bold">{selectedVehicle.make} {selectedVehicle.model} {selectedVehicle.year ? `(${selectedVehicle.year})` : ''}</span>
            </div>
            {selectedVehicle.chassisCode && (
              <div className="flex gap-4">
                 <span className="bg-green-800/50 px-2 py-0.5 rounded text-xs border border-green-700">
                    Chassis: {selectedVehicle.chassisCode}
                 </span>
                 {selectedVehicle.engineCode && (
                    <span className="bg-green-800/50 px-2 py-0.5 rounded text-xs border border-green-700">
                      Engine: {selectedVehicle.engineCode}
                    </span>
                 )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
