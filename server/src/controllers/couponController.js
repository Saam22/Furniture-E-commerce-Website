import Coupon from '../models/Coupon.js';
import { ApiError } from '../utils/ApiError.js';
import { success } from '../utils/ApiResponse.js';

export async function getCoupons(req, res, next) {
  try {
    const coupons = await Coupon.find({ isActive: true }).lean();
    return success(res, { coupons });
  } catch (error) {
    next(error);
  }
}

export async function validateCoupon(req, res, next) {
  try {
    const { code, subtotal } = req.body;

    const coupon = await Coupon.findOne({ code: code.toUpperCase() });
    if (!coupon || !coupon.isValid(subtotal)) {
      throw ApiError.badRequest('Invalid or expired coupon');
    }

    let discount = 0;
    if (coupon.type === 'percent') discount = subtotal * (coupon.value / 100);
    else if (coupon.type === 'fixed') discount = coupon.value;

    return success(res, {
      valid: true,
      coupon: {
        code: coupon.code,
        type: coupon.type,
        value: coupon.value,
        discount: Math.round(discount),
        description: coupon.description,
      },
    });
  } catch (error) {
    next(error);
  }
}
