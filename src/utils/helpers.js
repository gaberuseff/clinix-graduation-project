import {ARAB_COUNTRIES} from "./countries";

export function formatCurrency(amount, currencyCode) {
  if (
    amount === undefined ||
    amount === null ||
    amount === "" ||
    isNaN(Number(amount))
  )
    return "";

  const cleanAmount = Number(amount);

  // Find the country config matching the currency code to get its proper locale
  const country = ARAB_COUNTRIES.find(
    (c) => c.currency.toUpperCase() === currencyCode?.toUpperCase(),
  );

  const locale = country ? country.locale : "en-US";
  const currency = currencyCode || "USD";

  try {
    return new Intl.NumberFormat(locale, {
      style: "currency",
      currency: currency,
      currencyDisplay: "code",
      // Optional: limit minimum/maximum fraction digits if needed
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    }).format(cleanAmount);
  } catch (error) {
    // Fallback format if Intl fails
    const symbol = country ? country.currencySymbol : currency;
    return `${cleanAmount} ${symbol}`;
  }
}

// Add aliases to prevent typos in imports
export const formateCurrency = formatCurrency;
export const formateCurruncy = formatCurrency;

export function formatDate(dateInput, locale = "en-US") {
  if (!dateInput) return "";
  const date = new Date(dateInput);
  if (isNaN(date.getTime())) return "";

  return new Intl.DateTimeFormat(locale, {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
}

