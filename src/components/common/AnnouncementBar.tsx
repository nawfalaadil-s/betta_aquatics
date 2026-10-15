import React from 'react';
import { useStoreSettings } from '../../contexts/StoreSettingsContext';
import { useToast } from '../../contexts/ToastContext';
import { Sparkles, X, Copy, ArrowRight } from 'lucide-react';
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
      className="bg-gradient-to-r from-ocean-950 via-ocean-900 to-ocean-950 text-white border-b border-aqua-500/20 text-xs sm:text-sm py-2 px-3 sm:px-4 relative z-40"
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-2">
        <div className="flex-1 flex items-center justify-center gap-2 sm:gap-3 text-center flex-wrap">
          <span className="inline-flex items-center gap-1.5 font-medium text-aqua-300">
            <Sparkles className="w-3.5 h-3.5 text-aqua-400 animate-pulse" />
            <span className="hidden sm:inline">EXCLUSIVE OFFER:</span>
          </span>
          <span className="text-slate-200 text-xs sm:text-sm">
            {settings.announcement_text}
          </span>
          {settings.announcement_code && (
            <button
              onClick={copyCode}
              className="inline-flex items-center gap-1 bg-aqua-500/20 hover:bg-aqua-500/30 text-aqua-300 border border-aqua-400/40 px-2 py-0.5 rounded text-xs font-mono font-semibold tracking-wide transition-colors"
              title="Click to copy coupon code"
              aria-label={`Copy coupon code ${settings.announcement_code}`}
            >
              <span>{settings.announcement_code}</span>
              <Copy className="w-3 h-3" />
            </button>
          )}
          {settings.announcement_link && (
            <Link
              to={settings.announcement_link}
              className="inline-flex items-center gap-0.5 text-xs text-aqua-400 hover:text-aqua-300 underline underline-offset-2 font-medium"
            >
              Shop Now <ArrowRight className="w-3 h-3 ml-0.5" />
            </Link>
          )}
        </div>
        <button
          onClick={dismissAnnouncement}
          className="text-slate-400 hover:text-white p-1 rounded-md transition-colors shrink-0"
          aria-label="Dismiss announcement"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </aside>
  );
};
