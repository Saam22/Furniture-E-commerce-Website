import { Router } from 'express';
import { register, login, getProfile, updateProfile, updatePassword, getLoyaltyInfo } from '../controllers/authController.js';
import { authenticate } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';
import { registerValidation, loginValidation, updateProfileValidation, updatePasswordValidation } from '../validators/authValidator.js';

const router = Router();

router.post('/register', registerValidation, validate, register);
router.post('/login', loginValidation, validate, login);
router.get('/profile', authenticate, getProfile);
router.put('/profile', authenticate, updateProfileValidation, validate, updateProfile);
router.put('/password', authenticate, updatePasswordValidation, validate, updatePassword);
router.get('/loyalty', authenticate, getLoyaltyInfo);

export default router;
