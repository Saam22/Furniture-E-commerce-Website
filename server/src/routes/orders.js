import { Router } from 'express';
import { createOrder, getOrders, getOrder, cancelOrder } from '../controllers/orderController.js';
import { authenticate } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';
import { createOrderValidation } from '../validators/orderValidator.js';

const router = Router();

router.use(authenticate);

router.post('/', createOrderValidation, validate, createOrder);
router.get('/', getOrders);
router.get('/:id', getOrder);
router.put('/:id/cancel', cancelOrder);

export default router;
