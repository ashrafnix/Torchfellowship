'use client';

import React, { useState, useRef, useEffect, useCallback } from 'react';

export interface Country {
  name: string;
  code: string;   // ISO 3166-1 alpha-2
  dial: string;   // e.g. "+1"
  flag: string;   // emoji flag
}

export const COUNTRIES: Country[] = [
  { name: 'Afghanistan', code: 'AF', dial: '+93', flag: '🇦🇫' },
  { name: 'Albania', code: 'AL', dial: '+355', flag: '🇦🇱' },
  { name: 'Algeria', code: 'DZ', dial: '+213', flag: '🇩🇿' },
  { name: 'Argentina', code: 'AR', dial: '+54', flag: '🇦🇷' },
  { name: 'Australia', code: 'AU', dial: '+61', flag: '🇦🇺' },
  { name: 'Austria', code: 'AT', dial: '+43', flag: '🇦🇹' },
  { name: 'Bangladesh', code: 'BD', dial: '+880', flag: '🇧🇩' },
  { name: 'Belgium', code: 'BE', dial: '+32', flag: '🇧🇪' },
  { name: 'Bolivia', code: 'BO', dial: '+591', flag: '🇧🇴' },
  { name: 'Brazil', code: 'BR', dial: '+55', flag: '🇧🇷' },
  { name: 'Cameroon', code: 'CM', dial: '+237', flag: '🇨🇲' },
  { name: 'Canada', code: 'CA', dial: '+1', flag: '🇨🇦' },
  { name: 'Chile', code: 'CL', dial: '+56', flag: '🇨🇱' },
  { name: 'China', code: 'CN', dial: '+86', flag: '🇨🇳' },
  { name: 'Colombia', code: 'CO', dial: '+57', flag: '🇨🇴' },
  { name: 'Congo (DRC)', code: 'CD', dial: '+243', flag: '🇨🇩' },
  { name: 'Congo (Republic)', code: 'CG', dial: '+242', flag: '🇨🇬' },
  { name: 'Costa Rica', code: 'CR', dial: '+506', flag: '🇨🇷' },
  { name: "Côte d'Ivoire", code: 'CI', dial: '+225', flag: '🇨🇮' },
  { name: 'Czech Republic', code: 'CZ', dial: '+420', flag: '🇨🇿' },
  { name: 'Denmark', code: 'DK', dial: '+45', flag: '🇩🇰' },
  { name: 'Dominican Republic', code: 'DO', dial: '+1-809', flag: '🇩🇴' },
  { name: 'Ecuador', code: 'EC', dial: '+593', flag: '🇪🇨' },
  { name: 'Egypt', code: 'EG', dial: '+20', flag: '🇪🇬' },
  { name: 'El Salvador', code: 'SV', dial: '+503', flag: '🇸🇻' },
  { name: 'Ethiopia', code: 'ET', dial: '+251', flag: '🇪🇹' },
  { name: 'Finland', code: 'FI', dial: '+358', flag: '🇫🇮' },
  { name: 'France', code: 'FR', dial: '+33', flag: '🇫🇷' },
  { name: 'Germany', code: 'DE', dial: '+49', flag: '🇩🇪' },
  { name: 'Ghana', code: 'GH', dial: '+233', flag: '🇬🇭' },
  { name: 'Greece', code: 'GR', dial: '+30', flag: '🇬🇷' },
  { name: 'Guatemala', code: 'GT', dial: '+502', flag: '🇬🇹' },
  { name: 'Honduras', code: 'HN', dial: '+504', flag: '🇭🇳' },
  { name: 'Hungary', code: 'HU', dial: '+36', flag: '🇭🇺' },
  { name: 'India', code: 'IN', dial: '+91', flag: '🇮🇳' },
  { name: 'Indonesia', code: 'ID', dial: '+62', flag: '🇮🇩' },
  { name: 'Iraq', code: 'IQ', dial: '+964', flag: '🇮🇶' },
  { name: 'Ireland', code: 'IE', dial: '+353', flag: '🇮🇪' },
  { name: 'Israel', code: 'IL', dial: '+972', flag: '🇮🇱' },
  { name: 'Italy', code: 'IT', dial: '+39', flag: '🇮🇹' },
  { name: 'Jamaica', code: 'JM', dial: '+1-876', flag: '🇯🇲' },
  { name: 'Japan', code: 'JP', dial: '+81', flag: '🇯🇵' },
  { name: 'Jordan', code: 'JO', dial: '+962', flag: '🇯🇴' },
  { name: 'Kenya', code: 'KE', dial: '+254', flag: '🇰🇪' },
  { name: 'Kuwait', code: 'KW', dial: '+965', flag: '🇰🇼' },
  { name: 'Lebanon', code: 'LB', dial: '+961', flag: '🇱🇧' },
  { name: 'Libya', code: 'LY', dial: '+218', flag: '🇱🇾' },
  { name: 'Malaysia', code: 'MY', dial: '+60', flag: '🇲🇾' },
  { name: 'Mexico', code: 'MX', dial: '+52', flag: '🇲🇽' },
  { name: 'Morocco', code: 'MA', dial: '+212', flag: '🇲🇦' },
  { name: 'Mozambique', code: 'MZ', dial: '+258', flag: '🇲🇿' },
  { name: 'Myanmar', code: 'MM', dial: '+95', flag: '🇲🇲' },
  { name: 'Netherlands', code: 'NL', dial: '+31', flag: '🇳🇱' },
  { name: 'New Zealand', code: 'NZ', dial: '+64', flag: '🇳🇿' },
  { name: 'Nicaragua', code: 'NI', dial: '+505', flag: '🇳🇮' },
  { name: 'Nigeria', code: 'NG', dial: '+234', flag: '🇳🇬' },
  { name: 'Norway', code: 'NO', dial: '+47', flag: '🇳🇴' },
  { name: 'Pakistan', code: 'PK', dial: '+92', flag: '🇵🇰' },
  { name: 'Panama', code: 'PA', dial: '+507', flag: '🇵🇦' },
  { name: 'Paraguay', code: 'PY', dial: '+595', flag: '🇵🇾' },
  { name: 'Peru', code: 'PE', dial: '+51', flag: '🇵🇪' },
  { name: 'Philippines', code: 'PH', dial: '+63', flag: '🇵🇭' },
  { name: 'Poland', code: 'PL', dial: '+48', flag: '🇵🇱' },
  { name: 'Portugal', code: 'PT', dial: '+351', flag: '🇵🇹' },
  { name: 'Romania', code: 'RO', dial: '+40', flag: '🇷🇴' },
  { name: 'Russia', code: 'RU', dial: '+7', flag: '🇷🇺' },
  { name: 'Rwanda', code: 'RW', dial: '+250', flag: '🇷🇼' },
  { name: 'Saudi Arabia', code: 'SA', dial: '+966', flag: '🇸🇦' },
  { name: 'Senegal', code: 'SN', dial: '+221', flag: '🇸🇳' },
  { name: 'Sierra Leone', code: 'SL', dial: '+232', flag: '🇸🇱' },
  { name: 'Singapore', code: 'SG', dial: '+65', flag: '🇸🇬' },
  { name: 'Somalia', code: 'SO', dial: '+252', flag: '🇸🇴' },
  { name: 'South Africa', code: 'ZA', dial: '+27', flag: '🇿🇦' },
  { name: 'South Korea', code: 'KR', dial: '+82', flag: '🇰🇷' },
  { name: 'South Sudan', code: 'SS', dial: '+211', flag: '🇸🇸' },
  { name: 'Spain', code: 'ES', dial: '+34', flag: '🇪🇸' },
  { name: 'Sri Lanka', code: 'LK', dial: '+94', flag: '🇱🇰' },
  { name: 'Sudan', code: 'SD', dial: '+249', flag: '🇸🇩' },
  { name: 'Sweden', code: 'SE', dial: '+46', flag: '🇸🇪' },
  { name: 'Switzerland', code: 'CH', dial: '+41', flag: '🇨🇭' },
  { name: 'Tanzania', code: 'TZ', dial: '+255', flag: '🇹🇿' },
  { name: 'Thailand', code: 'TH', dial: '+66', flag: '🇹🇭' },
  { name: 'Trinidad and Tobago', code: 'TT', dial: '+1-868', flag: '🇹🇹' },
  { name: 'Tunisia', code: 'TN', dial: '+216', flag: '🇹🇳' },
  { name: 'Turkey', code: 'TR', dial: '+90', flag: '🇹🇷' },
  { name: 'Uganda', code: 'UG', dial: '+256', flag: '🇺🇬' },
  { name: 'Ukraine', code: 'UA', dial: '+380', flag: '🇺🇦' },
  { name: 'United Arab Emirates', code: 'AE', dial: '+971', flag: '🇦🇪' },
  { name: 'United Kingdom', code: 'GB', dial: '+44', flag: '🇬🇧' },
  { name: 'United States', code: 'US', dial: '+1', flag: '🇺🇸' },
  { name: 'Uruguay', code: 'UY', dial: '+598', flag: '🇺🇾' },
  { name: 'Venezuela', code: 'VE', dial: '+58', flag: '🇻🇪' },
  { name: 'Vietnam', code: 'VN', dial: '+84', flag: '🇻🇳' },
  { name: 'Yemen', code: 'YE', dial: '+967', flag: '🇾🇪' },
  { name: 'Zambia', code: 'ZM', dial: '+260', flag: '🇿🇲' },
  { name: 'Zimbabwe', code: 'ZW', dial: '+263', flag: '🇿🇼' },
];

interface PhoneInputProps {
  /** Called whenever the combined value changes. Value is e.g. "+256 771234567" */
  onChange?: (fullNumber: string, dialCode: string, number: string, country: Country) => void;
  /** Name used for the hidden input that submits the dial code */
  dialCodeName?: string;
  /** Name used for the number input */
  numberName?: string;
  /** Pre-select a country by ISO code */
  defaultCountryCode?: string;
  required?: boolean;
  label?: string;
}

const DEFAULT_COUNTRY = COUNTRIES.find((c) => c.code === 'UG') ?? COUNTRIES[0];

const PhoneInput: React.FC<PhoneInputProps> = ({
  onChange,
  dialCodeName = 'areaCode',
  numberName = 'phoneNumber',
  defaultCountryCode = 'UG',
  required = false,
  label = 'Phone Number',
}) => {
  const [selected, setSelected] = useState<Country>(
    COUNTRIES.find((c) => c.code === defaultCountryCode) ?? DEFAULT_COUNTRY
  );
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [number, setNumber] = useState('');
  const dropdownRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLInputElement>(null);

  const filtered = search.trim()
    ? COUNTRIES.filter(
        (c) =>
          c.name.toLowerCase().includes(search.toLowerCase()) ||
          c.dial.includes(search)
      )
    : COUNTRIES;

  const handleSelect = useCallback(
    (country: Country) => {
      setSelected(country);
      setIsOpen(false);
      setSearch('');
      onChange?.(country.dial + ' ' + number, country.dial, number, country);
    },
    [number, onChange]
  );

  const handleNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value.replace(/[^0-9]/g, '');
    setNumber(val);
    onChange?.(selected.dial + ' ' + val, selected.dial, val, selected);
  };

  // Close dropdown on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false);
        setSearch('');
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  // Focus search when dropdown opens
  useEffect(() => {
    if (isOpen) setTimeout(() => searchRef.current?.focus(), 50);
  }, [isOpen]);

  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-medium text-brand-text-dark mb-1">
          {label}
          {required && <span className="text-red-400 ml-1">*</span>}
        </label>
      )}

      {/* Hidden inputs for form submission */}
      <input type="hidden" name={dialCodeName} value={selected.dial} />

      <div className="flex gap-2">
        {/* Country dial code dropdown trigger */}
        <div ref={dropdownRef} className="relative flex-shrink-0">
          <button
            type="button"
            onClick={() => setIsOpen((v) => !v)}
            aria-haspopup="listbox"
            aria-expanded={isOpen}
            className="h-[46px] flex items-center gap-2 px-3 bg-brand-muted border border-brand-muted rounded-md text-brand-text hover:border-brand-gold/60 focus:outline-none focus:ring-2 focus:ring-brand-gold/50 focus:border-brand-gold transition-all duration-200 min-w-[110px]"
          >
            <span className="text-xl leading-none">{selected.flag}</span>
            <span className="text-sm font-mono text-brand-gold font-semibold">{selected.dial}</span>
            <svg
              className={`w-3.5 h-3.5 text-brand-text-dark ml-auto transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
              fill="none" viewBox="0 0 24 24" stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>

          {isOpen && (
            <div
              role="listbox"
              className="absolute z-50 top-full left-0 mt-1 w-72 bg-brand-surface border border-brand-muted/60 rounded-lg shadow-2xl overflow-hidden"
            >
              {/* Search */}
              <div className="p-2 border-b border-brand-muted/40">
                <input
                  ref={searchRef}
                  type="text"
                  placeholder="Search country or code…"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full bg-brand-muted text-brand-text text-sm px-3 py-2 rounded-md border border-brand-muted focus:outline-none focus:ring-1 focus:ring-brand-gold/50 placeholder-gray-500"
                />
              </div>

              {/* List */}
              <ul className="max-h-56 overflow-y-auto divide-y divide-brand-muted/20">
                {filtered.length === 0 ? (
                  <li className="px-4 py-3 text-sm text-brand-text-dark text-center">No results</li>
                ) : (
                  filtered.map((country) => (
                    <li
                      key={country.code}
                      role="option"
                      aria-selected={selected.code === country.code}
                      onClick={() => handleSelect(country)}
                      className={`flex items-center gap-3 px-4 py-2.5 cursor-pointer transition-colors duration-100 text-sm
                        ${selected.code === country.code
                          ? 'bg-brand-gold/10 text-brand-gold'
                          : 'text-brand-text hover:bg-brand-muted/60'
                        }`}
                    >
                      <span className="text-xl leading-none">{country.flag}</span>
                      <span className="flex-1 truncate">{country.name}</span>
                      <span className="font-mono text-xs text-brand-text-dark shrink-0">{country.dial}</span>
                    </li>
                  ))
                )}
              </ul>
            </div>
          )}
        </div>

        {/* Phone number field */}
        <input
          type="tel"
          name={numberName}
          value={number}
          onChange={handleNumberChange}
          required={required}
          placeholder="Phone number"
          inputMode="numeric"
          className="flex-1 h-[46px] bg-brand-muted border border-brand-muted rounded-md px-4 text-brand-text placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-brand-gold/50 focus:border-brand-gold transition-shadow duration-300 text-sm"
        />
      </div>

      {/* Preview of full number */}
      {number && (
        <p className="mt-1.5 text-xs text-brand-text-dark">
          Full number: <span className="text-brand-gold font-mono">{selected.dial} {number}</span>
        </p>
      )}
    </div>
  );
};

export default PhoneInput;
