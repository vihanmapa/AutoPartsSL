
import React, { useState, useEffect, useMemo } from 'react';
import { Car, Filter, X } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { Button } from './ui/Button';

export const VehicleSelector: React.FC = () => {
  const { selectedVehicle, setSelectedVehicle, vehicles, isLoading } = useApp();
  
  const [year, setYear] = useState<string>('');
  const [make, setMake] = useState<string>('');
  const [model, setModel] = useState<string>('');

  // 1. Get Unique Years
  const years = useMemo(() => {
    if (isLoading) return [];
    const allYears = new Set<number>();
    vehicles.forEach(v => {
      const end = v.yearEnd || new Date().getFullYear();
      for (let y = v.yearStart; y <= end; y++) {
        allYears.add(y);
      }
    });
    return Array.from(allYears).sort((a, b) => b - a);
  }, [vehicles, isLoading]);

  // 2. Filter Makes based on Selected Year
  const availableMakes = useMemo(() => {
    if (!year) return [];
    const y = parseInt(year);
    const validVehicles = vehicles.filter(v => 
      v.yearStart <= y && (!v.yearEnd || v.yearEnd >= y)
    );
    return Array.from(new Set(validVehicles.map(v => v.make))).sort();
  }, [year, vehicles]);

  // 3. Filter Models based on Year and Make
  const availableModels = useMemo(() => {
    if (!year || !make) return [];
    const y = parseInt(year);
    return vehicles
      .filter(v => 
        v.make === make && 
        v.yearStart <= y && 
        (!v.yearEnd || v.yearEnd >= y)
      )
      .map(v => v.model)
      .sort();
  }, [year, make, vehicles]);

  const handleFindParts = () => {
    if (year && make && model) {
      const y = parseInt(year);
      // Find the specific vehicle ID(s)
      const vehicle = vehicles.find(v => 
        v.make === make && 
        v.model === model && 
        v.yearStart <= y && 
        (!v.yearEnd || v.yearEnd >= y)
      );
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
              className="bg-slate-700 border border-slate-600 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-secondary text-white"
              value={year}
              onChange={(e) => { setYear(e.target.value); setMake(''); setModel(''); }}
            >
              <option value="">Select Year</option>
              {years.map(y => <option key={y} value={y}>{y}</option>)}
            </select>

            {/* Make Select */}
            <select 
              className="bg-slate-700 border border-slate-600 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-secondary text-white disabled:opacity-50"
              value={make}
              onChange={(e) => { setMake(e.target.value); setModel(''); }}
              disabled={!year}
            >
              <option value="">Select Make</option>
              {availableMakes.map(m => <option key={m} value={m}>{m}</option>)}
            </select>

            {/* Model Select */}
            <select 
              className="bg-slate-700 border border-slate-600 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-secondary text-white disabled:opacity-50"
              value={model}
              onChange={(e) => setModel(e.target.value)}
              disabled={!make}
            >
              <option value="">Select Model</option>
              {availableModels.map(m => <option key={m} value={m}>{m}</option>)}
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
          <div className="mt-4 bg-green-900/30 border border-green-500/30 p-3 rounded text-green-300 text-sm flex items-center justify-center">
            <span className="font-semibold">Showing results for:</span> 
            <span className="ml-2">{selectedVehicle.make} {selectedVehicle.model} ({year})</span>
          </div>
        )}
      </div>
    </div>
  );
};
