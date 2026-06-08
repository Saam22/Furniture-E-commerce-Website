import { useEffect, useState } from 'react';
import '../styles/Cart.css';
import DiscountSection from './DiscountSection';
import DeliverySection from './DeliverySection';
import { calculateCartDiscounts } from '../utils/discountUtils';
import {
  getPointsBalance, calcEarnedPoints, redeemPoints, calcRedeemDiscount,
  MIN_REDEEM_POINTS, POINTS_REDEEM_RATE, isBirthdayMonth,
} from '../data/loyaltyData';
import '../styles/LoyaltyDashboard.css';

const Cart = ({ cartItems, onClose, removeFromCart, updateQuantity, clearCart, total, savings, appliedCoupon, onApplyCoupon, onRemoveCoupon, orderCount, onCheckout }) => {
  const [delivery, setDelivery] = useState({ zoneId: 'cairo', city: 'القاهرة', cost: 0, eta: null, freeShipping: false, express: false });
  const [redeemInput, setRedeemInput] = useState('');
  const [redeemError, setRedeemError] = useState('');
  const [redeemedDiscount, setRedeemedDiscount] = useState(null);
  const pointsBalance = getPointsBalance();
  const earnedPoints = calcEarnedPoints(total);
  const birthdayMultiplier = isBirthdayMonth() ? 2 : 1;

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = 'unset'; };
  }, []);

  const { discounts, totalDiscount, freeShipping: couponFree, finalTotal } = calculateCartDiscounts(total, appliedCoupon, orderCount);
  const freeShipping = couponFree || delivery.freeShipping || total >= 2000;
  const shippingCost = freeShipping ? 0 : delivery.cost;
  const pointsDiscount = redeemedDiscount?.discount || 0;
  const afterPoints = Math.max(finalTotal - pointsDiscount, 0);
  const grandTotal = afterPoints + shippingCost;

  const handleRedeem = () => {
    const pts = parseInt(redeemInput, 10);
    if (isNaN(pts) || pts < MIN_REDEEM_POINTS) {
      setRedeemError(`الحد الأدنى ${MIN_REDEEM_POINTS} نقطة`);
      return;
    }
    const result = redeemPoints(pts);
    if (result.ok) {
      setRedeemedDiscount(result);
      setRedeemInput('');
      setRedeemError('');
    } else {
      setRedeemError(result.error);
    }
  };

  const handleRemoveRedeem = () => {
    setRedeemedDiscount(null);
    setRedeemError('');
  };

  const handleCheckout = () => {
    onCheckout({
      delivery: {
        zoneId: delivery.zoneId,
        city: delivery.city,
        express: delivery.express,
        cost: shippingCost,
        freeShipping,
        eta: delivery.eta,
      },
      discountInfo: {
        discounts: redeemedDiscount
          ? [...discounts, { id: 'points', label: `خصم النقاط (${redeemedDiscount.pointsUsed} نقطة)`, value: redeemedDiscount.discount, type: 'points' }]
          : discounts,
        totalDiscount: totalDiscount + pointsDiscount,
        finalTotal: afterPoints,
      },
      grandTotal,
      earnedPoints: earnedPoints * birthdayMultiplier,
    });
  };

  return (
    <>
      <div className="cart-overlay" onClick={onClose}></div>

      <aside className="cart-sidebar">
        <div className="cart-header">
          <h2>سلة التسوق</h2>
          <button className="close-btn" onClick={onClose} aria-label="إغلاق">×</button>
        </div>

        {cartItems.length === 0 ? (
          <div className="empty-cart">
            <span className="empty-icon">◱</span>
            <h3>السلة فارغة</h3>
            <p>ابدأ بإضافة قطعة مناسبة لبيتك.</p>
            <button className="btn btn-primary" onClick={onClose}>تسوق الآن</button>
          </div>
        ) : (
          <>
            <div className="cart-body">
              <div className="cart-items">
                {cartItems.map((item) => (
                  <div key={item.id} className="cart-item">
                    <img src={item.image} alt={item.name} loading="lazy" width="88" height="88" />
                    <div className="cart-item-info">
                      <h4>{item.name}</h4>
                      <p className="item-category">{item.category}</p>
                      <div className="item-price-row">
                        <span className="item-price">{item.price?.toLocaleString() ?? '0'} ج.م</span>
                        {item.originalPrice && <span className="item-original-price">{item.originalPrice.toLocaleString()} ج.م</span>}
                      </div>
                      <div className="quantity-controls">
                        <button onClick={() => updateQuantity(item.id, item.quantity - 1)} disabled={item.quantity === 1}>−</button>
                        <span>{item.quantity}</span>
                        <button onClick={() => updateQuantity(item.id, item.quantity + 1)}>+</button>
                      </div>
                    </div>
                    <button className="remove-btn" onClick={() => removeFromCart(item.id)} title="حذف">×</button>
                  </div>
                ))}
              </div>

              <div className="cart-summary">
                <DiscountSection
                  subtotal={total}
                  appliedCoupon={appliedCoupon}
                  onApplyCoupon={onApplyCoupon}
                  onRemoveCoupon={onRemoveCoupon}
                  orderCount={orderCount}
                />

                {/* Points */}
                {earnedPoints > 0 && (
                  <div className="cart-points-earned">
                    <span className="points-star">✦</span>
                    <span>
                      ستربح <strong>{earnedPoints * birthdayMultiplier}</strong> نقطة{isBirthdayMonth() ? ' 🎂 (ضعف)' : ''} من هذا الطلب
                    </span>
                  </div>
                )}

                {pointsBalance >= MIN_REDEEM_POINTS && !redeemedDiscount && (
                  <div className="cart-points-redeem">
                    <div className="cart-points-redeem-header">
                      <h4>استبدال النقاط</h4>
                      <span className="cart-points-balance">الرصيد: {pointsBalance.toLocaleString()}</span>
                    </div>
                    <div className="cart-points-redeem-input">
                      <input
                        type="number"
                        placeholder={`الحد الأدنى ${MIN_REDEEM_POINTS} نقطة`}
                        value={redeemInput}
                        onChange={e => { setRedeemInput(e.target.value); setRedeemError(''); }}
                        min={MIN_REDEEM_POINTS}
                        max={pointsBalance}
                      />
                      <button onClick={handleRedeem} disabled={!redeemInput}>استبدال</button>
                    </div>
                    {redeemInput > 0 && (
                      <span style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>
                        خصم: {calcRedeemDiscount(parseInt(redeemInput) || 0).toLocaleString()} ج.م
                      </span>
                    )}
                    {redeemError && <span className="cart-points-error">{redeemError}</span>}
                  </div>
                )}

                {redeemedDiscount && (
                  <div className="cart-points-redeemed">
                    <span>✓ خصم النقاط: -{redeemedDiscount.discount.toLocaleString()} ج.م ({redeemedDiscount.pointsUsed} نقطة)</span>
                    <button onClick={handleRemoveRedeem}>إلغاء</button>
                  </div>
                )}

                <DeliverySection
                  total={total}
                  freeShipping={couponFree}
                  onDeliveryChange={setDelivery}
                />

                <div className="summary-row">
                  <span>المجموع الفرعي</span>
                  <span>{(total + savings).toLocaleString()} ج.م</span>
                </div>

                {savings > 0 && (
                  <div className="summary-row savings">
                    <span>التوفير</span>
                    <span>- {savings.toLocaleString()} ج.م</span>
                  </div>
                )}

                {discounts.map(d => (
                  <div key={d.id} className="summary-row savings">
                    <span>{d.label}</span>
                    <span>{d.value > 0 ? `- ${d.value.toLocaleString()} ج.م` : d.type === 'coupon' ? '✓ مفعل' : ''}</span>
                  </div>
                ))}

                {redeemedDiscount && (
                  <div className="summary-row savings">
                    <span>خصم النقاط ({redeemedDiscount.pointsUsed} نقطة)</span>
                    <span>- {redeemedDiscount.discount.toLocaleString()} ج.م</span>
                  </div>
                )}

                <div className="summary-row">
                  <span>الشحن</span>
                  <span>{freeShipping ? 'مجاني' : `${(shippingCost ?? 0).toLocaleString()} ج.م`}</span>
                </div>

                <div className="summary-total">
                  <span>الإجمالي</span>
                  <span>{grandTotal == null || isNaN(grandTotal) ? '0' : grandTotal.toLocaleString()} ج.م</span>
                </div>

                <button className="checkout-btn" onClick={handleCheckout}>إتمام الطلب</button>
                <button className="clear-cart-btn" onClick={clearCart}>تفريغ السلة</button>

                <div className="payment-methods">
                  <span>طرق دفع آمنة ومتعددة</span>
                  <div className="methods">
                    <span>Visa</span>
                    <span>Fawry</span>
                    <span>Pay</span>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}
      </aside>
    </>
  );
};

export default Cart;
