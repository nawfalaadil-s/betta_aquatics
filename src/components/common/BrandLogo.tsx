import React, { useState, useEffect } from 'react';
import { useBranding } from '../../contexts/BrandingContext';

export interface BrandLogoProps {
  variant?: 'header' | 'mobile' | 'footer' | 'invoice' | 'auth' | 'admin' | 'preview';
  className?: string;
  imgClassName?: string;
  showText?: boolean;
  textClassName?: string;
  alt?: string;
}

export const BrandLogo: React.FC<BrandLogoProps> = ({
  variant = 'header',
  className = '',
  imgClassName = 'w-full h-full object-contain',
  showText = false,
  textClassName = 'font-extrabold text-slate-900 tracking-tight font-display',
  alt,
}) => {
  const { activeSettings, branding } = useBranding();
  const currentSettings = activeSettings || branding;
  const [hasError, setHasError] = useState(false);

  // Single source of truth:
  // Primary logo is the global brand identity. Defaults to '/logo.jpeg' then '/logo-fish.svg'.
  const primaryLogo = (currentSettings.logo_url && currentSettings.logo_url !== '/logo-fish.svg')
    ? currentSettings.logo_url
    : '/logo.jpeg';

  // Secondary variants (mobile, footer) only override if explicitly set to a custom URL different from the legacy default '/logo-fish.svg'
  let logoSrc = primaryLogo;
  if (
    variant === 'mobile' &&
    currentSettings.mobile_logo_url?.trim() &&
    currentSettings.mobile_logo_url !== '/logo-fish.svg'
  ) {
    logoSrc = currentSettings.mobile_logo_url;
  } else if (
    variant === 'footer' &&
    currentSettings.footer_logo_url?.trim() &&
    currentSettings.footer_logo_url !== '/logo-fish.svg'
  ) {
    logoSrc = currentSettings.footer_logo_url;
  }

  // Reset error fallback whenever target URL or version changes
  useEffect(() => {
    setHasError(false);
  }, [logoSrc, currentSettings.version]);

  // Safe cache-busting: do NOT append query parameters to base64 data URLs or blob URLs
  let finalSrc = logoSrc;
  if (hasError) {
    finalSrc = logoSrc !== '/logo.jpeg' ? '/logo.jpeg' : '/logo-fish.svg';
  } else if (
    currentSettings.version &&
    typeof logoSrc === 'string' &&
    !logoSrc.startsWith('data:') &&
    !logoSrc.startsWith('blob:')
  ) {
    const sep = logoSrc.includes('?') ? '&' : '?';
    finalSrc = `${logoSrc}${sep === '?' ? '?v=' : '&v='}${currentSettings.version}`;
  }

  const accessibleAlt = alt || currentSettings.site_name || 'Ra Guppy';

  return (
    <div className={`inline-flex items-center gap-2.5 max-w-full ${className}`}>
      <div className="relative shrink-0 flex items-center justify-center max-w-full max-h-full overflow-hidden">
        <img
          src={finalSrc}
          alt={accessibleAlt}
          onError={() => setHasError(true)}
          className={`max-w-full max-h-full object-contain transition-opacity duration-150 ${imgClassName}`}
          style={{ aspectRatio: 'auto' }}
          loading="eager"
        />
      </div>
      {showText && (
        <span className={`truncate ${textClassName}`}>
          {currentSettings.site_name || 'Ra Guppy'}
        </span>
      )}
    </div>
  );
};
