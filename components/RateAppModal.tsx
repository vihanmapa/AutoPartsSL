import React, { useState } from 'react';
import { Star, X, Car } from 'lucide-react';
import { useNotification } from '../context/NotificationContext';
import { motion, AnimatePresence } from 'framer-motion';
import { api } from '../services/api';
import { useApp } from '../context/AppContext';

interface RateAppModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export const RateAppModal: React.FC<RateAppModalProps> = ({ isOpen, onClose }) => {
    const { notify } = useNotification();
    const { currentUser } = useApp();
    const [rating, setRating] = useState(0);

    const handleRate = async (starIndex: number) => {
        setRating(starIndex);

        try {
            await api.submitFeedback({
                userId: currentUser?.id || 'guest',
                userName: currentUser?.name || 'Guest User',
                type: 'rating',
                content: starIndex
            });
            notify('success', 'Thank you for your rating!');
        } catch (e) {
            console.error(e);
        }

        // Simulate a slight delay before closing for better UX
        setTimeout(() => {
            onClose();
            setRating(0); // Reset for next time
        }, 600);
    };

    if (!isOpen) return null;

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="bg-white rounded-3xl p-8 w-full max-w-sm text-center shadow-2xl relative"
                >
                    {/* App Logo */}
                    <div className="h-20 w-20 bg-[#EF580F] rounded-2xl mx-auto mb-6 flex items-center justify-center shadow-lg shadow-orange-200">
                        <Car className="h-10 w-10 text-white" strokeWidth={2.5} />
                    </div>

                    <h2 className="text-2xl font-extrabold text-[#0F172A] mb-2">Enjoying the App?</h2>

                    <p className="text-slate-500 mb-8 px-2 font-medium">
                        Tap a star to rate it on the App Store.
                    </p>

                    {/* Stars */}
                    <div className="flex justify-center gap-3 mb-8">
                        {[1, 2, 3, 4, 5].map((star) => (
                            <button
                                key={star}
                                onClick={() => handleRate(star)}
                                className="transition-transform hover:scale-110 active:scale-95 focus:outline-none"
                            >
                                <Star
                                    className={`h-9 w-9 ${star <= rating ? 'fill-[#FFC107] text-[#FFC107]' : 'text-slate-200 fill-slate-200'}`}
                                />
                            </button>
                        ))}
                    </div>

                    {/* No Thanks */}
                    <button
                        onClick={onClose}
                        className="text-slate-400 font-bold text-sm hover:text-slate-600 transition-colors"
                    >
                        No, Thanks
                    </button>

                </motion.div>
            </div>
        </AnimatePresence>
    );
};
