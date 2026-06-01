'use client';

import React, { useState, useEffect } from 'react';
import { getCookie, setCookie } from '@/lib/cookies';
import { ICONS } from '@/src/constants';

const CookieConsent: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [isRendered, setIsRendered] = useState(false);

  useEffect(() => {
    // Check if the user has already consented or declined
    const consent = getCookie('cookie_consent_accepted');
    if (consent === null) {
      // Small delay for smooth intro
      const timer = setTimeout(() => {
        setIsRendered(true);
        // Force reflow for transition animation
        setTimeout(() => setIsVisible(true), 50);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleAccept = () => {
    setIsVisible(false);
    setCookie('cookie_consent_accepted', 'true', 365); // 1 year
    setTimeout(() => setIsRendered(false), 500);
  };

  const handleDecline = () => {
    setIsVisible(false);
    setCookie('cookie_consent_accepted', 'false', 365); // Save preference
    setTimeout(() => setIsRendered(false), 500);
  };

  if (!isRendered) return null;

  return (
    <div
      className={`fixed bottom-6 left-6 right-6 md:left-auto md:right-6 md:max-w-md z-50 p-5 rounded-2xl border border-orange-500/20 bg-brand-dark/95 backdrop-blur-xl shadow-[0_20px_50px_rgba(0,0,0,0.5)] transition-all duration-500 ease-out transform ${
        isVisible ? 'translate-y-0 opacity-100' : 'translate-y-12 opacity-0'
      }`}
      role="dialog"
      aria-live="polite"
      aria-label="Cookie consent banner"
    >
      <div className="flex items-start gap-4">
        {/* Shield Icon container */}
        <div className="flex-shrink-0 p-2.5 rounded-lg bg-orange-500/10 border border-orange-500/20">
          <ICONS.Shield className="h-6 w-6 text-orange-400" />
        </div>

        <div className="flex-grow">
          <h3 className="text-base font-semibold text-white tracking-wide mb-1">
            Cookie Consent
          </h3>
          <p className="text-xs text-brand-text/80 leading-relaxed mb-4">
            We use cookies to improve your browsing experience, personalize content, and secure our administrative workspace.
          </p>

          <div className="flex items-center gap-3 justify-end">
            <button
              onClick={handleDecline}
              className="px-3.5 py-1.5 text-xs font-medium text-brand-text/70 bg-transparent hover:bg-white/5 border border-white/10 hover:border-white/20 rounded-lg transition-all duration-300 cursor-pointer"
            >
              Decline
            </button>
            <button
              onClick={handleAccept}
              className="px-4 py-1.5 text-xs font-semibold text-white bg-gradient-to-r from-orange-500 via-amber-500 to-yellow-500 hover:from-orange-600 hover:via-amber-600 hover:to-yellow-600 rounded-lg transition-all duration-300 shadow-[0_4px_12px_rgba(249,115,22,0.25)] hover:shadow-[0_4px_18px_rgba(249,115,22,0.4)] cursor-pointer"
            >
              Accept All
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CookieConsent;
