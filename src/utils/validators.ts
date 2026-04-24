/**
 * Validates email format
 * @param email - Email string to validate
 * @returns Boolean indicating validity
 */
export const validateEmail = (email: string): boolean => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
};

/**
 * Validates Ghana phone number format
 * @param phone - Phone number string
 * @returns Boolean indicating validity
 */
export const validatePhone = (phone: string): boolean => {
  const re = /^(\+233|0)[0-9]{9}$/;
  return re.test(phone);
};

/**
 * Validates password strength (8+ chars, upper, lower, number, special char)
 * @param password - Password string to validate
 * @returns Boolean indicating validity
 */
export const validatePasswordStrength = (password: string): boolean => {
  const re = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
  return re.test(password);
};

/**
 * Validates booking code format (8 uppercase chars, no ambiguous chars)
 * @param code - Booking code string
 * @returns Boolean indicating validity
 */
export const validateBookingCode = (code: string): boolean => {
  const re = /^[A-HJ-NP-Z2-9]{8}$/;
  return re.test(code);
};

/**
 * Validates stake amount within min/max bounds
 * @param amount - Stake amount
 * @param min - Minimum stake (default 1)
 * @param max - Maximum stake (default 10000)
 * @returns Boolean indicating validity
 */
export const validateStakeAmount = (amount: number, min: number = 1, max: number = 10000): boolean => {
  return amount >= min && amount <= max;
};
