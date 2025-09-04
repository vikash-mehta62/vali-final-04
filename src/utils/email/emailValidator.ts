
/**
 * Validates an email address
 * @param email - The email address to validate
 * @returns True if the email is valid, false otherwise
 */
export const validateEmail = (email: string): boolean => {
  // Basic email validation regex
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * Validates a list of comma-separated email addresses
 * @param emailList - Comma-separated list of email addresses
 * @returns True if all emails are valid, false otherwise
 */
export const validateEmailList = (emailList: string): boolean => {
  if (!emailList) return true;
  
  const emails = emailList.split(',').map(email => email.trim());
  return emails.every(email => !email || validateEmail(email));
};

/**
 * Checks if a string contains valid email domain
 * @param domain - The domain to check
 * @returns True if the domain is valid, false otherwise
 */
export const isValidEmailDomain = (domain: string): boolean => {
  // Domain validation regex - basic check for valid domain format
  const domainRegex = /^[a-zA-Z0-9][a-zA-Z0-9-]{0,61}[a-zA-Z0-9](?:\.[a-zA-Z]{2,})+$/;
  return domainRegex.test(domain);
};

/**
 * Parse a string of email addresses and return a cleaned array
 * @param emailString - String containing emails (comma or semicolon separated)
 * @returns Array of valid email addresses
 */
export const parseEmailAddresses = (emailString: string): string[] => {
  if (!emailString) return [];
  
  // Split by comma or semicolon
  const emails = emailString.split(/[,;]/).map(email => email.trim());
  
  // Filter out invalid emails
  return emails.filter(email => validateEmail(email));
};
