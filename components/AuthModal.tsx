
import React, { useState, useEffect } from 'react';
import { X, Eye, EyeOff, Facebook } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { useNotification } from '../context/NotificationContext';
import { Button } from './ui/Button';

const GOOGLE_CLIENT_ID = "YOUR_GOOGLE_CLIENT_ID.apps.googleusercontent.com";
const FACEBOOK_APP_ID = "YOUR_FACEBOOK_APP_ID";

const decodeJwt = (token: string) => {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));
    return JSON.parse(jsonPayload);
  } catch (e) {
    return null;
  }
};

export const AuthModal: React.FC = () => {
  const { isAuthModalOpen, closeAuthModal, login, registerBuyer, authView, setAuthView, updateUserProfile } = useApp();
  const { notify } = useNotification();
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  const [regName, setRegName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPhone, setRegPhone] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regConfirmPassword, setRegConfirmPassword] = useState('');

  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!isAuthModalOpen) return;

    if (!FACEBOOK_APP_ID.includes("YOUR_FACEBOOK_APP_ID")) {
      window.fbAsyncInit = function() {
        window.FB?.init({
          appId: FACEBOOK_APP_ID,
          cookie: true,
          xfbml: true,
          version: 'v16.0'
        });
      };
    }

    if (!GOOGLE_CLIENT_ID.includes("YOUR_GOOGLE_CLIENT_ID")) {
      if (window.google) {
        window.google.accounts.id.initialize({
          client_id: GOOGLE_CLIENT_ID,
          callback: handleGoogleResponse
        });
      }
    }
  }, [isAuthModalOpen]);

  useEffect(() => {
    if (isAuthModalOpen) {
      setEmail('');
      setPassword('');
      setRegName('');
      setRegEmail('');
      setRegPhone('');
      setRegPassword('');
      setRegConfirmPassword('');
      setShowPassword(false);
      setIsLoading(false);
    }
  }, [isAuthModalOpen]);

  const handleGoogleResponse = (response: any) => {
    const userObject = decodeJwt(response.credential);
    if (userObject) {
      login(userObject.email || 'google-user@example.com');
      updateUserProfile({ name: userObject.name, email: userObject.email });
    }
  };

  const handleGoogleLogin = () => {
    if (GOOGLE_CLIENT_ID.includes("YOUR_GOOGLE_CLIENT_ID")) {
      setIsLoading(true);
      setTimeout(() => {
        login('alex.google@example.com');
        updateUserProfile({ name: 'Alex (Google User)' });
        setIsLoading(false);
      }, 1000);
      return;
    }
    if (window.google) {
      window.google.accounts.id.prompt();
    }
  };

  const handleFacebookLogin = () => {
    if (FACEBOOK_APP_ID.includes("YOUR_FACEBOOK_APP_ID")) {
      setIsLoading(true);
      setTimeout(() => {
        login('alex.fb@example.com');
        updateUserProfile({ name: 'Alex (Facebook User)' });
        setIsLoading(false);
      }, 1000);
      return;
    }
    window.FB?.login((response: any) => {
      if (response.authResponse) {
        window.FB?.api('/me', { fields: 'name,email' }, (userInfo: any) => {
          login(userInfo.email || 'fb-user@example.com');
          updateUserProfile({ name: userInfo.name });
        });
      }
    }, { scope: 'public_profile,email' });
  };

  // --- VALIDATION UTILS ---
  const isValidEmail = (email: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const isValidPhone = (phone: string) => /^\d{10,}$/.test(phone.replace(/\D/g, ''));

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      notify('error', 'Please enter your email.');
      return;
    }
    if (!password) {
      notify('error', 'Please enter your password.');
      return;
    }

    setIsLoading(true);
    await login(email, password);
    setIsLoading(false);
  };

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    if (!regName.trim()) {
      notify('error', 'Full Name is required');
      return;
    }
    if (!isValidEmail(regEmail)) {
      notify('error', 'Please enter a valid email address');
      return;
    }
    if (!isValidPhone(regPhone)) {
      notify('error', 'Please enter a valid phone number (at least 10 digits)');
      return;
    }
    if (regPassword.length < 6) {
      notify('error', 'Password must be at least 6 characters long');
      return;
    }
    if (regPassword !== regConfirmPassword) {
      notify('error', "Passwords do not match");
      return;
    }
    
    setIsLoading(true);
    
    await registerBuyer({
      name: regName,
      email: regEmail,
      phone: regPhone,
      password: regPassword
    });

    setIsLoading(false);
  };

  const fillDemoRegister = () => {
    const randomNum = Math.floor(Math.random() * 1000);
    setRegName("Chamara Silva");
    setRegEmail(`chamara.silva${randomNum}@example.com`);
    setRegPhone("0777123456");
    setRegPassword("password123");
    setRegConfirmPassword("password123");
    notify('info', 'Demo details filled');
  };

  const fillAdminLogin = () => {
      setEmail('admin@autoparts.lk');
      setPassword('admin123');
      notify('info', 'Admin credentials filled');
  };

  if (!isAuthModalOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-[400px] rounded-lg shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200 relative">
        <button 
          onClick={closeAuthModal}
          className="absolute top-3 right-3 p-1 rounded-full text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-colors z-10"
        >
          <X className="h-5 w-5" />
        </button>

        <div className="p-8 pt-10">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-medium text-slate-800">
              {authView === 'login' ? 'Log In' : 'Sign Up'}
            </h2>
            {authView === 'login' && (
              <div className="flex gap-2">
                 <Button type="button" onClick={fillAdminLogin} variant="outline" size="sm" className="text-xs px-2 py-1 text-red-600 border-red-200 hover:bg-red-50">
                    Admin
                 </Button>
                 <div className="hidden sm:flex items-center gap-1 bg-yellow-50 text-orange-500 border border-yellow-200 text-xs font-bold px-2 py-1 rounded shadow-sm">
                    QR
                 </div>
              </div>
            )}
            {authView === 'register' && (
              <Button type="button" onClick={fillDemoRegister} variant="secondary" size="sm" className="text-xs px-2 py-1">
                Fill Demo Details
              </Button>
            )}
          </div>

          {authView === 'login' ? (
            <form onSubmit={handleLoginSubmit} className="space-y-4">
              <div>
                <input
                  type="text"
                  value={email}
                  onClick={() => !email && setEmail('user@example.com')}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-3 border border-slate-300 rounded focus:outline-none focus:border-secondary focus:ring-1 focus:ring-secondary bg-white text-slate-900 placeholder:text-slate-400"
                  placeholder="Phone number / Username / Email"
                  title="Click to fill sample"
                />
              </div>

              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onClick={() => !password && setPassword('password123')}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-3 border border-slate-300 rounded focus:outline-none focus:border-secondary focus:ring-1 focus:ring-secondary bg-white text-slate-900 placeholder:text-slate-400"
                  placeholder="Password"
                  title="Click to fill sample"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-3.5 text-slate-400 hover:text-slate-600"
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>

              <Button 
                type="submit" 
                className="w-full py-3 bg-secondary hover:bg-secondary-hover text-white font-semibold uppercase tracking-wide text-sm shadow-none rounded"
                disabled={isLoading}
              >
                {isLoading ? 'LOGGING IN...' : 'LOG IN'}
              </Button>
              
              <div className="flex justify-between mt-3 text-xs">
                <button type="button" className="text-blue-600 hover:underline">Forgot Password</button>
                <button type="button" className="text-blue-600 hover:underline">Log in with SMS</button>
              </div>
            </form>
          ) : (
            <form onSubmit={handleRegisterSubmit} className="space-y-4">
               <div>
                <input
                  type="text"
                  value={regName}
                  onChange={(e) => setRegName(e.target.value)}
                  className="w-full px-4 py-3 border border-slate-300 rounded focus:outline-none focus:border-secondary focus:ring-1 focus:ring-secondary bg-white text-slate-900 placeholder:text-slate-400"
                  placeholder="Full Name"
                />
              </div>
              <div>
                <input
                  type="email"
                  value={regEmail}
                  onChange={(e) => setRegEmail(e.target.value)}
                  className="w-full px-4 py-3 border border-slate-300 rounded focus:outline-none focus:border-secondary focus:ring-1 focus:ring-secondary bg-white text-slate-900 placeholder:text-slate-400"
                  placeholder="Email Address"
                />
              </div>
              <div>
                <input
                  type="text"
                  value={regPhone}
                  onChange={(e) => setRegPhone(e.target.value)}
                  className="w-full px-4 py-3 border border-slate-300 rounded focus:outline-none focus:border-secondary focus:ring-1 focus:ring-secondary bg-white text-slate-900 placeholder:text-slate-400"
                  placeholder="Mobile Number"
                />
              </div>
              <div className="relative">
                <input
                  type="password"
                  value={regPassword}
                  onChange={(e) => setRegPassword(e.target.value)}
                  className="w-full px-4 py-3 border border-slate-300 rounded focus:outline-none focus:border-secondary focus:ring-1 focus:ring-secondary bg-white text-slate-900 placeholder:text-slate-400"
                  placeholder="Password"
                />
              </div>
              <div className="relative">
                <input
                  type="password"
                  value={regConfirmPassword}
                  onChange={(e) => setRegConfirmPassword(e.target.value)}
                  className="w-full px-4 py-3 border border-slate-300 rounded focus:outline-none focus:border-secondary focus:ring-1 focus:ring-secondary bg-white text-slate-900 placeholder:text-slate-400"
                  placeholder="Confirm Password"
                />
              </div>

              <Button 
                type="submit" 
                className="w-full py-3 bg-secondary hover:bg-secondary-hover text-white font-semibold uppercase tracking-wide text-sm shadow-none rounded"
                disabled={isLoading}
              >
                {isLoading ? 'CREATING ACCOUNT...' : 'SIGN UP'}
              </Button>
            </form>
          )}

          <div className="flex items-center gap-4 my-6">
            <div className="h-px bg-slate-200 flex-1"></div>
            <span className="text-slate-400 text-xs font-medium uppercase">OR</span>
            <div className="h-px bg-slate-200 flex-1"></div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <button 
              type="button"
              onClick={handleFacebookLogin}
              className="flex items-center justify-center gap-2 border border-slate-300 py-2 rounded hover:bg-slate-50 transition-colors"
            >
              <Facebook className="h-5 w-5 text-[#1877F2]" fill="currentColor" />
              <span className="text-sm text-slate-600">Facebook</span>
            </button>
            <button 
              type="button"
              onClick={handleGoogleLogin}
              className="flex items-center justify-center gap-2 border border-slate-300 py-2 rounded hover:bg-slate-50 transition-colors"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" /><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" /><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" /><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" /></svg>
              <span className="text-sm text-slate-600">Google</span>
            </button>
          </div>

          <div className="mt-8 text-center text-sm text-slate-500">
            {authView === 'login' ? (
              <>
                New to AutoPartsSL? <button type="button" onClick={() => setAuthView('register')} className="text-secondary font-bold hover:underline">Sign Up</button>
              </>
            ) : (
              <>
                Have an account? <button type="button" onClick={() => setAuthView('login')} className="text-secondary font-bold hover:underline">Log In</button>
              </>
            )}
          </div>

        </div>
      </div>
    </div>
  );
};
