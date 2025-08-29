/**
 * @deprecated Use formatToUSD for internationalization.
 * Formats a number to Indonesian Rupiah (IDR) currency format
 * @param {number} amount - The amount to format
 * @returns {string} Formatted currency string
 */
export const formatToIDR = (amount) => {
  // Handle null, undefined or non-numeric values
  if (!amount || isNaN(amount)) {
    return 'Rp 0';
  }

  // Convert to number if string
  const numericAmount = typeof amount === 'string' ? parseFloat(amount) : amount;

  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(numericAmount);
};

/**
 * Formats a number to United States Dollar (USD) currency format
 * @param {number} amount - The amount to format
 * @returns {string} Formatted currency string
 */
export const formatToUSD = (amount) => {
  // Handle null, undefined or non-numeric values
  if (!amount || isNaN(amount)) {
    return '$0.00';
  }

  // Convert to number if string
  const numericAmount = typeof amount === 'string' ? parseFloat(amount) : amount;

  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(numericAmount);
};
