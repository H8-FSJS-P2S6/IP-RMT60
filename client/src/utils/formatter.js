/**
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
 * Example usage:
 * formatToIDR(150000)     -> "Rp 150.000"
 * formatToIDR("200000")   -> "Rp 200.000"
 * formatToIDR(1500500)    -> "Rp 1.500.500"
 * formatToIDR(null)       -> "Rp 0"
 * formatToIDR(undefined)  -> "Rp 0"
 * formatToIDR("invalid")  -> "Rp 0"
 */