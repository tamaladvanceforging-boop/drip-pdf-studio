export interface CurrencyInfo {
  code: string;
  symbol: string;
  name: string;
  flag: string;
  proPriceMonthly: number; // e.g. 0 during promo, regular price
  adobeYearlyCost: number; // For comparison e.g. 19999 for INR, 239.88 for USD
}

export const CURRENCIES: Record<string, CurrencyInfo> = {
  INR: {
    code: "INR",
    symbol: "₹",
    name: "Indian Rupee (INR)",
    flag: "🇮🇳",
    proPriceMonthly: 799,
    adobeYearlyCost: 19999,
  },
  USD: {
    code: "USD",
    symbol: "$",
    name: "US Dollar (USD)",
    flag: "🇺🇸",
    proPriceMonthly: 12,
    adobeYearlyCost: 239.88,
  },
  BDT: {
    code: "BDT",
    symbol: "৳",
    name: "Bangladeshi Taka (BDT)",
    flag: "🇧🇩",
    proPriceMonthly: 1299,
    adobeYearlyCost: 26500,
  },
  EUR: {
    code: "EUR",
    symbol: "€",
    name: "Euro (EUR)",
    flag: "🇪🇺",
    proPriceMonthly: 11,
    adobeYearlyCost: 220,
  },
  GBP: {
    code: "GBP",
    symbol: "£",
    name: "British Pound (GBP)",
    flag: "🇬🇧",
    proPriceMonthly: 9.99,
    adobeYearlyCost: 199.99,
  },
  CAD: {
    code: "CAD",
    symbol: "CA$",
    name: "Canadian Dollar (CAD)",
    flag: "🇨🇦",
    proPriceMonthly: 16,
    adobeYearlyCost: 320,
  },
  AUD: {
    code: "AUD",
    symbol: "A$",
    name: "Australian Dollar (AUD)",
    flag: "🇦🇺",
    proPriceMonthly: 18,
    adobeYearlyCost: 360,
  },
};

/**
 * Auto-detect user's country currency from browser timezone and locale
 */
export function detectUserCurrency(): string {
  if (typeof window === "undefined") return "INR";

  // Check saved preference in localStorage
  try {
    const saved = localStorage.getItem("drippdf_currency");
    if (saved && CURRENCIES[saved]) return saved;
  } catch (e) {}

  try {
    const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone || "";
    const locale = navigator.language || "";

    // India detection
    if (
      timeZone.includes("Calcutta") ||
      timeZone.includes("Kolkata") ||
      locale.includes("en-IN") ||
      locale.includes("hi") ||
      locale.includes("bn-IN")
    ) {
      return "INR";
    }

    // Bangladesh
    if (timeZone.includes("Dhaka") || locale.includes("bn-BD")) {
      return "BDT";
    }

    // UK
    if (timeZone.includes("London") || locale.includes("en-GB")) {
      return "GBP";
    }

    // Europe
    if (
      timeZone.includes("Berlin") ||
      timeZone.includes("Paris") ||
      timeZone.includes("Rome") ||
      timeZone.includes("Madrid") ||
      timeZone.includes("Amsterdam")
    ) {
      return "EUR";
    }

    // Canada
    if (timeZone.includes("Toronto") || timeZone.includes("Vancouver") || locale.includes("en-CA")) {
      return "CAD";
    }

    // Australia
    if (timeZone.includes("Sydney") || timeZone.includes("Melbourne") || locale.includes("en-AU")) {
      return "AUD";
    }

    // USA / Default fallback
    if (timeZone.includes("America") || locale.includes("en-US")) {
      return "USD";
    }
  } catch (e) {
    // Fallback to INR as requested
    return "INR";
  }

  return "INR";
}
