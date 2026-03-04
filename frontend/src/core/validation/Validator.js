/**
 * core/validation/Validator.js
 * Comprehensive validation system
 */

class Validator {
  constructor() {
    this.rules = new Map();
    this.customValidators = new Map();
    this.initDefaultValidators();
  }

  initDefaultValidators() {
    // Required validator
    this.addValidator('required', (value) => ({
      valid: value !== null && value !== undefined && value !== '',
      message: 'This field is required'
    }));

    // Email validator
    this.addValidator('email', (value) => ({
      valid: /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value),
      message: 'Please enter a valid email address'
    }));

    // Min length validator
    this.addValidator('min', (value, min) => ({
      valid: String(value).length >= min,
      message: `Must be at least ${min} characters`
    }));

    // Max length validator
    this.addValidator('max', (value, max) => ({
      valid: String(value).length <= max,
      message: `Must be no more than ${max} characters`
    }));

    // Numeric validator
    this.addValidator('numeric', (value) => ({
      valid: /^\d+$/.test(value),
      message: 'Must be a number'
    }));

    // Alpha validator
    this.addValidator('alpha', (value) => ({
      valid: /^[a-zA-Z]+$/.test(value),
      message: 'Must contain only letters'
    }));

    // Alphanumeric validator
    this.addValidator('alphanumeric', (value) => ({
      valid: /^[a-zA-Z0-9]+$/.test(value),
      message: 'Must contain only letters and numbers'
    }));

    // URL validator
    this.addValidator('url', (value) => ({
      valid: /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([/\w .-]*)*\/?$/.test(value),
      message: 'Please enter a valid URL'
    }));

    // Phone validator
    this.addValidator('phone', (value) => ({
      valid: /^\+?[\d\s-]{10,}$/.test(value),
      message: 'Please enter a valid phone number'
    }));

    // Date validator
    this.addValidator('date', (value) => ({
      valid: !isNaN(Date.parse(value)),
      message: 'Please enter a valid date'
    }));

    // Boolean validator
    this.addValidator('boolean', (value) => ({
      valid: typeof value === 'boolean',
      message: 'Must be true or false'
    }));

    // Array validator
    this.addValidator('array', (value) => ({
      valid: Array.isArray(value),
      message: 'Must be an array'
    }));

    // Object validator
    this.addValidator('object', (value) => ({
      valid: value && typeof value === 'object' && !Array.isArray(value),
      message: 'Must be an object'
    }));

    // JSON validator
    this.addValidator('json', (value) => {
      try {
        JSON.parse(value);
        return { valid: true };
      } catch (e) {
        return { valid: false, message: 'Must be valid JSON' };
      }
    });

    // UUID validator
    this.addValidator('uuid', (value) => ({
      valid: /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(value),
      message: 'Please enter a valid UUID'
    }));

    // IP validator
    this.addValidator('ip', (value) => ({
      valid: /^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/.test(value),
      message: 'Please enter a valid IP address'
    }));

    // Password strength validator
    this.addValidator('password', (value) => {
      const checks = {
        length: value.length >= 8,
        uppercase: /[A-Z]/.test(value),
        lowercase: /[a-z]/.test(value),
        number: /[0-9]/.test(value),
        special: /[!@#$%^&*]/.test(value)
      };
      
      const score = Object.values(checks).filter(Boolean).length;
      
      return {
        valid: score >= 4,
        score,
        checks,
        message: score >= 4 ? 'Strong password' : 
                 score >= 3 ? 'Medium password' : 'Weak password'
      };
    });

    // Match validator
    this.addValidator('match', (value, field, data) => ({
      valid: value === data[field],
      message: `Must match ${field}`
    }));
  }

  addValidator(name, fn) {
    this.customValidators.set(name, fn);
  }

  validate(data, schema) {
    const errors = {};
    let isValid = true;

    for (const [field, rules] of Object.entries(schema)) {
      const value = data[field];
      const fieldErrors = [];

      for (const rule of rules) {
        const [ruleName, ruleParam] = rule.split(':');
        const validator = this.customValidators.get(ruleName);

        if (validator) {
          const result = validator(value, ruleParam, data);
          if (!result.valid) {
            fieldErrors.push(result.message || `Validation failed for ${ruleName}`);
          }
        }
      }

      if (fieldErrors.length > 0) {
        errors[field] = fieldErrors;
        isValid = false;
      }
    }

    return { isValid, errors };
  }

  validateField(value, rules, data = {}) {
    const errors = [];

    for (const rule of rules) {
      const [ruleName, ruleParam] = rule.split(':');
      const validator = this.customValidators.get(ruleName);

      if (validator) {
        const result = validator(value, ruleParam, data);
        if (!result.valid) {
          errors.push(result.message || `Validation failed for ${ruleName}`);
        }
      }
    }

    return {
      valid: errors.length === 0,
      errors
    };
  }

  createValidator(schema) {
    return (data) => this.validate(data, schema);
  }

  sanitize(data, schema) {
    const sanitized = { ...data };

    for (const [field, rules] of Object.entries(schema)) {
      if (rules.includes('sanitize')) {
        if (typeof sanitized[field] === 'string') {
          sanitized[field] = sanitized[field].trim();
        }
      }
      if (rules.includes('escape')) {
        if (typeof sanitized[field] === 'string') {
          sanitized[field] = this.escapeHtml(sanitized[field]);
        }
      }
    }

    return sanitized;
  }

  escapeHtml(text) {
    const map = {
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#039;'
    };
    return text.replace(/[&<>"']/g, m => map[m]);
  }

  deepClone(obj) {
    return JSON.parse(JSON.stringify(obj));
  }

  isEmpty(value) {
    return value === null || value === undefined || value === '';
  }

  isEqual(a, b) {
    return JSON.stringify(a) === JSON.stringify(b);
  }
}

const validator = new Validator();
export default validator;
