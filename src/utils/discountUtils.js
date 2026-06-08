import { COUPONS, ACTIVE_OFFERS, LOYALTY_TIERS } from '../data/discountsData';

export function getActiveOffers(furnitureType) {
  const now = new Date();
  return ACTIVE_OFFERS.filter(o => {
    if (!o.startDate || !o.endDate) return false;
    const start = new Date(o.startDate);
    const end = new Date(o.endDate);
    end.setHours(23, 59, 59, 999);
    if (now < start || now > end) return false;
    if (furnitureType && o.furnitureTypes !== 'all') {
      if (!Array.isArray(o.furnitureTypes) || !o.furnitureTypes.includes(furnitureType)) return false;
    }
    return true;
  });
}

export function getAllActiveOffers() {
  const now = new Date();
  return ACTIVE_OFFERS.filter(o => {
    if (!o.startDate || !o.endDate) return false;
    const start = new Date(o.startDate);
    const end = new Date(o.endDate);
    end.setHours(23, 59, 59, 999);
    return now >= start && now <= end;
  });
}

export function getLoyaltyTier(orderCount) {
  let tier = LOYALTY_TIERS[0];
  for (const t of LOYALTY_TIERS) {
    if (orderCount >= t.minOrders) tier = t;
  }
  return tier;
}

export function getNextTier(orderCount) {
  for (const t of LOYALTY_TIERS) {
    if (orderCount < t.minOrders) return t;
  }
  return null;
}

export function validateCoupon(code, subtotal) {
  if (!code || !code.trim()) return { valid: false, error: 'يرجى إدخال كود الخصم' };
  const coupon = COUPONS.find(c => c.code === code.trim().toUpperCase());
  if (!coupon) return { valid: false, error: 'كود الخصم غير صالح' };
  if (coupon.minAmount > 0 && subtotal < coupon.minAmount) {
    return { valid: false, error: `الحد الأدنى للطلب: ${coupon.minAmount.toLocaleString()} ج.م` };
  }
  return { valid: true, coupon };
}

export function calculateCartDiscounts(subtotal, appliedCoupon, orderCount) {
  const discounts = [];
  let totalDiscount = 0;
  let freeShipping = false;

  const tier = getLoyaltyTier(orderCount);
  if (tier && tier.discount > 0) {
    const d = Math.round(subtotal * tier.discount / 100);
    discounts.push({ id: 'loyalty', label: `خصم الولاء (${tier.label})`, value: d, type: 'loyalty' });
    totalDiscount += d;
  }

  if (appliedCoupon) {
    const result = validateCoupon(appliedCoupon, subtotal);
    if (result.valid) {
      const coupon = result.coupon;
      if (coupon.type === 'freeshipping') {
        freeShipping = true;
        discounts.push({ id: `coupon_${coupon.code}`, label: `قسيمة ${coupon.code}: ${coupon.description}`, value: 0, type: 'coupon' });
      } else if (coupon.type === 'percent') {
        const d = Math.round(subtotal * coupon.value / 100);
        discounts.push({ id: `coupon_${coupon.code}`, label: `قسيمة ${coupon.code}: ${coupon.description}`, value: d, type: 'coupon' });
        totalDiscount += d;
      } else if (coupon.type === 'fixed') {
        discounts.push({ id: `coupon_${coupon.code}`, label: `قسيمة ${coupon.code}: ${coupon.description}`, value: coupon.value, type: 'coupon' });
        totalDiscount += coupon.value;
      }
    }
  }

  const finalTotal = Math.max(subtotal - totalDiscount, 0);
  return { discounts, totalDiscount, freeShipping, finalTotal, tier };
}
