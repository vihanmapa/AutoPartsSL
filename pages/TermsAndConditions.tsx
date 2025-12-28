import React from 'react';
import { FileText, Shield, AlertTriangle } from 'lucide-react';

export const TermsAndConditions: React.FC = () => {
    return (
        <div className="bg-slate-50 min-h-screen px-4 py-8 pb-24">
            <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-sm border border-slate-100 p-6 md:p-10">

                <div className="text-center mb-10">
                    <div className="bg-blue-50 h-16 w-16 rounded-full flex items-center justify-center mx-auto mb-4">
                        <FileText className="h-8 w-8 text-blue-600" />
                    </div>
                    <h1 className="text-2xl md:text-3xl font-bold text-slate-900 mb-2">Terms and Conditions of Service</h1>
                    <p className="text-slate-500 text-sm">Last Updated: December 2025</p>
                </div>

                <div className="prose prose-slate max-w-none prose-headings:font-bold prose-headings:text-slate-900 prose-p:text-slate-600 prose-li:text-slate-600 text-sm md:text-base">

                    <section className="mb-8">
                        <h3>1. Introduction and Acceptance</h3>
                        <p>
                            Welcome to AutoPartsSL ("the Platform"), a digital marketplace operated by [Your Company Legal Name] ("the Company," "we," "us"). By accessing or using our mobile application and website, you agree to be bound by these Terms and Conditions ("Terms"). If you do not agree to these Terms, you may not use the Platform.
                        </p>
                    </section>

                    <section className="mb-8">
                        <h3>2. The Marketplace Model</h3>
                        <p>AutoPartsSL acts solely as a venue to connect Buyers with third-party Sellers of automotive parts.</p>
                        <ul className="list-disc pl-5 space-y-1">
                            <li><strong>We are not the Seller:</strong> Unless explicitly stated, AutoPartsSL does not own, store, or sell the inventory listed on the Platform. The contract of sale is directly between the Buyer and the Seller.</li>
                            <li><strong>No Agency:</strong> No agency, partnership, joint venture, or employee-employer relationship is intended or created by these Terms.</li>
                        </ul>
                    </section>

                    <section className="mb-8">
                        <h3>3. The "VIN-Lock" Fitment Guarantee</h3>
                        <p>To ensure product compatibility, especially for European vehicle parts, the Platform operates a strict Vehicle Identification Number (VIN) policy.</p>

                        <h4 className="text-sm font-bold text-slate-800 uppercase mt-4 mb-2">3.1. The Guarantee</h4>
                        <p>If a Buyer provides a correct VIN at the time of purchase and the Seller confirms compatibility, the transaction is covered by our Fitment Guarantee. If the part does not fit the vehicle associated with that VIN, the Buyer is entitled to a full refund, including return shipping costs.</p>

                        <h4 className="text-sm font-bold text-slate-800 uppercase mt-4 mb-2">3.2. Waiver of Rights (No VIN)</h4>
                        <p>If a Buyer chooses to purchase a part without providing a VIN (or provides an incorrect VIN), the Buyer acknowledges that:</p>
                        <ul className="list-disc pl-5 space-y-1">
                            <li>They are relying solely on their own judgment regarding compatibility.</li>
                            <li>They waive the right to return the item based on "non-compatibility" or "wrong fitment."</li>
                            <li>Returns will only be accepted at the Seller’s discretion, subject to a Restocking Fee of up to 20%.</li>
                        </ul>
                    </section>

                    <section className="mb-8">
                        <h3>4. Payment and "T+3" Escrow Service</h3>
                        <p>To protect both parties, AutoPartsSL facilitates payments through a secure Escrow system.</p>
                        <ul className="list-disc pl-5 space-y-1">
                            <li><strong>4.1. Payment Processing:</strong> Buyers pay the Platform (not the Seller) at the time of order. We hold these funds in a secure account.</li>
                            <li><strong>4.2. Release of Funds (T+3 Rule):</strong> Funds are released to the Seller 72 hours (3 days) after the courier marks the order as "Delivered" ("The Inspection Window"), provided no Dispute is raised by the Buyer.</li>
                            <li><strong>4.3. Currency:</strong> All transactions are processed in Sri Lankan Rupees (LKR).</li>
                        </ul>
                    </section>

                    <section className="mb-8">
                        <h3>5. Shipping and Delivery</h3>
                        <ul className="list-disc pl-5 space-y-1">
                            <li><strong>Seller Responsibility:</strong> Sellers are responsible for packaging items securely to prevent damage. Sellers must dispatch items within the timeframe specified in the listing (typically 24-48 hours).</li>
                            <li><strong>Risk of Loss:</strong> Risk of loss transfers to the Buyer upon delivery by the courier.</li>
                            <li><strong>Delays:</strong> AutoPartsSL is not liable for delays caused by third-party courier services or force majeure events (e.g., floods, strikes).</li>
                        </ul>
                    </section>

                    <section className="mb-8">
                        <h3>6. Returns, Refunds, and Disputes</h3>
                        <h4 className="text-sm font-bold text-slate-800 uppercase mt-4 mb-2">6.1. The 72-Hour Inspection Window</h4>
                        <p>Buyers have 72 hours from the time of delivery to inspect the part. Any issues must be reported via the "Report Issue" button in the App within this window. Claims made after 72 hours will be rejected.</p>

                        <h4 className="text-sm font-bold text-slate-800 uppercase mt-4 mb-2">6.2. Valid Reasons for Return</h4>
                        <ul className="list-disc pl-5 space-y-1">
                            <li>Item is Different from Description (e.g., wrong brand, wrong side).</li>
                            <li>Item is Damaged/Defective (physical damage not disclosed in the listing/video).</li>
                            <li>Item is Incompatible (ONLY if VIN was verified).</li>
                        </ul>

                        <h4 className="text-sm font-bold text-slate-800 uppercase mt-4 mb-2">6.3. Electronic Parts Policy (Crucial)</h4>
                        <div className="bg-orange-50 border-l-4 border-orange-400 p-4 mb-4">
                            <p className="font-bold text-orange-800">For ECUs, Sensors, Modules, and other electronic components:</p>
                            <ul className="list-disc pl-5 space-y-1 mt-2 text-orange-900 text-sm">
                                <li><strong>Hardware Guarantee Only:</strong> We guarantee the unit is physically functional.</li>
                                <li><strong>No Returns for Coding/Programming:</strong> We do not accept returns if the part requires coding, programming, or adaptation by a mechanic and fails due to lack of technical expertise.</li>
                                <li><strong>Defect Proof:</strong> To return an electronic part as "Defective," the Buyer must provide a diagnostic report from a certified workshop.</li>
                            </ul>
                        </div>

                        <h4 className="text-sm font-bold text-slate-800 uppercase mt-4 mb-2">6.4. Return Shipping Costs</h4>
                        <ul className="list-disc pl-5 space-y-1">
                            <li><strong>Seller Fault:</strong> Seller pays return shipping (e.g., wrong item sent).</li>
                            <li><strong>Buyer Fault:</strong> Buyer pays return shipping (e.g., ordered wrong part without VIN).</li>
                        </ul>
                    </section>

                    <section className="mb-8">
                        <h3>7. Product Condition Grades</h3>
                        <p>Sellers must classify used parts according to the Platform’s grading scale:</p>
                        <ul className="list-disc pl-5 space-y-1">
                            <li><strong>Grade A+ (Museum):</strong> &lt;20,000km, Mint Condition, No broken tabs.</li>
                            <li><strong>Grade A (Driver):</strong> Fully functional, minor cosmetic wear.</li>
                            <li><strong>Grade B (Workshop):</strong> Functional but may have repaired tabs or visible imperfections (must be disclosed).</li>
                        </ul>
                        <p className="mt-2 text-xs italic"><strong>Condition Disputes:</strong> If a Buyer disputes the condition (e.g., "This is Grade B, not A"), the Platform will review the listing photos/video. The Platform’s decision is final.</p>
                    </section>

                    <section className="mb-8">
                        <h3>8. User Conduct and Prohibited Items</h3>
                        <p>Users may not list or solicit:</p>
                        <ul className="list-disc pl-5 space-y-1">
                            <li>Stolen property.</li>
                            <li>Parts that are illegal to sell in Sri Lanka.</li>
                            <li>Counterfeit items claiming to be "Genuine."</li>
                            <li>Contact information to take the transaction "off-platform" (circumventing fees). Violation results in immediate account suspension.</li>
                        </ul>
                    </section>

                    <section className="mb-8">
                        <h3>9. Limitation of Liability</h3>
                        <div className="bg-slate-100 p-4 rounded-lg uppercase text-xs font-bold text-slate-600">
                            <p>TO THE FULLEST EXTENT PERMITTED BY LAW IN SRI LANKA:</p>
                            <p className="mt-2">AUTOPARTSSL IS PROVIDED "AS IS."</p>
                            <p className="mt-2">WE EXPRESSLY DISCLAIM ALL WARRANTIES, INCLUDING IMPLIED WARRANTIES OF MERCHANTABILITY OR FITNESS FOR A PARTICULAR PURPOSE.</p>
                            <p className="mt-2">WE ARE NOT LIABLE FOR ANY CONSEQUENTIAL DAMAGES, LOST PROFITS, OR MECHANIC LABOR COSTS INCURRED BY THE BUYER DUE TO A DEFECTIVE PART. (Our liability is strictly limited to the purchase price of the part).</p>
                        </div>
                    </section>

                    <section>
                        <h3>10. Governing Law</h3>
                        <p>These Terms shall be governed by and construed in accordance with the laws of the Democratic Socialist Republic of Sri Lanka. Any disputes arising under these Terms shall be subject to the exclusive jurisdiction of the courts of Colombo.</p>
                    </section>

                </div>
            </div>
        </div>
    );
};
