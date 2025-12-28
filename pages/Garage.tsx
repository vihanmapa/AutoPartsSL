import React from 'react';
import { Car, Plus, Trash2, CheckCircle2 } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { Button } from '../components/ui/Button';

export const Garage: React.FC = () => {
    const { currentUser, setVehicleSelectorOpen, setVehicleSelectorMode, setSelectedVehicle, selectedVehicle, removeFromGarage, addToGarage } = useApp();

    const handleAddVehicle = () => {
        setVehicleSelectorMode('add-to-garage');
        setVehicleSelectorOpen(true);
    };

    const garageVehicles = currentUser?.garage || [];

    return (
        <div className="container mx-auto px-4 py-8 max-w-4xl animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
                <div>
                    <h1 className="text-3xl font-black text-slate-900 tracking-tight flex items-center gap-3">
                        <Car className="h-8 w-8 text-secondary" />
                        My Garage
                    </h1>
                    <p className="text-slate-500 mt-1">Manage your vehicles for quick access to compatible parts.</p>
                </div>
                <Button onClick={handleAddVehicle} className="flex items-center gap-2 shadow-lg hover:shadow-xl transition-all">
                    <Plus className="bg-white/20 rounded-full p-0.5" size={20} />
                    Add New Vehicle
                </Button>
            </div>

            {garageVehicles.length === 0 ? (
                <div className="bg-white rounded-3xl shadow-sm border border-slate-200 p-12 text-center">
                    <div className="bg-slate-50 h-24 w-24 rounded-full flex items-center justify-center mx-auto mb-6">
                        <Car className="h-10 w-10 text-slate-300" />
                    </div>
                    <h2 className="text-xl font-bold text-slate-900 mb-2">Your Garage is Empty</h2>
                    <p className="text-slate-500 mb-8 max-w-md mx-auto">Add your vehicles to find compatible parts faster. We'll remember your selection for future visits.</p>
                    <Button variant="outline" onClick={handleAddVehicle} size="lg">
                        Add Your First Vehicle
                    </Button>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {garageVehicles.map((vehicle, idx) => {
                        const isSelected = selectedVehicle?.id === vehicle.id;
                        return (
                            <div
                                key={vehicle.id || idx}
                                className={`group relative bg-white rounded-2xl border transition-all duration-300 overflow-hidden
                                    ${isSelected
                                        ? 'border-secondary shadow-md ring-1 ring-secondary'
                                        : 'border-slate-200 hover:border-secondary/50 hover:shadow-md'
                                    }`}
                            >
                                <div className="p-6 flex items-start gap-4">
                                    <div className="h-16 w-16 bg-slate-100 rounded-xl flex items-center justify-center shrink-0">
                                        {/* Ideally use vehicle image if available, else icon */}
                                        <Car className={`h-8 w-8 ${isSelected ? 'text-secondary' : 'text-slate-400'}`} />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex justify-between items-start">
                                            <div>
                                                <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">{vehicle.year} {vehicle.make}</p>
                                                <h3 className="text-lg font-bold text-slate-900 truncate">{vehicle.model}</h3>
                                                <p className="text-sm text-slate-400 capitalize">{vehicle.bodyType || 'Vehicle'}</p>
                                            </div>
                                        </div>

                                        <div className="mt-4 flex gap-2">
                                            {isSelected ? (
                                                <div className="flex-1 bg-secondary/10 text-secondary font-bold py-2 px-4 rounded-lg flex items-center justify-center gap-2 text-sm cursor-default">
                                                    <CheckCircle2 size={16} />
                                                    Active Vehicle
                                                </div>
                                            ) : (
                                                <Button
                                                    variant="secondary"
                                                    className="flex-1 bg-slate-900 text-white hover:bg-slate-800"
                                                    onClick={() => setSelectedVehicle(vehicle)}
                                                >
                                                    Select
                                                </Button>
                                            )}

                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    if (window.confirm('Remove this vehicle from your garage?')) {
                                                        removeFromGarage(vehicle.id);
                                                    }
                                                }}
                                                className="p-2.5 rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-50 transition-colors"
                                                title="Remove Vehicle"
                                            >
                                                <Trash2 size={18} />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                                {isSelected && (
                                    <div className="absolute top-0 right-0 bg-secondary text-white text-[10px] font-bold px-3 py-1 rounded-bl-xl shadow-sm">
                                        ACTIVE
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
};
