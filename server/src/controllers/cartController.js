import Cart from '../models/Cart.js';
import Product from '../models/Product.js';
import Coupon from '../models/Coupon.js';
import { ApiError } from '../utils/ApiError.js';
import { success } from '../utils/ApiResponse.js';
import { FREE_SHIPPING_THRESHOLD, SHIPPING_ZONES, LOYALTY } from '../utils/constants.js';

export async function getCart(req, res, next) {
  try {
    let cart = await Cart.findOne({ user: req.user._id })
      .populate('items.product')
      .lean();

    if (!cart) {
      cart = { items: [], appliedCoupon: null };
    }

    const subtotal = cart.items.reduce((sum, item) => {
      if (!item.product) return sum;
      const price = item.product.discount
        ? item.product.price - (item.product.price * item.product.discount) / 100
        : item.product.price;
      return sum + price * item.quantity;
    }, 0);

    return success(res, { cart: { ...cart, subtotal } });
  } catch (error) {
    next(error);
  }
}

export async function addToCart(req, res, next) {
  try {
    const { productId, quantity = 1 } = req.body;

    const product = await Product.findById(productId);
    if (!product || !product.isActive) throw ApiError.notFound('Product not found');

    let cart = await Cart.findOne({ user: req.user._id });
    if (!cart) {
      cart = new Cart({ user: req.user._id, items: [] });
    }

    const existingItem = cart.items.find(
      item => item.product.toString() === productId
    );

    if (existingItem) {
      existingItem.quantity += quantity;
    } else {
      cart.items.push({ product: productId, quantity });
    }

    await cart.save();

    const populated = await Cart.findById(cart._id)
      .populate('items.product')
      .lean();

    return success(res, { cart: populated }, 'Added to cart');
  } catch (error) {
    next(error);
  }
}

export async function updateCartItem(req, res, next) {
  try {
    const { productId, quantity } = req.body;

    const cart = await Cart.findOne({ user: req.user._id });
    if (!cart) throw ApiError.notFound('Cart not found');

    const item = cart.items.find(i => i.product.toString() === productId);
    if (!item) throw ApiError.notFound('Item not in cart');

    if (quantity <= 0) {
      cart.items.pull({ product: productId });
    } else {
      item.quantity = quantity;
    }

    await cart.save();

    const populated = await Cart.findById(cart._id)
      .populate('items.product')
      .lean();

    return success(res, { cart: populated }, 'Cart updated');
  } catch (error) {
    next(error);
  }
}

export async function removeFromCart(req, res, next) {
  try {
    const { productId } = req.params;

    const cart = await Cart.findOne({ user: req.user._id });
    if (!cart) throw ApiError.notFound('Cart not found');

    cart.items.pull({ product: productId });
    await cart.save();

    const populated = await Cart.findById(cart._id)
      .populate('items.product')
      .lean();

    return success(res, { cart: populated }, 'Removed from cart');
  } catch (error) {
    next(error);
  }
}

export async function clearCart(req, res, next) {
  try {
    await Cart.deleteOne({ user: req.user._id });
    return success(res, { cart: { items: [], subtotal: 0 } }, 'Cart cleared');
  } catch (error) {
    next(error);
  }
}

export async function applyCoupon(req, res, next) {
  try {
    const { code } = req.body;

    const cart = await Cart.findOne({ user: req.user._id }).populate('items.product');
    if (!cart) throw ApiError.notFound('Cart is empty');

    const subtotal = await cart.calcTotal();

    const coupon = await Coupon.findOne({ code: code.toUpperCase() });
    if (!coupon || !coupon.isValid(subtotal)) {
      throw ApiError.badRequest('Invalid or expired coupon');
    }

    cart.appliedCoupon = { code: coupon.code, discount: 0 };
    await cart.save();

    return success(res, { coupon }, 'Coupon applied');
  } catch (error) {
    next(error);
  }
}

export async function removeCoupon(req, res, next) {
  try {
    const cart = await Cart.findOne({ user: req.user._id });
    if (cart) {
      cart.appliedCoupon = null;
      await cart.save();
    }
    return success(res, null, 'Coupon removed');
  } catch (error) {
    next(error);
  }
}

export async function getCartSummary(req, res, next) {
  try {
    const cart = await Cart.findOne({ user: req.user._id })
      .populate('items.product')
      .lean();

    if (!cart || cart.items.length === 0) {
      return success(res, { summary: { items: 0, subtotal: 0 } });
    }

    const items = cart.items.filter(i => i.product);

    let subtotal = items.reduce((sum, item) => {
      const price = item.product.discount
        ? item.product.price - (item.product.price * item.product.discount) / 100
        : item.product.price;
      return sum + price * item.quantity;
    }, 0);

    let couponDiscount = 0;
    let freeShipping = false;

    if (cart.appliedCoupon?.code) {
      const coupon = await Coupon.findOne({ code: cart.appliedCoupon.code });
      if (coupon?.isValid(subtotal)) {
        if (coupon.type === 'percent') couponDiscount = subtotal * (coupon.value / 100);
        else if (coupon.type === 'fixed') couponDiscount = coupon.value;
        else if (coupon.type === 'freeshipping') freeShipping = true;
      }
    }

    const shipping = freeShipping || subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : 40;

    return success(res, {
      summary: {
        items: items.length,
        subtotal: Math.round(subtotal),
        couponDiscount: Math.round(couponDiscount),
        shipping,
        freeShipping: freeShipping || subtotal >= FREE_SHIPPING_THRESHOLD,
        total: Math.round(subtotal - couponDiscount + shipping),
        pointsEarned: Math.floor(subtotal / LOYALTY.pointsPerEgp),
      },
    });
  } catch (error) {
    next(error);
  }
}
