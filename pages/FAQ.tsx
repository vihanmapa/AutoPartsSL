import React, { useState } from 'react';
import { ChevronDown, ChevronUp, AlertCircle, ShieldCheck, HelpCircle } from 'lucide-react';

interface FAQItemProps {
    question: string;
    answer: React.ReactNode;
}

const FAQItem: React.FC<FAQItemProps> = ({ question, answer }) => {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden mb-4">
            <button
                className="w-full flex items-center justify-between p-4 text-left hover:bg-slate-50 transition-colors"
                onClick={() => setIsOpen(!isOpen)}
            >
                <div className="flex items-center gap-3">
                    <HelpCircle className="h-5 w-5 text-orange-500 shrink-0" />
                    <span className="font-bold text-slate-900 text-sm md:text-base">{question}</span>
                </div>
                {isOpen ? <ChevronUp className="h-5 w-5 text-slate-400" /> : <ChevronDown className="h-5 w-5 text-slate-400" />}
            </button>
            {isOpen && (
                <div className="p-4 pt-0 text-slate-600 text-sm leading-relaxed border-t border-slate-50 bg-slate-50/50">
                    <div className="mt-4 space-y-4">
                        {answer}
                    </div>
                </div>
            )}
        </div>
    );
};

export const FAQ: React.FC = () => {
    return (
        <div className="bg-slate-50 min-h-screen px-4 py-6 pb-24">
            <div className="max-w-3xl mx-auto">
                <div className="mb-8 text-center">
                    <h2 className="text-2xl font-bold text-slate-900 mb-2">Frequently Asked Questions</h2>
                    <p className="text-slate-500 text-sm">Everything you need to know about parts, returns, and guarantees.</p>
                </div>

                <div className="space-y-2">
                    <FAQItem
                        question="Why do I have to provide my VIN?"
                        answer={
                            <>
                                <p>European cars (BMW, Benz, Audi) change parts every few months. The only way to guarantee a part fits your specific car is to match it with your VIN (Vehicle Identification Number).</p>
                                <div className="bg-white p-3 rounded-lg border border-slate-200 shadow-sm mt-3">
                                    <div className="flex items-start gap-2 mb-2">
                                        <ShieldCheck className="h-4 w-4 text-green-600 mt-0.5" />
                                        <p className="text-xs text-slate-700"><strong>The Guarantee:</strong> If you provide your VIN and the seller sends a part that doesn't fit, you get a 100% Refund (including shipping).</p>
                                    </div>
                                    <div className="flex items-start gap-2">
                                        <AlertCircle className="h-4 w-4 text-red-500 mt-0.5" />
                                        <p className="text-xs text-slate-700"><strong>The Risk:</strong> If you skip the VIN check, you waive your right to return the item for incompatibility.</p>
                                    </div>
                                </div>
                            </>
                        }
                    />

                    <FAQItem
                        question='How does the "Money Back Guarantee" work? (T+3 Protection)'
                        answer={
                            <>
                                <p>We do not release your money to the seller immediately. When you pay, AutoPartsSL holds your funds in a secure account.</p>
                                <ul className="list-disc pl-5 space-y-2 mt-2">
                                    <li>Once the courier marks the item as "Delivered," you have <strong>3 Days (72 Hours)</strong> to inspect the part.</li>
                                    <li>If it works, we release the money to the seller.</li>
                                    <li>If it is broken or wrong, click "Report Issue" within 3 days, and we freeze the payment until the issue is resolved.</li>
                                </ul>
                            </>
                        }
                    />

                    <FAQItem
                        question="Can I return an electronic part (Sensor, ECU, Module)?"
                        answer={
                            <>
                                <p>Yes, but only if it is physically defective.</p>
                                <div className="bg-orange-50 p-3 rounded-lg border border-orange-100 mt-3 text-orange-900 text-xs">
                                    <strong>Important:</strong> We do not accept returns for "Coding Errors." Many modern parts require a mechanic to program/code them to your car. If your mechanic cannot code the part, that is not a defect. We recommend shipping complex electronics directly to a qualified workshop.
                                </div>
                            </>
                        }
                    />

                    <FAQItem
                        question="How do I return an item?"
                        answer={
                            <p>You should contact the shop owner for any returns or specific instructions on how to return a product.</p>
                        }
                    />
                </div>
            </div>
        </div>
    );
};
