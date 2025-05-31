import { body, param, query, validationResult } from 'express-validator';
import { Request, Response, NextFunction } from 'express';
import validator from 'validator';

// Custom validation middleware
export const handleValidationErrors = (req: Request, res: Response, next: NextFunction) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      error: 'Validation failed',
      details: errors.array()
    });
  }
  next();
};

// Common validation rules
export const validateEmail = body('email')
  .isEmail()
  .normalizeEmail()
  .withMessage('Valid email is required');

export const validatePassword = body('password')
  .isLength({ min: 8 })
  .withMessage('Password must be at least 8 characters')
  .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/)
  .withMessage('Password must contain uppercase, lowercase, number and special character');

export const validateName = (field: string) =>
  body(field)
    .trim()
    .isLength({ min: 1, max: 50 })
    .withMessage(`${field} must be 1-50 characters`)
    .matches(/^[a-zA-Z\s'-]+$/)
    .withMessage(`${field} contains invalid characters`);

export const validatePhoneNumber = body('phoneNumber')
  .optional()
  .custom((value) => {
    if (value && !validator.isMobilePhone(value, 'any')) {
      throw new Error('Invalid phone number format');
    }
    return true;
  });

export const validateId = (paramName: string = 'id') =>
  param(paramName)
    .isInt({ min: 1 })
    .withMessage(`${paramName} must be a positive integer`);

export const validateDate = (field: string) =>
  body(field)
    .optional()
    .isISO8601()
    .withMessage(`${field} must be a valid date`);

export const sanitizeText = (field: string, maxLength: number = 1000) =>
  body(field)
    .optional()
    .trim()
    .isLength({ max: maxLength })
    .withMessage(`${field} must be less than ${maxLength} characters`)
    .escape();

// File upload validation
export const validateFileUpload = (req: Request, res: Response, next: NextFunction) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No file uploaded' });
  }

  const allowedTypes = ['image/jpeg', 'image/png', 'application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
  const maxSize = 10 * 1024 * 1024; // 10MB

  if (!allowedTypes.includes(req.file.mimetype)) {
    return res.status(400).json({ error: 'Invalid file type' });
  }

  if (req.file.size > maxSize) {
    return res.status(400).json({ error: 'File too large' });
  }

  next();
};

// Profile validation chains
export const validateProfileUpdate = [
  validateName('firstName'),
  validateName('lastName'),
  body('dateOfBirth').optional().isISO8601().withMessage('Invalid date format'),
  body('phoneNumber').optional().isMobilePhone('any').withMessage('Invalid phone number'),
  body('country').optional().isAlpha().withMessage('Invalid country code'),
  sanitizeText('address1', 200),
  sanitizeText('city', 100),
  handleValidationErrors
];

export const validateApplicationSubmission = [
  validateId('programId'),
  body('intakePeriod').isIn(['Fall', 'Spring', 'Summer']).withMessage('Invalid intake period'),
  body('intakeYear').isInt({ min: new Date().getFullYear(), max: new Date().getFullYear() + 5 }),
  sanitizeText('personalStatement', 5000),
  handleValidationErrors
];