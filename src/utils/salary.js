/**
 * Format a number as Indian currency string
 */
export const formatCurrency = (amount) => {
  const num = parseFloat(amount) || 0;
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(num);
};

/**
 * Convert number to words (Indian system)
 */
export const numberToWords = (num) => {
  const ones = ['', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven',
    'Eight', 'Nine', 'Ten', 'Eleven', 'Twelve', 'Thirteen', 'Fourteen',
    'Fifteen', 'Sixteen', 'Seventeen', 'Eighteen', 'Nineteen'];
  const tens = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'];

  const convert = (n) => {
    if (n === 0) return '';
    if (n < 20) return ones[n] + ' ';
    if (n < 100) return tens[Math.floor(n / 10)] + ' ' + ones[n % 10] + ' ';
    if (n < 1000) return ones[Math.floor(n / 100)] + ' Hundred ' + convert(n % 100);
    if (n < 100000) return convert(Math.floor(n / 1000)) + 'Thousand ' + convert(n % 1000);
    if (n < 10000000) return convert(Math.floor(n / 100000)) + 'Lakh ' + convert(n % 100000);
    return convert(Math.floor(n / 10000000)) + 'Crore ' + convert(n % 10000000);
  };

  const intPart = Math.floor(Math.abs(num));
  const result = convert(intPart).trim();
  return result ? `Indian Rupee ${result} Only` : 'Indian Rupee Zero Only';
};

/**
 * Format YYYY-MM-DD to DD/MM/YYYY
 */
export const formatDisplayDate = (dateStr) => {
  if (!dateStr) return '';
  const parts = dateStr.split('-');
  if (parts.length === 3) {
    return `${parts[2]}/${parts[1]}/${parts[0]}`;
  }
  return dateStr;
};

/**
 * Get month name from month number
 */
export const getMonthName = (monthNum) => {
  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];
  return months[parseInt(monthNum, 10) - 1] || '';
};

/**
 * Generate a unique ID
 */
export const generateId = () =>
  Math.random().toString(36).substring(2, 9) + Date.now().toString(36);

/**
 * Calculate salary breakdown
 */
export const calculateSalary = (earnings, deductions) => {
  const getAmount = (val) => parseFloat(val?.amount !== undefined ? val.amount : val) || 0;
  
  const totalEarnings = (Array.isArray(earnings) ? earnings : Object.values(earnings))
    .reduce((s, v) => s + getAmount(v), 0);
  const totalDeductions = (Array.isArray(deductions) ? deductions : Object.values(deductions))
    .reduce((s, v) => s + getAmount(v), 0);
    
  const netSalary = totalEarnings - totalDeductions;
  return { totalEarnings, totalDeductions, netSalary };
};
