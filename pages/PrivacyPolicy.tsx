import React from 'react';
import { Shield, AlertTriangle, FileText } from 'lucide-react';

export const PrivacyPolicy: React.FC = () => {
    return (
        <div className="bg-slate-50 min-h-screen px-4 py-8 pb-24">
            <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-sm border border-slate-100 p-6 md:p-10">

                <div className="text-center mb-10">
                    <div className="bg-blue-50 h-16 w-16 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Shield className="h-8 w-8 text-blue-600" />
                    </div>
                    <h1 className="text-2xl md:text-3xl font-bold text-slate-900 mb-2">Privacy Policy</h1>
                    <p className="text-slate-500 text-sm">Effective Date: December 2025 &bull; Version: 1.0</p>
                </div>

                <div className="bg-orange-50 border border-orange-200 rounded-xl p-4 mb-8 flex items-start gap-3">
                    <AlertTriangle className="h-5 w-5 text-orange-600 shrink-0 mt-0.5" />
                    <p className="text-sm text-orange-800">
                        <strong>LEGAL NOTE:</strong> This is a template compliant with Sri Lanka’s Personal Data Protection Act, No. 9 of 2022 (PDPA).
                    </p>
                </div>

                <div className="prose prose-slate max-w-none prose-headings:font-bold prose-headings:text-slate-900 prose-p:text-slate-600 prose-li:text-slate-600">

                    <section className="mb-8">
                        <h3>1. Introduction</h3>
                        <p>
                            AutoPartsSL ("We," "Us," "Our") is committed to protecting your privacy. This Privacy Policy outlines how we collect, use, disclose, and safeguard your information when you use our mobile application and website (the "Platform").
                        </p>
                        <p>
                            We operate in compliance with the <strong>Personal Data Protection Act, No. 9 of 2022</strong> of the Democratic Socialist Republic of Sri Lanka.
                        </p>
                    </section>

                    <section className="mb-8">
                        <h3>2. Information We Collect</h3>
                        <p>We collect data necessary to facilitate the purchase, sale, and delivery of automotive parts.</p>

                        <h4 className="text-sm font-bold text-slate-800 uppercase mt-4 mb-2">2.1. Personal Data (Directly Provided by You)</h4>
                        <ul className="list-disc pl-5 space-y-1">
                            <li><strong>Identity Data:</strong> Name, National Identity Card (NIC) number (for Seller verification).</li>
                            <li><strong>Contact Data:</strong> Phone number, email address, physical delivery address.</li>
                            <li><strong>Financial Data:</strong> Bank account details (for Seller payouts) and Credit/Debit card tokens (processed securely via third-party gateways; we do not store raw card numbers).</li>
                        </ul>

                        <h4 className="text-sm font-bold text-slate-800 uppercase mt-4 mb-2">2.2. Vehicle Data (The "VIN" Policy)</h4>
                        <ul className="list-disc pl-5 space-y-1">
                            <li><strong>VIN / Chassis Number:</strong> We collect your Vehicle Identification Number (VIN) to verify part compatibility.</li>
                            <li><strong>Vehicle Specs:</strong> Make, Model, Year, Engine Code.</li>
                            <li><strong>Legal Context:</strong> Under this policy, we treat your VIN as Personal Data because it can be linked to your specific ownership history.</li>
                        </ul>

                        <h4 className="text-sm font-bold text-slate-800 uppercase mt-4 mb-2">2.3. Technical Data</h4>
                        <p>IP address, device type, operating system, and location data (to show nearby sellers/mechanics).</p>
                    </section>

                    <section className="mb-8">
                        <h3>3. How We Use Your Data</h3>
                        <p>We process your data for the following specific purposes:</p>
                        <ul className="list-disc pl-5 space-y-2">
                            <li><strong>Order Fulfillment:</strong> Sharing your address and phone number with the Seller and Courier to deliver your part.</li>
                            <li><strong>Fitment Verification:</strong> Sharing your VIN with the Seller to check against their Electronic Parts Catalog (EPC) to ensure the part fits.</li>
                            <li><strong>Trust & Safety (Escrow):</strong> Holding your payment data to manage the "T+3" Escrow Release (releasing funds 3 days after delivery).</li>
                            <li><strong>Dispute Resolution:</strong> Using your chat history and photo uploads to resolve claims between Buyers and Sellers.</li>
                        </ul>
                    </section>

                    <section className="mb-8">
                        <h3>4. Data Sharing and Disclosure</h3>
                        <p>We do not sell your personal data. We only share it with:</p>
                        <ul className="list-disc pl-5 space-y-2">
                            <li><strong>Sellers:</strong> Your Name, Address, and VIN are shared only after you place an order.</li>
                            <li><strong>Mechanics (Optional):</strong> If you use the "Ship to Workshop" feature, we share your vehicle details and order info with your selected garage.</li>
                            <li><strong>Service Providers:</strong> Logistics companies (couriers), Payment Gateways (e.g., PayHere, WebxPay), and SMS providers.</li>
                            <li><strong>Legal Authorities:</strong> If required by Sri Lankan law or a court order.</li>
                        </ul>
                    </section>

                    <section className="mb-8">
                        <h3>5. Data Storage and Security</h3>
                        <ul className="list-disc pl-5 space-y-2">
                            <li><strong>Location:</strong> Your data is stored on secure cloud servers (e.g., AWS/Google Cloud) compliant with international security standards.</li>
                            <li><strong>Retention:</strong> We retain transaction records for 5 years to comply with Sri Lankan tax and accounting laws.</li>
                            <li><strong>VIN Data:</strong> VINs are stored permanently attached to your "Garage" profile to make future searches faster, unless you delete them.</li>
                        </ul>
                    </section>

                    <section className="mb-8">
                        <h3>6. Your Rights (Under Sri Lanka PDPA No. 9 of 2022)</h3>
                        <p>As a user in Sri Lanka, you have the following rights:</p>
                        <ul className="list-disc pl-5 space-y-2">
                            <li><strong>Right to Access:</strong> You may request a copy of all data we hold about you.</li>
                            <li><strong>Right to Rectification:</strong> You can correct wrong details (e.g., update your phone number).</li>
                            <li><strong>Right to Erasure:</strong> You can request to delete your account (subject to pending orders or legal retention requirements).</li>
                            <li><strong>Right to Withdraw Consent:</strong> You may withdraw consent for marketing messages at any time.</li>
                        </ul>
                    </section>

                    <section className="mb-8">
                        <h3>7. The "Euro-Spec" Clause (Third-Party Data)</h3>
                        <p>For European vehicle parts, we may use third-party VIN decoding services (e.g., 17VIN). By entering your VIN, you consent to us sending this number to these third-party APIs solely for the purpose of retrieving vehicle specifications.</p>
                    </section>

                    <section>
                        <h3>8. Contact Us</h3>
                        <p>To exercise your rights or report a privacy concern, please contact our Data Protection Officer (DPO):</p>
                        <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 mt-4 not-prose">
                            <p className="text-sm text-slate-700 mb-1"><strong>Email:</strong> <a href="mailto:privacy@glenfitec.com" className="text-blue-600 hover:underline">privacy@glenfitec.com</a></p>
                            <p className="text-sm text-slate-700 mb-1"><strong>Address:</strong> Elegance, Colombo 03, Sri Lanka</p>
                            <p className="text-sm text-slate-700"><strong>Phone:</strong> +94 77 77 144 14</p>
                        </div>
                    </section>

                </div>
            </div>
        </div>
    );
};
