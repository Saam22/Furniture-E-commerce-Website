import { Router } from 'express';
import { getCoupons, validateCoupon } from '../controllers/couponController.js';
import { authenticate } from '../middleware/auth.js';

const router = Router();

router.get('/', authenticate, getCoupons);
router.post('/validate', authenticate, validateCoupon);

export default router;
