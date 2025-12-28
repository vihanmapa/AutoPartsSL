import React from 'react';
import { Phone, Mail, MapPin, Clock, MessageCircle } from 'lucide-react';

export const ContactUs: React.FC = () => {
    return (
        <div className="bg-white min-h-screen pb-20">
            <div className="p-4">
                <p className="text-slate-600 mb-6 leading-relaxed">
                    We're here to help! Reach out to us via any of the channels below.
                </p>

                <div className="space-y-4">
                    {/* Phone & WhatsApp */}
                    <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                        <div className="flex items-center gap-4 mb-3">
                            <div className="h-10 w-10 bg-orange-100 rounded-full flex items-center justify-center shrink-0">
                                <Phone className="h-5 w-5 text-orange-600" />
                            </div>
                            <div>
                                <p className="text-xs text-slate-500 font-medium mb-0.5">Customer Support</p>
                                <p className="text-slate-900 font-bold text-lg">
                                    (077) 77 144 14
                                </p>
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                            <a
                                href="tel:+94777714414"
                                className="flex items-center justify-center gap-2 bg-white border border-slate-200 py-2 rounded-lg text-sm font-bold text-slate-700 hover:bg-slate-50 transition-colors"
                            >
                                <Phone className="h-4 w-4" /> Call
                            </a>
                            <a
                                href="https://wa.me/94777714414"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center justify-center gap-2 bg-green-50 border border-green-200 py-2 rounded-lg text-sm font-bold text-green-700 hover:bg-green-100 transition-colors"
                            >
                                <MessageCircle className="h-4 w-4" /> WhatsApp
                            </a>
                        </div>
                    </div>

                    {/* Email */}
                    <div className="bg-slate-50 p-4 rounded-xl flex items-center gap-4 border border-slate-100">
                        <div className="h-10 w-10 bg-orange-100 rounded-full flex items-center justify-center shrink-0">
                            <Mail className="h-5 w-5 text-orange-600" />
                        </div>
                        <div>
                            <p className="text-xs text-slate-500 font-medium mb-0.5">Email Support</p>
                            <a href="mailto:hello@glenfitec.com" className="text-slate-900 font-bold text-lg hover:underline break-all">
                                hello@glenfitec.com
                            </a>
                        </div>
                    </div>

                    {/* Address */}
                    <div className="bg-slate-50 p-4 rounded-xl flex items-center gap-4 border border-slate-100">
                        <div className="h-10 w-10 bg-orange-100 rounded-full flex items-center justify-center shrink-0">
                            <MapPin className="h-5 w-5 text-orange-600" />
                        </div>
                        <div>
                            <p className="text-xs text-slate-500 font-medium mb-0.5">Headquarters</p>
                            <p className="text-slate-900 font-bold text-lg leading-tight">
                                Elegance, Colombo 03, Sri Lanka
                            </p>
                        </div>
                    </div>

                    {/* Support Hours - User requested specifically */}
                    <div className="bg-slate-50 p-4 rounded-xl flex items-start gap-4 border border-slate-100">
                        <div className="h-10 w-10 bg-blue-100 rounded-full flex items-center justify-center shrink-0">
                            <Clock className="h-5 w-5 text-blue-600" />
                        </div>
                        <div>
                            <p className="text-xs text-slate-500 font-medium mb-1">Support Available</p>
                            <div className="space-y-1">
                                <div className="flex justify-between gap-8 text-sm">
                                    <span className="text-slate-600">Mon - Fri:</span>
                                    <span className="font-bold text-slate-900">9:00 AM - 6:00 PM</span>
                                </div>
                                <div className="flex justify-between gap-8 text-sm">
                                    <span className="text-slate-600">Saturday:</span>
                                    <span className="font-bold text-slate-900">9:00 AM - 1:00 PM</span>
                                </div>
                                <div className="flex justify-between gap-8 text-sm">
                                    <span className="text-slate-600">Sunday:</span>
                                    <span className="font-bold text-slate-500">Closed</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
