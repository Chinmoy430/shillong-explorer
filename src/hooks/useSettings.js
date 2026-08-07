// ============================================================
// useSettings — Custom Hook for SettingsContext
// ============================================================

import { useContext } from 'react';
import { SettingsContext } from '../context/SettingsContext';

// 📚 REACT CONCEPT: Custom Hook (shortcut pattern)
// Same idea as useAuth — simplifies how components read settings.
// Usage: const settings = useSettings();
//        const waLink = `https://wa.me/${settings.whatsapp}?text=Hello`;
export function useSettings() {
  return useContext(SettingsContext);
}
