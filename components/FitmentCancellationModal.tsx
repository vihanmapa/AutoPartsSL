import React, { useState } from 'react';
import { X, AlertTriangle } from 'lucide-react';
import { Button } from './ui/Button';

interface FitmentCancellationModalProps {
    orderId: string;
    vin: string;
    vehicleName: string; // e.g., "Toyota Prius" - derived from order items or explicit logic
    isOpen: boolean;
    onClose: () => void;
    onConfirm: (reason: string, description: string) => Promise<void>;
}

export const FitmentCancellationModal: React.FC<FitmentCancellationModalProps> = ({
    orderId,
    vin,
    vehicleName,
    isOpen,
    onClose,
    onConfirm
}) => {
    const [reason, setReason] = useState<'vin_mismatch' | 'stock_issue' | 'other' | ''>('');
    const [description, setDescription] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    if (!isOpen) return null;

    const handleSubmit = async () => {
        if (!reason || isSubmitting) return;

        setIsSubmitting(true);
        try {
            await onConfirm(reason, description);
            // Don't close here, let parent handle it or close after success
            // But typically we close on success.
            onClose();
        } catch (error) {
            console.error("Cancellation failed", error);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in duration-200">
                <div className="bg-red-50 p-4 border-b border-red-100 flex justify-between items-center">
                    <h3 className="font-bold text-red-800 flex items-center gap-2">
                        <AlertTriangle className="h-5 w-5" />
                        Fitment Failure & Cancellation
                    </h3>
                    <button onClick={onClose} className="text-red-400 hover:text-red-700">
                        <X className="h-5 w-5" />
                    </button>
                </div>

                <div className="p-6 space-y-4">
                    <p className="text-sm text-slate-600">
                        You are about to cancel <strong>Order #{orderId.slice(0, 8)}</strong> because the part does not fit the provided VIN. This will automatically refund the buyer.
                    </p>

                    <div className="bg-slate-50 p-3 rounded text-sm font-mono border border-slate-200">
                        <div>VIN: <span className="font-bold">{vin}</span></div>
                        <div className="mt-1">Part Vehicle: <span className="font-bold">{vehicleName}</span></div>
                    </div>

                    <div className="space-y-3">
                        <label className="block text-sm font-medium text-slate-700">Reason for Mismatch</label>

                        <div className="space-y-2">
                            <label className="flex items-center gap-2 p-3 border rounded cursor-pointer hover:bg-slate-50">
                                <input
                                    type="radio"
                                    name="reason"
                                    value="vin_mismatch"
                                    checked={reason === 'vin_mismatch'}
                                    onChange={() => setReason('vin_mismatch')}
                                    className="text-red-600 focus:ring-red-500"
                                />
                                <div className="text-sm">
                                    <span className="font-bold block">Wrong Make/Model</span>
                                    <span className="text-slate-500 text-xs">VIN is BMW, Part is Toyota etc.</span>
                                </div>
                            </label>

                            <label className="flex items-center gap-2 p-3 border rounded cursor-pointer hover:bg-slate-50">
                                <input
                                    type="radio"
                                    name="reason"
                                    value="stock_issue"
                                    checked={reason === 'stock_issue'}
                                    onChange={() => setReason('stock_issue')}
                                    className="text-red-600 focus:ring-red-500"
                                />
                                <div className="text-sm">
                                    <span className="font-bold block">Wrong Year / Generation</span>
                                    <span className="text-slate-500 text-xs">Pre-facelift vs Facelift etc.</span>
                                </div>
                            </label>

                            <label className="flex items-center gap-2 p-3 border rounded cursor-pointer hover:bg-slate-50">
                                <input
                                    type="radio"
                                    name="reason"
                                    value="other"
                                    checked={reason === 'other'}
                                    onChange={() => setReason('other')}
                                    className="text-red-600 focus:ring-red-500"
                                />
                                <div className="text-sm">
                                    <span className="font-bold block">Configuration Mismatch</span>
                                    <span className="text-slate-500 text-xs">Base model vs Sports trim etc.</span>
                                </div>
                            </label>
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Additional Notes (Optional)</label>
                        <textarea
                            className="w-full p-2 border rounded text-sm focus:ring-2 focus:ring-red-500 focus:border-red-500"
                            rows={2}
                            placeholder="e.g. Recommended part number is..."
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                        />
                    </div>

                    <div className="pt-2">
                        <Button
                            fullWidth
                            variant="primary"
                            className="bg-red-600 hover:bg-red-700 text-white"
                            onClick={handleSubmit}
                            disabled={!reason || isSubmitting}
                        >
                            {isSubmitting ? 'Processing...' : 'Confirm Cancellation & Refund'}
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
};
