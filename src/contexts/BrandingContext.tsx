import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { BrandingSettings } from '../lib/types';
import { mockDb } from '../lib/mockDatabase';
import { DEFAULT_BRANDING_SETTINGS } from '../lib/constants';
import { applyBrandingCssVariables } from '../lib/brandingUtils';
import { supabase, isSupabaseConfigured } from '../lib/supabase';

interface BrandingContextType {
  branding: BrandingSettings;
  updateBranding: (newSettings: Partial<BrandingSettings>) => Promise<boolean>;
  resetBranding: () => Promise<boolean>;
  refreshBranding: () => void;
  previewBranding: (preview: BrandingSettings | null) => void;
  activeSettings: BrandingSettings;
  isSaving: boolean;
}

const BrandingContext = createContext<BrandingContextType | undefined>(undefined);

export const BrandingProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [branding, setBranding] = useState<BrandingSettings>(() => {
    return mockDb.getBrandingSettings();
  });
  const [preview, setPreview] = useState<BrandingSettings | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  // The active settings rendered to CSS variables: preview takes precedence during live CMS editing
  const activeSettings = preview || branding;

  // Apply CSS custom properties whenever activeSettings changes
  useEffect(() => {
    applyBrandingCssVariables(activeSettings);
  }, [activeSettings]);

  // Load from Supabase if configured, otherwise rely on mockDatabase
  const refreshBranding = useCallback(async () => {
    if (isSupabaseConfigured && supabase) {
      try {
        const { data, error } = await supabase
          .from('store_settings')
          .select('value')
          .eq('key', 'branding')
          .maybeSingle();

        if (data && data.value && !error) {
          const loaded: BrandingSettings = {
            ...DEFAULT_BRANDING_SETTINGS,
            ...data.value,
          };
          setBranding(loaded);
          mockDb.updateBrandingSettings(loaded);
          return;
        }
      } catch (err) {
        console.warn('[Branding] Supabase fetch fallback to local storage:', err);
      }
    }

    // Default or mockDB retrieval
    const local = mockDb.getBrandingSettings();
    setBranding(local);
  }, []);

  // Initial load
  useEffect(() => {
    refreshBranding();

    // Listen for cross-tab or component broadcast events
    const handleBrandingUpdated = (e: Event) => {
      const customEvent = e as CustomEvent<BrandingSettings>;
      if (customEvent.detail) {
        setBranding(customEvent.detail);
        setPreview(null);
      } else {
        refreshBranding();
      }
    };

    window.addEventListener('ba_branding_updated', handleBrandingUpdated);
    return () => {
      window.removeEventListener('ba_branding_updated', handleBrandingUpdated);
    };
  }, [refreshBranding]);

  // Save branding updates
  const updateBranding = async (newSettings: Partial<BrandingSettings>): Promise<boolean> => {
    setIsSaving(true);
    try {
      // 1. Persist locally via mockDb (immediate reliability & event dispatch)
      const updated = mockDb.updateBrandingSettings(newSettings);
      setBranding(updated);
      setPreview(null); // Clear preview once saved

      // 2. Persist to Supabase if configured
      if (isSupabaseConfigured && supabase) {
        try {
          const { error } = await supabase
            .from('store_settings')
            .upsert({
              key: 'branding',
              value: updated,
              description: 'Global site branding, logos, and dynamic theme colors',
              updated_at: new Date().toISOString(),
            }, { onConflict: 'key' });

          if (error) {
            console.error('[Branding] Supabase save error:', error);
          }
        } catch (dbErr) {
          console.error('[Branding] Supabase database error:', dbErr);
        }
      }

      setIsSaving(false);
      return true;
    } catch (err) {
      console.error('[Branding] Failed to update branding:', err);
      setIsSaving(false);
      return false;
    }
  };

  // Reset to factory defaults
  const resetBranding = async (): Promise<boolean> => {
    setIsSaving(true);
    try {
      const reset = mockDb.resetBrandingSettings();
      setBranding(reset);
      setPreview(null);

      if (isSupabaseConfigured && supabase) {
        try {
          await supabase
            .from('store_settings')
            .upsert({
              key: 'branding',
              value: reset,
              description: 'Global site branding, logos, and dynamic theme colors',
              updated_at: new Date().toISOString(),
            }, { onConflict: 'key' });
        } catch (dbErr) {
          console.error('[Branding] Supabase reset error:', dbErr);
        }
      }

      setIsSaving(false);
      return true;
    } catch (err) {
      console.error('[Branding] Failed to reset branding:', err);
      setIsSaving(false);
      return false;
    }
  };

  // Live preview function (does NOT persist, only affects CSS variables until saved or cancelled)
  const previewBranding = (previewObj: BrandingSettings | null) => {
    setPreview(previewObj);
  };

  return (
    <BrandingContext.Provider
      value={{
        branding,
        updateBranding,
        resetBranding,
        refreshBranding,
        previewBranding,
        activeSettings,
        isSaving,
      }}
    >
      {children}
    </BrandingContext.Provider>
  );
};

export const useBranding = (): BrandingContextType => {
  const context = useContext(BrandingContext);
  if (!context) {
    throw new Error('useBranding must be used within a BrandingProvider');
  }
  return context;
};
