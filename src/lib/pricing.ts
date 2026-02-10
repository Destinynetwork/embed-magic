// Pricing utilities for VAT and commission calculations
// VAT: 15% | Commission: 6% (non-refundable on refunds)
// Access: View-only for 30 days from purchase

export const VAT_RATE = 15; // 15%
export const COMMISSION_RATE = 6; // 6% on ALL sales (PPV, subscriptions, bundles)
export const ACCESS_DURATION_DAYS = 30; // Default viewing period

/**
 * Calculate access expiry date from purchase
 */
export const calculateAccessExpiry = (purchaseDate: Date = new Date()): Date => {
  const expiry = new Date(purchaseDate);
  expiry.setDate(expiry.getDate() + ACCESS_DURATION_DAYS);
  return expiry;
};

/**
 * Calculate inclusive price from base price
 * Formula: base * (1 + VAT/100) * (1 + Commission/100)
 */
export const calculateInclusivePrice = (basePrice: number): number => {
  const withVat = basePrice * (1 + VAT_RATE / 100);
  const withCommission = withVat * (1 + COMMISSION_RATE / 100);
  return Math.round(withCommission * 100) / 100;
};

/**
 * Calculate VAT amount from base price
 */
export const calculateVatAmount = (basePrice: number): number => {
  return Math.round(basePrice * (VAT_RATE / 100) * 100) / 100;
};

/**
 * Calculate commission amount from price with VAT
 */
export const calculateCommissionAmount = (basePrice: number): number => {
  const withVat = basePrice * (1 + VAT_RATE / 100);
  return Math.round(withVat * (COMMISSION_RATE / 100) * 100) / 100;
};

/**
 * Get price breakdown from base price
 */
export const getPriceBreakdown = (basePrice: number) => {
  const vatAmount = calculateVatAmount(basePrice);
  const priceWithVat = basePrice + vatAmount;
  const commissionAmount = calculateCommissionAmount(basePrice);
  const totalInclusive = calculateInclusivePrice(basePrice);

  return {
    basePrice,
    vatAmount,
    vatRate: VAT_RATE,
    priceWithVat,
    commissionAmount,
    commissionRate: COMMISSION_RATE,
    totalInclusive,
  };
};

/**
 * Calculate refund amount (commission is non-refundable)
 */
export const calculateRefundAmount = (totalPaid: number, basePrice: number): number => {
  const commissionAmount = calculateCommissionAmount(basePrice);
  return Math.round((totalPaid - commissionAmount) * 100) / 100;
};

/**
 * Format price for display
 */
export const formatPrice = (amount: number): string => {
  return `R${amount.toFixed(2)}`;
};
