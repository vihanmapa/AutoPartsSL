import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { Car, ChevronUp } from 'lucide-react';

export const StickyVehicleBar: React.FC = () => {
    const { selectedVehicle, isVehicleSelectorOpen, setVehicleSelectorOpen } = useApp();
    // Always visible, but handles absence of vehicle
    return (
        <div
            className="bg-slate-900 border-b border-slate-800 shadow-md sticky z-30 transition-all duration-200"
            style={{ top: 'calc(125px + env(safe-area-inset-top))' }}
        >
            <div className="container mx-auto px-4 h-16 flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="h-10 w-10 bg-slate-800 rounded-full flex items-center justify-center shrink-0 border border-slate-700">
                        <Car className={`h-5 w-5 ${selectedVehicle ? 'text-blue-400' : 'text-slate-500'}`} />
                    </div>
                    <div>
                        <p className="text-[10px] text-slate-400 font-medium uppercase tracking-wider mb-0.5">
                            {selectedVehicle ? 'Selected Vehicle' : 'No Vehicle Selected'}
                        </p>
                        <h3 className={`text-sm font-bold leading-tight ${selectedVehicle ? 'text-white' : 'text-slate-500'}`}>
                            {selectedVehicle ? (
                                <>
                                    {selectedVehicle.make} {selectedVehicle.model} <span className="text-slate-400 font-normal">{selectedVehicle.year}</span>
                                </>
                            ) : (
                                "Tap to select your car"
                            )}
                        </h3>
                    </div>
                </div>

                <div className="flex items-center gap-2">
                    <button
                        onClick={() => setVehicleSelectorOpen(true)}
                        className="text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg transition-colors shadow-sm"
                    >
                        {selectedVehicle ? 'Change' : 'Select Vehicle'}
                    </button>
                </div>
            </div>
        </div>
    );
};
