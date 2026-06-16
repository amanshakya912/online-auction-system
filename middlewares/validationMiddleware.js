const { body, validationResult } = require('express-validator');

/**
 * Middleware to check validation results and return 400 with field-specific errors.
 * Error responses do NOT expose stack traces or internal details.
 */
const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const fieldErrors = errors.array().map(({ path, msg }) => ({
      field: path,
      message: msg,
    }));
    return res.status(400).json({ errors: fieldErrors });
  }
  next();
};

/**
 * Validates sign-up fields: firstName, lastName, userName, email, password.
 */
const validateSignUp = [
  body('firstName')
    .trim()
    .notEmpty()
    .withMessage('First name is required'),

  body('lastName')
    .trim()
    .notEmpty()
    .withMessage('Last name is required'),

  body('userName')
    .trim()
    .notEmpty()
    .withMessage('Username is required'),

  body('email')
    .trim()
    .notEmpty()
    .withMessage('Email is required')
    .isEmail()
    .withMessage('Email must be a valid email address')
    .normalizeEmail(),

  body('password')
    .notEmpty()
    .withMessage('Password is required')
    .isLength({ min: 8 })
    .withMessage('Password must be at least 8 characters'),

  handleValidationErrors,
];

/**
 * Validates sign-in fields: email and password presence.
 */
const validateSignIn = [
  body('email')
    .trim()
    .notEmpty()
    .withMessage('Email is required')
    .isEmail()
    .withMessage('Email must be a valid email address')
    .normalizeEmail(),

  body('password')
    .notEmpty()
    .withMessage('Password is required'),

  handleValidationErrors,
];

/**
 * Validates bid placement: bidAmount (positive number), productId (mongoId).
 */
const validateBid = [
  body('bidAmount')
    .notEmpty()
    .withMessage('Bid amount is required')
    .isFloat({ min: 0.01 })
    .withMessage('Bid amount must be a positive number'),

  body('productId')
    .notEmpty()
    .withMessage('Product ID is required')
    .isMongoId()
    .withMessage('Product ID must be a valid ID'),

  handleValidationErrors,
];

/**
 * Validates product creation/update fields.
 */
const validateProduct = [
  body('name')
    .trim()
    .notEmpty()
    .withMessage('Product name is required')
    .isLength({ max: 200 })
    .withMessage('Product name must not exceed 200 characters'),

  body('startingPrice')
    .notEmpty()
    .withMessage('Starting price is required')
    .isFloat({ min: 0.01 })
    .withMessage('Starting price must be a positive number'),

  body('buyNowPrice')
    .notEmpty()
    .withMessage('Buy now price is required')
    .isFloat({ min: 0.01 })
    .withMessage('Buy now price must be a positive number'),

  body('bidIncrement')
    .notEmpty()
    .withMessage('Bid increment is required')
    .isFloat({ min: 0.01 })
    .withMessage('Bid increment must be a positive number'),

  body('auctionEndTime')
    .notEmpty()
    .withMessage('Auction end time is required')
    .isISO8601()
    .withMessage('Auction end time must be a valid ISO 8601 date'),

  body('category')
    .trim()
    .notEmpty()
    .withMessage('Category is required'),

  handleValidationErrors,
];

/**
 * Validates shipping address fields: street, city, state, postalCode, country.
 */
const validateShippingAddress = [
  body('street')
    .trim()
    .notEmpty()
    .withMessage('Street is required')
    .isLength({ max: 200 })
    .withMessage('Street must not exceed 200 characters'),

  body('city')
    .trim()
    .notEmpty()
    .withMessage('City is required')
    .isLength({ max: 100 })
    .withMessage('City must not exceed 100 characters'),

  body('state')
    .trim()
    .notEmpty()
    .withMessage('State is required')
    .isLength({ max: 100 })
    .withMessage('State must not exceed 100 characters'),

  body('postalCode')
    .trim()
    .notEmpty()
    .withMessage('Postal code is required')
    .isLength({ max: 20 })
    .withMessage('Postal code must not exceed 20 characters'),

  body('country')
    .trim()
    .notEmpty()
    .withMessage('Country is required')
    .isLength({ max: 100 })
    .withMessage('Country must not exceed 100 characters'),

  handleValidationErrors,
];

/**
 * Sanitizes text fields by escaping HTML/script content.
 * Apply to any route that accepts free-form text to prevent XSS.
 */
const sanitizeText = [
  body('name').optional().trim().escape(),
  body('description').optional().trim().escape(),
  body('firstName').optional().trim().escape(),
  body('lastName').optional().trim().escape(),
  body('userName').optional().trim().escape(),
  body('street').optional().trim().escape(),
  body('city').optional().trim().escape(),
  body('state').optional().trim().escape(),
  body('postalCode').optional().trim().escape(),
  body('country').optional().trim().escape(),
];

module.exports = {
  handleValidationErrors,
  validateSignUp,
  validateSignIn,
  validateBid,
  validateProduct,
  validateShippingAddress,
  sanitizeText,
};
