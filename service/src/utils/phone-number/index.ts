import { isPossiblePhoneNumber, isValidPhoneNumber, parsePhoneNumber } from 'libphonenumber-js';

// Function to validate a phone number and return the detected country code
export function validatePhoneNumber(phoneNumber: string): { isValid: boolean, countryCode: string | null } {
  const parsedPhoneNumber = parsePhoneNumber(phoneNumber);

  if (parsedPhoneNumber) {
    const isValid = isValidPhoneNumber(phoneNumber, parsedPhoneNumber.country);
    return { isValid, countryCode: parsedPhoneNumber.country };
  }

  return { isValid: false, countryCode: null };
}

// Function to format a phone number
export function formatPhoneNumber(phoneNumber: string): {
  international: string;
  national: string;
  uri: string;
  e164Format: string;
} | null {
  const parsedPhoneNumber = parsePhoneNumber(phoneNumber);

  if (parsedPhoneNumber) {
    return {
      international: parsedPhoneNumber.formatInternational(),
      national: parsedPhoneNumber.formatNational(),
      uri: parsedPhoneNumber.getURI(),
      e164Format: parsedPhoneNumber.format('E.164')
    };
  }

  return null;
}