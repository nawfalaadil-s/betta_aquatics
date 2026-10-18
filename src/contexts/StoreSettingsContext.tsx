import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { StoreSettings } from '../lib/types';
import { mockDb } from '../lib/mockDatabase';
import { supabase, isSupabaseConfigured } from '../lib/supabase';

interface StoreSettingsContextType {
  settings: StoreSettings;
  updateSettings: (newSettings: Partial<StoreSettings>) => Promise<boolean>;
  refreshSettings: () => Promise<void>;
  announcementDismissed: boolean;
  dismissAnnouncement: () => void;
}

const StoreSettingsContext = createContext<StoreSettingsContextType | undefined>(undefined);

export const StoreSettingsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [settings, setSettings] = useState<StoreSettings>(() => mockDb.getStoreSettings());
  const [announcementDismissed, setAnnouncementDismissed] = useState<boolean>(false);

  const refreshSettings = useCallback(async () => {
    if (isSupabaseConfigured && supabase) {
      try {
        const { data, error } = await supabase
          .from('store_settings')
          .select('key, value');

        if (data && !error && data.length > 0) {
          const map: Record<string, any> = {};
          data.forEach(row => {
            if (row.key && row.value) {
              map[row.key] = row.value;
            }
          });

          const current = mockDb.getStoreSettings();
          const merged: StoreSettings = {
            ...current,
            ...(map['brand_info'] || {}),
            ...(map['payment_settings'] || {}),
            ...(map['shipping_settings'] || {}),
          };

          // If branding has site_name or tagline, sync them
          if (map['branding']?.site_name) {
            merged.brand_name = map['branding'].site_name;
          }
          if (map['branding']?.tagline) {
            merged.tagline = map['branding'].tagline;
          }

          mockDb.updateStoreSettings(merged);
          setSettings(merged);
          return;
        }
      } catch (err) {
        console.warn('[StoreSettings] Supabase fetch fallback to local storage:', err);
      }
    }

    setSettings(mockDb.getStoreSettings());
  }, []);

  const updateSettings = async (newSettings: Partial<StoreSettings>): Promise<boolean> => {
    // 1. Immediate local state & localStorage update
    const updated = mockDb.updateStoreSettings(newSettings);
    setSettings(updated);

    // 2. Dispatch cross-component broadcast
    window.dispatchEvent(new CustomEvent('ba_storesettings_updated', { detail: updated }));

    // 3. Persist to live Supabase cloud database
    if (isSupabaseConfigured && supabase) {
      try {
        const now = new Date().toISOString();

        const brandInfo = {
          brand_name: updated.brand_name,
          tagline: updated.tagline,
          contact_email: updated.contact_email,
          contact_phone: updated.contact_phone,
          whatsapp_number: updated.whatsapp_number,
        };

        const paymentSettings = {
          upi_id: updated.upi_id,
          upi_payee_name: updated.upi_payee_name,
          bank_name: updated.bank_name,
          bank_account_no: updated.bank_account_no,
          bank_ifsc: updated.bank_ifsc,
          bank_account_holder: updated.bank_account_holder,
        };

        const shippingSettings = {
          free_shipping_threshold: updated.free_shipping_threshold,
          standard_shipping_rate: updated.standard_shipping_rate,
          live_packing_charge: updated.live_packing_charge,
          announcement_text: updated.announcement_text,
          announcement_code: updated.announcement_code,
          announcement_active: updated.announcement_active,
          announcement_link: updated.announcement_link,
          maintenance_mode: updated.maintenance_mode,
        };

        await Promise.all([
          supabase.from('store_settings').upsert({
            key: 'brand_info',
            value: brandInfo,
            description: 'Primary store identity and customer support contact details',
            updated_at: now,
          }, { onConflict: 'key' }),

          supabase.from('store_settings').upsert({
            key: 'payment_settings',
            value: paymentSettings,
            description: 'UPI and Direct Bank Transfer payment gateway credentials',
            updated_at: now,
          }, { onConflict: 'key' }),

          supabase.from('store_settings').upsert({
            key: 'shipping_settings',
            value: shippingSettings,
            description: 'Logistics rules, freight charges, and top announcement message',
            updated_at: now,
          }, { onConflict: 'key' }),
        ]);

        // Keep branding.site_name in sync if brand_name was changed
        if (newSettings.brand_name) {
          const { data: brandingData } = await supabase
            .from('store_settings')
            .select('value')
            .eq('key', 'branding')
            .maybeSingle();

          if (brandingData && brandingData.value) {
            const updatedBranding = {
              ...brandingData.value,
              site_name: newSettings.brand_name,
              tagline: newSettings.tagline || brandingData.value.tagline,
              updated_at: now,
            };

            await supabase.from('store_settings').upsert({
              key: 'branding',
              value: updatedBranding,
              description: 'Global site branding, logos, and dynamic theme colors',
              updated_at: now,
            }, { onConflict: 'key' });

            mockDb.updateBrandingSettings({
              site_name: newSettings.brand_name,
              tagline: newSettings.tagline || brandingData.value.tagline,
            });

            window.dispatchEvent(new CustomEvent('ba_branding_updated', { detail: updatedBranding }));
          }
        }

        return true;
      } catch (err) {
        console.error('[StoreSettings] Failed to persist to Supabase:', err);
        return false;
      }
    }

    return true;
  };

  const dismissAnnouncement = () => {
    setAnnouncementDismissed(true);
  };

  useEffect(() => {
    refreshSettings();

    const handleExternalUpdate = () => {
      refreshSettings();
    };

    window.addEventListener('ba_storesettings_updated', handleExternalUpdate);
    return () => {
      window.removeEventListener('ba_storesettings_updated', handleExternalUpdate);
    };
  }, [refreshSettings]);

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
