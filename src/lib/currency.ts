// Currency utilities for localized price display
// Default: South African Rand (ZAR) with R symbol
// Converts to user's local currency when detected

export interface CurrencyConfig {
  code: string;
  symbol: string;
  name: string;
  rate: number; // Rate from ZAR to this currency
}

// Supported currencies with approximate exchange rates from ZAR
// Rates should be updated periodically or fetched from an API in production
export const CURRENCIES: Record<string, CurrencyConfig> = {
  ZAR: { code: "ZAR", symbol: "R", name: "South African Rand", rate: 1 },
  USD: { code: "USD", symbol: "$", name: "US Dollar", rate: 0.055 },
  EUR: { code: "EUR", symbol: "€", name: "Euro", rate: 0.050 },
  GBP: { code: "GBP", symbol: "£", name: "British Pound", rate: 0.043 },
  NGN: { code: "NGN", symbol: "₦", name: "Nigerian Naira", rate: 85 },
  KES: { code: "KES", symbol: "KSh", name: "Kenyan Shilling", rate: 7.0 },
  GHS: { code: "GHS", symbol: "GH₵", name: "Ghanaian Cedi", rate: 0.66 },
  BWP: { code: "BWP", symbol: "P", name: "Botswana Pula", rate: 0.74 },
  MZN: { code: "MZN", symbol: "MT", name: "Mozambican Metical", rate: 3.5 },
  ZMW: { code: "ZMW", symbol: "ZK", name: "Zambian Kwacha", rate: 1.4 },
  NAD: { code: "NAD", symbol: "N$", name: "Namibian Dollar", rate: 1 }, // Pegged to ZAR
  SZL: { code: "SZL", symbol: "E", name: "Swazi Lilangeni", rate: 1 }, // Pegged to ZAR
  LSL: { code: "LSL", symbol: "L", name: "Lesotho Loti", rate: 1 }, // Pegged to ZAR
  INR: { code: "INR", symbol: "₹", name: "Indian Rupee", rate: 4.6 },
  AUD: { code: "AUD", symbol: "A$", name: "Australian Dollar", rate: 0.083 },
  CAD: { code: "CAD", symbol: "C$", name: "Canadian Dollar", rate: 0.075 },
};

// Map country codes to currency codes
const COUNTRY_TO_CURRENCY: Record<string, string> = {
  ZA: "ZAR", // South Africa
  US: "USD",
  GB: "GBP",
  EU: "EUR", // Generic EU
  DE: "EUR",
  FR: "EUR",
  IT: "EUR",
  ES: "EUR",
  NL: "EUR",
  BE: "EUR",
  PT: "EUR",
  IE: "EUR",
  AT: "EUR",
  NG: "NGN", // Nigeria
  KE: "KES", // Kenya
  GH: "GHS", // Ghana
  BW: "BWP", // Botswana
  MZ: "MZN", // Mozambique
  ZM: "ZMW", // Zambia
  NA: "NAD", // Namibia
  SZ: "SZL", // Eswatini
  LS: "LSL", // Lesotho
  IN: "INR", // India
  AU: "AUD", // Australia
  CA: "CAD", // Canada
};

// Default currency is ZAR
let currentCurrency: CurrencyConfig = CURRENCIES.ZAR;
let userCountryCode: string | null = null;

/**
 * Detect user's country from browser locale or timezone
 */
export const detectUserCountry = (): string => {
  // Try to get from cached value
  if (userCountryCode) return userCountryCode;

  try {
    // Method 1: Use browser's language/region
    const locale = navigator.language || (navigator as any).userLanguage || "en-ZA";
    const parts = locale.split("-");
    if (parts.length > 1) {
      const countryCode = parts[1].toUpperCase();
      if (COUNTRY_TO_CURRENCY[countryCode]) {
        userCountryCode = countryCode;
        return countryCode;
      }
    }

    // Method 2: Use timezone to guess country
    const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    if (timezone) {
      if (timezone.includes("Johannesburg") || timezone.includes("Africa/")) {
        userCountryCode = "ZA";
        return "ZA";
      }
      if (timezone.includes("London")) {
        userCountryCode = "GB";
        return "GB";
      }
      if (timezone.includes("New_York") || timezone.includes("Los_Angeles") || timezone.includes("Chicago")) {
        userCountryCode = "US";
        return "US";
      }
      if (timezone.includes("Lagos")) {
        userCountryCode = "NG";
        return "NG";
      }
      if (timezone.includes("Nairobi")) {
        userCountryCode = "KE";
        return "KE";
      }
    }
  } catch (e) {
    console.warn("Could not detect user country:", e);
  }

  // Default to South Africa
  userCountryCode = "ZA";
  return "ZA";
};

/**
 * Get the current currency configuration
 * Always returns ZAR - no currency conversion
 */
export const getUserCurrency = (): CurrencyConfig => {
  // Always use ZAR regardless of user location
  return CURRENCIES.ZAR;
};

/**
 * Set currency manually (override auto-detection)
 */
export const setCurrency = (currencyCode: string): void => {
  if (CURRENCIES[currencyCode]) {
    currentCurrency = CURRENCIES[currencyCode];
  }
};

/**
 * Convert amount from ZAR to user's local currency
 */
export const convertFromZAR = (amountZAR: number, targetCurrency?: CurrencyConfig): number => {
  const currency = targetCurrency || getUserCurrency();
  return amountZAR * currency.rate;
};

/**
 * Format price for display with proper currency symbol
 * Always shows ZAR as primary, with local equivalent if different
 * @param amountZAR - Amount in South African Rand
 * @param showLocalEquivalent - Whether to show local currency equivalent
 */
export const formatPrice = (
  amountZAR: number,
  options?: {
    showLocalEquivalent?: boolean;
    decimals?: number;
  }
): string => {
  const { showLocalEquivalent = false, decimals = 0 } = options || {};

  // Primary display in ZAR
  const zarFormatted = `R${amountZAR.toFixed(decimals)}`;

  if (!showLocalEquivalent) {
    return zarFormatted;
  }

  const userCurrency = getUserCurrency();
  
  // If user is in ZAR region, just return ZAR
  if (userCurrency.code === "ZAR") {
    return zarFormatted;
  }

  // Show local equivalent
  const localAmount = convertFromZAR(amountZAR, userCurrency);
  const localFormatted = `${userCurrency.symbol}${localAmount.toFixed(decimals)}`;

  return `${zarFormatted} (~${localFormatted})`;
};

/**
 * Format price - always in ZAR
 */
export const formatLocalPrice = (amountZAR: number, decimals: number = 0): string => {
  return `R${amountZAR.toFixed(decimals)}`;
};

/**
 * Get the currency symbol - always R for ZAR
 */
export const getCurrencySymbol = (): string => {
  return "R";
};

/**
 * Check if user is in South Africa
 */
export const isLocalUser = (): boolean => {
  return detectUserCountry() === "ZA";
};
