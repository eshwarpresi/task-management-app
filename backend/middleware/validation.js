const { body, validationResult } = require('express-validator');

const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ 
      error: 'Validation failed', 
      details: errors.array() 
    });
  }
  next();
};

const registerValidation = [
  body('email').isEmail().normalizeEmail(),
  body('password').isLength({ min: 6 }),
  handleValidationErrors
];

const loginValidation = [
  body('email').isEmail().normalizeEmail(),
  body('password').exists(),
  handleValidationErrors
];

const taskValidation = [
  body('title').notEmpty().trim().isLength({ min: 1, max: 255 }),
  body('description').optional().trim(),
  body('status').isIn(['pending', 'in-progress', 'completed']).optional(),
  handleValidationErrors
];

module.exports = {
  registerValidation,
  loginValidation,
  taskValidation
};