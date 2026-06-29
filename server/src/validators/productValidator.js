import { body } from 'express-validator';

export const createProductValidation = [
  body('name').trim().notEmpty().withMessage('Product name is required'),
  body('price').isNumeric().withMessage('Price must be a number').custom(v => v >= 0),
  body('image').trim().notEmpty().withMessage('Image URL is required'),
  body('category')
    .isIn(['غرف معيشة', 'غرف نوم', 'غرف طعام', 'مكاتب', 'ديكور'])
    .withMessage('Invalid category'),
  body('description').trim().notEmpty().withMessage('Description is required'),
];

export const updateProductValidation = [
  body('name').optional().trim().notEmpty(),
  body('price').optional().isNumeric(),
  body('category').optional().isIn(['غرف معيشة', 'غرف نوم', 'غرف طعام', 'مكاتب', 'ديكور']),
];
