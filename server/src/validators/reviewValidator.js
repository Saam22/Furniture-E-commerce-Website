import { body } from 'express-validator';

export const createReviewValidation = [
  body('product').notEmpty().withMessage('Product ID is required').isMongoId(),
  body('rating')
    .notEmpty().withMessage('Rating is required')
    .isInt({ min: 1, max: 5 }).withMessage('Rating must be 1-5'),
  body('text')
    .trim()
    .notEmpty().withMessage('Review text is required')
    .isLength({ max: 500 }).withMessage('Review must be under 500 characters'),
  body('images')
    .optional()
    .isArray({ max: 3 }).withMessage('Maximum 3 images allowed'),
];
