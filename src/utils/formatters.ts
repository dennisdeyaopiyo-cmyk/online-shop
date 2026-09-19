/**
 * Formatter utilities for Kenyan Shillings (KES / KSh) and M-Pesa
 */

export function formatKSh(amount: number): string {
  return `KSh ${amount.toLocaleString('en-KE')}`;
}

/**
 * Validates Kenyan phone numbers:
 * Accepts: 0712345678, 0112345678, 254712345678, +254712345678
 */
export function normalizeKenyanPhone(input: string): { isValid: boolean; formatted: string; raw: string } {
  // strip spaces, dashes, parentheses
  const clean = input.replace(/[\s\-\(\)]/g, '');
  
  let standardized = '';
  if (clean.startsWith('+254')) {
    standardized = clean.substring(1);
  } else if (clean.startsWith('254')) {
    standardized = clean;
  } else if (clean.startsWith('07') || clean.startsWith('01')) {
    standardized = `254${clean.substring(1)}`;
  } else if (clean.length === 9 && (clean.startsWith('7') || clean.startsWith('1'))) {
    standardized = `254${clean}`;
  }

  const isValid = /^254(7|1)\d{8}$/.test(standardized);
  const displayFormatted = standardized.length === 12
    ? `+254 ${standardized.substring(3, 6)} ${standardized.substring(6, 9)} ${standardized.substring(9)}`
    : input;

  return {
    isValid,
    formatted: displayFormatted,
    raw: standardized,
  };
}

/**
 * Generates an authentic M-Pesa Receipt Code (e.g. QK84TX92M1)
 */
export function generateMpesaReceiptCode(): string {
  const letters = 'ABCDEFGHJKLMNPQRSTUVWXYZ';
  const numbers = '0123456789';
  
  // Format: 2 letters, 2 numbers, 2 letters, 4 alphanumeric
  let code = '';
  code += letters.charAt(Math.floor(Math.random() * letters.length));
  code += letters.charAt(Math.floor(Math.random() * letters.length));
  code += numbers.charAt(Math.floor(Math.random() * numbers.length));
  code += numbers.charAt(Math.floor(Math.random() * numbers.length));
  code += letters.charAt(Math.floor(Math.random() * letters.length));
  code += letters.charAt(Math.floor(Math.random() * letters.length));
  for (let i = 0; i < 4; i++) {
    const pool = Math.random() > 0.5 ? letters : numbers;
    code += pool.charAt(Math.floor(Math.random() * pool.length));
  }
  return code;
}

export function generateOrderNumber(): string {
  const randomNum = Math.floor(10000 + Math.random() * 90000);
  return `FW-KE-${randomNum}`;
}

export function formatDate(dateString: string): string {
  const d = new Date(dateString);
  return d.toLocaleDateString('en-KE', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}
