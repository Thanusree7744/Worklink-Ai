/**
 * Form Validation Utilities
 * Reusable validation functions for common form patterns
 */

export interface ValidationError {
  field: string;
  message: string;
}

export interface ValidationResult {
  isValid: boolean;
  errors: ValidationError[];
}

/**
 * Validate email format
 */
export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * Validate password strength
 * Requires: 8+ chars, uppercase, lowercase, number
 */
export const validatePassword = (password: string): boolean => {
  if (password.length < 8) return false;
  if (!/[A-Z]/.test(password)) return false;
  if (!/[a-z]/.test(password)) return false;
  if (!/[0-9]/.test(password)) return false;
  return true;
};

/**
 * Get password strength feedback
 */
export const getPasswordStrength = (
  password: string
): 'weak' | 'medium' | 'strong' => {
  let strength = 0;

  if (password.length >= 8) strength++;
  if (password.length >= 12) strength++;
  if (/[A-Z]/.test(password)) strength++;
  if (/[a-z]/.test(password)) strength++;
  if (/[0-9]/.test(password)) strength++;
  if (/[!@#$%^&*]/.test(password)) strength++;

  if (strength < 3) return 'weak';
  if (strength < 5) return 'medium';
  return 'strong';
};

/**
 * Validate login form
 */
export const validateLoginForm = (data: {
  email?: string;
  password?: string;
}): ValidationResult => {
  const errors: ValidationError[] = [];

  if (!data.email) {
    errors.push({ field: 'email', message: 'Email is required' });
  } else if (!validateEmail(data.email)) {
    errors.push({ field: 'email', message: 'Invalid email format' });
  }

  if (!data.password) {
    errors.push({ field: 'password', message: 'Password is required' });
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
};

/**
 * Validate signup form
 */
export const validateSignupForm = (data: {
  name?: string;
  email?: string;
  password?: string;
  confirmPassword?: string;
}): ValidationResult => {
  const errors: ValidationError[] = [];

  if (!data.name) {
    errors.push({ field: 'name', message: 'Name is required' });
  } else if (data.name.length < 2) {
    errors.push({ field: 'name', message: 'Name must be at least 2 characters' });
  }

  if (!data.email) {
    errors.push({ field: 'email', message: 'Email is required' });
  } else if (!validateEmail(data.email)) {
    errors.push({ field: 'email', message: 'Invalid email format' });
  }

  if (!data.password) {
    errors.push({ field: 'password', message: 'Password is required' });
  } else if (!validatePassword(data.password)) {
    errors.push({
      field: 'password',
      message:
        'Password must be at least 8 characters with uppercase, lowercase, and numbers',
    });
  }

  if (!data.confirmPassword) {
    errors.push({
      field: 'confirmPassword',
      message: 'Please confirm your password',
    });
  } else if (data.password !== data.confirmPassword) {
    errors.push({
      field: 'confirmPassword',
      message: 'Passwords do not match',
    });
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
};

/**
 * Validate job posting form
 */
export const validateJobForm = (data: {
  title?: string;
  description?: string;
  budget?: number;
  skills?: string[];
}): ValidationResult => {
  const errors: ValidationError[] = [];

  if (!data.title) {
    errors.push({ field: 'title', message: 'Job title is required' });
  } else if (data.title.length < 5) {
    errors.push({
      field: 'title',
      message: 'Job title must be at least 5 characters',
    });
  }

  if (!data.description) {
    errors.push({ field: 'description', message: 'Job description is required' });
  } else if (data.description.length < 20) {
    errors.push({
      field: 'description',
      message: 'Job description must be at least 20 characters',
    });
  }

  if (!data.budget || data.budget <= 0) {
    errors.push({ field: 'budget', message: 'Valid budget is required' });
  }

  if (!data.skills || data.skills.length === 0) {
    errors.push({ field: 'skills', message: 'At least one skill is required' });
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
};

/**
 * Get error message for a specific field
 */
export const getFieldError = (
  errors: ValidationError[],
  fieldName: string
): string | null => {
  const error = errors.find((e) => e.field === fieldName);
  return error ? error.message : null;
};

/**
 * Convert error array to object for easier access
 */
export const errorsToObject = (errors: ValidationError[]): Record<string, string> => {
  return errors.reduce(
    (acc, error) => {
      acc[error.field] = error.message;
      return acc;
    },
    {} as Record<string, string>
  );
};
