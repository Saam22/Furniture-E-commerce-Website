import Order from '../models/Order.js';
import Product from '../models/Product.js';
import User from '../models/User.js';
import Cart from '../models/Cart.js';
import Coupon from '../models/Coupon.js';
import { ApiError } from '../utils/ApiError.js';
import { success, created } from '../utils/ApiResponse.js';
import { FREE_SHIPPING_THRESHOLD, LOYALTY, SHIPPING_ZONES } from '../utils/constants.js';

export async function createOrder(req, res, next) {
  try {
    const { shipping, paymentMethod = 'stripe', notes, couponCode, redeemPoints } = req.body;
    const userId = req.user._id;

    const cart = await Cart.findOne({ user: userId }).populate('items.product');
    if (!cart || cart.items.length === 0) throw ApiError.badRequest('Cart is empty');

    const user = await User.findById(userId);
    let subtotal = 0;
    const orderItems = [];

    for (const item of cart.items) {
      const product = item.product;
      if (!product.isActive || product.stockCount < item.quantity) {
        throw ApiError.badRequest(`"${product.name}" is out of stock`);
      }

      const price = product.discount
        ? product.price - (product.price * product.discount) / 100
        : product.price;

      subtotal += price * item.quantity;
      orderItems.push({
        product: product._id,
        name: product.name,
        price,
        quantity: item.quantity,
        image: product.image,
      });
    }

    const zone = SHIPPING_ZONES.find(z => z.id === shipping?.zoneId);
    if (!zone) throw ApiError.badRequest('Invalid shipping zone');

    const shippingCost = shipping?.express ? zone.expressRate : zone.standardRate;
    const freeShipping = subtotal >= FREE_SHIPPING_THRESHOLD;

    let totalDiscount = 0;
    let couponDiscount = 0;
    let pointsDiscount = 0;

    if (couponCode) {
      const coupon = await Coupon.findOne({ code: couponCode.toUpperCase() });
      if (!coupon || !coupon.isValid(subtotal)) {
        throw ApiError.badRequest('Invalid or expired coupon');
      }
      if (coupon.type === 'percent') couponDiscount = subtotal * (coupon.value / 100);
      else if (coupon.type === 'fixed') couponDiscount = coupon.value;
      else if (coupon.type === 'freeshipping') couponDiscount = 0; // handled below
      totalDiscount += couponDiscount;
      coupon.usedCount += 1;
      await coupon.save();
    }

    if (redeemPoints) {
      const maxDiscount = Math.min(redeemPoints * LOYALTY.pointsRedeemRate, subtotal - totalDiscount);
      if (user.points < redeemPoints || redeemPoints < LOYALTY.minRedeemPoints) {
        throw ApiError.badRequest('Invalid points redemption');
      }
      pointsDiscount = maxDiscount;
      totalDiscount += pointsDiscount;
      user.points -= redeemPoints;
      user.pointsHistory.push({ amount: -redeemPoints, reason: 'Points redeemed for order' });
      await user.save();
    }

    const finalShipping = (couponCode && freeShipping) ? 0 : shippingCost;
    const grandTotal = subtotal - totalDiscount + finalShipping;
    const pointsEarned = Math.floor(subtotal / LOYALTY.pointsPerEgp);
    const isBirthdayMonth = user.birthday?.month === new Date().getMonth() + 1;
    const finalPoints = isBirthdayMonth ? pointsEarned * LOYALTY.birthdayMultiplier : pointsEarned;

    const order = await Order.create({
      user: userId,
      items: orderItems,
      subtotal,
      shipping: {
        zoneId: shipping.zoneId,
        city: shipping.city,
        cost: finalShipping,
        express: shipping.express || false,
        eta: shipping.express ? zone.etaExpress : zone.etaStandard,
        address: shipping.address || '',
        phone: shipping.phone || '',
      },
      discounts: {
        coupon: couponCode ? { code: couponCode, amount: couponDiscount } : undefined,
        loyalty: redeemPoints ? { points: redeemPoints, amount: pointsDiscount } : undefined,
        totalDiscount,
      },
      grandTotal,
      pointsEarned: finalPoints,
      paymentMethod,
      notes,
    });

    for (const item of cart.items) {
      await Product.findByIdAndUpdate(item.product._id, {
        $inc: { stockCount: -item.quantity },
      });
    }

    user.points += finalPoints;
    user.orderCount += 1;
    user.pointsHistory.push({ amount: finalPoints, reason: `Points from order ${order.orderId}` });

    if (user.referredBy && user.orderCount === 1) {
      user.points += LOYALTY.referralBonusPoints;
      user.pointsHistory.push({ amount: LOYALTY.referralBonusPoints, reason: 'Referral bonus' });
    }

    await user.save();
    await Cart.deleteOne({ user: userId });

    return created(res, { order }, 'Order created successfully');
  } catch (error) {
    next(error);
  }
}

export async function getOrders(req, res, next) {
  try {
    const { page = 1, limit = 10 } = req.query;
    const query = { user: req.user._id };

    const total = await Order.countDocuments(query);
    const orders = await Order.find(query)
      .sort({ createdAt: -1 })
      .skip((Number(page) - 1) * Number(limit))
      .limit(Number(limit))
      .lean();

    return res.json({
      success: true,
      data: orders,
      pagination: { page: Number(page), limit: Number(limit), total, pages: Math.ceil(total / Number(limit)) },
    });
  } catch (error) {
    next(error);
  }
}

export async function getOrder(req, res, next) {
  try {
    const order = await Order.findOne({ _id: req.params.id, user: req.user._id }).lean();
    if (!order) throw ApiError.notFound('Order not found');
    return success(res, { order });
  } catch (error) {
    next(error);
  }
}

export async function cancelOrder(req, res, next) {
  try {
    const order = await Order.findOne({ _id: req.params.id, user: req.user._id });
    if (!order) throw ApiError.notFound('Order not found');
    if (!['pending', 'confirmed'].includes(order.status)) {
      throw ApiError.badRequest('Order cannot be cancelled at this stage');
    }

    order.status = 'cancelled';
    await order.save();

    for (const item of order.items) {
      await Product.findByIdAndUpdate(item.product, { $inc: { stockCount: item.quantity } });
    }

    return success(res, { order }, 'Order cancelled');
  } catch (error) {
    next(error);
  }
}
