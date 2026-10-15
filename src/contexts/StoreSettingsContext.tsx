import React, { createContext, useContext, useState, useEffect } from 'react';
import { StoreSettings } from '../lib/types';
import { mockDb } from '../lib/mockDatabase';

interface StoreSettingsContextType {
  settings: StoreSettings;
  updateSettings: (newSettings: Partial<StoreSettings>) => void;
  refreshSettings: () => void;
  announcementDismissed: boolean;
  dismissAnnouncement: () => void;
}

const StoreSettingsContext = createContext<StoreSettingsContextType | undefined>(undefined);

export const StoreSettingsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [settings, setSettings] = useState<StoreSettings>(() => mockDb.getStoreSettings());
  const [announcementDismissed, setAnnouncementDismissed] = useState<boolean>(false);

  const refreshSettings = () => {
    setSettings(mockDb.getStoreSettings());
  };

  const updateSettings = (newSettings: Partial<StoreSettings>) => {
    const updated = mockDb.updateStoreSettings(newSettings);
    setSettings(updated);
  };

  const dismissAnnouncement = () => {
    setAnnouncementDismissed(true);
  };

  useEffect(() => {
    // Poll or sync if needed
    const interval = setInterval(refreshSettings, 10000);
    return () => clearInterval(interval);
  }, []);

  return (
    <StoreSettingsContext.Provider 
      value={{ 
        settings, 
        updateSettings, 
        refreshSettings, 
        announcementDismissed, 
        dismissAnnouncement 
      }}
    >
      {children}
    </StoreSettingsContext.Provider>
  );
};

export const useStoreSettings = (): StoreSettingsContextType => {
  const context = useContext(StoreSettingsContext);
  if (!context) {
    throw new Error('useStoreSettings must be used within a StoreSettingsProvider');
  }
  return context;
};
