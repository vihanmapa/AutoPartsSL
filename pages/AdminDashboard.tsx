
import React, { useState, useEffect, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { api } from '../services/api';
import { User, Vehicle } from '../types';
import { 
    Users, Store, DollarSign, ShieldCheck, Car, LogOut, ClipboardList,
    Plus, X, Save, Trash2, Loader2, RefreshCw
} from 'lucide-react';
import { Button } from '../components/ui/Button';

// Internal Type for Grouped Display
interface GroupedVehicle {
  groupId: string; // Composite key (make-model-specs)
  make: string;
  model: string;
  chassisCode: string;
  engineCode: string;
  fuelType: Vehicle['fuelType'];
  bodyType: Vehicle['bodyType'];
  years: number[]; // Aggregated years
  ids: Record<number, string>; // Map year -> vehicleId
}

export const AdminDashboard: React.FC = () => {
  const { logout, vendors, toggleVendorVerification, vehicles, manageVehicleBatch, isLoading: contextLoading } = useApp();
  const [activeTab, setActiveTab] = useState<'overview' | 'vendors' | 'users' | 'orders' | 'vehicles'>('overview');
  const [users, setUsers] = useState<User[]>([]);
  const [orders, setOrders] = useState<any[]>([]); // simplified order type for dash
  const [isLoading, setIsLoading] = useState(true);

  // Vehicle State
  const [groupedVehicles, setGroupedVehicles] = useState<GroupedVehicle[]>([]);
  const [hasChanges, setHasChanges] = useState(false);
  const [isAddingGroup, setIsAddingGroup] = useState(false);
  
  // Pending Operations Queues
  const [pendingDeletes, setPendingDeletes] = useState<Set<string>>(new Set()); // vehicle IDs to delete
  const [pendingCreates, setPendingCreates] = useState<Vehicle[]>([]); // new vehicles to add
  
  // New Group Form
  const [newGroupData, setNewGroupData] = useState({
     make: '', model: '', chassisCode: '', engineCode: '', fuelType: 'Petrol', bodyType: 'Sedan', years: [] as number[]
  });
  const [yearInput, setYearInput] = useState('');

  // Fetch Admin Data
  useEffect(() => {
    const fetchData = async () => {
        setIsLoading(true);
        try {
            const [fetchedUsers, fetchedOrders] = await Promise.all([
                api.getAllUsers(),
                api.getAllOrders()
            ]);
            setUsers(fetchedUsers);
            setOrders(fetchedOrders);
        } catch (error) {
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    };
    fetchData();
  }, []);

  // --- AGGREGATION LOGIC ---
  useEffect(() => {
    if (vehicles.length > 0) {
      const groups: Record<string, GroupedVehicle> = {};

      vehicles.forEach(v => {
        // Create a unique key for grouping. 
        // Note: Year is NOT part of key.
        const key = `${v.make}-${v.model}-${v.chassisCode || ''}-${v.engineCode || ''}-${v.bodyType || ''}`.toLowerCase().replace(/\s/g, '');
        
        if (!groups[key]) {
           groups[key] = {
             groupId: key,
             make: v.make,
             model: v.model,
             chassisCode: v.chassisCode || '',
             engineCode: v.engineCode || '',
             fuelType: v.fuelType,
             bodyType: v.bodyType,
             years: [],
             ids: {}
           };
        }
        
        // Handle flattened structure or ranges
        if (v.year) {
            groups[key].years.push(v.year);
            groups[key].ids[v.year] = v.id;
        } else if (v.yearStart) {
            // Handle range vehicles
            const end = v.yearEnd || new Date().getFullYear();
            for (let y = v.yearStart; y <= end; y++) {
                if (!groups[key].years.includes(y)) {
                    groups[key].years.push(y);
                    groups[key].ids[y] = v.id;
                }
            }
        } else if (v.years) {
            // Handle specific years array
            v.years.forEach(y => {
                if (!groups[key].years.includes(y)) {
                    groups[key].years.push(y);
                    groups[key].ids[y] = v.id;
                }
            });
        }
      });

      // Sort years
      Object.values(groups).forEach(g => g.years.sort((a,b) => a - b));

      setGroupedVehicles(Object.values(groups));
    }
  }, [vehicles]);

  const totalRevenue = orders.reduce((sum, order) => sum + order.totalAmount, 0);

  // --- HANDLERS ---

  const handleGroupChange = (groupId: string, field: keyof GroupedVehicle, value: any) => {
    setGroupedVehicles(prev => prev.map(g => g.groupId === groupId ? { ...g, [field]: value } : g));
    setHasChanges(true);
  };

  const handleAddYearTag = (groupId: string, yearStr: string) => {
    const year = parseInt(yearStr);
    if (isNaN(year)) return;

    setGroupedVehicles(prev => prev.map(g => {
        if (g.groupId === groupId && !g.years.includes(year)) {
            // We need to create a NEW vehicle record for this year
            const newId = `temp_v${Date.now()}_${Math.floor(Math.random()*1000)}`;
            
            // Queue creation
            const newVehicle: Vehicle = {
                id: newId,
                make: g.make,
                model: g.model,
                year: year,
                chassisCode: g.chassisCode,
                engineCode: g.engineCode,
                fuelType: g.fuelType,
                bodyType: g.bodyType
            };
            setPendingCreates(prevQ => [...prevQ, newVehicle]);

            // Update UI
            return {
                ...g,
                years: [...g.years, year].sort((a,b) => a-b),
                ids: { ...g.ids, [year]: newId }
            };
        }
        return g;
    }));
    setHasChanges(true);
  };

  const handleRemoveYearTag = (groupId: string, yearToRemove: number) => {
    setGroupedVehicles(prev => prev.map(g => {
        if (g.groupId === groupId) {
            const idToDelete = g.ids[yearToRemove];
            if (idToDelete) {
                // If it was a temp create, remove from pendingCreates
                if (idToDelete.startsWith('temp_')) {
                    setPendingCreates(q => q.filter(v => v.id !== idToDelete));
                } else {
                    // Existing DB record, mark for deletion
                    setPendingDeletes(s => new Set(s).add(idToDelete));
                }
            }

            const newYears = g.years.filter(y => y !== yearToRemove);
            const newIds = { ...g.ids };
            delete newIds[yearToRemove];

            return { ...g, years: newYears, ids: newIds };
        }
        return g;
    }));
    setHasChanges(true);
  };

  const handleBulkSave = async () => {
    // 1. Calculate Updates
    const updates: { id: string, data: Partial<Vehicle> }[] = [];

    groupedVehicles.forEach(g => {
        Object.entries(g.ids).forEach(([yearStr, id]) => {
            const vehicleId = id as string;
            if (vehicleId.startsWith('temp_')) return; // handled by creates
            if (pendingDeletes.has(vehicleId)) return; // handled by deletes
            
            updates.push({
                id: vehicleId,
                data: {
                    make: g.make,
                    model: g.model,
                    chassisCode: g.chassisCode,
                    engineCode: g.engineCode,
                    fuelType: g.fuelType,
                    bodyType: g.bodyType,
                }
            });
        });
    });

    // 2. Process Pending Creates
    const finalCreates = pendingCreates.map(pc => {
        // Find parent group to get latest details
        const parentGroup = groupedVehicles.find(g => Object.values(g.ids).includes(pc.id));
        if (parentGroup) {
            return {
                ...pc,
                make: parentGroup.make,
                model: parentGroup.model,
                chassisCode: parentGroup.chassisCode,
                engineCode: parentGroup.engineCode,
                fuelType: parentGroup.fuelType,
                bodyType: parentGroup.bodyType
            };
        }
        return pc;
    });

    try {
        await manageVehicleBatch({
            creates: finalCreates,
            updates: updates,
            deletes: Array.from(pendingDeletes)
        });
        
        // Reset queues
        setPendingCreates([]);
        setPendingDeletes(new Set());
        setHasChanges(false);
    } catch (e) {
        console.error("Batch failed", e);
    }
  };

  const handleAddGroup = async (e: React.FormEvent) => {
      e.preventDefault();
      // Generate flat records for each year
      const creates: Vehicle[] = newGroupData.years.map(y => ({
          id: `v${Date.now()}_${y}`,
          make: newGroupData.make,
          model: newGroupData.model,
          year: y,
          chassisCode: newGroupData.chassisCode,
          engineCode: newGroupData.engineCode,
          fuelType: newGroupData.fuelType as any,
          bodyType: newGroupData.bodyType as any
      }));

      await manageVehicleBatch({ creates, updates: [], deletes: [] });
      setIsAddingGroup(false);
      setNewGroupData({ make: '', model: '', chassisCode: '', engineCode: '', fuelType: 'Petrol', bodyType: 'Sedan', years: [] });
  };

  return (
    <div className="min-h-screen bg-slate-100 flex">
      {/* Sidebar */}
      <aside className="w-64 bg-slate-900 text-white flex flex-col fixed h-full z-10">
        <div className="p-6 border-b border-slate-800">
            <h2 className="text-xl font-bold flex items-center gap-2">
                <ShieldCheck className="text-red-500" /> Admin Panel
            </h2>
        </div>
        <nav className="flex-1 p-4 space-y-2">
            <button onClick={() => setActiveTab('overview')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg ${activeTab === 'overview' ? 'bg-red-600' : 'hover:bg-slate-800'}`}>
                <DollarSign className="h-5 w-5" /> Overview
            </button>
            <button onClick={() => setActiveTab('vendors')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg ${activeTab === 'vendors' ? 'bg-red-600' : 'hover:bg-slate-800'}`}>
                <Store className="h-5 w-5" /> Vendors
            </button>
            <button onClick={() => setActiveTab('vehicles')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg ${activeTab === 'vehicles' ? 'bg-red-600' : 'hover:bg-slate-800'}`}>
                <Car className="h-5 w-5" /> Vehicles
            </button>
            <button onClick={() => setActiveTab('users')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg ${activeTab === 'users' ? 'bg-red-600' : 'hover:bg-slate-800'}`}>
                <Users className="h-5 w-5" /> Users
            </button>
        </nav>
        <div className="p-4 border-t border-slate-800">
            <button onClick={logout} className="w-full flex items-center gap-3 px-4 py-3 text-slate-400 hover:text-white hover:bg-slate-800"><LogOut className="h-5 w-5" /> Logout</button>
        </div>
      </aside>

      {/* Content */}
      <main className="flex-1 md:ml-64 p-8">
        
        {activeTab === 'overview' && (
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="bg-white p-6 rounded-xl shadow-sm border">
                    <p className="text-slate-500">Revenue</p>
                    <h3 className="text-2xl font-bold">LKR {totalRevenue.toLocaleString()}</h3>
                </div>
                 <div className="bg-white p-6 rounded-xl shadow-sm border">
                    <p className="text-slate-500">Total Vehicles (Rows)</p>
                    <h3 className="text-2xl font-bold text-blue-600">{vehicles.length}</h3>
                </div>
            </div>
        )}

        {/* --- VEHICLE MANAGEMENT --- */}
        {activeTab === 'vehicles' && (
            <div className="space-y-6 animate-in fade-in">
                <div className="flex justify-between items-center bg-white p-4 rounded-lg shadow-sm sticky top-4 z-20">
                    <div>
                        <h1 className="text-2xl font-bold text-slate-900">Vehicle Database</h1>
                        <p className="text-xs text-slate-500">Showing {groupedVehicles.length} grouped models (from {vehicles.length} total records)</p>
                    </div>
                    <div className="flex gap-2">
                        {hasChanges && (
                            <Button onClick={handleBulkSave} disabled={contextLoading}>
                                {contextLoading ? <Loader2 className="animate-spin h-4 w-4 mr-2"/> : <Save className="h-4 w-4 mr-2"/>}
                                Save Changes
                            </Button>
                        )}
                        <Button onClick={() => setIsAddingGroup(!isAddingGroup)}>
                             <Plus className="h-4 w-4 mr-2"/> Add Model
                        </Button>
                    </div>
                </div>

                {isAddingGroup && (
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-blue-200">
                        <h3 className="font-bold mb-4 text-slate-800">Add New Model Group</h3>
                        <form onSubmit={handleAddGroup} className="grid grid-cols-2 md:grid-cols-4 gap-4">
                             <div className="space-y-1">
                                <label className="text-xs font-bold text-slate-500">Brand</label>
                                <input 
                                    type="text" 
                                    placeholder="e.g. Toyota" 
                                    className="w-full border border-slate-300 bg-white text-slate-900 p-2 rounded focus:ring-2 focus:ring-blue-500 outline-none placeholder:text-slate-400" 
                                    value={newGroupData.make} 
                                    onChange={e => setNewGroupData({...newGroupData, make: e.target.value})} 
                                    required 
                                />
                             </div>
                             <div className="space-y-1">
                                <label className="text-xs font-bold text-slate-500">Model</label>
                                <input 
                                    type="text" 
                                    placeholder="e.g. Axio" 
                                    className="w-full border border-slate-300 bg-white text-slate-900 p-2 rounded focus:ring-2 focus:ring-blue-500 outline-none placeholder:text-slate-400" 
                                    value={newGroupData.model} 
                                    onChange={e => setNewGroupData({...newGroupData, model: e.target.value})} 
                                    required 
                                />
                             </div>
                             <div className="space-y-1">
                                <label className="text-xs font-bold text-slate-500">Chassis / Engine</label>
                                <input 
                                    type="text" 
                                    placeholder="Code" 
                                    className="w-full border border-slate-300 bg-white text-slate-900 p-2 rounded focus:ring-2 focus:ring-blue-500 outline-none placeholder:text-slate-400" 
                                    value={newGroupData.chassisCode} 
                                    onChange={e => setNewGroupData({...newGroupData, chassisCode: e.target.value})} 
                                />
                             </div>
                             
                             <div className="col-span-2 space-y-1">
                                 <label className="text-xs font-bold text-slate-500">Years</label>
                                 <div className="flex flex-wrap gap-2 items-center border border-slate-300 bg-white p-2 rounded min-h-[42px]">
                                     {newGroupData.years.map(y => (
                                         <span key={y} className="bg-blue-100 text-blue-800 px-2 py-0.5 rounded text-xs font-bold flex items-center gap-1">
                                            {y} 
                                            <button type="button" onClick={() => setNewGroupData(prev => ({...prev, years: prev.years.filter(yr => yr !== y)}))} className="hover:text-red-500">
                                                <X className="h-3 w-3" />
                                            </button>
                                         </span>
                                     ))}
                                     <input 
                                        type="number" 
                                        placeholder="Type Year & Enter" 
                                        className="outline-none w-32 text-sm bg-transparent text-slate-900 placeholder:text-slate-400"
                                        onKeyDown={(e) => {
                                            if (e.key === 'Enter') {
                                                e.preventDefault();
                                                const y = parseInt(e.currentTarget.value);
                                                if(!isNaN(y) && !newGroupData.years.includes(y)) {
                                                    setNewGroupData({...newGroupData, years: [...newGroupData.years, y].sort()});
                                                    e.currentTarget.value = '';
                                                }
                                            }
                                        }}
                                     />
                                 </div>
                             </div>

                             <div className="col-span-4 flex justify-end">
                                 <Button type="submit">Create Records</Button>
                             </div>
                        </form>
                    </div>
                )}

                <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-slate-50 text-slate-600 text-xs uppercase font-bold border-b">
                            <tr>
                                <th className="px-4 py-3 w-[180px]">Brand</th>
                                <th className="px-4 py-3 w-[180px]">Model</th>
                                <th className="px-4 py-3 w-[140px]">Codes</th>
                                <th className="px-4 py-3">Years (Tag)</th>
                                <th className="px-4 py-3 w-[120px]">Type</th>
                                <th className="px-4 py-3 w-[50px]"></th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {groupedVehicles.map((group) => (
                                <tr key={group.groupId} className="hover:bg-slate-50 group">
                                    <td className="px-4 py-3 align-top">
                                        <input 
                                            value={group.make} 
                                            onChange={e => handleGroupChange(group.groupId, 'make', e.target.value)}
                                            className="w-full bg-white border border-slate-200 rounded font-bold text-slate-900 px-2 py-1 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all text-sm"
                                        />
                                    </td>
                                    <td className="px-4 py-3 align-top">
                                        <input 
                                            value={group.model} 
                                            onChange={e => handleGroupChange(group.groupId, 'model', e.target.value)}
                                            className="w-full bg-white border border-slate-200 rounded text-slate-900 px-2 py-1 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all text-sm"
                                        />
                                    </td>
                                    <td className="px-4 py-3 align-top">
                                        <input 
                                            value={group.chassisCode} 
                                            onChange={e => handleGroupChange(group.groupId, 'chassisCode', e.target.value)}
                                            className="w-full bg-white border border-slate-200 rounded text-xs text-slate-900 px-2 py-1 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 mb-1 transition-all"
                                            placeholder="Chassis"
                                        />
                                    </td>
                                    <td className="px-4 py-3 align-top">
                                        <div className="flex flex-wrap gap-1.5 p-1 bg-slate-50 rounded border border-slate-100 min-h-[32px]">
                                            {group.years.map(year => (
                                                <span key={year} className="bg-white text-blue-700 px-2 py-0.5 rounded text-[11px] font-bold border border-blue-200 flex items-center gap-1 shadow-sm group/tag">
                                                    {year}
                                                    <button 
                                                        onClick={() => handleRemoveYearTag(group.groupId, year)}
                                                        className="hover:text-red-500 hidden group-hover/tag:block"
                                                    >
                                                        <X className="h-3 w-3" />
                                                    </button>
                                                </span>
                                            ))}
                                            <input 
                                                type="number"
                                                className="w-12 bg-white border border-slate-300 rounded px-1 text-xs focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 text-slate-900 transition-all placeholder:text-slate-400"
                                                placeholder="Add+"
                                                onKeyDown={(e) => {
                                                    if (e.key === 'Enter') {
                                                        handleAddYearTag(group.groupId, e.currentTarget.value);
                                                        e.currentTarget.value = '';
                                                    }
                                                }}
                                            />
                                        </div>
                                    </td>
                                    <td className="px-4 py-3 align-top">
                                         <select 
                                            value={group.bodyType}
                                            onChange={e => handleGroupChange(group.groupId, 'bodyType', e.target.value)}
                                            className="w-full bg-white border border-slate-200 rounded text-xs text-slate-900 px-2 py-1 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                                         >
                                             <option>Sedan</option>
                                             <option>Hatchback</option>
                                             <option>SUV</option>
                                             <option>Van</option>
                                             <option>Truck</option>
                                             <option>Crossover</option>
                                         </select>
                                    </td>
                                    <td className="px-4 py-3 align-middle text-right">
                                         {/* Full Group Delete would be complex, skipping for demo simplicity */}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        )}

        {/* VENDORS & USERS TABS (Simplified placeholders as per previous implementation) */}
        {activeTab === 'vendors' && <div className="p-4">Manage Vendors here...</div>}
        {activeTab === 'users' && <div className="p-4">Manage Users here...</div>}
      </main>
    </div>
  );
};
