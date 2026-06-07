import { useState } from 'react';
import { validateCoupon, getActiveOffers, getLoyaltyTier } from '../utils/discountUtils';
import '../styles/DiscountSection.css';

const DiscountSection = ({ subtotal, appliedCoupon, onApplyCoupon, onRemoveCoupon, orderCount, furnitureType }) => {
  const [code, setCode] = useState('');
  const [error, setError] = useState('');

  const activeOffers = getActiveOffers(furnitureType);
  const tier = getLoyaltyTier(orderCount);

  const handleApply = () => {
    const result = validateCoupon(code, subtotal);
    if (result.valid) {
      onApplyCoupon(result.coupon.code);
      setCode('');
      setError('');
    } else {
      setError(result.error);
    }
  };

  return (
    <div className="discount-section">
      {furnitureType && activeOffers.length > 0 && (
        <div className="offer-banners">
          {activeOffers.map(o => (
            <div key={o.id} className="offer-banner" style={{ borderColor: o.color }}>
              <div className="offer-badge" style={{ background: o.color }}>{o.badge}</div>
              <div className="offer-info">
                <span className="offer-title">{o.title}</span>
                <span className="offer-desc">{o.description}</span>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="coupon-section">
        <h4 className="coupon-title">قسيمة خصم</h4>
        {appliedCoupon ? (
          <div className="coupon-applied">
            <span className="coupon-code">✓ {appliedCoupon}</span>
            <button className="coupon-remove-btn" onClick={onRemoveCoupon}>إلغاء</button>
          </div>
        ) : (
          <>
            <div className="coupon-input-row">
              <input
                type="text"
                className="coupon-input"
                placeholder="أدخل كود الخصم"
                value={code}
                onChange={e => { setCode(e.target.value); setError(''); }}
                onKeyDown={e => e.key === 'Enter' && handleApply()}
              />
              <button className="coupon-apply-btn" onClick={handleApply}>تطبيق</button>
            </div>
            {error && <span className="coupon-error">{error}</span>}
          </>
        )}
      </div>

      {tier && (
        <div className="tier-info">
          <span className="tier-badge" style={{ background: tier.color, color: tier.id === 'gold' || tier.id === 'platinum' ? '#333' : '#fff' }}>
            {tier.label}
          </span>
          {tier.discount > 0 ? (
            <span className="tier-text">خصم ولاء {tier.discount}%</span>
          ) : (
            <span className="tier-text-next">اطلب {3 - orderCount} قطع إضافية لتحصل على خصم الولاء</span>
          )}
        </div>
      )}
    </div>
  );
};

export default DiscountSection;
