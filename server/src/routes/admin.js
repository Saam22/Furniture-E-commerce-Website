import { Router } from 'express';
import { getDashboard, getUsers, updateUserRole, getAllOrders, updateOrderStatus, createCoupon, updateCoupon } from '../controllers/adminController.js';
import { authenticate } from '../middleware/auth.js';
import { requireAdmin } from '../middleware/admin.js';

const router = Router();

router.use(authenticate, requireAdmin);

router.get('/dashboard', getDashboard);
router.get('/users', getUsers);
router.put('/users/:id/role', updateUserRole);
router.get('/orders', getAllOrders);
router.put('/orders/:id/status', updateOrderStatus);
router.post('/coupons', createCoupon);
router.put('/coupons/:id', updateCoupon);

export default router;
