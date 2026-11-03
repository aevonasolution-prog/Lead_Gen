import { FormValidationErrors, LeadFormData } from '../types';

/**
 * Validates the Lead Generation Form according to enterprise requirements:
 * - Full Name: Required, min 2 chars, letters/spaces/hyphens/apostrophes
 * - Email: Required, RFC-compliant format
 * - Phone: Required, valid phone pattern, min 8 digits
 * - Location: Required, min 2 chars
 * - Service: Required selection from approved categories
 * - Message: Optional or min length check if entered
 */
export function validateLeadForm(data: LeadFormData): {
  isValid: boolean;
  errors: FormValidationErrors;
} {
  const errors: FormValidationErrors = {};

  // Full Name validation
  const trimmedName = data.fullName.trim();
  if (!trimmedName) {
    errors.fullName = 'Full name is required';
  } else if (trimmedName.length < 2) {
    errors.fullName = 'Name must be at least 2 characters long';
  } else if (!/^[a-zA-Z\s'\-]+$/.test(trimmedName)) {
    errors.fullName = 'Name should only contain letters, spaces, hyphens, and apostrophes';
  }

  // Email validation
  const trimmedEmail = data.email.trim();
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  if (!trimmedEmail) {
    errors.email = 'Email address is required';
  } else if (!emailRegex.test(trimmedEmail)) {
    errors.email = 'Please provide a valid email address (e.g. name@company.com)';
  }

  // Phone validation
  const trimmedPhone = data.phone.trim();
  const digitsOnly = trimmedPhone.replace(/\D/g, '');
  // Accepts standard national/international telephone formats with optional +, spaces, hyphens, parentheses, and dots
  const phonePattern = /^\+?[0-9\s\-().]{8,25}$/;

  if (!trimmedPhone) {
    errors.phone = 'Phone number is required';
  } else if (
    digitsOnly.length < 8 ||
    digitsOnly.length > 15 ||
    !phonePattern.test(trimmedPhone) ||
    trimmedPhone.includes('++')
  ) {
    errors.phone = 'Please enter a valid telephone number (8–15 digits)';
  }

  // Location / Postcode validation
  const trimmedLocation = data.location.trim();
  if (!trimmedLocation) {
    errors.location = 'Location or postcode is required';
  } else if (trimmedLocation.length < 2) {
    errors.location = 'Please provide a valid city, region, or postcode';
  }

  // Service Required validation
  if (!data.serviceRequired) {
    errors.serviceRequired = 'Please select the service you require';
  }

  // Message validation
  const trimmedMessage = data.message.trim();
  if (trimmedMessage && trimmedMessage.length > 2000) {
    errors.message = 'Message must not exceed 2,000 characters';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
}

/**
 * Format phone number display
 */
export function sanitizeInput(value: string): string {
  return value.trim();
}
