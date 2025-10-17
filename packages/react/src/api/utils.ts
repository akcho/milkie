/**
 * Shared utility functions for API routes
 */

/**
 * Validates email format using robust regex pattern
 * @param email - Email address to validate
 * @returns true if email format is valid, false otherwise
 * @example
 * ```ts
 * isValidEmail('user@example.com') // true
 * isValidEmail('invalid') // false
 * isValidEmail('user@gmail..com') // false
 * ```
 */
export function isValidEmail(email: string): boolean {
  // RFC 5321 compliant email validation
  // Checks for: proper structure, no consecutive dots, valid length
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
  const hasValidStructure = emailRegex.test(email);
  const hasNoConsecutiveDots = !email.includes("..");
  const isValidLength = email.length >= 5 && email.length <= 254; // RFC 5321 max length

  return hasValidStructure && hasNoConsecutiveDots && isValidLength;
}
