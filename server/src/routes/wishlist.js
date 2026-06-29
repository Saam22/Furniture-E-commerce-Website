import { Router } from 'express';
import { getWishlist, toggleWishlist, clearWishlist, addAllToCart } from '../controllers/wishlistController.js';
import { authenticate } from '../middleware/auth.js';

const router = Router();

router.use(authenticate);

router.get('/', getWishlist);
router.post('/', toggleWishlist);
router.delete('/', clearWishlist);
router.post('/add-all-to-cart', addAllToCart);

export default router;
