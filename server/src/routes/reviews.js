import { Router } from 'express';
import { getProductReviews, createReview, deleteReview } from '../controllers/reviewController.js';
import { authenticate, optionalAuth } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';
import { createReviewValidation } from '../validators/reviewValidator.js';

const router = Router();

router.get('/product/:productId', optionalAuth, getProductReviews);
router.post('/', authenticate, createReviewValidation, validate, createReview);
router.delete('/:id', authenticate, deleteReview);

export default router;
