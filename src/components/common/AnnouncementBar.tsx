import React from 'react';
import { useStoreSettings } from '../../contexts/StoreSettingsContext';
import { useToast } from '../../contexts/ToastContext';
import { Tag, X, Copy, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export const AnnouncementBar: React.FC = () => {
  const { settings, announcementDismissed, dismissAnnouncement } = useStoreSettings();
  const { showToast } = useToast();

  if (!settings.announcement_active || announcementDismissed || !settings.announcement_text) {
    return null;
  }

  const copyCode = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (settings.announcement_code) {
      navigator.clipboard.writeText(settings.announcement_code);
      showToast(`Promo code ${settings.announcement_code} copied!`, 'success');
    }
  };

  return (
    <aside 
      aria-label="Promotional announcement"
      className="bg-blue-950 text-white border-b border-blue-900 text-xs py-2 px-3 sm:px-4 relative z-40"
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-2">
        <div className="flex-1 flex items-center justify-center gap-2 sm:gap-3 text-center flex-wrap">
          <span className="inline-flex items-center gap-1.5 font-semibold text-white">
            <Tag className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">OFFER:</span>
          </span>
          <span className="text-white text-xs">
            {settings.announcement_text}
          </span>
          {settings.announcement_code && (
            <button
              onClick={copyCode}
              className="btn-primary font-mono"
              title="Click to copy coupon code"
              aria-label={`Copy coupon code ${settings.announcement_code}`}
            >
              <span>{settings.announcement_code}</span>
              <Copy className="w-3 h-3 text-white" />
            </button>
          )}
          {settings.announcement_link && (
            <Link
              to={settings.announcement_link}
              className="inline-flex items-center gap-0.5 text-xs text-white hover:underline underline-offset-2 font-medium"
            >
              Shop Now <ArrowRight className="w-3 h-3 ml-0.5" />
            </Link>
          )}
        </div>
        <button
          onClick={dismissAnnouncement}
          className="btn-icon text-white hover:text-white hover:bg-blue-900 shrink-0"
          aria-label="Dismiss announcement"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </aside>
  );
};
