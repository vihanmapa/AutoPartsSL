import React from 'react';
import { useApp } from '../../context/AppContext';
import { VehicleWizard } from './VehicleWizard';
import { X } from 'lucide-react';

export const VehicleWizardModal: React.FC = () => {
    const { isVehicleSelectorOpen, setVehicleSelectorOpen } = useApp();

    if (!isVehicleSelectorOpen) return null;

    return (
        <div className="fixed inset-0 z-[100] bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200">
            <div className="bg-slate-50 w-full max-w-4xl max-h-[90vh] rounded-3xl overflow-y-auto relative shadow-2xl animate-in zoom-in-95 duration-200 no-scrollbar">
                <button
                    onClick={() => setVehicleSelectorOpen(false)}
                    className="absolute top-4 right-4 z-20 p-2 bg-white/80 hover:bg-white rounded-full text-slate-500 hover:text-slate-800 transition-colors shadow-sm"
                >
                    <X className="h-6 w-6" />
                </button>
                <div className="p-2">
                    <VehicleWizard />
                </div>
            </div>
        </div>
    );
};
