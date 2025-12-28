import React from 'react';
import { useApp } from '../context/AppContext';
import { Package, Heart, User, Settings, HelpCircle, ChevronRight, LogOut, Phone, ShieldCheck, FileText, Store, MessageSquare, ThumbsUp, Star, Car } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { RateAppModal } from '../components/RateAppModal';

export const Profile: React.FC = () => {
    const { currentUser, setView, logout, openAuthModal } = useApp();
    const [showRateModal, setShowRateModal] = React.useState(false);

    const isGuest = currentUser?.id === 'u1';

    // --- Guest View Components ---
    if (isGuest) {
        return (
            <div className="bg-slate-50 min-h-screen pb-32 px-4 pt-4">
                {/* Hero Section */}
                <div className="bg-white rounded-2xl p-8 shadow-sm border border-slate-100 mb-4 text-center">
                    <div className="h-20 w-20 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <User className="h-10 w-10 text-slate-400" />
                    </div>
                    <h2 className="text-xl font-bold text-slate-900 mb-2">Welcome, Guest!</h2>
                    <p className="text-slate-500 text-sm mb-6 max-w-xs mx-auto">
                        Sign in to save your garage, track orders, and get exclusive seller discounts.
                    </p>
                    <Button
                        className="w-full py-3 text-base font-bold mb-3 bg-orange-500 hover:bg-orange-600 text-white"
                        onClick={() => openAuthModal('login')}
                    >
                        Sign In
                    </Button>
                    <div className="text-sm text-slate-500">
                        Don't have an account?{' '}
                        <button
                            className="text-orange-500 font-bold hover:underline"
                            onClick={() => openAuthModal('register')}
                        >
                            Register
                        </button>
                    </div>
                </div>

                {/* Support & Legal Utilities */}
                <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden mb-4">
                    <div className="divide-y divide-slate-100">
                        <button className="w-full flex items-center justify-between p-4 hover:bg-slate-50 transition-colors" onClick={() => setView('contact-us')}>
                            <div className="flex items-center gap-3">
                                <div className="h-8 w-8 rounded-full bg-slate-100 flex items-center justify-center">
                                    <Phone className="h-4 w-4 text-slate-600" />
                                </div>
                                <div className="text-left">
                                    <span className="block text-sm font-medium text-slate-900">Contact Support</span>
                                    <span className="block text-xs text-slate-400">Mon-Fri, 9am - 6pm</span>
                                </div>
                            </div>
                            <ChevronRight className="h-4 w-4 text-slate-300" />
                        </button>
                        <button className="w-full flex items-center justify-between p-4 hover:bg-slate-50 transition-colors" onClick={() => setView('faq')}>
                            <div className="flex items-center gap-3">
                                <div className="h-8 w-8 rounded-full bg-slate-100 flex items-center justify-center">
                                    <HelpCircle className="h-4 w-4 text-slate-600" />
                                </div>
                                <span className="text-sm font-medium text-slate-900">FAQ & Help Center</span>
                            </div>
                            <ChevronRight className="h-4 w-4 text-slate-300" />
                        </button>
                        <button className="w-full flex items-center justify-between p-4 hover:bg-slate-50 transition-colors" onClick={() => setView('terms')}>
                            <div className="flex items-center gap-3">
                                <div className="h-8 w-8 rounded-full bg-slate-100 flex items-center justify-center">
                                    <ShieldCheck className="h-4 w-4 text-slate-600" />
                                </div>
                                <span className="text-sm font-medium text-slate-900">Privacy Policy</span>
                            </div>
                            <ChevronRight className="h-4 w-4 text-slate-300" />
                        </button>
                        <button className="w-full flex items-center justify-between p-4 hover:bg-slate-50 transition-colors" onClick={() => setView('privacy-policy')}>
                            <div className="flex items-center gap-3">
                                <div className="h-8 w-8 rounded-full bg-slate-100 flex items-center justify-center">
                                    <FileText className="h-4 w-4 text-slate-600" />
                                </div>
                                <span className="text-sm font-medium text-slate-900">Terms & Conditions</span>
                            </div>
                            <ChevronRight className="h-4 w-4 text-slate-300" />
                        </button>
                    </div>
                </div>

                {/* Seller Recruitment Banner */}
                <div className="bg-slate-900 rounded-2xl p-6 text-white mb-8 relative overflow-hidden">
                    <div className="relative z-10">
                        <div className="flex items-center gap-2 mb-2 text-orange-500 font-bold uppercase text-xs tracking-wider">
                            <Store className="h-4 w-4" /> Seller Zone
                        </div>
                        <h3 className="font-bold text-xl mb-2">Own a spare parts shop?</h3>
                        <p className="text-slate-400 text-sm mb-4">Join our marketplace today.</p>
                        <div className="flex flex-col items-start gap-3">
                            <Button
                                variant="secondary"
                                size="sm"
                                onClick={() => setView('register-vendor')}
                                className="bg-slate-700 hover:bg-slate-600 text-white border-none"
                            >
                                Join
                            </Button>
                            <button
                                onClick={() => setView('vendor-login')}
                                className="text-xs text-slate-400 hover:text-white transition-colors underline"
                            >
                                Already have a vendor account?
                            </button>
                        </div>
                    </div>
                    {/* Background decoration */}
                    <div className="absolute top-0 right-0 w-32 h-32 bg-orange-500 opacity-10 rounded-full blur-2xl transform translate-x-10 -translate-y-10"></div>
                </div>

                {/* Version Control */}
                <div className="text-center pb-8">
                    <p className="text-xs text-slate-400 font-mono">AutoParts App v1.0.2 (Beta)</p>
                </div>
            </div>
        );
    }

    // --- Logged In View Components (New) ---


    return (
        <div className="bg-white min-h-screen pb-32 px-6 pt-8">
            {/* Header */}
            <div className="flex justify-between items-start mb-8">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900 mb-1">Good Evening, {currentUser?.name?.split(' ')[0] || 'User'}</h1>
                    <p className="text-slate-500 text-sm mb-2">{currentUser?.email}</p>
                    <button
                        onClick={() => setView('profile-details')}
                        className="text-orange-500 font-bold text-sm hover:underline"
                    >
                        View Profile
                    </button>
                </div>
                <div></div>
            </div>

            {/* My Orders Section */}
            <div className="mb-4">
                <button
                    onClick={() => setView('my-purchase')}
                    className="w-full bg-white rounded-xl p-4 flex items-center justify-between shadow-sm border border-slate-100 hover:bg-slate-50 transition-colors group"
                >
                    <div className="flex items-center gap-4">
                        <div className="h-10 w-10 bg-blue-50 rounded-full flex items-center justify-center text-blue-600 group-hover:bg-blue-100 transition-colors">
                            <FileText className="h-5 w-5" />
                        </div>
                        <span className="text-base font-bold text-slate-900">My Orders</span>
                    </div>
                    <ChevronRight className="h-5 w-5 text-slate-300" />
                </button>
            </div >

            {/* My Garage Section */}
            <div className="mb-4">
                <button
                    onClick={() => setView('garage')}
                    className="w-full bg-white rounded-xl p-4 flex items-center justify-between shadow-sm border border-slate-100 hover:bg-slate-50 transition-colors group"
                >
                    <div className="flex items-center gap-4">
                        <div className="h-10 w-10 bg-orange-50 rounded-full flex items-center justify-center text-orange-600 group-hover:bg-orange-100 transition-colors">
                            <Car className="h-5 w-5" />
                        </div>
                        <span className="text-base font-bold text-slate-900">My Garage</span>
                    </div>
                    <ChevronRight className="h-5 w-5 text-slate-300" />
                </button>
            </div >

            {/* Support & Legal Section */}
            < div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden mb-8" >
                <div className="divide-y divide-slate-100">
                    <button
                        onClick={() => setView('contact-us')}
                        className="w-full flex items-center justify-between p-4 hover:bg-slate-50 transition-colors text-left"
                    >
                        <div className="flex items-center gap-4">
                            <div className="h-10 w-10 bg-slate-50 rounded-full flex items-center justify-center text-slate-600">
                                <Phone className="h-5 w-5" />
                            </div>
                            <div>
                                <span className="block text-sm font-bold text-slate-900">Contact Support</span>
                                <span className="block text-xs text-slate-400">Mon-Fri, 9am - 6pm</span>
                            </div>
                        </div>
                        <ChevronRight className="h-5 w-5 text-slate-300" />
                    </button>

                    <button
                        onClick={() => setView('faq')}
                        className="w-full flex items-center justify-between p-4 hover:bg-slate-50 transition-colors text-left"
                    >
                        <div className="flex items-center gap-4">
                            <div className="h-10 w-10 bg-slate-50 rounded-full flex items-center justify-center text-slate-600">
                                <HelpCircle className="h-5 w-5" />
                            </div>
                            <span className="text-sm font-bold text-slate-900">FAQ & Help Center</span>
                        </div>
                        <ChevronRight className="h-5 w-5 text-slate-300" />
                    </button>

                    <button
                        onClick={() => setView('privacy-policy')}
                        className="w-full flex items-center justify-between p-4 hover:bg-slate-50 transition-colors text-left"
                    >
                        <div className="flex items-center gap-4">
                            <div className="h-10 w-10 bg-slate-50 rounded-full flex items-center justify-center text-slate-600">
                                <ShieldCheck className="h-5 w-5" />
                            </div>
                            <span className="text-sm font-bold text-slate-900">Privacy Policy</span>
                        </div>
                        <ChevronRight className="h-5 w-5 text-slate-300" />
                    </button>

                    <button
                        onClick={() => setView('terms')}
                        className="w-full flex items-center justify-between p-4 hover:bg-slate-50 transition-colors text-left"
                    >
                        <div className="flex items-center gap-4">
                            <div className="h-10 w-10 bg-slate-50 rounded-full flex items-center justify-center text-slate-600">
                                <FileText className="h-5 w-5" />
                            </div>
                            <span className="text-sm font-bold text-slate-900">Terms & Conditions</span>
                        </div>
                        <ChevronRight className="h-5 w-5 text-slate-300" />
                    </button>
                </div>
            </div >

            {/* Feedback Grid */}
            < div className="mb-8" >
                <div className="grid grid-cols-2 gap-4">
                    <button
                        onClick={() => setView('feedback')}
                        className="bg-slate-50 rounded-xl p-4 flex flex-col items-center justify-center gap-3 hover:bg-slate-100 transition-colors h-32"
                    >
                        <ThumbsUp className="h-6 w-6 text-slate-700" />
                        <span className="text-xs font-medium text-slate-700 text-center leading-tight">Feedback</span>
                    </button>
                    <button
                        onClick={() => setShowRateModal(true)}
                        className="bg-slate-50 rounded-xl p-4 flex flex-col items-center justify-center gap-3 hover:bg-slate-100 transition-colors h-32"
                    >
                        <Star className="h-6 w-6 text-slate-700" />
                        <span className="text-xs font-medium text-slate-700 text-center leading-tight">Rate this App</span>
                    </button>
                </div>
            </div >

            {/* Logout */}
            < button
                onClick={logout}
                className="w-full bg-white border border-red-100 text-red-600 font-bold py-4 rounded-xl flex items-center justify-center gap-2 hover:bg-red-50 transition-colors"
            >
                <LogOut className="h-5 w-5" /> Log Out
            </button >
            <RateAppModal isOpen={showRateModal} onClose={() => setShowRateModal(false)} />
        </div >
    );
};

const ModalOverlay = ({ title, children, onClose }: { title: string, children: React.ReactNode, onClose: () => void }) => (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-end md:items-center justify-center p-0 md:p-4" onClick={onClose}>
        <div
            className="bg-white w-full md:max-w-md md:rounded-2xl rounded-t-2xl p-6 pb-24 md:pb-6 animate-in slide-in-from-bottom-10 md:slide-in-from-bottom-0 md:zoom-in-95 duration-300"
            onClick={(e) => e.stopPropagation()}
        >
            <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold text-slate-900">{title}</h3>
                <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-full">
                    <ChevronRight className="h-6 w-6 text-slate-400 rotate-90 md:rotate-0" />
                </button>
            </div>
            {children}
        </div>
    </div>
);

export const ProfileDetails: React.FC = () => {
    const { currentUser, updateUserProfile, updateUserEmail, updateUserPassword, deleteUserAccount } = useApp();

    // Initialize state from currentUser, with fallbacks
    const [notifications, setNotifications] = React.useState({
        promotions: currentUser?.preferences?.promotions ?? true,
        mail: currentUser?.preferences?.mail ?? false
    });

    const [activeModal, setActiveModal] = React.useState<'name' | 'phone' | 'address' | 'email' | 'password' | 'delete' | null>(null);

    // Form States
    const [nameForm, setNameForm] = React.useState({ firstName: currentUser?.name?.split(' ')[0] || '', lastName: currentUser?.name?.split(' ').slice(1).join(' ') || '' });
    const [phone, setPhone] = React.useState(currentUser?.phone || '');

    // Address State
    const [address, setAddress] = React.useState({
        line1: currentUser?.address?.addressLine1 || '12000',
        apartment: '', // Not in current Address type, kept local for now or mapped
        city: currentUser?.address?.city || '',
        state: '', // Not in current Address type
        zip: currentUser?.address?.postalCode || ''
    });

    const [email, setEmail] = React.useState(currentUser?.email || '');
    const [passwordForm, setPasswordForm] = React.useState({ current: '', new: '', confirm: '' });
    const [showPassword, setShowPassword] = React.useState(false);

    const closeModal = () => setActiveModal(null);

    // Handlers
    const handleUpdateName = () => {
        updateUserProfile({ name: `${nameForm.firstName} ${nameForm.lastName}`.trim() });
        closeModal();
    };

    const handleUpdatePhone = () => {
        updateUserProfile({ phone });
        closeModal();
    };

    const handleUpdateAddress = () => {
        // Map form to Address type
        const newAddress = {
            fullName: currentUser?.name || '',
            phone: currentUser?.phone || '',
            addressLine1: address.line1 + (address.apartment ? ` ${address.apartment}` : ''),
            city: address.city,
            district: address.state, // Mapping state to district for now
            postalCode: address.zip
        };
        updateUserProfile({ address: newAddress });
        closeModal();
    };

    const handleUpdateEmail = async () => {
        await updateUserEmail(email);
        closeModal();
    };

    const handleUpdatePassword = async () => {
        await updateUserPassword(passwordForm.new);
        closeModal();
    };

    const handleDeleteAccount = async () => {
        if (window.confirm("Are you absolutely sure? This cannot be undone.")) {
            await deleteUserAccount();
        }
    };

    const togglePreference = (key: 'promotions' | 'mail') => {
        const newVal = !notifications[key];
        setNotifications(prev => ({ ...prev, [key]: newVal }));
        updateUserProfile({
            preferences: {
                ...notifications,
                [key]: newVal
            }
        });
    };

    // Password Validation
    const passwordRequirements = [
        { label: '8-32 characters', valid: passwordForm.new.length >= 8 && passwordForm.new.length <= 32 },
        { label: 'At least 1 number', valid: /\d/.test(passwordForm.new) },
        { label: 'At least 1 letter', valid: /[a-zA-Z]/.test(passwordForm.new) },
        { label: 'At least 1 special character', valid: /[!@#$%^&*(),.?":{}|<>]/.test(passwordForm.new) },
    ];



    return (
        <div className="bg-slate-50 min-h-screen pb-32">
            {/* About Me */}
            <div className="bg-white p-4 mb-4">
                <h3 className="font-bold text-lg text-slate-900 mb-4">About Me</h3>
                <div className="divide-y divide-slate-100">
                    <div className="py-3 flex justify-between items-start">
                        <div>
                            <p className="text-xs text-slate-500 mb-1">Name</p>
                            <p className="text-slate-900 font-medium">{currentUser?.name || "Vihan Mapalagama"}</p>
                        </div>
                        <button onClick={() => setActiveModal('name')} className="text-xs font-bold text-slate-900 underline">Edit</button>
                    </div>
                    <div className="py-3 flex justify-between items-start">
                        <div>
                            <p className="text-xs text-slate-500 mb-1">Phone Number</p>
                            <p className="text-slate-900 font-medium">{currentUser?.phone || "(947) 153-0785"}</p>
                        </div>
                        <button onClick={() => setActiveModal('phone')} className="text-xs font-bold text-slate-900 underline">Edit</button>
                    </div>
                    <div className="py-3 flex justify-between items-start">
                        <div>
                            <p className="text-xs text-slate-500 mb-1">Address</p>
                            <p className="text-slate-900 font-medium">{currentUser?.address?.addressLine1 || "12000"}</p>
                        </div>
                        <button onClick={() => setActiveModal('address')} className="text-xs font-bold text-slate-900 underline">Edit</button>
                    </div>
                </div>
            </div>

            {/* My Account */}
            <div className="bg-white p-4 mb-4">
                <h3 className="font-bold text-lg text-slate-900 mb-4">My Account</h3>
                <div className="divide-y divide-slate-100">
                    <div className="py-3 flex justify-between items-start">
                        <div>
                            <p className="text-xs text-slate-500 mb-1">Email</p>
                            <p className="text-slate-900 font-medium">{currentUser?.email || "Vihancmapa@gmail.com"}</p>
                        </div>
                        <button onClick={() => setActiveModal('email')} className="text-xs font-bold text-slate-900 underline">Edit</button>
                    </div>
                    <div className="py-3 flex justify-between items-start">
                        <div>
                            <p className="text-xs text-slate-500 mb-1">Password</p>
                            <p className="text-slate-900 font-medium">***********</p>
                        </div>
                        <button onClick={() => setActiveModal('password')} className="text-xs font-bold text-slate-900 underline">Edit</button>
                    </div>
                </div>
            </div>

            {/* Preference Center */}
            <div className="bg-white p-4 mb-4">
                <h3 className="font-bold text-lg text-slate-900 mb-4">Preference Center</h3>
                <div className="divide-y divide-slate-100">
                    <div className="py-4 flex justify-between items-center">
                        <span className="text-slate-700">Promotion & Events</span>
                        <div
                            className={`w-12 h-7 rounded-full p-1 transition-colors cursor-pointer ${notifications.promotions ? 'bg-orange-500' : 'bg-slate-200'}`}
                            onClick={() => togglePreference('promotions')}
                        >
                            <div className={`w-5 h-5 bg-white rounded-full shadow-sm transition-transform ${notifications.promotions ? 'translate-x-5' : 'translate-x-0'}`}></div>
                        </div>
                    </div>
                    <div className="py-4 flex justify-between items-center">
                        <span className="text-slate-700">Mail Promotions & Coupons</span>
                        <div
                            className={`w-12 h-7 rounded-full p-1 transition-colors cursor-pointer ${notifications.mail ? 'bg-orange-500' : 'bg-slate-200'}`}
                            onClick={() => togglePreference('mail')}
                        >
                            <div className={`w-5 h-5 bg-white rounded-full shadow-sm transition-transform ${notifications.mail ? 'translate-x-5' : 'translate-x-0'}`}></div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Delete Account */}
            <div className="bg-white p-4">
                <button onClick={() => setActiveModal('delete')} className="w-full flex justify-between items-center py-2">
                    <span className="font-bold text-slate-900">Delete Account</span>
                    <ChevronRight className="h-5 w-5 text-slate-400" />
                </button>
            </div>

            {/* --- MODALS --- */}

            {activeModal === 'name' && (
                <ModalOverlay title="Edit Name" onClose={closeModal}>
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">First Name</label>
                            <input
                                type="text"
                                className="w-full border border-slate-300 rounded-lg p-3 focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none"
                                value={nameForm.firstName}
                                onChange={e => setNameForm({ ...nameForm, firstName: e.target.value })}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Last Name</label>
                            <input
                                type="text"
                                className="w-full border border-slate-300 rounded-lg p-3 focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none"
                                value={nameForm.lastName}
                                onChange={e => setNameForm({ ...nameForm, lastName: e.target.value })}
                            />
                        </div>
                        <Button className="w-full py-3 mt-4" onClick={handleUpdateName}>Update Name</Button>
                    </div>
                </ModalOverlay>
            )}

            {activeModal === 'phone' && (
                <ModalOverlay title="Update Phone Number" onClose={closeModal}>
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Phone Number</label>
                            <input
                                type="tel"
                                className="w-full border border-slate-300 rounded-lg p-3 focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none"
                                value={phone}
                                onChange={e => setPhone(e.target.value)}
                            />
                        </div>
                        <div className="bg-blue-50 p-3 rounded-lg flex gap-3 items-start">
                            <div className="mt-0.5">ℹ️</div>
                            <p className="text-xs text-blue-800 leading-relaxed">
                                This phone number may be shared with local delivery partners (e.g., PickMe, Uber) to assist with drop-off instructions if needed.
                            </p>
                        </div>
                        <Button className="w-full py-3 mt-4" onClick={handleUpdatePhone}>Update Phone Number</Button>
                    </div>
                </ModalOverlay>
            )}

            {activeModal === 'address' && (
                <ModalOverlay title="Update Address" onClose={closeModal}>
                    <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-1">
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Address Line 1</label>
                            <input
                                type="text"
                                className="w-full border border-slate-300 rounded-lg p-3 focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none"
                                value={address.line1}
                                onChange={e => setAddress({ ...address, line1: e.target.value })}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Apartment, Suite, etc. (Optional)</label>
                            <input
                                type="text"
                                className="w-full border border-slate-300 rounded-lg p-3 focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none"
                                value={address.apartment}
                                onChange={e => setAddress({ ...address, apartment: e.target.value })}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">City</label>
                            <input
                                type="text"
                                className="w-full border border-slate-300 rounded-lg p-3 focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none"
                                value={address.city}
                                onChange={e => setAddress({ ...address, city: e.target.value })}
                            />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">State/Province</label>
                                <div className="relative">
                                    <select
                                        className="w-full border border-slate-300 rounded-lg p-3 focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none appearance-none bg-white"
                                        value={address.state}
                                        onChange={e => setAddress({ ...address, state: e.target.value })}
                                    >
                                        <option value="">Select...</option>
                                        <option value="WP">Western</option>
                                        <option value="CP">Central</option>
                                        <option value="SP">Southern</option>
                                    </select>
                                    <ChevronRight className="absolute right-3 top-3.5 h-4 w-4 text-slate-400 rotate-90" />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">ZIP Mode</label>
                                <input
                                    type="text"
                                    className="w-full border border-slate-300 rounded-lg p-3 focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none"
                                    value={address.zip}
                                    onChange={e => setAddress({ ...address, zip: e.target.value })}
                                />
                            </div>
                        </div>
                        <Button className="w-full py-3 mt-4" onClick={handleUpdateAddress}>Save Address</Button>
                    </div>
                </ModalOverlay>
            )}

            {activeModal === 'email' && (
                <ModalOverlay title="Edit Email" onClose={closeModal}>
                    <div className="space-y-4">
                        <div className="bg-amber-50 p-4 rounded-lg flex gap-3 items-start mb-2">
                            <div className="mt-0.5">⚠️</div>
                            <p className="text-sm text-amber-800">
                                Changing your email address will convert your AutoPartsSL login username. You will need to use the new email to log in properly.
                            </p>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Email Address</label>
                            <input
                                type="email"
                                className="w-full border border-slate-300 rounded-lg p-3 focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none"
                                value={email}
                                onChange={e => setEmail(e.target.value)}
                            />
                        </div>
                        <Button className="w-full py-3 mt-4" onClick={handleUpdateEmail}>Update Email</Button>
                    </div>
                </ModalOverlay>
            )}

            {activeModal === 'password' && (
                <ModalOverlay title="Update Password" onClose={closeModal}>
                    <div className="space-y-4">
                        {/* Requirements */}
                        <div className="bg-slate-50 p-4 rounded-lg space-y-2 mb-4">
                            <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Password Requirements</h4>
                            {passwordRequirements.map((req, idx) => (
                                <div key={idx} className="flex items-center gap-2">
                                    <div className={`h-4 w-4 rounded-full flex items-center justify-center ${req.valid ? 'bg-green-500 text-white' : 'bg-slate-200 text-slate-400'}`}>
                                        <div className="text-[10px] font-bold">✓</div>
                                    </div>
                                    <span className={`text-sm ${req.valid ? 'text-slate-900 font-medium' : 'text-slate-500'}`}>{req.label}</span>
                                </div>
                            ))}
                        </div>

                        <div className="relative">
                            <label className="block text-sm font-medium text-slate-700 mb-1">Current Password</label>
                            <input
                                type={showPassword ? "text" : "password"}
                                className="w-full border border-slate-300 rounded-lg p-3 focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none"
                                value={passwordForm.current}
                                onChange={e => setPasswordForm({ ...passwordForm, current: e.target.value })}
                            />
                        </div>

                        <div className="relative">
                            <label className="block text-sm font-medium text-slate-700 mb-1">New Password</label>
                            <input
                                type={showPassword ? "text" : "password"}
                                className="w-full border border-slate-300 rounded-lg p-3 focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none"
                                value={passwordForm.new}
                                onChange={e => setPasswordForm({ ...passwordForm, new: e.target.value })}
                            />
                            <button
                                type="button"
                                className="absolute right-3 top-[34px] text-slate-400 hover:text-slate-600"
                                onClick={() => setShowPassword(!showPassword)}
                            >
                                {showPassword ? "Hide" : "Show"}
                            </button>
                        </div>

                        <div className="relative">
                            <label className="block text-sm font-medium text-slate-700 mb-1">Confirm New Password</label>
                            <input
                                type={showPassword ? "text" : "password"}
                                className="w-full border border-slate-300 rounded-lg p-3 focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none"
                                value={passwordForm.confirm}
                                onChange={e => setPasswordForm({ ...passwordForm, confirm: e.target.value })}
                            />
                        </div>

                        <Button className="w-full py-3 mt-4" disabled={!passwordRequirements.every(r => r.valid) || passwordForm.new !== passwordForm.confirm} onClick={handleUpdatePassword}>
                            Update Password
                        </Button>
                    </div>
                </ModalOverlay>
            )}

            {activeModal === 'delete' && (
                <ModalOverlay title="Delete Account" onClose={closeModal}>
                    <div className="space-y-6">
                        <div>
                            <p className="font-bold text-slate-900 mb-2">Before deleting your account, here's what to know:</p>
                            <ul className="list-disc pl-5 space-y-2 text-sm text-slate-600">
                                <li>Deleting your account will delete your online account permanently and you will not be able to sign in on AutoPartsSL, or the iOS/android app with this email address.</li>
                                <li>You will not be able to create a new account using the same e-mail address in the future.</li>
                                <li>You will not be able to redeem rewards online or in the app moving forward.</li>
                                <li>You will continue receiving rewards communications, coupons, deals, or notifications by email moving forward unless you have explicitly opted out of receiving those in the past.</li>
                            </ul>
                        </div>

                        <p className="font-bold text-slate-900 text-sm">Do you want to continue deleting this account?</p>

                        <div className="flex flex-col gap-3">
                            <button
                                className="w-full bg-slate-900 text-white font-bold py-3 rounded-none uppercase tracking-wide hover:bg-slate-800 transition-colors"
                                onClick={handleDeleteAccount}
                            >
                                YES, DELETE ACCOUNT
                            </button>
                            <button
                                className="w-full bg-white border border-slate-900 text-slate-900 font-bold py-3 rounded-none uppercase tracking-wide hover:bg-slate-50 transition-colors"
                                onClick={closeModal}
                            >
                                NO, KEEP ACCOUNT
                            </button>
                        </div>
                    </div>
                </ModalOverlay>
            )}
        </div>
    );
};
