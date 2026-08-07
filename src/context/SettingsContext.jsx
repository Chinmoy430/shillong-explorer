// ============================================================
// SettingsContext — Real-time Site Settings from Firestore
// ============================================================
//
// 📚 REACT CONCEPT: Context for shared read-only data
// Site settings (agency name, phone, WhatsApp, social links) are
// needed by: Header, Footer, ContactPage, TourCard, AttractionModal.
//
// OLD WAY: Each page called getData('siteSettings') from localStorage
// and manually updated DOM elements like document.querySelector('.site-phone').
//
// NEW WAY: SettingsContext subscribes to Firestore siteContent/settings
// ONCE at the app level. Every component that reads settings via useSettings()
// automatically re-renders if an admin changes a setting — real-time!
// ============================================================

import { createContext, useState, useEffect } from 'react';
import { subscribeToSiteSettings } from '../services/dataService';

// Fallback shown before Firestore loads (prevents layout shift)
export const DEFAULT_SETTINGS = {
  agencyName: 'SAWAIOM TRAVELS AGENCY',
  tagline:    'Discover the Scotland of the East',
  phone:      '+91 98765 43210',
  email:      'hello@shillongexplorer.com',
  whatsapp:   '919876543210',
  address:    'Police Bazar, Shillong, Meghalaya 793001',
  social: {
    facebook:  '#',
    instagram: '#',
    youtube:   '#',
    twitter:   '#',
  },
};

export const SettingsContext = createContext(DEFAULT_SETTINGS);

export function SettingsProvider({ children }) {
  const [settings, setSettings] = useState(DEFAULT_SETTINGS);

  useEffect(() => {
    // Real-time Firestore listener:
    // • Fires immediately with current Firestore data
    // • Fires again whenever an admin saves new settings
    // • unsubscribe is returned for cleanup
    const unsubscribe = subscribeToSiteSettings((data) => {
      // Spread DEFAULT_SETTINGS first so any missing Firestore fields
      // fall back to the default value rather than becoming undefined
      setSettings((prev) => ({ ...prev, ...data }));
    });
    return unsubscribe;
  }, []);

  return (
    <SettingsContext.Provider value={settings}>
      {children}
    </SettingsContext.Provider>
  );
}
