import React, { useState } from 'react';
import { Send, Loader2 } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { Button } from '../components/ui/Button';
import { useNotification } from '../context/NotificationContext';
import { api } from '../services/api';

export const Feedback: React.FC = () => {
    const { setView, currentUser } = useApp();
    const { notify } = useNotification();
    const [feedback, setFeedback] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async () => {
        if (!feedback.trim()) return;

        setIsSubmitting(true);
        try {
            await api.submitFeedback({
                userId: currentUser?.id || 'guest',
                userName: currentUser?.name || 'Guest User',
                type: 'feedback',
                content: feedback
            });

            notify('success', 'Thank you for your feedback!');
            setFeedback('');
            setView('my-account');
        } catch (error) {
            console.error(error);
            notify('error', 'Failed to submit feedback.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="bg-white min-h-screen px-4 pt-6 pb-24">
            <p className="text-slate-600 mb-6 text-base leading-relaxed">
                Tell us what you think! We appreciate your suggestions.
            </p>

            <div className="mb-6">
                <textarea
                    value={feedback}
                    onChange={(e) => setFeedback(e.target.value)}
                    placeholder="Type your feedback here..."
                    className="w-full h-40 p-4 border border-slate-200 rounded-xl text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent resize-none bg-white shadow-sm"
                />
            </div>

            <Button
                onClick={handleSubmit}
                disabled={!feedback.trim() || isSubmitting}
                className="w-full bg-orange-600 hover:bg-orange-700 text-white font-bold py-3 rounded-xl flex items-center justify-center gap-2"
            >
                {isSubmitting ? (
                    'Submitting...'
                ) : (
                    <>
                        <Send className="h-4 w-4" /> Submit Feedback
                    </>
                )}
            </Button>
        </div>
    );
};
