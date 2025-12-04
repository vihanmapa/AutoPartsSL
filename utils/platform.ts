import { Capacitor } from '@capacitor/core';

export const isNativeApp = (): boolean => {
    // Explicitly check if we are on the web deployment domains
    const isWebDomain =
        window.location.hostname.includes('web.app') ||
        window.location.hostname.includes('firebaseapp.com') ||
        window.location.hostname === 'localhost' ||
        window.location.hostname.includes('192.168.') ||
        window.location.hostname.includes('127.0.0.1');

    if (isWebDomain) {
        return false;
    }

    return Capacitor.isNativePlatform();
};
