import { body } from 'express-validator';

export const createOrderValidation = [
  body('shipping.zoneId').notEmpty().withMessage('Shipping zone is required'),
  body('shipping.city').notEmpty().withMessage('City is required'),
  body('shipping.address').notEmpty().withMessage('Address is required'),
  body('shipping.phone').notEmpty().withMessage('Phone is required'),
  body('paymentMethod').optional().isIn(['stripe', 'cod']).withMessage('Invalid payment method'),
];
